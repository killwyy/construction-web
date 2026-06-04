import { useState } from 'react';
import { Search, User, ChevronDown } from 'lucide-react';

export default function Navbar({ view, setView }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-20 py-7 bg-white sticky top-0 z-50 shadow-sm">
      <div className="text-[26px] font-[900] text-[#001D4A] cursor-pointer" onClick={() => setView('home')}>
        SITTITHONGKAMDEE
      </div>
      
      <div className="flex space-x-12 font-[700] text-gray-700 text-[17px] items-center">
        <button onClick={() => setView('home')} className={`pb-1 border-b-2 ${view === 'home' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent'}`}>
          หน้าแรก
        </button>

        {/* ปรับเพิ่มส่วน padding ตรง wrapper (py-2) เพื่อให้เมาส์เลื่อนจากปุ่มลงมาหากล่องได้สมูท เมนูไม่หุบหาย */}
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
              
              {/* 📍 เพิ่มเมนู ระบบติดตั้ง/ต่อเติมบ้าน ตรงนี้ครับ */}
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
      </div>

      <div className="flex items-center space-x-7 text-[#001D4A]">
        <Search className="w-[22px] h-[22px] cursor-pointer" />
        <User className="w-[24px] h-[24px] cursor-pointer" />
      </div>
    </nav>
  );
}