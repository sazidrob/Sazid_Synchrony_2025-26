export default async function Goals(){
  const el = document.createElement('section'); el.className='card';
  el.innerHTML = `<h3>Goals</h3>
  <p>Quarterly goals tied to interests (sports, gaming, social). Keep them specific, measurable, achievable.</p>
  <ul>
    <li>Build a simple game prototype and publish it.</li>
    <li>Shadow a local sports physio to explore careers.</li>
    <li>Apply to 3 scholarships this month.</li>
  </ul>`;
  return el;
}
