import { useState } from 'react';
import { Search, User, ChevronDown, LogOut, ClipboardList } from 'lucide-react'; // 📍 เพิ่ม ClipboardList icon
import { supabase } from './supabase'; // 📍 นำเข้าเพื่อใช้ฟังก์ชัน Logout

export default function Navbar({ view, setView, user }) { // 📍 รับ user prop
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // 📍 State สำหรับ Dropdown ของ User

  // 📍 ฟังก์ชันสำหรับออกจากระบบ
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    setView('home');
  };

  return (
    <nav className="flex items-center justify-between px-20 py-7 bg-white sticky top-0 z-50 shadow-sm">
      <div className="text-[26px] font-[900] text-[#001D4A] cursor-pointer" onClick={() => setView('home')}>
        SITTITHONGKAMDEE
      </div>

      <div className="flex space-x-12 font-[700] text-gray-700 text-[17px] items-center">
        <button onClick={() => setView('home')} className={`pb-1 border-b-2 ${view === 'home' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent'}`}>
          หน้าแรก
        </button>

        <div
          className="relative py-2"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className={`flex items-center gap-1 pb-1 border-b-2 ${view.includes('service') ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent'}`}>
            การบริการ <ChevronDown size={16} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-[90%] left-0 w-64 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-100">
              <button onClick={() => { setView('service-models'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold border-b border-gray-50">แบบบ้านมาตรฐาน</button>
              <button onClick={() => { setView('service-repair'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold border-b border-gray-50">ระบบซ่อมบ้าน</button>
              <button onClick={() => { setView('service-install'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold border-b border-gray-50">ระบบติดตั้ง/ต่อเติมบ้าน</button>
              <button onClick={() => { setView('service-eval'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold">จ้างประเมินบ้าน</button>
            </div>
          )}
        </div>
        <button onClick={() => setView('process')} className={`pb-1 border-b-2 transition-colors ${view === 'process' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent text-gray-600 hover:text-[#001D4A]'}`}>ขั้นตอนการสร้างบ้าน </button>
        <button onClick={() => setView('about')} className={`pb-1 border-b-2 ${view === 'about' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent'}`}>
          เกี่ยวกับเรา
        </button>
        <button onClick={() => setView('contact')} className={`pb-1 border-b-2 ${view === 'contact' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent'}`}>
          ติดต่อเรา
        </button>

        {/* 📍 แสดงเฉพาะเมื่อล็อกอินแล้ว */}
        {user && (
          <button onClick={() => setView('profile')} className={`pb-1 border-b-2 flex items-center gap-1.5 ${view === 'profile' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent text-gray-600 hover:text-[#001D4A]'} transition-colors`}>
            <ClipboardList size={16} /> ประวัติการจอง/บัญชีของฉัน          </button>
        )}
      </div>

      <div className="flex items-center space-x-7 text-[#001D4A]">
        <Search className="w-[22px] h-[22px] cursor-pointer" />

        {/* 📍 เช็คว่ามี User ล็อกอินอยู่หรือไม่ */}
        {user ? (
          <div
            className="relative py-2"
            onMouseEnter={() => setIsUserMenuOpen(true)}
            onMouseLeave={() => setIsUserMenuOpen(false)}
          >
            {/* ปุ่มแสดง Avatar */}
            <div className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 pl-2 pr-3 py-1.5 rounded-full transition-colors border border-gray-200">
              <div className="w-7 h-7 bg-[#001D4A] text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
                {/* ดึงอักษรตัวแรกของชื่อหรืออีเมลมาแสดงเป็น Avatar */}
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-bold text-[#001D4A] max-w-[120px] truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
              <ChevronDown size={14} className="text-gray-500" />
            </div>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute top-[90%] right-0 w-56 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-100">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">ล็อกอินด้วยบัญชี</p>
                  <p className="text-sm font-bold text-gray-700 truncate">{user.email}</p>
                </div>



                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-bold flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} /> ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 📍 ถ้าไม่มี User ให้แสดงไอคอนรูปคนเหมือนเดิมเพื่อไปหน้า Login */
          <User
            onClick={() => setView('login')}
            className="w-[24px] h-[24px] cursor-pointer hover:scale-110 transition-transform"
          />
        )}
      </div>
    </nav>
  );
}