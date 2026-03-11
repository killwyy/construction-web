import { useEffect, useState } from 'react';
import { supabase } from "./supabase.js";

export default function ServiceContent() {
  const [houseModels, setHouseModels] = useState([]);

  useEffect(() => {
    async function fetchHouses() {
      const { data, error } = await supabase.from('house_models').select('*');
      if (!error) setHouseModels(data);
    }
    fetchHouses();
  }, []);

  return (
    <div className="py-20 px-10 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-[#001D4A] border-l-8 border-blue-600 pl-4">แบบบ้านมาตรฐานของเรา</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {houseModels.map((house) => (
          <div key={house.id} className="group cursor-pointer">
            <div className="overflow-hidden mb-4 shadow-lg">
              <img 
                src={house.image_url} 
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-500" 
                alt={house.title} 
              />
            </div>
            <h3 className="text-xl font-bold text-red-700">{house.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{house.description}</p>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-lg font-bold text-[#001D4A]">฿{house.price?.toLocaleString()}</span>
              <span className="text-blue-600 text-sm font-bold">ดูรายละเอียด —</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}