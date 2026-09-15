import { useState } from "react";
import { X } from "lucide-react";
import { getCurrentUser, login } from "../../services/auth.service";
import { ToastContext } from "../../context/ToastContext";
import { useContext } from "react";
import { useAuth } from "../../context/AuthContext";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useContext(ToastContext);
  const { setUser } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {

      setLoading(true);

      const data = await login(email, password);

      localStorage.setItem("access_token", data.data.access_token);

      const user = await getCurrentUser();
      setUser(user.data);

      showSuccess(`Login Success: Welcome back, ${user.data.name}`);


      onClose();

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      showError(
        error.response?.data?.error.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal">
      <div className="container">

        <button
          onClick={onClose}
          className="close-btn"
        >
          <X />
        </button>

        <h2>
          Welcome back
        </h2>

        <p>
          Log in to continue shopping.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;