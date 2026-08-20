/* ==========================================================================
   VELUNTU INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll state
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Leaflet Map Initialization - Cartografia Real com Profundidade
  if (typeof L !== 'undefined' && document.getElementById('map')) {
    // Center map on Africa
    const map = L.map('map', {
      center: [-3, 20],
      zoom: 3,
      minZoom: 3,
      maxZoom: 7,
      scrollWheelZoom: false,
      zoomControl: true,
      tap: true
     
    });

    // Camada cartográfica de alta definição (CartoDB Dark Matter com dados do OpenStreetMap)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Custom Marker Icon com pulso animado na cor da marca (Laranja #CC7A00 e Verde #17320B)
    const customIcon = L.divIcon({
      className: 'veluntu-map-marker',
      html: `
        <div class="marker-pin-wrapper">
          <div class="marker-pulse"></div>
          <div class="marker-core">
            <span class="marker-dot"></span>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    // Dados exatos dos três destinos
    const destinationsData = [

  {
    id: 'piramides',
    name: 'Pirâmides de Gizé',
    country: 'Egito',
    coords: [29.9792, 31.1342],
    desc: 'Um dos maiores símbolos da antiga civilização egípcia.',
    bestTime: 'Outubro a Abril',
    style: 'História & Cultura',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=900&q=80',
    page: 'egito.html'
  },

  {
    id: 'luxor',
    name: 'Vale dos Reis',
    country: 'Egito',
    coords: [25.7402, 32.6014],
    desc: 'Antiga necrópole dos faraós egípcios.',
    bestTime: 'Outubro a Abril',
    style: 'História & Arqueologia',
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=900&q=80',
    page: 'egito.html'
  },

  {
    id: 'tablemountain',
    name: 'Table Mountain',
    country: 'África do Sul',
    coords: [-33.9628, 18.4098],
    desc: 'Uma das paisagens mais emblemáticas da Cidade do Cabo.',
    bestTime: 'Outubro a Março',
    style: 'Natureza & Aventura',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=80',
    page: 'africadosul.html'
  },

  {
    id: 'kruger',
    name: 'Parque Nacional Kruger',
    country: 'África do Sul',
    coords: [-23.9884, 31.5547],
    desc: 'Uma das grandes experiências de vida selvagem da África.',
    bestTime: 'Maio a Outubro',
    style: 'Safári & Vida Selvagem',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80',
    page: 'africadosul.html'
  },

  {
    id: 'baobas',
    name: 'Avenida dos Baobás',
    country: 'Madagascar',
    coords: [-20.2500, 44.4180],
    desc: 'Uma paisagem marcada por gigantescos baobás que se tornaram símbolo de Madagascar.',
    bestTime: 'Abril a Outubro',
    style: 'Natureza & Fotografia',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=80',
    page: 'madagascar.html'
  },

  {
    id: 'tsingy',
    name: 'Tsingy de Bemaraha',
    country: 'Madagascar',
    coords: [-18.6667, 44.7167],
    desc: 'Formações rochosas impressionantes em uma das paisagens mais únicas da ilha.',
    bestTime: 'Abril a Novembro',
    style: 'Aventura & Natureza',
    image: 'https://i.pinimg.com/736x/47/4d/8e/474d8ee9d1ec31c1b76987f46049d7a3.jpg',
    page: 'madagascar.html'
  }

];

    const infoTitle = document.getElementById('infoTitle');
    const infoDesc = document.getElementById('infoDesc');
    const infoLink = document.getElementById('infoLink');
    const mapaInfo = document.getElementById('mapaInfo');
    const infoImage = document.getElementById('infoImage');
    destinationsData.forEach(dest => {
      const marker = L.marker(dest.coords, { icon: customIcon }).addTo(map);

      // Popup sutil nativo do Leaflet
      marker.bindTooltip(`<strong>${dest.name}</strong>`, {
        permanent: false,
        direction: 'top',
        className: 'veluntu-tooltip'
      });

      marker.on('click', () => {
        if (infoTitle && infoDesc && infoLink) {
          infoTitle.textContent = dest.name;
          infoDesc.textContent = dest.desc;
          infoLink.setAttribute('href', dest.page);
          if (infoImage) {
  infoImage.src = dest.image;
  infoImage.alt = dest.name;
}


          const metaSpans = mapaInfo.querySelectorAll('.info-meta span');
          if (metaSpans.length >= 2) {
            metaSpans[0].innerHTML = `<strong>País:</strong> ${dest.country}`;
            metaSpans[1].innerHTML = `<strong>Estilo:</strong> ${dest.style}`;
          }

          map.flyTo(dest.coords, 4, { duration: 1.2 });
        }
      });
    });
  }

  // 4. Ferramenta Interativa: "O que combina com você?"
  const experienciasData = [
    {
      id: 1,
      title: "Safári Fotográfico & Lodges de Luxo",
      pais: "África do Sul",
      local: "Greater Kruger",
      categories: ["vidaselvagem", "natureza", "aventura"],
      categoryLabels: ["Vida Selvagem", "Natureza", "Aventura"],
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
      desc: "Imersão privativa na savana sul-africana com rastreamento dos Big Five e hospedagem em lodges exclusivos.",
      link: "africadosul.html"
    },
    {
      id: 2,
      title: "Navegação Dahabiya & Templos de Luxor",
      pais: "Egito",
      local: "Rio Nilo & Luxor",
      categories: ["historia", "cultura"],
      categoryLabels: ["História", "Cultura"],
      image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80",
      desc: "Navegação calma pelo Nilo em veleiro clássico com visitas privativas aos templos acompanhado de egiptólogos.",
      link: "egito.html"
    },
    {
      id: 3,
      title: "Baobás Milenares & Ilhas de Nosy Be",
      pais: "Madagascar",
      local: "Morondava & Nosy Be",
      categories: ["natureza", "aventura", "vidaselvagem"],
      categoryLabels: ["Natureza", "Aventura", "Vida Selvagem"],
      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80",
      desc: "Contemplação dos baobás sagrados ao pôr do sol combinada com refúgio praiano em resort de ilha privativa.",
      link: "madagascar.html"
    },
    {
      id: 4,
      title: "Rota dos Vinhos & Alta Gastronomia",
      pais: "África do Sul",
      local: "Franschhoek & Stellenbosch",
      categories: ["gastronomia", "cultura"],
      categoryLabels: ["Gastronomia", "Cultura"],
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
      desc: "Degustações exclusivas nas vinícolas mais históricas do continente e jantares harmonizados de nível internacional.",
      link: "africadosul.html"
    },
    {
      id: 5,
      title: "Pirâmides de Gizé & Grande Museu",
      pais: "Egito",
      local: "Cairo & Gizé",
      categories: ["historia", "cultura"],
      categoryLabels: ["História", "Cultura"],
      image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80",
      desc: "Acesso privativo ao complexo de Gizé e às galerias de tesouros faraônicos no Cairo.",
      link: "egito.html"
    },
    {
      id: 6,
      title: "Santuário de Lêmures em Andasibe",
      pais: "Madagascar",
      local: "Parque Andasibe",
      categories: ["natureza", "vidaselvagem"],
      categoryLabels: ["Natureza", "Vida Selvagem"],
      image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80",
      desc: "Trilhas guiadas por biólogos para conhecer primatas raros e a rica biodiversidade endêmica da ilha.",
      link: "madagascar.html"
    }
  ];

  const chipBtns = document.querySelectorAll('.chip-btn');
  const resultadosGrid = document.getElementById('resultadosGrid');
  const counterText = document.getElementById('counterText');

  let selectedInterests = [];

  if (chipBtns.length > 0 && resultadosGrid) {
    function updateUIState() {
      const isMaxReached = selectedInterests.length >= 3;

      chipBtns.forEach(btn => {
        const interest = btn.getAttribute('data-interest');
        const isSelected = selectedInterests.includes(interest);

        if (isSelected) {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          btn.removeAttribute('disabled');
          btn.classList.remove('disabled');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
          if (isMaxReached) {
            btn.setAttribute('disabled', 'true');
            btn.classList.add('disabled');
          } else {
            btn.removeAttribute('disabled');
            btn.classList.remove('disabled');
          }
        }
      });

      updateCounterText();
      renderResults();
    }

    chipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const interest = btn.getAttribute('data-interest');
        const index = selectedInterests.indexOf(interest);

        if (index > -1) {
          // Desmarcar
          selectedInterests.splice(index, 1);
        } else {
          // Marcar (se menor que 3)
          if (selectedInterests.length < 3) {
            selectedInterests.push(interest);
          }
        }

        updateUIState();
      });
    });

    function updateCounterText() {
      if (!counterText) return;
      if (selectedInterests.length === 0) {
        counterText.innerHTML = `<span>Selecione de 1 a 3 interesses para personalizar a busca</span>`;
      } else if (selectedInterests.length < 3) {
        counterText.innerHTML = `<span>Interesses selecionados: <strong>${selectedInterests.length}/3</strong> (você pode selecionar até 3)</span>`;
      } else {
        counterText.innerHTML = `<span><strong>Limite máximo atingido (3/3).</strong> Desmarque uma opção para escolher outra.</span>`;
      }
    }

    function renderResults() {
      let filtered = [];

      if (selectedInterests.length === 0) {
        filtered = experienciasData;
      } else {
        filtered = experienciasData.filter(exp => {
          return selectedInterests.some(interest => exp.categories.includes(interest));
        });
      }

      if (filtered.length === 0) {
        resultadosGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
            <p>Nenhuma experiência encontrada para a combinação selecionada.</p>
          </div>
        `;
        return;
      }

      resultadosGrid.innerHTML = filtered.map(exp => `
        <article class="resultado-card">
          <div class="resultado-img-wrapper">
            <img src="${exp.image}" alt="${exp.title}" loading="lazy">
            <span class="resultado-pais-tag">${exp.pais}</span>
          </div>
          <div class="resultado-body">
            <span class="resultado-local">${exp.local}</span>
            <h3 class="resultado-title">${exp.title}</h3>
            <div class="resultado-cats">
              ${exp.categoryLabels.map(cat => `<span class="cat-badge">${cat}</span>`).join('')}
            </div>
            <p class="resultado-desc">${exp.desc}</p>
            <div class="resultado-actions">
              <a href="${exp.link}" class="btn-link">Conhecer experiência &rarr;</a>
              <a href="planejar.html" class="btn btn-primary btn-sm">Comece a Planejar</a>
            </div>
          </div>
        </article>
      `).join('');
    }

    // Inicialização da renderização e UI
    updateUIState();
  }

  // 5. Funcionalidade: WIZARD DO PLANEJAMENTO
  const plannerPanels = document.querySelectorAll('.planner-step-panel');
  const plannerProgressBar = document.getElementById('plannerProgressBar');
  const plannerStepLabel = document.getElementById('plannerStepLabel');
  const plannerSummaryMonth = document.getElementById('plannerSummaryMonth');
  const plannerSummaryInterests = document.getElementById('plannerSummaryInterests');
  const plannerSummaryMode = document.getElementById('plannerSummaryMode');
  const plannerSummarySelection = document.getElementById('plannerSummarySelection');
  const reviewMonthValue = document.getElementById('reviewMonthValue');
  const reviewInterestsValue = document.getElementById('reviewInterestsValue');
  const reviewModeValue = document.getElementById('reviewModeValue');
  const reviewSelectionValue = document.getElementById('reviewSelectionValue');
  const plannerRecommendations = document.getElementById('plannerRecommendations');
  const recommendationsGrid = document.getElementById('recommendationsGrid');
  const plannerFormActions = document.querySelector('.planner-form-actions');

  const plannerState = {
    month: 'Janeiro',
    interests: [],
    mode: 'destino',
    destination: 'África do Sul',
    experience: 'Lua de mel'
  };

  const plannerInterests = [
    'Gastronomia',
    'Relaxar',
    'Cultura',
    'História',
    'Estudo',
    'Natureza',
    'Vida selvagem',
    'Aventura',
    'Lua de mel',
    'Casamento',
    'Aniversário',
    'Férias & Família',
    'Estudo & Pesquisa',
    'Praias & Relaxamento',
    'Primeira viagem à África'
  ];

  const destinationRecommendationData = [
    {
      name: 'África do Sul',
      page: 'pacotes.html?destino=africa-do-sul',
      image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=80',
      description: 'Safáris, vinhos e paisagens que misturam natureza, luxo e experiências exclusivas.',
      tags: ['Natureza', 'Vida selvagem', 'Aventura', 'Gastronomia', 'Relaxar', 'Cultura', 'Lua de mel', 'Casamento', 'Aniversário', 'Férias & Família', 'Primeira viagem à África'],
      months: ['Janeiro', 'Fevereiro', 'Março', 'Novembro', 'Dezembro'],
      experiences: ['Safári', 'Vinhedos', 'Praias', 'Natureza', 'Aventura', 'Lua de mel', 'Casamento', 'Aniversário', 'Primeira viagem à África', 'Férias & Família', 'África do Sul']
    },
    {
      name: 'Egito',
      page: 'pacotes.html?destino=egito',
      image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=900&q=80',
      description: 'Um destino de história, cultura e experiências memoráveis ao longo do Nilo e das grandes civilizações.',
      tags: ['História', 'Cultura', 'Estudo', 'Estudo & Pesquisa', 'Relaxar', 'Gastronomia', 'Natureza', 'Lua de mel', 'Casamento', 'Aniversário', 'Primeira viagem à África'],
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Outubro', 'Novembro', 'Dezembro'],
      experiences: ['História', 'Cultura', 'Estudo', 'Estudo & Pesquisa', 'Lua de mel', 'Casamento', 'Aniversário', 'Primeira viagem à África', 'Egito']
    },
    {
      name: 'Madagascar',
      page: 'pacotes.html?destino=madagascar',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=80',
      description: 'Ilhas, baobás, trilhas e vida selvagem em um cenário único que celebra a natureza em estado bruto.',
      tags: ['Natureza', 'Vida selvagem', 'Aventura', 'Relaxar', 'Praias & Relaxamento', 'Férias & Família', 'Primeira viagem à África', 'Estudo'],
      months: ['Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro'],
      experiences: ['Natureza', 'Aventura', 'Praias & Relaxamento', 'Primeira viagem à África', 'Férias & Família', 'Madagascar']
    }
  ];

  if (plannerPanels.length > 0 && plannerProgressBar && plannerStepLabel) {
    let currentPlannerStep = 0;

    function renderReviewSummary() {
      if (reviewMonthValue) reviewMonthValue.textContent = plannerState.month;
      if (reviewInterestsValue) {
        reviewInterestsValue.textContent = plannerState.interests.length ? plannerState.interests.join(', ') : 'Nenhuma opção';
      }
      if (reviewModeValue) {
        reviewModeValue.textContent = plannerState.mode === 'destino' ? 'Escolher um destino' : 'Explorar experiências';
      }
      if (reviewSelectionValue) {
        reviewSelectionValue.textContent = plannerState.mode === 'destino' ? plannerState.destination : plannerState.experience;
      }
    }

    function showRecommendations() {
      localStorage.setItem('veluntu_planner_state', JSON.stringify(plannerState));

      let targetUrl = 'pacotes.html?modo=recomendados';
      if (plannerState.mode === 'destino' && plannerState.destination) {
        const destSlug = plannerState.destination.toLowerCase().includes('sul') ? 'africa-do-sul'
                       : plannerState.destination.toLowerCase().includes('egito') ? 'egito'
                       : 'madagascar';
        targetUrl += `&destino=${destSlug}`;
      } else if (plannerState.experience) {
        targetUrl += `&experiencia=${encodeURIComponent(plannerState.experience)}`;
      }
      if (plannerState.month) {
        targetUrl += `&mes=${encodeURIComponent(plannerState.month)}`;
      }
      window.location.href = targetUrl;
    }

    const btnGoToPackages = document.getElementById('btnGoToPackages');
    if (btnGoToPackages) {
      btnGoToPackages.addEventListener('click', () => {
        showRecommendations();
      });
    }

    const btnGoToDestinations = document.getElementById('btnGoToDestinations');
    if (btnGoToDestinations) {
      btnGoToDestinations.addEventListener('click', () => {
        showRecommendations();
      });
    }

    function updatePlannerWizard() {
      plannerPanels.forEach((panel, index) => {
        panel.classList.toggle('active', index === currentPlannerStep);
      });

      const percentage = ((currentPlannerStep + 1) / plannerPanels.length) * 100;
      if (plannerProgressBar) plannerProgressBar.style.width = `${percentage}%`;
      if (plannerStepLabel) plannerStepLabel.textContent = `Etapa ${currentPlannerStep + 1} de ${plannerPanels.length}`;

      const prevBtns = document.querySelectorAll('[data-nav="prev"]');
      const nextBtns = document.querySelectorAll('[data-nav="next"]');

      prevBtns.forEach(btn => {
        btn.style.visibility = currentPlannerStep === 0 ? 'hidden' : 'visible';
      });

      nextBtns.forEach(btn => {
        btn.textContent = currentPlannerStep === plannerPanels.length - 1 ? 'Ver Pacotes Recomendados' : 'Avançar';
      });

      if (plannerFormActions) {
        plannerFormActions.style.display = currentPlannerStep === plannerPanels.length - 1 ? 'none' : 'flex';
      }

      renderReviewSummary();
    }

    function renderPlannerSummary() {
      if (plannerSummaryMonth) plannerSummaryMonth.textContent = plannerState.month;

      if (plannerSummaryInterests) {
        plannerSummaryInterests.textContent = plannerState.interests.length ? plannerState.interests.join(', ') : 'Nenhuma opção';
      }

      if (plannerSummaryMode) plannerSummaryMode.textContent = plannerState.mode === 'destino' ? 'Escolher um destino' : 'Explorar experiências';
      if (plannerSummarySelection) {
        plannerSummarySelection.textContent = plannerState.mode === 'destino' ? plannerState.destination : plannerState.experience;
      }

      renderReviewSummary();
    }

    function setAllInterestSelection(shouldSelectAll) {
      plannerState.interests = shouldSelectAll ? [...plannerInterests] : [];
      document.querySelectorAll('.interest-chip').forEach(button => {
        const isAll = button.dataset.interest === 'Todas as opções';
        const shouldBeActive = shouldSelectAll ? (isAll || plannerInterests.includes(button.dataset.interest)) : false;
        button.classList.toggle('active', shouldBeActive);
      });
      renderPlannerSummary();
    }

    document.querySelectorAll('.month-card').forEach(button => {
      button.addEventListener('click', () => {
        plannerState.month = button.dataset.month;
        document.querySelectorAll('.month-card').forEach(item => item.classList.toggle('active', item === button));
        renderPlannerSummary();
      });
    });

    document.querySelectorAll('.interest-chip').forEach(button => {
      button.addEventListener('click', () => {
        const value = button.dataset.interest;

        if (value === 'Todas as opções') {
          const shouldSelectAll = plannerState.interests.length !== plannerInterests.length;
          setAllInterestSelection(shouldSelectAll);
          return;
        }

        const alreadySelected = plannerState.interests.includes(value);
        if (alreadySelected) {
          plannerState.interests = plannerState.interests.filter(item => item !== value);
        } else {
          plannerState.interests = [...plannerState.interests, value];
        }

        const allSelected = plannerInterests.every(item => plannerState.interests.includes(item));
        document.querySelectorAll('.interest-chip').forEach(item => {
          const chipValue = item.dataset.interest;
          const isAllOption = chipValue === 'Todas as opções';
          const isActive = isAllOption ? allSelected : plannerState.interests.includes(chipValue);
          item.classList.toggle('active', isActive);
        });

        renderPlannerSummary();
      });
    });

    document.querySelectorAll('[data-mode]').forEach(button => {
      button.addEventListener('click', () => {
        plannerState.mode = button.dataset.mode;
        document.querySelectorAll('[data-mode]').forEach(item => item.classList.toggle('active', item === button));

        document.querySelectorAll('.planner-mode-panel').forEach(panel => {
          panel.classList.toggle('active', panel.dataset.modePanel === plannerState.mode);
        });

        renderPlannerSummary();
      });
    });

    document.querySelectorAll('[data-destination]').forEach(button => {
      button.addEventListener('click', () => {
        plannerState.destination = button.dataset.destination;
        plannerState.mode = 'destino';
        document.querySelectorAll('[data-destination]').forEach(item => item.classList.toggle('active', item === button));
        document.querySelectorAll('[data-mode]').forEach(item => item.classList.toggle('active', item.dataset.mode === 'destino'));
        document.querySelectorAll('.planner-mode-panel').forEach(panel => {
          panel.classList.toggle('active', panel.dataset.modePanel === 'destino');
        });
        renderPlannerSummary();
      });
    });

    document.querySelectorAll('[data-experience]').forEach(button => {
      button.addEventListener('click', () => {
        plannerState.experience = button.dataset.experience;
        plannerState.mode = 'experiencia';
        document.querySelectorAll('[data-experience]').forEach(item => item.classList.toggle('active', item === button));
        document.querySelectorAll('[data-mode]').forEach(item => item.classList.toggle('active', item.dataset.mode === 'experiencia'));
        document.querySelectorAll('.planner-mode-panel').forEach(panel => {
          panel.classList.toggle('active', panel.dataset.modePanel === 'experiencia');
        });
        renderPlannerSummary();
      });
    });

    document.querySelectorAll('[data-nav]').forEach(button => {
      button.addEventListener('click', () => {
        const direction = button.getAttribute('data-nav') === 'next' ? 1 : -1;
        const nextStep = currentPlannerStep + direction;

        if (button.getAttribute('data-nav') === 'next' && currentPlannerStep === plannerPanels.length - 1) {
          showRecommendations();
          return;
        }

        if (nextStep >= 0 && nextStep < plannerPanels.length) {
          currentPlannerStep = nextStep;
          updatePlannerWizard();
        }
      });
    });

    renderPlannerSummary();
    updatePlannerWizard();
  }

  // ================= CATALOGO COMPLETO DE PACOTES =================
  const packageCatalog = {
    'africa-do-sul': {
      label: 'África do Sul',
      heroImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1800&q=80',
      description: 'Safáris exclusivos, vinhos premiados e paisagens inesquecíveis entre savana, montanhas e praia.',
      packages: [
        {
          id: 'safari-luxo-kruger',
          destKey: 'africa-do-sul',
          name: 'Safári Luxo no Kruger',
          image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80',
          duration: '6 dias / 5 noites',
          hotel: 'Lodge exclusivo com vista para a savana',
          tours: 'Safáris diários, visitas a Cape Town e Franschhoek',
          meals: 'Café da manhã e jantar gourmet inclusos',
          transport: 'Transfer privado 4x4 + transfer interno',
          experiences: ['Vida selvagem', 'Fotografia', 'Rota dos vinhos', 'Lua de mel', 'Casamento'],
          price: 'A partir de R$ 8.400 por pessoa',
          highlight: 'Ideal para casais, celebrações e famílias que buscam sofisticação em meio à savana.'
        },
        {
          id: 'cape-town-vinhos',
          destKey: 'africa-do-sul',
          name: 'Cape Town & Vinhedos',
          image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80',
          duration: '5 dias / 4 noites',
          hotel: 'Hotel boutique com vista para a montanha e mar',
          tours: 'Table Mountain, vinhedos históricos e exploração da Península do Cabo',
          meals: 'Jantares chef e café da manhã',
          transport: 'Traslados privados + city tour exclusivo',
          experiences: ['Cultura', 'Gastronomia', 'Paisagens', 'Aniversário', 'Férias & Família'],
          price: 'A partir de R$ 6.150 por pessoa',
          highlight: 'Perfeito para quem busca sofisticação urbana, rota de vinhos e natureza dramática.'
        }
      ]
    },
    egito: {
      label: 'Egito',
      heroImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1800&q=80',
      description: 'Pirâmides, templos milenares e navegação pelo Nilo em um roteiro repleto de história e luxo.',
      packages: [
        {
          id: 'nilo-e-templos',
          destKey: 'egito',
          name: 'Nilo & Templos Reais',
          image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=900&q=80',
          duration: '7 dias / 6 noites',
          hotel: 'Hotel histórico em Luxor e cruzeiro Dahabiya no Nilo',
          tours: 'Luxor, Karnak, Abu Simbel e passeio de barco ao pôr do sol',
          meals: 'Pensão completa a bordo e cafés selecionados',
          transport: 'Navegação privativa + traslados terrestres climatizados',
          experiences: ['História', 'Cultura', 'Estudo', 'Estudo & Pesquisa', 'Navegação'],
          price: 'A partir de R$ 7.900 por pessoa',
          highlight: 'Excelente para quem deseja imersão histórica, egiptologia e cruzeiro exclusivo no Nilo.'
        },
        {
          id: 'gize-cairo-mar-vermelho',
          destKey: 'egito',
          name: 'Gizé, Cairo & Mar Vermelho',
          image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=900&q=80',
          duration: '8 dias / 7 noites',
          hotel: 'Hotel de luxo com vista para as Pirâmides e resort beira-mar',
          tours: 'Pirâmides de Gizé, Museu Egípcio, snorkel e descanso no Mar Vermelho',
          meals: 'Café da manhã e jantar em restaurantes selecionados',
          transport: 'Traslados privativos + passeios guiados com egiptólogo',
          experiences: ['Arqueologia', 'Estudo', 'Mar', 'Relaxamento', 'Férias & Família'],
          price: 'A partir de R$ 9.200 por pessoa',
          highlight: 'Combina monumentos icônicos da antiguidade com momentos de relaxamento e férias na costa.'
        }
      ]
    },
    madagascar: {
      label: 'Madagascar',
      heroImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1800&q=80',
      description: 'Natureza selvagem, praias cristalinas e paisagens extraordinárias em uma ilha de rara beleza.',
      packages: [
        {
          id: 'baobas-ades',
          destKey: 'madagascar',
          name: 'Baobás & Ilha Tropical',
          image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=80',
          duration: '7 dias / 6 noites',
          hotel: 'Resort exclusivo em Nosy Be e ecolodge na costa',
          tours: 'Avenida dos Baobás, passeios de lancha e praias desertas',
          meals: 'Refeições locais e jantares pé na areia',
          transport: 'Traslados 4x4 e barco privativo',
          experiences: ['Natureza', 'Praias', 'Praias & Relaxamento', 'Lua de mel', 'Férias & Família'],
          price: 'A partir de R$ 6.800 por pessoa',
          highlight: 'Perfeito para quem busca cenários naturais intocados, ilhas privativas e descanso tropical.'
        },
        {
          id: 'lemures-e-trilhas',
          destKey: 'madagascar',
          name: 'Lêmures & Trilhas Selvagens',
          image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
          duration: '6 dias / 5 noites',
          hotel: 'Lodge ecológico com atmosfera íntima e sustentável',
          tours: 'Andasibe, trilhas botânicas e safári fotográfico noturno de lêmures',
          meals: 'Pensão completa e piquenique gourmet na floresta',
          transport: 'Veículo 4x4 com motorista-guia especialista',
          experiences: ['Vida selvagem', 'Trilhas', 'Fotografia', 'Estudo', 'Estudo & Pesquisa'],
          price: 'A partir de R$ 5.900 por pessoa',
          highlight: 'Ideal para amantes da biodiversidade rara, expedições botânicas e vida selvagem.'
        }
      ]
    }
  };

  // ================= ETAPA: PACOTES DE VIAGEM (pacotes.html) =================
  const packageCatalogPage = document.getElementById('packageCatalogPage');
  if (packageCatalogPage) {
    const params = new URLSearchParams(window.location.search);
    const requestedFilter = params.get('filtro') || '';
    const requestedDest = params.get('destino') || '';
    const isRecommendedMode = params.get('modo') === 'recomendados';
    const selectedExp = params.get('experiencia') || '';
    const selectedMonth = params.get('mes') || '';

    // Collect all packages
    const allPackages = [
      ...packageCatalog['africa-do-sul'].packages,
      ...packageCatalog['egito'].packages,
      ...packageCatalog['madagascar'].packages
    ];

    let displayedPackages = allPackages;
    let titleText = 'Pacotes de Viagem';
    let subtitleText = 'Roteiros sob medida selecionados para o seu perfil e momento de viagem.';
    let badgeText = 'PACOTES EXCLUSIVOS';

    if (requestedDest && packageCatalog[requestedDest.toLowerCase()]) {
      const destData = packageCatalog[requestedDest.toLowerCase()];
      displayedPackages = destData.packages;
      titleText = `Pacotes de Viagem em ${destData.label}`;
      subtitleText = destData.description;
      badgeText = destData.label.toUpperCase();
    } else if (isRecommendedMode && selectedExp) {
      badgeText = `RECOMENDAÇÃO: ${selectedExp.toUpperCase()}`;
      titleText = `Pacotes Recomendados para ${selectedExp}`;
      subtitleText = `Curadoria selecionada para sua viagem de ${selectedExp}${selectedMonth ? ` prevista para ${selectedMonth}` : ''}.`;
      
      // Sort matching packages first
      displayedPackages = [...allPackages].sort((a, b) => {
        const aMatch = a.experiences.some(e => e.toLowerCase().includes(selectedExp.toLowerCase())) ? 1 : 0;
        const bMatch = b.experiences.some(e => e.toLowerCase().includes(selectedExp.toLowerCase())) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    // Update Hero elements
    const pageTitle = document.getElementById('packagesPageTitle');
    const pageSubtitle = document.getElementById('packagesPageSubtitle');
    const packagesBadge = document.getElementById('packagesBadge');
    if (pageTitle) pageTitle.textContent = titleText;
    if (pageSubtitle) pageSubtitle.textContent = subtitleText;
    if (packagesBadge) packagesBadge.textContent = badgeText;

    // Update active tab buttons
    const tabTodos = document.getElementById('tabTodos');
    const tabAfrica = document.getElementById('tabAfrica');
    const tabEgito = document.getElementById('tabEgito');
    const tabMadagascar = document.getElementById('tabMadagascar');

    if (tabTodos) tabTodos.classList.toggle('active', !requestedDest || requestedFilter === 'todos');
    if (tabAfrica) tabAfrica.classList.toggle('active', requestedDest === 'africa-do-sul');
    if (tabEgito) tabEgito.classList.toggle('active', requestedDest === 'egito');
    if (tabMadagascar) tabMadagascar.classList.toggle('active', requestedDest === 'madagascar');

    // Render Full Package Cards
    const grid = document.getElementById('packagesFullGrid');
    if (grid) {
      grid.innerHTML = displayedPackages.map(pkg => {
        const destLabel = packageCatalog[pkg.destKey]?.label || 'África';
        return `
          <article class="pkg-full-card">
            <div class="pkg-full-img-wrap">
              <img src="${pkg.image}" alt="${pkg.name}" loading="lazy">
              <span class="pkg-full-badge">${destLabel}</span>
            </div>
            <div class="pkg-full-body">
              <h3 class="pkg-full-title">${pkg.name}</h3>
              <div class="pkg-full-meta">
                <span>⏱️ ${pkg.duration}</span>
                <span>🏨 ${pkg.hotel.split(',')[0]}</span>
              </div>
              <p class="pkg-full-highlight">${pkg.highlight}</p>
              <div class="pkg-full-tags">
                ${pkg.experiences.map(exp => `<span class="pkg-tag">${exp}</span>`).join('')}
              </div>
              <div class="pkg-full-footer">
                <div class="pkg-price-tag">
                  <span>Investimento</span>
                  ${pkg.price}
                </div>
                <a href="pacote-detalhes.html?destino=${pkg.destKey}&pacote=${pkg.id}" class="btn btn-primary btn-sm">Ver Detalhes do Pacote &rarr;</a>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }
  }
  const packageDetailPage = document.getElementById('packageDetailPage');
  if (packageDetailPage) {
    const params = new URLSearchParams(window.location.search);
    const requestedDestination = params.get('destino') || '';
    const destinationKey = requestedDestination.trim().toLowerCase();
    const packageId = params.get('pacote') || '';

    let destinationData = packageCatalog[destinationKey];
    let pkg = destinationData ? destinationData.packages.find(p => p.id === packageId) : null;

    if (!pkg) {
      for (const k of Object.keys(packageCatalog)) {
        const found = packageCatalog[k].packages.find(p => p.id === packageId);
        if (found) {
          pkg = found;
          destinationData = packageCatalog[k];
          break;
        }
      }
    }

    if (!pkg) {
      destinationData = packageCatalog['africa-do-sul'];
      pkg = destinationData.packages[0];
    }

    const detailDestBadge = document.getElementById('detailDestBadge');
    if (detailDestBadge) detailDestBadge.textContent = destinationData.label.toUpperCase();

    const detailTitle = document.getElementById('detailTitle');
    if (detailTitle) detailTitle.textContent = pkg.name;

    const detailHighlight = document.getElementById('detailHighlight');
    if (detailHighlight) detailHighlight.textContent = pkg.highlight;

    const detailHeroBg = document.getElementById('detailHeroBg');
    if (detailHeroBg) {
      detailHeroBg.style.backgroundImage = `linear-gradient(rgba(15,23,12,0.6), rgba(15,23,12,0.7)), url('${pkg.image}')`;
    }

    const detailImage = document.getElementById('detailImage');
    if (detailImage) detailImage.src = pkg.image;

    const detailDuration = document.getElementById('detailDuration');
    if (detailDuration) detailDuration.textContent = pkg.duration;

    const detailHotel = document.getElementById('detailHotel');
    if (detailHotel) detailHotel.textContent = pkg.hotel;

    const detailTours = document.getElementById('detailTours');
    if (detailTours) detailTours.textContent = pkg.tours;

    const detailMeals = document.getElementById('detailMeals');
    if (detailMeals) detailMeals.textContent = pkg.meals;

    const detailTransport = document.getElementById('detailTransport');
    if (detailTransport) detailTransport.textContent = pkg.transport;

    const detailPrice = document.getElementById('detailPrice');
    if (detailPrice) detailPrice.textContent = pkg.price;

    const detailExperiences = document.getElementById('detailExperiences');
    if (detailExperiences) {
      detailExperiences.innerHTML = pkg.experiences.map(exp => `<span class="badge" style="background: #f1f5f9; color: #141414; border: 1px solid #e2e8f0; font-size: 13px; padding: 6px 14px;">✦ ${exp}</span>`).join('');
    }

    const destHref = destinationKey === 'egito' ? 'egito.html' : destinationKey === 'madagascar' ? 'madagascar.html' : 'africadosul.html';
    const breadDestLink = document.getElementById('breadDestLink');
    if (breadDestLink) {
      breadDestLink.href = destHref;
      breadDestLink.textContent = `3. ${destinationData.label} ✓`;
    }

    const breadPkgListLink = document.getElementById('breadPkgListLink');
    if (breadPkgListLink) {
      breadPkgListLink.href = `pacotes.html?destino=${destinationKey}`;
    }

    const backBtn = document.getElementById('backToPackagesBtn');
    if (backBtn) {
      backBtn.href = `pacotes.html?destino=${destinationKey}`;
    }

    const bookBtn = document.getElementById('btnBookPackage');
    if (bookBtn) {
      bookBtn.href = `fale-com-veluntu.html?destino=${encodeURIComponent(destinationData.label)}&pacote=${encodeURIComponent(pkg.name)}&preco=${encodeURIComponent(pkg.price)}`;
    }
  }

  // ================= ETAPA 6: FALE COM A VELUNTU (fale-com-veluntu.html) =================
  const contactPage = document.getElementById('veluntuContactPage');
  if (contactPage) {
    const params = new URLSearchParams(window.location.search);
    const destinationName = params.get('destino') || 'África do Sul';
    const packageName = params.get('pacote') || 'Roteiro Personalizado';
    const destinationInput = document.getElementById('contactDestination');
    const packageInput = document.getElementById('contactPackage');
    const contactForm = document.getElementById('contactPageForm');
    const successBox = document.getElementById('contactSuccessBox');
    const submitBtn = document.getElementById('btnSubmitContact');

    if (destinationInput) destinationInput.value = destinationName;
    if (packageInput) packageInput.value = packageName;

    if (contactForm) {
      contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const clientName = document.getElementById('contactName')?.value || '';
        const clientEmail = document.getElementById('contactEmail')?.value || '';
        const clientPhone = document.getElementById('contactPhone')?.value || '';
        const destination = destinationInput?.value || '';
        const pkg = packageInput?.value || '';
        const people = document.getElementById('contactPeople')?.value || '2 pessoas';
        const date = document.getElementById('contactDate')?.value || '';
        const notes = document.getElementById('contactNotes')?.value || '';

        try {
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando sua solicitação...';
          }
          await fetch('/api/public/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_name: clientName,
              client_email: clientEmail,
              client_phone: clientPhone,
              participants_count: parseInt(people, 10) || 2,
              travel_date: date || null,
              notes: `Destino: ${destination} | Pacote: ${pkg} | Passageiros: ${people} | Obs: ${notes}`,
            }),
          });
        } catch (e) {
          console.warn('Fallback offline para formulário:', e);
        }

        if (contactForm) contactForm.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
      });
    }
  }

  // 6. Funcionalidade: MINHA COLEÇÃO & MINHA JORNADA
  let minhaColecao = [
    { id: 'cs1', title: 'Cape Town & Table Mountain', pais: 'África do Sul' },
    { id: 'cs2', title: 'Safári Fotográfico no Kruger', pais: 'África do Sul' },
    { id: 'eg1', title: 'Navegação Dahabiya pelo Nilo', pais: 'Egito' }
  ];

  let minhaJornada = [
    { id: 'cs1', title: 'Cape Town & Table Mountain', pais: 'África do Sul' },
    { id: 'cs2', title: 'Safári Fotográfico no Kruger', pais: 'África do Sul' }
  ];

  const colecaoItemsList = document.getElementById('colecaoItemsList');
  const jornadaTimeline = document.getElementById('jornadaTimeline');
  const colecaoCount = document.getElementById('colecaoCount');
  const jornadaCount = document.getElementById('jornadaCount');

  function renderColecao() {
    if (!colecaoItemsList) return;

    if (colecaoCount) colecaoCount.textContent = `${minhaColecao.length} itens salvos`;

    if (minhaColecao.length === 0) {
      colecaoItemsList.innerHTML = `
        <div class="empty-state">
          <p>Sua coleção está vazia.</p>
          <span class="empty-sub">Explore os destinos e adicione itens para montar sua viagem.</span>
        </div>
      `;
      return;
    }

    colecaoItemsList.innerHTML = minhaColecao.map(item => `
      <div class="item-card-colecao">
        <div class="item-info">
          <span>${item.pais}</span>
          <h5>${item.title}</h5>
        </div>
        <div class="item-actions">
          <button class="btn-add-jornada" onclick="addToJornada('${item.id}')">+ Jornada</button>
          <button class="btn-remove-item" onclick="removeFromColecao('${item.id}')">&times;</button>
        </div>
      </div>
    `).join('');
  }

  function renderJornada() {
    if (!jornadaTimeline) return;

    if (jornadaCount) jornadaCount.textContent = `${minhaJornada.length} passos no roteiro`;

    if (minhaJornada.length === 0) {
      jornadaTimeline.innerHTML = `
        <div class="empty-state">
          <p>Nenhuma experiência na sua jornada ainda.</p>
          <span class="empty-sub">Adicione os itens salvos da sua coleção para montar o roteiro.</span>
        </div>
      `;
      return;
    }

    jornadaTimeline.innerHTML = minhaJornada.map((step, idx) => `
      <div class="jornada-step">
        <div class="step-info">
          <span class="step-num">${String(idx + 1).padStart(2, '0')}</span>
          <div>
            <div class="step-title">${step.title}</div>
            <div style="font-size: 0.75rem; opacity: 0.8;">${step.pais}</div>
          </div>
        </div>
        <div class="step-controls">
          <button class="btn-reorder" onclick="moveJornadaStep(${idx}, -1)" title="Subir">&uarr;</button>
          <button class="btn-reorder" onclick="moveJornadaStep(${idx}, 1)" title="Descer">&darr;</button>
          <button class="btn-reorder" onclick="removeFromJornada(${idx})" title="Remover" style="background: rgba(255,0,0,0.3);">&times;</button>
        </div>
      </div>
    `).join('');
  }

  // Global functions for inline handlers
  window.addToJornada = function(id) {
    const item = minhaColecao.find(i => i.id === id);
    if (item) {
      minhaJornada.push({ ...item, jId: Date.now() });
      renderJornada();
    }
  };

  window.removeFromColecao = function(id) {
    minhaColecao = minhaColecao.filter(i => i.id !== id);
    renderColecao();
  };

  window.removeFromJornada = function(index) {
    minhaJornada.splice(index, 1);
    renderJornada();
  };

  window.moveJornadaStep = function(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= minhaJornada.length) return;

    const temp = minhaJornada[index];
    minhaJornada[index] = minhaJornada[targetIdx];
    minhaJornada[targetIdx] = temp;
    renderJornada();
  };

  // Initial renders
  renderColecao();
  renderJornada();
});
