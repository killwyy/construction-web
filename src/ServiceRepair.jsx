import React, { useState } from 'react';
import { Wrench, Droplet, Zap, PaintRoller, UploadCloud, X, CheckCircle2, Loader2, Home, Hammer, Clock, FileText, ChevronRight, Check } from 'lucide-react';

// รายชื่อ 77 จังหวัด
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

const InputField = ({ label, name, type = "text", value, onChange, placeholder, maxLength }) => (
  <div className="mb-6">
    <label className="text-sm text-gray-500 block mb-1">{label}</label>
    <input 
      type={type} 
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#001D4A] transition-colors bg-transparent text-gray-900"
    />
  </div>
);

export default function ServiceRepair() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [repairImages, setRepairImages] = useState([]);
  const [contactData, setContactData] = useState({
    name: '', phone: '', lineId: '', province: '', address: ''
  });

  const nextStep = () => { window.scrollTo(0, 0); setCurrentStep(prev => prev + 1); };
  const prevStep = () => { window.scrollTo(0, 0); setCurrentStep(prev => prev - 1); };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map(file => ({
        file: file, preview: URL.createObjectURL(file)
      }));
      setRepairImages(prev => [...prev, ...newImages].slice(0, 4)); 
    }
  };
  const removeImage = (index) => setRepairImages(prev => prev.filter((_, i) => i !== index));

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    let inputValue = name === 'phone' ? value.replace(/\D/g, '') : value;
    setContactData(prev => ({ ...prev, [name]: inputValue }));
  };

  const submitToPending = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      nextStep();
    }, 1500);
  };

  const repairCategories = [
    { id: 'ต่อเติม', icon: <Home size={40} />, title: 'งานต่อเติมโครงสร้าง', desc: 'ต่อเติมครัว โรงรถ ขยายห้อง' },
    { id: 'หลังคา', icon: <Hammer size={40} />, title: 'งานหลังคาและฝ้า', desc: 'หลังคารั่ว ฝ้าเพดานทะลุ เปลี่ยนกระเบื้อง' },
    { id: 'ประปา', icon: <Droplet size={40} />, title: 'ระบบประปา', desc: 'ท่อน้ำแตก น้ำรั่วซึม ติดตั้งปั๊มน้ำ' },
    { id: 'ไฟฟ้า', icon: <Zap size={40} />, title: 'ระบบไฟฟ้า', desc: 'ไฟช็อต เดินสายไฟใหม่ ติดตั้งแสงสว่าง' },
    { id: 'ทาสี', icon: <PaintRoller size={40} />, title: 'งานทาสี / พื้นผนัง', desc: 'ทาสีใหม่ ปูกระเบื้อง ซ่อมผนังร้าว' },
    { id: 'อื่นๆ', icon: <Wrench size={40} />, title: 'งานซ่อมแซมทั่วไป', desc: 'ซ่อมประตู หน้าต่าง หรืออาการอื่นๆ' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-32 font-sans">
      
      {/* 📍 Hero Section ด้านบนสุด */}
      <div className="relative h-[400px] overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
          alt="Home Repair and Renovation"
        />
        <div className="relative z-10 text-center text-white px-4 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-wide">บริการซ่อมแซมและต่อเติม</h1>
          <p className="text-gray-300 text-lg font-light tracking-widest pt-2 uppercase">
            ส่งรูปจุดที่มีปัญหา เพื่อให้ผู้เชี่ยวชาญของเราประเมินราคาฟรี
          </p>
        </div>
        {/* เส้นโค้งเนียนๆ เชื่อมกับพื้นหลังเว็บ */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-50 rounded-t-[40px]"></div>
      </div>

      {/* 📍 แถบสถานะด้านบน (Progress Bar) */}
      <div className="max-w-4xl mx-auto mb-12 px-6 mt-10">
        <h2 className="text-3xl font-black text-center text-[#001D4A] mb-10">แจ้งประเมินราคางานซ่อม</h2>
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 -z-10"></div>
          {[ 
            { num: 1, label: 'เลือกบริการ' }, 
            { num: 2, label: 'ระบุปัญหา' }, 
            { num: 3, label: 'ข้อมูลติดต่อ' }, 
            { num: 4, label: 'สถานะ' } 
          ].map((step) => (
            <div key={step.num} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                currentStep >= step.num ? 'bg-[#001D4A] text-white shadow-md' : 'bg-gray-200 text-gray-400'
              }`}>
                {currentStep > step.num ? <Check size={20} /> : step.num}
              </div>
              <span className={`text-xs font-bold hidden sm:block ${currentStep >= step.num ? 'text-[#001D4A]' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- STEP 1: เลือกหมวดหมู่งานซ่อม --- */}
      {currentStep === 1 && (
        <div className="max-w-5xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-[#001D4A] mb-6 text-center">คุณต้องการให้เราดูแลเรื่องใด?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {repairCategories.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat.id)}
                className={`cursor-pointer rounded-3xl p-8 border-2 transition-all duration-300 flex flex-col items-center text-center
                  ${selectedCategory === cat.id 
                    ? 'border-blue-600 bg-blue-50 shadow-lg scale-[1.02]' 
                    : 'border-gray-100 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
              >
                <div className={`p-4 rounded-full mb-4 ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-[#001D4A]'}`}>
                  {cat.icon}
                </div>
                <h4 className={`text-xl font-bold mb-2 ${selectedCategory === cat.id ? 'text-blue-700' : 'text-[#001D4A]'}`}>{cat.title}</h4>
                <p className="text-gray-500 text-sm">{cat.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center flex justify-center gap-4">
            <button 
              onClick={nextStep} 
              disabled={!selectedCategory}
              className={`px-16 py-4 font-bold rounded-full transition-all text-lg flex items-center gap-2
                ${!selectedCategory ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#001D4A] text-white hover:bg-blue-900 shadow-xl hover:-translate-y-1'}`}
            >
              ถัดไป <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 2: รายละเอียดและอัปโหลดรูป --- */}
      {currentStep === 2 && (
        <div className="max-w-3xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                {repairCategories.find(c => c.id === selectedCategory)?.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">หมวดหมู่ที่เลือก</p>
                <h2 className="text-2xl font-bold text-[#001D4A]">{repairCategories.find(c => c.id === selectedCategory)?.title}</h2>
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#001D4A] mb-3">อธิบายอาการ / จุดที่ต้องการซ่อมแซม*</h3>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="4"
              placeholder="กรุณาอธิบายอาการอย่างละเอียด เพื่อให้ช่างประเมินราคาได้แม่นยำขึ้น..."
              className="w-full border-2 border-gray-200 rounded-2xl p-4 text-base outline-none focus:border-[#001D4A] transition-colors bg-gray-50 resize-none mb-8"
            ></textarea>

            <h3 className="text-lg font-bold text-[#001D4A] mb-3 flex items-center gap-2">
              แนบรูปภาพหน้างานจริง (สูงสุด 4 รูป)*
            </h3>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-blue-200 border-dashed rounded-2xl cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-12 h-12 text-blue-600 mb-3" />
                <p className="mb-1 text-base text-gray-600"><span className="font-semibold text-blue-600">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวางที่นี่</p>
                <p className="text-sm text-gray-400">PNG, JPG (สูงสุด 5MB)</p>
              </div>
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={repairImages.length >= 4} />
            </label>

            {repairImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {repairImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                    <img src={img.preview} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"><X size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-10">
            <button onClick={prevStep} className="px-10 py-4 bg-white border border-gray-200 text-[#001D4A] font-bold rounded-full hover:bg-gray-50 transition-colors">ย้อนกลับ</button>
            <button 
              onClick={nextStep} 
              disabled={description.trim() === '' || repairImages.length === 0}
              className={`px-12 py-4 font-bold rounded-full transition-all flex items-center gap-2
                ${description.trim() === '' || repairImages.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#001D4A] text-white hover:bg-blue-900 shadow-xl hover:-translate-y-1'}`}
            >
              ถัดไป <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: ข้อมูลติดต่อ --- */}
      {currentStep === 3 && (
        <div className="max-w-3xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#001D4A] mb-8 pb-4 border-b">ข้อมูลผู้ติดต่อและสถานที่หน้างาน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <InputField label="ชื่อ - นามสกุล*" name="name" value={contactData.name} onChange={handleContactChange} />
              <InputField label="เบอร์โทรศัพท์ (10 หลัก)*" name="phone" maxLength="10" value={contactData.phone} onChange={handleContactChange} />
              <InputField label="Line ID (ถ้ามี)" name="lineId" value={contactData.lineId} onChange={handleContactChange} />
              <div className="mb-6">
                <label className="text-sm text-gray-500 block mb-1">จังหวัด*</label>
                <select name="province" value={contactData.province} onChange={handleContactChange} className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#001D4A] transition-colors bg-transparent text-gray-900 cursor-pointer">
                  <option value="" disabled>เลือกจังหวัด</option>
                  {PROVINCES.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <InputField label="ที่อยู่หน้างานโดยละเอียด*" name="address" value={contactData.address} onChange={handleContactChange} placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ" />
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <button onClick={prevStep} className="px-10 py-4 bg-white border border-gray-200 text-[#001D4A] font-bold rounded-full hover:bg-gray-50 transition-colors">ย้อนกลับ</button>
            <button 
              onClick={submitToPending} 
              disabled={contactData.name === '' || contactData.phone.length !== 10 || contactData.province === '' || contactData.address === '' || isSubmitting}
              className={`px-12 py-4 font-bold rounded-full transition-all flex items-center gap-2
                ${contactData.name === '' || contactData.phone.length !== 10 || contactData.province === '' || contactData.address === '' || isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-xl hover:-translate-y-1'}`}
            >
              {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> กำลังส่งข้อมูล...</> : 'ส่งข้อมูลเพื่อประเมินราคา'}
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 4: รอการประเมินราคา (สถานะรอดำเนินการ) --- */}
      {currentStep === 4 && (
        <div className="max-w-2xl mx-auto px-6 animate-in zoom-in duration-500">
          <div className="bg-white p-12 rounded-[32px] shadow-lg border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
            
            <div className="w-24 h-24 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Clock size={48} />
            </div>
            <h2 className="text-3xl font-[900] text-[#001D4A] mb-4">ระบบได้รับข้อมูลของท่านแล้ว</h2>
            <h3 className="text-xl font-bold text-gray-800 mb-4">สถานะ: <span className="text-yellow-600">รอการประเมินราคาจากวิศวกร</span></h3>
            
            <p className="text-gray-500 text-base leading-relaxed mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              วิศวกรของเรากำลังตรวจสอบรายละเอียดและรูปภาพที่คุณส่งมา 
              <br/>เราจะทำการประเมินราคาและจัดทำใบเสนอราคาให้ท่าน <strong>ภายใน 24 ชั่วโมง</strong>
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-10">
              <p className="text-blue-800 font-semibold mb-1">ติดตามสถานะได้ง่ายๆ</p>
              <p className="text-blue-600 text-sm">คุณสามารถเช็คใบเสนอราคาและอนุมัติงานซ่อมได้ตลอดเวลาผ่านเมนู <br/><span className="font-bold underline">บัญชีผู้ใช้ของคุณ</span> (ระบบกำลังจะเปิดให้บริการเร็วๆ นี้)</p>
            </div>

            <button onClick={() => window.location.reload()} className="px-14 py-4 bg-white border border-gray-200 text-[#001D4A] font-bold rounded-full hover:bg-gray-50 transition-all text-lg">
              กลับสู่หน้าหลัก
            </button>
          </div>

          <div className="mt-8 text-center animate-pulse">
            <button onClick={nextStep} className="text-sm font-bold text-purple-600 bg-purple-100 px-4 py-2 rounded-full hover:bg-purple-200">
              👉 (จำลอง) แอดมินประเมินราคาเสร็จแล้ว กดดูใบเสนอราคา
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 5: ใบเสนอราคาประเมิน (เมื่อแอดมินประเมินเสร็จ) --- */}
      {currentStep === 5 && (
        <div className="max-w-3xl mx-auto px-6 animate-in zoom-in duration-500">
          <div className="bg-white p-10 md:p-14 rounded-[32px] shadow-xl border border-gray-100">
            
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-200">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <CheckCircle2 size={16} /> ประเมินราคาเรียบร้อยแล้ว
                </div>
                <h2 className="text-3xl font-black text-[#001D4A]">ใบเสนอราคา (ประเมินเบื้องต้น)</h2>
                <p className="text-gray-500 mt-1">อ้างอิง: REQ-{Date.now().toString().slice(-6)} | หมวดหมู่: {selectedCategory}</p>
              </div>
              <FileText size={48} className="text-gray-300 hidden sm:block" />
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <span className="text-gray-600 font-medium">1. ค่าบริการช่างและวิศวกรเข้าสำรวจหน้างาน</span>
                <span className="font-bold text-gray-900">ฟรี (ไม่มีค่าใช้จ่าย)</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <span className="text-gray-600 font-medium">2. ค่าวัสดุอุปกรณ์ (ประเมินตามรูปภาพ)</span>
                <span className="font-bold text-gray-900">฿8,500 - ฿12,000</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <span className="text-gray-600 font-medium">3. ค่าแรงช่างซ่อมแซม</span>
                <span className="font-bold text-gray-900">฿4,000 - ฿6,000</span>
              </div>
            </div>

            <div className="bg-[#001D4A] text-white p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center mb-10 shadow-lg">
              <span className="text-lg font-medium opacity-90 mb-2 sm:mb-0">ราคาสุทธิโดยประมาณ</span>
              <span className="text-4xl font-black text-yellow-400">฿12,500 - ฿18,000</span>
            </div>

            <p className="text-xs text-red-500 text-center mb-8 font-medium">
              *ราคาที่แสดงเป็นเพียงราคาประเมินเบื้องต้นจากรูปภาพเท่านั้น ราคาจริงอาจมีการเปลี่ยนแปลงหลังจากทีมช่างเข้าสำรวจพื้นที่หน้างานจริง
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => alert("ระบบปฏิเสธใบเสนอราคา (กำลังพัฒนา)")} className="px-10 py-4 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-50 transition-colors w-full sm:w-auto">
                ไม่สนใจรับบริการ
              </button>
              <button onClick={() => alert("ระบบนัดหมายเข้าซ่อม (กำลังพัฒนา)")} className="px-10 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 shadow-xl transition-all w-full sm:w-auto">
                ยอมรับราคาและนัดหมาย
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}