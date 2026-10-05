/* ═══════════════════════════════════════════════
   GarimaOS Portfolio — script.js
   Navigation · Terminal · Theme · Search · Animations
═══════════════════════════════════════════════ */

'use strict';

/* ─── NAVIGATION ─── */
const sidebar     = document.getElementById('sidebar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.querySelectorAll('.sidebar__link');
const pages       = document.querySelectorAll('.page');
const casePanels  = document.querySelectorAll('.case-study');

function showPage(id) {
  // Hide all pages & case studies
  pages.forEach(p => p.classList.remove('active'));
  casePanels.forEach(c => c.classList.remove('active'));

  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    // Show the projects page wrapper but not the projects list when case study opens
    if (id.startsWith('case-')) {
      document.getElementById('projects').classList.add('active');
    }
  }

  // Highlight active nav link
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.dataset.page === id || (id.startsWith('case-') && l.dataset.page === 'projects')) {
      l.classList.add('active');
    }
  });

  // Scroll to top
  document.querySelector('.main').scrollTo({ top: 0, behavior: 'instant' });

  // Run stats counter on home
  if (id === 'home') initCounters();
}

// Sidebar nav clicks
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;
    showPage(page);
    if (window.innerWidth <= 768) closeSidebar();
  });
});

// Inline nav buttons (data-nav attribute)
document.addEventListener('click', e => {
  const el = e.target.closest('[data-nav]');
  if (el) {
    e.preventDefault();
    showPage(el.dataset.nav);
  }

  // Case study open
  const openBtn = e.target.closest('[data-open]');
  if (openBtn) {
    e.preventDefault();
    const id = 'case-' + openBtn.dataset.open;
    // Hide projects list, show case study
    document.getElementById('projectsMain').style.display = 'none';
    document.getElementById(id).classList.add('active');
    document.getElementById('projects').classList.add('active');
    pages.forEach(p => { if (p.id !== 'projects') p.classList.remove('active'); });
    document.querySelector('.main').scrollTo({ top: 0, behavior: 'instant' });
  }

  // Case study close
  const closeBtn = e.target.closest('[data-close]');
  if (closeBtn) {
    e.preventDefault();
    casePanels.forEach(c => c.classList.remove('active'));
    document.getElementById('projectsMain').style.display = '';
    document.getElementById('projects').classList.add('active');
    document.querySelector('.main').scrollTo({ top: 0, behavior: 'instant' });
  }

  // Work card click → projects page
  const workCard = e.target.closest('.work-card');
  if (workCard && !e.target.closest('.work-card__link')) {
    showPage('projects');
  }
});

/* ─── HAMBURGER ─── */
function openSidebar()  { sidebar.classList.add('open'); }
function closeSidebar() { sidebar.classList.remove('open'); }

hamburger.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', e => {
  if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      closeSidebar();
    }
  }
});

/* ─── THEME SWITCHER ─── */
const themeSelect = document.getElementById('themeSelect');

themeSelect.addEventListener('change', () => {
  document.documentElement.dataset.theme = themeSelect.value;
  localStorage.setItem('gos-theme', themeSelect.value);
});

// Restore saved theme
const savedTheme = localStorage.getItem('gos-theme');
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
  themeSelect.value = savedTheme;
}

/* ─── PROJECT FILTERS ─── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectRows  = document.querySelectorAll('.project-row');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectRows.forEach(row => {
      if (filter === 'all' || row.dataset.category === filter) {
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    });
  });
});

/* ─── COUNTER ANIMATION ─── */
function initCounters() {
  document.querySelectorAll('.count').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1200;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 16);
  });
}

/* ─── SEARCH ─── */
const searchTrigger  = document.getElementById('searchTrigger');
const searchModal    = document.getElementById('searchModal');
const searchBackdrop = document.getElementById('searchBackdrop');
const searchInput    = document.getElementById('searchInput');
const searchResults  = document.getElementById('searchResults');

