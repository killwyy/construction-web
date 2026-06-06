import React, { useState } from 'react';
import { supabase } from './supabase'; 
import { Wrench, Droplet, Zap, PaintRoller, UploadCloud, X, Loader2, Hammer, ChevronRight, Check, Bath, MoreHorizontal, Grid, Clock } from 'lucide-react';

export default function ServiceRepair({ setView }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [repairImages, setRepairImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [createdId, setCreatedId] = useState(null); 
  const [alertModal, setAlertModal] = useState(false);

  const nextStep = () => { setFormErrors({}); window.scrollTo(0, 0); setCurrentStep(prev => prev + 1); };
  
  const handleNextStep = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAlertModal(true);
      return;
    }
    nextStep();
  };

  const prevStep = () => { setFormErrors({}); window.scrollTo(0, 0); setCurrentStep(prev => prev - 1); };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).filter(file => file.type.startsWith('image/')).map(file => ({
        file: file, preview: URL.createObjectURL(file)
      }));
      setRepairImages(prev => [...prev, ...newImages].slice(0, 50)); 
      if (formErrors.images) setFormErrors(prev => ({ ...prev, images: null }));
    }
  };
  const removeImage = (index) => setRepairImages(prev => prev.filter((_, i) => i !== index));

  const submitEvaluation = async () => {
    const errors = {};
    if (!description.trim()) errors.description = 'กรุณาอธิบายอาการหรือจุดที่ต้องการซ่อมแซม';
    if (repairImages.length === 0) errors.images = 'กรุณาแนบรูปภาพอย่างน้อย 1 รูป';
    
    if (Object.keys(errors).length > 0) return setFormErrors(errors);
    
    setIsSubmitting(true);
    try {
      // 📍 ดึงอีเมลคนล็อกอินเพื่อเอาไปบันทึก
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserEmail = user?.email || 'guest';

      const imageUrls = [];
      for (const imgObj of repairImages) {
        const file = imgObj.file;
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('repair_images').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('repair_images').getPublicUrl(fileName);
        imageUrls.push(publicUrl);
      }

      // 📍 บันทึก user_email ลงไปด้วย
      const { data, error: dbError } = await supabase.from('repair_requests').insert([{
        category: selectedCategory,
        description: description,
        images: imageUrls,
        status: 'pending_eval',
        user_email: currentUserEmail 
      }]).select(); 

      if (dbError) throw dbError;
      
      setCreatedId(data[0].id); 
      nextStep(); 
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
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

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="relative h-[400px] overflow-hidden flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1920&q=80" className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" alt="Home Repair"/>
        <div className="relative z-10 text-center text-white px-4 space-y-4">
          <h1 className="text-5xl font-bold tracking-tight mb-2">บริการซ่อมแซม</h1>
          <p className="text-lg tracking-[0.2em] font-light uppercase opacity-90">ส่งรายละเอียดเพื่อแจ้งประเมินราคาฟรี</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-12 px-6 mt-10">
        <div className="flex justify-between items-center relative max-w-lg mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 -z-10"></div>
          {[ { num: 1, label: 'เลือกบริการ' }, { num: 2, label: 'ระบุปัญหา' }, { num: 3, label: 'สำเร็จ' } ].map((step) => (
            <div key={step.num} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep >= step.num ? 'bg-[#001D4A] text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                {currentStep > step.num ? <Check size={18} /> : step.num}
              </div>
              <span className={`text-xs font-semibold ${currentStep >= step.num ? 'text-[#001D4A]' : 'text-gray-400'}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {currentStep === 1 && (
        <div className="max-w-6xl mx-auto px-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {repairCategories.map((cat) => (
              <div key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`cursor-pointer rounded-3xl p-8 border-2 transition-all duration-300 flex flex-col items-center text-center ${selectedCategory === cat.id ? 'border-blue-600 bg-blue-50 shadow-lg scale-[1.02]' : 'border-gray-100 bg-white hover:border-blue-300'}`}>
                <div className={`p-4 rounded-full mb-4 ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-[#001D4A]'}`}>{cat.icon}</div>
                <h4 className="text-xl font-bold mb-2 text-[#001D4A]">{cat.title}</h4>
                <p className="text-gray-500 text-sm font-light">{cat.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center flex justify-center">
            <button onClick={handleNextStep} disabled={!selectedCategory} className={`px-16 py-4 font-bold rounded-full transition-all text-lg flex items-center gap-2 ${!selectedCategory ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#001D4A] text-white hover:bg-blue-900 shadow-xl hover:-translate-y-1'}`}>
              ถัดไป <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="max-w-3xl mx-auto px-6 animate-in fade-in duration-500">
          <div className="bg-white p-12 rounded-[32px] shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-3 text-[#001D4A]">อธิบายอาการ / จุดที่ต้องการซ่อมแซม*</h3>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full border-2 border-gray-200 rounded-2xl p-4 bg-gray-50 resize-none mb-6 outline-none focus:border-[#001D4A]"></textarea>
            
            <h3 className="text-lg font-bold mb-3 text-[#001D4A]">แนบรูปภาพหน้างานจริง*</h3>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl cursor-pointer">
              <UploadCloud className="w-12 h-12 mb-4 text-blue-600" />
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm">เลือกรูปภาพ</span>
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
            </label>

            {repairImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-6">
                {repairImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border">
                    <img src={img.preview} className="w-full h-full object-cover" alt="preview" />
                    <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between mt-10">
            <button onClick={prevStep} className="px-10 py-4 bg-white border font-bold rounded-full text-[#001D4A]">ย้อนกลับ</button>
            <button onClick={submitEvaluation} disabled={isSubmitting} className="px-12 py-4 font-bold rounded-full bg-[#001D4A] text-white shadow-xl flex items-center gap-2">
              {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> กำลังส่งข้อมูล...</> : 'ขอประเมินราคาฟรี'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto px-6 animate-in zoom-in duration-500 text-center">
          <div className="bg-white p-12 rounded-[32px] shadow-lg border border-gray-100">
            <Clock size={60} className="text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#001D4A] mb-4">ระบบได้รับข้อมูลแล้ว</h2>
            <p className="text-gray-500 mb-8">วิศวกรจะทำการประเมินราคาและแจ้งกลับภายใน 24 ชั่วโมง<br/>คุณสามารถตรวจสอบสถานะได้ที่ "ประวัติและบัญชีของฉัน"</p>
            
            <button onClick={() => setView('profile')} className="px-10 py-3.5 bg-[#001D4A] text-white font-bold rounded-full mb-4 hover:bg-blue-900 shadow-md">
              ดูสถานะการแจ้งซ่อม
            </button>
          </div>
        </div>
      )}

      {alertModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden text-center p-8">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center border-2 border-red-100">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 4a8 8 0 100 16A8 8 0 0012 4z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-[#001D4A] mb-2">กรุณาเข้าสู่ระบบ</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">คุณต้องเข้าสู่ระบบก่อนเพื่อดำเนินการต่อ</p>
            <button
              onClick={() => { setAlertModal(false); setView('login'); }}
              className="w-full py-3.5 rounded-full font-bold text-base text-white bg-[#001D4A] hover:bg-blue-900 transition-all shadow-md"
            >
              ไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}