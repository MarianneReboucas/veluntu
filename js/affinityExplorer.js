/* VELUNTU - Ferramenta de Descoberta Interativa "O que combina com você?" */

class AffinityExplorer {
  constructor() {
    this.selectedInterests = ['aventura', 'natureza']; // Default preset
    this.maxSelections = 3;
    this.init();
  }

  init() {
    this.renderSelectorPills();
    this.bindEvents();
    this.updateRecommendations();
  }

  renderSelectorPills() {
    const container = document.getElementById('affinityPillsContainer');
    if (!container) return;

    const categories = [
      { id: 'historia', label: 'História', subtitle: 'Memória & Arquivos' },
      { id: 'cultura', label: 'Cultura', subtitle: 'Arte & Rituais' },
      { id: 'aventura', label: 'Aventura', subtitle: 'Expedições & Trilhas' },
      { id: 'gastronomia', label: 'Gastronomia', subtitle: 'Terroir & Especiarias' },
      { id: 'natureza', label: 'Natureza', subtitle: 'Ecossistemas & Botânica' },
      { id: 'vida-selvagem', label: 'Vida Selvagem', subtitle: 'Fauna & Conservação' }
    ];

    container.innerHTML = categories.map(cat => {
      const isSelected = this.selectedInterests.includes(cat.id);
      return `
        <button class="affinity-pill ${isSelected ? 'selected' : ''}" data-id="${cat.id}">
          <span class="affinity-pill-check">${isSelected ? '&check;' : '&plus;'}</span>
          <div>
            <strong class="affinity-pill-title">${cat.label}</strong>
            <span class="affinity-pill-sub">${cat.subtitle}</span>
          </div>
        </button>
      `;
    }).join('');
  }