const SEARCH_INDEX = [
  { icon: '🏠', title: 'Home',          sub: 'Overview, stats, featured work',               page: 'home'     },
  { icon: '👤', title: 'About',         sub: 'Story, education, toolkit, principles',         page: 'about'    },
  { icon: '🗄️', title: 'Projects',      sub: 'All 6 data & AI projects',                     page: 'projects' },
  { icon: '⌨️', title: 'Terminal',      sub: 'Interactive CLI for portfolio exploration',     page: 'terminal' },
  { icon: '✉️', title: 'Contact',       sub: 'Email, LinkedIn, GitHub, Medium, Resume',      page: 'contact'  },
  { icon: '✍️', title: 'Medium',        sub: '10+ articles on data, AI, ML, SQL',             page: 'medium'   },
  { icon: '🤖', title: 'RAG Chatbot on Google Cloud', sub: 'Behind the scenes — Medium article', page: 'medium' },
  { icon: '🧠', title: 'Multi-Agent System', sub: 'AI research report generation — Medium',    page: 'medium'   },
  { icon: '📄', title: 'Document Portal RAG', sub: 'Enterprise RAG system, FastAPI, LangChain', page: 'projects' },
  { icon: '📈', title: 'Customer Churn & LTV', sub: 'ML platform, Scikit-learn, Power BI',    page: 'projects' },
  { icon: '🤖', title: 'AI Production Assistant', sub: 'LLM agents, LangChain automation',   page: 'projects' },
  { icon: '🧬', title: "Alzheimer's Prediction", sub: '74K patient records, Random Forest',   page: 'projects' },
  { icon: '🗺️', title: 'Pedestrian Accessibility', sub: 'GIS, Folium maps, Power BI',        page: 'projects' },
  { icon: '🚌', title: 'Bus Transit Optimisation', sub: 'MIP, Operations Research',           page: 'projects' },
  { icon: '⚡', title: 'Python / SQL',  sub: 'Core analytics skills',                        page: 'about'    },
  { icon: '☁️', title: 'Azure Stack',   sub: 'ADF, Databricks, OpenAI, AI Search',           page: 'about'    },
  { icon: '📊', title: 'Power BI',      sub: 'DAX, Tableau, executive dashboards',           page: 'about'    },
  { icon: '🔗', title: 'LangChain / RAG', sub: 'Pinecone, ChromaDB, Azure AI Search',        page: 'about'    },
  { icon: '❄️', title: 'Snowflake / dbt', sub: 'Data warehouse + transformation pipelines',  page: 'about'    },
];

function renderResults(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    searchResults.innerHTML = '';
    return;
  }
  const matches = SEARCH_INDEX.filter(item =>
    item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)
  );
  if (!matches.length) {
    searchResults.innerHTML = `<div style="padding:20px 16px;color:var(--text-3);font-size:13px;">No results for "${query}"</div>`;
    return;
  }
  searchResults.innerHTML = matches.map((item, i) => `
    <div class="search-result" data-page="${item.page}" tabindex="0">
      <div class="search-result__icon">${item.icon}</div>
      <div>
        <div class="search-result__title">${item.title}</div>
        <div class="search-result__sub">${item.sub}</div>
      </div>
    </div>
  `).join('');

  searchResults.querySelectorAll('.search-result').forEach(r => {
    r.addEventListener('click', () => {
      closeSearch();
      showPage(r.dataset.page);
    });
  });
}

function openSearch() {
  searchModal.classList.add('open');
  setTimeout(() => searchInput.focus(), 50);
}

function closeSearch() {
  searchModal.classList.remove('open');
  searchInput.value = '';
  searchResults.innerHTML = '';
}

searchTrigger.addEventListener('click', openSearch);
searchBackdrop.addEventListener('click', closeSearch);
searchInput.addEventListener('input', () => renderResults(searchInput.value));

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchModal.classList.contains('open') ? closeSearch() : openSearch();
  }
  if (e.key === 'Escape') closeSearch();
});

