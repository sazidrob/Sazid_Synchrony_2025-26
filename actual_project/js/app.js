import { Store } from './state.js';
import { route, startRouter } from './router.js';
import { mountLoader } from './three-loader.js';
import { Dashboard, Planner, GPA, Research, Health, Goals, AI, Settings, Auth } from './components/index.js';

const themeBtn = document.getElementById('themeToggle');
const logoutBtn = document.getElementById('logoutBtn');
if (themeBtn) themeBtn.onclick = ()=> Store.setTheme(Store.theme==='dark'?'light':'dark');
if (logoutBtn) logoutBtn.onclick = async ()=>{
  await Store.signOut();
  location.hash = '#/login';
  window.dispatchEvent(new Event('authchange'));
};

route('#/login', Auth);
route('#/dashboard', Dashboard);
route('#/planner', Planner);
route('#/gpa', GPA);
route('#/research', Research);
route('#/health', Health);
route('#/goals', Goals);
route('#/ai', AI);
route('#/settings', Settings);

mountLoader(async ()=> {
  await Store.init();
  startRouter();
});
