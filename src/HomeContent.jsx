export default function HomeContent() {
  return (
    <div className="relative h-[600px] bg-[#001D4A] flex items-center justify-end pr-20 text-white overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
        alt="Luxury House" 
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="relative z-10 text-right">
        <p className="text-xl tracking-[0.5em] font-light mb-3">บริษัทรับสร้างบ้าน</p>
        <h1 className="text-7xl font-bold leading-[1.1]">
          สิทธิทองคำดี<br/>
          <span className="text-blue-500">ก่อสร้าง</span>
        </h1>
      </div>
    </div>
  );
}