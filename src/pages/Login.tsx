import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, AlertCircle, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthContext } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      const timer = setTimeout(() => navigate("/"), 150);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoadingEmail(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Đăng nhập thành công!");
      setTimeout(() => navigate("/"), 100);
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "Đăng nhập thất bại!";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Tài khoản không tồn tại!";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Mật khẩu không đúng!";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email không hợp lệ!";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Quá nhiều lần thử. Vui lòng thử lại sau!";
      }

      setError(errorMessage);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoadingGoogle(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        console.log("Đăng nhập với Google thành công!");
        setTimeout(() => navigate("/"), 100);
      }
    } catch (error: any) {
      console.error("Google login error:", error);

      if (error.code !== 'auth/popup-closed-by-user') {
        setError("Đăng nhập với Google thất bại!");
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-400 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-[#020617] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] -z-10"></div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl shadow-green-950/10 p-8 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent mb-2 tracking-wide">
            TRUYENTRANHVIP
          </h1>
          <p className="text-slate-400 text-sm">Chào mừng bạn quay trở lại đọc truyện</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-shake">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-400 shrink-0" size={18} />
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 text-white rounded-xl border border-slate-800 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 placeholder-slate-700 text-sm"
                placeholder="Nhập email của bạn"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Mật khẩu
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-slate-950/40 text-white rounded-xl border border-slate-800 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-all duration-300 placeholder-slate-700 text-sm"
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loadingEmail || loadingGoogle}
            className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/35 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            {loadingEmail ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <LogIn size={18} />
            )}
            {loadingEmail ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">Hoặc đăng nhập với</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Google Login button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loadingEmail || loadingGoogle}
            className="mt-4 w-full bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-slate-200 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm cursor-pointer"
          >
            {loadingGoogle ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.83 14.97.75 12 .75c-4.3 0-8.01 2.47-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.62 6.16-4.62z"
                />
                <path
                  fill="#4285F4"
                  d="M22.56 12c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31l3.57 2.77c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09L2.18 7.07C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
              </svg>
            )}
            Google
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="text-green-400 hover:text-green-300 font-bold transition-colors underline decoration-green-400/30 decoration-2 underline-offset-4"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
