import { ShieldCheck, HardHat, Users, CheckCircle } from 'lucide-react';

export default function AboutContent() {
  const works = [
    {
      title: 'งานห้องครัว',
      desc: 'ปูพื้นใหม่ ทำผนังครัว พร้อมกับตกแต่งที่ทำอาหาร',
      img: "/images/about1.jpg"
    },
    {
      title: 'งานหลังคาและกระจก',
      desc: 'แซมซ่อมหลังคา และกระจก เก็บงานให้สวยงามเรียบร้อย',
      img: "/images/about2.jpg"
    },
    {
      title: 'งานพื้นไม้',
      desc: 'ปูพื้นไม้ใหม่ ด้วยวัสดุอย่างดี จัดวางให้อย่างเรียบร้อย',
      img: "/images/about3.avif"
    },
    {
      title: 'งานเทปูนพื้น',
      desc: 'ทำซิงค์น้ำใหม่พร้อมปูกระเบื้องรอบๆ ด้วยวัสดุที่สวยงาม',
      img: "/images/about4.jpg"
    },
    {
      title: 'งานรีโนเวทตัวบ้าน',
      desc: 'ปูกระเบื้องพื้นใหม่อย่างประณีต และสวยงามตามมาตรฐาน',
      img: "/images/about5.avif"
    },
    {
      title: 'งานทาสี',
      desc: 'ทาสีใหม่ทั้งผนังชั้น 2 ภายในห้องและเหล็กตรงบันได',
      img: "/images/about6.avif"
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <div className="relative h-[400px] overflow-hidden flex items-center justify-center">
        <img
          src="/images/about.avif"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
          alt="Modern Architecture Background"
        />
        <div className="relative z-10 text-center text-white px-4 space-y-4">

          {/* ขยายหัวข้อใหญ่สุดเป็น text-6xl */}
          <h1 className="text-6xl font-bold tracking-wide">เกี่ยวกับเรา</h1>
          {/* ขยายซับไตเติลพรีเมียมด้านล่างเป็น text-lg */}
          <p className="text-gray-300 text-lg font-light tracking-widest uppercase pt-1">
            SITTITHONGKAMDEE CONSTRUCTION
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[40px]"></div>
      </div>

      {/* 2. Intro Section & Stats */}
      <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-5">
          {/* ขยายข้อความพาดหัวเนื้อหาเป็น text-4xl และ text-3xl */}
          <h2 className="text-4xl font-bold text-[#001D4A] leading-tight">
            ทำก่อสร้าง มานานกว่า 50 ปี <br />
            <span className="text-blue-600 text-3xl font-semibold">ด้วยประสบการณ์การทำงานมากมาย</span>
          </h2>
          {/* ขยายเนื้อความอธิบายหลักจากเดิม text-base ขึ้นมาเป็น text-lg */}
          <p className="text-gray-600 leading-relaxed text-lg font-light">
            เรามีความเชี่ยวชาญด้านงานรับเหมาก่อสร้างทุกประเภท ไม่ว่าจะเป็นบ้านพักอาศัย อาคารพาณิชย์
            หรือสิ่งปลูกสร้างอื่น ๆ เรามุ่งมั่นส่งมอบผลงานที่ได้มาตรฐานสูงสุดด้วยทีมช่างมืออาชีพ
          </p>
        </div>

        <div className="md:col-span-5 grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-7 rounded-2xl border border-gray-100 text-center">
            {/* ขยายตัวเลขสถิติเป็น text-5xl */}
            <p className="text-5xl font-bold text-[#001D4A]">50+</p>
            <p className="text-sm font-medium text-gray-400 mt-2">ปีที่มุ่งมั่นพัฒนา</p>
          </div>
          <div className="bg-gray-50 p-7 rounded-2xl border border-gray-100 text-center">
            <p className="text-5xl font-bold text-blue-600">100+</p>
            <p className="text-sm font-medium text-gray-400 mt-2">ส่งมอบงานสำเร็จ</p>
          </div>
        </div>
      </div>

      {/* 3. Core Values Section */}
      <div className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            {/* ขยายหัวข้อค่านิยมเป็น text-3xl */}
            <h2 className="text-3xl font-bold text-[#001D4A]">ค่านิยมและความตั้งใจของเรา</h2>
            <p className="text-gray-400 text-base font-light mt-2">สิ่งที่เรายึดมั่นในการทำงานรักษาระดับมาตรฐานมาตลอดครึ่งศตวรรษ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-start">
              <div className="bg-blue-50 p-5 rounded-xl text-blue-600 shrink-0">
                <HardHat size={28} />
              </div>
              <div>
                {/* ขยายหัวข้อการ์ดค่านิยมเป็น text-xl และเนื้อความเป็น text-base */}
                <h3 className="text-xl font-bold text-[#001D4A] mb-2">สร้างบ้านด้วยความเข้าใจ</h3>
                <p className="text-gray-500 text-base font-light leading-relaxed">ใส่ใจทุกรายละเอียดความต้องการของลูกค้า เพื่อให้บ้านในฝันออกมาสมบูรณ์แบบและตรงใจที่สุด</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-start">
              <div className="bg-blue-50 p-5 rounded-xl text-blue-600 shrink-0">
                <Users size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#001D4A] mb-2">สร้างความสัมพันธ์ยั่งยืน</h3>
                <p className="text-gray-500 text-base font-light leading-relaxed">ดูแลลูกค้าด้วยใจ ให้ความสำคัญแก่ลูกค้าทุกท่านทั้งในระหว่างก่อสร้างและบริการหลังการขาย</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Project Gallery Section */}
      <div className="max-w-6xl mx-auto px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider"></span>
            {/* ขยายหัวข้อแกลเลอรีเป็น text-4xl */}
            <h2 className="text-4xl font-bold text-[#001D4A] mt-1">ภาพผลงานการันตีคุณภาพ</h2>
          </div>
          <p className="text-gray-400 text-base font-light max-w-md">ตัวอย่างผลงานหน้างานจริงที่ทางทีมงานเข้าปรับปรุง ซ่อมแซม และดูแลอย่างประณีตในทุกขั้นตอน</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {works.map((work, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="h-56 overflow-hidden relative">
                <img
                  src={work.img}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold text-[#001D4A] flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-600" /> หน้างานจริง
                </div>
              </div>
              <div className="p-6 space-y-2">
                {/* ขยายหัวข้อรูปภาพเป็น text-xl และเนื้อความบรรยายใต้ภาพเป็น text-sm */}
                <h3 className="text-xl font-bold text-[#001D4A]">{work.title}</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{work.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}