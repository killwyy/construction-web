import { useState } from 'react';
import Navbar from './Navbar'; // นำเข้า Navbar ที่เราแยกไฟล์ไว้
import HomeContent from './HomeContent';
import ServiceContent from './ServiceContent';
import ContactContent from './ContactContent';

function App() {
  const [view, setView] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      {/* เรียกใช้ Navbar และส่งค่า view/setView ไปให้ทำงาน */}
      <Navbar view={view} setView={setView} />

      {/* ส่วนเนื้อหาหลัก */}
      <main>
        {/* 2. เพิ่มเงื่อนไขให้แสดง ContactContent เมื่อ view === 'contact' */}
        {view === 'home' && <HomeContent />}
        {view === 'service' && <ServiceContent />}
        {view === 'contact' && <ContactContent />}
      </main>
    </div>
  );
}

export default App;