const routes = {};
export function route(path, component){ routes[path] = component; }
export function startRouter(){
  const app = document.getElementById("app");
  async function render(){
    const hash = location.hash || "#/dashboard";
    const key = hash.split("?")[0];
    const view = routes[key] || routes["#/dashboard"];
    app.replaceChildren(await view());
  }
  window.addEventListener("hashchange", render);
  render();
}

// Media page view
async function MediaView() {
  const section = document.createElement("section");
  section.id = "media";
  section.setAttribute("data-media", "data-media");

  section.innerHTML = `
    <h2>Media</h2>
    <video controls width="480">
      <source src="./assets/lairos_pathfinder.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  `;

  return section;
}

// Register it like your other routes
route("#/media", MediaView);