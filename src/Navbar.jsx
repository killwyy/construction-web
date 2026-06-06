import { useState, useEffect } from 'react';
import { Search, User, ChevronDown, LogOut, ClipboardList, X, ArrowRight } from 'lucide-react';
import { supabase } from './supabase';

export default function Navbar({ view, setView, user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    setView('home');
  };

  // 📍 1. เพิ่ม Keywords ให้ครอบคลุมคำค้นหายอดฮิต
  const searchData = [
    { id: 1, title: 'บริการซ่อมแซมและบำรุงรักษา', keyword: ['ซ่อม', 'พัง', 'ร้าว', 'รั่ว', 'หลังคา', 'ประปา', 'ซ่อมหลังคา'], view: 'service-repair', type: 'บริการ' },
    { id: 2, title: 'บริการติดตั้งและต่อเติม', keyword: ['ต่อเติม', 'ติดตั้ง', 'ครัว', 'โรงรถ', 'ทำบ้าน', 'ต่อเติมครัว'], view: 'service-install', type: 'บริการ' },
    { id: 3, title: 'บริการจ้างประเมินบ้าน', keyword: ['ประเมิน', 'ตรวจบ้าน', 'รับบ้าน', 'วิศวกร', 'จ้างวิศวกร'], view: 'service-eval', type: 'บริการ' },
    { id: 4, title: 'แบบบ้านมาตรฐาน', keyword: ['แบบบ้าน', 'บ้าน', 'สร้างบ้าน', 'โมเดิร์น', 'แปลน', 'แบบบ้านโมเดิร์น', 'คอนเทมโพรารี'], view: 'service-models', type: 'แบบบ้าน' },
    { id: 5, title: 'ขั้นตอนการสร้างบ้าน', keyword: ['ขั้นตอน', 'สร้างบ้าน', 'วิธี', 'ระบบ'], view: 'process', type: 'ข้อมูล' },
    { id: 6, title: 'ติดต่อเรา', keyword: ['ติดต่อ', 'โทร', 'แผนที่', 'เบอร์', 'line', 'เฟส', 'ติดต่อเรา'], view: 'contact', type: 'ข้อมูล' },
    { id: 7, title: 'เกี่ยวกับเรา', keyword: ['เกี่ยวกับ', 'ประวัติ', 'บริษัท', 'ผลงาน'], view: 'about', type: 'ข้อมูล' },
  ];

  // 📍 2. อัปเดตตรรกะให้ค้นหาฉลาดขึ้น (สลับคำก็เจอ หาบางส่วนก็เจอ)
  const filteredResults = searchData.filter(item => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(query) ||
      item.keyword.some(kw => kw.toLowerCase().includes(query) || query.includes(kw.toLowerCase()))
    );
  });

  const handleSearchResultClick = (targetView) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setView(targetView);
  };

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  return (
    <>
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

          {user && (
            <button onClick={() => setView('profile')} className={`pb-1 border-b-2 flex items-center gap-1.5 ${view === 'profile' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent text-gray-600 hover:text-[#001D4A]'} transition-colors`}>
              <ClipboardList size={16} /> ประวัติการจอง/บัญชีของฉัน
            </button>
          )}
        </div>

        <div className="flex items-center space-x-7 text-[#001D4A]">
          <Search
            onClick={() => setIsSearchOpen(true)}
            className="w-[22px] h-[22px] cursor-pointer hover:scale-110 transition-transform"
          />

          {user ? (
            <div
              className="relative py-2"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <div className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 pl-2 pr-3 py-1.5 rounded-full transition-colors border border-gray-200">
                <div className="w-7 h-7 bg-[#001D4A] text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
                  {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-bold text-[#001D4A] max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <ChevronDown size={14} className="text-gray-500" />
              </div>

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
            <User
              onClick={() => setView('login')}
              className="w-[24px] h-[24px] cursor-pointer hover:scale-110 transition-transform"
            />
          )}
        </div>
      </nav>

      {/* หน้าต่าง Modal ค้นหา */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white/95 backdrop-blur-md animate-in fade-in duration-200">

          <div className="w-full max-w-4xl mx-auto pt-20 px-8 relative">
            <button
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 hover:bg-red-50 rounded-full"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 border-b-2 border-gray-200 focus-within:border-[#001D4A] pb-4 transition-colors">
              <Search size={32} className="text-[#001D4A]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาบริการ, แบบบ้าน หรือข้อมูลที่ต้องการ..."
                className="w-full text-2xl md:text-4xl text-[#001D4A] font-bold bg-transparent outline-none placeholder:text-gray-300 placeholder:font-light"
              />
            </div>
          </div>

          <div className="w-full max-w-4xl mx-auto px-8 mt-10 overflow-y-auto pb-20 flex-1">
            {searchQuery.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">ผลการค้นหา ({filteredResults.length})</p>

                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSearchResultClick(result.view)}
                      className="w-full text-left flex items-center justify-between p-5 rounded-2xl hover:bg-blue-50/80 transition-all group border border-transparent hover:border-blue-100"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-xl font-bold text-[#001D4A] group-hover:text-blue-700 transition-colors">{result.title}</span>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">{result.type}</span>
                      </div>
                      <ArrowRight className="text-gray-300 group-hover:text-blue-600 transform group-hover:translate-x-2 transition-all" />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <p className="text-xl font-bold text-gray-400">ไม่พบผลลัพธ์ที่ตรงกับ "{searchQuery}"</p>
                    <p className="text-gray-400 mt-2">ลองใช้คำค้นหาอื่น เช่น ซ่อม, ต่อเติม, แบบบ้าน</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">คำค้นหายอดฮิต</p>
                <div className="flex flex-wrap gap-3">
                  {/* 📍 3. อัปเดตให้กด Tag แล้วนำคำเต็มไปใส่ในช่องค้นหาเลย */}
                  {['ซ่อมหลังคา', 'ต่อเติมครัว', 'แบบบ้านโมเดิร์น', 'จ้างวิศวกร', 'ติดต่อเรา'].map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(tag)}
                      className="px-4 py-2 bg-gray-100 hover:bg-[#001D4A] text-gray-600 hover:text-white rounded-full text-sm font-bold transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </>
  );
}