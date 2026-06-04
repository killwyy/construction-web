import React from 'react';
import { Search, Map, PenTool, FileText, FileSignature, Hammer, Key, ShieldCheck } from 'lucide-react';

export default function BuildProcess() {
  const steps = [
    { id: 1, icon: <Search size={32} />, title: 'เลือกแบบบ้านที่ใช่', desc: 'เลือกแบบบ้านที่ตรงกับไลฟ์สไตล์และความต้องการของคุณ พร้อมรับคำปรึกษาฟรี' },
    { id: 2, icon: <Map size={32} />, title: 'ชำระเงินจองและสำรวจพื้นที่', desc: 'ชำระเงินจองสร้างบ้าน พร้อมทีมงานผู้เชี่ยวชาญลงพื้นที่สำรวจและวางผังบริเวณ' },
    { id: 3, icon: <PenTool size={32} />, title: 'ออกแบบและเขียนแบบ', desc: 'ทีมสถาปนิกและวิศวกรจัดทำแบบก่อสร้างฉบับสมบูรณ์ เพื่อใช้ในการอ้างอิง' },
    { id: 4, icon: <FileText size={32} />, title: 'ขออนุญาตก่อสร้าง', desc: 'ทีมงานช่วยจัดเตรียมเอกสาร และยื่นเรื่องขออนุญาตปลูกสร้างกับหน่วยงานราชการ' },
    { id: 5, icon: <FileSignature size={32} />, title: 'เซ็นสัญญาก่อสร้าง', desc: 'ทำสัญญาก่อสร้างอย่างเป็นทางการ ตกลงรายละเอียดและราคาที่ชัดเจน' },
    { id: 6, icon: <Hammer size={32} />, title: 'เริ่มก่อสร้างและแบ่งชำระ', desc: 'ดำเนินงานก่อสร้างอย่างมีมาตรฐาน และลูกค้าชำระเงินตามงวดงานที่ตกลงไว้' },
    { id: 7, icon: <Key size={32} />, title: 'ตรวจสอบและส่งมอบบ้าน', desc: 'ลูกค้าตรวจสอบความเรียบร้อยของผลงานทั้งหมด ก่อนส่งมอบกุญแจบ้าน' },
    { id: 8, icon: <ShieldCheck size={32} />, title: 'รับประกันและบริการ', desc: 'อุ่นใจด้วยการรับประกันโครงสร้าง และมีบริการดูแลให้ความช่วยเหลือหลังการสร้าง' },
  ];

  return (
    <div className="bg-white pb-20">
      
      {/* 1. Hero Section */}
      <div className="relative h-[400px] overflow-hidden flex items-center justify-center">
        {/* 📍 เปลี่ยนลิงก์รูปภาพใหม่แล้วครับ */}
        <img 
          src="/images/bhome.jpg" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
          alt="Architectural Blueprint and Construction"
        />
        <div className="relative z-10 text-center text-white px-4 space-y-4">
          <h1 className="text-6xl font-bold tracking-wide">ขั้นตอนการสร้างบ้าน</h1>
          <p className="text-gray-300 text-lg font-light tracking-widest pt-1">
            ทำให้การสร้างบ้านเป็นเรื่องง่าย คุณแค่ฝัน ที่เหลือเป็นหน้าที่ของเรา
          </p>
        </div>
        
        {/* เส้นโค้งสีขาวด้านล่าง เพื่อความเนียนต่อกับเนื้อหา */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[40px]"></div>
      </div>

      {/* 2. Process Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-[#001D4A]">8 ขั้นตอนสู่บ้านในฝันของคุณ</h2>
          <p className="text-gray-400 text-lg font-light mt-4 leading-relaxed">
            เราดูแลคุณอย่างใกล้ชิดในทุกขั้นตอน ตั้งแต่เริ่มต้นพูดคุยจนถึงส่งมอบกุญแจบ้าน เพื่อให้คุณมั่นใจ คลายกังวล และได้บ้านที่สมบูรณ์แบบที่สุดตามมาตรฐานของเรา
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 relative mt-10">
            
            {/* เส้นประเชื่อมต่อระหว่าง Step (ซ่อนในมือถือ) */}
            <div className="hidden lg:block absolute top-[28px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-gray-200 -z-0"></div>
            <div className="hidden lg:block absolute top-[365px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-gray-200 -z-0"></div>

            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
                
                {/* ตัวเลข Step สีน้ำเงินเข้ม */}
                <div className="w-14 h-14 bg-[#001D4A] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md mb-8 border-4 border-white group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                  {step.id}
                </div>
                
                {/* กล่องไอคอน */}
                <div className="bg-blue-50 w-24 h-24 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:-translate-y-2 group-hover:shadow-md transition-all duration-300">
                  {step.icon}
                </div>

                {/* เนื้อหา */}
                <h3 className="text-xl font-bold text-[#001D4A] mb-3">{step.title}</h3>
                <p className="text-gray-500 text-base font-light leading-relaxed px-2">
                  {step.desc}
                </p>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
}