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
    <p class="tag">${Store.activeEmail}</p>
    <div class="grid" style="margin-top:10px">
      <input id="name" class="input" value="${Store.user.name || ''}" placeholder="Name">
      <input id="status" class="input" value="${Store.user.status || ''}" placeholder="Status">
      <input id="interests" class="input" value="${(Store.user.interests || []).join(', ')}" placeholder="Interests">
      <button id="saveProfile" class="button">Save Profile</button>
    </div>`;

  b.querySelector('#saveProfile').onclick = async ()=>{
    Store.user.name = b.querySelector('#name').value.trim() || Store.user.name;
    Store.user.status = b.querySelector('#status').value.trim();
    Store.user.interests = b.querySelector('#interests').value.split(',').map((item)=>item.trim()).filter(Boolean);
    await Store.save();
    b.querySelector('#saveProfile').textContent = 'Saved';
    setTimeout(()=> b.querySelector('#saveProfile').textContent = 'Save Profile', 900);
  };

  el.appendChild(a); el.appendChild(b); return el;
}
