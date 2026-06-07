import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Search, ChevronRight, PenTool, LayoutGrid, Home, Sun, Grid, Blinds, Loader2 } from 'lucide-react';

const categories = [
  { id: 'ทั้งหมด', icon: <LayoutGrid size={18} /> },
  { id: 'ต่อเติมโครงสร้าง', icon: <Home size={18} /> },
  { id: 'งานพื้นและตกแต่ง', icon: <Blinds size={18} /> },
  { id: 'งานภายนอก', icon: <Grid size={18} /> },
  { id: 'พลังงานแสงอาทิตย์', icon: <Sun size={18} /> }
];

export default function ServiceInstall({ onViewDetail, setView }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertModal, setAlertModal] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('install_services')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error("Error fetching install services:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchCategory = activeCategory === 'ทั้งหมด' || service.category === activeCategory;
    const matchSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleViewDetailClick = async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAlertModal(true);
      return;
    }
    if (onViewDetail) onViewDetail(id);
  };

  return (
    <div className="bg-white min-h-screen pb-32 font-sans">
      <div className="relative h-[400px] overflow-hidden flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
          alt="Home Extension and Installation"
        />
        <div className="relative z-10 text-center text-white px-4 space-y-4">
          <h1 className="text-6xl font-bold tracking-wide mb-2">บริการติดตั้งและต่อเติม</h1>
          <p className="text-gray-300 text-lg font-light tracking-widest uppercase opacity-90">
            อัปเกรดบ้านของคุณให้สมบูรณ์แบบ ด้วยทีมช่างผู้เชี่ยวชาญมาตรฐานสากล
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300
                  ${activeCategory === cat.id
                    ? 'bg-[#001D4A] text-white shadow-md transform scale-105'
                    : 'bg-white text-gray-500 hover:bg-blue-50 border border-gray-200'}`}
              >
                {cat.icon} {cat.id}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="ค้นหาบริการ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full outline-none focus:border-[#001D4A] transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <Loader2 size={48} className="animate-spin mb-4" />
            <p className="font-bold text-xl">กำลังโหลดข้อมูลบริการ...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredServices.map((service) => {
                const formatPrice = (val) => Number(val || 0).toLocaleString();
                const isFree = Number(service.survey_fee || 0) === 0;

                return (
                  <div
                    key={service.id}
                    onClick={() => handleViewDetailClick(service.id)}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/800x600?text=No+Image+Found"; }}
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#001D4A]">
                        {service.category}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-[#001D4A] mb-4 line-clamp-2 leading-tight min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>

                      <div className="mt-auto">
                        <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-xs font-bold mb-4">
                          {isFree ? 'ฟรีค่าสำรวจ' : `ค่าสำรวจ ${formatPrice(service.survey_fee)} บาท`}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">ราคาเริ่มต้น</span>
                          <div className="flex items-baseline gap-1 text-[#001D4A]">
                            <span className="text-3xl font-[900] tracking-tight text-[#001D4A]">
                              {formatPrice(service.price)} บาท
                            </span>
                            <span className="text-sm font-semibold text-gray-500">
                              / {service.unit}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-xs font-semibold text-gray-400">ดูรายละเอียดเพิ่มเติม</span>
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#001D4A] group-hover:text-white transition-colors">
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-20">
                <PenTool size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">ไม่พบบริการในหมวดหมู่นี้</h3>
                <p className="text-gray-500">กรุณาลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่ใหม่อีกครั้ง</p>
              </div>
            )}
          </>
        )}
      </div>

      {alertModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden text-center p-8">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center border-2 border-red-100">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 4a8 8 0 100 16A8 8 0 0012 4z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-[#001D4A] mb-2">กรุณาเข้าสู่ระบบ</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">คุณต้องเข้าสู่ระบบก่อนเพื่อดูรายละเอียดและใช้งานระบบต่างๆของเรา</p>
            <button
              onClick={() => { setAlertModal(false); setView('login'); }}
              className="w-full py-3.5 rounded-full font-bold text-base text-white bg-[#001D4A] hover:bg-blue-900 transition-colors shadow-md"
            >
              ไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}