/* ─── TERMINAL ─── */
const termBody  = document.getElementById('terminalBody');
const termInput = document.getElementById('termInput');

const TERMINAL_COMMANDS = {
  help: () => `
<div class="term-output" style="margin-bottom:4px">
<span style="color:var(--accent)">Available commands:</span>
</div>
<div class="term-output">  whoami         → About Garima</div>
<div class="term-output">  stack          → Full technical stack</div>
<div class="term-output">  stack --ai     → AI & RAG skills</div>
<div class="term-output">  stack --data   → Data engineering skills</div>
<div class="term-output">  stack --bi     → BI & visualisation</div>
<div class="term-output">  projects       → List all projects</div>
<div class="term-output">  medium         → Medium articles</div>
<div class="term-output">  experience     → Work history</div>
<div class="term-output">  education      → Academic background</div>
<div class="term-output">  contact        → Contact information</div>
<div class="term-output">  status         → Current availability</div>
<div class="term-output">  clear          → Clear terminal</div>`,

  whoami: () => `
<div class="term-output term-output--accent">Garima Narang</div>
<div class="term-output">Data Analyst · Business Analyst · AI Engineer · Brampton, ON 🇨🇦</div>
<div class="term-output"> </div>
<div class="term-output">7+ years building analytics pipelines, enterprise BI dashboards,</div>
<div class="term-output">and AI data products across supply chain, finance, and operations.</div>
<div class="term-output"> </div>
<div class="term-output">Currently at <span style="color:var(--accent)">OpenText</span> — delivered a production RAG application</div>
<div class="term-output">on Azure OpenAI + Pinecone + LangChain.</div>`,

  stack: () => `
<div class="term-output term-output--accent">Full Technical Stack</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">Languages    </span>  Python · SQL · R</div>
<div class="term-output"><span style="color:var(--text)">Platforms    </span>  Snowflake · SQL Server · Databricks · Oracle</div>
<div class="term-output"><span style="color:var(--text)">Pipelines    </span>  Azure Data Factory · dbt · Airflow · ETL/ELT</div>
<div class="term-output"><span style="color:var(--text)">AI / RAG     </span>  Azure OpenAI · LangChain · Pinecone · ChromaDB</div>
<div class="term-output"><span style="color:var(--text)">BI           </span>  Power BI · DAX · Tableau · Power Query</div>
<div class="term-output"><span style="color:var(--text)">Cloud        </span>  Azure · AWS (ECS, Fargate, S3)</div>
<div class="term-output"><span style="color:var(--text)">ML           </span>  Scikit-learn · XGBoost · MLflow · Pandas · Spark</div>`,

  'stack --ai': () => `
<div class="term-output term-output--accent">AI & RAG Stack</div>
<div class="term-output"> </div>
<div class="term-output">+ Azure OpenAI (GPT-4, embeddings)</div>
<div class="term-output">+ Azure AI Search (hybrid retrieval)</div>
<div class="term-output">+ Pinecone (vector database)</div>
<div class="term-output">+ ChromaDB (local vector store)</div>
<div class="term-output">+ LangChain (orchestration, agents, chains)</div>
<div class="term-output">+ Gemini Vision (multimodal document parsing)</div>
<div class="term-output">+ DeepEval (RAG quality evaluation)</div>
<div class="term-output">+ MLflow (model lifecycle management)</div>`,

  'stack --data': () => `
<div class="term-output term-output--accent">Data Engineering Stack</div>
<div class="term-output"> </div>
<div class="term-output">+ Python (Pandas, PySpark, SQLAlchemy)</div>
<div class="term-output">+ SQL (complex queries, stored procedures, tuning)</div>
<div class="term-output">+ Azure Data Factory (pipeline orchestration)</div>
<div class="term-output">+ dbt (data transformations, testing, lineage)</div>
<div class="term-output">+ Apache Airflow (workflow scheduling)</div>
<div class="term-output">+ Databricks (Spark compute, Delta Lake)</div>
<div class="term-output">+ Snowflake (data warehouse, performance tuning)</div>
<div class="term-output">+ SAP · Salesforce · SQL Server (source systems)</div>`,

  'stack --bi': () => `
<div class="term-output term-output--accent">BI & Visualisation Stack</div>
<div class="term-output"> </div>
<div class="term-output">+ Power BI (reports, dashboards, dataflows)</div>
<div class="term-output">+ DAX (calculated measures, KPIs, time intelligence)</div>
<div class="term-output">+ Power Query / M (data shaping, transformation)</div>
<div class="term-output">+ Tableau (executive dashboards, drill-through)</div>
<div class="term-output">+ Folium (interactive geospatial maps)</div>
<div class="term-output">+ Plotly / Matplotlib (Python visualisations)</div>`,

  projects: () => `
<div class="term-output term-output--accent">Projects (6 total)</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">#1</span> Document Portal — Enterprise RAG System</div>
<div class="term-output term-output--muted">   FastAPI · LangChain · ChromaDB · Docker · AWS</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">#2</span> Customer Churn & LTV Platform</div>
<div class="term-output term-output--muted">   Python · Scikit-learn · XGBoost · Power BI</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">#3</span> AI Production Assistant</div>
<div class="term-output term-output--muted">   Python · LLMs · AI Agents · LangChain</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">#4</span> Alzheimer's Disease Prediction</div>
<div class="term-output term-output--muted">   74,283 records · Random Forest · Power BI</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">#5</span> Pedestrian Accessibility in Cayuga</div>
<div class="term-output term-output--muted">   GIS · Folium · Power BI · Urban Planning</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">#6</span> Bus Transit Schedule Optimisation</div>
<div class="term-output term-output--muted">   MIP · Python · Operations Research</div>`,

  experience: () => `
<div class="term-output term-output--accent">Work History</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">Jan 2026 – Present</span>  |  Senior Data Analyst</div>
<div class="term-output term-output--muted">   OpenText · Canada (Fixed Term)</div>
<div class="term-output term-output--muted">   Snowflake · Azure · RAG · Power BI · Python</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">Jun 2020 – Mar 2024</span>  |  Data Analyst & Project Lead</div>
<div class="term-output term-output--muted">   Revelin7 · Bengaluru, India</div>
<div class="term-output term-output--muted">   ADF · Databricks · Snowflake · dbt · Power BI</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">Apr 2017 – Jun 2020</span>  |  Data Analyst</div>
<div class="term-output term-output--muted">   Tech Mahindra · India</div>
<div class="term-output term-output--muted">   SQL · Python · Power BI · Tableau · Supply Chain</div>`,

  education: () => `
<div class="term-output term-output--accent">Education</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">Oct 2024 – Mar 2026</span></div>
<div class="term-output">Master of Data Analytics</div>
<div class="term-output term-output--muted">University of Niagara Falls Canada</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">Jul 2012 – May 2014</span></div>
<div class="term-output">MTech, Computer Science</div>
<div class="term-output term-output--muted">YIET · India</div>`,

  contact: () => `
<div class="term-output term-output--accent">Contact Information</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">Email     </span>  naranggarima351@gmail.com</div>
<div class="term-output"><span style="color:var(--text)">Phone     </span>  +1 437-566-3094</div>
<div class="term-output"><span style="color:var(--text)">Location  </span>  Brampton, Ontario, Canada 🇨🇦</div>
<div class="term-output"><span style="color:var(--text)">LinkedIn  </span>  linkedin.com/in/garima-narang-canada</div>
<div class="term-output"><span style="color:var(--text)">GitHub    </span>  github.com/Narang-Garima</div>`,

  status: () => `
<div class="term-output term-output--green">● OPEN TO OPPORTUNITIES</div>
<div class="term-output"> </div>
<div class="term-output">Actively seeking roles in:</div>
<div class="term-output">  → Data Analyst</div>
<div class="term-output">  → Business Analyst</div>
<div class="term-output">  → AI Engineer</div>
<div class="term-output"> </div>
<div class="term-output term-output--muted">Location: Canada (Brampton, ON)</div>
<div class="term-output term-output--muted">Contact: naranggarima351@gmail.com</div>`,

  medium: () => `
<div class="term-output term-output--accent">Medium Articles (10+)</div>
<div class="term-output term-output--muted">medium.com/@garimanarang2407</div>
<div class="term-output"> </div>
<div class="term-output"><span style="color:var(--text)">★</span> Behind the Scenes: A RAG Chatbot on Google Cloud</div>
<div class="term-output"><span style="color:var(--text)">★</span> Building an Intelligent Multi-Agent System</div>
<div class="term-output">  From Bytes to Better Cities: Big Data & Urban Intelligence</div>
<div class="term-output">  Conquering the Curse of Dimensionality (PCA)</div>
<div class="term-output">  The Last-Minute K-Means Clustering Revision Sheet</div>
<div class="term-output">  Last Minute: Machine Learning Lifecycle</div>
<div class="term-output">  SQL Interview Prep: Mastering Weight Grouping Questions</div>
<div class="term-output">  I Was So Lost: My Journey from Data Newbie to Getting It</div>
<div class="term-output">  My Journey Solving the Stock Profit Problem</div>
<div class="term-output">  Breaking Down the Matrix Reshape Problem</div>`,

  'skills --ai': () => TERMINAL_COMMANDS['stack --ai'](),
  'skills --data': () => TERMINAL_COMMANDS['stack --data'](),
};

