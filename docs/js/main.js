// Translation data structure
const translations = {
  en: {
    profile: "Profile",
    profile_text: "Currently a student at a technical collage studying web deveolpment with an interest in cybersecurity and AI. Also interested in 3d printing and robotics.",
    below_portfolio: "Below is a portfolio of the work i have done that showacases my currrent skills",
    experience: "Experience",
    job_title: "Job Title",
    job_date: "2025 – Present",
    student: "Student, IES Francisco de Goya",
    passing_exams: "Passing my exams",
    building_portfolio: "Building a portfolio",
    projects: "Projects",
    bakery_website: "Bakery website",
    portfolio_page: "Portfolio page",
    education: "Education",
    bachiller: "Bachiller",
    bachiller_date: "2014 – 2016",
    colegio: "Colegio Montserrat, Madrid, España",
    fp: "FP Superior Desarollo web",
    fp_date: "2025 – present",
    ies: "IES Francisco de Goya, Madrid, España",
    skills: "Skills",
    spanish: "Native Spanish",
    programming_skills: "Programming Skills",
    copyright: "&copy; 2024 Tom Galdeano. All rights reserved."
  },
  es: {
    profile: "Perfil",
    profile_text: "Actualmente estudiante en un instituto técnico cursando desarrollo web, con interés en ciberseguridad e IA. También interesado en impresión 3D y robótica.",
    below_portfolio: "A continuación se muestra un portafolio de mi trabajo que demuestra mis habilidades actuales.",
    experience: "Experiencia",
    job_title: "Estudiante",
    job_date: "2025 – Actualidad",
    student: "Estudiante, IES Francisco de Goya",
    passing_exams: "Aprobando mis exámenes",
    building_portfolio: "Construyendo un portafolio",
    projects: "Proyectos",
    bakery_website: "Sitio web de panadería",
    portfolio_page: "Página de portafolio",
    education: "Educación",
    bachiller: "Bachillerato",
    bachiller_date: "2014 – 2016",
    colegio: "Colegio Montserrat, Madrid, España",
    fp: "FP Superior Desarrollo web",
    fp_date: "2025 – Actualidad",
    ies: "IES Francisco de Goya, Madrid, España",
    skills: "Idiomas",
    spanish: "Español nativo",
    english: "Inglés nativo",
    programming_skills: "Habilidades de programación",
    copyright: "&copy; 2024 Tom Galdeano. Todos los derechos reservados."
  }
};

// Elements to translate: id or custom data attribute
const translatable = [
  { selector: "#perfil", key: "profile" },
  { selector: "#perfil-texto", key: "profile_text" },
  { selector: "#below-portfolio", key: "below_portfolio" },
  { selector: ".section-title", key: null }, // Will handle by order
  { selector: ".job-title", key: "job_title" },
  { selector: ".job-date", key: "job_date" },
  { selector: ".projects-title", key: "projects" },
  { selector: ".edu-title", key: "bachiller" }, // First edu-title
  { selector: ".edu-date", key: "bachiller_date" }, // First edu-date
  { selector: ".edu-title", key: "fp" }, // Second edu-title
  { selector: ".edu-date", key: "fp_date" }, // Second edu-date
  { selector: "#Spanish", key: "spanish" },
  { selector: "#English", key: "english" },
  { selector: "footer p", key: "copyright" }
];

// Helper to translate by key
function translatePage(lang) {
  // Profile
  document.getElementById("perfil").textContent = translations[lang].profile;
  document.getElementById("perfil-texto").textContent = translations[lang].profile_text;
  // Below portfolio
  const belowPortfolio = document.querySelector("#perfil-texto + p");
  if (belowPortfolio) belowPortfolio.textContent = translations[lang].below_portfolio;
  // Experience
  document.querySelectorAll(".section-title")[1].textContent = translations[lang].experience;
  // Job
  document.querySelector(".job-title").textContent = translations[lang].job_title;
  document.querySelector(".job-date").textContent = translations[lang].job_date;
  document.querySelector(".job ul li:first-child").textContent = translations[lang].passing_exams;
  document.querySelector(".job ul li:last-child").textContent = translations[lang].building_portfolio;
  // Projects
  document.querySelector(".projects-title").textContent = translations[lang].projects;
  document.querySelector(".projects ul li:first-child a").textContent = translations[lang].bakery_website;
  document.querySelector(".projects ul li:last-child a").textContent = translations[lang].portfolio_page;
  // Education
  document.querySelectorAll(".section-title")[2].textContent = translations[lang].education;
  document.querySelectorAll(".edu-title")[0].textContent = translations[lang].bachiller;
  document.querySelectorAll(".edu-date")[0].textContent = translations[lang].bachiller_date;
  document.querySelectorAll(".edu-title")[1].textContent = translations[lang].fp;
  document.querySelectorAll(".edu-date")[1].textContent = translations[lang].fp_date;
  document.querySelectorAll(".edu")[0].querySelector("span:last-child").textContent = translations[lang].colegio;
  document.querySelectorAll(".edu")[1].querySelector("span:last-child").textContent = translations[lang].ies;
  // Skills
  document.querySelectorAll(".section-title")[3].textContent = translations[lang].skills;
  document.getElementById("Spanish").textContent = translations[lang].spanish;
  // Programming Skills
  document.querySelectorAll(".section-title")[4].textContent = translations[lang].programming_skills;
  // Footer
  document.querySelector("footer p").innerHTML = translations[lang].copyright;
}

// Language switcher
document.addEventListener("DOMContentLoaded", function() {
  // Add language buttons/images
  const langBar = document.createElement("div");
  langBar.style.textAlign = "right";
  langBar.style.marginBottom = "16px";
  langBar.innerHTML = `
    <img src="https://flagcdn.com/h40/gb.png" alt="English" id="lang-en" style="cursor:pointer;margin-right:8px;border-radius:50%;width:40px;height:40px;">
    <img src="https://flagcdn.com/h40/es.png" alt="Español" id="lang-es" style="cursor:pointer;border-radius:50%;width:40px;height:40px;">
  `;
  document.querySelector(".container").prepend(langBar);

  document.getElementById("lang-en").onclick = () => translatePage("en");
  document.getElementById("lang-es").onclick = () => translatePage("es");
  document.getElementById("Spanish").onclick = () => translatePage("es");
  document.getElementById("English").onclick = () => translatePage("en");
});

// Default language
translatePage("en");