/* VELUNTU - Controlador do Mapa Interativo Cartográfico (Cartografia Fiel de Alta Precisão) */

const VELUNTU_POIS = [
  // EGITO POIs (Norte da África • foz do Nilo & Siwa)
  {
    id: 'poi-siwa',
    countryId: 'egito',
    countryName: 'Egito',
    name: 'Oásis de Siwa & Fortaleza Shali',
    categoryKey: 'natureza',
    categoryLabel: 'Natureza & História',
    coords: '29.2032° N, 25.5195° E',
    svgPos: { x: 400, y: 122 },
    img: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800&auto=format&fit=crop',
    desc: 'Oásis no Deserto Ocidental com lagos salgados cristalinos e arquitetura vernacular preservada em Kershef.',
    experiences: [
      'Flutuação nos Lagos Salgados Naturais',
      'Exploração das Ruínas em Argila de Shali',
      'Pernoite sob as estrelas no Grande Mar de Areia'
    ]
  },
  {
    id: 'poi-luxor',
    countryId: 'egito',
    countryName: 'Egito',
    name: 'Templos de Luxor & Vale dos Reis',
    categoryKey: 'historia',
    categoryLabel: 'História & Arqueologia',
    coords: '25.6989° N, 32.6421° E',
    svgPos: { x: 448, y: 150 },
    img: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=800&auto=format&fit=crop',
    desc: 'O epicentro do Alto Egito antigo, onde colunas monumentais e tumbas pintadas narram ritos de cinco milênios.',
    experiences: [
      'Visita guiada às Tumbas Faraônicas no Vale dos Reis',
      'Contemplação das Colunas Papiro do Templo de Karnak',
      'Navegação de Felucca ao pôr do sol em Aswan'
    ]
  },
  {
    id: 'poi-cairo',
    countryId: 'egito',
    countryName: 'Egito',
    name: 'Cairo Histórico & Bairro Cóptico',
    categoryKey: 'cultura',
    categoryLabel: 'Cultura & Literatura',
    coords: '30.0444° N, 31.2357° E',
    svgPos: { x: 440, y: 115 },
    img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
    desc: 'Fervilhante centro cultural com mesquitas centenárias, ateliês literários e os manuscritos do deserto.',
    experiences: [
      'Caminhada Literária pelos passos de Naguib Mahfouz',
      'Visita ao Bairro Cóptico e Bibliotecas do Deserto',
      'Noite de Música Sufi e Dança Tanoura em El Ghouri'
    ]
  },

  // ÁFRICA DO SUL POIs (Extremo Sul • Cabo ao Kruger)
  {
    id: 'poi-capetown',
    countryId: 'africa-do-sul',
    countryName: 'África do Sul',
    name: 'Cidade do Cabo & Bioma Fynbos',
    categoryKey: 'natureza',
    categoryLabel: 'Natureza & Botânica',
    coords: '33.9249° S, 18.4241° E',
    svgPos: { x: 240, y: 580 },
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    desc: 'Onde a montanha icônica de Table Mountain encontra o Atlântico cercada pelo reino floral de Fynbos.',
    experiences: [
      'Caminhada Botânica no Jardim de Kirstenbosch',
      'Trilha das Escarpas na Table Mountain',
      'Visita ao Zeitz MOCAA de Arte Contemporânea'
    ]
  },
  {
    id: 'poi-kruger',
    countryId: 'africa-do-sul',
    countryName: 'África do Sul',
    name: 'Parque Nacional Kruger & Savana',
    categoryKey: 'vida-selvagem',
    categoryLabel: 'Vida Selvagem & Conservação',
    coords: '23.9884° S, 31.5547° E',
    svgPos: { x: 320, y: 518 },
    img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop',
    desc: 'Santuário de conservação da biodiversidade africana onde guias rastreiam felinos e fauna nativa a pé.',
    experiences: [
      'Safári de Conservação ao Amanhecer',
      'Rastreamento de Predadores com Biólogos',
      'Pernoite em Eco-Lodge Sustentável na Savana'
    ]
  },
  {
    id: 'poi-franschhoek',
    countryId: 'africa-do-sul',
    countryName: 'África do Sul',
    name: 'Vale Vinícola de Franschhoek',
    categoryKey: 'gastronomia',
    categoryLabel: 'Gastronomia & Terroir',
    coords: '33.9080° S, 19.1189° E',
    svgPos: { x: 252, y: 588 },
    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
    desc: 'Terroir vinícola histórico rodeado por montanhas, com menus forrageados e harmonização autoral.',
    experiences: [
      'Degustação de Vinhos Orgânicos de Terroir',
      'Jantar Forrageado com Flores Comestíveis Fynbos',
      'Passeio Cênico pela Arquitetura Cape Dutch'
    ]
  },
  {
    id: 'poi-drakensberg',
    countryId: 'africa-do-sul',
    countryName: 'África do Sul',
    name: 'Montanhas Drakensberg',
    categoryKey: 'aventura',
    categoryLabel: 'Aventura & Arte Rupestre',
    coords: '29.2559° S, 29.4061° E',
    svgPos: { x: 298, y: 545 },
    img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
    desc: 'Cadeia de montanhas dramáticas com desfiladeiros e milhares de pinturas rupestres do povo San.',
    experiences: [
      'Exploração da Arte Rupestre San com Arqueólogos',
      'Trilha nos Desfiladeiros do Anfiteatro',
      'Escalada em Picos de Basalto Preservados'
    ]
  },

  // MADAGASCAR POIs (Oceano Índico • Canal de Moçambique)
  {
    id: 'poi-baobab',
    countryId: 'madagascar',
    countryName: 'Madagascar',
    name: 'Avenida dos Baobás em Morondava',
    categoryKey: 'natureza',
    categoryLabel: 'Natureza & Fotografia',
    coords: '20.2508° S, 44.4184° E',
    svgPos: { x: 500, y: 455 },
    img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop',
    desc: 'Alameda sagrada de baobás seculares (Baobá-Grandidier) cujas silhuetas dominam a paisagem ocidental.',
    experiences: [
      'Contemplação dos Baobás ao Amanhecer e Pôr do Sol',
      'Encontro com Contadores de Histórias Locais',
      'Fotografia de Longa Exposição da Via Láctea'
    ]
  },
  {
    id: 'poi-tsingy',
    countryId: 'madagascar',
    countryName: 'Madagascar',
    name: 'Parque Nacional Tsingy de Bemaraha',
    categoryKey: 'aventura',
    categoryLabel: 'Aventura & Geologia',
    coords: '19.1412° S, 44.8080° E',
    svgPos: { x: 502, y: 428 },
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
    desc: 'Labirinto de agulhas calcárias pontiagudas esculpidas pela água e vento ao longo de milênios.',
    experiences: [
      'Travessia em Pontes de Corda sobre Abismos Calcários',
      'Navegação de Piroga no Rio Manambolo',
      'Observação do Lêmure-de-Decken nas Rochas'
    ]
  },
  {
    id: 'poi-andasibe',
    countryId: 'madagascar',
    countryName: 'Madagascar',
    name: 'Reserva Tropical de Andasibe-Mantadia',
    categoryKey: 'vida-selvagem',
    categoryLabel: 'Vida Selvagem & Endemismo',
    coords: '18.9333° S, 48.4167° E',
    svgPos: { x: 514, y: 442 },
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    desc: 'Floresta de neblina habitada pelo Indri Indri, o maior lêmure do planeta, famoso por seu canto ressonante.',
    experiences: [
      'Escuta do Canto do Indri Indri na Mata Fechada',
      'Caminhada Noturna para Identificar Camaleões Gigantes',
      'Observação do Indri na Copa das Árvores'
    ]
  }
];

