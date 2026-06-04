import { useState, useEffect } from 'react';
import { ArrowLeft, BedDouble, Bath, Car, Maximize, Ruler, Download, CheckCircle2 } from 'lucide-react';
import { supabase } from './supabase'; 

export default function HouseDetail({ houseId, setView }) {
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState(''); 
  const [activeExtraImg, setActiveExtraImg] = useState('');

  useEffect(() => {
    async function fetchHouseDetail() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('house_models')
          .select('*')
          .eq('id', houseId)
          .single();

        if (error) throw error;
        setHouse(data);
        
        if (data.plan_image) {
          setActiveTab('plan');
        } else if (data.extra_image || data.extra_image_2) {
          setActiveTab('gallery');
        } else {
          setActiveTab('none'); 
        }
        
        if (data.extra_image) setActiveExtraImg(data.extra_image);

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

  const extraImagesList = [house.extra_image, house.extra_image_2].filter(Boolean);
  const hasPlan = !!house.plan_image;
  const hasExtra = extraImagesList.length > 0;

  return (
    <div className="bg-white pb-28 relative">
      
      <div className="relative w-full h-[550px] bg-gray-100">
        <img src={house.image_url} alt={house.title} className="w-full h-full object-cover" />
        
        <div className="absolute top-1/2 -translate-y-1/2 right-0 bg-black/65 backdrop-blur-sm text-white p-10 min-w-[400px]">
          <p className="text-blue-400 font-bold tracking-widest text-sm uppercase mb-2">{house.style}</p>
          <h1 className="text-5xl font-bold mb-4">{house.title}</h1>
          
          <div className="mb-6">
            <p className="text-gray-300 text-sm font-semibold mb-1">ราคาเริ่มต้น</p>
            <p className="text-4xl font-black text-white">฿{house.price?.toLocaleString()}</p>
          </div>

          <div className="flex gap-8 border-t border-white/20 pt-6">
            <div className="text-center"><p className="text-2xl font-bold">{house.area}</p><p className="text-xs text-gray-400 uppercase mt-1">ตร.ม.</p></div>
            <div className="text-center"><p className="text-2xl font-bold">{house.bedrooms}</p><p className="text-xs text-gray-400 uppercase mt-1">ห้องนอน</p></div>
            <div className="text-center"><p className="text-2xl font-bold">{house.bathrooms}</p><p className="text-xs text-gray-400 uppercase mt-1">ห้องน้ำ</p></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-10">
        
        <button 
          onClick={() => {
            window.scrollTo(0, 0); // เลื่อนจอขึ้นบนสุด
            setView('service-models');
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-[#001D4A] font-bold transition-colors mb-10"
        >
          <ArrowLeft size={20} /> ย้อนกลับไปหน้าแบบบ้าน
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#001D4A] mb-6 border-l-[5px] border-blue-600 pl-4">ข้อมูลและสเปกบ้าน</h2>
              <div className="grid grid-cols-2 gap-y-8 gap-x-4 bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <div><p className="text-gray-400 text-sm font-semibold mb-1 flex items-center gap-2"><Ruler size={16}/> ขนาดตัวบ้าน</p><p className="text-xl font-bold text-[#001D4A]">{house.width} x {house.depth} ม.</p></div>
                <div><p className="text-gray-400 text-sm font-semibold mb-1 flex items-center gap-2"><Maximize size={16}/> พื้นที่ใช้สอย</p><p className="text-xl font-bold text-[#001D4A]">{house.area} ตร.ม.</p></div>
                <div><p className="text-gray-400 text-sm font-semibold mb-1 flex items-center gap-2"><BedDouble size={16}/> ห้องนอน</p><p className="text-xl font-bold text-[#001D4A]">{house.bedrooms} ห้อง</p></div>
                <div><p className="text-gray-400 text-sm font-semibold mb-1 flex items-center gap-2"><Bath size={16}/> ห้องน้ำ</p><p className="text-xl font-bold text-[#001D4A]">{house.bathrooms} ห้อง</p></div>
                <div><p className="text-gray-400 text-sm font-semibold mb-1 flex items-center gap-2"><Car size={16}/> จอดรถได้</p><p className="text-xl font-bold text-[#001D4A]">{house.parking} คัน</p></div>
                <div><p className="text-gray-400 text-sm font-semibold mb-1">สไตล์บ้าน</p><p className="text-xl font-bold text-[#001D4A]">{house.style}</p></div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-red-700 mb-5">ราคาก่อสร้าง</h3>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center text-lg text-[#001D4A]">
                  <span className="font-bold">Standard :</span>
                  <span className="font-semibold">{house.price?.toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between items-center text-lg text-[#001D4A]">
                  <span className="font-bold">Premium :</span>
                  <span className="font-semibold">{house.price_premium?.toLocaleString()} บาท</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6 h-10">
              <h2 className="text-3xl font-bold text-[#001D4A]">
                {activeTab === 'plan' ? 'แปลนบ้าน' : (activeTab === 'gallery' ? 'รูปเพิ่มเติม' : 'รูปภาพบ้าน')}
              </h2>
              
              {(hasPlan || hasExtra) && (
                <div className="flex bg-gray-100 p-1 rounded-full">
                  {hasPlan && (
                    <button 
                      onClick={() => setActiveTab('plan')}
                      className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'plan' ? 'bg-[#001D4A] text-white shadow-md' : 'text-gray-500 hover:text-[#001D4A]'}`}
                    >
                      แปลนบ้าน
                    </button>
                  )}
                  {hasExtra && (
                    <button 
                      onClick={() => { setActiveTab('gallery'); if(!activeExtraImg) setActiveExtraImg(extraImagesList[0]); }}
                      className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'gallery' ? 'bg-[#001D4A] text-white shadow-md' : 'text-gray-500 hover:text-[#001D4A]'}`}
                    >
                      รูปเพิ่มเติม
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex justify-center items-center h-[450px]">
              {activeTab === 'plan' && <img src={house.plan_image} alt="Floor Plan" className="max-h-full object-contain mix-blend-multiply" />}
              {activeTab === 'gallery' && <img src={activeExtraImg} alt="Extra View" className="max-h-full object-contain mix-blend-multiply transition-all duration-300" />}
              {activeTab === 'none' && <img src={house.image_url} alt="Main View" className="max-h-full object-contain mix-blend-multiply" />}
            </div>
            
            {activeTab === 'gallery' && extraImagesList.length > 1 && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                {extraImagesList.map((imgUrl, index) => (
                  <div 
                    key={index} 
                    onClick={() => setActiveExtraImg(imgUrl)}
                    className={`w-24 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeExtraImg === imgUrl ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-right">
              {house.plan_image && (
                <a 
                  href={house.plan_image} 
                  download={`Plan-${house.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-[#001D4A] transition-colors"
                >
                  <Download size={18} /> ดาวน์โหลดแปลนบ้าน
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">ราคาจองสร้างบ้าน</p>
            <p className="text-3xl font-bold text-red-600">฿50,000</p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button onClick={() => {
              window.scrollTo(0, 0); 
              setView('contact');
            }} className="px-8 py-4 bg-gray-100 text-[#001D4A] font-bold rounded-full hover:bg-gray-200 transition-colors">ปรึกษาผู้เชี่ยวชาญ</button>
            
            {/* ปุ่มนี้คือพระเอกของเราครับ เพิ่ม scrollTo ให้แล้ว */}
            <button 
              onClick={() => {
                window.scrollTo(0, 0); // เลื่อนจอขึ้นบนสุดก่อน
                setView('booking');    // แล้วค่อยสั่งสลับหน้า
              }} 
              className="px-10 py-4 bg-[#001D4A] text-white font-bold rounded-full hover:bg-blue-800 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={20} /> จองสร้างบ้านเลย
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}