function appendLine(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  // Insert before the last prompt line
  const lastLine = termBody.lastElementChild;
  termBody.insertBefore(div, lastLine);
  termBody.scrollTop = termBody.scrollHeight;
}

function handleTerminalInput(rawInput) {
  const input = rawInput.trim().toLowerCase();
  if (!input) return;

  // Echo the command
  appendLine(`<div class="term-line"><span class="term-prompt">garima@dataos:~$</span> <span class="term-cmd">${escapeHtml(rawInput.trim())}</span></div>`);

  if (input === 'clear') {
    termBody.innerHTML = `
      <div class="term-line term-line--welcome">Welcome to GarimaOS Terminal. Type <span class="term-cmd">help</span> to begin.</div>
      <div class="term-line"><span class="term-prompt">garima@dataos:~$</span> <span class="term-cursor-blink">█</span></div>`;
    return;
  }

  const handler = TERMINAL_COMMANDS[input];
  if (handler) {
    appendLine(`<div style="margin:4px 0 8px">${handler()}</div>`);
  } else {
    appendLine(`<div class="term-output term-output--error">command not found: ${escapeHtml(rawInput.trim())}. Type <span style="color:var(--accent)">help</span> for available commands.</div>`);
  }
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Command history
let cmdHistory = [];
let historyIdx = -1;

termInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = termInput.value;
    if (val.trim()) {
      cmdHistory.unshift(val);
      historyIdx = -1;
    }
    handleTerminalInput(val);
    termInput.value = '';
    e.preventDefault();
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIdx < cmdHistory.length - 1) {
      historyIdx++;
      termInput.value = cmdHistory[historyIdx];
    }
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIdx > 0) {
      historyIdx--;
      termInput.value = cmdHistory[historyIdx];
    } else {
      historyIdx = -1;
      termInput.value = '';
    }
  }
});

// Focus terminal input when terminal page is active
const terminalPage = document.getElementById('terminal');
const termObserver = new MutationObserver(() => {
  if (terminalPage.classList.contains('active')) {
    setTimeout(() => termInput.focus(), 100);
  }
});
termObserver.observe(terminalPage, { attributes: true, attributeFilter: ['class'] });

/* ─── INIT ─── */
// Show home page on load
showPage('home');
