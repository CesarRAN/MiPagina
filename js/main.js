let currentLang = localStorage.getItem('lang') || 'es';
let typewriterInstance = null;

const translations = {
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre Mí",
      experience: "Experiencia",
      projects: "Proyectos",
      education: "Formación",
      contact: "Contacto"
    },
    hero: {
      greeting: "Hola, soy",
      name: "Cesar Altamirano",
      title: "Data Analyst / Data Scientist",
      description: "Ingeniero en Cibernética y Licenciado en Física, especializado en Data Science, Deep Learning y análisis de datos. Transformo datos complejos en insights accionables.",
      cta1: "Ver Proyectos",
      cta2: "Contáctame",
      scroll: "Desplázate hacia abajo",
      typewriterWords: ["Data Analyst", "Data Scientist", "Deep Learning", "Investigación de Operaciones"]
    },
    about: {
      title: "Sobre Mí",
      subtitle: "Conoce más sobre mi trayectoria y pasiones",
      description: "Soy Cesar Altamirano, Ingeniero en Cibernética y Sistemas Computacionales por la Universidad La Salle y Licenciado en Física por la UNAM. Combino una sólida formación técnica con un enfoque analítico para resolver problemas complejos mediante datos.",
      description2: "Mi experiencia abarca desde el análisis de datos financieros y la automatización de reportes hasta la investigación económica con Machine Learning y redes complejas. Domino Python, Excel, Looker Studio, BigQuery y herramientas de web scraping.",
      stats: {
        years: "Años de\nExperiencia",
        projects: "Proyectos\nPrincipales",
        clients: "Grados\nAcadémicos",
        technologies: "Tecnologías\nDominadas"
      },
      skills: "Habilidades",
      softSkills: "Habilidades Blandas",
      softSkillsList: [
        "Trabajo en equipo",
        "Autodidacta",
        "Responsable"
      ]
    },
    experience: {
      title: "Experiencia",
      subtitle: "Mi trayectoria profesional",
      jobs: [
        {
          role: "Data Analyst",
          company: "FINDEP",
          period: "2025 — Presente",
          description: "Diseño de consultas y dashboards para el seguimiento de indicadores de portafolio, colocaciones, seguros, bonificaciones y cobranza. Desarrollo de una métrica de desempeño para gestores de cobranza. Automatización de reportes de campañas de ofertas.",
          tech: ["Python", "BigQuery", "Looker Studio", "Excel"]
        },
        {
          role: "Análisis económico con Machine Learning",
          company: "Instituto de Investigaciones Económicas (UNAM)",
          period: "2024",
          description: "Desarrollo de programas para el análisis de redes y matrices de insumo-producto del comercio entre Estados Unidos, Canadá y México. Aplicación de índices de centralidad de red, clustering y pretopologías.",
          tech: ["Python", "Julia", "NetworkX", "Machine Learning"]
        },
        {
          role: "Web Scraping",
          company: "Banco de México",
          period: "2023",
          description: "Automatización de procesos para obtener información de productos financieros mediante web scraping.",
          tech: ["Python", "Selenium", "Beautiful Soup"]
        }
      ]
    },
    projects: {
      title: "Proyectos",
      subtitle: "Algunos de mis trabajos más destacados",
      items: [
        {
          title: "Análisis de Datos Financieros — FINDEP",
          description: "Diseño de consultas y dashboards para seguimiento de indicadores financieros, colocaciones, seguros y cobranza. Automatización de reportes de campañas.",
          tech: ["Python", "BigQuery", "Looker Studio", "Excel"],
          link: "#",
          category: "Data Analysis"
        },
        {
          title: "Análisis de Redes Comerciales — IIE-UNAM",
          description: "Análisis de redes y matrices de insumo-producto del comercio entre Estados Unidos, Canadá y México usando Machine Learning e índices de centralidad.",
          tech: ["Python", "Julia", "NetworkX", "Pandas"],
          link: "#",
          category: "Machine Learning"
        },
        {
          title: "Web Scraping Financiero — Banco de México",
          description: "Automatización de extracción de información de productos financieros mediante web scraping y procesamiento de datos.",
          tech: ["Python", "Selenium", "Beautiful Soup", "Pandas"],
          link: "#",
          category: "Web Scraping"
        },
        {
          title: "Escuela de Cómputo Cuántico — CECAv",
          description: "Formación en algoritmos cuánticos y computación cuántica aplicada con proyectos prácticos en Qiskit.",
          tech: ["Python", "Qiskit", "Julia", "Álgebra Lineal"],
          link: "#",
          category: "Quantum Computing"
        }
      ],
      viewProject: "Ver Proyecto",
      viewAll: "Ver Todos los Proyectos"
    },
    education: {
      title: "Formación",
      subtitle: "Mi preparación académica y certificaciones",
      items: [
        {
          title: "Ingeniería en Cibernética y Sistemas Computacionales",
          institution: "Universidad La Salle",
          period: "2018 — 2021",
          description: "Formación en ingeniería computacional, sistemas y cibernética.",
          type: "degree"
        },
        {
          title: "Licenciatura en Física",
          institution: "Universidad Nacional Autónoma de México (UNAM)",
          period: "2019 — 2025",
          description: "Formación en física teórica, experimental y computacional.",
          type: "degree"
        },
        {
          title: "CCNAv7: Enterprise Networking, Security, and Automation",
          institution: "Cisco",
          period: "2020",
          description: "Certificación en redes empresariales, seguridad y automatización.",
          type: "cert"
        },
        {
          title: "Data Science Foundations",
          institution: "IBM",
          period: "2021",
          description: "Fundamentos de ciencia de datos y análisis estadístico.",
          type: "cert"
        },
        {
          title: "Big Data Foundations",
          institution: "IBM",
          period: "2021",
          description: "Fundamentos de big data y procesamiento de grandes volúmenes de información.",
          type: "cert"
        },
        {
          title: "EGEL de Licenciatura en Ingeniería Computacional con resultado Sobresaliente",
          institution: "CENEVAL",
          period: "2021",
          description: "Evaluación general de egreso de licenciatura con resultado sobresaliente.",
          type: "cert"
        },
        {
          title: "Escuela de Cómputo Cuántico",
          institution: "CECAv",
          period: "2024",
          description: "Formación en computación cuántica y algoritmos cuánticos.",
          type: "cert"
        },
        {
          title: "Diplomado en Ciencia de Datos",
          institution: "FES Acatlán — UNAM",
          period: "2025 — Presente",
          description: "Diplomado especializado en ciencia de datos y machine learning.",
          type: "cert"
        }
      ],
      degrees: "Educación",
      certifications: "Certificaciones"
    },
    contact: {
      title: "Contacto",
      subtitle: "¿Tienes un proyecto en mente? Hablemos",
      form: {
        name: "Nombre",
        namePlaceholder: "Tu nombre completo",
        email: "Correo Electrónico",
        emailPlaceholder: "tu@email.com",
        subject: "Asunto",
        subjectPlaceholder: "¿De qué quieres hablar?",
        message: "Mensaje",
        messagePlaceholder: "Cuéntame sobre tu proyecto...",
        send: "Enviar Mensaje",
        sending: "Enviando..."
      },
      info: {
        title: "Información de Contacto",
        email: "Correo",
        emailValue: "cran99@yahoo.com",
        location: "Ubicación",
        locationValue: "Ciudad de México, México",
        availability: "Disponibilidad",
        availabilityValue: "Abierto a oportunidades",
        social: "Redes Sociales"
      }
    },
    footer: {
      rights: "Todos los derechos reservados.",
      madeWith: "Hecho con",
      and: "y",
      by: "por"
    }
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      experience: "Experience",
      projects: "Projects",
      education: "Education",
      contact: "Contact"
    },
    hero: {
      greeting: "Hi, I'm",
      name: "Cesar Altamirano",
      title: "Data Analyst / Data Scientist",
      description: "Cybernetics Engineer and Physics Bachelor, specialized in Data Science, Deep Learning and data analysis. I transform complex data into actionable insights.",
      cta1: "View Projects",
      cta2: "Contact Me",
      scroll: "Scroll down",
      typewriterWords: ["Data Analyst", "Data Scientist", "Deep Learning", "Operations Research"]
    },
    about: {
      title: "About Me",
      subtitle: "Learn more about my journey and passions",
      description: "I'm Cesar Altamirano, Cybernetics and Computer Systems Engineer from Universidad La Salle and Physics Bachelor from UNAM. I combine a strong technical background with an analytical approach to solve complex problems through data.",
      description2: "My experience ranges from financial data analysis and automated reporting to economic research with Machine Learning and complex networks. I master Python, Excel, Looker Studio, BigQuery and web scraping tools.",
      stats: {
        years: "Years of\nExperience",
        projects: "Major\nProjects",
        clients: "Academic\nDegrees",
        technologies: "Technologies\nMastered"
      },
      skills: "Skills",
      softSkills: "Soft Skills",
      softSkillsList: [
        "Teamwork",
        "Self-taught",
        "Responsible"
      ]
    },
    experience: {
      title: "Experience",
      subtitle: "My professional journey",
      jobs: [
        {
          role: "Data Analyst",
          company: "FINDEP",
          period: "2025 — Present",
          description: "Design of queries and dashboards for tracking portfolio indicators, placements, insurance, bonuses and collections. Development of a performance metric for collection managers. Automation of campaign offer reports.",
          tech: ["Python", "BigQuery", "Looker Studio", "Excel"]
        },
        {
          role: "Economic Analysis with Machine Learning",
          company: "Institute of Economic Research (UNAM)",
          period: "2024",
          description: "Development of programs for network analysis and input-output matrices of trade between the United States, Canada and Mexico. Application of network centrality indices, clustering and pretopologies.",
          tech: ["Python", "Julia", "NetworkX", "Machine Learning"]
        },
        {
          role: "Web Scraping",
          company: "Banco de México",
          period: "2023",
          description: "Automation of processes to obtain information on financial products through web scraping.",
          tech: ["Python", "Selenium", "Beautiful Soup"]
        }
      ]
    },
    projects: {
      title: "Projects",
      subtitle: "Some of my most notable work",
      items: [
        {
          title: "Financial Data Analysis — FINDEP",
          description: "Design of queries and dashboards for tracking financial indicators, placements, insurance and collections. Automation of campaign reports.",
          tech: ["Python", "BigQuery", "Looker Studio", "Excel"],
          link: "#",
          category: "Data Analysis"
        },
        {
          title: "Trade Network Analysis — IIE-UNAM",
          description: "Analysis of networks and input-output matrices of trade between the United States, Canada and Mexico using Machine Learning and centrality indices.",
          tech: ["Python", "Julia", "NetworkX", "Pandas"],
          link: "#",
          category: "Machine Learning"
        },
        {
          title: "Financial Web Scraping — Banco de México",
          description: "Automation of extraction of financial product information through web scraping and data processing.",
          tech: ["Python", "Selenium", "Beautiful Soup", "Pandas"],
          link: "#",
          category: "Web Scraping"
        },
        {
          title: "Quantum Computing School — CECAv",
          description: "Training in quantum algorithms and applied quantum computing with practical projects in Qiskit.",
          tech: ["Python", "Qiskit", "Julia", "Linear Algebra"],
          link: "#",
          category: "Quantum Computing"
        }
      ],
      viewProject: "View Project",
      viewAll: "View All Projects"
    },
    education: {
      title: "Education",
      subtitle: "My academic background and certifications",
      items: [
        {
          title: "Bachelor's in Cybernetics and Computer Systems Engineering",
          institution: "Universidad La Salle",
          period: "2018 — 2021",
          description: "Training in computational engineering, systems and cybernetics.",
          type: "degree"
        },
        {
          title: "Bachelor's in Physics",
          institution: "Universidad Nacional Autónoma de México (UNAM)",
          period: "2019 — 2025",
          description: "Training in theoretical, experimental and computational physics.",
          type: "degree"
        },
        {
          title: "CCNAv7: Enterprise Networking, Security, and Automation",
          institution: "Cisco",
          period: "2020",
          description: "Certification in enterprise networking, security and automation.",
          type: "cert"
        },
        {
          title: "Data Science Foundations",
          institution: "IBM",
          period: "2021",
          description: "Foundations of data science and statistical analysis.",
          type: "cert"
        },
        {
          title: "Big Data Foundations",
          institution: "IBM",
          period: "2021",
          description: "Foundations of big data and processing of large volumes of information.",
          type: "cert"
        },
        {
          title: "EGEL Bachelor's in Computational Engineering with Outstanding Result",
          institution: "CENEVAL",
          period: "2021",
          description: "General graduation evaluation with outstanding result.",
          type: "cert"
        },
        {
          title: "Quantum Computing School",
          institution: "CECAv",
          period: "2024",
          description: "Training in quantum computing and quantum algorithms.",
          type: "cert"
        },
        {
          title: "Diploma in Data Science",
          institution: "FES Acatlán — UNAM",
          period: "2025 — Present",
          description: "Specialized diploma in data science and machine learning.",
          type: "cert"
        }
      ],
      degrees: "Education",
      certifications: "Certifications"
    },
    contact: {
      title: "Contact",
      subtitle: "Have a project in mind? Let's talk",
      form: {
        name: "Name",
        namePlaceholder: "Your full name",
        email: "Email",
        emailPlaceholder: "your@email.com",
        subject: "Subject",
        subjectPlaceholder: "What do you want to talk about?",
        message: "Message",
        messagePlaceholder: "Tell me about your project...",
        send: "Send Message",
        sending: "Sending..."
      },
      info: {
        title: "Contact Information",
        email: "Email",
        emailValue: "cran99@yahoo.com",
        location: "Location",
        locationValue: "Mexico City, Mexico",
        availability: "Availability",
        availabilityValue: "Open to opportunities",
        social: "Social Networks"
      }
    },
    footer: {
      rights: "All rights reserved.",
      madeWith: "Made with",
      and: "and",
      by: "by"
    }
  }
};

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  applyTranslations();
  updateLangButton();
  updatePageTitle();
  restartTypeWriter();
  renderDynamicContent();
  reinitAnimations();
}

