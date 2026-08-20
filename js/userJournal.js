/* VELUNTU - Gerenciador de "Minha Coleção" e "Minha Jornada" (PWA Offline LocalStorage) */

class VeluntuUserJournal {
  constructor() {
    this.collectionKey = 'veluntu_user_collection';
    this.journeyKey = 'veluntu_user_journey';
    this.collection = this.loadData(this.collectionKey) || this.getDefaultPreset();
    this.journey = this.loadData(this.journeyKey) || [];
    this.init();
  }

  getDefaultPreset() {
    // Elegant default preset to inspire new users
    return [
      {
        id: 'preset-table-mountain',
        title: 'Table Mountain & Bioma Fynbos',
        country: 'África do Sul',
        countryId: 'africa-do-sul',
        category: 'Natureza',
        location: 'Cidade do Cabo',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        desc: 'Escarpas dramáticas e o reino floral mais rico do planeta abraçando o Oceano Atlântico.'
      },
      {
        id: 'preset-siwa',
        title: 'Oásis de Siwa & Fortaleza Shali',
        country: 'Egito',
        countryId: 'egito',
        category: 'História',
        location: 'Deserto Ocidental',
        img: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800&auto=format&fit=crop',
        desc: 'Arquitetura ancestral em Kershef (sal e argila) e águas termais cristalinas.'
      }
    ];
  }

