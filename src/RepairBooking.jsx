import React, { useState } from 'react';
import { supabase } from './supabase'; 
import { UploadCloud, CheckCircle2, Loader2, FileText, ChevronRight } from 'lucide-react';

const PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", 
  "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา", 
  "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", 
  "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต", 
  "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี", "ลำปาง", 
  "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", 
  "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", 
  "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
];

const InputField = ({ label, name, type = "text", value, onChange, placeholder, maxLength, error }) => (
  <div className="mb-6">
    <label className={`text-sm font-medium block mb-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} className={`w-full border-b py-2 outline-none transition-colors bg-transparent text-gray-900 ${error ? 'border-red-500' : 'border-gray-300 focus:border-[#001D4A]'}`}/>
  </div>
);

export default function RepairBooking({ bookingData, setView }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactData, setContactData] = useState({ name: '', phone: '', province: '', address: '', repairDate: '' });
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreviewUrl, setSlipPreviewUrl] = useState(null);
  
  const mockTotalRepairPrice = 15000;
  const depositPrice = mockTotalRepairPrice * 0.3;

  // ป้องกัน Error หากเปิดหน้านี้โดยตรงโดยไม่มีข้อมูล
  if (!bookingData || !bookingData.id) {
    return <div className="p-20 text-center text-[#001D4A] font-bold mt-20">ไม่พบข้อมูลใบประเมินราคา กรุณากลับไปทำรายการแจ้งซ่อมใหม่</div>;
  }

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: name === 'phone' ? value.replace(/\D/g, '') : value }));
  };

  const submitBooking = async () => {
    if (!slipFile) return alert('กรุณาแนบสลิปการโอนเงิน');
    setIsSubmitting(true);
    
    try {
      // 1. อัปโหลดสลิปเงิน
      const slipExt = slipFile.name.split('.').pop();
      const slipName = `repairs/slip_${Date.now()}_${Math.random().toString(36).substring(2)}.${slipExt}`;
      const { error: slipError } = await supabase.storage.from('payment_slips').upload(slipName, slipFile);
      if (slipError) throw slipError;

      const { data: { publicUrl: slipUrl } } = supabase.storage.from('payment_slips').getPublicUrl(slipName);

      // 📍 2. บันทึกลงตารางที่ 2 (repair_bookings) โดยเชื่อม request_id จากตารางแรก
      const { error: dbError } = await supabase.from('repair_bookings').insert([{
        request_id: bookingData.id,
        customer_name: contactData.name,
        customer_phone: contactData.phone,
        repair_date: contactData.repairDate,
        province: contactData.province,
        address: contactData.address,
        slip_image_url: slipUrl,
        status: 'pending_payment' 
      }]);

      if (dbError) throw dbError;

      // 📍 3. อัปเดตสถานะในตารางที่ 1 ว่ามีการกด "จองแล้ว" แอดมินจะได้ไม่งง
      await supabase.from('repair_requests').update({ status: 'booked' }).eq('id', bookingData.id);

      setCurrentStep(4);
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-32 pt-10">
      
      {currentStep === 1 && (
        <div className="max-w-3xl mx-auto px-6 animate-in zoom-in">
          <div className="bg-white p-10 rounded-[32px] shadow-xl border border-gray-100">
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-200">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <CheckCircle2 size={16} /> ประเมินราคาเรียบร้อยแล้ว
                </div>
                <h2 className="text-3xl font-bold text-[#001D4A]">ใบเสนอราคา (ประเมินเบื้องต้น)</h2>
                <p className="text-gray-500 font-light mt-1">อ้างอิงรหัสแจ้งซ่อม: REQ-{bookingData.id.split('-')[0].toUpperCase()}</p>
              </div>
              <FileText size={48} className="text-gray-300 hidden sm:block" />
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <span className="text-gray-600 font-medium">ค่าแรงและค่าวัสดุอุปกรณ์ประเมินเบื้องต้น</span>
                <span className="font-bold text-gray-900">฿{mockTotalRepairPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 flex justify-between items-center border border-red-100">
              <span className="font-bold">เงินมัดจำสำหรับจองคิวช่าง (30%)</span>
              <span className="text-xl font-bold">฿{depositPrice.toLocaleString()}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setView('home')} className="px-10 py-4 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-50 transition-colors w-full sm:w-auto">ยกเลิก</button>
              <button onClick={() => setCurrentStep(2)} className="px-10 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 shadow-xl transition-all w-full sm:w-auto">ยอมรับราคาและจองคิว</button>
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="max-w-3xl mx-auto px-6 animate-in slide-in-from-right-4">
          <div className="bg-white p-10 rounded-[32px] shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-[#001D4A] mb-8 pb-4 border-b">ข้อมูลผู้ติดต่อและสถานที่หน้างาน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InputField label="ชื่อ-นามสกุล*" name="name" value={contactData.name} onChange={handleContactChange} />
              <InputField label="เบอร์โทรศัพท์*" name="phone" maxLength="10" value={contactData.phone} onChange={handleContactChange} />
              <InputField label="วันที่เข้าซ่อม*" type="date" name="repairDate" value={contactData.repairDate} onChange={handleContactChange} />
              <div className="mb-6">
                <label className="text-sm font-medium block mb-1 text-gray-500">จังหวัด*</label>
                <select name="province" value={contactData.province} onChange={handleContactChange} className="w-full border-b py-2 outline-none cursor-pointer">
                  <option value="" disabled>เลือกจังหวัด</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <InputField label="ที่อยู่ละเอียด (บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ)*" name="address" value={contactData.address} onChange={handleContactChange} />
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <button onClick={() => setCurrentStep(1)} className="px-10 py-4 bg-white border border-gray-200 font-bold rounded-full hover:bg-gray-50 text-[#001D4A]">ย้อนกลับ</button>
            <button onClick={() => setCurrentStep(3)} className="px-12 py-4 bg-[#001D4A] text-white font-bold rounded-full flex items-center gap-2 hover:bg-blue-900 shadow-xl hover:-translate-y-1 transition-all">ไปหน้าชำระเงิน <ChevronRight/></button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="max-w-4xl mx-auto px-6 animate-in slide-in-from-right-4">
          <div className="bg-[#001D4A] text-white p-6 md:p-8 rounded-[32px] shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
                <p className="text-blue-200 font-semibold mb-1">ยอดชำระมัดจำจองคิวซ่อม (30%)</p>
                <h3 className="text-2xl font-bold">อ้างอิง: REQ-{bookingData.id.split('-')[0].toUpperCase()}</h3>
             </div>
             <div className="text-right">
                <span className="text-5xl font-bold text-yellow-400">฿{depositPrice.toLocaleString()}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold text-[#001D4A] mb-2">สแกน QR Code</h2>
              <p className="text-gray-500 mb-6 text-sm">รองรับทุกธนาคาร</p>
              <img src="/images/QR.jpg" className="w-full max-w-[280px] rounded-xl border p-2" alt="QR Code"/>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 border-b pb-4 text-[#001D4A]">แนบสลิปการโอนเงิน*</h2>
              <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 relative overflow-hidden">
                {slipPreviewUrl ? (
                  <img src={slipPreviewUrl} className="absolute inset-0 w-full h-full object-contain p-2" alt="Slip" />
                ) : (
                  <div className="text-center">
                    <UploadCloud className="w-12 h-12 mx-auto text-blue-500 mb-2"/>
                    <span className="font-bold text-[#001D4A]">คลิกเพื่ออัปโหลด</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => { setSlipFile(e.target.files[0]); setSlipPreviewUrl(URL.createObjectURL(e.target.files[0])); }} />
              </label>
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <button onClick={() => setCurrentStep(2)} className="px-10 py-4 bg-white border border-gray-200 font-bold rounded-full text-[#001D4A]">ย้อนกลับ</button>
            <button onClick={submitBooking} disabled={isSubmitting} className="px-12 py-4 bg-black text-white font-bold rounded-full flex items-center gap-2 hover:-translate-y-1 transition-transform shadow-xl">
              {isSubmitting ? <><Loader2 className="animate-spin inline" /> กำลังตรวจสอบ...</> : 'ยืนยันการชำระเงิน'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="max-w-2xl mx-auto px-6 animate-in zoom-in text-center">
          <div className="bg-white p-14 rounded-[32px] shadow-lg border border-gray-100">
            <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-[#001D4A] mb-4">จองคิวซ่อมสำเร็จ!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed text-lg">
              เราได้รับข้อมูลการโอนเงินและสถานที่หน้างานของคุณเรียบร้อยแล้ว<br/>
              ทีมงานจะติดต่อกลับไปยังเบอร์ <span className="font-bold text-[#001D4A]">{contactData.phone}</span> ภายใน 24 ชั่วโมง
            </p>
            <button onClick={() => setView('home')} className="px-14 py-4 bg-[#001D4A] text-white font-bold rounded-full hover:bg-blue-900 shadow-lg text-lg">กลับสู่หน้าหลัก</button>
          </div>
        </div>
      )}

    </div>
  );
}