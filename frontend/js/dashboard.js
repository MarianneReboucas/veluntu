// Veluntu SaaS Dashboard Controller
let currentUser = null;
let currentAgency = null;
let packagesData = [];
let reservationsData = [];

document.addEventListener('DOMContentLoaded', async () => {
  const token = window.api.getToken();
  if (!token) {
    window.location.href = 'auth.html';
    return;
  }

  try {
    const meRes = await window.api.getMe();
    currentUser = meRes.data;
    currentAgency = {
      id: currentUser.agency_id,
      name: currentUser.agency_name,
      email: currentUser.agency_email,
      phone: currentUser.agency_phone,
      country: currentUser.country,
      plan: currentUser.subscription_plan,
      logo_url: currentUser.logo_url,
    };

    updateUserUI();
    setupEventListeners();
    await loadInitialData();
  } catch (err) {
    console.error('Session validation error:', err);
    window.api.clearToken();
    window.location.href = 'auth.html';
  }
});

function updateUserUI() {
  document.getElementById('userDisplay').textContent = currentUser.name;
  document.getElementById('agencyDisplay').textContent = currentAgency.name || currentUser.agency_name;
  
  const planBadge = document.getElementById('planDisplay');
  const plan = (currentAgency.plan || 'starter').toUpperCase();
  planBadge.textContent = plan;
  
  const settingsPlanBadge = document.getElementById('settingsPlanBadge');
  if (settingsPlanBadge) settingsPlanBadge.textContent = plan;

  const settingsAgencyId = document.getElementById('settingsAgencyId');
  if (settingsAgencyId) settingsAgencyId.textContent = currentAgency.id;

  // Settings form fields
  const nameInput = document.getElementById('settingsAgencyName');
  if (nameInput) nameInput.value = currentAgency.name || '';

  const emailInput = document.getElementById('settingsAgencyEmail');
  if (emailInput) emailInput.value = currentAgency.email || '';

  const phoneInput = document.getElementById('settingsAgencyPhone');
  if (phoneInput) phoneInput.value = currentAgency.phone || '';

  const countryInput = document.getElementById('settingsAgencyCountry');
  if (countryInput) countryInput.value = currentAgency.country || 'Brasil';
}

function setupEventListeners() {
  // Navigation tabs
  document.querySelectorAll('.nav-item[data-section]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      switchSection(section);
    });
  });

  // Sidebar toggle for mobile
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('active'));
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));
  }

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Deseja realmente sair da plataforma?')) {
      window.api.clearToken();
      window.location.href = 'auth.html';
    }
  });

  // Package Modal & Search
  document.getElementById('newPackageBtn').addEventListener('click', () => openPackageModal());
  document.getElementById('closePackageModal').addEventListener('click', closePackageModal);
  document.getElementById('packageForm').addEventListener('submit', handleSavePackage);

  const pkgSearch = document.getElementById('packageSearchInput');
  const pkgDestFilter = document.getElementById('packageDestFilter');
  if (pkgSearch) pkgSearch.addEventListener('input', debounce(loadPackages, 300));
  if (pkgDestFilter) pkgDestFilter.addEventListener('change', loadPackages);

  // Reservation Modal & Filter
  document.getElementById('newReservationBtn').addEventListener('click', () => openReservationModal());
  document.getElementById('closeReservationModal').addEventListener('click', closeReservationModal);
  document.getElementById('reservationForm').addEventListener('submit', handleSaveReservation);

  const resSearch = document.getElementById('reservationSearchInput');
  const resFilter = document.getElementById('reservationStatusFilter');
  if (resSearch) resSearch.addEventListener('input', debounce(loadReservations, 300));
  if (resFilter) resFilter.addEventListener('change', loadReservations);

  // Agency Settings Form
  const agencyForm = document.getElementById('agencySettingsForm');
  if (agencyForm) {
    agencyForm.addEventListener('submit', handleSaveAgencySettings);
  }
}

function switchSection(sectionId) {
  document.querySelectorAll('.section').forEach((sec) => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-section]').forEach((btn) => btn.classList.remove('active'));

  const targetSec = document.getElementById(sectionId);
  const targetBtn = document.querySelector(`.nav-item[data-section="${sectionId}"]`);

  if (targetSec) targetSec.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');

  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth <= 900) {
    sidebar.classList.remove('active');
  }

  if (sectionId === 'packages') loadPackages();
  if (sectionId === 'reservations') loadReservations();
  if (sectionId === 'dashboard') loadStats();
}

