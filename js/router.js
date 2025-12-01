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
