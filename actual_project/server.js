import http from 'node:http';
import { createReadStream, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');
const port = Number(process.env.PORT || 3000);
const host = process.env.RENDER ? '0.0.0.0' : (process.env.HOST || '127.0.0.1');
const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml'
};

function loadEnv(){
  const envPath = path.join(__dirname, '.env');
  if(!existsSync(envPath)) return;

  const text = readFileSync(envPath, 'utf8');
  for(const line of text.split(/\r?\n/)){
    const trimmed = line.trim();
    if(!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if(separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
    if(key && !process.env[key]) process.env[key] = value;
  }
}

function sendJson(res, status, data){
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

async function readBody(req){
  let body = '';
  for await (const chunk of req) body += chunk;
  return JSON.parse(body || '{}');
}

function buildSystemPrompt(profile, planner, courses){
  return `You are Lairos Pathfinder, a practical AI coach inside a student success website.
If the user asks who made, built, created, coded, developed, or designed this website/app, say exactly: Lairos Pathfinder was made by SAR.
Help the student make calm, concrete decisions about school planning, GPA, research, health routines, goals, college/career direction, and money-smart choices.
Keep answers concise, encouraging, and action-oriented. Prefer numbered steps or short checklists when useful.
Do not claim you changed app data unless the user explicitly says they will update it.
For medical, legal, or financial decisions, give general education and encourage asking a trusted professional.

Student profile:
${JSON.stringify(profile || {}, null, 2)}

Current planner:
${JSON.stringify(planner || [], null, 2)}

Current courses:
${JSON.stringify(courses || [], null, 2)}`;
}

function isCreatorQuestion(message){
  const normalized = message.toLowerCase();
  const questionWords = /\b(who|whom|what)\b/.test(normalized) || normalized.includes("tell me");
  const creatorWords = /\b(made|make|built|build|created|create|coded|code|programmed|developed|developer|designed|design|author)\b/.test(normalized);
  const targetWords = /\b(you|this|app|website|site|lairos|pathfinder)\b/.test(normalized);
  return questionWords && creatorWords && targetWords;
}

async function handleChat(req, res){
  if(!process.env.GEMINI_API_KEY){
    sendJson(res, 500, { error: 'Missing GEMINI_API_KEY in actual_project/.env.' });
    return;
  }

  try {
    const { message, history = [], profile, planner, courses } = await readBody(req);
    if(!message || typeof message !== 'string'){
      sendJson(res, 400, { error: 'Message is required.' });
      return;
    }

    if(isCreatorQuestion(message)){
      sendJson(res, 200, { reply: 'Lairos Pathfinder was made by SAR.' });
      return;
    }

    const contents = history.map((item)=>({
      role: item.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(item.text || '') }]
    })).filter((item)=> item.parts[0].text);

    if(!contents.length || contents.at(-1).parts[0].text !== message){
      contents.push({ role: 'user', parts: [{ text: message }] });
    }

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: buildSystemPrompt(profile, planner, courses) }]
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 700
        }
      })
    });

    const data = await geminiResponse.json();
    if(!geminiResponse.ok){
      const message = data?.error?.message || 'Gemini API request failed.';
      sendJson(res, geminiResponse.status, { error: message });
      return;
    }

    const reply = data?.candidates?.[0]?.content?.parts?.map((part)=> part.text || '').join('').trim();
    sendJson(res, 200, { reply });
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Unexpected server error.' });
  }
}

async function serveStatic(req, res){
  const rawPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const normalizedPath = rawPath === '/' ? '/index.html' : rawPath;
  const requestedPath = path.normalize(normalizedPath).replace(/^(\.\.[/\\])+/, '');
  const baseDir = requestedPath.startsWith('/js/') || requestedPath.startsWith('/styles/')
    ? __dirname
    : publicDir;
  const filePath = path.join(baseDir, requestedPath);

  if(!filePath.startsWith(baseDir)){
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if(!existsSync(filePath)){
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  createReadStream(filePath).pipe(res);
}

loadEnv();

const server = http.createServer((req, res)=>{
  if(req.url === '/api/chat' && req.method === 'POST'){
    handleChat(req, res);
    return;
  }

  if(req.method === 'GET'){
    serveStatic(req, res);
    return;
  }

  res.writeHead(405);
  res.end('Method not allowed');
});

server.listen(port, host, ()=>{
  console.log(`Lairos Pathfinder running at http://${host}:${port}`);
});