function applyTranslations() {
  const t = translations[currentLang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = key.split('.').reduce((obj, k) => obj?.[k], t);
    if (value) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.innerHTML = value;
      }
    }
  });

  document.querySelectorAll('[data-i18n-list]').forEach(el => {
    const key = el.dataset.i18nList;
    const items = key.split('.').reduce((obj, k) => obj?.[k], t);
    if (Array.isArray(items)) {
      el.innerHTML = items.map(item => `<span class="skill-tag">${item}</span>`).join('');
    }
  });

  document.querySelectorAll('[data-i18n-count]').forEach(el => {
    const key = el.dataset.i18nCount;
    const value = key.split('.').reduce((obj, k) => obj?.[k], t);
    if (value) {
      el.innerHTML = value.replace('\n', '<br>');
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const value = key.split('.').reduce((obj, k) => obj?.[k], t);
    if (value) {
      el.placeholder = value;
    }
  });
}

function updateLangButton() {
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.textContent = currentLang === 'es' ? 'EN' : 'ES';
    if (currentLang === 'es') {
      btn.classList.add('ring-2', 'ring-lime-400');
    } else {
      btn.classList.remove('ring-2', 'ring-lime-400');
    }
  }
}

function updatePageTitle() {
  const t = translations[currentLang];
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const name = t?.hero?.name || 'Cesar Altamirano';
  const titles = {
    'index.html': `${name} | ${t?.hero?.title || ''}`,
    'about.html': `${t?.about?.title || ''} | ${name}`,
    'experience.html': `${t?.experience?.title || ''} | ${name}`,
    'projects.html': `${t?.projects?.title || ''} | ${name}`,
    'education.html': `${t?.education?.title || ''} | ${name}`,
    'contact.html': `${t?.contact?.title || ''} | ${name}`
  };
  document.title = titles[page] || name;
}

