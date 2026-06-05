import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { ChevronRight, Building, Home, Loader2, DollarSign, ArrowLeft } from 'lucide-react';

export default function ServiceEval({ setView }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    async function fetchEval() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('eval_services').select('*');
        if (error) throw error;
        setServices(data || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEval();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#001D4A]" size={48} /></div>;

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80" className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" alt="Hero" />
        <div className="relative z-10 text-center text-white px-4 space-y-4">
          <h1 className="text-6xl font-bold tracking-wide">บริการประเมินและตรวจรับ</h1>
          <p className="text-gray-300 text-lg font-light tracking-widest uppercase pt-1">มืออาชีพตัวจริง เพื่อบ้านที่คุณรัก</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[40px]"></div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-10">
        {!selectedService ? (
          <div className="animate-in fade-in duration-500 space-y-6">
            {services.map(s => (
              <div key={s.id} onClick={() => { setSelectedService(s); setSelectedOption(s.options[0]); }} className="p-8 rounded-2xl border border-gray-100 hover:border-[#001D4A] cursor-pointer flex items-center justify-between transition-all group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-50 text-[#001D4A] rounded-2xl flex items-center justify-center">{s.title.includes('ตรวจรับ') ? <Building size={28}/> : <Home size={28}/>}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#001D4A] mb-1">{s.title}</h2>
                    <p className="text-gray-500 font-light text-base">{s.description}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-[#001D4A]" size={24}/>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <button onClick={() => setSelectedService(null)} className="mb-8 flex items-center gap-2 font-bold text-gray-400 hover:text-[#001D4A]"><ArrowLeft size={18}/> ย้อนกลับ</button>
            <h2 className="text-4xl font-bold text-[#001D4A] mb-8">{selectedService.title}</h2>
            <div className="grid gap-4 mb-10">
              {selectedService.options.map((opt, i) => (
                <div key={i} onClick={() => setSelectedOption(opt)} className={`p-6 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${selectedOption?.label === opt.label ? 'border-[#001D4A] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <span className="font-bold text-[#001D4A] text-lg">{opt.label}</span>
                  <span className="font-black text-xl text-red-600">฿{opt.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#001D4A] text-white p-8 rounded-2xl flex justify-between items-center shadow-lg">
              <div>
                <p className="opacity-70 text-xs font-bold mb-1 uppercase tracking-wider">ราคารวมเริ่มต้น</p>
                <p className="text-3xl font-bold">฿{selectedOption?.price.toLocaleString()}</p>
              </div>
              {/* 📍 จุดสำคัญ: เรียกไปที่ 'eval-booking' ตรงนี้ครับ */}
              <button onClick={() => setView('eval-booking', selectedOption)} className="bg-white text-[#001D4A] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all flex items-center gap-2">
                จองคิวประเมิน <DollarSign size={18}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}