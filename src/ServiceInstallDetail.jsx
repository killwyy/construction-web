import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, FileText, Wrench, Info } from 'lucide-react';
import { supabase } from './supabase'; 

export default function ServiceInstallDetail({ serviceId, setView }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }
    
    async function fetchServiceDetail() {
      try {
        const { data, error } = await supabase
          .from('install_services')
          .select('*')
          .eq('id', serviceId)
          .single();

        if (error) throw error;
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchServiceDetail();
  }, [serviceId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-[#001D4A]">กำลังโหลดข้อมูล...</div>;
  if (!service) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">ไม่พบข้อมูลบริการ</div>;

  const formatPrice = (val) => Number(val || 0).toLocaleString();
  
  // 📍 คำนวณเงินมัดจำ 30% จากราคาเริ่มต้น
  const depositPrice = (service.price || 0) * 0.3;

  // 📍 ปรับคำใหม่ ไม่เอาคำว่าสำรวจพื้นที่แล้ว
  const scopeOfWork = service.scope_of_work || [
    "เข้าเตรียมพื้นที่และประเมินหน้างานจริงโดยช่างผู้เชี่ยวชาญก่อนเริ่มงาน",
    "ให้คำปรึกษา แนะนำวัสดุ และสรุปรายละเอียดการติดตั้ง",
    "ดำเนินการติดตั้ง/ต่อเติมตามมาตรฐานวิศวกรรม",
    "รับประกันผลงานการติดตั้งและการรั่วซึม (ตามเงื่อนไขของบริษัท)",
    "ทำความสะอาดและตรวจสอบความเรียบร้อยก่อนส่งมอบงาน"
  ];

  return (
    <div className="bg-white pb-28 relative font-sans">
      
      {/* รูป Header ด้านบน */}
      <div className="relative w-full h-[500px] bg-gray-900 overflow-hidden">
        <img src={service.image_url} alt={service.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="text-white">
            <span className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-bold tracking-wider mb-4">
              {service.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight max-w-3xl">{service.title}</h1>
            <p className="text-gray-300 flex items-center gap-2 mt-4 font-medium">
              <Wrench size={20} className="text-yellow-400" /> ดำเนินการโดย: {service.provider || 'SITTITHONGKAMDEE'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-10">
        
        <button 
          onClick={() => { window.scrollTo(0, 0); setView('service-install'); }}
          className="flex items-center gap-2 text-gray-400 hover:text-[#001D4A] font-bold transition-colors mb-10"
        >
          <ArrowLeft size={20} /> ย้อนกลับไปหน้าบริการติดตั้ง
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ฝั่งซ้าย: ข้อมูลรายละเอียดบริการ */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* ค่าบริการขั้นต่ำ */}
            <div className="flex items-start gap-4">
              <div className="text-[#E60000] mt-1">
                <Info size={36} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#001D4A] mb-3">ค่าบริการขั้นต่ำ</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {service.min_service_desc ? (
                    service.min_service_desc
                  ) : (
                    <>ราคาเริ่มต้น {formatPrice(service.price)} บาท <span className="text-gray-400">(รอใส่ข้อมูลพื้นที่ขั้นต่ำ / รายละเอียดสินค้าพร้อมติดตั้ง)</span></>
                  )}
                </p>
              </div>
            </div>

            {/* การรับประกัน */}
            <div className="flex items-start gap-4">
              <div className="text-[#E60000] mt-1">
                <ShieldCheck size={36} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#001D4A] mb-3">การรับประกัน</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                   {service.warranty_desc ? (
                    service.warranty_desc
                  ) : (
                    <>รับประกันการติดตั้งระยะเวลานาน 1 ปี โดยทีมงานคิวช่าง <span className="text-gray-400">(รอปรับแก้ข้อมูลระยะเวลาประกัน)</span></>
                  )}
                </p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* ข้อมูลเบื้องต้น */}
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-[#001D4A] mb-6 pl-4 border-l-[5px] border-blue-600">ข้อมูลเบื้องต้น</h2>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
                <ul className="space-y-4">
                  {scopeOfWork.map((item, index) => (
                    <li key={index} className="flex items-start gap-4 text-gray-700">
                      <div className="mt-1 bg-green-100 text-green-600 rounded-full p-1"><CheckCircle2 size={18} /></div>
                      <span className="text-lg leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* 📍 ฝั่งขวา: Card สรุปการจอง (แก้คำและเปลี่ยนเป็นมัดจำ 30%) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100">
              
              <h3 className="text-[#001D4A] font-bold text-2xl mb-8">จองบริการ</h3>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-600 font-medium text-lg">เงินมัดจำ (30%)</span>
                <span className="text-4xl font-[900] tracking-tight text-[#E60000]">
                  {formatPrice(depositPrice)} บาท
                </span>
              </div>

              <div className="bg-blue-50/70 p-5 rounded-2xl text-sm font-medium mb-8 leading-relaxed border border-blue-100 flex gap-3 text-blue-800">
                <FileText className="min-w-[20px] text-blue-600 mt-0.5" size={20} />
                * ชำระเงินมัดจำ 30% ของราคาเริ่มต้น เพื่อเป็นการยืนยันคิวช่างเข้าดำเนินการติดตั้ง/ต่อเติม
              </div>

              <button 
                // 📍 สั่งให้เปลี่ยนไปหน้ากรอกข้อมูล/ชำระเงิน
                onClick={() => {
                  window.scrollTo(0, 0); 
                  setView('install-booking'); 
                }}
                className="w-full py-4 font-bold rounded-full transition-all text-xl flex justify-center items-center gap-2 bg-black text-white hover:bg-gray-800 shadow-md hover:-translate-y-1"
              >
                จองเลย
              </button>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}