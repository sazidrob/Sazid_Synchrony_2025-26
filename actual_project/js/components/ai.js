export default async function AI(){
  const el = document.createElement('div'); el.className='grid grid-2';
  const thread = document.createElement('section'); thread.className='card';
  thread.innerHTML = `<h3>AI Chat</h3>
    <div id="msgs" style="display:flex;flex-direction:column;gap:8px;min-height:240px"></div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <input id="input" class="input" placeholder="Type a message..." />
      <button id="send" class="button">Send</button>
    </div>`;
  el.appendChild(thread);

  const msgs = thread.querySelector('#msgs');
  function bubble(text, me=false){
    const b = document.createElement('div'); b.className='list-row';
    b.style.alignSelf = me? 'end':'start'; b.style.maxWidth = '80%';
    b.textContent = text; msgs.appendChild(b); msgs.scrollTop = msgs.scrollHeight;
  }
  bubble('How can I balance my study schedule?');
  bubble('Try focusing on 3 high-priority tasks each day. Keep sessions short (25m) + breaks (5m).');

  thread.querySelector('#send').onclick = ()=>{
    const inp = thread.querySelector('#input'); if(!inp.value.trim()) return; bubble(inp.value.trim(), true); inp.value='';
    setTimeout(()=> bubble('Got it. I added that to your Planner.'), 400);
  };

  const tip = document.createElement('section'); tip.className='card';
  tip.innerHTML = `<h3>Tip</h3><p>Later, connect to real LLM backend. For now this is a local demo thread.</p>`;
  el.appendChild(tip);
  return el;
}
