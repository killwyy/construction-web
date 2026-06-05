import React, { useState } from 'react';
import { supabase } from './supabase'; 
import { Wrench, Droplet, Zap, PaintRoller, UploadCloud, X, CheckCircle2, Loader2, Hammer, Clock, FileText, ChevronRight, Check, Bath, MoreHorizontal, Grid } from 'lucide-react';

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

export default function ServiceRepair() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [repairImages, setRepairImages] = useState([]);
  
  const [contactData, setContactData] = useState({
    name: '', phone: '', province: '', address: '', repairDate: ''
  });

  const [slipFile, setSlipFile] = useState(null);
  const [slipPreviewUrl, setSlipPreviewUrl] = useState(null);

  const [formErrors, setFormErrors] = useState({});

  const mockTotalRepairPrice = 15000;
  const depositPrice = mockTotalRepairPrice * 0.3;

  const nextStep = () => { 
    setFormErrors({}); 
    window.scrollTo(0, 0); 
    setCurrentStep(prev => prev + 1); 
  };
  const prevStep = () => { 
    setFormErrors({});
    window.scrollTo(0, 0); 
    setCurrentStep(prev => prev - 1); 
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));
      const newImages = imageFiles.map(file => ({
        file: file, preview: URL.createObjectURL(file)
      }));
      setRepairImages(prev => [...prev, ...newImages].slice(0, 50)); 
      
      if (formErrors.images) {
        setFormErrors(prev => ({ ...prev, images: null }));
      }
    }
  };
  
  const removeImage = (index) => setRepairImages(prev => prev.filter((_, i) => i !== index));

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    let inputValue = name === 'phone' ? value.replace(/\D/g, '') : value;
    setContactData(prev => ({ ...prev, [name]: inputValue }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSlipUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSlipFile(file);
      setSlipPreviewUrl(URL.createObjectURL(file));
      if (formErrors.slip) setFormErrors(prev => ({ ...prev, slip: null }));
    }
  };

  const validateStep2AndSubmit = () => {
    const errors = {};
    if (!description.trim()) errors.description = 'กรุณาอธิบายอาการหรือจุดที่ต้องการซ่อมแซม';
    if (repairImages.length === 0) errors.images = 'กรุณาแนบรูปภาพอย่างน้อย 1 รูป';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); nextStep(); }, 1500);
  };

  const validateStep5AndNext = () => {
    const errors = {};
    if (!contactData.name.trim()) errors.name = 'กรุณากรอกชื่อ-นามสกุล';
    if (contactData.phone.length !== 10) errors.phone = 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก';
    if (!contactData.repairDate) errors.repairDate = 'กรุณาเลือกวันที่คาดว่าจะให้เข้าซ่อม';
    if (!contactData.province) errors.province = 'กรุณาเลือกจังหวัด';
    if (!contactData.address.trim()) errors.address = 'กรุณากรอกที่อยู่หน้างานโดยละเอียด';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    nextStep();
  };

  const validateStep6AndSubmit = async () => {
    const errors = {};
    if (!slipFile) errors.slip = 'กรุณาแนบสลิปการโอนเงินเพื่อยืนยันคิวช่าง';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrls = [];
      for (const imgObj of repairImages) {
        const file = imgObj.file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('repair_images').upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('repair_images').getPublicUrl(fileName);
        imageUrls.push(publicUrl);
      }

      const slipExt = slipFile.name.split('.').pop();
      const slipName = `repairs/slip_${Date.now()}_${Math.random().toString(36).substring(2)}.${slipExt}`;
      
      const { error: slipError } = await supabase.storage.from('payment_slips').upload(slipName, slipFile);
      if (slipError) throw slipError;

      const { data: { publicUrl: slipUrl } } = supabase.storage.from('payment_slips').getPublicUrl(slipName);

      const { error: dbError } = await supabase.from('repair_requests').insert([{
        category: selectedCategory,
        description: description,
        images: imageUrls,
        customer_name: contactData.name,
        customer_phone: contactData.phone,
        repair_date: contactData.repairDate,
        province: contactData.province,
        address: contactData.address,
        slip_image_url: slipUrl,
        status: 'pending'
      }]);

      if (dbError) throw dbError;
      
      nextStep(); 
    } catch (error) {
      console.error('Error submitting repair request:', error.message);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const repairCategories = [
    { id: 'งานพื้น', icon: <Grid size={40} />, title: 'งานพื้นและกระเบื้อง', desc: 'ซ่อมพื้นทรุด กระเบื้องร่อน ปูพื้นใหม่' },
    { id: 'หลังคา', icon: <Hammer size={40} />, title: 'งานหลังคาและฝ้า', desc: 'หลังคารั่ว ฝ้าเพดานทะลุ เปลี่ยนกระเบื้อง' },
    { id: 'ประปา', icon: <Droplet size={40} />, title: 'ระบบประปา', desc: 'ท่อน้ำแตก น้ำรั่วซึม ติดตั้งปั๊มน้ำ' },
    { id: 'ห้องน้ำ', icon: <Bath size={40} />, title: 'งานซ่อมแซมห้องน้ำ', desc: 'ชักโครก อ่างล้างหน้า ยาแนวรั่วซึม' },
    { id: 'ไฟฟ้า', icon: <Zap size={40} />, title: 'ระบบไฟฟ้า', desc: 'ไฟช็อต เดินสายไฟใหม่ ติดตั้งแสงสว่าง' },
    { id: 'ทาสี', icon: <PaintRoller size={40} />, title: 'งานทาสีและผนัง', desc: 'ทาสีใหม่ ซ่อมผนังร้าว ลอกวอลเปเปอร์' },
    { id: 'ทั่วไป', icon: <Wrench size={40} />, title: 'งานซ่อมแซมทั่วไป', desc: 'ซ่อมประตู หน้าต่าง หรือเฟอร์นิเจอร์' },
    { id: 'อื่นๆ', icon: <MoreHorizontal size={40} />, title: 'งานอื่นๆ', desc: 'โปรดระบุรายละเอียดงานที่ต้องการ' }
  ];

  const getProgressStep = () => {
    if (currentStep === 1 || currentStep === 2) return currentStep;
    if (currentStep === 3 || currentStep === 4) return 3; 
    if (currentStep === 5) return 4; 
    if (currentStep >= 6) return 5; 
    return 1;
  };
  const progressStep = getProgressStep();

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      
      <div className="relative h-[400px] overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
          alt="Home Repair and Renovation"
        />
        <div className="relative z-10 text-center text-white px-4 space-y-4">
          <h1 className="text-5xl font-bold tracking-tight mb-2">บริการซ่อมแซม</h1>
          <p className="text-lg tracking-[0.2em] font-light uppercase opacity-90">
            ส่งรูปจุดที่มีปัญหา เพื่อให้ผู้เชี่ยวชาญของเราประเมินราคาฟรี
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-50 rounded-t-[40px]"></div>
      </div>

      <div className="max-w-4xl mx-auto mb-12 px-6 mt-10">
        <h2 className="text-3xl font-bold text-center text-[#001D4A] mb-10">แจ้งประเมินราคางานซ่อม</h2>
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 -z-10"></div>
          {[ 
            { num: 1, label: 'เลือกบริการ' }, 
            { num: 2, label: 'ระบุปัญหา' }, 
            { num: 3, label: 'เสนอราคา' }, 
            { num: 4, label: 'ข้อมูลติดต่อ' },
            { num: 5, label: 'มัดจำคิวช่าง' } 
          ].map((step) => (
            <div key={step.num} className="flex flex-col items-center gap-2 bg-gray-50 px-1 sm:px-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ${
                progressStep >= step.num ? 'bg-[#001D4A] text-white shadow-md' : 'bg-gray-200 text-gray-400'
              }`}>
                {progressStep > step.num ? <Check size={18} /> : step.num}
              </div>
              <span className={`text-[10px] sm:text-xs font-semibold hidden sm:block ${progressStep >= step.num ? 'text-[#001D4A]' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {currentStep === 1 && (
        <div className="max-w-6xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-[#001D4A] mb-6 text-center">คุณต้องการให้เราดูแลเรื่องใด?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
                <p className="text-gray-500 text-sm font-light">{cat.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center flex justify-center gap-4">
            {/* 📍 ปรับปุ่มให้เปลี่ยนสีและกดไม่ได้ถ้ายังไม่เลือกหมวดหมู่ */}
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

            <h3 className={`text-lg font-bold mb-3 ${formErrors.description ? 'text-red-500' : 'text-[#001D4A]'}`}>อธิบายอาการ / จุดที่ต้องการซ่อมแซม*</h3>
            <textarea 
              value={description} 
              onChange={(e) => {
                setDescription(e.target.value);
                if (formErrors.description) setFormErrors(prev => ({...prev, description: null}));
              }} 
              rows="4"
              placeholder="กรุณาอธิบายอาการอย่างละเอียด เพื่อให้ช่างประเมินราคาได้แม่นยำขึ้น..."
              className={`w-full border-2 rounded-2xl p-4 text-base font-light outline-none transition-colors bg-gray-50 resize-none mb-2
                ${formErrors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#001D4A]'}`}
            ></textarea>
            {formErrors.description && <p className="text-red-500 text-sm font-medium mb-8">{formErrors.description}</p>}
            {!formErrors.description && <div className="mb-8"></div>}

            <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${formErrors.images ? 'text-red-500' : 'text-[#001D4A]'}`}>
              แนบรูปภาพหน้างานจริง*
            </h3>
            
            <div className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-colors
              ${formErrors.images ? 'border-red-500 bg-red-50' : 'border-blue-200 bg-blue-50/50'}`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className={`w-12 h-12 mb-4 ${formErrors.images ? 'text-red-500' : 'text-blue-600'}`} />
                <div className="flex flex-col sm:flex-row gap-3 items-center mb-2">
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                    เลือกรูปภาพ
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                  </label>
                  <span className={`${formErrors.images ? 'text-red-400' : 'text-gray-400'} font-semibold text-sm`}>หรือ</span>
                  <label className="cursor-pointer bg-white border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm">
                    อัปโหลดทั้งโฟลเดอร์
                    <input type="file" className="hidden" accept="image/*" webkitdirectory="true" onChange={handleImageUpload} />
                  </label>
                </div>
                <p className={`text-sm font-light mt-2 ${formErrors.images ? 'text-red-500' : 'text-gray-500'}`}>รองรับ PNG, JPG (ระบบจะดึงเฉพาะไฟล์รูปอัตโนมัติ)</p>
              </div>
            </div>
            {formErrors.images && <p className="text-red-500 text-sm font-medium mt-2">{formErrors.images}</p>}

            {repairImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 max-h-[300px] overflow-y-auto p-3 border border-gray-100 rounded-2xl bg-gray-50">
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
              onClick={validateStep2AndSubmit} 
              disabled={isSubmitting}
              className={`px-12 py-4 font-bold rounded-full transition-all flex items-center gap-2 bg-[#001D4A] text-white hover:bg-blue-900 shadow-xl hover:-translate-y-1
                ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> กำลังส่งข้อมูล...</> : 'ขอประเมินราคาฟรี'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto px-6 animate-in zoom-in duration-500">
          <div className="bg-white p-12 rounded-[32px] shadow-lg border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
            
            <div className="w-24 h-24 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Clock size={48} />
            </div>
            <h2 className="text-3xl font-bold text-[#001D4A] mb-4">ระบบได้รับรูปภาพปัญหาแล้ว</h2>
            <h3 className="text-xl font-bold text-gray-800 mb-4">สถานะ: <span className="text-yellow-600">รอการประเมินราคาจากวิศวกร</span></h3>
            
            <p className="text-gray-500 text-base font-light leading-relaxed mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              วิศวกรของเรากำลังตรวจสอบรายละเอียดและรูปภาพที่คุณส่งมา 
              <br/>เราจะทำการประเมินราคาและจัดทำใบเสนอราคาให้ท่าน <strong className="font-semibold">ภายใน 24 ชั่วโมง</strong>
            </p>

            <button onClick={() => window.location.reload()} className="px-14 py-4 bg-white border border-gray-200 text-[#001D4A] font-bold rounded-full hover:bg-gray-50 transition-all text-lg">
              กลับสู่หน้าหลัก
            </button>
          </div>

          <div className="mt-8 text-center animate-pulse">
            <button onClick={nextStep} className="text-sm font-bold text-purple-600 bg-purple-100 px-4 py-2 rounded-full hover:bg-purple-200">
              👉 (จำลอง) แอดมินประเมินราคาเสร็จแล้ว
            </button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="max-w-3xl mx-auto px-6 animate-in zoom-in duration-500">
          <div className="bg-white p-10 md:p-14 rounded-[32px] shadow-xl border border-gray-100">
            
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-200">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <CheckCircle2 size={16} /> ประเมินราคาเรียบร้อยแล้ว
                </div>
                <h2 className="text-3xl font-bold text-[#001D4A]">ใบเสนอราคา (ประเมินเบื้องต้น)</h2>
                <p className="text-gray-500 font-light mt-1">อ้างอิง: REQ-{Date.now().toString().slice(-6)} | หมวดหมู่: {selectedCategory}</p>
              </div>
              <FileText size={48} className="text-gray-300 hidden sm:block" />
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <span className="text-gray-600 font-medium">1. ค่าบริการช่างและวิศวกรเข้าสำรวจหน้างาน</span>
                <span className="font-bold text-gray-900">ฟรี (ไม่มีค่าใช้จ่าย)</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <span className="text-gray-600 font-medium">2. ค่าแรงและค่าวัสดุอุปกรณ์ประเมินเบื้องต้น</span>
                <span className="font-bold text-gray-900">฿{mockTotalRepairPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-[#001D4A] text-white p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center mb-6 shadow-lg">
              <span className="text-lg font-medium opacity-90 mb-2 sm:mb-0">ราคาสุทธิโดยประมาณ</span>
              <span className="text-4xl font-bold text-yellow-400">฿{mockTotalRepairPrice.toLocaleString()}</span>
            </div>

            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 flex justify-between items-center border border-red-100">
              <span className="font-bold">เงินมัดจำสำหรับจองคิวช่าง (30% ของยอดประเมิน)</span>
              <span className="text-xl font-bold">฿{depositPrice.toLocaleString()}</span>
            </div>

            <p className="text-xs text-red-500 font-light text-center mb-8">
              *ราคาที่แสดงเป็นเพียงราคาประเมินเบื้องต้นจากรูปภาพเท่านั้น ราคาจริงอาจมีการเปลี่ยนแปลงหลังจากทีมช่างเข้าสำรวจพื้นที่หน้างานจริง
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => window.location.reload()} className="px-10 py-4 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-50 transition-colors w-full sm:w-auto">
                ไม่สนใจรับบริการ
              </button>
              <button onClick={nextStep} className="px-10 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 shadow-xl transition-all w-full sm:w-auto flex justify-center items-center gap-2">
                ยอมรับราคาและระบุสถานที่ซ่อม <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="max-w-3xl mx-auto px-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-[#001D4A] mb-2">ข้อมูลผู้ติดต่อและสถานที่หน้างาน</h2>
            <p className="text-gray-500 font-light mb-8 pb-4 border-b border-gray-100">กรุณากรอกข้อมูลเพื่อให้ทีมช่างติดต่อยืนยันคิวและเข้าสำรวจหน้างานครับ</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <InputField label="ชื่อ - นามสกุล*" name="name" value={contactData.name} onChange={handleContactChange} error={formErrors.name} />
              <InputField label="เบอร์โทรศัพท์ (10 หลัก)*" name="phone" maxLength="10" value={contactData.phone} onChange={handleContactChange} error={formErrors.phone} />
              <InputField label="วันที่คาดว่าจะให้เข้าซ่อม*" name="repairDate" type="date" value={contactData.repairDate} onChange={handleContactChange} error={formErrors.repairDate} />
              
              <div className="mb-6">
                <label className={`text-sm font-medium block mb-1 ${formErrors.province ? 'text-red-500' : 'text-gray-500'}`}>จังหวัด*</label>
                <select 
                  name="province" 
                  value={contactData.province} 
                  onChange={handleContactChange} 
                  className={`w-full border-b py-2 outline-none transition-colors bg-transparent text-gray-900 cursor-pointer
                    ${formErrors.province ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#001D4A]'}`}
                >
                  <option value="" disabled>เลือกจังหวัด</option>
                  {PROVINCES.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                </select>
                {formErrors.province && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.province}</p>}
              </div>

              <div className="md:col-span-2 mb-4">
                <InputField label="ที่อยู่หน้างานโดยละเอียด*" name="address" value={contactData.address} onChange={handleContactChange} placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ" error={formErrors.address} />
              </div>

            </div>
          </div>

          <div className="flex justify-between mt-10">
            <button onClick={prevStep} className="px-10 py-4 bg-white border border-gray-200 text-[#001D4A] font-bold rounded-full hover:bg-gray-50 transition-colors">ย้อนกลับ</button>
            <button 
              onClick={validateStep5AndNext} 
              className="px-12 py-4 font-bold rounded-full transition-all flex items-center gap-2 bg-[#001D4A] text-white hover:bg-blue-900 shadow-xl hover:-translate-y-1"
            >
              ไปหน้าชำระเงิน <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {currentStep === 6 && (
        <div className="max-w-4xl mx-auto px-6 animate-in slide-in-from-right-4 duration-500">
          
          <div className="bg-[#001D4A] text-white p-6 md:p-8 rounded-[32px] shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
                <p className="text-blue-200 font-semibold mb-1">ยอดชำระมัดจำจองคิวซ่อม (30%)</p>
                <h3 className="text-2xl font-bold">{repairCategories.find(c => c.id === selectedCategory)?.title}</h3>
             </div>
             <div className="text-right">
                <span className="text-5xl font-bold text-yellow-400 tracking-tight">฿{depositPrice.toLocaleString()}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold text-[#001D4A] mb-2">สแกน QR Code</h2>
              <p className="text-gray-500 mb-6 text-sm font-light text-center">ชำระผ่านแอปพลิเคชันธนาคารของคุณ (รองรับทุกธนาคาร)</p>
              <div className="border border-gray-200 p-2 rounded-2xl bg-gray-50 w-full max-w-[280px] shadow-sm">
                <img src="/images/QR.jpg" alt="Thai QR Payment" className="w-full h-auto rounded-xl object-contain" />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
              <h2 className={`text-xl font-bold mb-2 border-b pb-4 ${formErrors.slip ? 'text-red-500 border-red-100' : 'text-[#001D4A] border-gray-100'}`}>แนบสลิปการโอนเงิน*</h2>
              {!slipFile && !formErrors.slip && <p className="text-gray-500 text-sm font-medium mb-4 mt-4">* กรุณาอัปโหลดสลิปเพื่อยืนยันการจองคิว</p>}
              {formErrors.slip && <p className="text-red-500 text-sm font-bold mb-4 mt-4">{formErrors.slip}</p>}
              
              <label className={`flex flex-col items-center justify-center w-full h-56 mt-4 border-2 border-dashed rounded-2xl cursor-pointer transition-colors relative overflow-hidden
                ${formErrors.slip ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                {slipPreviewUrl ? (
                  <img src={slipPreviewUrl} alt="Slip Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className={`w-12 h-12 mb-3 ${formErrors.slip ? 'text-red-400' : 'text-gray-400'}`} />
                    <p className="mb-2 text-sm text-gray-500"><span className={`font-semibold ${formErrors.slip ? 'text-red-500' : 'text-[#001D4A]'}`}>คลิกเพื่ออัปโหลด</span></p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleSlipUpload} />
              </label>
              
              {slipFile && (
                <div className="mt-4 text-center">
                  <button onClick={() => { setSlipFile(null); setSlipPreviewUrl(null); }} className="text-sm text-red-500 hover:text-red-700 font-bold underline">ลบรูปและอัปโหลดใหม่</button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <button onClick={prevStep} className="px-10 py-4 bg-white border border-gray-200 text-[#001D4A] font-bold rounded-full hover:bg-gray-50 transition-colors">ย้อนกลับ</button>
            <button 
              onClick={validateStep6AndSubmit} 
              disabled={isSubmitting}
              className={`px-12 py-4 font-bold rounded-full transition-all flex items-center gap-2 bg-black text-white hover:bg-gray-800 shadow-xl hover:-translate-y-1
                ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> กำลังตรวจสอบ...</> : 'ยืนยันการชำระเงิน'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 7 && (
        <div className="max-w-2xl mx-auto px-6 animate-in zoom-in duration-500">
          <div className="bg-white p-14 rounded-[32px] shadow-lg border border-gray-100 text-center">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <CheckCircle2 size={50} />
            </div>
            <h2 className="text-4xl font-bold text-[#001D4A] mb-4">จองคิวซ่อมสำเร็จ!</h2>
            <p className="text-gray-500 text-lg font-light mb-8 leading-relaxed">
              เราได้รับรายละเอียดสถานที่, หลักฐานการชำระเงินมัดจำ <br/>
              และจะส่งทีมช่างไปในวันที่ <strong className="font-semibold">{contactData.repairDate}</strong> ตามที่คุณได้ระบุไว้ <br/><br/>
              ทีมงานจะติดต่อกลับไปยังเบอร์ <span className="font-bold text-[#001D4A]">{contactData.phone}</span> ภายใน 24 ชม. เพื่อยืนยันเวลานัดหมายครับ
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-14 py-4 bg-[#001D4A] text-white font-bold rounded-full hover:bg-blue-800 transition-all shadow-md text-lg"
            >
              กลับสู่หน้าหลัก
            </button>
          </div>
        </div>
      )}

    </div>
  );
}