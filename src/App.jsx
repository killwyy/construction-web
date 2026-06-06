import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Navbar from './Navbar'; 
import HomeContent from './HomeContent';
import ServiceContent from './ServiceContent'; 
import ContactContent from './ContactContent';
import AboutContent from './AboutContent'; 
import HouseDetail from './HouseDetail'; 
import HouseBooking from './HouseBooking'; 
import BuildProcess from './BuildProcess';
import ServiceRepair from './ServiceRepair'; 
import ServiceInstall from './ServiceInstall'; 
import ServiceInstallDetail from './ServiceInstallDetail'; 
import ServiceInstallBooking from './ServiceInstallBooking'; 
import ServiceEval from './ServiceEval'; 
import EvalBooking from './EvalBooking'; 
import Login from './Login'; 
import AdminDashboard from './AdminDashboard'; 

// 📍 นำเข้าไฟล์ใหม่ 2 ไฟล์
import UserProfile from './UserProfile'; 
import RepairBooking from './RepairBooking'; 

function App() {
  const [view, setView] = useState('home');
  const [selectedId, setSelectedId] = useState(null); 
  const [evalBookingData, setEvalBookingData] = useState(null); 
  const [repairBookingData, setRepairBookingData] = useState(null); // 📍 เก็บข้อมูลจองซ่อม
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleViewHouseDetail = (id) => {
    setSelectedId(id);
    setView('house-detail');
  };

  const handleViewInstallDetail = (id) => {
    setSelectedId(id);
    setView('install-detail');
  };

  const handleViewChange = (newView, data = null) => {
    if (newView === 'eval-booking' && data) {
      setEvalBookingData(data); 
    }
    // 📍 รับข้อมูลจากหน้าโปรไฟล์ เพื่อส่งไปหน้าจองคิว
    if (newView === 'repair-booking' && data) {
      setRepairBookingData(data);
    }
    setView(newView);
    window.scrollTo(0, 0); 
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <div>
        {view !== 'login' && view !== 'admin-dashboard' && (
          <Navbar view={view} setView={handleViewChange} user={user} />
        )}
        
        <main>
          {view === 'home' && <HomeContent setView={handleViewChange} />}
          {view === 'contact' && <ContactContent />}
          {view === 'about' && <AboutContent />}
          
          {/* ระบบสร้างบ้าน */}
          {view === 'service-models' && <ServiceContent onViewDetail={handleViewHouseDetail} setView={handleViewChange} />}
          {view === 'house-detail' && <HouseDetail houseId={selectedId} setView={handleViewChange} />}
          {view === 'booking' && <HouseBooking houseId={selectedId} setView={handleViewChange} />}
          {view === 'process' && <BuildProcess />}
          
          {/* ระบบซ่อมบ้าน */}
          {view === 'service-repair' && <ServiceRepair setView={handleViewChange} />}
          {view === 'repair-booking' && <RepairBooking bookingData={repairBookingData} setView={handleViewChange} />}
          
          {/* ระบบติดตั้ง/ต่อเติม */}
          {view === 'service-install' && <ServiceInstall onViewDetail={handleViewInstallDetail} setView={handleViewChange} />}
          {view === 'install-detail' && <ServiceInstallDetail serviceId={selectedId} setView={handleViewChange} />}
          {view === 'install-booking' && <ServiceInstallBooking serviceId={selectedId} setView={handleViewChange} />}
          
          {/* ระบบจ้างประเมิน */}
          {view === 'service-eval' && <ServiceEval setView={handleViewChange} />}
          {view === 'eval-booking' && <EvalBooking selectedOption={evalBookingData} setView={handleViewChange} />}
          
          {/* หน้า Login / Admin / Profile */}
          {view === 'login' && <Login setView={handleViewChange} />}
          {view === 'admin-dashboard' && <AdminDashboard setView={handleViewChange} />}
          {view === 'profile' && <UserProfile setView={handleViewChange} />}
        </main>
      </div>

      {view !== 'house-detail' && view !== 'booking' && view !== 'install-detail' && view !== 'install-booking' && view !== 'service-eval' && view !== 'eval-booking' && view !== 'login' && view !== 'admin-dashboard' && view !== 'repair-booking' && (
        <footer className="w-full bg-[#001D4A] py-6 text-center text-white text-sm opacity-80 border-t border-white/10 mt-12">
          <p>© 2026 SITTITHONGKAMDEE CONSTRUCTION. ALL RIGHTS RESERVED.</p>
        </footer>
      )}
    </div>
  );
}

export default App;