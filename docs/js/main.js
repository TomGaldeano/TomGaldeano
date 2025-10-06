// Translation data structure
const translations = {
  en: {
    profile: "Profile",
    profile_text: "Currently a student at a technical collage studying web deveolpment with an interest in cybersecurity and AI. Also interested in 3d printing and robotics.",
    below_portfolio: "Below is a portfolio of the work i have done that showacases my currrent skills",
    jobs: "Jobs",
    garage_assistant: "Garage assistant",
    garage_date: "2024 – Present",
    garage_company: "Ingemotion",
    garage_desc: "Customer service and support",
    chess_teacher: "Chess teacher for kids",
    chess_date: "2017 – 2018",
    chess_desc: "Customer service and support",
    projects: "Projects",
    websites: "Websites",
    bakery_website: "Bakery website",
    portfolio_page: "Portfolio page",
    education: "Education",
    bachiller: "Bachiller",
    bachiller_date: "jan-2016 – may-2016",
    colegio: "Colegio Montserrat, Madrid, España",
    fp: "FP Superior Desarollo web",
    fp_date: "2025 – present",
    ies: "IES Francisco de Goya, Madrid, España",
    languages: "Languages",
    spanish: "Native Spanish",
    english: "Native English",
    skills: "Skills",
    driving_license: "Driving license",
    good_baker: "Good baker",
    printing: "3d printing",
    chess: "chess",
    programming_skills: "Programming Skills",
    copyright: "&copy; 2024 Tom Galdeano. All rights reserved."
  },
  es: {
    profile: "Perfil",
    profile_text: "Actualmente estudiante en un instituto técnico cursando desarrollo web, con interés en ciberseguridad e IA. También interesado en impresión 3D y robótica.",
    below_portfolio: "A continuación se muestra un portafolio de mi trabajo que demuestra mis habilidades actuales.",
    jobs: "Trabajos",
    garage_assistant: "Auxiliar de taller",
    garage_date: "2024 – Actualidad",
    garage_company: "Ingemotion",
    garage_desc: "Atención y soporte al cliente",
    chess_teacher: "Profesor de ajedrez para niños",
    chess_date: "2017 – 2018",
    chess_desc: "Atención y soporte al cliente",
    projects: "Proyectos",
    websites: "Sitios web",
    bakery_website: "Sitio web de panadería",
    portfolio_page: "Página de portafolio",
    education: "Educación",
    bachiller: "Bachillerato",
    bachiller_date: "ene-2016 – may-2016",
    colegio: "Colegio Montserrat, Madrid, España",
    fp: "FP Superior Desarrollo web",
    fp_date: "2025 – Actualidad",
    ies: "IES Francisco de Goya, Madrid, España",
    languages: "Idiomas",
    spanish: "Español nativo",
    english: "Inglés nativo",
    skills: "Habilidades",
    driving_license: "Carnet de conducir",
    good_baker: "Buen panadero",
    printing: "Impresión 3D",
    chess: "ajedrez",
    programming_skills: "Habilidades de programación",
    copyright: "&copy; 2024 Tom Galdeano. Todos los derechos reservados."
  }
};
const light_dark = document.querySelector('#color_changer');
// Add IDs/classes to HTML for translatable elements if needed
document.addEventListener("DOMContentLoaded", function() {
  // Add IDs to job elements if missing
  document.querySelectorAll(".job").forEach((jobElem, idx) => {
    if (idx === 0) {
      jobElem.querySelector(".job-title").id = "garage-assistant";
      jobElem.querySelector(".job-date").id = "garage-date";
      jobElem.querySelector("span:not(.job-title):not(.job-date)").id = "garage-company";
      jobElem.querySelector("ul li").id = "garage-desc";
    } else if (idx === 1) {
      jobElem.querySelector(".job-title").id = "chess-teacher";
      jobElem.querySelector(".job-date").id = "chess-date";
      jobElem.querySelector("ul li").id = "chess-desc";
    }
  });

  // Add IDs to project links
  document.querySelectorAll(".projects .skills-list li").forEach((liElem, idx) => {
    if (idx === 0) liElem.querySelector("a").id = "bakery-website";
    if (idx === 1) liElem.querySelector("a").id = "portfolio-page";
  });

  // Add IDs to education elements
  document.querySelectorAll(".edu").forEach((eduElem, idx) => {
    eduElem.querySelector(".edu-title").id = idx === 0 ? "bachiller" : "fp";
    eduElem.querySelector(".edu-date").id = idx === 0 ? "bachiller-date" : "fp-date";
    eduElem.querySelector("span:not(.edu-title):not(.edu-date)").id = idx === 0 ? "colegio" : "ies";
  });

  // Add IDs to skills
  document.querySelectorAll(".section")[5].querySelectorAll(".skills-list li").forEach((liElem, idx) => {
    if (idx === 0) liElem.id = "driving-license";
    if (idx === 1) liElem.id = "good-baker";
    if (idx === 2) liElem.id = "printing";
    if (idx === 3) liElem.querySelector("a").id = "chess";
  });
});

