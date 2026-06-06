import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Wrench, 
  Hammer, 
  ClipboardCheck, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  X,
  User,
  FileText,
  Plus,
  Edit,
  Trash2,
  CreditCard,
  UploadCloud,
  Loader2,
  AlertTriangle,
  MapPin,
  Image as ImageIcon,
  MessageSquare,
  DollarSign,
  Eye 
} from 'lucide-react';
import { supabase } from './supabase';

export default function AdminDashboard({ setView }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [subTab, setSubTab] = useState('bookings'); 
  const [repairSubTab, setRepairSubTab] = useState('requests'); 
  
  // Real Data States
  const [bookings, setBookings] = useState([]); 
  const [houseModels, setHouseModels] = useState([]);
  
  // 📍 แยกระบบซ่อมเป็น 2 ตาราง
  const [repairRequests, setRepairRequests] = useState([]); 
  const [repairBookings, setRepairBookings] = useState([]); 

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  
  // Modal Control States
  const [selectedBooking, setSelectedBooking] = useState(null); 
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);

  // States สำหรับ ระบบซ่อมบ้าน
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [repairForm, setRepairForm] = useState({ status: 'pending', admin_price: '', admin_reply: '' });

  // States สำหรับ Custom Alert / Confirm
  const [feedbackModal, setFeedbackModal] = useState(null); 
  const [confirmModal, setConfirmModal] = useState(null); 

  const [imageFile, setImageFile] = useState(null);
  const [planFile, setPlanFile] = useState(null);

  const [modelForm, setModelForm] = useState({
    title: '', style: 'modern', price: '', price_premium: '',
    area: '', floors: '1', bedrooms: '', bathrooms: '',
    parking: '', width: '', depth: '', image_url: '', plan_image: ''
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('home');
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
    }
  };

  const fetchHouseModels = async () => {
    try {
      const { data, error } = await supabase.from('house_models').select('*').order('title', { ascending: true });
      if (error) throw error;
      setHouseModels(data || []);
    } catch (error) {
      console.error('Error fetching house models:', error.message);
    }
  };

  // 📍 ดึงข้อมูลระบบซ่อม 2 ตาราง
  const fetchRepairs = async () => {
    try {
      const { data: reqData, error: reqErr } = await supabase.from('repair_requests').select('*').order('created_at', { ascending: false });
      if (reqErr) throw reqErr;
      
      const { data: bookData, error: bookErr } = await supabase.from('repair_bookings').select('*, repair_requests(*)').order('created_at', { ascending: false });
      if (bookErr) throw bookErr;

      setRepairRequests(reqData || []);
      setRepairBookings(bookData || []);
    } catch (error) {
      console.error('Error fetching repairs:', error.message);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchBookings(), fetchHouseModels(), fetchRepairs()]).finally(() => setIsLoading(false));
  }, []);

  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
      setFeedbackModal({ 
        type: 'success', 
        title: 'อัปเดตสถานะสำเร็จ!', 
        message: 'ระบบได้บันทึกการเปลี่ยนแปลงสถานะการจองเรียบร้อยแล้ว' 
      });
    } catch (error) {
      setFeedbackModal({ type: 'error', title: 'เกิดข้อผิดพลาด', message: error.message });
    }
  };

  // 📍 จัดการบันทึกสถานะงานซ่อมแบบแยกตาราง
  const handleUpdateRepair = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (selectedRepair.type === 'request') {
        const { error } = await supabase.from('repair_requests').update({
          status: repairForm.status,
          admin_price: repairForm.admin_price,
          admin_reply: repairForm.admin_reply
        }).eq('id', selectedRepair.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('repair_bookings').update({
          status: repairForm.status
        }).eq('id', selectedRepair.id);
        if (error) throw error;
      }

      setFeedbackModal({ 
        type: 'success', 
        title: 'บันทึกการทำงานสำเร็จ!', 
        message: 'ระบบได้ทำการบันทึกข้อมูลและอัปเดตสถานะงานเรียบร้อยแล้ว' 
      });
      setSelectedRepair(null);
      fetchRepairs(); 
    } catch (error) {
      setFeedbackModal({ type: 'error', title: 'บันทึกไม่สำเร็จ', message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  // 📍 เปิด Modal ให้ถูกประเภท
  const handleOpenRepairModal = (item, type) => {
    setSelectedRepair({ ...item, type });
    if (type === 'request') {
      setRepairForm({
        status: item.status || 'pending_eval',
        admin_price: item.admin_price || '',
        admin_reply: item.admin_reply || ''
      });
    } else {
      setRepairForm({
        status: item.status || 'pending_payment',
        admin_price: item.repair_requests?.admin_price || '',
        admin_reply: item.repair_requests?.admin_reply || ''
      });
    }
  };

  const handleOpenAddModal = () => {
    setEditingModel(null);
    setImageFile(null); 
    setPlanFile(null);  
    setModelForm({
      title: '', style: 'modern', price: '', price_premium: '',
      area: '', floors: '1', bedrooms: '', bathrooms: '',
      parking: '', width: '', depth: '', image_url: '', plan_image: ''
    });
    setIsModelModalOpen(true);
  };

  const handleOpenEditModal = (model) => {
    setEditingModel(model);
    setImageFile(null); 
    setPlanFile(null);  
    setModelForm({
      title: model.title || '', style: model.style || 'modern', price: model.price || '',
      price_premium: model.price_premium || '', area: model.area || '', floors: model.floors || '1',
      bedrooms: model.bedrooms || '', bathrooms: model.bathrooms || '', parking: model.parking || '',
      width: model.width || '', depth: model.depth || '', image_url: model.image_url || '',
      plan_image: model.plan_image || ''
    });
    setIsModelModalOpen(true);
  };

  const uploadImageToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`; 
    const { error: uploadError } = await supabase.storage.from('house_images').upload(filePath, file);
    if (uploadError) throw new Error(`อัปโหลดรูปภาพไม่สำเร็จ: ${uploadError.message}`);
    const { data } = supabase.storage.from('house_images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSaveModel = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImageUrl = modelForm.image_url;
      let finalPlanUrl = modelForm.plan_image;

      if (imageFile) finalImageUrl = await uploadImageToSupabase(imageFile);
      if (planFile) finalPlanUrl = await uploadImageToSupabase(planFile);

      const finalDataToSave = { ...modelForm, image_url: finalImageUrl, plan_image: finalPlanUrl };

      if (editingModel) {
        const { error } = await supabase.from('house_models').update(finalDataToSave).eq('id', editingModel.id);
        if (error) throw error;
        setFeedbackModal({ type: 'success', title: 'บันทึกข้อมูลสำเร็จ', message: 'อัปเดตข้อมูลแบบบ้านและรูปภาพเรียบร้อยแล้ว' });
      } else {
        const { error } = await supabase.from('house_models').insert([finalDataToSave]);
        if (error) throw error;
        setFeedbackModal({ type: 'success', title: 'เพิ่มแบบบ้านสำเร็จ', message: 'เพิ่มแบบบ้านใหม่เข้าสู่คลังสินค้าเรียบร้อยแล้ว' });
      }
      setIsModelModalOpen(false);
      fetchHouseModels();
    } catch (error) {
      setFeedbackModal({ type: 'error', title: 'บันทึกข้อมูลไม่สำเร็จ', message: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteModel = (id, title) => {
    setConfirmModal({
      title: 'ยืนยันการลบข้อมูล',
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบแบบบ้านรหัส ${title} ออกจากระบบ? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('house_models').delete().eq('id', id);
          if (error) throw error;
          fetchHouseModels();
          setFeedbackModal({ type: 'success', title: 'ลบข้อมูลสำเร็จ', message: `ลบแบบบ้าน ${title} ออกจากระบบเรียบร้อยแล้ว` });
        } catch (error) {
          setFeedbackModal({ type: 'error', title: 'ลบข้อมูลไม่สำเร็จ', message: error.message });
        } finally {
          setConfirmModal(null); 
        }
      }
    });
  };

  const StatusBadge = ({ status }) => {
    if (status === 'approved' || status === 'evaluated') return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> {status === 'evaluated' ? 'ประเมินแล้ว' : 'ตรวจสอบแล้ว'}</span>;
    if (status === 'rejected') return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1 w-fit"><X size={12}/> ไม่ผ่าน/ยกเลิก</span>;
    if (status === 'booked') return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> จองคิวแล้ว</span>;
    return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1 w-fit"><AlertCircle size={12}/> รอดำเนินการ</span>;
  };

  // 📍 แก้ไขให้รองรับการดึงรูปภาพแบบ Array โดยตรง
  const parseImages = (imageStr) => {
    if (!imageStr) return [];
    if (Array.isArray(imageStr)) return imageStr; // กรณีข้อมูลมาเป็น Array อยู่แล้ว
    try {
      return JSON.parse(imageStr);
    } catch {
      return typeof imageStr === 'string' && imageStr.startsWith('http') ? [imageStr] : [];
    }
  };

  // 📍 ซ่อนรายการขอประเมินที่ถูกจองแล้วออกไป
  const pendingRequests = repairRequests.filter(r => r.status !== 'booked');

  const stats = [
    { title: "คำสั่งจองสร้างบ้าน", count: bookings.length, icon: Home, color: "bg-blue-50 text-blue-600" },
    { title: "แจ้งซ่อมบ้าน", count: pendingRequests.length, icon: Wrench, color: "bg-amber-50 text-amber-600" },
    { title: "จองคิวซ่อม/ตรวจสลิป", count: repairBookings.length, icon: Hammer, color: "bg-purple-50 text-purple-600" },
    { title: "นัดประเมินหน้างาน", count: 5, icon: ClipboardCheck, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 relative">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#001D4A] text-white flex flex-col justify-between p-6 sticky top-0 h-screen shadow-xl z-10">
        <div>
          <div className="mb-10 px-2">
            <h1 className="text-xl font-black tracking-widest text-white">SITTITHONGKAMDEE</h1>
            <p className="text-[10px] text-blue-300 font-light tracking-[0.2em] uppercase mt-1">ADMIN MANAGEMENT</p>
          </div>

          <nav className="space-y-2">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all ${activeTab === 'overview' ? 'bg-white/10 text-white shadow-inner font-bold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
              <LayoutDashboard size={18} /> ภาพรวมระบบ (Overview)
            </button>
            <div className="pt-6 pb-2 text-[11px] font-semibold text-blue-300 uppercase tracking-[0.15em] px-4 opacity-80">ระบบและบริการ</div>
            <button onClick={() => setActiveTab('models')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all ${activeTab === 'models' ? 'bg-white/10 text-white shadow-inner font-bold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
              <Home size={18} /> 1. แบบบ้านและการจอง
            </button>
            <button onClick={() => setActiveTab('repairs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all ${activeTab === 'repairs' ? 'bg-white/10 text-white shadow-inner font-bold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
              <Wrench size={18} /> 2. ระบบซ่อมบ้าน
            </button>
            <button onClick={() => setActiveTab('extensions')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide text-gray-300 hover:bg-white/5 hover:text-white"><Hammer size={18} /> 3. ระบบติดตั้ง/ต่อเติม</button>
            <button onClick={() => setActiveTab('evaluations')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide text-gray-300 hover:bg-white/5 hover:text-white"><ClipboardCheck size={18} /> 4. ระบบจ้างประเมินบ้าน</button>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium tracking-wide transition-colors">
          <LogOut size={18} /> ออกจากระบบแอดมิน
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto max-w-7xl mx-auto w-full z-0">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-[#001D4A] tracking-wide">
              {activeTab === 'overview' && 'แดชบอร์ดภาพรวมคิวงาน'}
              {activeTab === 'models' && 'การจัดการแบบบ้านและการจองสร้างบ้าน'}
              {activeTab === 'repairs' && 'ระบบรับแจ้งซ่อมแซมและบำรุงรักษา'}
            </h2>
            <p className="text-sm text-gray-400 font-light tracking-wide mt-1">ยินดีต้อนรับกลับมา, ผู้ดูแลระบบสูงสุด</p>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{item.title}</p>
                    <p className="text-4xl font-black text-[#001D4A] mt-2 tracking-tight">{item.count}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${item.color}`}><item.icon size={24} /></div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-[#001D4A] mb-5 flex items-center gap-2 tracking-wide">
                <Clock size={20} className="text-amber-500" /> คำขอล่าสุดที่รอการตรวจสอบ (ระบบจองสร้างบ้านใหม่)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-widest">
                      <th className="pb-3 pl-2">ชื่อลูกค้า</th>
                      <th className="pb-3">รหัสแบบบ้าน</th>
                      <th className="pb-3">สถานะ</th>
                      <th className="pb-3 text-right pr-2">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="text-base font-light text-gray-600 divide-y divide-gray-50">
                    {bookings.slice(0, 3).map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 pl-2 font-normal text-gray-700">{booking.customer_firstname} {booking.customer_lastname}</td>
                        <td className="py-4 font-semibold text-[#001D4A]">{booking.house_title}</td>
                        <td className="py-4"><StatusBadge status={booking.status} /></td>
                        <td className="py-4 text-right pr-2">
                          <button onClick={() => { setSelectedBooking(booking); setActiveTab('models'); setSubTab('bookings'); }} className="text-xs bg-[#001D4A] text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-900 transition-colors">ดูรายละเอียด</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ระบบแบบบ้านและการจอง */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <div className="flex border-b border-gray-200">
              <button onClick={() => setSubTab('bookings')} className={`px-6 py-3 font-semibold text-sm tracking-wide border-b-2 transition-all ${subTab === 'bookings' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                รายการจองจากลูกค้า ({bookings.length})
              </button>
              <button onClick={() => setSubTab('manage-models')} className={`px-6 py-3 font-semibold text-sm tracking-wide border-b-2 transition-all ${subTab === 'manage-models' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                จัดการคลังแบบบ้านโมเดล ({houseModels.length})
              </button>
            </div>

            {subTab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-widest">
                        <th className="pb-3 pl-2">วันที่ยื่นเรื่อง</th>
                        <th className="pb-3">รหัสแบบบ้าน</th>
                        <th className="pb-3">ชื่อลูกค้า</th>
                        <th className="pb-3">สถานะตรวจสอบ</th>
                        <th className="pb-3 text-right pr-2">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="text-base font-light text-gray-600 divide-y divide-gray-50">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 pl-2 font-normal text-gray-500">{booking.created_at ? new Date(booking.created_at).toLocaleDateString('th-TH') : '---'}</td>
                          <td className="py-4 font-semibold text-[#001D4A] tracking-wide">{booking.house_title}</td>
                          <td className="py-4 font-normal text-gray-700">{booking.customer_firstname} {booking.customer_lastname}</td>
                          <td className="py-4"><StatusBadge status={booking.status} /></td>
                          <td className="py-4 text-right pr-2">
                            <button onClick={() => setSelectedBooking(booking)} className="text-xs bg-[#001D4A] text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-sm">ตรวจสอบ / อนุมัติ</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {subTab === 'manage-models' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400 font-light">จัดการคลังแบบบ้านมาตรฐาน</p>
                  <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-[#001D4A] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-900 transition-colors shadow-sm">
                    <Plus size={16} /> เพิ่มแบบบ้านใหม่
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-widest">
                        <th className="pb-3 pl-2">รูปภาพ</th>
                        <th className="pb-3">รหัสแบบบ้าน</th>
                        <th className="pb-3">ราคาเริ่มต้น</th>
                        <th className="pb-3 text-right pr-2">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="text-base font-light text-gray-600 divide-y divide-gray-50">
                      {houseModels.map((model) => (
                        <tr key={model.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 pl-2"><img src={model.image_url} alt={model.title} className="w-16 h-10 object-cover rounded-lg border border-gray-100 shadow-sm" /></td>
                          <td className="py-3 font-bold text-[#001D4A]">{model.title}</td>
                          <td className="py-3 font-semibold text-red-600">฿{Number(model.price).toLocaleString()}</td>
                          <td className="py-3 text-right pr-2 space-x-2">
                            <button onClick={() => handleOpenEditModal(model)} className="inline-flex items-center gap-1 text-xs bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg font-semibold transition-colors"><Edit size={12} /> แก้ไข</button>
                            <button onClick={() => handleDeleteModel(model.id, model.title)} className="inline-flex items-center gap-1 text-xs bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 px-3 py-1.5 rounded-lg font-semibold transition-colors"><Trash2 size={12} /> ลบ</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 📍 TAB 2: ระบบแจ้งซ่อม */}
        {activeTab === 'repairs' && (
          <div className="space-y-6">
            
            <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setRepairSubTab('requests')} 
                className={`px-6 py-3 font-semibold text-sm tracking-wide border-b-2 transition-all ${repairSubTab === 'requests' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                1. คำขอประเมินราคาเบื้องต้น ({pendingRequests.length})
              </button>
              <button 
                onClick={() => setRepairSubTab('bookings')} 
                className={`px-6 py-3 font-semibold text-sm tracking-wide border-b-2 transition-all ${repairSubTab === 'bookings' ? 'border-[#001D4A] text-[#001D4A]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                2. รายการจองคิวซ่อม & ตรวจสอบสลิป ({repairBookings.length})
              </button>
            </div>

            {/* Sub-tab 1: ขอประเมินราคา (ไม่มีสลิป) */}
            {repairSubTab === 'requests' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-[fadeInScale_0.15s_ease-out]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-widest">
                        <th className="pb-3 pl-2">วันที่แจ้งเรื่อง</th>
                        <th className="pb-3">ประเภทงานซ่อม</th>
                        <th className="pb-3">อาการความเสียหาย</th>
                        <th className="pb-3">ราคาประเมิน</th>
                        <th className="pb-3 text-right pr-2">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="text-base font-light text-gray-600 divide-y divide-gray-50">
                      {isLoading ? (
                        <tr><td colSpan="5" className="py-8 text-center text-gray-400">กำลังโหลดข้อมูล...</td></tr>
                      ) : pendingRequests.length === 0 ? (
                        <tr><td colSpan="5" className="py-8 text-center text-gray-400">ไม่มีคำขอที่รอการประเมินราคาในระบบ</td></tr>
                      ) : (
                        pendingRequests.map((repair) => (
                          <tr key={repair.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 pl-2 text-gray-500">{new Date(repair.created_at).toLocaleDateString('th-TH')}</td>
                            <td className="py-4 font-semibold text-[#001D4A]">{repair.category}</td>
                            <td className="py-4 max-w-[200px] truncate text-gray-500">{repair.description}</td>
                            <td className="py-4 font-bold text-blue-600">
                               {repair.admin_price ? `฿${Number(repair.admin_price).toLocaleString()}` : <StatusBadge status={repair.status}/>}
                            </td>
                            <td className="py-4 text-right pr-2">
                              <button onClick={() => handleOpenRepairModal(repair, 'request')} className="text-xs bg-[#001D4A] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-sm">
                                ประเมิน / ตอบกลับ
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab 2: รายการจองคิวซ่อม (มีสลิปมัดจำแล้ว) */}
            {repairSubTab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-[fadeInScale_0.15s_ease-out]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-widest">
                        <th className="pb-3 pl-2">วันที่ต้องการให้เข้าซ่อม</th>
                        <th className="pb-3">ประเภทงานซ่อม</th>
                        <th className="pb-3">ชื่อลูกค้า</th>
                        <th className="pb-3">สถานะอนุมัติ</th>
                        <th className="pb-3 text-right pr-2">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="text-base font-light text-gray-600 divide-y divide-gray-50">
                      {isLoading ? (
                        <tr><td colSpan="5" className="py-8 text-center text-gray-400">กำลังโหลดข้อมูล...</td></tr>
                      ) : repairBookings.length === 0 ? (
                        <tr><td colSpan="5" className="py-8 text-center text-gray-400">ยังไม่มีประวัติการจองคิวและแนบสลิปเข้ามา</td></tr>
                      ) : (
                        repairBookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 pl-2 font-normal text-gray-500">{booking.repair_date ? new Date(booking.repair_date).toLocaleDateString('th-TH') : '---'}</td>
                            <td className="py-4 font-semibold text-[#001D4A]">{booking.repair_requests?.category}</td>
                            <td className="py-4 font-normal text-gray-700">{booking.customer_name}</td>
                            <td className="py-4"><StatusBadge status={booking.status} /></td>
                            <td className="py-4 text-right pr-2">
                              <button onClick={() => handleOpenRepairModal(booking, 'booking')} className="text-xs bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm">
                                ตรวจสอบสลิปและคิวช่าง
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* MODAL 1: รายละเอียดข้อมูลการจองสร้างบ้านใหม่ */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 flex flex-col">
            <div className="bg-[#001D4A] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold tracking-wide">ตรวจสอบการจอง: {selectedBooking.house_title}</h3>
                <p className="text-xs text-blue-200 font-light mt-1 tracking-wide">ID: {selectedBooking.id}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full"><X size={18} /></button>
            </div>
            
            <div className="p-8 space-y-5 overflow-y-auto max-h-[70vh] font-light text-gray-600">
              <div className="space-y-4 border-b border-gray-100 pb-5">
                <h4 className="text-sm font-semibold text-[#001D4A] uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={16} className="text-blue-600" /> ข้อมูลการชำระเงินและการตรวจสอบ
                </h4>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <span className="text-xs text-gray-400 block font-normal mb-1">สลิปหลักฐานโอนเงิน</span>
                    {selectedBooking.slip_image_url ? (
                      <a href={selectedBooking.slip_image_url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline hover:text-blue-800 transition-colors">คลิกดูรูปสลิป</a>
                    ) : (
                      <span className="text-gray-400 italic">ไม่มีไฟล์แนบ</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-normal mb-1">ปรับสถานะการตรวจสอบ</span>
                    <select 
                      value={selectedBooking.status || 'pending'} 
                      onChange={(e) => handleUpdateBookingStatus(selectedBooking.id, e.target.value)}
                      className={`w-full text-sm font-semibold rounded-lg px-3 py-2 border outline-none cursor-pointer transition-colors
                        ${selectedBooking.status === 'approved' ? 'bg-green-50 border-green-200 text-green-700' : 
                          selectedBooking.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-700' : 
                          'bg-amber-50 border-amber-200 text-amber-700'}`}
                    >
                      <option value="pending">รอดำเนินการ</option>
                      <option value="approved">ตรวจสอบแล้ว (อนุมัติ)</option>
                      <option value="rejected">ไม่ผ่าน / ยกเลิก</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-b border-gray-100 pb-4">
                <h4 className="text-sm font-semibold text-[#001D4A] flex items-center gap-2"><User size={16} /> ข้อมูลลูกค้า</h4>
                <div className="grid grid-cols-2 gap-2 pl-6">
                  <p className="text-gray-800 font-normal">ชื่อ: {selectedBooking.customer_firstname} {selectedBooking.customer_lastname}</p>
                  <p className="text-gray-800 font-mono">เบอร์โทร: {selectedBooking.customer_phone}</p>
                  <p className="text-gray-800 col-span-2">เลขบัตรประชาชน: {selectedBooking.id_card}</p>
                </div>
              </div>

              <div className="space-y-3 pb-2">
                <h4 className="text-sm font-semibold text-[#001D4A] flex items-center gap-2"><FileText size={16} /> ข้อมูลบ้านที่จะสร้าง</h4>
                <p className="pl-6 text-gray-800">รหัสแบบบ้าน: <span className="font-bold text-[#001D4A]">{selectedBooking.house_title}</span> ({selectedBooking.spec_selected})</p>
                <p className="pl-6 text-gray-800">ราคา: ฿{Number(selectedBooking.price).toLocaleString()}</p>
                <p className="pl-6 text-gray-800">เหตุผลที่ปลูกสร้าง: {selectedBooking.build_reason}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ฟอร์ม เพิ่ม / แก้ไข MODEL แบบบ้าน */}
      {isModelModalOpen && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col my-8">
            <div className="bg-[#001D4A] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-wide">{editingModel ? `แก้ไขแบบบ้านรหัส: ${editingModel.title}` : 'เพิ่มแบบบ้านมาตรฐานใหม่'}</h3>
              <button onClick={() => setIsModelModalOpen(false)} className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveModel} className="p-8 space-y-5 overflow-y-auto max-h-[75vh] text-sm font-light text-gray-600">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block font-semibold mb-1">รหัสแบบบ้าน (Title)</label><input type="text" className="w-full border rounded-xl px-4 py-2.5 outline-none" value={modelForm.title} onChange={e => setModelForm({...modelForm, title: e.target.value})} required /></div>
                <div>
                  <label className="block font-semibold mb-1">สไตล์</label>
                  <select className="w-full border rounded-xl px-4 py-2.5 outline-none" value={modelForm.style} onChange={e => setModelForm({...modelForm, style: e.target.value})}>
                    <option value="modern">Modern</option><option value="contemporary">Contemporary</option><option value="classic">Classic</option>
                  </select>
                </div>
                <div><label className="block font-semibold mb-1">ราคาเริ่มต้น (บาท)</label><input type="number" className="w-full border rounded-xl px-4 py-2.5 outline-none" value={modelForm.price} onChange={e => setModelForm({...modelForm, price: e.target.value})} required /></div>
                <div><label className="block font-semibold mb-1">ราคาพรีเมียม (บาท)</label><input type="number" className="w-full border rounded-xl px-4 py-2.5 outline-none" value={modelForm.price_premium} onChange={e => setModelForm({...modelForm, price_premium: e.target.value})} /></div>
                <div><label className="block font-semibold mb-1">พื้นที่ใช้สอย (ตร.ม.)</label><input type="number" className="w-full border rounded-xl px-4 py-2.5 outline-none" value={modelForm.area} onChange={e => setModelForm({...modelForm, area: e.target.value})} required /></div>
                <div><label className="block font-semibold mb-1">จำนวนชั้น</label><input type="number" className="w-full border rounded-xl px-4 py-2.5 outline-none" value={modelForm.floors} onChange={e => setModelForm({...modelForm, floors: e.target.value})} required /></div>
                <div><label className="block font-semibold mb-1">ห้องนอน</label><input type="number" className="w-full border rounded-xl px-4 py-2.5 outline-none" value={modelForm.bedrooms} onChange={e => setModelForm({...modelForm, bedrooms: e.target.value})} required /></div>
                <div><label className="block font-semibold mb-1">ห้องน้ำ</label><input type="number" className="w-full border rounded-xl px-4 py-2.5 outline-none" value={modelForm.bathrooms} onChange={e => setModelForm({...modelForm, bathrooms: e.target.value})} required /></div>
                <div><label className="block font-semibold mb-1">ที่จอดรถ</label><input type="number" className="w-full border rounded-xl px-4 py-2.5 outline-none" value={modelForm.parking} onChange={e => setModelForm({...modelForm, parking: e.target.value})} required /></div>
                <div><label className="block font-semibold mb-1">หน้ากว้างขั้นต่ำ (ม.)</label><input type="number" step="0.1" className="w-full border rounded-xl px-4 py-2.5 outline-none" value={modelForm.width} onChange={e => setModelForm({...modelForm, width: e.target.value})} /></div>
                
                <div className="col-span-2">
                  <label className="block font-semibold mb-1 flex items-center gap-1"><UploadCloud size={16}/> ภาพหลักตัวบ้าน</label>
                  <input type="file" accept="image/*" className="w-full border rounded-xl px-4 py-2 outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" onChange={e => setImageFile(e.target.files[0])} required={!editingModel} />
                  {editingModel && modelForm.image_url && !imageFile && (<p className="text-xs text-blue-600 mt-2 font-semibold">✓ ใช้ภาพหลักเดิมที่มีอยู่ในระบบแล้ว</p>)}
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold mb-1 flex items-center gap-1"><UploadCloud size={16}/> ภาพแปลนบ้าน</label>
                  <input type="file" accept="image/*" className="w-full border rounded-xl px-4 py-2 outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" onChange={e => setPlanFile(e.target.files[0])} />
                  {editingModel && modelForm.plan_image && !planFile && (<p className="text-xs text-blue-600 mt-2 font-semibold">✓ ใช้ภาพแปลนเดิมที่มีอยู่ในระบบแล้ว</p>)}
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModelModalOpen(false)} disabled={isSaving} className="px-5 py-2.5 bg-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50">ยกเลิก</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-[#001D4A] text-white rounded-xl font-semibold hover:bg-blue-900 disabled:opacity-70 flex items-center gap-2">
                  {isSaving ? <><Loader2 size={16} className="animate-spin" /> กำลังอัปโหลด...</> : 'บันทึกข้อมูล'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- 📍 MODAL: งานซ่อมแซม ---------------- */}
      {selectedRepair && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden border border-gray-100 flex flex-col animate-[fadeInScale_0.2s_ease-out]">
            
            {/* Header Modal */}
            <div className="bg-[#001D4A] p-6 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold tracking-wide flex items-center gap-2">
                  <Wrench size={22} /> {selectedRepair.type === 'booking' ? 'ตรวจสอบคิวงานและสลิปจองซ่อมแซม' : 'ประเมินราคางานแจ้งซ่อม'}
                </h3>
                <p className="text-xs text-blue-200 font-light mt-1 tracking-wide">ID รายการ: {selectedRepair.id}</p>
              </div>
              <button onClick={() => setSelectedRepair(null)} className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full transition-colors"><X size={18} /></button>
            </div>
            
            <div className="p-8 flex flex-col lg:flex-row gap-8 overflow-y-auto max-h-[75vh]">
              
              {/* 📍 ฝั่งซ้าย: ข้อมูลลูกค้า (ปรับสีให้สวยขึ้น) */}
              <div className="flex-1 space-y-6">
                
                {/* 1. สลิปมัดจำ (ถ้ามี) */}
                {selectedRepair.type === 'booking' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-5 rounded-2xl shadow-sm">
                    <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                      <CreditCard size={18} className="text-green-600" /> หลักฐานการชำระเงินมัดจำ
                    </h4>
                    <div className="space-y-3">
                      <p className="text-sm text-green-700 font-medium bg-white px-3 py-1.5 rounded-lg border border-green-200 w-fit flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 size={16}/> ตรวจพบสลิปการโอนเงินแล้ว
                      </p>
                      <div className="relative max-w-[220px] aspect-[3/4] overflow-hidden rounded-xl border-2 border-green-200 shadow-md group bg-white">
                        <img src={selectedRepair.slip_image_url} alt="Deposit Slip" className="w-full h-full object-cover" />
                        <a href={selectedRepair.slip_image_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-bold gap-2 transition-all">
                          <Eye size={18} /> ดูรูปขนาดเต็ม
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ข้อมูลติดต่อหน้างาน */}
                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                  <h4 className="text-sm font-bold text-[#001D4A] flex items-center gap-2 mb-4 pb-2 border-b border-blue-200/50">
                    <User size={18} className="text-blue-600" /> ข้อมูลติดต่อหน้างาน
                  </h4>
                  <div className="space-y-2.5">
                    {selectedRepair.type === 'booking' ? (
                      <>
                        <p className="text-gray-700 flex items-center gap-2"><span className="text-blue-400 font-medium w-24">ชื่อผู้แจ้ง:</span> <span className="font-semibold text-[#001D4A]">{selectedRepair.customer_name}</span></p>
                        <p className="text-gray-700 flex items-center gap-2"><span className="text-blue-400 font-medium w-24">เบอร์โทร:</span> <span className="font-mono text-[#001D4A]">{selectedRepair.customer_phone}</span></p>
                        <div className="text-gray-700 flex items-start gap-2 mt-1">
                          <span className="text-blue-400 font-medium w-24 shrink-0">สถานที่ซ่อม:</span>
                          <span className="leading-relaxed font-medium bg-white px-3 py-1.5 rounded-lg border border-blue-50 shadow-sm">{selectedRepair.address} จ.{selectedRepair.province}</span>
                        </div>
                        <p className="text-gray-700 flex items-center gap-2 mt-1"><span className="text-blue-400 font-medium w-24">วันที่เข้าซ่อม:</span> <span className="font-semibold text-[#001D4A] bg-blue-100/50 px-2 py-1 rounded-md">{new Date(selectedRepair.repair_date).toLocaleDateString('th-TH')}</span></p>
                      </>
                    ) : (
                      <p className="text-gray-500 italic text-sm py-2 text-center bg-white/50 rounded-lg border border-dashed border-gray-200">ลูกค้ายื่นขอประเมินราคา (ยังไม่ถึงขั้นตอนระบุที่อยู่และเบอร์โทร)</p>
                    )}
                  </div>
                </div>

                {/* 3. อาการ/จุดเสียหาย */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 p-5 rounded-2xl border border-amber-100 shadow-sm">
                  <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-3">
                    <FileText size={18} className="text-amber-600" /> อาการ/จุดเสียหายที่ระบุ
                  </h4>
                  <div className="bg-white/60 p-4 rounded-xl text-amber-950 leading-relaxed font-medium border border-amber-50 shadow-inner">
                    {selectedRepair.type === 'booking' ? selectedRepair.repair_requests?.description : selectedRepair.description}
                  </div>
                </div>

                {/* 4. รูปภาพหน้างาน */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="text-sm font-bold text-[#001D4A] flex items-center gap-2 mb-4">
                    <ImageIcon size={18} className="text-blue-500" /> รูปภาพหน้างานจริง
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {parseImages(selectedRepair.type === 'booking' ? selectedRepair.repair_requests?.images : selectedRepair.images).map((img, idx) => (
                      <a key={idx} href={img} target="_blank" rel="noreferrer" className="block relative aspect-square overflow-hidden rounded-xl border-2 border-gray-100 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group">
                        <img src={img} alt={`Repair ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" size={24} />
                        </div>
                      </a>
                    ))}
                    {parseImages(selectedRepair.type === 'booking' ? selectedRepair.repair_requests?.images : selectedRepair.images).length === 0 && (
                      <div className="col-span-3 text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <ImageIcon className="mx-auto text-gray-300 mb-2" size={32}/>
                        <p className="text-sm text-gray-400">ลูกค้าไม่ได้แนบรูปภาพมาด้วย</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ฝั่งขวา: ฟอร์มของแอดมิน (คงเดิม) */}
              <div className="w-full lg:w-[400px] shrink-0">
                <form onSubmit={handleUpdateRepair} className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl space-y-5 h-full flex flex-col shadow-sm">
                  <div>
                    <h3 className="text-lg font-bold text-[#001D4A] mb-1">ส่วนจัดการของแอดมิน</h3>
                    <p className="text-xs text-gray-500 font-light mb-4">
                      {selectedRepair.type === 'booking' ? 'อัปเดตสถานะคิวงานหลังเช็คสลิปมัดจำ' : 'พิมพ์ราคาและข้อความตอบกลับส่งให้ลูกค้าพิจารณา'}
                    </p>
                  </div>

                  {selectedRepair.type === 'request' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-[#001D4A] mb-2 flex items-center gap-1"><DollarSign size={16}/> ราคาประเมินเบื้องต้น (บาท)</label>
                        <input 
                          type="number" 
                          placeholder="กรอกราคาประเมิน..."
                          value={repairForm.admin_price}
                          onChange={e => setRepairForm({...repairForm, admin_price: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-blue-200 outline-none focus:border-[#001D4A] focus:ring-1 focus:ring-[#001D4A] text-lg font-semibold text-[#001D4A] shadow-sm" 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#001D4A] mb-2 flex items-center gap-1"><MessageSquare size={16}/> ข้อความตอบกลับของช่าง</label>
                        <textarea 
                          rows="4"
                          placeholder="อธิบายอาการ หรือข้อตกลงหน้างานเพิ่มเติมให้ลูกค้าทราบ..."
                          value={repairForm.admin_reply}
                          onChange={e => setRepairForm({...repairForm, admin_reply: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-blue-200 outline-none focus:border-[#001D4A] focus:ring-1 focus:ring-[#001D4A] text-sm text-gray-700 resize-none leading-relaxed shadow-sm" 
                        />
                      </div>
                    </>
                  )}

                  {selectedRepair.type === 'booking' && selectedRepair.repair_requests?.admin_price && (
                    <div className="bg-white p-5 rounded-2xl border border-blue-100 mb-2 shadow-sm">
                      <p className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-wider">ราคาที่ประเมินไว้</p>
                      <p className="text-3xl font-black text-[#001D4A]">฿{Number(selectedRepair.repair_requests.admin_price).toLocaleString()}</p>
                    </div>
                  )}

                  <div className="flex-1 mt-2">
                    <label className="block text-sm font-semibold text-[#001D4A] mb-2">
                      {selectedRepair.type === 'booking' ? 'อัปเดตสถานะคิวงาน' : 'อัปเดตสถานะการประเมิน'}
                    </label>
                    <select 
                      value={repairForm.status} 
                      onChange={e => setRepairForm({...repairForm, status: e.target.value})}
                      className={`w-full text-sm font-bold rounded-xl px-4 py-3.5 border outline-none cursor-pointer transition-colors shadow-sm
                        ${repairForm.status === 'approved' ? 'bg-green-100 border-green-300 text-green-800' : 
                          repairForm.status === 'rejected' ? 'bg-red-100 border-red-300 text-red-800' : 
                          'bg-amber-100 border-amber-300 text-amber-800'}`}
                    >
                      {selectedRepair.type === 'booking' ? (
                        <>
                          <option value="pending_payment">รอตรวจสอบสลิปมัดจำ</option>
                          <option value="approved">ตรวจสอบสลิปถูกต้อง / อนุมัติคิวช่าง</option>
                          <option value="rejected">สลิปไม่ถูกต้อง / ยกเลิกคิวงาน</option>
                        </>
                      ) : (
                        <>
                          <option value="pending_eval">รอการประเมินราคาจากช่าง</option>
                          <option value="evaluated">ประเมินและส่งราคาให้ลูกค้าแล้ว</option>
                          <option value="rejected">ไม่สามารถรับงานได้ / ยกเลิก</option>
                        </>
                      )}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full mt-6 py-4 bg-[#001D4A] text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
                  >
                    {isSaving ? <><Loader2 size={20} className="animate-spin"/> กำลังบันทึก...</> : 'บันทึกการตรวจสอบ'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL แจ้งเตือน */}
      {feedbackModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner ${feedbackModal.type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
              {feedbackModal.type === 'success' ? <CheckCircle2 size={40} strokeWidth={2.5} /> : <X size={40} strokeWidth={2.5} />}
            </div>
            <h3 className="text-2xl font-bold text-[#001D4A] tracking-wide mb-2">{feedbackModal.title}</h3>
            <p className="text-gray-500 text-base font-light leading-relaxed mb-8">{feedbackModal.message}</p>
            <button onClick={() => setFeedbackModal(null)} className={`w-full py-3.5 rounded-full font-semibold tracking-wide text-sm text-white transition-all shadow-md hover:shadow-lg ${feedbackModal.type === 'success' ? 'bg-[#001D4A] hover:bg-blue-900' : 'bg-red-500 hover:bg-red-600'}`}>ตกลง</button>
          </div>
        </div>
      )}

      {/* MODAL Confirm */}
      {confirmModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner bg-amber-100 text-amber-500">
              <AlertTriangle size={40} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-[#001D4A] tracking-wide mb-2">{confirmModal.title}</h3>
            <p className="text-gray-500 text-base font-light leading-relaxed mb-8">{confirmModal.message}</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmModal(null)} className="flex-1 py-3.5 rounded-full font-semibold tracking-wide text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all shadow-sm">ยกเลิก</button>
              <button onClick={confirmModal.onConfirm} className="flex-1 py-3.5 rounded-full font-semibold tracking-wide text-sm bg-red-500 text-white hover:bg-red-600 transition-all shadow-md">ยืนยันลบ</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}