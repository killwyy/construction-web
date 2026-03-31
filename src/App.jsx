import { useState } from 'react';
import Navbar from './Navbar'; 
import HomeContent from './HomeContent';
import ServiceContent from './ServiceContent'; // สำหรับแบบบ้านมาตรฐาน
import ContactContent from './ContactContent';

// สร้าง Component เล็กๆ ไว้ชั่วคราวเพื่อกัน Error จนกว่าคุณจะสร้างไฟล์แยก
const AboutContent = () => <div className="py-20 text-center text-2xl">หน้าเกี่ยวกับเรา (กำลังพัฒนา)</div>;
const ServiceRepair = () => <div className="py-20 text-center text-2xl">ระบบซ่อมบ้าน (กำลังพัฒนา)</div>;
const ServiceEval = () => <div className="py-20 text-center text-2xl">จ้างประเมินบ้าน (กำลังพัฒนา)</div>;

function App() {
  const [view, setView] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      <Navbar view={view} setView={setView} />

      <main>
        {view === 'home' && <HomeContent />}
        {view === 'contact' && <ContactContent />}
        {view === 'about' && <AboutContent />}
        
        {/* แบ่งหน้าตามบริการ 3 แบบ */}
        {view === 'service-models' && <ServiceContent />}
        {view === 'service-repair' && <ServiceRepair />}
        {view === 'service-eval' && <ServiceEval />}
      </main>
    </div>
  );
}

export default App;