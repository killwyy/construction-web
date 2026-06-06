import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { ChevronLeft, ChevronRight, ArrowRight, Bed, Bath, Car, Square, Wrench, Layers, ClipboardCheck } from 'lucide-react';

// ===== HERO SECTION =====
function HeroSection() {
  return (
    <div className="relative h-[600px] bg-[#001D4A] flex items-center justify-end pr-20 text-white overflow-hidden">
      <img
        src="/images/home1.jfif"
        alt="Luxury House"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="relative z-10 text-right">
        <p className="text-xl tracking-[0.5em] font-light mb-3">บริษัทรับสร้างบ้าน</p>
        <h1 className="text-7xl font-bold leading-[1.1]">
          สิทธิทองคำดี<br />
          <span className="text-blue-500">ก่อสร้าง</span>
        </h1>
      </div>
    </div>
  );
}

// ===== HOUSE MODEL SLIDER =====
function HouseModelSlider({ setView }) {
  const [houses, setHouses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const VISIBLE = 3;

  useEffect(() => {
    async function fetchHouses() {
      try {
        const { data, error } = await supabase
          .from('house_models')
          .select('id, title, price, bedrooms, bathrooms, area, image_url, style')
          .order('id', { ascending: true })
          .limit(9);
        if (error) throw error;
        setHouses(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchHouses();
  }, []);

  useEffect(() => {
    if (houses.length <= VISIBLE) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (houses.length - VISIBLE + 1));
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, [houses]);

  const goTo = (idx) => {
    clearInterval(intervalRef.current);
    setCurrentIndex(idx);
  };
  const prev = () => goTo(currentIndex === 0 ? houses.length - VISIBLE : currentIndex - 1);
  const next = () => goTo(currentIndex >= houses.length - VISIBLE ? 0 : currentIndex + 1);

  const visibleHouses = houses.slice(currentIndex, currentIndex + VISIBLE);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">แบบบ้านของเรา</span>
            <h2 className="text-4xl font-bold text-[#001D4A] mt-2 leading-tight">
              แบบบ้านพร้อมสร้าง<br />
              <span className="text-blue-600 font-semibold text-3xl">หลากหลายสไตล์ที่คุณเลือกได้</span>
            </h2>
          </div>
          <button
            onClick={() => setView('service-models')}
            className="hidden md:flex items-center gap-2 text-[#001D4A] font-semibold border-b-2 border-[#001D4A] pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors"
          >
            ดูแบบบ้านทั้งหมด <ArrowRight size={16} />
          </button>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="h-72 flex items-center justify-center text-gray-400 font-medium">กำลังโหลดแบบบ้าน...</div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {visibleHouses.map((house) => (
                <div
                  key={house.id}
                  onClick={() => setView('service-models')}
                  className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={house.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
                      alt={house.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {house.style && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#001D4A] text-xs font-bold px-3 py-1 rounded-full capitalize">
                        {house.style}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#001D4A] mb-3 truncate">{house.title}</h3>
                    <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
                      <span className="flex items-center gap-1"><Bed size={13} /> {house.bedrooms}</span>
                      <span className="flex items-center gap-1"><Bath size={13} /> {house.bathrooms}</span>
                      <span className="flex items-center gap-1"><Square size={13} /> {house.area} ตร.ม.</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">ราคาเริ่มต้น</p>
                        <p className="text-xl font-bold text-[#001D4A]">฿{house.price?.toLocaleString()}</p>
                      </div>
                      <span className="text-blue-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        ดูรายละเอียด <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {houses.length > VISIBLE && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button onClick={prev} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#001D4A] hover:text-[#001D4A] transition-colors">
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: houses.length - VISIBLE + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-2.5 rounded-full transition-all ${currentIndex === i ? 'bg-[#001D4A] w-6' : 'bg-gray-300 w-2.5'}`}
                  />
                ))}
                <button onClick={next} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#001D4A] hover:text-[#001D4A] transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => setView('service-models')}
            className="inline-flex items-center gap-2 text-[#001D4A] font-semibold border-b-2 border-[#001D4A] pb-1"
          >
            ดูแบบบ้านทั้งหมด <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ===== SERVICES SECTION =====
function ServicesSection({ setView }) {
  const services = [
    {
      id: 'service-repair',
      icon: <Wrench size={28} />,
      color: 'bg-orange-50 text-orange-500',
      accent: 'border-orange-400',
      title: 'บริการซ่อมแซมบ้าน',
      desc: 'ซ่อมแซมทุกปัญหา ไม่ว่าจะเป็นงานโครงสร้าง ประปา ไฟฟ้า หรืองานสี ด้วยทีมช่างผู้เชี่ยวชาญ',
      cta: 'แจ้งซ่อมเลย',
    },
    {
      id: 'service-install',
      icon: <Layers size={28} />,
      color: 'bg-blue-50 text-blue-600',
      accent: 'border-blue-500',
      title: 'ติดตั้งและต่อเติม',
      desc: 'อัปเกรดบ้านของคุณด้วยบริการต่อเติม ติดตั้งโซลาร์เซลล์ ปูพื้น งานภายนอก และอื่นๆ อีกมาก',
      cta: 'ดูบริการทั้งหมด',
    },
    {
      id: 'service-eval',
      icon: <ClipboardCheck size={28} />,
      color: 'bg-green-50 text-green-600',
      accent: 'border-green-500',
      title: 'ประเมินและตรวจรับบ้าน',
      desc: 'บริการประเมินสภาพบ้านและตรวจรับงานก่อสร้างโดยวิศวกรและผู้เชี่ยวชาญมืออาชีพ',
      cta: 'จองประเมินเลย',
    },
  ];

  return (
    <section className="py-24 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">บริการของเรา</span>
          <h2 className="text-4xl font-bold text-[#001D4A] mt-2">
            ครบครัน ทุกความต้องการ<br />
            <span className="text-blue-600 font-semibold text-3xl">เรื่องบ้านของคุณ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.id}
              className={`bg-white rounded-2xl p-8 shadow-sm border-t-4 ${s.accent} hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col`}
            >
              <div className={`w-14 h-14 rounded-xl ${s.color} flex items-center justify-center mb-6`}>
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-[#001D4A] mb-3">{s.title}</h3>
              <p className="text-gray-500 font-light leading-relaxed flex-grow text-base">{s.desc}</p>
              <button
                onClick={() => setView(s.id)}
                className="mt-8 self-start flex items-center gap-2 font-semibold text-[#001D4A] group-hover:gap-3 transition-all"
              >
                {s.cta} <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== WHY US SECTION =====
function WhyUsSection() {
  const stats = [
    { number: '50+', label: 'ปีประสบการณ์' },
    { number: '100+', label: 'โครงการสำเร็จ' },
    { number: '100%', label: 'ดูเเลหลังการขาย' },
    { number: '50+', label: 'ช่างผู้เชี่ยวชาญ' },
  ];

  return (
    <section className="py-24 bg-[#001D4A] text-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-blue-400 font-semibold text-sm tracking-[0.4em] uppercase">ทำไมต้องเลือกเรา</span>
            <h2 className="text-4xl font-bold leading-tight mt-3 mb-6">
              มาตรฐานสูง<br />
              <span className="text-blue-400 font-semibold text-3xl">ราคาโปร่งใส</span>
            </h2>
            <p className="text-gray-300 font-light leading-loose text-lg">
              เราคือบริษัทรับสร้างบ้านที่มีประสบการณ์มากกว่า 15 ปี ด้วยทีมวิศวกรและช่างผู้เชี่ยวชาญ
              ที่ทำงานด้วยความใส่ใจในทุกรายละเอียด ตั้งแต่การออกแบบจนถึงการส่งมอบงาน
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors">
                <p className="text-5xl font-bold text-blue-400 mb-2">{s.number}</p>
                <p className="text-gray-300 font-medium text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== CTA SECTION =====
function CTASection({ setView }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-8 text-center">
        <span className="text-blue-600 font-semibold text-sm tracking-[0.4em] uppercase">พร้อมเริ่มต้นแล้วหรือยัง?</span>
        <h2 className="text-4xl font-bold text-[#001D4A] mt-3 mb-6 leading-tight">
          สร้างบ้านในฝันของคุณ<br />
          <span className="text-blue-600 font-semibold text-3xl">ให้เป็นจริงกับเรา</span>
        </h2>
        <p className="text-gray-400 text-lg font-light mb-10 max-w-xl mx-auto leading-relaxed">
          ปรึกษาฟรี ไม่มีค่าใช้จ่าย ทีมงานของเราพร้อมให้คำแนะนำทุกขั้นตอน
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setView('service-models')}
            className="px-10 py-4 bg-[#001D4A] text-white font-semibold rounded-full hover:bg-blue-900 transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            ดูแบบบ้าน <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setView('contact')}
            className="px-10 py-4 border-2 border-[#001D4A] text-[#001D4A] font-semibold rounded-full hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            ติดต่อเรา
          </button>
        </div>
      </div>
    </section>
  );
}

// ===== MAIN EXPORT =====
export default function HomeContent({ setView }) {
  return (
    <div>
      <HeroSection />
      <HouseModelSlider setView={setView} />
      <ServicesSection setView={setView} />
      <WhyUsSection />
      <CTASection setView={setView} />
    </div>
  );
}