async function loadInitialData() {
  await Promise.all([loadStats(), loadPackages(), loadReservations()]);
}

// ================= STATS & OVERVIEW =================
async function loadStats() {
  try {
    const res = await window.api.getStats();
    const stats = res.data;

    document.getElementById('totalPackages').textContent = stats.packages.total || 0;
    document.getElementById('totalReservations').textContent = stats.reservations.total || 0;
    document.getElementById('pendingReservations').textContent = stats.reservations.pending || 0;
    
    const formattedRevenue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(stats.reservations.total_revenue || 0);

    document.getElementById('totalRevenue').textContent = formattedRevenue;

    renderRecentActivity(stats.recent_activity || []);
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

function renderRecentActivity(recent) {
  const container = document.getElementById('recentReservationsList');
  if (!container) return;

  if (recent.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); font-size: 14px;">Nenhuma atividade recente registrada.</p>';
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${recent.map((r) => {
        const date = new Date(r.created_at).toLocaleDateString('pt-BR');
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #f8fafc; border-radius: 6px; font-size: 13px;">
            <div>
              <strong>${escapeHtml(r.client_name)}</strong> &bull; <span style="color: var(--text-muted);">${escapeHtml(r.package_title || 'Pacote')}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="badge badge-${escapeHtml(r.status)}">${escapeHtml(r.status)}</span>
              <span style="font-weight: 600;">USD ${parseFloat(r.total_price || 0).toFixed(2)}</span>
              <span style="color: var(--text-muted); font-size: 11px;">${date}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ================= PACKAGES =================
async function loadPackages() {
  const container = document.getElementById('packagesList');
  const search = document.getElementById('packageSearchInput')?.value || '';
  const destination = document.getElementById('packageDestFilter')?.value || '';

  try {
    const res = await window.api.getPackages({ search, destination });
    packagesData = res.data || [];
    renderPackages(packagesData);
  } catch (err) {
    console.error('Error loading packages:', err);
    container.innerHTML = `<div class="empty-state"><p style="color: var(--danger-color);">Erro ao carregar pacotes: ${err.message}</p></div>`;
  }
}

function renderPackages(packages) {
  const container = document.getElementById('packagesList');
  if (!container) return;

  if (packages.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📦</div>
        <h3>Nenhum pacote encontrado</h3>
        <p>Cadastre os roteiros e expedições exclusivas da sua agência.</p>
        <button class="btn btn-primary" onclick="openPackageModal()">+ Criar Primeiro Pacote</button>
      </div>
    `;
    return;
  }

  container.innerHTML = packages.map((pkg) => {
    const imageUrl = pkg.image_url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80';
    return `
      <div class="package-card">
        <div class="package-image-wrap">
          <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(pkg.title)}" loading="lazy">
          <span class="package-badge-dest">${escapeHtml(pkg.destination)}</span>
        </div>
        <div class="package-card-body">
          <h3>${escapeHtml(pkg.title)}</h3>
          <p class="package-desc">${escapeHtml(pkg.description || 'Sem descrição detalhada.')}</p>
          <div class="package-meta">
            <div class="package-price">USD ${parseFloat(pkg.price).toFixed(2)} <span>/ pessoa</span></div>
            <div class="package-duration">⏱️ ${pkg.duration_days} dias</div>
          </div>
        </div>
        <div class="package-card-actions">
          <button class="btn btn-sm btn-edit" onclick="editPackage('${pkg.id}')">✏️ Editar</button>
          <button class="btn btn-sm btn-delete" onclick="deletePackage('${pkg.id}')">🗑️ Excluir</button>
        </div>
      </div>
    `;
  }).join('');
}

function openPackageModal(pkg = null) {
  const modal = document.getElementById('packageModal');
  const title = document.getElementById('packageModalTitle');
  const form = document.getElementById('packageForm');

  form.reset();

  if (pkg) {
    title.textContent = 'Editar Pacote';
    document.getElementById('packageEditId').value = pkg.id;
    document.getElementById('packageTitle').value = pkg.title;
    document.getElementById('packageDestination').value = pkg.destination;
    document.getElementById('packagePrice').value = pkg.price;
    document.getElementById('packageDuration').value = pkg.duration_days;
    document.getElementById('packageParticipants').value = pkg.max_participants;
    document.getElementById('packageImageUrl').value = pkg.image_url || '';
    document.getElementById('packageDescription').value = pkg.description || '';

    let services = pkg.included_services;
    if (Array.isArray(services)) {
      document.getElementById('packageServices').value = services.join(', ');
    } else if (typeof services === 'string') {
      try {
        const parsed = JSON.parse(services);
        document.getElementById('packageServices').value = Array.isArray(parsed) ? parsed.join(', ') : services;
      } catch (e) {
        document.getElementById('packageServices').value = services;
      }
    }
  } else {
    title.textContent = 'Criar Novo Pacote';
    document.getElementById('packageEditId').value = '';
  }

  modal.classList.add('active');
}

function closePackageModal() {
  document.getElementById('packageModal').classList.remove('active');
}

async function handleSavePackage(e) {
  e.preventDefault();
  const saveBtn = document.getElementById('savePackageBtn');
  const editId = document.getElementById('packageEditId').value;

  const rawServices = document.getElementById('packageServices').value;
  const servicesArray = rawServices.split(',').map((s) => s.trim()).filter(Boolean);

  const payload = {
    title: document.getElementById('packageTitle').value.trim(),
    destination: document.getElementById('packageDestination').value.trim(),
    price: parseFloat(document.getElementById('packagePrice').value),
    duration_days: parseInt(document.getElementById('packageDuration').value, 10),
    max_participants: parseInt(document.getElementById('packageParticipants').value, 10),
    image_url: document.getElementById('packageImageUrl').value.trim() || undefined,
    included_services: servicesArray,
    description: document.getElementById('packageDescription').value.trim(),
  };

  try {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';

    if (editId) {
      await window.api.updatePackage(editId, payload);
    } else {
      await window.api.createPackage(payload);
    }

    closePackageModal();
    await loadPackages();
    await loadStats();
  } catch (err) {
    alert('Erro ao salvar pacote: ' + err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Salvar Pacote';
  }
}

window.editPackage = function(packageId) {
  const pkg = packagesData.find((p) => p.id === packageId);
  if (pkg) openPackageModal(pkg);
};

window.deletePackage = async function(packageId) {
  if (!confirm('Tem certeza que deseja excluir permanentemente este pacote?')) return;

  try {
    await window.api.deletePackage(packageId);
    await loadPackages();
    await loadStats();
  } catch (err) {
    alert('Erro ao excluir pacote: ' + err.message);
  }
};

// ================= RESERVATIONS =================
async function loadReservations() {
  const container = document.getElementById('reservationsList');
  const search = document.getElementById('reservationSearchInput')?.value || '';
  const status = document.getElementById('reservationStatusFilter')?.value || 'todas';

  try {
    const res = await window.api.getReservations({ search, status });
    reservationsData = res.data || [];
    renderReservations(reservationsData);
  } catch (err) {
    console.error('Error loading reservations:', err);
    container.innerHTML = `<div class="empty-state"><p style="color: var(--danger-color);">Erro ao carregar reservas: ${err.message}</p></div>`;
  }
}

function renderReservations(reservations) {
  const container = document.getElementById('reservationsList');
  if (!container) return;

  if (reservations.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📅</div>
        <h3>Nenhuma reserva encontrada</h3>
        <p>As reservas feitas pela vitrine ou registradas manualmente aparecerão aqui.</p>
        <button class="btn btn-primary" onclick="openReservationModal()">+ Criar Reserva Manual</button>
      </div>
    `;
    return;
  }

  container.innerHTML = reservations.map((res) => {
    const dateFormatted = res.travel_date
      ? new Date(res.travel_date).toLocaleDateString('pt-BR')
      : 'Data a definir';

    return `
      <div class="reservation-card">
        <div class="res-client-info">
          <h3>${escapeHtml(res.client_name)}</h3>
          <p>📧 ${escapeHtml(res.client_email)} &bull; 📞 ${escapeHtml(res.client_phone || 'Não informado')}</p>
          <p>👥 ${res.participants_count} passageiro(s) &bull; 🗓️ Viagem: <strong>${dateFormatted}</strong></p>
          <span class="res-package-badge">📦 ${escapeHtml(res.package_title || 'Pacote Personalizado')}</span>
          ${res.notes ? `<p style="font-size: 12px; color: #64748b; margin-top: 6px;"><em>"${escapeHtml(res.notes)}"</em></p>` : ''}
        </div>

        <div class="res-status-group">
          <div class="res-price">USD ${parseFloat(res.total_price || 0).toFixed(2)}</div>
          <span class="badge badge-${escapeHtml(res.status)}">${escapeHtml(res.status)}</span>
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <select onchange="updateReservationStatus('${res.id}', this.value)" class="filter-select" style="padding: 4px 8px; font-size: 12px;">
              <option value="">Alterar Status</option>
              <option value="confirmada">✅ Confirmar</option>
              <option value="pendente">⏳ Pendente</option>
              <option value="cancelada">❌ Cancelar</option>
            </select>
            <button class="btn btn-sm btn-delete" onclick="deleteReservation('${res.id}')">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function openReservationModal() {
  const modal = document.getElementById('reservationModal');
  const select = document.getElementById('reservationPackage');
  
  // Populate packages dropdown
  try {
    if (packagesData.length === 0) {
      const res = await window.api.getPackages();
      packagesData = res.data || [];
    }

    select.innerHTML = '<option value="">Selecione um pacote (ou deixe avulso)</option>' +
      packagesData.map((p) => `<option value="${p.id}">${escapeHtml(p.title)} (USD ${parseFloat(p.price).toFixed(2)})</option>`).join('');
  } catch (e) {
    select.innerHTML = '<option value="">Erro ao carregar pacotes</option>';
  }

  modal.classList.add('active');
}

function closeReservationModal() {
  document.getElementById('reservationModal').classList.remove('active');
}

async function handleSaveReservation(e) {
  e.preventDefault();
  const saveBtn = document.getElementById('saveReservationBtn');

  const payload = {
    package_id: document.getElementById('reservationPackage').value || null,
    client_name: document.getElementById('clientName').value.trim(),
    client_email: document.getElementById('clientEmail').value.trim(),
    client_phone: document.getElementById('clientPhone').value.trim(),
    participants_count: parseInt(document.getElementById('participantsCount').value, 10) || 1,
    travel_date: document.getElementById('travelDate').value || null,
    notes: document.getElementById('reservationNotes').value.trim(),
  };

  try {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';

    await window.api.createReservation(payload);
    closeReservationModal();
    document.getElementById('reservationForm').reset();
    await loadReservations();
    await loadStats();
  } catch (err) {
    alert('Erro ao registrar reserva: ' + err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Criar Reserva';
  }
}

window.updateReservationStatus = async function(reservationId, newStatus) {
  if (!newStatus) return;

  try {
    await window.api.updateReservation(reservationId, { status: newStatus });
    await loadReservations();
    await loadStats();
  } catch (err) {
    alert('Erro ao alterar status: ' + err.message);
  }
};

window.deleteReservation = async function(reservationId) {
  if (!confirm('Deseja realmente remover esta reserva?')) return;

  try {
    await window.api.deleteReservation(reservationId);
    await loadReservations();
    await loadStats();
  } catch (err) {
    alert('Erro ao excluir reserva: ' + err.message);
  }
};

// ================= SETTINGS =================
async function handleSaveAgencySettings(e) {
  e.preventDefault();
  const name = document.getElementById('settingsAgencyName').value.trim();
  const phone = document.getElementById('settingsAgencyPhone').value.trim();
  const country = document.getElementById('settingsAgencyCountry').value.trim();

  try {
    const res = await window.api.updateAgency({ name, phone, country });
    currentAgency = { ...currentAgency, ...res.data };
    updateUserUI();
    alert('Dados da agência atualizados com sucesso!');
  } catch (err) {
    alert('Erro ao atualizar dados: ' + err.message);
  }
}

// Helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

window.switchSection = switchSection;
window.openPackageModal = openPackageModal;
window.openReservationModal = openReservationModal;
