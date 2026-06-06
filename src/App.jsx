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


import UserProfile from './UserProfile';
import RepairBooking from './RepairBooking';
import UpdatePassword from './UpdatePassword';

function App() {
  const [view, setView] = useState('home');
  const [selectedId, setSelectedId] = useState(null);
  const [evalBookingData, setEvalBookingData] = useState(null);
  const [repairBookingData, setRepairBookingData] = useState(null); // 📍 เก็บข้อมูลจองซ่อม
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 📍 เช็ค URL hash ก่อนเลย ถ้าเป็น reset password link ให้หยุดรอ event จาก Supabase
    const hash = window.location.hash;
    const isPasswordRecovery = hash.includes('type=recovery') ||
      (hash.includes('access_token') && hash.includes('type=recovery'));
    if (isPasswordRecovery) {
      setView('update-password');
    }

    const checkUserAndRole = async (currentUser) => {
      // 📍 ถ้ากำลังอยู่หน้า update-password ห้าม redirect ไป admin เด็ดขาด
      if (window.location.hash.includes('type=recovery')) return;
      if (currentUser) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentUser.id)
            .single();

          if (profile?.role === 'admin') {
            setView('admin-dashboard');
          }
        } catch (err) {
          console.error('Error checking role:', err);
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      // 📍 ถ้าเป็น recovery link ไม่ต้อง checkRole
      if (!isPasswordRecovery) {
        checkUserAndRole(currentUser);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      // 📍 ดัก event reset password — ต้องเช็คก่อน SIGNED_IN เสมอ
      if (_event === 'PASSWORD_RECOVERY') {
        setView('update-password');
        return;
      }
      if (_event === 'SIGNED_IN') {
        // 📍 ถ้า hash ยังมี type=recovery อยู่ ไม่ checkRole
        if (window.location.hash.includes('type=recovery')) return;
        checkUserAndRole(currentUser);
      }
      if (_event === 'SIGNED_OUT') {
        setView('home');
      }
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
        {view !== 'login' && view !== 'admin-dashboard' && view !== 'update-password' && (
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
          {view === 'update-password' && <UpdatePassword setView={handleViewChange} />}
        </main>
      </div>

      {view !== 'house-detail' && view !== 'booking' && view !== 'install-detail' && view !== 'install-booking' && view !== 'service-eval' && view !== 'eval-booking' && view !== 'login' && view !== 'admin-dashboard' && view !== 'repair-booking' && view !== 'update-password' && (
        <footer className="w-full bg-[#001D4A] py-6 text-center text-white text-sm opacity-80 border-t border-white/10 mt-12">
          <p>© 2026 SITTITHONGKAMDEE CONSTRUCTION. ALL RIGHTS RESERVED.</p>
        </footer>
      )}
    </div>
  );
}

export default App;