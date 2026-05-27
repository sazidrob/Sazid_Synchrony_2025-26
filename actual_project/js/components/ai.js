import { Store } from '../state.js';

export default async function AI(){
  const el = document.createElement('div'); el.className='grid grid-2 ai-chat-grid';
  const thread = document.createElement('section'); thread.className='card';
  thread.innerHTML = `<h3>AI Chat</h3>
    <div id="msgs" class="chat-messages"></div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <input id="input" class="input" placeholder="Ask about classes, money, goals, health, or college..." />
      <button id="send" class="button">Send</button>
    </div>`;
  el.appendChild(thread);

  const msgs = thread.querySelector('#msgs');
  const input = thread.querySelector('#input');
  const send = thread.querySelector('#send');
  const history = [];

  function bubble(text, me=false){
    const b = document.createElement('div');
    b.className = `list-row chat-bubble ${me ? 'chat-bubble-user' : 'chat-bubble-ai'}`;
    b.style.alignSelf = me? 'end':'start'; b.style.maxWidth = '80%';

    const textEl = document.createElement('span');
    textEl.className = 'chat-text';
    textEl.textContent = text;
    b.appendChild(textEl);

    if(!me){
      const speak = document.createElement('button');
      speak.className = 'speak-btn';
      speak.type = 'button';
      speak.title = 'Read aloud';
      speak.setAttribute('aria-label', 'Read aloud');
      speak.textContent = '🔊';
      speak.onclick = ()=> speakText(textEl.textContent, speak);
      b.appendChild(speak);
    }

    msgs.appendChild(b); msgs.scrollTop = msgs.scrollHeight;
    return b;
  }

  function updateBubbleText(bubbleEl, text){
    const textEl = bubbleEl.querySelector('.chat-text');
    if(textEl) textEl.textContent = text;
  }

  function speakText(text, button){
    if(!('speechSynthesis' in window)){
      button.textContent = 'No audio';
      setTimeout(()=> button.textContent = '🔊', 1200);
      return;
    }

    if(window.speechSynthesis.speaking){
      window.speechSynthesis.cancel();
      document.querySelectorAll('.speak-btn').forEach((btn)=> btn.textContent = '🔊');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    button.textContent = '■';
    utterance.onend = ()=> button.textContent = '🔊';
    utterance.onerror = ()=> button.textContent = '🔊';
    window.speechSynthesis.speak(utterance);
  }

  bubble('Hey, I am your Lairos Pathfinder coach. Ask me for a study plan, GPA help, research ideas, health check-in, or money-smart next step.');

  async function askGemini(){
    const message = input.value.trim();
    if(!message || send.disabled) return;

    bubble(message, true);
    history.push({ role: 'user', text: message });
    input.value = '';
    input.focus();
    send.disabled = true;
    send.textContent = 'Thinking...';
    const pending = bubble('Thinking...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: history.slice(-10),
          profile: Store.user,
          planner: Store.planner,
          courses: Store.courses
        })
      });

      const data = await response.json();
      if(!response.ok) throw new Error(data.error || 'Gemini request failed.');

      const reply = data.reply || 'I could not find a helpful answer for that yet.';
      updateBubbleText(pending, reply);
      history.push({ role: 'model', text: reply });
    } catch (error) {
      updateBubbleText(pending, `${error.message} Check that the local server is running and GEMINI_API_KEY is set.`);
    } finally {
      send.disabled = false;
      send.textContent = 'Send';
    }
  }

  send.onclick = askGemini;
  input.addEventListener('keydown', (event)=>{
    if(event.key === 'Enter') askGemini();
  });

  const tip = document.createElement('section'); tip.className='card';
  tip.innerHTML = `<h3>Built For</h3>
    <p>Personalized student support across planning, GPA strategy, research, wellness, goals, and practical financial choices.</p>
    <p class="tag">Runs through Gemini on your local backend</p>`;
  el.appendChild(tip);
  return el;
}
