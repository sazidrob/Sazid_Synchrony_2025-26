import {
  auth,
  db,
  createUserWithEmailAndPassword,
  doc,
  getDoc,
  onAuthStateChanged,
  setDoc,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "./firebase.js";

const betaAccount = {
  email: "beta@lairospathfinder.com",
  password: "kishab-beta",
  data: {
    user: {
      name: "Kishab Shemar",
      age: 16,
      status: "High School Senior, broke",
      interests: ["sports", "gaming", "friends"],
    },
    planner: [
      { id: 1, text: "Finish Bio Essay", done: false },
      { id: 2, text: "Review Physics Notes", done: false },
      { id: 3, text: "Email Advisor", done: true }
    ],
    courses: [
      { name: "Biology", credits: 4, grade: "A" },
      { name: "Physics", credits: 4, grade: "B+" },
      { name: "English", credits: 3, grade: "A-" },
    ],
  }
};

function freshUserData({ name, age, status, interests }){
  return {
    user: {
      name,
      age: Number(age || 16),
      status: status || "Student",
      interests: interests ? interests.split(",").map((item)=> item.trim()).filter(Boolean) : []
    },
    planner: [],
    courses: []
  };
}

function errorMessage(error){
  const code = error?.code || "";
  if(code.includes("auth/email-already-in-use")) return "That email already has an account.";
  if(code.includes("auth/invalid-email")) return "Enter a valid email address.";
  if(code.includes("auth/invalid-credential") || code.includes("auth/wrong-password") || code.includes("auth/user-not-found")) return "Email or password is incorrect.";
  if(code.includes("auth/weak-password")) return "Password must be at least 6 characters.";
  if(code.includes("permission-denied")) return "Firestore blocked this save. Check your Firebase database rules.";
  return error?.message || "Something went wrong.";
}

export const Store = {
  theme: localStorage.getItem("nsai-theme") || "dark",
  activeUid: "",
  activeEmail: "",
  isAuthenticated: false,
  isReady: false,
  user: {},
  planner: [],
  courses: [],

  setTheme(t){
    this.theme = t;
    localStorage.setItem("nsai-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  },

  init(){
    return new Promise((resolve)=>{
      let resolved = false;
      onAuthStateChanged(auth, async (firebaseUser)=>{
        if(firebaseUser) await this.loadFirebaseUser(firebaseUser);
        else this.clearUser();

        this.isReady = true;
        window.dispatchEvent(new Event("authchange"));
        if(!resolved){
          resolved = true;
          resolve();
        }
      });
    });
  },

  clearUser(){
    this.activeUid = "";
    this.activeEmail = "";
    this.isAuthenticated = false;
    this.user = {};
    this.planner = [];
    this.courses = [];
  },

  async loadFirebaseUser(firebaseUser){
    this.activeUid = firebaseUser.uid;
    this.activeEmail = firebaseUser.email || "";
    this.isAuthenticated = true;

    const ref = doc(db, "users", firebaseUser.uid);
    const snapshot = await getDoc(ref);
    let data = snapshot.exists() ? snapshot.data() : null;

    if(!data){
      data = this.activeEmail === betaAccount.email
        ? betaAccount.data
        : freshUserData({
          name: firebaseUser.displayName || this.activeEmail.split("@")[0],
          age: 16,
          status: "Student",
          interests: ""
        });
      await setDoc(ref, data);
    }

    this.user = data.user || {};
    this.planner = data.planner || [];
    this.courses = data.courses || [];
  },

  async save(){
    if(!this.activeUid) return;
    await setDoc(doc(db, "users", this.activeUid), {
      user: this.user,
      planner: this.planner,
      courses: this.courses,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  async signIn(email, password){
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      await this.loadFirebaseUser(credential.user);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: errorMessage(error) };
    }
  },

  async signUp({ name, email, password, age, status, interests }){
    const normalizedEmail = email.trim().toLowerCase();
    if(!name.trim() || !normalizedEmail || password.length < 6){
      return { ok: false, message: "Enter a name, email, and password with at least 6 characters." };
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      await updateProfile(credential.user, { displayName: name.trim() });
      const data = freshUserData({ name: name.trim(), age, status, interests });
      await setDoc(doc(db, "users", credential.user.uid), data);
      await this.loadFirebaseUser(credential.user);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: errorMessage(error) };
    }
  },

  async signOut(){
    await signOut(auth);
    this.clearUser();
  },

  async useBeta(){
    const result = await this.signIn(betaAccount.email, betaAccount.password);
    if(result.ok) return result;

    try {
      const credential = await createUserWithEmailAndPassword(auth, betaAccount.email, betaAccount.password);
      await updateProfile(credential.user, { displayName: betaAccount.data.user.name });
      await setDoc(doc(db, "users", credential.user.uid), betaAccount.data);
      await this.loadFirebaseUser(credential.user);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: errorMessage(error) };
    }
  }
};

if(!document.documentElement.getAttribute("data-theme")){
  document.documentElement.setAttribute("data-theme", Store.theme);
}
