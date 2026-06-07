import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Check, X, UploadCloud, CheckCircle2, Loader2 } from 'lucide-react';

// 📍 อัปเดต InputField ให้รองรับขอบแดงตอนเกิด Error
const InputField = ({ label, name, type = "text", value, onChange, maxLength, error }) => (
  <div className="mb-6">
    <label className={`text-base font-medium block mb-2 ${error ? 'text-red-500' : 'text-gray-600'}`}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className={`w-full border-b-2 py-2.5 text-lg outline-none transition-colors bg-transparent text-gray-900 
        ${error ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-[#001D4A]'}`}
    />
    {error && <p className="text-red-500 text-sm mt-1.5 font-medium">{error}</p>}
  </div>
);

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

export default function HouseBooking({ houseId, setView }) {
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpec, setSelectedSpec] = useState('standard');
  const [showModal, setShowModal] = useState(false);

  const [slipFile, setSlipFile] = useState(null);
  const [slipPreviewUrl, setSlipPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', birthDate: '', buildReason: '', idCard: '',
    currHouseNo: '', currSoiRoad: '', currProvince: '', currDistrict: '', currSubDistrict: '',
    buildSoi: '', buildRoad: '', buildProvince: '', buildDistrict: '', buildSubDistrict: '', expectedBuildDate: '',
    termsAccepted: false
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    async function fetchHouseDetail() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('house_models').select('*').eq('id', houseId).single();
        if (error) throw error;
        setHouse(data);
      } catch (error) {
        console.error("Error fetching house:", error.message);
      } finally {
        setLoading(false);
      }
    }
    if (houseId) fetchHouseDetail();
  }, [houseId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-[#001D4A]">กำลังโหลดข้อมูล...</div>;
  if (!house) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">ไม่พบข้อมูลบ้าน</div>;

  const currentPrice = selectedSpec === 'standard' ? house.price : house.price_premium;

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let inputValue = type === 'checkbox' ? checked : value;

    if (name === 'phone' || name === 'idCard') {
      inputValue = inputValue.replace(/\D/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: inputValue }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep2AndNext = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'กรุณากรอกชื่อ';
    if (!formData.lastName.trim()) errors.lastName = 'กรุณากรอกนามสกุล';
    if (formData.phone.length !== 10) errors.phone = 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก';
    if (!formData.birthDate) errors.birthDate = 'กรุณาเลือกวันเกิด';
    if (!formData.buildReason) errors.buildReason = 'กรุณาเลือกเหตุผลในการสร้างบ้าน';
    if (formData.idCard.length !== 13) errors.idCard = 'กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก';

    if (!formData.currHouseNo.trim()) errors.currHouseNo = 'กรุณากรอกบ้านเลขที่';
    if (!formData.currProvince) errors.currProvince = 'กรุณาเลือกจังหวัด';
    if (!formData.currDistrict.trim()) errors.currDistrict = 'กรุณากรอกอำเภอ/เขต';
    if (!formData.currSubDistrict.trim()) errors.currSubDistrict = 'กรุณากรอกตำบล/แขวง';

    if (!formData.buildProvince) errors.buildProvince = 'กรุณาเลือกจังหวัด';
    if (!formData.buildDistrict.trim()) errors.buildDistrict = 'กรุณากรอกอำเภอ/เขต';
    if (!formData.buildSubDistrict.trim()) errors.buildSubDistrict = 'กรุณากรอกตำบล/แขวง';
    if (!formData.expectedBuildDate) errors.expectedBuildDate = 'กรุณาเลือกวันที่คาดว่าจะสร้างบ้าน';

    if (!formData.termsAccepted) errors.termsAccepted = '* กรุณายอมรับข้อตกลงและเงื่อนไขการจองสร้างบ้าน';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    nextStep();
  };

  const handleSlipUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSlipFile(file);
      setSlipPreviewUrl(URL.createObjectURL(file));
      if (formErrors.slip) setFormErrors(prev => ({ ...prev, slip: null }));
    }
  };

  const submitBooking = async () => {
    if (!slipFile) {
      setFormErrors({ slip: 'กรุณาแนบสลิปการโอนเงินเพื่อยืนยันการจอง' });
      return;
    }

    setIsSubmitting(true);
    try {
      const fileExt = slipFile.name.split('.').pop();
      // 📍 ใส่โฟลเดอร์ bookings/
      const fileName = `bookings/slip_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage.from('payment_slips').upload(fileName, slipFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('payment_slips').getPublicUrl(fileName);

      const { data: { user } } = await supabase.auth.getUser();

      const { error: dbError } = await supabase.from('bookings').insert([{
        user_id: user?.id || null,
        house_id: house.id, house_title: house.title, spec_selected: selectedSpec, price: currentPrice,
        customer_firstname: formData.firstName, customer_lastname: formData.lastName, customer_phone: formData.phone, customer_birthdate: formData.birthDate,
        build_reason: formData.buildReason, id_card: formData.idCard,
        current_address: { houseNo: formData.currHouseNo, soiRoad: formData.currSoiRoad, province: formData.currProvince, district: formData.currDistrict, subDistrict: formData.currSubDistrict },
        build_address: { soi: formData.buildSoi, road: formData.buildRoad, province: formData.buildProvince, district: formData.buildDistrict, subDistrict: formData.buildSubDistrict },
        expected_build_date: formData.expectedBuildDate, slip_image_url: publicUrl, status: 'pending'
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

  const SummaryCard = ({ buttonText, onNext, onPrev }) => (
    <div className="lg:col-span-4 sticky top-10 flex justify-end z-10">
      <div className="bg-white p-7 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 w-full max-w-[340px]">
        <h3 className="text-[#001D4A] font-bold text-lg mb-1">Spec {selectedSpec === 'standard' ? 'Standard' : 'Premium'} {house.title}</h3>
        <p className="text-gray-400 font-semibold line-through text-sm mb-6">฿{currentPrice?.toLocaleString()}</p>
        <hr className="border-gray-200 mb-6" />
        <p className="text-gray-600 font-bold text-sm mb-2">ราคาจองสร้างบ้าน</p>
        <p className="text-4xl font-[900] text-[#E60000] tracking-tight mb-3">฿50,000</p>
        <p onClick={() => setShowModal(true)} className="text-gray-500 text-xs underline hover:text-[#E60000] cursor-pointer transition-colors mb-6">*เงื่อนไขการคืนเงินจองได้ค่าราคาจองบ้าน</p>
        <hr className="border-gray-200 mb-6" />
        <div className="flex flex-col gap-3">
          <button onClick={onNext} disabled={isSubmitting}
            className={`w-full py-3.5 font-bold rounded-xl transition-all text-base flex justify-center items-center gap-2 
              ${isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#001D4A] text-white hover:bg-blue-900 shadow-md'}`}>
            {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> กำลังประมวลผล...</> : buttonText}
          </button>
          <button onClick={onPrev} disabled={isSubmitting} className="w-full py-3.5 bg-white border border-gray-200 text-[#001D4A] font-bold rounded-xl hover:bg-gray-50 transition-colors text-base disabled:opacity-50">
            ย้อนกลับ
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-32 pt-10 font-sans">

      <div className="max-w-3xl mx-auto mb-16 px-6">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 -z-10"></div>
          {[{ num: 1, label: 'เลือกสเปค' }, { num: 2, label: 'กรอกข้อมูล' }, { num: 3, label: 'ชำระเงิน' }, { num: 4, label: 'ยืนยันการจอง' }].map((step) => (
            <div key={step.num} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep >= step.num ? 'bg-red-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                {currentStep > step.num ? <Check size={16} /> : step.num}
              </div>
              <span className={`text-xs font-bold ${currentStep >= step.num ? 'text-red-600' : 'text-gray-400'}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {currentStep === 1 && (
        <>
          <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h1 className="text-3xl font-[900] text-gray-900 mb-6 uppercase tracking-wider">{house.title}</h1>
              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white p-2">
                <img src={house.image_url} alt={house.title} className="w-full h-auto object-cover rounded-lg" />
              </div>
            </div>
            <div className="pt-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">เลือกสเปคบ้าน</h2>
              <p className="text-gray-500 text-sm mb-8">*คุณสามารถเลือกแบบบ้าน หรือสเปคใหม่ได้หลังการจอง</p>
              <div className="space-y-5">
                <div onClick={() => setSelectedSpec('standard')} className={`border-2 rounded-2xl p-6 cursor-pointer transition-all flex justify-between items-center relative ${selectedSpec === 'standard' ? 'border-red-500 bg-white shadow-lg' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <h3 className={`text-xl font-bold ${selectedSpec === 'standard' ? 'text-gray-900' : 'text-gray-600'}`}>Spec Standard</h3>
                  <p className={`text-2xl font-black ${selectedSpec === 'standard' ? 'text-gray-900' : 'text-gray-600'}`}>{house.price?.toLocaleString()} บาท</p>
                </div>
                <div onClick={() => setSelectedSpec('premium')} className={`border-2 rounded-2xl p-6 cursor-pointer transition-all flex justify-between items-center relative ${selectedSpec === 'premium' ? 'border-red-500 bg-white shadow-lg' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <h3 className={`text-xl font-bold ${selectedSpec === 'premium' ? 'text-gray-900' : 'text-gray-600'}`}>Spec Premium</h3>
                  <p className={`text-2xl font-black ${selectedSpec === 'premium' ? 'text-gray-900' : 'text-gray-600'}`}>{house.price_premium?.toLocaleString()} บาท</p>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
            <div className="max-w-6xl mx-auto px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-8 w-full sm:w-auto">
                <div className="hidden md:block border-r pr-8">
                  <p className="text-red-600 font-bold text-sm mb-1">Spec {selectedSpec === 'standard' ? 'Standard' : 'Premium'} {house.title}</p>
                  <p className="text-lg font-bold text-gray-400">{currentPrice?.toLocaleString()} บาท</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">ราคาจองสร้างบ้าน</p>
                  <p className="text-4xl font-bold text-red-600 tracking-tight">฿50,000</p>
                  <p onClick={() => setShowModal(true)} className="text-gray-500 text-sm mt-1 underline hover:text-red-600 cursor-pointer transition-colors">*เงื่อนไขการคืนเงินจองได้ค่าราคาจองบ้าน</p>
                </div>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <button onClick={() => setView('house-detail')} className="px-10 py-3.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors text-base">ย้อนกลับ</button>
                <button onClick={nextStep} className="px-14 py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md text-base">ถัดไป</button>
              </div>
            </div>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative">
          <div className="lg:col-span-8 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">

            <h2 className="text-2xl font-bold text-[#001D4A] mb-8 pb-4 border-b">ข้อมูลส่วนตัว</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
              <InputField label="ชื่อ*" name="firstName" value={formData.firstName} onChange={handleChange} error={formErrors.firstName} />
              <InputField label="นามสกุล*" name="lastName" value={formData.lastName} onChange={handleChange} error={formErrors.lastName} />
              <InputField label="เบอร์โทร*" name="phone" value={formData.phone} onChange={handleChange} maxLength="10" error={formErrors.phone} />

              {/* วันเกิด - แบบ Dropdown 3 ช่อง */}
              <div className="mb-6">
                <label className={`text-base font-medium block mb-2 ${formErrors.birthDate ? 'text-red-500' : 'text-gray-600'}`}>วันเกิด*</label>
                <div className="flex gap-3">
                  <select
                    value={formData.birthDate ? new Date(formData.birthDate).getDate() : ''}
                    onChange={(e) => {
                      const day = e.target.value;
                      const currentDate = formData.birthDate ? new Date(formData.birthDate) : new Date(2000, 0, 1);
                      const month = formData.birthDate ? currentDate.getMonth() : 0;
                      const year = formData.birthDate ? currentDate.getFullYear() : 2000;
                      const newDate = new Date(year, month, day);
                      handleChange({ target: { name: 'birthDate', value: newDate.toISOString().split('T')[0], type: 'text' } });
                    }}
                    className={`flex-1 border-b-2 py-2.5 text-lg outline-none bg-transparent cursor-pointer ${formErrors.birthDate ? 'border-red-500' : 'border-gray-300 focus:border-[#001D4A]'}`}
                  >
                    <option value="">วัน</option>
                    {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                  </select>
                  <select
                    value={formData.birthDate ? new Date(formData.birthDate).getMonth() : ''}
                    onChange={(e) => {
                      const month = parseInt(e.target.value);
                      const currentDate = formData.birthDate ? new Date(formData.birthDate) : new Date(2000, 0, 1);
                      const day = formData.birthDate ? currentDate.getDate() : 1;
                      const year = formData.birthDate ? currentDate.getFullYear() : 2000;
                      const newDate = new Date(year, month, day);
                      handleChange({ target: { name: 'birthDate', value: newDate.toISOString().split('T')[0], type: 'text' } });
                    }}
                    className={`flex-1 border-b-2 py-2.5 text-lg outline-none bg-transparent cursor-pointer ${formErrors.birthDate ? 'border-red-500' : 'border-gray-300 focus:border-[#001D4A]'}`}
                  >
                    <option value="">เดือน</option>
                    {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'].map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={formData.birthDate ? new Date(formData.birthDate).getFullYear() : ''}
                    onChange={(e) => {
                      const year = parseInt(e.target.value);
                      const currentDate = formData.birthDate ? new Date(formData.birthDate) : new Date(2000, 0, 1);
                      const day = formData.birthDate ? currentDate.getDate() : 1;
                      const month = formData.birthDate ? currentDate.getMonth() : 0;
                      const newDate = new Date(year, month, day);
                      handleChange({ target: { name: 'birthDate', value: newDate.toISOString().split('T')[0], type: 'text' } });
                    }}
                    className={`flex-1 border-b-2 py-2.5 text-lg outline-none bg-transparent cursor-pointer ${formErrors.birthDate ? 'border-red-500' : 'border-gray-300 focus:border-[#001D4A]'}`}
                  >
                    <option value="">ปี (พ.ศ.)</option>
                    {Array.from({ length: 80 }, (_, i) => {
                      const ceYear = new Date().getFullYear() - i;
                      return <option key={ceYear} value={ceYear}>พ.ศ. {ceYear + 543}</option>;
                    })}
                  </select>
                </div>
                {formErrors.birthDate && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.birthDate}</p>}
              </div>

              <div className="mb-6">
                <label className={`text-base font-medium block mb-2 ${formErrors.buildReason ? 'text-red-500' : 'text-gray-600'}`}>เหตุผลในการสร้างบ้าน*</label>
                <select name="buildReason" value={formData.buildReason} onChange={handleChange}
                  className={`w-full border-b-2 py-2.5 text-lg outline-none transition-colors bg-transparent text-gray-900 cursor-pointer 
                    ${formErrors.buildReason ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-[#001D4A]'}`}>
                  <option value="" disabled>เลือกเหตุผล</option>
                  <option value="สร้างบ้านหลังแรก">สร้างบ้านหลังแรก</option>
                  <option value="ขยับขยายครอบครัว">ขยับขยายครอบครัว</option>
                  <option value="สร้างให้พ่อแม่">สร้างให้พ่อแม่</option>
                  <option value="เพื่อการลงทุน">เพื่อการลงทุน</option>
                </select>
                {formErrors.buildReason && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.buildReason}</p>}
              </div>

              <InputField label="บัตรประชาชน/เลขประจำตัวผู้เสียภาษี*" name="idCard" value={formData.idCard} onChange={handleChange} maxLength="13" error={formErrors.idCard} />
            </div>

            <h2 className="text-2xl font-bold text-[#001D4A] mt-8 mb-8 pb-4 border-b">ที่อยู่ปัจจุบัน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
              <InputField label="บ้านเลขที่*" name="currHouseNo" value={formData.currHouseNo} onChange={handleChange} error={formErrors.currHouseNo} />
              <InputField label="ซอย, ถนน" name="currSoiRoad" value={formData.currSoiRoad} onChange={handleChange} />

              <div className="mb-6">
                <label className={`text-base font-medium block mb-2 ${formErrors.currProvince ? 'text-red-500' : 'text-gray-600'}`}>จังหวัด*</label>
                <select name="currProvince" value={formData.currProvince} onChange={handleChange}
                  className={`w-full border-b-2 py-2.5 text-lg outline-none transition-colors bg-transparent text-gray-900 cursor-pointer
                    ${formErrors.currProvince ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-[#001D4A]'}`}>
                  <option value="" disabled>เลือกจังหวัด</option>
                  {PROVINCES.map(prov => <option key={`curr-${prov}`} value={prov}>{prov}</option>)}
                </select>
                {formErrors.currProvince && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.currProvince}</p>}
              </div>

              <InputField label="อำเภอ, เขต*" name="currDistrict" value={formData.currDistrict} onChange={handleChange} error={formErrors.currDistrict} />
              <InputField label="ตำบล, แขวง*" name="currSubDistrict" value={formData.currSubDistrict} onChange={handleChange} error={formErrors.currSubDistrict} />
            </div>

            <h2 className="text-2xl font-bold text-[#001D4A] mt-8 mb-8 pb-4 border-b">สถานที่ก่อสร้าง</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
              <InputField label="ซอย" name="buildSoi" value={formData.buildSoi} onChange={handleChange} />
              <InputField label="ถนน" name="buildRoad" value={formData.buildRoad} onChange={handleChange} />

              <div className="mb-6">
                <label className={`text-base font-medium block mb-2 ${formErrors.buildProvince ? 'text-red-500' : 'text-gray-600'}`}>จังหวัด*</label>
                <select name="buildProvince" value={formData.buildProvince} onChange={handleChange}
                  className={`w-full border-b-2 py-2.5 text-lg outline-none transition-colors bg-transparent text-gray-900 cursor-pointer
                    ${formErrors.buildProvince ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-[#001D4A]'}`}>
                  <option value="" disabled>เลือกจังหวัด</option>
                  {PROVINCES.map(prov => <option key={`build-${prov}`} value={prov}>{prov}</option>)}
                </select>
                {formErrors.buildProvince && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.buildProvince}</p>}
              </div>

              <InputField label="อำเภอ, เขต*" name="buildDistrict" value={formData.buildDistrict} onChange={handleChange} error={formErrors.buildDistrict} />
              <InputField label="ตำบล, แขวง*" name="buildSubDistrict" value={formData.buildSubDistrict} onChange={handleChange} error={formErrors.buildSubDistrict} />
              <InputField label="วันที่คาดว่าจะสร้างบ้าน*" name="expectedBuildDate" type="date" value={formData.expectedBuildDate} onChange={handleChange} error={formErrors.expectedBuildDate} />
            </div>

            <div className="mt-8 pt-8 border-t flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="terms" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="w-6 h-6 accent-red-600 cursor-pointer" />
                <label htmlFor="terms" className={`text-base cursor-pointer select-none ${formErrors.termsAccepted ? 'text-red-500 font-bold' : 'text-gray-800'}`}>
                  ยอมรับ<span onClick={(e) => { e.preventDefault(); setShowModal(true); }} className="underline font-bold ml-1.5 hover:text-red-600 transition-colors text-[#001D4A]">ข้อตกลงและเงื่อนไขการจองสร้างบ้านออนไลน์</span>
                </label>
              </div>
              {formErrors.termsAccepted && <p className="text-red-500 text-sm font-medium">{formErrors.termsAccepted}</p>}
            </div>
          </div>

          <SummaryCard buttonText="ถัดไป" onNext={validateStep2AndNext} onPrev={prevStep} />
        </div>
      )}

      {currentStep === 3 && (
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <h2 className="text-2xl font-bold text-[#001D4A] mb-2">สแกน QR Code เพื่อชำระเงินจอง</h2>
              <p className="text-gray-500 mb-8 text-base">กรุณาสแกน QR Code ด้านล่างผ่านแอปพลิเคชันธนาคารของคุณ (รองรับทุกธนาคาร)</p>
              <div className="border border-gray-200 p-2 rounded-xl bg-gray-50 max-w-[340px] w-full shadow-sm mb-6">
                <img src="/images/QR.jpg" alt="Thai QR Payment" className="w-full h-auto rounded-lg object-contain" />
              </div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className={`text-xl font-bold mb-2 border-b pb-4 ${formErrors.slip ? 'text-red-500 border-red-100' : 'text-[#001D4A] border-gray-100'}`}>แนบหลักฐานการโอนเงิน (สลิป)*</h2>
              {!slipFile && !formErrors.slip && <p className="text-gray-500 text-base font-semibold mb-4 mt-4">* กรุณาอัปโหลดสลิปเพื่อทำการยืนยันการจอง</p>}
              {formErrors.slip && <p className="text-red-500 text-base font-bold mb-4 mt-4">{formErrors.slip}</p>}

              <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-colors relative overflow-hidden
                ${formErrors.slip ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                {slipPreviewUrl ? (
                  <img src={slipPreviewUrl} alt="Slip Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className={`w-12 h-12 mb-3 ${formErrors.slip ? 'text-red-400' : 'text-gray-400'}`} />
                    <p className="mb-2 text-base text-gray-500"><span className={`font-semibold ${formErrors.slip ? 'text-red-500' : 'text-[#001D4A]'}`}>คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวางที่นี่</p>
                    <p className="text-sm text-gray-400">PNG, JPG หรือ JPEG (สูงสุด 5MB)</p>
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
          <SummaryCard buttonText="ยืนยันการจอง" onNext={submitBooking} onPrev={prevStep} />
        </div>
      )}

      {currentStep === 4 && (
        <div className="max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-[32px] shadow-lg border border-gray-100 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"><CheckCircle2 size={40} /></div>
            <h2 className="text-3xl md:text-4xl font-[900] text-[#001D4A] mb-4">ทำรายการจองสำเร็จ!</h2>
            <p className="text-gray-500 text-lg">เราได้รับข้อมูลการจองและหลักฐานการชำระเงินของคุณเรียบร้อยแล้ว<br />เจ้าหน้าที่จะทำการตรวจสอบและติดต่อกลับภายใน 24 ชั่วโมง</p>
          </div>
          <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-200 mb-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100"><img src={house.image_url} alt={house.title} className="w-full h-auto object-cover rounded-xl" /></div>
            <div className="w-full md:w-2/3 space-y-4 w-full">
              <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">รายละเอียดการจอง</p><h3 className="text-2xl font-bold text-[#001D4A]">{house.title}</h3></div>
              <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                <div><p className="text-sm text-gray-500 mb-1">สเปคที่เลือก</p><p className="font-bold text-gray-800 text-lg">Spec {selectedSpec === 'standard' ? 'Standard' : 'Premium'}</p></div>
                <div><p className="text-sm text-gray-500 mb-1">ราคาก่อสร้าง</p><p className="font-bold text-gray-800 text-lg">{currentPrice?.toLocaleString()} บาท</p></div>
                <div className="col-span-2 bg-white p-5 rounded-2xl border border-gray-200 mt-2 flex justify-between items-center shadow-sm">
                  <span className="font-bold text-gray-600 text-lg">ยอดชำระเงินจอง</span><span className="text-3xl font-black text-[#E60000]">฿50,000</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button onClick={() => { setView('home'); window.scrollTo(0, 0); }} className="px-14 py-4 bg-[#001D4A] text-white font-bold rounded-full hover:bg-blue-800 transition-all shadow-md text-lg">กลับสู่หน้าหลัก</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-3xl relative shadow-2xl p-10 animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"><X size={20} /></button>
            <h2 className="text-3xl font-[900] text-center text-[#001D4A] mb-8 border-b pb-4">เงื่อนไขการคืนเงินจอง</h2>
            <div className="space-y-5 text-gray-600 leading-relaxed text-base md:text-lg">
              <p className="font-bold text-gray-800">เมื่อจองสร้างบ้านกับ SITTITHONGKAMDEE ลูกค้าสามารถยกเลิกจองได้ ตามเงื่อนไขดังนี้</p>
              <p>1. สามารถคืนเงินจอง หลังหักค่าธรรมเนียมบัตรเครดิต 3% และค่าดำเนินการปรับแบบและสำรวจที่ดิน (ถ้ามี) ในกรณีลูกค้ากู้ธนาคาร 2 ธนาคารขึ้นไป (เฉพาะวงเงินตามราคาบ้านจริง) ไม่ผ่านการอนุมัติ</p>
              <p>2. สามารถคืนเงินจอง หลังหักค่าธรรมเนียมบัตรเครดิต 3% และค่าดำเนินการปรับแบบและสำรวจที่ดิน (ถ้ามี) ในกรณีลูกค้าไม่สามารถสรุปซื้อที่ดินสำหรับปลูกสร้างบ้านได้ โดยให้ลูกค้าแจ้งความประสงค์ภายใน 60 วัน หลังจากการจอง</p>
              <p>3. สามารถคืนเงินจอง หลังหักค่าธรรมเนียมบัตรเครดิต 3% และค่าดำเนินการปรับแบบและสำรวจที่ดิน (ถ้ามี) ในกรณีลูกค้านำแบบมาเพื่อให้ประเมินราคา โดยผู้ว่าจ้างแจ้งเป็นลายลักษณ์อักษร หลังจากที่ได้รับทราบราคาบ้านจากฝ่ายประเมินราคาแล้วราคาเกินกว่าที่ระบุในใบจอง</p>
            </div>
            <div className="mt-10 text-center"><button onClick={() => setShowModal(false)} className="px-14 py-4 bg-[#001D4A] text-white font-bold rounded-full hover:bg-blue-800 transition-all text-lg">รับทราบ</button></div>
          </div>
        </div>
      )}
    </div>
  );
}