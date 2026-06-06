import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import {
  User, ClipboardList, Clock, CheckCircle2, AlertCircle, Wrench,
  ArrowRight, Home, Loader2, Hammer, Search, Star, Calendar,
  ChevronDown, ChevronUp, Package, FileText, RefreshCw, BadgeCheck,
  XCircle, Edit3, Save, X, Phone, MessageCircle, MapPin, UserCheck,
  Shield, Bell, CreditCard, Settings, Trash2, AlertTriangle
} from 'lucide-react';

/* ─────────────────────────────────────────────
   CancelConfirmModal – โมดัลยืนยันยกเลิกการจอง
───────────────────────────────────────────── */
function CancelConfirmModal({ item, onClose, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm(item);
    setIsDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center border-2 border-red-100">
            <AlertTriangle size={38} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#001D4A] mb-2">ยืนยันยกเลิกการจอง</h2>
          <p className="text-lg text-gray-500 leading-relaxed">คุณต้องการยกเลิกรายการนี้ใช่หรือไม่?</p>
        </div>

        {/* Warning */}
        <div className="mx-8 mb-6 p-5 bg-red-50 rounded-2xl border border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle size={22} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-bold text-red-700 mb-1">⚠️ ข้อควรระวัง</p>
              <p className="text-base text-red-600 leading-relaxed">
                การยกเลิกการจองจะ<strong>ไม่สามารถคืนเงินมัดจำ</strong>ที่ชำระแล้วได้ กรุณาตรวจสอบให้แน่ใจก่อนยืนยัน
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mx-8 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-400 mb-1">รายการที่จะยกเลิก</p>
          <p className="text-lg font-bold text-[#001D4A]">{item._title}</p>
          <p className="text-base text-gray-500">{item._label}</p>
        </div>

        {/* Buttons */}
        <div className="px-8 pb-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 border-2 border-gray-200 rounded-2xl text-lg font-bold text-gray-500 hover:bg-gray-50 transition-colors">
            ไม่ยกเลิก
          </button>
          <button onClick={handleConfirm} disabled={isDeleting}
            className="flex-1 py-3.5 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-70">
            {isDeleting ? <><Loader2 size={20} className="animate-spin" /> กำลังยกเลิก...</> : <><Trash2 size={20} /> ยืนยันยกเลิก</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ProfileEditModal – โมดัลแก้ข้อมูลบัญชีผู้ใช้
───────────────────────────────────────────── */
function ProfileEditModal({ userEmail, onClose }) {
  const [form, setForm] = useState({ full_name: '', phone: '', line_id: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        setForm({ full_name: meta.full_name || '', phone: meta.phone || '', line_id: meta.line_id || '' });
        if (meta.avatar_url) setAvatarPreview(meta.avatar_url);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'phone' ? value.replace(/\D/g, '') : value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let avatar_url = avatarPreview;
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `avatars/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('profiles').upload(path, avatarFile, { upsert: true });
        if (!upErr) {
          const { data } = supabase.storage.from('profiles').getPublicUrl(path);
          avatar_url = data.publicUrl;
        }
      }
      const { error } = await supabase.auth.updateUser({ data: { ...form, avatar_url } });
      if (error) throw error;
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(form.full_name); }, 1500);
    } catch (e) { alert('เกิดข้อผิดพลาด: ' + e.message); }
    finally { setIsSaving(false); }
  };

  const Field = ({ icon, label, name, maxLength, placeholder, hint }) => (
    <div>
      <label className="text-base font-semibold text-[#001D4A] flex items-center gap-2 mb-2">{icon} {label}</label>
      <input name={name} value={form[name]} onChange={handleChange} maxLength={maxLength} placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-lg font-medium text-gray-800 bg-gray-50 focus:outline-none focus:border-[#001D4A] focus:bg-white transition-all placeholder-gray-400" />
      {hint && <p className="text-sm text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-8 pt-7 pb-6 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #001D4A 0%, #0a3170 100%)' }}>
          <button onClick={() => onClose(null)} className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Settings size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">แก้ไขข้อมูลบัญชี</h2>
              <p className="text-blue-300 text-base font-light mt-0.5">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 size={36} className="animate-spin text-[#001D4A]" /></div>
          ) : (
            <div className="space-y-5">
              {/* Avatar upload */}
              <div className="flex items-center gap-5">
                <div className="relative shrink-0 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center hover:border-[#001D4A] transition-colors">
                    {avatarPreview
                      ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                      : <User size={32} className="text-gray-400" />}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#001D4A] rounded-full flex items-center justify-center border-2 border-white">
                    <Edit3 size={12} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-base font-semibold text-[#001D4A]">รูปโปรไฟล์</p>
                  <p className="text-sm text-gray-400 mt-1">คลิกที่รูปเพื่อเปลี่ยน<br />รองรับ JPG, PNG ขนาดไม่เกิน 2MB</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              <Field icon={<User size={16} />} label="ชื่อ - นามสกุล" name="full_name" placeholder="กรอกชื่อ-นามสกุลของคุณ" />
              <div className="grid grid-cols-2 gap-4">
                <Field icon={<Phone size={16} />} label="เบอร์โทรศัพท์" name="phone" maxLength="10" placeholder="0xx-xxx-xxxx" hint="กรอกเฉพาะตัวเลข 10 หลัก" />
                <Field icon={<MessageCircle size={16} />} label="LINE ID" name="line_id" placeholder="@yourlineid" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-7 pt-4 border-t border-gray-100 flex gap-3">
          <button onClick={() => onClose(null)} className="flex-1 py-3.5 border-2 border-gray-200 rounded-2xl text-lg font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
            ยกเลิก
          </button>
          <button onClick={handleSave} disabled={isSaving || saved}
            className={`flex-1 py-3.5 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all ${saved ? 'bg-green-500 text-white' : 'bg-[#001D4A] text-white hover:bg-blue-900 shadow-lg'} disabled:opacity-70`}>
            {saved ? <><CheckCircle2 size={20} /> บันทึกสำเร็จ!</> : isSaving ? <><Loader2 size={20} className="animate-spin" /> กำลังบันทึก...</> : <><Save size={20} /> บันทึกข้อมูล</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main UserProfile Component
───────────────────────────────────────────── */
export default function UserProfile({ setView }) {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userMeta, setUserMeta] = useState({});
  const [allHistory, setAllHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [cancelItem, setCancelItem] = useState(null);

  useEffect(() => { fetchAllHistory(); }, []);

  const fetchAllHistory = async () => {
    setIsLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) { setView('home'); return; }

      setUserEmail(user.email);
      const meta = user.user_metadata || {};
      setUserMeta(meta);
      setUserName(meta.full_name || user.email?.split('@')[0] || 'ผู้ใช้งาน');

      const [repairsRes, bookingsRes, installsRes, evalsRes] = await Promise.all([
        supabase.from('repair_requests').select('*').eq('user_email', user.email).order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('install_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('eval_bookings').select('*').order('created_at', { ascending: false }),
      ]);

      const repairs = (repairsRes.data || []).map(r => ({ ...r, _type: 'repair', _label: 'แจ้งซ่อมแซม', _title: r.category || 'แจ้งซ่อม' }));
      const bookings = (bookingsRes.data || []).map(b => ({ ...b, _type: 'build', _label: 'จองสร้างบ้าน', _title: b.house_title || 'จองสร้างบ้าน' }));
      const installs = (installsRes.data || []).map(i => ({ ...i, _type: 'install', _label: 'ติดตั้ง/ต่อเติม', _title: i.service_title || 'จองติดตั้ง' }));
      const evals = (evalsRes.data || []).map(e => ({ ...e, _type: 'eval', _label: 'ประเมินและตรวจรับ', _title: e.service_type || 'จองประเมิน' }));

      const combined = [...repairs, ...bookings, ...installs, ...evals]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setAllHistory(combined);
    } catch (error) {
      console.error('Error fetching history:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = (newName) => {
    setShowEditModal(false);
    if (newName) { setUserName(newName); fetchAllHistory(); }
  };

  /* ── ยกเลิกการจอง ── */
  const handleCancelBooking = async (item) => {
    const TABLE_MAP = {
      repair: 'repair_requests',
      build: 'bookings',
      install: 'install_requests',
      eval: 'eval_bookings',
    };
    const table = TABLE_MAP[item._type];
    if (!table) return;

    try {
      const { error } = await supabase
        .from(table)
        .update({ status: 'rejected' })
        .eq('id', item.id);
      if (error) throw error;
      fetchAllHistory();
    } catch (e) {
      alert('เกิดข้อผิดพลาด: ' + e.message);
    }
  };

  const filtered = allHistory.filter(item => {
    const matchType = filterType === 'all' || item._type === filterType;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchSearch = !searchText || item._title?.toLowerCase().includes(searchText.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const getSafeId = (id) => id ? String(id).split('-')[0].toUpperCase() : 'N/A';

  const TYPE_CONFIG = {
    repair: { icon: <Wrench size={18} />, bg: 'bg-gray-50', text: 'text-[#001D4A]', border: 'border-gray-200', badge: 'bg-gray-100 text-[#001D4A]', bar: 'bg-[#001D4A]' },
    build: { icon: <Home size={18} />, bg: 'bg-gray-50', text: 'text-[#001D4A]', border: 'border-gray-200', badge: 'bg-gray-100 text-[#001D4A]', bar: 'bg-[#001D4A]' },
    install: { icon: <Hammer size={18} />, bg: 'bg-gray-50', text: 'text-[#001D4A]', border: 'border-gray-200', badge: 'bg-gray-100 text-[#001D4A]', bar: 'bg-blue-600' },
    eval: { icon: <FileText size={18} />, bg: 'bg-gray-50', text: 'text-[#001D4A]', border: 'border-gray-200', badge: 'bg-gray-100 text-[#001D4A]', bar: 'bg-blue-600' },
  };

  const getStatusBadge = (status) => {
    const base = 'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border';
    switch (status) {
      case 'evaluated': return <span className={`${base} bg-emerald-100 text-emerald-700 border-emerald-200`}><BadgeCheck size={14} />ประเมินราคาแล้ว</span>;
      case 'booked': return <span className={`${base} bg-blue-100 text-blue-700 border-blue-200`}><CheckCircle2 size={14} />จองคิวแล้ว</span>;
      case 'approved': return <span className={`${base} bg-green-100 text-green-700 border-green-200`}><CheckCircle2 size={14} />อนุมัติแล้ว</span>;
      case 'rejected': return <span className={`${base} bg-red-100 text-red-700 border-red-200`}><XCircle size={14} />ยกเลิก</span>;
      case 'completed': return <span className={`${base} bg-green-100 text-green-700 border-green-200`}><Star size={14} />เสร็จสมบูรณ์</span>;
      default: return <span className={`${base} bg-amber-100 text-amber-700 border-amber-200`}><Clock size={14} />รอดำเนินการ</span>;
    }
  };

  /* ── ปุ่มยกเลิกการจอง (ใช้ร่วมกันทุกประเภท) ── */
  const CancelButton = ({ item }) => {
    if (item.status === 'rejected' || item.status === 'completed') return null;
    return (
      <button onClick={() => setCancelItem(item)}
        className="w-full py-3.5 border-2 border-red-200 text-red-600 rounded-2xl font-bold text-base hover:bg-red-50 transition-all flex items-center justify-center gap-2 mt-3">
        <Trash2 size={16} /> ยกเลิกการจอง
      </button>
    );
  };

  const getItemDetails = (item) => {
    switch (item._type) {
      case 'repair': return (
        <div className="space-y-4">
          {item.description && (
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1.5">รายละเอียด</p>
              <p className="text-lg text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* สถานะการตอบกลับจากช่าง */}
          {!item.admin_reply && !item.admin_price && (
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-3">
                <Clock size={22} className="text-amber-500" />
                <div>
                  <p className="text-lg font-bold text-amber-700">รอการประเมินจากวิศวกร</p>
                  <p className="text-base text-amber-600 mt-1">ทีมงานจะตรวจสอบและตอบกลับภายใน 24 ชั่วโมง</p>
                </div>
              </div>
            </div>
          )}

          {item.admin_reply && (
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200">
              <p className="text-base font-bold text-blue-700 mb-2 flex items-center gap-2"><MessageCircle size={16} /> ข้อความจากวิศวกร</p>
              <p className="text-lg text-gray-700 leading-relaxed">{item.admin_reply}</p>
            </div>
          )}

          {item.admin_price && (
            <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-lg font-bold text-gray-600">ราคาประเมินเบื้องต้น</span>
              <span className="text-3xl font-black text-emerald-700">฿{Number(item.admin_price).toLocaleString()}</span>
            </div>
          )}

          {/* ถ้าประเมินเสร็จแล้ว → ปุ่มจองต่อ */}
          {item.status === 'evaluated' && (
            <button onClick={() => setView('repair-booking', { id: item.id, category: item.category, price: item.admin_price })}
              className="w-full py-4 bg-[#001D4A] text-white rounded-2xl font-bold text-lg hover:bg-blue-900 transition-all flex items-center justify-center gap-2 shadow-lg mt-2">
              ยอมรับราคาและดำเนินการจองต่อ <ArrowRight size={18} />
            </button>
          )}

          <CancelButton item={item} />
        </div>
      );
      case 'build': return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {item.spec_selected && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">สเปค</p><p className="text-lg font-bold text-gray-800 capitalize">{item.spec_selected}</p></div>}
            {item.price && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">ราคาก่อสร้าง</p><p className="text-lg font-bold text-gray-800">฿{Number(item.price).toLocaleString()}</p></div>}
            {item.customer_firstname && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">ชื่อผู้จอง</p><p className="text-lg font-bold text-gray-800">{item.customer_firstname} {item.customer_lastname}</p></div>}
            {item.customer_phone && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">เบอร์โทร</p><p className="text-lg font-bold text-gray-800">{item.customer_phone}</p></div>}
          </div>
          <div className="flex items-center justify-between p-5 bg-red-50 rounded-2xl border border-red-100">
            <span className="text-lg font-bold text-gray-600">ยอดจองชำระแล้ว</span>
            <span className="text-3xl font-black text-red-600">฿50,000</span>
          </div>
          <CancelButton item={item} />
        </div>
      );
      case 'install': return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {item.customer_name && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">ชื่อผู้จอง</p><p className="text-lg font-bold text-gray-800">{item.customer_name}</p></div>}
            {item.customer_phone && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">เบอร์โทร</p><p className="text-lg font-bold text-gray-800">{item.customer_phone}</p></div>}
            {item.appointment_date && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">วันนัดหมาย</p><p className="text-lg font-bold text-gray-800">{new Date(item.appointment_date).toLocaleDateString('th-TH')}</p></div>}
            {item.province && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">จังหวัด</p><p className="text-lg font-bold text-gray-800">{item.province}</p></div>}
          </div>
          {item.deposit_amount && (
            <div className="flex items-center justify-between p-5 bg-purple-50 rounded-2xl border border-purple-100">
              <span className="text-lg font-bold text-gray-600">มัดจำชำระแล้ว (30%)</span>
              <span className="text-3xl font-black text-purple-700">฿{Number(item.deposit_amount).toLocaleString()}</span>
            </div>
          )}
          <CancelButton item={item} />
        </div>
      );
      case 'eval': return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {item.customer_name && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">ชื่อผู้จอง</p><p className="text-lg font-bold text-gray-800">{item.customer_name}</p></div>}
            {item.phone && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">เบอร์โทร</p><p className="text-lg font-bold text-gray-800">{item.phone}</p></div>}
            {item.project_name && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">โครงการ</p><p className="text-lg font-bold text-gray-800">{item.project_name}</p></div>}
            {item.booking_date && <div className="p-4 bg-white rounded-xl border border-gray-100"><p className="text-sm text-gray-400 mb-1">วันนัดหมาย</p><p className="text-lg font-bold text-gray-800">{new Date(item.booking_date).toLocaleDateString('th-TH')}</p></div>}
          </div>
          <CancelButton item={item} />
        </div>
      );
      default: return null;
    }
  };

  const stats = {
    total: allHistory.length,
    pending: allHistory.filter(i => !i.status || i.status === 'pending').length,
    done: allHistory.filter(i => ['approved', 'booked', 'evaluated', 'completed'].includes(i.status)).length,
  };

  const TYPE_FILTERS = [
    { key: 'all', label: 'ทั้งหมด', icon: <Package size={16} /> },
    { key: 'repair', label: 'ซ่อมแซม', icon: <Wrench size={16} /> },
    { key: 'build', label: 'สร้างบ้าน', icon: <Home size={16} /> },
    { key: 'install', label: 'ติดตั้ง', icon: <Hammer size={16} /> },
    { key: 'eval', label: 'ประเมิน', icon: <FileText size={16} /> },
  ];

  const STATUS_FILTERS = [
    { key: 'all', label: 'ทุกสถานะ' },
    { key: 'pending', label: 'รอดำเนินการ' },
    { key: 'evaluated', label: 'ประเมินแล้ว' },
    { key: 'booked', label: 'จองแล้ว' },
    { key: 'approved', label: 'อนุมัติ' },
  ];

  return (
    <div className="min-h-screen pb-24 bg-gray-50" style={{ fontFamily: "'Prompt', sans-serif" }}>

      {/* ── Hero Header — About-style blackout image ── */}
      <div className="relative h-[340px] overflow-hidden flex items-end">
        <img
          src="/images/about.avif"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.35]"
          alt="Profile Background"
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-8 pb-14">
          <div className="flex flex-col md:flex-row items-end gap-8">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30"
                style={{ backdropFilter: 'blur(12px)' }}>
                {userMeta.avatar_url
                  ? <img src={userMeta.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-white/10 flex items-center justify-center"><User size={44} className="text-white/80" /></div>
                }
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
            </div>

            {/* Info + Edit btn */}
            <div className="flex-1 pb-1">
              <p className="text-blue-300 text-sm font-semibold uppercase tracking-[0.3em] mb-1.5">บัญชีของฉัน</p>
              <h1 className="text-5xl font-bold text-white leading-tight mb-1">{userName || 'ผู้ใช้งาน'}</h1>
              <p className="text-blue-200/80 text-base font-light mb-4">{userEmail}</p>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {userMeta.phone && (
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-blue-100 bg-white/10 border border-white/15">
                    <Phone size={13} /> {userMeta.phone}
                  </span>
                )}
                {userMeta.line_id && (
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-blue-100 bg-white/10 border border-white/15">
                    <MessageCircle size={13} /> LINE: {userMeta.line_id}
                  </span>
                )}
              </div>

              <button onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all">
                <Edit3 size={16} /> แก้ไขข้อมูลบัญชี
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-3 shrink-0 pb-1">
              {[
                { label: 'รายการทั้งหมด', value: stats.total, color: 'text-white' },
                { label: 'รอดำเนินการ', value: stats.pending, color: 'text-amber-300' },
                { label: 'สำเร็จแล้ว', value: stats.done, color: 'text-emerald-400' },
              ].map((s, i) => (
                <div key={i} className="text-center px-6 py-5 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-sm">
                  <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-blue-300/80 font-medium mt-1.5 whitespace-nowrap">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rounded white mask — same as About */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-50 rounded-t-[40px]" />
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6" style={{ background: 'inherit' }}>

        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          {/* Type filters */}
          <div className="flex gap-2 flex-wrap mb-4">
            {TYPE_FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilterType(f.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-base font-bold transition-all ${filterType === f.key ? 'bg-[#001D4A] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          {/* Status + Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex gap-2 flex-wrap">
              {STATUS_FILTERS.map(s => (
                <button key={s.key} onClick={() => setFilterStatus(s.key)}
                  className={`px-5 py-2.5 rounded-xl text-base font-semibold transition-all ${filterStatus === s.key ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="ค้นหา..." value={searchText} onChange={e => setSearchText(e.target.value)}
                  className="pl-10 pr-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:border-[#001D4A] bg-gray-50 w-48" />
              </div>
              <button onClick={fetchAllHistory} className="flex items-center gap-2 px-5 py-3 rounded-xl text-base font-bold text-gray-500 hover:text-[#001D4A] hover:bg-gray-100 transition-all border border-gray-200">
                <RefreshCw size={16} /> รีเฟรช
              </button>
            </div>
          </div>
        </div>

        {/* ── History Table ── */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <Loader2 size={48} className="text-[#001D4A] animate-spin mb-5" />
            <p className="text-gray-500 text-xl font-medium">กำลังโหลดประวัติของคุณ...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-28 h-28 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-100">
              <ClipboardList size={44} className="text-gray-300" />
            </div>
            <h3 className="text-3xl font-bold text-[#001D4A] mb-3">ไม่พบรายการ</h3>
            <p className="text-gray-400 text-lg mb-8 font-light">ลองเปลี่ยนตัวกรองหรือเริ่มใช้บริการของเรา</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => setView('service-repair')} className="px-8 py-3.5 bg-[#001D4A] text-white rounded-full font-bold text-lg hover:bg-blue-900 transition-colors shadow-md">แจ้งซ่อม</button>
              <button onClick={() => setView('service-models')} className="px-8 py-3.5 border-2 border-[#001D4A] text-[#001D4A] rounded-full font-bold text-lg hover:bg-blue-50 transition-colors">จองสร้างบ้าน</button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="col-span-1 text-sm font-semibold text-gray-400 uppercase tracking-wider">รหัส</div>
              <div className="col-span-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">ชื่อรายการ</div>
              <div className="col-span-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">ประเภท</div>
              <div className="col-span-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">วันที่</div>
              <div className="col-span-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">สถานะ</div>
              <div className="col-span-1" />
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const c = TYPE_CONFIG[item._type] || {};
                const isExpanded = expandedId === item.id;
                return (
                  <div key={`${item._type}-${item.id}`}
                    className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-gray-50/60'}`}>
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-6 py-5 items-start md:items-center">

                      {/* ID */}
                      <div className="col-span-1 flex items-center gap-2 shrink-0">
                        <div className={`w-1.5 h-9 rounded-full ${c.bar}`} />
                        <span className="text-sm font-bold text-gray-400 font-mono tracking-wide">{getSafeId(item.id)}</span>
                      </div>

                      {/* Icon + Title */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gray-100 text-[#001D4A]">
                          {c.icon}
                        </div>
                        <div>
                          <p className="text-base font-bold text-[#001D4A] line-clamp-1">{item._title}</p>
                          <p className="text-sm text-gray-400 md:hidden">{new Date(item.created_at).toLocaleDateString('th-TH')}</p>
                        </div>
                      </div>

                      {/* Type badge */}
                      <div className="col-span-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-[#001D4A] whitespace-nowrap">
                          {c.icon} {item._label}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="col-span-2 hidden md:flex items-center gap-1.5 text-base text-gray-500 font-medium">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>

                      {/* Status */}
                      <div className="col-span-2">{getStatusBadge(item.status)}</div>

                      {/* Expand */}
                      <div className="col-span-1 flex justify-end">
                        <button onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-[#001D4A] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 mx-6 mb-6 pt-5">
                        <div className="rounded-2xl p-5 bg-gray-50 border border-gray-200">
                          {getItemDetails(item)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <p className="text-center text-lg text-gray-400 mt-6 font-light">
            แสดง <span className="font-bold text-gray-600">{filtered.length}</span> รายการ
            จากทั้งหมด <span className="font-bold text-gray-600">{allHistory.length}</span> รายการ
          </p>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {showEditModal && <ProfileEditModal userEmail={userEmail} onClose={handleModalClose} />}

      {/* ── Cancel Confirm Modal ── */}
      {cancelItem && <CancelConfirmModal item={cancelItem} onClose={() => setCancelItem(null)} onConfirm={handleCancelBooking} />}
    </div>
  );
}