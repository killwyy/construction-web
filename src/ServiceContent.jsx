import { useState, useEffect } from 'react';
import { supabase } from "./supabase.js"; // เรียกใช้ตัวเชื่อมต่อที่เราตั้งค่าไว้
import { Bed, Bath, Car, Square, ChevronDown, MessageSquare } from 'lucide-react';

export default function ServiceModelsContent() {
  // 1. สร้าง State สำหรับเก็บข้อมูลบ้านที่ดึงมาได้
  const [houseModels, setHouseModels] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. ใช้ useEffect เพื่อสั่งให้ดึงข้อมูลทันทีที่เปิดหน้านี้ขึ้นมา
  useEffect(() => {
    async function fetchHouses() {
      try {
        setLoading(true);
        // ดึงข้อมูลจากตาราง 'house_models' ทั้งหมด
        const { data, error } = await supabase
          .from('house_models')
          .select('*') 
          .order('id', { ascending: true }); // เรียงลำดับตาม ID

        if (error) throw error;
        setHouseModels(data); // นำข้อมูลที่ได้ไปเก็บใน State
      } catch (error) {
        console.error('Error fetching houses:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHouses();
  }, []);

  return (
    <div className="bg-white font-sans">
      {/* ส่วนบน (Hero & Filter) เหมือนเดิมตามดีไซน์คุณ */}
      <div className="relative h-[350px] overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
          alt="Modern House"
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-[900] mb-4">กำลังหาแบบบ้านในฝันใช่หรือไม่?</h1>
        </div>
      </div>

      {/* ส่วน Filter Bar */}
      <div className="max-w-7xl mx-auto -mt-12 relative z-20 px-6">
        <div className="bg-white p-8 shadow-2xl rounded-2xl border border-gray-100 flex justify-between items-center">
          {['สไตล์บ้าน', 'จำนวนชั้น', 'พื้นที่ทั้งหมด', 'ช่วงราคา'].map((f) => (
            <button key={f} className="flex gap-10 items-center font-bold text-[#001D4A] border-b-2 border-transparent hover:border-blue-600 pb-2">
              {f} <ChevronDown size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* 3. ส่วนการแสดงผลบ้าน (Grid Display) */}
      <div className="max-w-7xl mx-auto py-20 px-6">
        {loading ? (
          <div className="text-center py-20 text-gray-400">กำลังโหลดแบบบ้าน...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {houseModels.map((house) => (
              <div key={house.id} className="group cursor-pointer">
                {/* รูปภาพจาก image_url ใน Database */}
                <div className="overflow-hidden rounded-2xl shadow-lg mb-6 relative">
                  <img 
                    src={house.image_url} 
                    className="w-full h-72 object-cover group-hover:scale-105 transition duration-500" 
                    alt={house.title} 
                  />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-[900] text-[#001D4A]">{house.title}</h3>
                  
                  {/* แสดงสเปกบ้านที่ดึงมา */}
                  <div className="flex items-center gap-4 text-gray-500 text-sm py-2">
                    <span className="flex items-center gap-1"><Bed size={16}/> {house.bedrooms}</span>
                    <span className="flex items-center gap-1"><Bath size={16}/> {house.bathrooms}</span>
                    <span className="flex items-center gap-1"><Car size={16}/> {house.parking}</span>
                    <span className="flex items-center gap-1"><Square size={16}/> {house.area_sqm} ตร.ม.</span>
                  </div>

                  <div className="flex justify-between items-end border-t pt-4">
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase">ราคาเริ่มต้น</p>
                      <p className="text-2xl font-black text-[#001D4A]">
                        ฿{house.price?.toLocaleString()}
                      </p>
                    </div>
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition">
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}