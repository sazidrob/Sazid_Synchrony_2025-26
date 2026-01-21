import { Store } from "../state.js";

export default async function Dashboard(){
  const el = document.createElement('div');
  el.className = 'grid grid-3';
  el.innerHTML = `
    <section class="card">
      <h3>Planner Summary</h3>
      ${Store.planner.map(p=>`<div class="list-row"><span>${p.text}</span><span class="tag">${p.done?"Done":"Todo"}</span></div>`).join('')}
    </section>
    <section class="card">
      <h3>AI Insight</h3>
      <p>Hey ${Store.user.name.split(' ')[0]}, try focusing on <strong>3 high-priority tasks</strong> each day. Keep sessions short (25m) + breaks (5m).</p>
    </section>
    <section class="card">
      <h3>Progress</h3>
      <p>Courses this term: ${Store.courses.length}</p>
      <div style="height:10px;border-radius:999px;background:#ffffff21;overflow:hidden"><div style="width:68%;height:100%;background:var(--accent)"></div></div>
    </section>`;
  return el;
}
