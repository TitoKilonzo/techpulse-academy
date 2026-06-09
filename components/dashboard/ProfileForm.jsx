'use client';
import { useState } from 'react';
import { User, Mail, Lock, Shield, Check, Loader2, Edit2, Key } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function ProfileForm({ user }) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [busy, setBusy] = useState(false);
  
  // Forms
  const [general, setGeneral] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' });

  async function handleUpdate(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    
    // Simulating API call since backend isn't fully implemented for this yet
    setTimeout(() => {
      addToast('Profile updated successfully!', 'success');
      setBusy(false);
    }, 1000);
  }

  async function handlePassword(e) {
    e.preventDefault();
    if (busy) return;
    
    if (pwd.new !== pwd.confirm) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    
    setBusy(true);
    setTimeout(() => {
      addToast('Password changed successfully!', 'success');
      setPwd({ current: '', new: '', confirm: '' });
      setBusy(false);
    }, 1000);
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg-primary)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: '12px 14px 12px 40px', color: 'var(--text-primary)',
    fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s',
  };

  return (
    <div className="card-premium" style={{ marginTop: 32 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'general', label: 'General Info', Icon: User },
          { id: 'security', label: 'Security', Icon: Shield },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === id ? 'var(--orange)' : 'transparent'}`,
              color: activeTab === id ? 'var(--orange)' : 'var(--text-secondary)',
              fontWeight: activeTab === id ? 700 : 500, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      <div style={{ padding: '32px 24px' }}>
        {activeTab === 'general' && (
          <form onSubmit={handleUpdate} className="animate-fade-in" style={{ maxWidth: 480 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>Personal Information</h3>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>FULL NAME</label>
              <div style={{ position: 'relative' }}>
                <Edit2 size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" value={general.name} onChange={e => setGeneral(p => ({...p, name: e.target.value}))} required style={inputStyle} className="focus-ring" />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>EMAIL ADDRESS</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" value={general.email} onChange={e => setGeneral(p => ({...p, email: e.target.value}))} required style={inputStyle} className="focus-ring" />
              </div>
            </div>

            <button type="submit" disabled={busy} className="btn-primary" style={{ padding: '12px 24px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              {busy ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> Save Changes</>}
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handlePassword} className="animate-fade-in" style={{ maxWidth: 480 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>Change Password</h3>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>CURRENT PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="password" value={pwd.current} onChange={e => setPwd(p => ({...p, current: e.target.value}))} required style={inputStyle} className="focus-ring" />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>NEW PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="password" value={pwd.new} onChange={e => setPwd(p => ({...p, new: e.target.value}))} required style={inputStyle} className="focus-ring" />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>CONFIRM NEW PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="password" value={pwd.confirm} onChange={e => setPwd(p => ({...p, confirm: e.target.value}))} required style={inputStyle} className="focus-ring" />
              </div>
            </div>

            <button type="submit" disabled={busy} className="btn-primary" style={{ padding: '12px 24px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              {busy ? <Loader2 size={18} className="animate-spin" /> : <><Lock size={18} /> Update Password</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
