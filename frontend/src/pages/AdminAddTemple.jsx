import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AdminAddTemple = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    deity: "",
    city: "",
    state: "",
    address: "",
    description: "",
    imageUrl: "",
    openTime: "06:00",
    closeTime: "21:00",
    facilities: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        deity: formData.deity,
        location: {
          city: formData.city,
          state: formData.state,
          address: formData.address,
        },
        description: formData.description,
        imageUrl: formData.imageUrl || undefined,
        timings: { openTime: formData.openTime, closeTime: formData.closeTime },
        facilities: formData.facilities
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      };
      await api.post("/temples", payload);
      toast.success("Temple added successfully! 🛕");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add temple");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4">🛕 Add New Temple</h3>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Temple Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Deity *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="deity"
                      value={formData.deity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="imageUrl"
                      placeholder="https://..."
                      value={formData.imageUrl}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Opening Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="openTime"
                      value={formData.openTime}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Closing Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="closeTime"
                      value={formData.closeTime}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Facilities (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="facilities"
                      placeholder="Prasadam, Parking, Wheelchair Access"
                      value={formData.facilities}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button className="btn btn-de-primary w-100 mt-4" disabled={submitting}>
                  {submitting ? "Adding Temple..." : "Add Temple"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddTemple;
