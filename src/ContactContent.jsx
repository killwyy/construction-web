import { Mail, Phone, MapPin, Facebook, MessageCircle, Clock } from 'lucide-react';

export default function ContactContent() {
  return (
    <div className="bg-white min-h-screen font-sans text-[#001D4A]">
      {/* Hero Section: ความสูงกระชับ 280px เพื่อประหยัดพื้นที่ */}
      <div className="relative h-[280px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070" 
          alt="Modern House" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-[900] tracking-tight mb-1">ติดต่อเรา</h1>
          <p className="text-sm tracking-[0.3em] font-light uppercase opacity-80">Sittithongkamdee Construction</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* ฝั่งซ้าย: ข้อมูลติดต่อสีน้ำเงินหลักของเว็บ */}
          <div className="w-full lg:w-1/2 space-y-8">
            <section>
              <h2 className="text-3xl font-[900] text-[#001D4A] mb-4 border-l-6 border-blue-600 pl-5">ที่อยู่</h2>
              <p className="text-gray-600 text-base leading-relaxed pl-7">
                167/12 ถนนสุขสวัสดิ์ ซอยสุขปราการ ตำบลในคลองบางปลากด <br/>
                อำเภอพระสมุทรเจดีย์ จังหวัดสุขปราการ 10290
              </p>
            </section>

            <section className="pl-7 bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-blue-600" /> วันทำการ
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 uppercase text-[10px] font-bold tracking-wider">จันทร์ - ศุกร์</p>
                  <p className="font-bold">07.00 - 18.00 น.</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase text-[10px] font-bold tracking-wider">วันเสาร์ - อาทิตย์</p>
                  <p className="font-bold">9.00 - 17.00 น.</p>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-7">
              <div className="flex items-center gap-3">
                <div className="bg-[#001D4A] p-2 rounded-full text-white shrink-0">
                  <Phone size={18} />
                </div>
                <div className="text-sm">
                  <p className="text-gray-400 text-[10px] font-bold">เบอร์โทร</p>
                  <p className="font-bold text-xs">094-507-6062</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#001D4A] p-2 rounded-full text-white shrink-0 font-bold text-[8px]">LINE</div>
                <div className="text-sm">
                  <p className="text-gray-400 text-[10px] font-bold">Line ID</p>
                  <p className="font-bold text-xs">@constructionsithi</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#001D4A] p-2 rounded-full text-white shrink-0">
                  <Mail size={18} />
                </div>
                <div className="text-sm">
                  <p className="text-gray-400 text-[10px] font-bold">Email</p>
                  <p className="font-bold text-xs">Sithithongkhamdee@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-4">
                  {/* เพิ่มลิงก์ Facebook เข้าไปที่นี่ครับ */}
                  <a 
                    href="https://www.facebook.com/profile.php?id=100054506527972" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform"
                  >
                    <Facebook size={20} className="text-[#001D4A] cursor-pointer hover:text-blue-600 transition-colors" />
                  </a>
                  <MessageCircle size={20} className="text-green-500 cursor-pointer hover:text-green-400 transition-colors" />
                </div>
                <p className="text-gray-400 text-[10px] font-bold uppercase">Social Media</p>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: แผนที่อัปเดตลิงก์ใหม่เป็นสี่เหลี่ยมจตุรัส */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-[450px] bg-white rounded-2xl overflow-hidden shadow-xl border-4 border-gray-50">
              <iframe 
                title="Sittithongkamdee Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3878.1115134566007!2d100.53883607628387!3d13.589998566971325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2a6b17576de41%3A0x2e65da73d25997d7!2zMTAtNDIzIOC4i-C4reC4oiDguKrguLjguILguJvguKPguLLguIHguLLguKMg4LiV4Liz4Lia4LilIOC5g-C4meC4hOC4peC4reC4h-C4muC4suC4h-C4m-C4peC4suC4geC4lCDguK3guLPguYDguKDguK3guJ7guKPguLDguKrguKHguLjguJfguKPguYDguIjguJTguLXguKLguYwg4Liq4Lih4Li44LiX4Lij4Lib4Lij4Liy4LiB4Liy4LijIDEwMjkw!5e0!3m2!1sth!2sth!4v1773208788925!5m2!1sth!2sth" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </div>

      <footer className="bg-[#001D4A] py-6 text-center text-white/30 text-[10px] tracking-[0.2em]">
        © 2026 SITTITHONGKAMDEE CONSTRUCTION. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}