class Navigation {
  constructor() {
    this.menuBtn = document.getElementById('menu-btn');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.nav = document.getElementById('navbar');
    this.isMenuOpen = false;
    this.lastScrollY = 0;
    this.init();
  }

  init() {
    if (this.menuBtn) {
      this.menuBtn.addEventListener('click', () => this.toggleMenu());
    }

    document.querySelectorAll('#mobile-menu a').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) this.closeMenu();
    }, { passive: true });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.mobileMenu?.classList.toggle('hidden', !this.isMenuOpen);
    this.mobileMenu?.classList.toggle('flex', this.isMenuOpen);

    const bars = this.menuBtn?.querySelectorAll('.menu-bar');
    bars?.forEach((bar, i) => {
      if (this.isMenuOpen) {
        if (i === 0) bar.style.transform = 'rotate(45deg) translateY(6px) translateX(6px)';
        if (i === 1) bar.style.opacity = '0';
        if (i === 2) bar.style.transform = 'rotate(-45deg) translateY(-6px) translateX(6px)';
      } else {
        bar.style.transform = '';
        bar.style.opacity = '';
      }
    });
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.mobileMenu?.classList.add('hidden');
    this.mobileMenu?.classList.remove('flex');
    const bars = this.menuBtn?.querySelectorAll('.menu-bar');
    bars?.forEach(bar => {
      bar.style.transform = '';
      bar.style.opacity = '';
    });
  }

  handleScroll() {
    const scrollY = window.pageYOffset;

    if (this.nav) {
      if (scrollY > 50) {
        this.nav.classList.add('nav-scrolled');
      } else {
        this.nav.classList.remove('nav-scrolled');
      }
    }

    this.lastScrollY = scrollY;
  }
}

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });

    document.querySelectorAll('a[href^="index.html#"], a[href^="./index.html#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        const hash = href.split('#')[1];
        if (window.location.pathname.includes('index')) {
          e.preventDefault();
          const target = document.getElementById(hash);
          if (target) {
            const offset = 80;
            const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: pos, behavior: 'smooth' });
          }
        }
      });
    });
  }
}

