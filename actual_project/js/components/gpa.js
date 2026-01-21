import { Store } from "../state.js";

const GRADE_POINTS = { 'A+':4.0, 'A':4.0, 'A-':3.7, 'B+':3.3, 'B':3.0, 'B-':2.7, 'C+':2.3, 'C':2.0, 'C-':1.7, 'D':1.0, 'F':0 };

export default async function GPA(){
  const el = document.createElement('div'); el.className='grid';
  const card = document.createElement('section'); card.className='card';
  card.innerHTML = `<h3>GPA Score</h3>
    <div id="rows"></div>
    <button class="button" id="calc">Calculate</button>
    <p id="out" style="margin-top:8px"></p>`;

  const rows = card.querySelector('#rows');
  function row(course){
    const wrap = document.createElement('div'); wrap.className='grid grid-3';
    wrap.innerHTML = `
      <input class="input" placeholder="Course" value="${course?.name||''}">
      <input class="input" type="number" placeholder="Credits" value="${course?.credits||''}">
      <select class="input">
        ${Object.keys(GRADE_POINTS).map(g=>`<option ${course?.grade===g?'selected':''}>${g}</option>`).join('')}
      </select>`;
    rows.appendChild(wrap);
  }

  Store.courses.forEach(c=>row(c));
  row(); // blank row

  card.querySelector('#calc').onclick = ()=>{
    const r = Array.from(rows.children).map(w=>{
      const inputs = w.querySelectorAll('.input');
      const c = inputs[0], cr = inputs[1], g = inputs[2];
      return { name:c.value, credits: Number(cr.value||0), grade: g.value };
    }).filter(x=>x.credits>0);
    const pts = r.reduce((s,x)=> s + (GRADE_POINTS[x.grade]||0)*x.credits, 0);
    const creds = r.reduce((s,x)=> s + x.credits, 0);
    const gpa = creds? (pts/creds).toFixed(2): '0.00';
    card.querySelector('#out').textContent = `Your GPA is ${gpa}`;
  };

  el.appendChild(card); return el;
}
