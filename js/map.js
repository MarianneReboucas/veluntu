/* VELUNTU - Map & Country Preview Controller */

document.addEventListener('DOMContentLoaded', () => {
  initInteractiveMap();
});

function initInteractiveMap() {
  const countryPaths = document.querySelectorAll('.country-path.featured');
  const countryPins = document.querySelectorAll('.country-pin');
  const filterBtns = document.querySelectorAll('.map-filter-btn');
  const previewCard = document.getElementById('countryPreviewCard');

  if (!previewCard) return;

  // Set default view to Egito or Africa do Sul
  updateCountryPreview('egito');

  // Handle SVG Path clicks & hovers
  countryPaths.forEach(path => {
    path.addEventListener('click', (e) => {
      const countryId = e.currentTarget.getAttribute('data-country');
      setActiveCountry(countryId);
    });
  });

  // Handle Map Pin clicks
  countryPins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      const countryId = e.currentTarget.getAttribute('data-country');
      setActiveCountry(countryId);
    });
  });

  // Handle Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const countryId = e.currentTarget.getAttribute('data-country');
      filterBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      if (countryId !== 'all') {
        setActiveCountry(countryId);
      }
    });
  });
}

function setActiveCountry(countryId) {
  // Update path active state
  document.querySelectorAll('.country-path.featured').forEach(p => {
    if (p.getAttribute('data-country') === countryId) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  // Update pin active state
  document.querySelectorAll('.country-pin').forEach(pin => {
    if (pin.getAttribute('data-country') === countryId) {
      pin.classList.add('active');
    } else {
      pin.classList.remove('active');
    }
  });

  // Update filter buttons
  document.querySelectorAll('.map-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-country') === countryId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Preview Card with subtle transition
  updateCountryPreview(countryId);
}

function updateCountryPreview(countryId) {
  const card = document.getElementById('countryPreviewCard');
  const data = VELUNTU_DATA.destinations[countryId];

  if (!card || !data) return;

  card.classList.add('updating');

  setTimeout(() => {
    card.innerHTML = `
      <div class="country-preview-header">
        <div>
          <span class="mono-meta">${data.coords}</span>
          <h3 class="country-preview-title">${data.name}</h3>
        </div>
        <span class="editorial-tag">${data.region.split('•')[0].trim()}</span>
      </div>

      <div class="country-image-frame">
        <img class="country-image" src="${data.heroImage}" alt="${data.name}" loading="lazy">
      </div>

      <div class="country-tags">
        ${data.tags.map(tag => `<span class="country-tag-pill">${tag}</span>`).join('')}
      </div>

      <p class="country-narrative">${data.summary}</p>

      <blockquote class="country-quote">
        "${data.quote}"
      </blockquote>

      <div style="display: flex; gap: 12px; align-items: center; margin-top: 8px; flex-wrap: wrap;">
        <a class="btn-editorial" href="${data.id}.html">
          Entrar na Página de ${data.name} &rarr;
        </a>
        <button class="btn-editorial-secondary" onclick="openDossierModal('${data.id}')">
          Leitura Rápida
        </button>
      </div>

    `;

    card.classList.remove('updating');
  }, 200);
}
