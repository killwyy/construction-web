import { useState } from 'react';
import { supabase } from './supabase';
import { KeyRound, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';

export default function UpdatePassword({ setView }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }
    if (password !== confirmPassword) {
      setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setSuccess(true);
      // รอ 2.5 วิ แล้วพาไป home
      setTimeout(() => {
        setView('home');
      }, 2500);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-10">

        {success ? (
          // ✅ หน้าสำเร็จ
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center border-2 border-green-100">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#001D4A]">เปลี่ยนรหัสผ่านสำเร็จ!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              รหัสผ่านของคุณถูกอัปเดตเรียบร้อยแล้ว<br />กำลังพาคุณกลับหน้าหลัก...
            </p>
            <div className="flex justify-center pt-2">
              <Loader2 size={24} className="animate-spin text-blue-600" />
            </div>
          </div>
        ) : (
          // 🔑 ฟอร์มเปลี่ยนรหัสผ่าน
          <>
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <KeyRound size={28} className="text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#001D4A]">ตั้งรหัสผ่านใหม่</h1>
              <p className="text-gray-400 text-sm mt-1 text-center">กรอกรหัสผ่านใหม่ที่ต้องการด้านล่าง</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-6 text-center">
                {error}
              </div>
            )}

            {/* Password field */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#001D4A] mb-2">รหัสผ่านใหม่</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#001D4A] mb-2">ยืนยันรหัสผ่านใหม่</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3.5 rounded-full font-bold text-base transition-all shadow-md mt-2
                  ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#001D4A] text-white hover:bg-blue-900'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> กำลังบันทึก...
                  </span>
                ) : 'ยืนยันรหัสผ่านใหม่'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}