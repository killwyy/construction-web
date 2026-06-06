import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Lock, Mail, User as UserIcon, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login({ setView }) {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  useEffect(() => {
    setSignInEmail('');
    setSignInPassword('');
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'admin') {
        setView('admin-dashboard');
      } else {
        setView('home');
      }
    } catch (error) {
      setModal({ type: 'error', title: 'เข้าสู่ระบบไม่สำเร็จ', message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: { full_name: signUpName }
        }
      });

      if (error) throw error;

      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        setModal({ type: 'error', title: 'อีเมลนี้ถูกใช้งานแล้ว', message: 'มีบัญชีที่ใช้อีเมลนี้อยู่แล้ว กรุณาใช้อีเมลอื่นหรือกดเข้าสู่ระบบ' });
        return;
      }

      setModal({ type: 'success', title: 'สมัครสมาชิกสำเร็จ! 🎉', message: 'ยินดีต้อนรับสู่ระบบ! กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน' });
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setIsRightPanelActive(false);
    } catch (error) {
      const isDuplicate =
        error.message?.toLowerCase().includes('already registered') ||
        error.message?.toLowerCase().includes('user already exists') ||
        error.code === '23505';
      if (isDuplicate) {
        setModal({ type: 'error', title: 'อีเมลนี้ถูกใช้งานแล้ว', message: 'มีบัญชีที่ใช้อีเมลนี้อยู่แล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ' });
      } else {
        setModal({ type: 'error', title: 'สมัครสมาชิกไม่สำเร็จ', message: error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 📍 จุดที่แก้ไข: ให้ปุ่มเชื่อมต่อกับหน้าต่างล็อคอิน Google
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // ให้เด้งกลับมาที่หน้าเว็บของเราอัตโนมัติ (localhost หรือโดเมนจริง)
        redirectTo: window.location.origin
      }
    });

    if (error) {
      setModal({ type: 'error', title: 'เกิดข้อผิดพลาดจาก Google', message: error.message });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

      <style>
        {`
          .auth-container {
              position: relative;
              overflow: hidden;
              width: 100%;
              max-width: 900px;
              min-height: 560px;
              background-color: #fff;
              border-radius: 32px;
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          }
          .form-container {
              position: absolute;
              top: 0;
              height: 100%;
              transition: all 0.6s ease-in-out;
          }
          .sign-in-container {
              left: 0;
              width: 50%;
              z-index: 2;
          }
          .auth-container.right-panel-active .sign-in-container {
              transform: translateX(100%);
          }
          .sign-up-container {
              left: 0;
              width: 50%;
              opacity: 0;
              z-index: 1;
          }
          .auth-container.right-panel-active .sign-up-container {
              transform: translateX(100%);
              opacity: 1;
              z-index: 5;
              animation: show 0.6s;
          }
          @keyframes show {
              0%, 49.99% { opacity: 0; z-index: 1; }
              50%, 100% { opacity: 1; z-index: 5; }
          }
          .overlay-container {
              position: absolute;
              top: 0;
              left: 50%;
              width: 50%;
              height: 100%;
              overflow: hidden;
              transition: transform 0.6s ease-in-out;
              z-index: 100;
              border-radius: 120px 0 0 120px;
          }
          .auth-container.right-panel-active .overlay-container {
              transform: translateX(-100%);
              border-radius: 0 120px 120px 0;
          }
          .overlay {
              background-color: #001D4A;
              color: #fff;
              position: relative;
              left: -100%;
              height: 100%;
              width: 200%;
              transform: translateX(0);
              transition: transform 0.6s ease-in-out;
          }
          .auth-container.right-panel-active .overlay {
              transform: translateX(50%);
          }
          .overlay-panel {
              position: absolute;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              padding: 0 40px;
              text-align: center;
              top: 0;
              height: 100%;
              width: 50%;
              transform: translateX(0);
              transition: transform 0.6s ease-in-out;
          }
          .overlay-left {
              transform: translateX(0);
          }
          .auth-container.right-panel-active .overlay-left {
              transform: translateX(0);
          }
          .overlay-right {
              right: 0;
              transform: translateX(0);
          }
          .auth-container.right-panel-active .overlay-right {
              transform: translateX(0);
          }
        `}
      </style>

      <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>

        {/* ฟอร์มสมัครสมาชิก */}
        <div className="form-container sign-up-container p-10 flex flex-col justify-center items-center bg-white relative">

          <button
            onClick={() => setView('home')}
            className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-[#001D4A] font-semibold transition-colors text-sm"
          >
            <ArrowLeft size={18} /> กลับหน้าหลัก
          </button>

          <h1 className="text-3xl font-bold text-[#001D4A] mb-6 mt-6">สร้างบัญชีใหม่</h1>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-full font-semibold text-sm hover:bg-gray-50 transition-all shadow-sm mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            สมัครด้วย Google
          </button>

          <div className="flex items-center w-full my-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">หรือใช้อีเมล</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSignUp} className="w-full flex flex-col items-center">
            <div className="w-full relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-gray-400" /></div>
              <input type="text" placeholder="ชื่อ-นามสกุล" autoComplete="off" value={signUpName} onChange={e => setSignUpName(e.target.value)} className="w-full bg-gray-100 border-none pl-12 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#001D4A] text-sm" required />
            </div>
            <div className="w-full relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
              <input type="email" placeholder="อีเมล" autoComplete="off" value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} className="w-full bg-gray-100 border-none pl-12 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#001D4A] text-sm" required />
            </div>
            <div className="w-full relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
              <input
                type={showSignUpPassword ? "text" : "password"}
                placeholder="รหัสผ่าน"
                autoComplete="new-password"
                value={signUpPassword}
                onChange={e => setSignUpPassword(e.target.value)}
                className="w-full bg-gray-100 border-none pl-12 pr-12 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#001D4A] text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#001D4A]"
              >
                {showSignUpPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <button type="submit" disabled={isLoading} className="bg-[#001D4A] text-white font-bold text-sm px-14 py-3.5 rounded-full uppercase tracking-wider hover:bg-blue-900 transition-all shadow-md w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> กำลังสมัคร...</> : 'สมัครสมาชิก'}
            </button>
          </form>
        </div>


        {/* ฟอร์มเข้าสู่ระบบ */}
        <div className="form-container sign-in-container p-10 flex flex-col justify-center items-center bg-white relative">

          <button
            onClick={() => setView('home')}
            className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-[#001D4A] font-semibold transition-colors text-sm"
          >
            <ArrowLeft size={18} /> กลับหน้าหลัก
          </button>

          <h1 className="text-3xl font-bold text-[#001D4A] mb-6 mt-6">เข้าสู่ระบบ</h1>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-full font-semibold text-sm hover:bg-gray-50 transition-all shadow-sm mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            เข้าสู่ระบบด้วย Google
          </button>

          <div className="flex items-center w-full my-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">หรือใช้อีเมล</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSignIn} className="w-full flex flex-col items-center">
            <div className="w-full relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
              <input type="email" placeholder="อีเมลของคุณ" autoComplete="off" value={signInEmail} onChange={e => setSignInEmail(e.target.value)} className="w-full bg-gray-100 border-none pl-12 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#001D4A] text-sm" required />
            </div>
            <div className="w-full relative mb-2">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
              <input
                type={showSignInPassword ? "text" : "password"}
                placeholder="รหัสผ่าน"
                autoComplete="current-password"
                value={signInPassword}
                onChange={e => setSignInPassword(e.target.value)}
                className="w-full bg-gray-100 border-none pl-12 pr-12 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-[#001D4A] text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowSignInPassword(!showSignInPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#001D4A]"
              >
                {showSignInPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="w-full flex justify-center mb-6 mt-2">
              <a href="#" className="text-sm font-medium text-gray-500 hover:text-[#001D4A] underline transition-colors">ลืมรหัสผ่าน?</a>
            </div>
            <button type="submit" disabled={isLoading} className="bg-[#001D4A] text-white font-bold text-sm px-14 py-3.5 rounded-full uppercase tracking-wider hover:bg-blue-900 transition-all shadow-md w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> กำลังเข้าสู่ระบบ...</> : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>


        {/* Overlay สีน้ำเงิน */}
        <div className="overlay-container pointer-events-none">
          <div className="overlay pointer-events-auto">

            <div className="overlay-panel overlay-left">
              <h2 className="text-3xl font-bold mb-4">ยินดีต้อนรับกลับมา!</h2>
              <p className="text-sm font-light leading-relaxed mb-8 px-6 opacity-90">
                หากคุณมีบัญชีอยู่แล้ว<br />เข้าสู่ระบบเพื่อใช้งานฟีเจอร์ทั้งหมดได้เลย
              </p>
              <button
                onClick={() => setIsRightPanelActive(false)}
                className="bg-transparent border-2 border-white text-white font-bold text-sm px-14 py-3 rounded-full uppercase tracking-wider hover:bg-white hover:text-[#001D4A] transition-all"
              >
                เข้าสู่ระบบ
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h2 className="text-3xl font-bold mb-4">สวัสดีครับ,ยินดีต้อนรับ!</h2>
              <p className="text-sm font-light leading-relaxed mb-8 px-6 opacity-90">
                ยังไม่มีบัญชีใช่ไหม?<br />สมัครสมาชิกเพื่อเริ่มต้นใช้งานเว็บไซต์ก่อสร้างของเรา
              </p>
              <button
                onClick={() => setIsRightPanelActive(true)}
                className="bg-transparent border-2 border-white text-white font-bold text-sm px-14 py-3 rounded-full uppercase tracking-wider hover:bg-white hover:text-[#001D4A] transition-all shadow-md"
              >
                สมัครสมาชิก
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Custom Modal */}
      {modal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center animate-[fadeInScale_0.2s_ease-out]">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${modal.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              {modal.type === 'success' ? (
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 4a8 8 0 100 16A8 8 0 0012 4z" /></svg>
              )}
            </div>
            <h3 className="text-xl font-bold text-[#001D4A] mb-2">{modal.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{modal.message}</p>
            <button
              onClick={() => setModal(null)}
              className={`w-full py-3 rounded-full font-bold text-sm text-white transition-all shadow-md ${modal.type === 'success' ? 'bg-[#001D4A] hover:bg-blue-900' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {modal.type === 'success' ? 'เข้าสู่ระบบเลย' : 'ตกลง'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}