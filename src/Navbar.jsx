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

        {/* Dropdown การบริการ */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className={`flex items-center gap-1 pb-1 border-b-2 ${view.includes('service') ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent'}`}>
            การบริการ <ChevronDown size={16} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-lg py-2 mt-1 z-50 border border-gray-100">
              <button onClick={() => setView('service-models')} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold border-b border-gray-50">แบบบ้านมาตรฐาน</button>
              <button onClick={() => setView('service-repair')} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold border-b border-gray-50">ระบบซ่อมบ้าน</button>
              <button onClick={() => setView('service-eval')} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold">จ้างประเมินบ้าน</button>
            </div>
          )}
        </div>

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