// Helper to translate by key
function translatePage(lang) {
  document.getElementById("perfil").textContent = translations[lang].profile;
  document.getElementById("perfil-texto").textContent = translations[lang].profile_text;
  document.querySelector("#perfil-texto + p").textContent = translations[lang].below_portfolio;
  document.querySelectorAll(".section-title")[1].textContent = translations[lang].jobs;
  document.getElementById("garage-assistant").textContent = translations[lang].garage_assistant;
  document.getElementById("garage-date").textContent = translations[lang].garage_date;
  document.getElementById("garage-company").textContent = translations[lang].garage_company;
  document.getElementById("garage-desc").textContent = translations[lang].garage_desc;
  document.getElementById("chess-teacher").textContent = translations[lang].chess_teacher;
  document.getElementById("chess-date").textContent = translations[lang].chess_date;
  document.getElementById("chess-desc").textContent = translations[lang].chess_desc;
  document.querySelectorAll(".section-title")[2].textContent = translations[lang].projects;
  document.querySelector(".projects-title").textContent = translations[lang].websites;
  document.getElementById("bakery-website").textContent = translations[lang].bakery_website;
  document.getElementById("portfolio-page").textContent = translations[lang].portfolio_page;
  document.querySelectorAll(".section-title")[3].textContent = translations[lang].education;
  document.getElementById("bachiller").textContent = translations[lang].bachiller;
  document.getElementById("bachiller-date").textContent = translations[lang].bachiller_date;
  document.getElementById("colegio").textContent = translations[lang].colegio;
  document.getElementById("fp").textContent = translations[lang].fp;
  document.getElementById("fp-date").textContent = translations[lang].fp_date;
  document.getElementById("ies").textContent = translations[lang].ies;
  document.querySelectorAll(".section-title")[4].textContent = translations[lang].languages;
  document.getElementById("Spanish").textContent = translations[lang].spanish;
  document.getElementById("English").textContent = translations[lang].english;
  document.querySelectorAll(".section-title")[5].textContent = translations[lang].skills;
  document.querySelectorAll(".section-title")[6].textContent = translations[lang].programming_skills;
  document.getElementById("driving-license").textContent = translations[lang].driving_license;
  document.getElementById("good-baker").textContent = translations[lang].good_baker;
  document.getElementById("printing").textContent = translations[lang].printing;
  document.getElementById("chess").textContent = translations[lang].chess;
  document.querySelector("footer p").innerHTML = translations[lang].copyright;
  // Programming Skills section intentionally not translated
}
function light_theme(){
  document.body.classList.toggle('dark');
}
function dark_theme(){
  document.body.classList.toggle('light');
}
// Language switcher
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("Spanish").onclick = () => translatePage("es");
  document.getElementById("English").onclick = () => translatePage("en");
});
light_dark.addEventListener('click', function() {
    light_theme()
    dark_theme()
});

// Default language
translatePage("en");