import { Mail, Phone, MapPin, Facebook, MessageCircle, Clock } from 'lucide-react';

export default function ContactContent() {
  return (
    <div className="bg-white text-[#001D4A]">
      {/* Hero Section */}
      <div className="relative h-[280px] flex items-center justify-center overflow-hidden">
        <img 
          src="/images/contact.jpg" 
          alt="Modern House" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
        />
        <div className="relative z-10 text-center text-white">
          {/* ปรับความหนาจาก font-[900] เป็น font-bold เพื่อให้ดูคลีนขึ้น แต่ขนาดใหญ่ 6xl เท่าเดิม */}
          <h1 className="text-6xl font-bold tracking-tight mb-2">ติดต่อเรา</h1>
          <p className="text-lg tracking-[0.3em] font-light uppercase opacity-80">Sittithongkamdee Construction</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* ฝั่งซ้าย: ข้อมูลติดต่อหลัก */}
          <div className="w-full lg:w-1/2 space-y-10">
            <section>
              {/* ปรับเป็น font-bold ให้ดูสบายตา */}
              <h2 className="text-3xl font-bold text-[#001D4A] mb-4 border-l-[5px] border-blue-600 pl-5">ที่อยู่</h2>
              <p className="text-gray-600 text-lg font-light leading-relaxed pl-7">
                167/12 ถนนสุขสวัสดิ์ ซอยสุขปราการ ตำบลในคลองบางปลากด <br/>
                อำเภอพระสมุทรเจดีย์ จังหวัดสมุทรปราการ 10290
              </p>
            </section>

            {/* ส่วนวันทำการ */}
            <section className="ml-7 bg-gray-50 p-6 rounded-xl border border-gray-100">
              {/* ปรับความหนาเป็น font-bold */}
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock size={26} className="text-blue-600" /> วันทำการ
              </h3>
              <div className="grid grid-cols-2 gap-6 text-base">
                <div>
                  <p className="text-gray-400 uppercase text-[12px] font-semibold tracking-wider mb-1">จันทร์ - ศุกร์</p>
                  {/* ลดความหนาจาก font-[900] เป็น font-semibold แต่คงขนาด text-xl ไว้ */}
                  <p className="font-semibold text-xl text-[#001D4A]">07.00 - 18.00 น.</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase text-[12px] font-semibold tracking-wider mb-1">วันเสาร์ - อาทิตย์</p>
                  <p className="font-semibold text-xl text-[#001D4A]">9.00 - 17.00 น.</p>
                </div>
              </div>
            </section>

            {/* ช่องทางการติดต่อ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 pl-7">
              <div className="flex items-center gap-4">
                <div className="bg-[#001D4A] p-3 rounded-full text-white shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">เบอร์โทร</p>
                  {/* เปลี่ยนเป็น font-semibold ให้ดูพรีเมียมขึ้น */}
                  <p className="font-semibold text-lg text-[#001D4A]">094-507-6062</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#001D4A] px-4 py-2 rounded-full text-white shrink-0 font-bold text-[11px] tracking-wide">LINE</div>
                <div>
                  <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">Line ID</p>
                  <p className="font-semibold text-lg text-[#001D4A]">@constructionsithi</p>
                </div>
              </div>

              <div className="flex items-center gap-4 col-span-1 md:col-span-2">
                <div className="bg-[#001D4A] p-3 rounded-full text-white shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">Email</p>
                  <p className="font-semibold text-lg text-[#001D4A]">Sithithongkhamdee@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 col-span-1 md:col-span-2">
                <div className="flex gap-4 items-center">
                  <a 
                    href="https://www.facebook.com/profile.php?id=100054506527972" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform"
                  >
                    <Facebook size={24} className="text-[#001D4A] cursor-pointer hover:text-blue-600 transition-colors" />
                  </a>
                  <a 
                    href="https://line.me/ti/p/~constructionsithi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform"
                  >
                    <MessageCircle size={24} className="text-green-500 cursor-pointer hover:text-green-400 transition-colors" />
                  </a>
                </div>
                <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">Social Media</p>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: แผนที่ Google Maps */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-[450px] bg-white rounded-2xl overflow-hidden shadow-xl border-4 border-gray-50">
              <iframe 
                title="Sittithongkamdee Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d969.5278995035744!2d100.54306192850062!3d13.589993399170622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2a6b17576de41%3A0x2e65da73d25997d7!2zMTAtNDIzIOC4i-C4reC4oiDguKrguLjguILguJvguKPguLLguIHguLLguKMg4LiV4Liz4Lia4LilIOC5g-C4meC4hOC4peC4reC4h-C4muC4suC4h-C4m-C4peC4suC4geC4lCDguK3guLPguYDguKDguK3guJ7guKPguLDguKrguKHguLjguJfguKPguYDguIjguJTguLXguKLguYwg4Liq4Lih4Li44LiX4Lij4Lib4Lij4Liy4LiB4Liy4LijIDEwMjkwIOC4m-C4o-C4sOC5gOC4l-C4qOC5hOC4l-C4og!5e0!3m2!1sth!2sus!4v1779890679452!5m2!1sth!2sus"
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
    </div>
  );
}