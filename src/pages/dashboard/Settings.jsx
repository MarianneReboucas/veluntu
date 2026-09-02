import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  background: '#080c16',
  border: '1px solid rgba(255,255,255,0.1)',
  fontSize: '13px',
  color: '#FFFFFF',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '600',
  color: '#94a3b8',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export default function Settings() {
  const { agency, user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout
      title="Configurações da Agência"
      subtitle="Gerencie os dados institucionais, plano de assinatura e preferências da plataforma"
    >
      <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Banner do Plano */}
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #141d30, #0c1220)',
          border: '1px solid rgba(212,175,55,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: '#d4af37' }}>
              VIP
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                  Plano {agency?.subscription_plan || 'Starter'}
                </h3>
                <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
                  Ativo
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                Acesso ilimitado a pacotes, leads em tempo real e relatórios
              </p>
            </div>
          </div>
          <button style={{ padding: '8px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #d4af37, #aa851e)', color: '#0a0e17', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', border: 'none', cursor: 'pointer' }}>
            Fazer Upgrade VIP
          </button>
        </div>

        {/* Formulário do Perfil Corporativo */}
        <div style={{ padding: '32px', borderRadius: '16px', background: '#0e1424', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Perfil Corporativo
          </h3>

          {saved && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', fontSize: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Configurações salvas com sucesso!
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nome da Agência</label>
                <input type="text" defaultValue={agency?.name || 'Veluntu Travel'} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>E-mail Institucional</label>
                <input type="email" defaultValue={agency?.email || 'contato@agencia.com'} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Telefone Principal</label>
                <input type="tel" defaultValue={agency?.phone || '+55 11 99999-8888'} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>País Sede</label>
                <input type="text" defaultValue={agency?.country || 'Brasil'} style={inputStyle} />
              </div>
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                style={{ padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #d4af37, #aa851e)', color: '#0a0e17', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}
