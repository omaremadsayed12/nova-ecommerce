import { useState } from "react";
import { X } from "lucide-react";
import { login } from "../../services/auth.service";
import useToast from "../../hooks/useToast";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {showError, showSuccess} = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login(email, password);

      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("access_token", data.access_token);

      showSuccess(data.message);
      // console.log(data);

      onClose();

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      showError(
        err.response?.error || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6">
      <div className="relative w-full max-w-md rounded-[28px] bg-white p-8 shadow-xl">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900">
          Welcome back
        </h2>

        <p className="mt-2 text-slate-500">
          Log in to continue shopping.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-5 py-3 font-bold text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;