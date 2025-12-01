export default async function Research(){
  const el = document.createElement('section'); el.className='card';
  el.innerHTML = `<h3>Research</h3>
  <p>Use this space to jot ideas for colleges, careers, and scholarships. (Future: integrate web search + saving).</p>
  <textarea class="input" rows="8" placeholder="Notes…"></textarea>`;
  return el;
}