  loadData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Erro ao carregar dados do localStorage:', e);
      return null;
    }
  }

  saveData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Erro ao salvar dados no localStorage:', e);
    }
  }

  init() {
    this.bindEvents();
    this.renderUI();
  }

  bindEvents() {
    // Listen for tab switching inside the Collection & Journey Modal
    document.querySelectorAll('.journal-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.journal-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const view = e.currentTarget.getAttribute('data-view');
        document.querySelectorAll('.journal-view-panel').forEach(panel => panel.style.display = 'none');
        
        const targetPanel = document.getElementById(view === 'collection' ? 'journalCollectionView' : 'journalJourneyView');
        if (targetPanel) targetPanel.style.display = 'block';
      });
    });
  }

  /* Collection Methods */
  toggleCollection(item) {
    const existsIndex = this.collection.findIndex(i => i.title === item.title || i.id === item.id);

    if (existsIndex > -1) {
      this.collection.splice(existsIndex, 1);
      this.notifyUser(`"${item.title}" foi removido da sua Coleção.`);
    } else {
      const newItem = {
        id: item.id || 'item-' + Date.now(),
        title: item.title,
        country: item.country || item.countryName || 'Continente Africano',
        countryId: item.countryId || 'egito',
        category: item.category || item.categoryLabel || 'Experiência',
        location: item.location || item.locationName || 'Território Registrado',
        img: item.img || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop',
        desc: item.desc || 'Registro guardado na Coleção PWA.'
      };
      this.collection.push(newItem);
      this.notifyUser(`"${item.title}" foi guardado na sua Coleção PWA.`);
    }

    this.saveData(this.collectionKey, this.collection);
    this.renderUI();
  }

  isInCollection(title) {
    return this.collection.some(i => i.title === title);
  }

  removeFromCollection(id) {
    this.collection = this.collection.filter(i => i.id !== id);
    this.saveData(this.collectionKey, this.collection);
    
    // Also remove from journey if present
    this.removeFromJourney(id);
    this.renderUI();
  }

  /* Journey Methods */
  addToJourney(item) {
    const exists = this.journey.some(i => i.title === item.title || i.id === item.id);
    if (exists) {
      this.notifyUser(`"${item.title}" já faz parte da sua Jornada.`);
      return;
    }

    this.journey.push({ ...item });
    this.saveData(this.journeyKey, this.journey);
    this.notifyUser(`"${item.title}" foi adicionado à sua Jornada.`);
    this.renderUI();
  }

  removeFromJourney(id) {
    this.journey = this.journey.filter(i => i.id !== id);
    this.saveData(this.journeyKey, this.journey);
    this.renderUI();
  }

  moveJourneyItem(index, direction) {
    if (direction === 'up' && index > 0) {
      const temp = this.journey[index];
      this.journey[index] = this.journey[index - 1];
      this.journey[index - 1] = temp;
    } else if (direction === 'down' && index < this.journey.length - 1) {
      const temp = this.journey[index];
      this.journey[index] = this.journey[index + 1];
      this.journey[index + 1] = temp;
    }
    this.saveData(this.journeyKey, this.journey);
    this.renderUI();
  }

  notifyUser(msg) {
    // Toast notification
    let toast = document.getElementById('veluntuToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'veluntuToast';
      toast.className = 'veluntu-toast';
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* UI Renderers */
  renderUI() {
    this.renderCollectionUI();
    this.renderJourneyUI();
    this.updateCounters();
  }

  updateCounters() {
    const collectionCountEls = document.querySelectorAll('.collection-counter-badge');
    const journeyCountEls = document.querySelectorAll('.journey-counter-badge');

    collectionCountEls.forEach(el => el.innerText = this.collection.length);
    journeyCountEls.forEach(el => el.innerText = this.journey.length);
  }

  renderCollectionUI() {
    const container = document.getElementById('collectionItemsContainer');
    if (!container) return;

    if (this.collection.length === 0) {
      container.innerHTML = `
        <div class="journal-empty-state">
          <span class="editorial-tag">Seu Acervo de Descobertas</span>
          <h3 class="journal-empty-title">Sua Coleção está vazia</h3>
          <p class="journal-empty-desc">
            Enquanto explora o continente, guarde lugares, paisagens e vivências que provocam seu interesse tocando no botão "+ Guardar". Eles ficarão preservados aqui para acesso offline.
          </p>
          <a href="index.html#descubra" class="btn-editorial" onclick="closeJournalModal()">
            Explorar Experiências &rarr;
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="journal-cards-grid">
        ${this.collection.map(item => `
          <article class="journal-item-card">
            <div class="journal-card-media">
              <img src="${item.img}" alt="${item.title}" loading="lazy" />
              <span class="editorial-tag" style="position: absolute; top: 10px; left: 10px; background: rgba(18,18,18,0.85); color: #FFF;">
                ${item.country}
              </span>
            </div>
            <div class="journal-card-content">
              <span class="mono-meta">${item.category} • ${item.location}</span>
              <h4 class="journal-card-title">${item.title}</h4>
              <p class="journal-card-desc">${item.desc}</p>

              <div class="journal-card-actions">
                <button class="btn-editorial" style="padding: 6px 12px; font-size: 0.72rem;" onclick="veluntuJournal.addToJourney(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                  &plus; Adicionar à Jornada
                </button>
                <button class="btn-editorial-secondary" style="padding: 6px 10px; font-size: 0.72rem;" onclick="veluntuJournal.removeFromCollection('${item.id}')">
                  Remover
                </button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  }

  renderJourneyUI() {
    const container = document.getElementById('journeyItemsContainer');
    if (!container) return;

    if (this.journey.length === 0) {
      container.innerHTML = `
        <div class="journal-empty-state">
          <span class="editorial-tag">Roteiro Visual Personalizado</span>
          <h3 class="journal-empty-title">Nenhuma experiência em sua Jornada</h3>
          <p class="journal-empty-desc">
            Construa sequencialmente a viagem dos seus sonhos. Selecione itens guardados em sua Coleção e monte uma jornada única com a sequência de lugares que deseja conhecer.
          </p>
          <button class="btn-editorial" onclick="document.querySelector('[data-view=collection]').click()">
            Ver Itens da Minha Coleção &rarr;
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="journey-timeline">
        ${this.journey.map((item, idx) => `
          <div class="journey-step-card">
            <div class="journey-step-number">0${idx + 1}</div>
            <div class="journey-step-img-frame">
              <img src="${item.img}" alt="${item.title}" loading="lazy" />
            </div>
            <div class="journey-step-info">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="editorial-tag">${item.country}</span>
                <span class="mono-meta">${item.category}</span>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1.3rem; margin-top: 4px;">${item.title}</h4>
              <span class="mono-meta" style="color: var(--text-muted);">${item.location}</span>
            </div>

            <div class="journey-step-reorder">
              <button class="reorder-btn" title="Mover para Cima" onclick="veluntuJournal.moveJourneyItem(${idx}, 'up')" ${idx === 0 ? 'disabled' : ''}>
                &uarr;
              </button>
              <button class="reorder-btn" title="Mover para Baixo" onclick="veluntuJournal.moveJourneyItem(${idx}, 'down')" ${idx === this.journey.length - 1 ? 'disabled' : ''}>
                &darr;
              </button>
              <button class="reorder-btn remove" title="Remover da Jornada" onclick="veluntuJournal.removeFromJourney('${item.id}')">
                &times;
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// Global helper functions
let veluntuJournal = null;

document.addEventListener('DOMContentLoaded', () => {
  veluntuJournal = new VeluntuUserJournal();
});

function openJournalModal(view = 'collection') {
  const modal = document.getElementById('journalModal');
  if (!modal) return;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const btn = document.querySelector(`.journal-tab-btn[data-view="${view}"]`);
  if (btn) btn.click();
}

function closeJournalModal() {
  const modal = document.getElementById('journalModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function saveToNotebook(itemTitle, countryName = 'Egito', category = 'Cultura', location = 'Local Notável', img = '') {
  if (!veluntuJournal) return;

  veluntuJournal.toggleCollection({
    id: 'item-' + itemTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    title: itemTitle,
    country: countryName,
    category: category,
    location: location,
    img: img || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    desc: `Experiência guardada a partir do dossiê de ${countryName}.`
  });
}
