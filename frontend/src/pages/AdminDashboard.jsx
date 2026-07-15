import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("temples");
  const [temples, setTemples] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add slot form state
  const [slotForm, setSlotForm] = useState({
    temple: "",
    date: "",
    startTime: "",
    endTime: "",
    totalCapacity: 100,
    pricePerTicket: 0,
    slotType: "GENERAL",
  });
  const [addingSlot, setAddingSlot] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [templesRes, bookingsRes, donationsRes] = await Promise.all([
        api.get("/temples?limit=100"),
        api.get("/bookings"),
        api.get("/donations"),
      ]);
      setTemples(templesRes.data.data);
      setBookings(bookingsRes.data.data);
      setDonations(donationsRes.data.data);
    } catch (err) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDeleteTemple = async (id) => {
    if (!window.confirm("Delete this temple and all its slots?")) return;
    try {
      await api.delete(`/temples/${id}`);
      toast.success("Temple deleted");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleSlotChange = (e) =>
    setSlotForm({ ...slotForm, [e.target.name]: e.target.value });

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!slotForm.temple || !slotForm.date || !slotForm.startTime || !slotForm.endTime) {
      toast.error("Please fill all required slot fields");
      return;
    }
    setAddingSlot(true);
    try {
      await api.post("/slots", slotForm);
      toast.success("Darshan slot added successfully");
      setSlotForm({
        temple: "",
        date: "",
        startTime: "",
        endTime: "",
        totalCapacity: 100,
        pricePerTicket: 0,
        slotType: "GENERAL",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add slot");
    } finally {
      setAddingSlot(false);
    }
  };

  const totalDonationAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h2 className="fw-bold mb-0">🛠️ Admin Dashboard</h2>
        <Link to="/admin/add-temple" className="btn btn-de-primary">
          + Add New Temple
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card de-stat-card text-center p-3">
            <h4 className="fw-bold mb-0">{temples.length}</h4>
            <small className="text-muted">Temples</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card de-stat-card text-center p-3">
            <h4 className="fw-bold mb-0">{bookings.length}</h4>
            <small className="text-muted">Total Bookings</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card de-stat-card text-center p-3">
            <h4 className="fw-bold mb-0">
              {bookings.filter((b) => b.bookingStatus === "CONFIRMED").length}
            </h4>
            <small className="text-muted">Confirmed</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card de-stat-card text-center p-3">
            <h4 className="fw-bold mb-0">₹{totalDonationAmount}</h4>
            <small className="text-muted">Total Donations</small>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {["temples", "add-slot", "bookings", "donations"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active fw-semibold" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "temples" && "Manage Temples"}
              {tab === "add-slot" && "Add Darshan Slot"}
              {tab === "bookings" && "All Bookings"}
              {tab === "donations" && "All Donations"}
            </button>
          </li>
        ))}
      </ul>

      {loading ? (
        <p className="text-center">Loading admin data...</p>
      ) : (
        <>
          {activeTab === "temples" && (
            <div className="table-responsive">
              <table className="table table-hover bg-white shadow-sm rounded align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Deity</th>
                    <th>City</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {temples.map((t) => (
                    <tr key={t._id}>
                      <td className="fw-semibold">{t.name}</td>
                      <td>{t.deity}</td>
                      <td>{t.location?.city}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteTemple(t._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "add-slot" && (
            <div className="card shadow-sm p-4" style={{ maxWidth: 600 }}>
              <h5 className="fw-bold mb-3">Add New Darshan Slot</h5>
              <form onSubmit={handleAddSlot}>
                <div className="mb-3">
                  <label className="form-label">Temple *</label>
                  <select
                    className="form-select"
                    name="temple"
                    value={slotForm.temple}
                    onChange={handleSlotChange}
                    required
                  >
                    <option value="">-- Select Temple --</option>
                    {temples.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={slotForm.date}
                      onChange={handleSlotChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Start Time *</label>
                    <input
                      type="time"
                      className="form-control"
                      name="startTime"
                      value={slotForm.startTime}
                      onChange={handleSlotChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">End Time *</label>
                    <input
                      type="time"
                      className="form-control"
                      name="endTime"
                      value={slotForm.endTime}
                      onChange={handleSlotChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Total Capacity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="totalCapacity"
                      min="1"
                      value={slotForm.totalCapacity}
                      onChange={handleSlotChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Price / Ticket (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="pricePerTicket"
                      min="0"
                      value={slotForm.pricePerTicket}
                      onChange={handleSlotChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Slot Type</label>
                    <select
                      className="form-select"
                      name="slotType"
                      value={slotForm.slotType}
                      onChange={handleSlotChange}
                    >
                      <option value="GENERAL">General</option>
                      <option value="VIP">VIP</option>
                      <option value="SPECIAL">Special</option>
                    </select>
                  </div>
                </div>
                <button className="btn btn-de-primary w-100 mt-4" disabled={addingSlot}>
                  {addingSlot ? "Adding..." : "Add Slot"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="table-responsive">
              <table className="table table-hover bg-white shadow-sm rounded align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>User</th>
                    <th>Temple</th>
                    <th>Date</th>
                    <th>People</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.bookingCode}</td>
                      <td>{b.user?.name} <br /><small className="text-muted">{b.user?.email}</small></td>
                      <td>{b.temple?.name}</td>
                      <td>{b.slot ? new Date(b.slot.date).toLocaleDateString() : "N/A"}</td>
                      <td>{b.numberOfPeople}</td>
                      <td>
                        <span
                          className={`badge ${
                            b.bookingStatus === "CONFIRMED"
                              ? "bg-success"
                              : b.bookingStatus === "CANCELLED"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "donations" && (
            <div className="table-responsive">
              <table className="table table-hover bg-white shadow-sm rounded align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Receipt</th>
                    <th>Donor</th>
                    <th>Temple</th>
                    <th>Purpose</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d._id}>
                      <td>{d.receiptNumber}</td>
                      <td>{d.user?.name}</td>
                      <td>{d.temple?.name}</td>
                      <td>{d.purpose}</td>
                      <td>₹{d.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
