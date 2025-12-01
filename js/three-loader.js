// Basic Three.js-powered loading screen.
// You don't need to know a ton of Three.js yet – this just sets up a scene
// with a spinning wireframe shape and some stars in the background.

export function mountLoader(onDone){
  const root = document.getElementById("loader-root");
  root.innerHTML = "";
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = 0;
  overlay.style.backdropFilter = "blur(6px)";
  overlay.style.zIndex = 1000;
  root.appendChild(overlay);

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.inset = 0;
  overlay.appendChild(container);

  const ui = document.createElement("div");
  ui.className = "card";
  ui.style.position = "absolute";
  ui.style.left = "50%"; ui.style.top = "55%"; ui.style.transform = "translate(-50%,-50%)";
  ui.style.width = "min(480px, 92vw)";
  ui.innerHTML = `<h3>Booting the Nameless Student AI…</h3>
    <div style="height:12px;border-radius:999px;background:#ffffff21;overflow:hidden">
      <div id="bar" style="height:100%;width:0;background:var(--accent)"></div>
    </div>
    <p style="opacity:.7;margin:.6rem 0 0">Loading tools • Planner • GPA • AI Chat • Research</p>`;
  overlay.appendChild(ui);

  // THREE scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0,0,5);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const group = new THREE.Group(); scene.add(group);
  const torus = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, .35, 100, 16),
    new THREE.MeshBasicMaterial({ color: 0x88ccff, wireframe: true })
  );
  group.add(torus);

  const starsGeo = new THREE.BufferGeometry();
  const N = 800; const pos = new Float32Array(N*3);
  for (let i=0;i<N;i++){
    pos[i*3] = (Math.random()-.5)*30;
    pos[i*3+1]=(Math.random()-.5)*30;
    pos[i*3+2]=(Math.random()-.5)*30;
  }
  starsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ size: .03 }));
  scene.add(stars);

  const start = performance.now();
  const bar = ui.querySelector('#bar');
  let raf;
  const loop = (t)=>{
    const dt = (t-start)/1000;
    group.rotation.x += 0.01;
    group.rotation.y += 0.013;
    stars.rotation.y -= .0007;
    renderer.render(scene, camera);
    const pct = Math.min(1, dt/2.5); // ~2.5 seconds
    bar.style.width = (pct*100)+"%";
    if (pct>=1){
      cancelAnimationFrame(raf);
      setTimeout(()=>{ root.innerHTML = ""; onDone&&onDone(); }, 250);
      return;
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
