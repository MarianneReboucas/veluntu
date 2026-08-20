/* VELUNTU - Main Application Logic & PWA Lifecycle */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initInterestsSection();
  initNarrativesSection();
  initPWAServiceWorker();
});

/* Mobile Menu Drawer */
function initMobileNav() {
  const toggleBtn = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (!toggleBtn || !mobileNav) return;

  toggleBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    toggleBtn.classList.toggle('active');
  });

  // Close nav when clicking a link
  document.querySelectorAll('.mobile-nav-item').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  });
}

/* Interests Explorer Component */
function initInterestsSection() {
  const grid = document.getElementById('interestsGrid');
  if (!grid) return;

  grid.innerHTML = VELUNTU_DATA.interests.map(item => `
    <div class="interest-card" onclick="openInterestDetail('${item.id}')">
      <img class="interest-card-bg" src="${item.img}" alt="${item.title}" loading="lazy" />
      <div>
        <span class="interest-number">${item.number}</span>
        <h3 class="interest-title">${item.title}</h3>
        <p class="interest-description">${item.description}</p>
      </div>
      <div class="interest-footer">
        <span class="interest-link">Explorar Perspectiva &rarr;</span>
        <span class="mono-meta">${item.snippets.length} Eixos</span>
      </div>
    </div>
  `).join('');
}

/* Editorial Vignettes / Narratives */
function initNarrativesSection() {
  const grid = document.getElementById('narrativesGrid');
  if (!grid) return;

  grid.innerHTML = VELUNTU_DATA.narratives.map(item => `
    <article class="narrative-item">
      <div class="narrative-img-frame">
        <img class="narrative-img" src="${item.img}" alt="${item.title}" loading="lazy" />
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
        <span class="editorial-tag">${item.country}</span>
        <span class="mono-meta">${item.category}</span>
      </div>
      <h3 class="narrative-title">${item.title}</h3>
      <p class="narrative-snippet">${item.snippet}</p>
      <span class="mono-meta">${item.date}</span>
    </article>
  `).join('');
}

/* Country Dossier Full Viewer Modal */
function openDossierModal(countryId) {
  const modal = document.getElementById('dossierModal');
  const data = VELUNTU_DATA.destinations[countryId];

  if (!modal || !data) return;

  const content = document.getElementById('dossierModalContent');
  content.innerHTML = `
    <div class="dossier-hero">
      <img class="dossier-hero-bg" src="${data.heroImage}" alt="${data.name}" />
      <div class="container dossier-hero-content">
        <span class="mono-meta" style="color: var(--text-light);">${data.coords} • ${data.region}</span>
        <h1 class="dossier-hero-title">${data.name}</h1>
        <p style="color: #DDD9D0; font-size: 1.2rem; font-family: var(--font-serif); font-style: italic;">
          "${data.quote}"
        </p>
      </div>
    </div>

    <div class="container dossier-body">
      <div class="dossier-section-grid">
        <aside class="dossier-sidebar">
          <div class="dossier-fact-box">
            <span class="mono-meta">Recomendação Editorial</span>
            <strong style="font-size: 0.9rem;">Melhor Época de Viagem</strong>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${data.bestSeason}</p>
          </div>

          <div class="dossier-fact-box">
            <span class="mono-meta">Coordenadas & Bioma</span>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${data.coords}</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${data.region}</p>
          </div>

          <button class="btn-editorial" style="width: 100%; justify-content: center;" onclick="saveToNotebook('${data.name}')">
            Salvar no Caderno PWA &plus;
          </button>
        </aside>

        <main class="dossier-main-content">
          <div class="dossier-block">
            <span class="editorial-tag">Visão Geral & Filosofia</span>
            <h2 style="margin-top: 12px; margin-bottom: 16px;">Síntese do Território</h2>
            <p style="font-size: 1.1rem; line-height: 1.8;">${data.summary}</p>
          </div>

          <div class="dossier-block">
            <span class="editorial-tag">Pilares da Experiência</span>
            <h3 style="margin-top: 12px; margin-bottom: 20px;">Destaques Investigativos</h3>
            <div style="display: grid; gap: 20px;">
              ${data.keyHighlights.map(h => `
                <div style="background: var(--bg-card); padding: 20px; border-left: 3px solid var(--text-primary); border-radius: 2px;">
                  <h4 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 6px;">${h.title}</h4>
                  <p style="font-size: 0.95rem; color: var(--text-secondary);">${h.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="dossier-block" style="background: var(--bg-secondary); padding: 30px; border-radius: 4px;">
            <span class="mono-meta">Dimensão Cultural</span>
            <p style="font-family: var(--font-serif); font-size: 1.3rem; margin-top: 10px; color: var(--text-primary);">
              "${data.cultureSnippet}"
            </p>
          </div>
        </main>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDossierModal() {
  const modal = document.getElementById('dossierModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

/* Interest Detail View */
function openInterestDetail(interestId) {
  const item = VELUNTU_DATA.interests.find(i => i.id === interestId);
  if (!item) return;

  alert(`[Exploração de Interesse: ${item.title}]\n\n${item.description}\n\nEixos inclusos:\n• ${item.snippets.join('\n• ')}`);
}

/* Save to PWA Notebook */
function saveToNotebook(itemTitle) {
  let notebook = JSON.parse(localStorage.getItem('veluntu_notebook') || '[]');
  if (!notebook.includes(itemTitle)) {
    notebook.push(itemTitle);
    localStorage.setItem('veluntu_notebook', JSON.stringify(notebook));
    alert(`"${itemTitle}" foi guardado no seu Caderno de Viagem PWA (salvo para acesso offline).`);
  } else {
    alert(`"${itemTitle}" já está no seu Caderno de Viagem.`);
  }
}

/* PWA Service Worker & Install Handler */
let deferredPrompt = null;

function initPWAServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Veluntu PWA Service Worker Registrado com sucesso.', reg.scope))
      .catch(err => console.log('Falha no Service Worker:', err));
  }

  // Handle Online/Offline Status
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // Handle PWA Install Prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) banner.classList.add('show');
  });
}

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação do PWA');
      }
      deferredPrompt = null;
      dismissPWABanner();
    });
  }
}

function dismissPWABanner() {
  const banner = document.getElementById('pwaInstallBanner');
  if (banner) banner.classList.remove('show');
}

function updateOnlineStatus() {
  const banner = document.getElementById('offlineBanner');
  if (banner) {
    if (!navigator.onLine) {
      banner.classList.add('visible');
    } else {
      banner.classList.remove('visible');
    }
  }
}
