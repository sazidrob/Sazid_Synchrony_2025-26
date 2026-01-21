export default async function Health(){
  const el = document.createElement('section'); el.className='card';
  el.innerHTML = `<h3>Health</h3>
  <p>Quick check-in: Sleep 7–9h, move 20m, hydrate. Track habits (future feature).</p>
  <div class="grid grid-3">
    <label><input type="checkbox"> Slept 7h+</label>
    <label><input type="checkbox"> Moved 20m</label>
    <label><input type="checkbox"> Hydrated</label>
  </div>`;
  return el;
}
