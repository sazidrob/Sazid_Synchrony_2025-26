import { Store } from "../state.js";

export default async function Auth(){
  const el = document.createElement("div");
  el.className = "auth-shell";
  el.innerHTML = `
    <section class="card auth-card">
      <h3>Welcome To Lairos Pathfinder</h3>
      <div class="auth-tabs">
        <button id="showLogin" class="button">Log In</button>
        <button id="showSignup" class="button ghost">Sign Up</button>
      </div>

      <form id="loginForm" class="auth-form">
        <input class="input" name="email" type="email" placeholder="Email" autocomplete="email" required>
        <input class="input" name="password" type="password" placeholder="Password" autocomplete="current-password" required>
        <button class="button" type="submit">Log In</button>
      </form>

      <form id="signupForm" class="auth-form" hidden>
        <input class="input" name="name" placeholder="Full name" autocomplete="name" required>
        <input class="input" name="email" type="email" placeholder="Email" autocomplete="email" required>
        <input class="input" name="password" type="password" placeholder="Password" autocomplete="new-password" required>
        <input class="input" name="age" type="number" min="10" max="99" placeholder="Age">
        <input class="input" name="status" placeholder="Status, grade, or role">
        <input class="input" name="interests" placeholder="Interests separated by commas">
        <button class="button" type="submit">Create Account</button>
      </form>

      <div class="auth-divider"></div>
      <button id="betaLogin" class="button ghost" type="button">Continue As Beta User</button>
      <p id="authMessage" class="auth-message"></p>
    </section>
  `;

  const loginForm = el.querySelector("#loginForm");
  const signupForm = el.querySelector("#signupForm");
  const showLogin = el.querySelector("#showLogin");
  const showSignup = el.querySelector("#showSignup");
  const message = el.querySelector("#authMessage");

  function setMode(mode){
    const isLogin = mode === "login";
    loginForm.hidden = !isLogin;
    signupForm.hidden = isLogin;
    showLogin.className = `button ${isLogin ? "" : "ghost"}`;
    showSignup.className = `button ${isLogin ? "ghost" : ""}`;
    message.textContent = "";
  }

  function setBusy(isBusy){
    el.querySelectorAll("button").forEach((button)=> button.disabled = isBusy);
  }

  function finish(result){
    if(!result.ok){
      message.textContent = result.message;
      return;
    }
    location.hash = "#/dashboard";
    window.dispatchEvent(new Event("authchange"));
  }

  showLogin.onclick = ()=> setMode("login");
  showSignup.onclick = ()=> setMode("signup");

  loginForm.onsubmit = async (event)=>{
    event.preventDefault();
    const form = new FormData(loginForm);
    message.textContent = "Signing in...";
    setBusy(true);
    finish(await Store.signIn(form.get("email"), form.get("password")));
    setBusy(false);
  };

  signupForm.onsubmit = async (event)=>{
    event.preventDefault();
    const form = new FormData(signupForm);
    message.textContent = "Creating account...";
    setBusy(true);
    finish(await Store.signUp(Object.fromEntries(form)));
    setBusy(false);
  };

  el.querySelector("#betaLogin").onclick = async ()=>{
    message.textContent = "Opening Kishab beta account...";
    setBusy(true);
    finish(await Store.useBeta());
    setBusy(false);
  };

  return el;
}
