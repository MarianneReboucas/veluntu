import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('admin@veluntu.com');
  const [password, setPassword] = useState('admin123');
  
  // Register state
  const [regData, setRegData] = useState({
    agency_name: '',
    agency_email: '',
    agency_phone: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(regData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao registrar agência.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D1D06', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        <Link to="/" style={{ color: 'rgba(250, 248, 245, 0.7)', fontSize: '13px', display: 'inline-block', marginBottom: '20px' }}>
          &larr; Voltar para a Vitrine Veluntu
        </Link>

        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: '#17320B', fontSize: '28px', fontWeight: '800', letterSpacing: '4px', marginBottom: '4px' }}>
              VELUNTU
            </h1>
            <p style={{ color: '#CC7A00', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Plataforma SaaS para Agências de Luxo
            </p>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {!isRegister ? (
            /* Login Form */
            <form onSubmit={handleLogin}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#141414', marginBottom: '20px', textAlign: 'center' }}>
                Entrar no Painel da Agência
              </h2>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label>E-mail do Administrador</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@veluntu.com"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label>Senha de Acesso</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginBottom: '20px' }}>
                {loading ? 'Entrando...' : 'Entrar na Plataforma'}
              </button>

              <div style={{ background: '#f8f9fa', border: '1px dashed #c99738', borderRadius: '6px', padding: '12px', fontSize: '12px', color: '#333', lineHeight: '1.5', marginBottom: '20px' }}>
                <strong>Acesso Demonstrativo Liberado:</strong><br />
                E-mail: <code>admin@veluntu.com</code> | Senha: <code>admin123</code>
              </div>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
                Sua agência ainda não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  style={{ background: 'none', border: 'none', color: '#CC7A00', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Registre-se agora
                </button>
              </p>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#141414', marginBottom: '20px', textAlign: 'center' }}>
                Cadastrar Nova Agência
              </h2>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>Nome da Agência</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aurora Luxury Travel"
                  value={regData.agency_name}
                  onChange={(e) => setRegData({ ...regData, agency_name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>E-mail Corporativo da Agência</label>
                <input
                  type="email"
                  required
                  placeholder="contato@agencia.com"
                  value={regData.agency_email}
                  onChange={(e) => setRegData({ ...regData, agency_email: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>Nome do Administrador</label>
                <input
                  type="text"
                  required
                  placeholder="Seu Nome Completo"
                  value={regData.admin_name}
                  onChange={(e) => setRegData({ ...regData, admin_name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>E-mail de Login do Administrador</label>
                <input
                  type="email"
                  required
                  placeholder="admin@agencia.com"
                  value={regData.admin_email}
                  onChange={(e) => setRegData({ ...regData, admin_email: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Senha de Acesso (Mín. 6 dígitos)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={regData.admin_password}
                  onChange={(e) => setRegData({ ...regData, admin_password: e.target.value })}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }}>
                {loading ? 'Criando Conta...' : 'Cadastrar Agência &rarr;'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
                Já possui uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  style={{ background: 'none', border: 'none', color: '#CC7A00', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Fazer Login
                </button>
              </p>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