class VeluntuMapController {
  constructor() {
    this.currentMode = 'countries';
    this.currentCategoryFilter = 'all';
    this.selectedId = 'egito';
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderPOIMarkers();
    this.selectItem('country', 'egito');
  }

  bindEvents() {
    document.querySelectorAll('.map-country-region').forEach(path => {
      path.addEventListener('click', (e) => {
        const countryId = e.currentTarget.getAttribute('data-country');
        this.selectItem('country', countryId);
      });
    });

    document.querySelectorAll('.country-pin').forEach(pin => {
      pin.addEventListener('click', (e) => {
        const countryId = e.currentTarget.getAttribute('data-country');
        this.selectItem('country', countryId);
      });
    });

    document.querySelectorAll('.map-poi-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.map-poi-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const cat = e.currentTarget.getAttribute('data-category');
        this.currentCategoryFilter = cat;

        if (cat === 'all-countries') {
          this.currentMode = 'countries';
          this.togglePOIVisibility(false);
          this.selectItem('country', 'egito');
        } else {
          this.currentMode = 'pois';
          this.togglePOIVisibility(true);
          this.filterPOIMarkers(cat);
        }
      });
    });
  }

  renderPOIMarkers() {
    const group = document.getElementById('mapPOIGroup');
    if (!group) return;

    group.innerHTML = VELUNTU_POIS.map(poi => `
      <g class="poi-marker" data-poi-id="${poi.id}" data-category="${poi.categoryKey}" transform="translate(${poi.svgPos.x}, ${poi.svgPos.y})" onclick="veluntuMapController.selectItem('poi', '${poi.id}')">
        <circle class="outer" r="6" />
        <circle class="inner" r="2.5" />
      </g>
    `).join('');
  }

  togglePOIVisibility(visible) {
    const group = document.getElementById('mapPOIGroup');
    if (group) {
      group.style.display = visible ? 'block' : 'none';
    }
  }

  filterPOIMarkers(category) {
    const markers = document.querySelectorAll('.poi-marker');
    let firstMatch = null;

    markers.forEach(marker => {
      const cat = marker.getAttribute('data-category');
      if (category === 'all' || cat === category) {
        marker.style.display = 'block';
        if (!firstMatch) firstMatch = marker.getAttribute('data-poi-id');
      } else {
        marker.style.display = 'none';
      }
    });

    if (firstMatch) {
      this.selectItem('poi', firstMatch);
    }
  }

  selectItem(type, id) {
    this.selectedId = id;
    const card = document.getElementById('mapInspectorCard');
    if (!card) return;

    card.classList.add('updating');

    document.querySelectorAll('.map-country-region').forEach(p => {
      if (p.getAttribute('data-country') === id) p.classList.add('active');
      else p.classList.remove('active');
    });

    document.querySelectorAll('.poi-marker').forEach(m => {
      if (m.getAttribute('data-poi-id') === id) m.classList.add('active');
      else m.classList.remove('active');
    });

    setTimeout(() => {
      if (type === 'country') {
        this.renderCountryInspector(id, card);
      } else {
        this.renderPOIInspector(id, card);
      }
      card.classList.remove('updating');
    }, 180);
  }

  renderCountryInspector(countryId, container) {
    const data = VELUNTU_DATA.destinations[countryId];
    if (!data) return;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
        <div>
          <span class="mono-meta">${data.coords}</span>
          <h3 style="font-size: 2rem; margin-top: 2px;">${data.name}</h3>
        </div>
        <span class="editorial-tag">Destino Editorial</span>
      </div>

      <div class="inspector-image-frame">
        <img class="inspector-image" src="${data.heroImage}" alt="${data.name}" loading="lazy" />
      </div>

      <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
        ${data.summary}
      </p>

      <blockquote style="font-family: var(--font-serif); font-style: italic; font-size: 1.05rem; border-left: 2px solid var(--text-primary); padding-left: 12px; margin: 4px 0;">
        "${data.quote}"
      </blockquote>

      <div>
        <span class="mono-meta">PRINCIPAIS EXPERIÊNCIAS</span>
        <div class="inspector-exp-list">
          ${data.keyHighlights.map(h => `
            <div class="inspector-exp-item">
              <strong style="font-size: 0.88rem;">${h.title}</strong>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">${h.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top: 12px;">
        <a class="btn-editorial" href="${data.id}.html" style="width: 100%; justify-content: center;">
          Abrir Página de ${data.name} &rarr;
        </a>
      </div>
    `;
  }

  renderPOIInspector(poiId, container) {
    const poi = VELUNTU_POIS.find(p => p.id === poiId);
    if (!poi) return;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
        <div>
          <span class="mono-meta">${poi.coords} • ${poi.countryName}</span>
          <h3 style="font-size: 1.7rem; margin-top: 2px;">${poi.name}</h3>
        </div>
        <span class="editorial-tag">${poi.categoryLabel}</span>
      </div>

      <div class="inspector-image-frame">
        <img class="inspector-image" src="${poi.img}" alt="${poi.name}" loading="lazy" />
      </div>

      <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
        ${poi.desc}
      </p>

      <div>
        <span class="mono-meta">VIVÊNCIAS NO LOCAL</span>
        <div class="inspector-exp-list">
          ${poi.experiences.map(exp => `
            <div class="inspector-exp-item">
              <span style="font-size: 0.88rem; color: var(--text-primary); font-weight: 500;">&bull; ${exp}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 12px;">
        <a class="btn-editorial" href="${poi.countryId}.html" style="flex: 1; justify-content: center; font-size: 0.78rem;">
          Ir para ${poi.countryName} &rarr;
        </a>
        <button class="btn-editorial-secondary" style="padding: 8px 14px; font-size: 0.75rem;" onclick="saveToNotebook('${poi.name} (${poi.countryName})')">
          Guardar &plus;
        </button>
      </div>
    `;
  }
}

let veluntuMapController = null;

document.addEventListener('DOMContentLoaded', () => {
  veluntuMapController = new VeluntuMapController();
});
