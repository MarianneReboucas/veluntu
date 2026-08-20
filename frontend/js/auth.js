// Auth Logic (Login & Registration)
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  const authMessage = document.getElementById('authMessage');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');

  // If already logged in, redirect to dashboard
  if (window.api && window.api.getToken() && localStorage.getItem('user')) {
    // Verify session
    window.api.getMe()
      .then(() => {
        window.location.href = 'dashboard.html';
      })
      .catch(() => {
        window.api.clearToken();
      });
  }

  // Switch to register form
  switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    hideMessage();
  });

  // Switch to login form
  switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    hideMessage();
  });

  // Handle login submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showMessage('Preencha seu e-mail e senha.', 'error');
      return;
    }

    try {
      setButtonLoading(loginBtn, true, 'Autenticando...');
      showMessage('Conectando ao sistema...', 'loading');

      const response = await window.api.login({ email, password });

      window.api.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      showMessage('Login realizado com sucesso! Redirecionando...', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    } catch (err) {
      showMessage(err.message || 'Falha ao autenticar. Verifique suas credenciais.', 'error');
    } finally {
      setButtonLoading(loginBtn, false, 'Entrar na Plataforma');
    }
  });

  // Handle register submit
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      agency_name: document.getElementById('agencyName').value.trim(),
      agency_email: document.getElementById('agencyEmail').value.trim(),
      agency_phone: document.getElementById('agencyPhone').value.trim(),
      admin_name: document.getElementById('adminName').value.trim(),
      admin_email: document.getElementById('adminEmail').value.trim(),
      admin_password: document.getElementById('adminPassword').value,
    };

    try {
      setButtonLoading(registerBtn, true, 'Criando agência...');
      showMessage('Criando ambiente para sua agência...', 'loading');

      const response = await window.api.register(formData);

      window.api.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      showMessage('Agência registrada com sucesso! Redirecionando para o painel...', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } catch (err) {
      showMessage(err.message || 'Erro ao registrar agência.', 'error');
    } finally {
      setButtonLoading(registerBtn, false, 'Criar Conta e Agência');
    }
  });

  function showMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = `auth-message show ${type}`;
  }

  function hideMessage() {
    authMessage.className = 'auth-message hidden';
  }

  function setButtonLoading(btn, isLoading, text) {
    if (!btn) return;
    btn.disabled = isLoading;
    btn.textContent = text;
  }
});
