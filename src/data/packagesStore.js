/**
 * packagesStore.js
 * Sistema de sincronização automática com o Supabase.
 * - Toda criação, edição de valor, foto, destino e exclusão no Painel Admin é salva no Supabase.
 * - Todas as telas públicas e mobile buscam os dados sempre atualizados do Supabase.
 */
import { curatedPackages } from './packagesData';
import { supabase } from '../services/supabaseClient';

const STORAGE_KEY = 'veluntu_packages_store_cloud_v2';

/** Busca pacotes atualizados direto do Supabase */
export async function fetchRemotePackages() {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const normalized = data.map(normalizePackage);
      saveAll(normalized);
      return normalized;
    }
  } catch (err) {
    console.warn('[packagesStore] Erro ao buscar do Supabase:', err.message);
  }
  return getAllPackages();
}

/** Lê todos os pacotes do cache local ou do catálogo base */
export function getAllPackages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizePackage);
      }
    }
  } catch (e) {
    console.warn('[packagesStore] Erro ao ler cache local:', e);
  }

  const initial = curatedPackages.map(normalizePackage);
  saveAll(initial);
  return initial;
}

/** Filtra pacotes por destino */
export function getPackagesByDest(destination) {
  const all = getAllPackages();
  if (!destination || destination === 'all' || destination === 'Todos os Destinos') return all;
  const q = destination.toLowerCase().trim();
  return all.filter((p) =>
    p.destination?.toLowerCase().includes(q) || q.includes(p.destination?.toLowerCase())
  );
}

/** Busca pacotes por texto */
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

/** Lê pacote por ID */
export function getPackageById(id) {
  return getAllPackages().find((p) => String(p.id) === String(id)) || null;
}

/** Cria um novo pacote e envia para o Supabase */
export async function createPackage(data) {
  const all = getAllPackages();
  const newPkg = normalizePackage({
    ...data,
    id: `pkg-${Date.now()}`,
    created_at: new Date().toISOString(),
    status: data.status || 'active',
  });

  const updated = [newPkg, ...all];
  saveAll(updated);

  try {
    const { data: inserted, error } = await supabase
      .from('packages')
      .insert([{
        title: newPkg.title,
        description: newPkg.description,
        destination: newPkg.destination,
        price: newPkg.price,
        currency: newPkg.currency,
        duration_days: newPkg.duration_days,
        included_services: newPkg.included_services,
        max_participants: newPkg.max_participants,
        image_url: newPkg.image_url,
        status: newPkg.status,
      }])
      .select()
      .maybeSingle();

    if (!error && inserted) {
      const live = updated.map((p) => (p.id === newPkg.id ? normalizePackage(inserted) : p));
      saveAll(live);
    }
  } catch (err) {
    console.warn('[packagesStore] Erro ao persistir no Supabase:', err.message);
  }

  return newPkg;
}

/** Atualiza um pacote existente no Supabase e no cache local */
export async function updatePackage(id, data) {
  const all = getAllPackages();
  const idx = all.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) throw new Error('Pacote não encontrado.');

  const updatedItem = normalizePackage({ ...all[idx], ...data, id });
  const updated = [...all];
  updated[idx] = updatedItem;
  saveAll(updated);

  try {
    const payload = {
      title: updatedItem.title,
      description: updatedItem.description,
      destination: updatedItem.destination,
      price: updatedItem.price,
      currency: updatedItem.currency,
      duration_days: updatedItem.duration_days,
      included_services: updatedItem.included_services,
      max_participants: updatedItem.max_participants,
      image_url: updatedItem.image_url,
      status: updatedItem.status,
      updated_at: new Date().toISOString(),
    };

    let res = await supabase.from('packages').update(payload).eq('id', id);
    if (res.error || !res.count) {
      await supabase.from('packages').update(payload).ilike('title', updatedItem.title);
    }
  } catch (err) {
    console.warn('[packagesStore] Erro ao atualizar no Supabase:', err.message);
  }

  return updatedItem;
}

/** Exclui um pacote no Supabase e no cache */
export async function deletePackage(id) {
  const all = getAllPackages();
  const target = all.find((p) => String(p.id) === String(id));
  const updated = all.filter((p) => String(p.id) !== String(id));
  saveAll(updated);

  try {
    await supabase.from('packages').delete().eq('id', id);
    if (target?.title) {
      await supabase.from('packages').delete().ilike('title', target.title);
    }
  } catch (err) {
    console.warn('[packagesStore] Erro ao deletar no Supabase:', err.message);
  }
}

/** Reseta o catálogo */
export function resetToDefault() {
  localStorage.removeItem(STORAGE_KEY);
  const initial = curatedPackages.map(normalizePackage);
  saveAll(initial);
  return initial;
}

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

export function normalizePackage(pkg) {
  const price = parseFloat(pkg.price || pkg.pricePerPerson || 0);

  let priceForTwo = price * 2;
  if (pkg.priceForTwo !== undefined && pkg.priceForTwo !== '' && !isNaN(parseFloat(pkg.priceForTwo))) {
    priceForTwo = parseFloat(pkg.priceForTwo);
  }

  const services = Array.isArray(pkg.included_services)
    ? pkg.included_services
    : typeof pkg.included_services === 'string' && pkg.included_services.trim()
    ? (pkg.included_services.startsWith('[') ? JSON.parse(pkg.included_services) : pkg.included_services.split(',').map((s) => s.trim()))
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

// Inicializa a sincronização ao carregar a página
if (typeof window !== 'undefined') {
  fetchRemotePackages();
}
