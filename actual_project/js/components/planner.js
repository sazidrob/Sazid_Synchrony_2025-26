import { Store } from "../state.js";

export default async function Planner(){
  const el = document.createElement('div');
  el.className = 'grid grid-2';
  const list = document.createElement('section'); list.className = 'card';
  list.innerHTML = `<h3>Your Week</h3>
  <div id="items"></div>
  <div style="display:flex;gap:8px;margin-top:10px">
    <input id="newTask" class="input" placeholder="Add task…" />
    <button id="addBtn" class="button">Add</button>
  </div>`;

  const render = ()=>{
    const wrap = list.querySelector('#items');
    wrap.innerHTML = '';
    Store.planner.forEach(p=>{
      const row = document.createElement('div'); row.className = 'list-row';
      row.innerHTML = `<span>${p.text}</span>`;
      const right = document.createElement('div'); right.style.display='flex'; right.style.gap='6px';
      const tgl = document.createElement('button'); tgl.className='button ghost'; tgl.textContent = p.done? 'Undo':'Done';
      tgl.onclick = ()=>{ p.done = !p.done; render(); };
      const del = document.createElement('button'); del.className='button ghost'; del.textContent='Delete';
      del.onclick=()=>{ Store.planner = Store.planner.filter(x=>x.id!==p.id); render(); };
      right.appendChild(tgl); right.appendChild(del); row.appendChild(right); wrap.appendChild(row);
    });
  };

  list.querySelector('#addBtn').onclick = ()=>{
    const inp = list.querySelector('#newTask'); if (!inp.value.trim()) return;
    Store.planner.push({ id: Date.now(), text: inp.value.trim(), done:false });
    inp.value=''; render();
  };

  render();
  el.appendChild(list);

  const tips = document.createElement('section'); tips.className='card';
  tips.innerHTML = `<h3>AI Nudge</h3><p>Batch similar tasks (e.g., emails) for 20 minutes to keep momentum.</p>`;
  el.appendChild(tips);
  return el;
}
