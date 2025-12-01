export const Store = {
  theme: (localStorage.getItem("nsai-theme") || "dark"),
  setTheme(t){
    this.theme = t; localStorage.setItem("nsai-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  },
  user: {
    name: "Hishab Lamar",
    age: 16,
    status: "High School Senior, broke",
    interests: ["sports","gaming","friends"],
  },
  planner: [
    { id: 1, text: "Finish Bio Essay", done:false },
    { id: 2, text: "Review Physics Notes", done:false },
    { id: 3, text: "Email Advisor", done:true }
  ],
  courses: [
    { name: "Biology", credits: 4, grade: "A" },
    { name: "Physics", credits: 4, grade: "B+" },
    { name: "English", credits: 3, grade: "A-" },
  ],
};

if (!document.documentElement.getAttribute("data-theme")) {
  document.documentElement.setAttribute("data-theme", Store.theme);
}
