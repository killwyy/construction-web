import React, { useState } from 'react';
import { supabase } from './supabase'; 
import { Check, UploadCloud, CheckCircle2, Loader2, ChevronRight } from 'lucide-react';

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

// Component สำหรับช่องกรอกข้อมูล
const InputField = ({ label, name, type = "text", value, onChange, placeholder, maxLength, error }) => (
  <div className="mb-6">
    <label className={`text-sm font-medium block mb-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>{label}</label>
    <input 
      type={type} 
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full border-b py-2 outline-none transition-colors bg-transparent text-gray-900
        ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#001D4A]'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
  </div>
);

export default function EvalBooking({ selectedOption, setView }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 📍 เพิ่ม province และ address เข้ามาใน state
  const [contactData, setContactData] = useState({
    name: '', phone: '', projectName: '', installDate: '', province: '', address: ''
  });

  const [slipFile, setSlipFile] = useState(null);
  const [slipPreviewUrl, setSlipPreviewUrl] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const nextStep = () => { setFormErrors({}); window.scrollTo(0, 0); setCurrentStep(prev => prev + 1); };
  const prevStep = () => { setFormErrors({}); window.scrollTo(0, 0); setCurrentStep(prev => prev - 1); };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    let inputValue = name === 'phone' ? value.replace(/\D/g, '') : value;
    setContactData(prev => ({ ...prev, [name]: inputValue }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSlipUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSlipFile(file);
      setSlipPreviewUrl(URL.createObjectURL(file));
      if (formErrors.slip) setFormErrors(prev => ({ ...prev, slip: null }));
    }
  };

  const validateStep1AndNext = () => {
    const errors = {};
    if (!contactData.name.trim()) errors.name = 'กรุณากรอกชื่อ-นามสกุล';
    if (contactData.phone.length !== 10) errors.phone = 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก';
    if (!contactData.projectName.trim()) errors.projectName = 'กรุณากรอกชื่อโครงการหรือคอนโด';
    if (!contactData.installDate) errors.installDate = 'กรุณาเลือกวันที่ต้องการประเมิน';
    if (!contactData.province) errors.province = 'กรุณาเลือกจังหวัด';
    if (!contactData.address.trim()) errors.address = 'กรุณากรอกที่อยู่หน้างานโดยละเอียด';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors); return;
    }
    nextStep();
  };

  const submitBooking = async () => {
    if (!slipFile) {
      setFormErrors({ slip: 'กรุณาแนบสลิปการโอนเงินเพื่อยืนยันการจองคิว' });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. อัปโหลดสลิป
      const slipExt = slipFile.name.split('.').pop();
      const slipName = `evals/slip_${Date.now()}_${Math.random().toString(36).substring(2)}.${slipExt}`;
      const { error: slipError } = await supabase.storage.from('payment_slips').upload(slipName, slipFile);
      if (slipError) throw slipError;

      const { data: { publicUrl: slipUrl } } = supabase.storage.from('payment_slips').getPublicUrl(slipName);

      // 2. บันทึกข้อมูล (แก้ไขชื่อคอลัมน์ให้ตรงกับ Database ของคุณ)
      const { error: dbError } = await supabase.from('eval_bookings').insert([{
        customer_name: contactData.name,
        phone: contactData.phone,
        project_name: contactData.projectName,
        booking_date: contactData.installDate, // 📍 ของคุณใช้คำว่า booking_date
        province: contactData.province,        // 📍 ฟิลด์จังหวัด
        address: contactData.address,          // 📍 ฟิลด์ที่อยู่
        service_type: selectedOption?.label || 'ประเมินและตรวจรับบ้าน',
        slip_url: slipUrl,                     // 📍 เก็บ URL สลิป
        status: 'pending'
      }]);

      if (dbError) throw dbError;
      nextStep(); 
    } catch (error) {
      console.error('Error submitting booking:', error.message);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-32 pt-10 font-sans">
      
      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto mb-16 px-6">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 -z-10"></div>
          {[ { num: 1, label: 'ข้อมูลติดต่อ' }, { num: 2, label: 'ชำระเงิน' }, { num: 3, label: 'จองสำเร็จ' } ].map((step) => (
            <div key={step.num} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep >= step.num ? 'bg-[#001D4A] text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                {currentStep > step.num ? <Check size={16} /> : step.num}
              </div>
              <span className={`text-xs font-bold ${currentStep >= step.num ? 'text-[#001D4A]' : 'text-gray-400'}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: กรอกข้อมูล */}
      {currentStep === 1 && (
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-8 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#001D4A] mb-8 pb-4 border-b">ข้อมูลผู้ติดต่อและสถานที่</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
              <InputField label="ชื่อ - นามสกุล*" name="name" value={contactData.name} onChange={handleContactChange} error={formErrors.name} />
              <InputField label="เบอร์โทรศัพท์ (10 หลัก)*" name="phone" maxLength="10" value={contactData.phone} onChange={handleContactChange} error={formErrors.phone} />
              <InputField label="ชื่อโครงการบ้าน หรือ ชื่อคอนโด*" name="projectName" value={contactData.projectName} onChange={handleContactChange} placeholder="ระบุชื่อโครงการ..." error={formErrors.projectName} />
              <InputField label="วันที่ต้องการนัดหมาย*" name="installDate" type="date" value={contactData.installDate} onChange={handleContactChange} error={formErrors.installDate} />
              
              {/* 📍 เพิ่ม Dropdown เลือกจังหวัด */}
              <div className="mb-6">
                <label className={`text-sm font-medium block mb-1 ${formErrors.province ? 'text-red-500' : 'text-gray-500'}`}>จังหวัด*</label>
                <select name="province" value={contactData.province} onChange={handleContactChange} className={`w-full border-b py-2 outline-none transition-colors bg-transparent text-gray-900 cursor-pointer ${formErrors.province ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#001D4A]'}`}>
                  <option value="" disabled>เลือกจังหวัด</option>
                  {PROVINCES.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                </select>
                {formErrors.province && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.province}</p>}
              </div>

              {/* 📍 เพิ่มช่องกรอกที่อยู่ */}
              <div className="md:col-span-2 mb-4">
                <InputField label="ที่อยู่หน้างานโดยละเอียด*" name="address" value={contactData.address} onChange={handleContactChange} placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ" error={formErrors.address} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 sticky top-10 flex justify-end z-10">
            <div className="bg-white p-7 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 w-full max-w-[340px]">
              <h3 className="text-[#001D4A] font-bold text-lg mb-1">บริการประเมินและตรวจรับ</h3>
              <p className="text-gray-400 font-semibold text-sm mb-6">{selectedOption?.label || 'ระบุไม่ได้'}</p>
              <hr className="border-gray-200 mb-6" />
              <p className="text-gray-600 font-bold text-sm mb-2">ยอดชำระจองคิว</p>
              <p className="text-4xl font-[900] text-[#E60000] tracking-tight mb-8">฿{Number(selectedOption?.price || 0).toLocaleString()}</p>
              <div className="flex flex-col gap-3">
                <button onClick={validateStep1AndNext} className="w-full py-3.5 font-bold rounded-full transition-all text-base flex justify-center items-center gap-2 bg-black text-white hover:bg-gray-800 shadow-md">
                  ไปหน้าชำระเงิน <ChevronRight size={18} />
                </button>
                <button onClick={() => setView('service-eval')} className="w-full py-3.5 bg-white border border-gray-200 text-[#001D4A] font-bold rounded-full hover:bg-gray-50 transition-colors text-base">
                  ย้อนกลับ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: ชำระเงิน */}
      {currentStep === 2 && (
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <h2 className="text-2xl font-bold text-[#001D4A] mb-2">สแกน QR Code เพื่อชำระเงิน</h2>
              <p className="text-gray-500 mb-8 text-base">ชำระผ่านแอปพลิเคชันธนาคารของคุณ (รองรับทุกธนาคาร)</p>
              <div className="border border-gray-200 p-2 rounded-xl bg-gray-50 max-w-[340px] w-full shadow-sm mb-6">
                <img src="/images/QR.jpg" alt="Thai QR Payment" className="w-full h-auto rounded-lg object-contain" />
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className={`text-xl font-bold mb-2 border-b pb-4 ${formErrors.slip ? 'text-red-500 border-red-100' : 'text-[#001D4A] border-gray-100'}`}>แนบหลักฐานการโอนเงิน (สลิป)*</h2>
              {!slipFile && !formErrors.slip && <p className="text-gray-500 text-base font-semibold mb-4 mt-4">* กรุณาอัปโหลดสลิปเพื่อทำการยืนยันการจอง</p>}
              {formErrors.slip && <p className="text-red-500 text-base font-bold mb-4 mt-4">{formErrors.slip}</p>}
              
              <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-colors relative overflow-hidden ${formErrors.slip ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                {slipPreviewUrl ? (
                  <img src={slipPreviewUrl} alt="Slip Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className={`w-12 h-12 mb-3 ${formErrors.slip ? 'text-red-400' : 'text-gray-400'}`} />
                    <p className="mb-2 text-base text-gray-500"><span className={`font-semibold ${formErrors.slip ? 'text-red-500' : 'text-[#001D4A]'}`}>คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวางที่นี่</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleSlipUpload} />
              </label>
              {slipFile && (
                <div className="mt-4 text-center">
                  <button onClick={() => { setSlipFile(null); setSlipPreviewUrl(null); }} className="text-base text-red-500 hover:text-red-700 font-bold underline">ลบรูปภาพและอัปโหลดใหม่</button>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-4 sticky top-10 flex justify-end z-10">
            <div className="bg-white p-7 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 w-full max-w-[340px]">
              <h3 className="text-[#001D4A] font-bold text-lg mb-1">บริการประเมินและตรวจรับ</h3>
              <p className="text-gray-400 font-semibold text-sm mb-6">{selectedOption?.label || 'ระบุไม่ได้'}</p>
              <hr className="border-gray-200 mb-6" />
              <p className="text-gray-600 font-bold text-sm mb-2">ยอดชำระจองคิว</p>
              <p className="text-4xl font-[900] text-[#E60000] tracking-tight mb-8">฿{Number(selectedOption?.price || 0).toLocaleString()}</p>
              <div className="flex flex-col gap-3">
                <button onClick={submitBooking} disabled={isSubmitting} className={`w-full py-3.5 font-bold rounded-full transition-all text-base flex justify-center items-center gap-2 ${isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 shadow-md'}`}>
                  {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> กำลังบันทึกข้อมูล...</> : 'ยืนยันการชำระเงิน'}
                </button>
                <button onClick={prevStep} disabled={isSubmitting} className="w-full py-3.5 bg-white border border-gray-200 text-[#001D4A] font-bold rounded-full hover:bg-gray-50 transition-colors text-base disabled:opacity-50">
                  ย้อนกลับ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: สำเร็จ */}
      {currentStep === 3 && (
        <div className="max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-[32px] shadow-lg border border-gray-100 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"><CheckCircle2 size={40} /></div>
            <h2 className="text-3xl md:text-4xl font-[900] text-[#001D4A] mb-4">ทำรายการจองสำเร็จ!</h2>
            <p className="text-gray-500 text-lg">เราได้รับข้อมูลการจองและหลักฐานการชำระเงินของคุณเรียบร้อยแล้ว<br/>ทีมวิศวกรจะทำการตรวจสอบและติดต่อกลับเพื่อนัดหมายเวลาภายใน 24 ชั่วโมง</p>
          </div>
          <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-200 mb-10">
             <div className="space-y-4 w-full">
                <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">ประเภทบริการ</p><h3 className="text-2xl font-bold text-[#001D4A]">{selectedOption?.label}</h3></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                   <div><p className="text-sm text-gray-500 mb-1">โครงการ / คอนโด</p><p className="font-bold text-gray-800 text-lg">{contactData.projectName}</p></div>
                   <div><p className="text-sm text-gray-500 mb-1">วันที่นัดหมาย</p><p className="font-bold text-gray-800 text-lg">{contactData.installDate}</p></div>
                   <div className="col-span-1 sm:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 mt-2 flex justify-between items-center shadow-sm">
                      <span className="font-bold text-gray-600 text-lg">ยอดชำระแล้ว</span><span className="text-3xl font-black text-green-600">฿{Number(selectedOption?.price || 0).toLocaleString()}</span>
                   </div>
                </div>
             </div>
          </div>
          <div className="text-center">
            <button onClick={() => { setView('home'); window.scrollTo(0, 0); }} className="px-14 py-4 bg-[#001D4A] text-white font-bold rounded-full hover:bg-blue-800 transition-all shadow-md text-lg">กลับสู่หน้าหลัก</button>
          </div>
        </div>
      )}
    </div>
  );
}