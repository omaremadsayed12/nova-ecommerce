import { useState } from "react";
import { X } from "lucide-react";
import { getCurrentUser, login, register } from "../../services/auth.service";
import { ToastContext } from "../../context/ToastContext";
import { useContext } from "react";
import { useAuth } from "../../context/AuthContext";

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [registerForm, setRegisterForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useContext(ToastContext);
  const { setUser } = useAuth();

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(name);
      await register(name, email, password);
      const data = await login(email, password);
      localStorage.setItem("access_token", data.data.access_token);
      const user = await getCurrentUser();
      setUser(user.data);
      showSuccess(`Sign Up Success: Welcome, ${user.data.name}`);
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.log(error.response)
      showError(
        error.response?.data?.error.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal">
      {!registerForm &&
        <div className="auth-modal-container">
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
          <form onSubmit={handleLoginSubmit} className="auth-form">
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
          <div className="switch-caption">
            <p>New user?</p>
            <button onClick={() => setRegisterForm(true)}>Register Now</button>
          </div>
        </div>}

      {registerForm &&
        <div className="auth-modal-container">
          <button
            onClick={onClose}
            className="close-btn"
          >
            <X />
          </button>
          <h2>
            Register Now
          </h2>
          <p>
            Sign up to continue shopping.
          </p>
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div>
              <label>
                Name
              </label>
              <input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
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
                placeholder="Enter your password (8 Characters or more)"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <div className="switch-caption">
            <p>Already Registered?</p>
            <button onClick={() => setRegisterForm(false)}>Login</button>
          </div>
        </div>}
    </div>
  );
}

export default AuthModal;