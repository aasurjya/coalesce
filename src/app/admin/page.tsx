'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Trophy,
  LogOut,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Download,
  RefreshCw,
  Eye,
  Check,
  X,
  Loader2,
  UserCheck,
} from 'lucide-react';
import { Registration, RegistrationStatus } from '@/lib/types';

type FilterStatus = 'all' | RegistrationStatus;

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isAuthenticated) {
      const tl = gsap.timeline();
      
      tl.fromTo(
        '.admin-header',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );

      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
          '-=0.3'
        );
      }

      if (tableRef.current) {
        tl.fromTo(
          tableRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.2'
        );
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth', { credentials: 'include' });
      if (res.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/admin/registrations', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
      toast.error('Failed to fetch registrations');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    setIsAuthenticated(false);
    router.refresh();
  };

  const handleVerify = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/verify/${id}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Registration verified! Ticket sent to email.');
        fetchRegistrations();
        setSelectedReg(null);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Verification failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/reject/${id}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Registration rejected');
        fetchRegistrations();
        setSelectedReg(null);
      } else {
        toast.error('Rejection failed');
      }
    } catch (error) {
      console.error('Rejection failed:', error);
      toast.error('Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckIn = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/checkin/${id}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Checked in successfully');
        fetchRegistrations();
      } else {
        toast.error('Check-in failed');
      }
    } catch (error) {
      console.error('Check-in failed:', error);
      toast.error('Check-in failed');
    } finally {
      setActionLoading(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'College', 'UTR', 'Status', 'Checked In', 'Created At'];
    const rows = filteredRegistrations.map((r) => [
      r.name,
      r.email,
      r.phone,
      r.roll_college,
      r.utr,
      r.status,
      r.checked_in ? 'Yes' : 'No',
      new Date(r.created_at).toLocaleString(),
    ]);
    
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coalesce-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch =
      search === '' ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.utr.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === 'pending').length,
    verified: registrations.filter((r) => r.status === 'verified').length,
    rejected: registrations.filter((r) => r.status === 'rejected').length,
    checkedIn: registrations.filter((r) => r.checked_in).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050a14] gap-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gold/20 blur-[40px] rounded-full scale-150 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center rotate-12 glow-gold backdrop-blur-sm">
            <Trophy className="w-10 h-10 text-gold -rotate-12" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-gold/60 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse pl-[0.5em]">Initializing Console</p>
          <div className="w-32 h-[1px] bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)] animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Header */}
      <header className="admin-header bg-navy/80 backdrop-blur-xl border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20">
              <Trophy className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gradient-gold uppercase">COALESCE</h1>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-foreground/60 hover:text-gold transition-all duration-300 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-gold/5"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard icon={Users} label="Total Registrations" value={stats.total} color="text-foreground" />
          <StatCard icon={Clock} label="Pending Verification" value={stats.pending} color="text-yellow-500" />
          <StatCard icon={CheckCircle} label="Verified Passes" value={stats.verified} color="text-green-500" />
          <StatCard icon={XCircle} label="Rejected Entries" value={stats.rejected} color="text-red-500" />
          <StatCard icon={UserCheck} label="At-Event Check-ins" value={stats.checkedIn} color="text-blue-500" />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col xl:flex-row gap-6 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-gold transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email, or UTR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-elegant w-full pl-12 pr-6 py-4 rounded-2xl text-sm font-medium"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'verified', 'rejected'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  filter === status
                    ? 'bg-gold text-navy shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                    : 'bg-navy-light text-foreground/40 hover:text-gold border border-gold/5'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchRegistrations}
              className="btn-outline-gold p-4 rounded-2xl group"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5 group-active:rotate-180 transition-transform duration-500" />
            </button>
            <button
              onClick={exportCSV}
              className="btn-gold px-8 py-4 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div ref={tableRef} className="award-card rounded-[2rem] overflow-hidden border-gold/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy-light/50 border-b border-gold/10">
                  <th className="text-left px-8 py-6 text-gold/40 text-[10px] font-bold uppercase tracking-[0.3em]">Participant</th>
                  <th className="text-left px-8 py-6 text-gold/40 text-[10px] font-bold uppercase tracking-[0.3em]">Contact</th>
                  <th className="text-left px-8 py-6 text-gold/40 text-[10px] font-bold uppercase tracking-[0.3em]">Transaction ID</th>
                  <th className="text-left px-8 py-6 text-gold/40 text-[10px] font-bold uppercase tracking-[0.3em]">Status</th>
                  <th className="text-right px-8 py-6 text-gold/40 text-[10px] font-bold uppercase tracking-[0.3em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="group hover:bg-gold/5 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <p className="font-bold text-foreground group-hover:text-gold transition-colors">{reg.name}</p>
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{reg.roll_college}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-foreground/70">{reg.email}</p>
                        <p className="text-xs text-foreground/40 font-mono">{reg.phone}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="px-3 py-1.5 rounded-lg bg-navy text-gold text-xs font-mono border border-gold/10 tracking-wider">
                        {reg.utr}
                      </code>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={reg.status} checkedIn={reg.checked_in} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setSelectedReg(reg)}
                          className="p-3 rounded-xl bg-navy-light border border-gold/5 hover:border-gold/30 hover:bg-gold/10 text-foreground/40 hover:text-gold transition-all duration-300"
                          title="View Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {reg.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleVerify(reg.id)}
                              disabled={actionLoading === reg.id}
                              className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500 hover:text-navy text-green-500 transition-all duration-300 disabled:opacity-50"
                              title="Confirm Payment"
                            >
                              {actionLoading === reg.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(reg.id)}
                              disabled={actionLoading === reg.id}
                              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-navy text-red-500 transition-all duration-300 disabled:opacity-50"
                              title="Decline Payment"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {reg.status === 'verified' && !reg.checked_in && (
                          <button
                            onClick={() => handleCheckIn(reg.id)}
                            disabled={actionLoading === reg.id}
                            className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500 hover:text-navy text-blue-500 transition-all duration-300 disabled:opacity-50"
                            title="Verify Entry"
                          >
                            {actionLoading === reg.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-navy-light flex items-center justify-center border border-gold/5 text-gold/20">
                          <Search className="w-8 h-8" />
                        </div>
                        <p className="text-foreground/30 font-bold text-xs uppercase tracking-[0.3em]">No matching records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-gold/10 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-foreground/20">
        <p className="text-[10px] font-bold uppercase tracking-widest">COALESCE 2026 Management Console</p>
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span>Developed by</span>
            <a href="https://aasurjya.in" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors">Aasurjya</a>
          </div>
          <div className="h-1 w-1 rounded-full bg-gold/20" />
          <a href="mailto:corp.surjya@gmail.com" className="hover:text-gold transition-colors lowercase tracking-normal">corp.surjya@gmail.com</a>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedReg && (
        <DetailModal
          registration={selectedReg}
          onClose={() => setSelectedReg(null)}
          onVerify={handleVerify}
          onReject={handleReject}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { y: 30, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (res.ok) {
        onSuccess();
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80\u0026w=2612\u0026auto=format\u0026fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-background/60 z-0" />
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
      
      <div ref={containerRef} className="award-card rounded-[2.5rem] p-12 w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-3xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6 rotate-12">
            <Trophy className="w-10 h-10 text-gold -rotate-12" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gradient-gold uppercase">Admin Access</h1>
          <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Authorization Required</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gold/40 uppercase tracking-widest ml-4">Identifier</p>
            <input
              type="email"
              placeholder="admin@coalesce.event"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-elegant w-full px-6 py-4 rounded-2xl text-sm font-medium"
              required
            />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gold/40 uppercase tracking-widest ml-4">Access Key</p>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-elegant w-full px-6 py-4 rounded-2xl text-sm font-medium"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl transition-all duration-500 hover:shadow-gold/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <span>Authorize</span>
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="award-card rounded-3xl p-8 transition-all duration-500 hover:border-gold/30 group">
      <div className="flex flex-col gap-6">
        <div className={`w-12 h-12 rounded-2xl bg-navy-light flex items-center justify-center border border-gold/5 ${color} group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-4xl font-black text-foreground mb-1 tabular-nums">{value}</p>
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">{label}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, checkedIn }: { status: RegistrationStatus; checkedIn: boolean }) {
  if (checkedIn) {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <UserCheck className="w-3 h-3" />
        Checked In
      </span>
    );
  }
  
  const styles = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    verified: 'bg-green-500/10 text-green-400 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  
  return (
    <span className={`inline-block px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
}

function DetailModal({
  registration,
  onClose,
  onVerify,
  onReject,
  actionLoading,
}: {
  registration: Registration;
  onClose: () => void;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  actionLoading: string | null;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      modalRef.current,
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, { scope: modalRef });

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div ref={modalRef} className="award-card rounded-[2.5rem] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border-gold/20" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gradient-gold uppercase">Participant Dossier</h2>
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Verification Record</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl bg-navy-light hover:bg-gold/10 text-foreground/20 hover:text-gold transition-all duration-300 border border-gold/5">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <DetailRow label="Full Name" value={registration.name} />
            <DetailRow label="Email Address" value={registration.email} />
            <DetailRow label="Phone Number" value={registration.phone} />
            <DetailRow label="College / Roll" value={registration.roll_college} />
            <DetailRow label="Transaction ID" value={registration.utr} highlight />
            <DetailRow label="Submission" value={new Date(registration.created_at).toLocaleString()} />
          </div>

          <div className="space-y-8">
            {registration.screenshot_url ? (
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gold/40 uppercase tracking-[0.3em]">Payment Evidence</p>
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-gold/10 group/img">
                  <Image
                    src={registration.screenshot_url}
                    alt="Payment Screenshot"
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <a
                    href={registration.screenshot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-navy/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center"
                  >
                    <span className="px-6 py-3 rounded-full bg-gold text-navy font-bold text-xs uppercase tracking-widest">Enlarge Evidence</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="aspect-[3/4] rounded-3xl bg-navy-light flex items-center justify-center border border-gold/5 border-dashed">
                <p className="text-foreground/20 font-bold text-[10px] uppercase tracking-widest text-center px-8 line-clamp-3">No screenshot evidence provided by participant</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-10 border-t border-gold/10 flex flex-wrap gap-4">
          {registration.status === 'pending' && (
            <>
              <button
                onClick={() => onVerify(registration.id)}
                disabled={actionLoading === registration.id}
                className="flex-1 min-w-[200px] bg-green-500 text-navy py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-green-400 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-green-500/10"
              >
                {actionLoading === registration.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Authorize Payment
                  </>
                )}
              </button>
              <button
                onClick={() => onReject(registration.id)}
                disabled={actionLoading === registration.id}
                className="px-10 bg-red-500/10 text-red-500 border border-red-500/20 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 hover:text-navy transition-all duration-300 flex items-center justify-center gap-3"
              >
                <X className="w-5 h-5" />
                Reject
              </button>
            </>
          )}
          {registration.ticket_url && (
            <a
              href={registration.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] bg-gold text-navy py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-gold/10"
            >
              <Download className="w-5 h-5" />
              Download Digital Pass
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-gold/40 uppercase tracking-[0.3em]">{label}</p>
      <p className={`text-lg font-bold leading-tight ${highlight ? 'text-gold font-mono break-all' : 'text-foreground'}`}>
        {value}
      </p>
    </div>
  );
}

