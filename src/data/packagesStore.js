/**
 * packagesStore.js
 * Camada de persistência local para os pacotes gerenciados pelo administrador.
 * Usa localStorage para salvar edições, criações e exclusões.
 * Quando o backend está offline, todos os dados vêm daqui.
 */
import { curatedPackages } from './packagesData';

const STORAGE_KEY = 'veluntu_packages_store';

/** Lê todos os pacotes do store (localStorage ou catálogo base) */
export function getAllPackages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Retorna a lista gravada pelo usuário/admin normalizada
        return parsed.map(normalizePackage);
      }
    }
  } catch (e) {
    console.warn('[packagesStore] Erro ao ler localStorage:', e);
  }
  // Inicializa com o catálogo curado padrão apenas se ainda não existir nada gravado
  const initial = curatedPackages.map(normalizePackage);
  saveAll(initial);
  return initial;
}

/** Filtra por destino */
export function getPackagesByDest(destination) {
  const all = getAllPackages();
  if (!destination || destination === 'all' || destination === 'Todos os Destinos') return all;
  const q = destination.toLowerCase().trim();
  return all.filter((p) =>
    p.destination?.toLowerCase().includes(q) || q.includes(p.destination?.toLowerCase())
  );
}

/** Busca por texto */
export function searchPackages(query) {
  const all = getAllPackages();
  if (!query) return all;
  const q = query.toLowerCase();
  return all.filter(
    (p) =>
      p.title?.toLowerCase().includes(q) ||
      p.destination?.toLowerCase().includes(q)
  );
}

/** Lê um pacote por ID */
export function getPackageById(id) {
  return getAllPackages().find((p) => p.id === id) || null;
}

/** Cria um novo pacote */
export function createPackage(data) {
  const all = getAllPackages();
  const newPkg = normalizePackage({
    ...data,
    id: `pkg-${Date.now()}`,
    created_at: new Date().toISOString(),
    status: data.status || 'active',
  });
  const updated = [newPkg, ...all];
  saveAll(updated);
  return newPkg;
}

/** Atualiza um pacote existente */
export function updatePackage(id, data) {
  const all = getAllPackages();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error(`Pacote com id "${id}" não encontrado.`);
  const updated = [...all];
  updated[idx] = normalizePackage({ ...updated[idx], ...data, id });
  saveAll(updated);
  return updated[idx];
}

/** Exclui um pacote */
export function deletePackage(id) {
  const all = getAllPackages();
  const updated = all.filter((p) => p.id !== id);
  saveAll(updated);
}

/** Reseta o store para o catálogo original */
export function resetToDefault() {
  localStorage.removeItem(STORAGE_KEY);
  const initial = curatedPackages.map(normalizePackage);
  saveAll(initial);
  return initial;
}

// ─── helpers internos ───────────────────────────────────────────────────────

function saveAll(packages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('veluntu_packages_updated', { detail: packages }));
    }
  } catch (e) {
    console.warn('[packagesStore] Erro ao salvar no localStorage:', e);
  }
}

function normalizePackage(pkg) {
  const price = parseFloat(pkg.price || pkg.pricePerPerson || 24000);
  
  // priceForTwo é definido independentemente pelo admin (com desconto)
  let priceForTwo = price * 2;
  if (pkg.priceForTwo !== undefined && pkg.priceForTwo !== '' && !isNaN(parseFloat(pkg.priceForTwo))) {
    priceForTwo = parseFloat(pkg.priceForTwo);
  }

  const services = Array.isArray(pkg.included_services)
    ? pkg.included_services
    : typeof pkg.included_services === 'string' && pkg.included_services.trim()
    ? pkg.included_services.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    id: pkg.id || `pkg-${Date.now()}`,
    title: pkg.title || '',
    destination: pkg.destination || '',
    duration_days: parseInt(pkg.duration_days) || 7,
    price: price,
    pricePerPerson: price,
    priceForTwo: priceForTwo,
    currency: pkg.currency || 'R$',
    image_url: pkg.image_url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    description: pkg.description || '',
    included_services: services,
    max_participants: parseInt(pkg.max_participants) || 8,
    status: pkg.status || 'active',
    created_at: pkg.created_at || new Date().toISOString(),
  };
}
