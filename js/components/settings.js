import { Store } from "../state.js";

export default async function Settings(){
  const el = document.createElement('div'); el.className='grid grid-2';
  const a = document.createElement('section'); a.className='card';
  a.innerHTML = `<h3>Appearance</h3>
    <div class="list-row"><span>Theme</span>
      <div style="display:flex;gap:6px">
        <button id="dark" class="button ${Store.theme==='dark'?'':'ghost'}">Dark</button>
        <button id="light" class="button ${Store.theme==='light'?'':'ghost'}">Light</button>
      </div>
    </div>`;
  a.querySelector('#dark').onclick = ()=>{ Store.setTheme('dark'); render(); };
  a.querySelector('#light').onclick = ()=>{ Store.setTheme('light'); render(); };
  function render(){
    a.querySelector('#dark').className = 'button ' + (Store.theme==='dark'?'':'ghost');
    a.querySelector('#light').className = 'button ' + (Store.theme==='light'?'':'ghost');
  }
  render();

  const b = document.createElement('section'); b.className='card';
  b.innerHTML = `<h3>Account</h3>
    <p>Signed in as <strong>${Store.user.name}</strong></p>
    <button class="button ghost">Manage Account</button>`;

  el.appendChild(a); el.appendChild(b); return el;
}