  bindEvents() {
    const container = document.getElementById('affinityPillsContainer');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const pill = e.target.closest('.affinity-pill');
      if (!pill) return;

      const catId = pill.getAttribute('data-id');
      this.toggleInterest(catId);
    });

    const resetBtn = document.getElementById('resetAffinityBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.selectedInterests = [];
        this.renderSelectorPills();
        this.updateRecommendations();
      });
    }
  }

  toggleInterest(catId) {
    const index = this.selectedInterests.indexOf(catId);
    const feedbackMsg = document.getElementById('affinityFeedbackMsg');

    if (index > -1) {
      // Remove
      this.selectedInterests.splice(index, 1);
      if (feedbackMsg) feedbackMsg.style.display = 'none';
    } else {
      // Add if under max limit
      if (this.selectedInterests.length < this.maxSelections) {
        this.selectedInterests.push(catId);
        if (feedbackMsg) feedbackMsg.style.display = 'none';
      } else {
        // Show subtle editorial warning if exceeded limit
        if (feedbackMsg) {
          feedbackMsg.innerText = `Você pode selecionar no máximo ${this.maxSelections} eixos por vez para manter a curadoria focada.`;
          feedbackMsg.style.display = 'block';
        }
        return;
      }
    }

    this.renderSelectorPills();
    this.updateRecommendations();
  }

  /**
   * Future-proof recommendation algorithm:
   * Iterates dynamically through VELUNTU_DATA.destinations (works automatically for any new countries added!)
   */
  getRecommendations() {
    const results = [];
    const destinations = VELUNTU_DATA.destinations;

    if (this.selectedInterests.length === 0) {
      return [];
    }

    // Loop over ALL destinations in dataset (extensible for 4th, 5th, nth country)
    Object.keys(destinations).forEach(countryKey => {
      const country = destinations[countryKey];
      const categories = country.categories || {};

      this.selectedInterests.forEach(interestId => {
        const matches = categories[interestId] || [];
        matches.forEach((exp, idx) => {
          // Associate matching place photo and location if available
          const placeMatch = country.places ? country.places[idx % country.places.length] : null;

          results.push({
            countryId: country.id,
            countryName: country.name,
            locationName: placeMatch ? placeMatch.name : country.region,
            coords: placeMatch ? placeMatch.coords : country.coords,
            img: placeMatch ? placeMatch.img : country.heroImage,
            categoryKey: interestId,
            categoryLabel: this.getCategoryLabel(interestId),
            title: exp.title,
            desc: exp.desc,
            format: exp.format,
            duration: exp.duration
          });
        });
      });
    });

    // Interleave results across countries for visual balance
    return this.interleaveByCountry(results);
  }

  interleaveByCountry(items) {
    const grouped = {};
    items.forEach(item => {
      if (!grouped[item.countryId]) grouped[item.countryId] = [];
      grouped[item.countryId].push(item);
    });

    const interleaved = [];
    const countryKeys = Object.keys(grouped);
    let maxLen = 0;

    countryKeys.forEach(k => {
      if (grouped[k].length > maxLen) maxLen = grouped[k].length;
    });

    for (let i = 0; i < maxLen; i++) {
      countryKeys.forEach(k => {
        if (grouped[k][i]) {
          interleaved.push(grouped[k][i]);
        }
      });
    }

    return interleaved;
  }

  getCategoryLabel(key) {
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

  updateRecommendations() {
    const grid = document.getElementById('affinityResultsGrid');
    const counter = document.getElementById('affinityResultsCounter');
    const selectedBadge = document.getElementById('affinitySelectedBadge');

    if (!grid) return;

    const recommendations = this.getRecommendations();

    // Update selected badge summary
    if (selectedBadge) {
      if (this.selectedInterests.length === 0) {
        selectedBadge.innerText = 'Nenhum eixo selecionado — escolha de 1 a 3 interesses acima.';
      } else {
        const labels = this.selectedInterests.map(id => this.getCategoryLabel(id));
        selectedBadge.innerHTML = `Curadoria para: <strong>${labels.join(' + ')}</strong>`;
      }
    }

    if (counter) {
      counter.innerText = `${recommendations.length} EXPERIÊNCIAS ENCONTRADAS`;
    }

    if (recommendations.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; padding: 60px 20px; text-align: center; background: var(--bg-secondary); border-radius: 4px; border: 1px dashed var(--border-medium);">
          <span class="editorial-tag" style="margin-bottom: 12px;">Ferramenta de Descoberta</span>
          <h3 style="font-size: 1.6rem; margin-bottom: 8px;">Selecione seus Eixos de Interesse</h3>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px auto;">
            Toque nos botões acima para combinar até 3 afinidades e visualizar expedições recomendadas na África do Sul, Egito e Madagascar.
          </p>
        </div>
      `;
      return;
    }

    grid.innerHTML = recommendations.map(rec => `
      <article class="affinity-rec-card">
        <div class="rec-card-image-frame">
          <img class="rec-card-img" src="${rec.img}" alt="${rec.title}" loading="lazy" />
          <span class="rec-country-badge">${rec.countryName}</span>
        </div>

        <div class="rec-card-body">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="editorial-tag">${rec.categoryLabel}</span>
            <span class="mono-meta">${rec.duration}</span>
          </div>

          <h3 class="rec-card-title">${rec.title}</h3>

          <div style="display: flex; align-items: center; gap: 6px; margin: 4px 0;">
            <span class="mono-meta" style="color: var(--text-primary); font-weight: 700;">${rec.locationName}</span>
          </div>

          <p class="rec-card-desc">${rec.desc}</p>

          <div class="rec-card-footer">
            <span class="mono-meta">${rec.format}</span>
            <a href="${rec.countryId}.html" class="btn-editorial-secondary" style="padding: 6px 14px; font-size: 0.72rem;">
              Explorar em ${rec.countryName} &rarr;
            </a>
          </div>
        </div>
      </article>
    `).join('');
  }
}

// Global instance initialization
let veluntuAffinityExplorer = null;

document.addEventListener('DOMContentLoaded', () => {
  veluntuAffinityExplorer = new AffinityExplorer();
});
