import { useState, useEffect } from 'react';
import { supabase } from "./supabase.js"; 
import { Bed, Bath, Car, Square, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

function CustomDropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = options.find(opt => opt.value === value);
  const displayText = value === 'ทั้งหมด' ? label : currentOption?.label;

  return (
    <div className="relative flex-1 min-w-[170px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center gap-4 font-bold text-[#001D4A] border-b-2 pb-2 transition-all ${isOpen ? 'border-blue-600' : 'border-transparent hover:border-blue-600'}`}
      >
        <span className="truncate text-lg">{displayText}</span>
        <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden z-50">
            <div
              className={`px-5 py-3 cursor-pointer transition-colors font-bold text-sm ${value === 'ทั้งหมด' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-[#001D4A]'}`}
              onClick={() => { onChange('ทั้งหมด'); setIsOpen(false); }}
            >
              {label} (ทั้งหมด)
            </div>
            {options.map((opt, idx) => (
              <div
                key={idx}
                className={`px-5 py-3 cursor-pointer transition-colors font-bold text-sm ${value === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-[#001D4A]'}`}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ServiceContent({ onViewDetail }) {
  const [houseModels, setHouseModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStyle, setFilterStyle] = useState('ทั้งหมด');
  const [filterFloors, setFilterFloors] = useState('ทั้งหมด');
  const [filterArea, setFilterArea] = useState('ทั้งหมด');
  const [filterPrice, setFilterPrice] = useState('ทั้งหมด');

  // === ระบบ Pagination (แบ่งหน้า) ===
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // กำหนดให้โชว์หน้าละ 9 หลัง (3 แถว)

  // รีเซ็ตกลับไปหน้า 1 เสมอเมื่อมีการเปลี่ยนตัวกรอง (Filter)
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStyle, filterFloors, filterArea, filterPrice]);

  const styleOptions = [
    { label: 'Modern', value: 'modern' },
    { label: 'Classic', value: 'classic' },
    { label: 'Contemporary', value: 'contemporary' },
    { label: 'Tropical', value: 'tropical' }
  ];
  const floorOptions = [
    { label: '1 ชั้น', value: '1' },
    { label: '2 ชั้น', value: '2' },
    { label: '3 ชั้น', value: '3' }
  ];
  const areaOptions = [
    { label: 'น้อยกว่า 150 ตร.ม.', value: 'น้อยกว่า 150 ตร.ม.' },
    { label: '150 - 300 ตร.ม.', value: '150 - 300 ตร.ม.' },
    { label: 'มากกว่า 300 ตร.ม.', value: 'มากกว่า 300 ตร.ม.' }
  ];
  const priceOptions = [
    { label: '2 ล้าน - 4 ล้าน', value: '2 ล้าน - 4 ล้าน' },
    { label: '4 ล้าน - 6 ล้าน', value: '4 ล้าน - 6 ล้าน' },
    { label: '6 ล้าน - 10 ล้าน', value: '6 ล้าน - 10 ล้าน' },
    { label: '10 ล้านขึ้นไป', value: '10 ล้านขึ้นไป' }
  ];

  useEffect(() => {
    async function fetchHouses() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('house_models')
          .select('*') 
          .order('id', { ascending: true });

        if (error) throw error;
        setHouseModels(data);
      } catch (error) {
        console.error('Error fetching houses:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHouses();
  }, []);

  const filteredHouses = houseModels.filter((house) => {
    const matchStyle = filterStyle === 'ทั้งหมด' || house.style?.toLowerCase() === filterStyle;
    const matchFloors = filterFloors === 'ทั้งหมด' || house.floors?.toString() === filterFloors;
    
    let matchArea = true;
    if (filterArea === 'น้อยกว่า 150 ตร.ม.') matchArea = house.area < 150;
    else if (filterArea === '150 - 300 ตร.ม.') matchArea = house.area >= 150 && house.area <= 300;
    else if (filterArea === 'มากกว่า 300 ตร.ม.') matchArea = house.area > 300;

    let matchPrice = true;
    if (filterPrice === '2 ล้าน - 4 ล้าน') matchPrice = house.price >= 2000000 && house.price <= 4000000;
    else if (filterPrice === '4 ล้าน - 6 ล้าน') matchPrice = house.price > 4000000 && house.price <= 6000000;
    else if (filterPrice === '6 ล้าน - 10 ล้าน') matchPrice = house.price > 6000000 && house.price <= 10000000;
    else if (filterPrice === '10 ล้านขึ้นไป') matchPrice = house.price > 10000000;

    return matchStyle && matchFloors && matchArea && matchPrice;
  });

  // คำนวณหาบ้านที่จะต้องโชว์ในหน้านั้นๆ
  const totalPages = Math.ceil(filteredHouses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHouses = filteredHouses.slice(indexOfFirstItem, indexOfLastItem);

  // ฟังก์ชันเปลี่ยนหน้า พร้อมเลื่อนจอขึ้นบนอัตโนมัติ
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };
  const prevPage = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };
  const nextPage = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  return (
    <div className="bg-white">
      <div className="relative h-[350px] overflow-hidden flex items-center justify-center">
        <img 
          src="/images/homeback.avif" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
          alt="Luxury Modern House"
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-[900] mb-4">กำลังหาแบบบ้านในฝันใช่หรือไม่?</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto -mt-12 relative z-20 px-6">
        <div className="bg-white py-6 px-10 shadow-2xl rounded-2xl border border-gray-100 flex flex-wrap justify-between items-center gap-8">
          <CustomDropdown label="สไตล์บ้าน" options={styleOptions} value={filterStyle} onChange={setFilterStyle} />
          <CustomDropdown label="จำนวนชั้น" options={floorOptions} value={filterFloors} onChange={setFilterFloors} />
          <CustomDropdown label="พื้นที่ทั้งหมด" options={areaOptions} value={filterArea} onChange={setFilterArea} />
          <CustomDropdown label="ช่วงราคา" options={priceOptions} value={filterPrice} onChange={setFilterPrice} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-20 px-6">
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold">กำลังโหลดแบบบ้าน...</div>
        ) : filteredHouses.length === 0 ? (
          <div className="text-center py-20 text-red-500 font-bold">ไม่พบแบบบ้านที่ตรงกับเงื่อนไขที่คุณเลือก</div>
        ) : (
          <>
            {/* โชว์เฉพาะบ้านในหน้าปัจจุบัน (currentHouses) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {currentHouses.map((house) => (
                <div key={house.id} className="group cursor-pointer">
                  <div className="overflow-hidden rounded-2xl shadow-lg mb-6 relative bg-gray-100 h-72">
                    <img 
                      src={house.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80"} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      alt={house.title} 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-[900] text-[#001D4A]">{house.title}</h3>
                    
                    <div className="flex items-center gap-4 text-gray-500 text-sm py-2">
                      <span className="flex items-center gap-1"><Bed size={16}/> {house.bedrooms || 0}</span>
                      <span className="flex items-center gap-1"><Bath size={16}/> {house.bathrooms || 0}</span>
                      <span className="flex items-center gap-1"><Car size={16}/> {house.parking || 0}</span>
                      <span className="flex items-center gap-1"><Square size={16}/> {house.area || 0} ตร.ม.</span>
                    </div>

                    <div className="flex justify-between items-end border-t pt-4">
                      <div>
                        <p className="text-gray-400 text-xs font-bold uppercase">ราคาเริ่มต้น</p>
                        <p className="text-2xl font-black text-[#001D4A]">
                          ฿{house.price?.toLocaleString() || "0"}
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => onViewDetail(house.id)} 
                        className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition hover:shadow-md"
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* แถบตัวเลขแบ่งหน้า (Pagination) โชว์เมื่อมีมากกว่า 1 หน้า */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16 border-t pt-10">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl font-bold transition-all ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#001D4A] hover:bg-gray-100'}`}
                >
                  <ChevronLeft size={18} /> ก่อนหน้า
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-[#001D4A] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-[#001D4A]'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl font-bold transition-all ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-[#001D4A] hover:bg-gray-100'}`}
                >
                  ถัดไป <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}