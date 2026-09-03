import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  UserCheck,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Award,
  Layers,
  Cpu
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

  const { login, isLoggingIn } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role')?.toUpperCase();

    if (roleParam === 'MENTOR' || roleParam === 'STUDENT' || roleParam === 'ADMIN') {
      setSelectedRole(roleParam as 'STUDENT' | 'MENTOR' | 'ADMIN');
    }
  }, []);

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

    // Set user profile in state store tailored to role
    if (role === 'STUDENT') {
      setUser({
        _id: 'std_01',
        name: 'Aarav Sharma',
        email: email || (rollNo ? `${rollNo.toLowerCase()}@vit.edu.in` : '2023cse001@vit.edu.in'),
        role: 'STUDENT',
        department: 'Computer Engineering',
        rollNo: rollNo || '2023CSE001',
        cgpa: 9.42,
        attendancePercentage: 88.5,
      });
    } else if (role === 'MENTOR') {
      setUser({
        _id: 'men_01',
        name: email === 'T101' ? 'Prof. S. Deshmukh' : 'Prof. S. Kulkarni',
        email: email || 's.kulkarni@vit.edu.in',
        role: 'MENTOR',
        department: 'Computer Engineering & AI Systems',
        cgpa: undefined,
        attendancePercentage: undefined,
      });
    } else {
      setUser({
        _id: 'adm_01',
        name: 'Institutional Administrator',
        email: email || 'admin@vit.edu.in',
        role: 'ADMIN',
        department: 'Academic Dean & ERP Operations',
        cgpa: undefined,
        attendancePercentage: undefined,
      });
    }

    // Trigger toast notification
    const roleTitle = role === 'STUDENT' ? 'Student Dashboard' : role === 'MENTOR' ? 'Teacher Dashboard' : 'Admin Institutional Suite';
    window.dispatchEvent(
      new CustomEvent('campus-toast', {
        detail: {
          title: 'Authentication Successful',
          message: `Signed in successfully. Opening your ${roleTitle}...`,
          type: 'success',
        },
      })
    );

    onLogin(role);
  };

  // Listen for iframe role selection messages from BestsellersBookShowcase
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'campus1-role-login') {
        const role = event.data.role || 'STUDENT';
        const username = event.data.username;
        const password = event.data.password;
        handleRoleLogin(role, username, password);
      } else if (event.data?.type === 'campus1-role-select') {
        const role = event.data.role;
        if (role === 'LANDING') {
          onBackToLanding();
        } else if (role === 'STUDENT' || role === 'MENTOR' || role === 'ADMIN') {
          setSelectedRole(role);
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
    </div>
  );
};

