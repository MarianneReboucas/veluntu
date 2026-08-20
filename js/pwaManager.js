/* VELUNTU - Gerenciador da Experiência PWA Mobile-First */

document.addEventListener('DOMContentLoaded', () => {
  initMobileBottomNav();
  initImageFallbackHandler();
  initPWAInstallPrompt();
});

/* Mobile Bottom Navigation Controller */
function initMobileBottomNav() {
  const navItems = document.querySelectorAll('.bottom-nav-item');
  if (!navItems.length) return;

  // Highlight active bottom nav item based on current page URL
  const currentPath = window.location.pathname.toLowerCase();
  const currentHash = window.location.hash.toLowerCase();

  navItems.forEach(item => {
    const route = item.getAttribute('data-route');
    if (route === 'mapa' && currentPath.includes('mapa.html')) {
      item.classList.add('active');
    } else if (route === 'colecao' && currentPath.includes('colecao.html') && !currentHash.includes('jornada')) {
      item.classList.add('active');
    } else if (route === 'jornada' && (currentHash.includes('jornada') || currentPath.includes('colecao.html'))) {
      item.classList.add('active');
    } else if (route === 'explorar' && (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/veluntu/'))) {
      item.classList.add('active');
    }

    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* Image Error & Fallback Handler */
function initImageFallbackHandler() {
  document.addEventListener('error', (e) => {
    if (e.target.tagName.toLowerCase() === 'img') {
      const img = e.target;
      img.onerror = null; // Prevent loop
      
      // Replace with clean neutral fallback placeholder
      const parent = img.parentElement;
      if (parent && !img.dataset.hasFallback) {
        img.dataset.hasFallback = 'true';
        img.style.display = 'none';

        const fallback = document.createElement('div');
        fallback.className = 'img-fallback-box';
        fallback.innerHTML = `
          <svg style="width:24px; height:24px; stroke:currentColor; fill:none; margin-bottom:6px;" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>FOTOGRAFIA EDITORIAL</span>
        `;
        parent.appendChild(fallback);
      }
    }
  }, true);
}

/* PWA Install Prompt & Service Worker Lifecycle */
let pwaDeferredPrompt = null;

function initPWAInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    pwaDeferredPrompt = e;

    const banner = document.getElementById('pwaInstallBanner');
    if (banner) {
      banner.classList.add('show');
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('Veluntu PWA instalado com sucesso!');
    pwaDeferredPrompt = null;
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) banner.classList.remove('show');
  });
}

function installVeluntuPWA() {
  if (pwaDeferredPrompt) {
    pwaDeferredPrompt.prompt();
    pwaDeferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação do PWA');
      }
      pwaDeferredPrompt = null;
      dismissPWABanner();
    });
  }
}
