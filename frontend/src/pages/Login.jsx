import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Login successful! Welcome back 🙏");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="de-auth-page d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card de-auth-card shadow">
              <div className="card-body p-4">
                <h3 className="text-center fw-bold mb-1">🛕 Welcome Back</h3>
                <p className="text-center text-muted small mb-4">
                  Login to DarshanEase to manage your bookings
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-de-primary w-100 mt-2"
                    disabled={submitting}
                  >
                    {submitting ? "Logging in..." : "Login"}
                  </button>
                </form>
                <p className="text-center small mt-3 mb-0">
                  Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
                <div className="de-demo-box mt-3 small">
                  <strong>Demo Admin:</strong> admin@darshanease.com / Admin@123
                  <br />
                  <span className="text-muted">(after running the seed script)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
