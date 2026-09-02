import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  UserCheck,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  Key,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/useAuthStore';
import { BestsellersBookShowcase } from '../shaders/landing-pages/LandingPages';
import '../shaders/threeui.css';

interface LoginPageProps {
  onLogin: (role: 'STUDENT' | 'MENTOR' | 'ADMIN') => void;
  onBackToLanding: () => void;
  initialRole?: 'STUDENT' | 'MENTOR' | 'ADMIN';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onBackToLanding,
  initialRole = 'STUDENT'
}) => {
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'MENTOR' | 'ADMIN'>(initialRole);
  const [showCredentialModal, setShowCredentialModal] = useState(false);

  // Input fields for custom credential login
  const [emailInput, setEmailInput] = useState(() => {
    if (initialRole === 'MENTOR') return 's.kulkarni@vit.edu.in';
    if (initialRole === 'ADMIN') return 'admin@vit.edu.in';
    return '2023CSE001';
  });
  const [passwordInput, setPasswordInput] = useState('password123');

  const { login, isLoggingIn } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);

  const handleRoleTabChange = (role: 'STUDENT' | 'MENTOR' | 'ADMIN') => {
    setSelectedRole(role);
    if (role === 'STUDENT') {
      setEmailInput('2023CSE001');
    } else if (role === 'MENTOR') {
      setEmailInput('s.kulkarni@vit.edu.in');
    } else {
      setEmailInput('admin@vit.edu.in');
    }
  };

  const handleRoleLogin = async (role: 'STUDENT' | 'MENTOR' | 'ADMIN', customEmail?: string, customPass?: string) => {
    let email = customEmail;
    let rollNo: string | undefined;
    const password = customPass || 'password123';

    if (!email) {
      if (role === 'STUDENT') {
        rollNo = '2023CSE001';
      } else if (role === 'MENTOR') {
        email = 's.kulkarni@vit.edu.in';
      } else {
        email = 'admin@vit.edu.in';
      }
    } else {
      if (!email.includes('@')) {
        rollNo = email;
        email = undefined;
      }
    }

    try {
      await login({
        email,
        rollNo,
        password,
        role,
      });
    } catch (err) {
      // Offline/demo fallback
    }

    // Set user profile in state store
    setUser({
      _id: role === 'STUDENT' ? 'std_01' : role === 'MENTOR' ? 'men_01' : 'adm_01',
      name: role === 'STUDENT' ? 'Krishna Singh' : role === 'MENTOR' ? 'Prof. S. Kulkarni' : 'Institutional Admin',
      email: email || (role === 'STUDENT' ? '2023cse001@vit.edu.in' : role === 'MENTOR' ? 's.kulkarni@vit.edu.in' : 'admin@vit.edu.in'),
      role: role,
      department: 'Computer Engineering',
      rollNo: role === 'STUDENT' ? '2023CSE001' : undefined,
      cgpa: 9.42,
      attendancePercentage: 88.5,
    });

    onLogin(role);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRoleLogin(selectedRole, emailInput, passwordInput);
  };

  // Listen for iframe role selection messages from BestsellersBookShowcase
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'campus1-role-select') {
        const role = event.data.role;
        if (role === 'LANDING') {
          onBackToLanding();
        } else if (role === 'STUDENT' || role === 'MENTOR' || role === 'ADMIN') {
          handleRoleLogin(role);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLogin, onBackToLanding]);

  return (
    <div className="shader-frame relative w-full h-screen overflow-hidden bg-[#0C2238] select-none flex flex-col justify-between">
      
      {/* Exact Configured ThreeUI BestsellersBookShowcase Implementation */}
      <BestsellersBookShowcase
        headingFont="iowan-old-style"
        bodyFont="iowan-old-style"
        headingWeight="500"
        bodyWeight="400"
        primaryColor="#c3a47b"
        headingSize={325}
        bodySize={17}
        headingLetterSpacing={-0.085}
        style={{ width: '100vw', height: '100vh', border: 0 }}
      />

      {/* Top Navigation Bar */}
      <header className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-auto max-w-7xl mx-auto px-4">
        <button
          type="button"
          onClick={onBackToLanding}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#0C2238]/90 hover:bg-[#10253A] text-[#F7F4EE] text-xs font-bold border border-[#C99632]/40 shadow-xl backdrop-blur-md transition-all cursor-pointer hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4 text-[#E8C56B]" />
          <span>← Back to Campus1</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowCredentialModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#10253A]/90 hover:bg-[#123B63] text-[#F7F4EE] text-xs font-bold border border-[#C99632]/40 backdrop-blur-md shadow-lg transition-all cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-[#E8C56B]" />
            <span>Enter Credentials</span>
          </button>
        </div>
      </header>

      {/* Floating Bottom Quick Login Action Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-3 bg-[#0C2238]/95 backdrop-blur-2xl p-2 px-5 rounded-full border border-[#C99632]/40 shadow-2xl pointer-events-auto">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C99632] mr-1 hidden md:inline">
          Sign In:
        </span>

        {/* LEFT ROLE: TEACHER */}
        <button
          type="button"
          disabled={isLoggingIn}
          onClick={() => handleRoleLogin('MENTOR')}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#123B63] hover:bg-[#1B365D] text-[#F7F4EE] text-xs font-bold border border-white/10 transition-all cursor-pointer shadow-md hover:-translate-y-0.5 disabled:opacity-50"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#E8C56B]" />
          <span>Teacher</span>
        </button>

        {/* CENTER ROLE: STUDENT (PRIMARY) */}
        <button
          type="button"
          disabled={isLoggingIn}
          onClick={() => handleRoleLogin('STUDENT')}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#C99632] hover:bg-[#E8C56B] text-[#0C2238] text-xs font-black shadow-lg transition-all cursor-pointer scale-105 hover:scale-110 disabled:opacity-50"
        >
          <GraduationCap className="w-4 h-4 text-[#0C2238]" />
          <span>Student Login ★</span>
        </button>

        {/* RIGHT ROLE: ADMIN */}
        <button
          type="button"
          disabled={isLoggingIn}
          onClick={() => handleRoleLogin('ADMIN')}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#1B365D] hover:bg-[#123B63] text-[#F7F4EE] text-xs font-bold border border-white/10 transition-all cursor-pointer shadow-md hover:-translate-y-0.5 disabled:opacity-50"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#E8C56B]" />
          <span>Admin</span>
        </button>
      </div>

      {/* Optional Credential Input Modal for Custom Username & Password */}
      <AnimatePresence>
        {showCredentialModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FFFCF7] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#0C2238]/15 space-y-6 relative"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowCredentialModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#EFE7D8] text-[#10253A] transition-colors cursor-pointer"
                aria-label="Close credentials dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 text-center">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EFE7D8] border border-[#C99632]/25">
                  <Sparkles className="w-3.5 h-3.5 text-[#C99632]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A6437]">
                    AUTHENTICATION GATEWAY
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#10253A]">Institutional Sign In</h3>
                <p className="text-xs text-[#627083]">Enter your roll number or campus email</p>
              </div>

              {/* Role tabs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'STUDENT', title: 'Student', icon: GraduationCap },
                  { id: 'MENTOR', title: 'Teacher', icon: UserCheck },
                  { id: 'ADMIN', title: 'Admin', icon: ShieldCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = selectedRole === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleRoleTabChange(item.id as any)}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#0C2238] text-white border-[#0C2238] shadow-md'
                          : 'bg-[#F7F4EE] text-[#10253A] border-[#0C2238]/10 hover:bg-[#EFE7D8]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSel ? 'text-[#E8C56B]' : 'text-[#0C2238]'}`} />
                      <span className="text-[11px] font-extrabold">{item.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form inputs */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#10253A]">
                    {selectedRole === 'STUDENT' ? 'Roll No / Email' : 'Institutional Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#5A6E7F] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F2E9] border border-[#E2D7C6] text-xs font-semibold text-[#10253A] focus:outline-none focus:border-[#123B63]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#10253A]">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#5A6E7F] absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F2E9] border border-[#E2D7C6] text-xs font-semibold text-[#10253A] focus:outline-none focus:border-[#123B63]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 px-6 rounded-xl bg-[#0C2238] hover:bg-[#123B63] text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Sign In as {selectedRole === 'STUDENT' ? 'Student' : selectedRole === 'MENTOR' ? 'Teacher' : 'Admin'}</span>
                  <ArrowRight className="w-4 h-4 text-[#E8C56B]" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