class TypeWriter {
  constructor(element, words, wait = 2500) {
    this.element = element;
    this.words = words;
    this.wait = wait;
    this.wordIndex = 0;
    this.txt = '';
    this.isDeleting = false;
    this.timeoutId = null;
    if (element) this.type();
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    this.txt = this.isDeleting
      ? fullTxt.substring(0, this.txt.length - 1)
      : fullTxt.substring(0, this.txt.length + 1);

    this.element.textContent = this.txt;

    let typeSpeed = this.isDeleting ? 50 : 100;

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    this.timeoutId = setTimeout(() => this.type(), typeSpeed);
  }

  restart(words) {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.words = words;
    this.wordIndex = 0;
    this.txt = '';
    this.isDeleting = false;
    if (this.element) this.type();
  }
}

function restartTypeWriter() {
  const el = document.getElementById('typewriter');
  if (!el || !typewriterInstance) return;
  const t = translations[currentLang];
  const words = t?.hero?.typewriterWords;
  if (words) {
    typewriterInstance.restart(words);
  }
}

function renderExperienceItems() {
  const container = document.getElementById('experience-items');
  const t = translations[currentLang];
  if (!container || !t?.experience?.jobs) return;

  container.innerHTML = t.experience.jobs.map((job, i) => `
    <div class="animate-on-scroll ${i % 2 === 0 ? 'from-left' : 'from-right'}" data-delay="${i * 200}">
      <div class="glass-card-hover p-6 md:p-8 relative ml-12 md:ml-16">
        <div class="absolute left-[-34px] top-8 w-4 h-4 bg-lime-500 rounded-full border-4 border-dark-900 z-10 timeline-dot-static"></div>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <h3 class="text-xl font-bold text-lime-400">${job.role}</h3>
          <span class="text-dark-100 text-sm mt-1 md:mt-0">${job.period}</span>
        </div>
        <h4 class="text-lg font-semibold text-dark-50 mb-3">${job.company}</h4>
        <p class="text-dark-100 mb-4">${job.description}</p>
        <div class="flex flex-wrap gap-2">
          ${job.tech.map(t => `<span class="skill-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  const line = container.querySelector('.timeline-line') || container.previousElementSibling?.querySelector('.timeline-line');
}

function renderProjectCards() {
  const container = document.getElementById('project-cards');
  const t = translations[currentLang];
  if (!container || !t?.projects?.items) return;

  container.innerHTML = t.projects.items.map((project, i) => `
    <div class="animate-on-scroll" data-delay="${i * 150}" data-tilt>
      <div class="glass-card-hover overflow-hidden group">
        <div class="h-48 bg-gradient-to-br from-lime-500/20 via-dark-500 to-dark-700 relative overflow-hidden">
          <div class="absolute inset-0 bg-grid-pattern opacity-30"></div>
          <div class="absolute top-4 left-4">
            <span class="px-3 py-1 bg-lime-500/20 text-lime-400 text-xs font-semibold rounded-full border border-lime-500/30">${project.category}</span>
          </div>
          <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a href="${project.link}" class="btn-primary text-sm px-4 py-2">${t.projects.viewProject}</a>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-dark-50 mb-2 group-hover:text-lime-400 transition-colors">${project.title}</h3>
          <p class="text-dark-100 text-sm mb-4">${project.description}</p>
          <div class="flex flex-wrap gap-2">
            ${project.tech.map(t => `<span class="text-xs px-2 py-1 bg-dark-500/50 text-lime-400 rounded-md">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderEducationItems() {
  const container = document.getElementById('education-items');
  const t = translations[currentLang];
  if (!container || !t?.education?.items) return;

  container.innerHTML = t.education.items.map((item, i) => {
    const icon = item.type === 'master' ? '🎓' :
                 item.type === 'degree' ? '🏫' : '📜';

    return `
    <div class="animate-on-scroll" data-delay="${i * 200}">
      <div class="glass-card-hover p-6 md:p-8 flex items-start gap-4">
        <div class="text-4xl flex-shrink-0">${icon}</div>
        <div class="flex-1">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
            <h3 class="text-lg font-bold text-lime-400">${item.title}</h3>
            <span class="text-dark-100 text-sm">${item.period}</span>
          </div>
          <h4 class="text-dark-50 font-semibold mb-2">${item.institution}</h4>
          <p class="text-dark-100 text-sm">${item.description}</p>
        </div>
      </div>
    </div>
  `}).join('');
}

function renderDynamicContent() {
  renderExperienceItems();
  renderProjectCards();
  renderEducationItems();
}

function reinitAnimations() {
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.classList.remove('visible');
    el.style.transitionDelay = '';
  });

  if (typeof ScrollAnimations !== 'undefined') {
    new ScrollAnimations();
  }
  if (typeof CountUpAnimation !== 'undefined') {
    new CountUpAnimation();
  }
  if (typeof TiltEffect !== 'undefined') {
    new TiltEffect();
  }
}

function initNavbar() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.remove('active');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initApp() {
  setLanguage(currentLang);
  new Navigation();
  new SmoothScroll();
  initNavbar();

  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const t = translations[currentLang];
    const words = t?.hero?.typewriterWords || ['Data Analyst', 'Data Scientist', 'Deep Learning', 'Investigación de Operaciones'];
    typewriterInstance = new TypeWriter(typewriterEl, words, 2500);
  }

  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const newLang = currentLang === 'es' ? 'en' : 'es';
      setLanguage(newLang);
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', initApp);
