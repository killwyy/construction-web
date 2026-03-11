import { Search, User } from 'lucide-react';

export default function Navbar({ view, setView }) {
  return (
    <nav className="flex items-center justify-between px-20 py-7 bg-white sticky top-0 z-50 shadow-sm">
      {/* ส่วนชื่อแบรนด์ */}
      <div 
        className="text-[26px] font-[900] text-[#001D4A] tracking-tighter cursor-pointer"
        onClick={() => setView('home')}
      >
        SITTITHONGKAMDEE
      </div>
      
      {/* ส่วนเมนู - ใช้ฟอนต์ขนาด 17px ตามที่คุณปรับล่าสุด */}
      <div className="flex space-x-12 font-[700] text-gray-700 text-[17px]">
        <button 
          onClick={() => setView('home')} 
          className={`hover:text-[#001D4A] transition-all border-b-2 pb-1 ${
            view === 'home' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent'
          }`}
        >
          หน้าแรก
        </button>
        <button 
          onClick={() => setView('service')} 
          className={`hover:text-[#001D4A] transition-all border-b-2 pb-1 ${
            view === 'service' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent'
          }`}
        >
          การบริการ
        </button>
        <button className="hover:text-[#001D4A] transition-all border-b-2 border-transparent pb-1">
          เกี่ยวกับเรา
        </button>
        <button 
        onClick={() => setView('contact')}
        className={`hover:text-[#001D4A] transition-all border-b-2 pb-1 ${
        view === 'contact' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent'
        }`}
        > ติดต่อเรา
        </button>
      </div>

      {/* ส่วนไอคอนด้านขวา */}
      <div className="flex items-center space-x-7 text-[#001D4A]">
        <Search className="w-[22px] h-[22px] cursor-pointer hover:scale-110 transition" />
        <User className="w-[24px] h-[24px] cursor-pointer hover:scale-110 transition" />
      </div>
    </nav>
  );
}