/* VELUNTU - Individual Destination Controller & Filter Logic */

let currentCountryId = 'egito';
let currentCategoryFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  // Determine country from URL parameter or page data attribute
  const urlParams = new URLSearchParams(window.location.search);
  const countryParam = urlParams.get('country') || document.body.getAttribute('data-country') || 'egito';
  
  loadDestinationPage(countryParam);
  initCategoryFilters();
});

function loadDestinationPage(countryId) {
  const data = VELUNTU_DATA.destinations[countryId];
  if (!data) return;

  currentCountryId = countryId;

  // Render Hero Data
  const heroTitle = document.getElementById('destHeroTitle');
  const heroSub = document.getElementById('destHeroSubtitle');
  const heroCoords = document.getElementById('destHeroCoords');
  const heroImg = document.getElementById('destHeroImg');
  const heroQuote = document.getElementById('destHeroQuote');
  const heroRegion = document.getElementById('destHeroRegion');

  if (heroTitle) heroTitle.innerText = data.name;
  if (heroSub) heroSub.innerText = data.subtitle;
  if (heroCoords) heroCoords.innerText = `${data.coords} • ${data.region}`;
  if (heroImg) {
    heroImg.src = data.heroImage;
    heroImg.alt = `Atmosfera de ${data.name}`;
  }
  if (heroQuote) heroQuote.innerText = `"${data.quote}"`;
  if (heroRegion) heroRegion.innerText = data.region;

  // Render Cultural Context
  const contextIntro = document.getElementById('destCultureIntro');
  const contextPoints = document.getElementById('destCulturePoints');

  if (contextIntro) contextIntro.innerText = data.culturalContext.intro;
  if (contextPoints) {
    contextPoints.innerHTML = data.culturalContext.keyPoints.map(pt => `
      <li style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px;">
        <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700;">&mdash;</span>
        <span style="color: var(--text-secondary); font-size: 0.95rem;">${pt}</span>
      </li>
    `).join('');
  }

  // Render Places (Asymmetrical)
  const placesGrid = document.getElementById('destPlacesGrid');
  if (placesGrid) {
    placesGrid.innerHTML = data.places.map((place, idx) => {
      const isCairoGize = place.name.toLowerCase().includes('cairo') || place.name.toLowerCase().includes('gizé');
      return `
        <article class="place-card-asymmetric" ${isCairoGize ? 'style="cursor: pointer;" onclick="window.location.href=\'cairo-gize.html\';"' : ''}>
          <div class="place-img-frame">
            <img class="place-img" src="${place.img}" alt="${place.name}" loading="lazy" />
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="editorial-tag">Lugar Notável 0${idx + 1}</span>
            <span class="mono-meta">${place.coords}</span>
          </div>
          <h3 style="font-size: 1.5rem;">${place.name}</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${place.desc}</p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
            ${isCairoGize ? `<a href="cairo-gize.html" class="btn-editorial" style="padding: 6px 12px; font-size: 0.72rem;">Ver Pacotes de Viagem &rarr;</a>` : ''}
            <button class="btn-editorial-secondary" style="padding: 6px 12px; font-size: 0.72rem;" onclick="event.stopPropagation(); saveToNotebook('${place.name} (${data.name})')">
              Salvar no Caderno PWA &plus;
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  // Render Initial Experiences (All)
  renderExperiences('all');

  // Render Next Destination Footer Link
  const nextNav = document.getElementById('nextDestNav');
  if (nextNav) {
    const keys = Object.keys(VELUNTU_DATA.destinations);
    const currentIndex = keys.indexOf(countryId);
    const nextKey = keys[(currentIndex + 1) % keys.length];
    const nextData = VELUNTU_DATA.destinations[nextKey];

    nextNav.innerHTML = `
      <div class="container next-dest-grid">
        <div>
          <span class="mono-meta" style="color: #A09D95;">PRÓXIMO DESTINO EDITORIAL</span>
          <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-light);">
            Descubra ${nextData.name}
          </h4>
        </div>
        <a href="destino.html?country=${nextKey}" class="next-dest-link">
          <span class="next-dest-title">${nextData.name} &rarr;</span>
          <span class="mono-meta" style="color: #DDD9D0;">${nextData.subtitle}</span>
        </a>
      </div>
    `;
  }
}

let selectedCategories = ['all'];

function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.category-pill-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.currentTarget.getAttribute('data-category');

      if (category === 'all') {
        selectedCategories = ['all'];
      } else {
        // Remover 'all' se estiver selecionado
        selectedCategories = selectedCategories.filter(c => c !== 'all');

        const index = selectedCategories.indexOf(category);
        if (index > -1) {
          selectedCategories.splice(index, 1);
        } else {
          selectedCategories.push(category);
        }

        // Se nada for selecionado, volta para 'all'
        if (selectedCategories.length === 0) {
          selectedCategories = ['all'];
        }
      }

      // Atualizar classes ativas
      filterBtns.forEach(b => {
        const cat = b.getAttribute('data-category');
        if (selectedCategories.includes(cat)) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      renderExperiences(selectedCategories);
    });
  });
}

function renderExperiences(categoriesFilter) {
  const container = document.getElementById('destExperiencesGrid');
  const destination = VELUNTU_DATA.destinations[currentCountryId];

  if (!container || !destination) return;

  let allExps = [];
  const filters = Array.isArray(categoriesFilter) ? categoriesFilter : [categoriesFilter];

  if (filters.includes('all')) {
    Object.keys(destination.categories).forEach(catKey => {
      destination.categories[catKey].forEach(exp => {
        allExps.push({ ...exp, categoryKey: catKey });
      });
    });
  } else {
    filters.forEach(catKey => {
      const matched = destination.categories[catKey] || [];
      matched.forEach(exp => {
        allExps.push({ ...exp, categoryKey: catKey });
      });
    });
  }

  if (allExps.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center; background: var(--bg-secondary); border-radius: 4px;">
        <span class="mono-meta">SEM REGISTROS NA CATEGORIA SELECIONADA</span>
      </div>
    `;
    return;
  }

  container.innerHTML = allExps.map(exp => `
    <article class="exp-editorial-block">
      <div>
        <div class="exp-header">
          <span class="editorial-tag">${getCategoryName(exp.categoryKey)}</span>
          <span class="mono-meta">${exp.duration}</span>
        </div>
        <h3 class="exp-title">${exp.title}</h3>
        <p class="exp-desc">${exp.desc}</p>
      </div>

      <div class="exp-meta-bar">
        <span class="mono-meta" style="font-weight: 700;">${exp.format}</span>
        <button class="btn-editorial-secondary" style="padding: 6px 12px; font-size: 0.7rem;" onclick="saveToNotebook('${exp.title} - ${destination.name}')">
          Guardar &plus;
        </button>
      </div>
    </article>
  `).join('');
}

function getCategoryName(key) {
  const map = {
    historia: 'História',
    cultura: 'Cultura',
    aventura: 'Aventura',
    gastronomia: 'Gastronomia',
    natureza: 'Natureza',
    'vida-selvagem': 'Vida Selvagem'
  };
  return map[key] || key;
}
