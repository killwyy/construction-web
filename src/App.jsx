import { useState } from 'react';
import Navbar from './Navbar'; 
import HomeContent from './HomeContent';
import ServiceContent from './ServiceContent'; 
import ContactContent from './ContactContent';
import AboutContent from './AboutContent'; 
import HouseDetail from './HouseDetail'; 
import HouseBooking from './HouseBooking'; 
import BuildProcess from './BuildProcess';
import ServiceRepair from './ServiceRepair'; 

// 📍 เพิ่มหน้าจำลองสำหรับ "ระบบติดตั้ง/ต่อเติมบ้าน" เข้ามา
const ServiceInstall = () => <div className="py-20 text-center text-2xl text-[#001D4A] font-bold">ระบบติดตั้ง/ต่อเติมบ้าน (กำลังพัฒนา)</div>;
const ServiceEval = () => <div className="py-20 text-center text-2xl text-[#001D4A] font-bold">จ้างประเมินบ้าน (กำลังพัฒนา)</div>;

function App() {
  const [view, setView] = useState('home');
  const [selectedHouseId, setSelectedHouseId] = useState(null); 

  const handleViewHouseDetail = (id) => {
    setSelectedHouseId(id);
    setView('house-detail');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <div>
        <Navbar view={view} setView={setView} />

        <main>
          {view === 'home' && <HomeContent />}
          {view === 'contact' && <ContactContent />}
          {view === 'about' && <AboutContent />}
          {view === 'service-models' && <ServiceContent onViewDetail={handleViewHouseDetail} />}
          {view === 'house-detail' && <HouseDetail houseId={selectedHouseId} setView={setView} />}
          
          {view === 'booking' && <HouseBooking houseId={selectedHouseId} setView={setView} />}
          {view === 'process' && <BuildProcess />}
          
          {view === 'service-repair' && <ServiceRepair />}
          
          {/* 📍 เรียกใช้งานหน้า ระบบติดตั้ง/ต่อเติมบ้าน ตรงนี้ */}
          {view === 'service-install' && <ServiceInstall />}
          
          {view === 'service-eval' && <ServiceEval />}
        </main>
      </div>

      {/* สั่งซ่อน Footer สีน้ำเงิน ถ้าอยู่หน้า detail หรือหน้า booking */}
      {view !== 'house-detail' && view !== 'booking' && (
        <footer className="w-full bg-[#001D4A] py-6 text-center text-white text-sm opacity-80 border-t border-white/10 mt-12">
          <p>© 2026 SITTITHONGKAMDEE CONSTRUCTION. ALL RIGHTS RESERVED.</p>
        </footer>
      )}
    </div>
  );
}

export default App;