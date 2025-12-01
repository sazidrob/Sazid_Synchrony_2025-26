import { Store } from './state.js';
import { route, startRouter } from './router.js';
import { mountLoader } from './three-loader.js';
import { Dashboard, Planner, GPA, Research, Health, Goals, AI, Settings } from './components/index.js';

const themeBtn = document.getElementById('themeToggle');
const logoutBtn = document.getElementById('logoutBtn');
if (themeBtn) themeBtn.onclick = ()=> Store.setTheme(Store.theme==='dark'?'light':'dark');
if (logoutBtn) logoutBtn.onclick = ()=> alert('Demo only — no auth wired yet.');

route('#/dashboard', Dashboard);
route('#/planner', Planner);
route('#/gpa', GPA);
route('#/research', Research);
route('#/health', Health);
route('#/goals', Goals);
route('#/ai', AI);
route('#/settings', Settings);

mountLoader(()=> startRouter());
