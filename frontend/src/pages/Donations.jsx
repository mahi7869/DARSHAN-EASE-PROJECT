import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const Donations = () => {
  const [temples, setTemples] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [formData, setFormData] = useState({
    temple: "",
    amount: "",
    purpose: "GENERAL",
    donorName: "",
    panNumber: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTemples = async () => {
    try {
      const res = await api.get("/temples?limit=100");
      setTemples(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyDonations = async () => {
    try {
      const res = await api.get("/donations/my");
      setMyDonations(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTemples();
    fetchMyDonations();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.temple || !formData.amount) {
      toast.error("Please select a temple and enter an amount");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/donations", formData);
      toast.success("🙏 Thank you for your generous donation!");
      setFormData({ temple: "", amount: "", purpose: "GENERAL", donorName: "", panNumber: "" });
      fetchMyDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Donation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">Make a Donation</h2>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Select Temple</label>
                  <select
                    className="form-select"
                    name="temple"
                    value={formData.temple}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Choose a temple --</option>
                    {temples.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    min="1"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Purpose</label>
                  <select
                    className="form-select"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                  >
                    <option value="GENERAL">General Donation</option>
                    <option value="ANNADANAM">Annadanam (Food Offering)</option>
                    <option value="TEMPLE_MAINTENANCE">Temple Maintenance</option>
                    <option value="POOJA_SEVA">Pooja / Seva</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Donor Name (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleChange}
                    placeholder="Leave blank to use your account name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">PAN Number (optional, for tax receipt)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                  />
                </div>
                <button className="btn btn-de-primary w-100" disabled={submitting}>
                  {submitting ? "Processing..." : "Donate Now"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <h5 className="fw-bold mb-3">My Donation History</h5>
          {myDonations.length === 0 ? (
            <p className="text-muted">No donations yet.</p>
          ) : (
            <div className="list-group">
              {myDonations.map((d) => (
                <div key={d._id} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <strong>{d.temple?.name}</strong>
                    <span className="text-success fw-semibold">₹{d.amount}</span>
                  </div>
                  <small className="text-muted">
                    Receipt: {d.receiptNumber} • {d.purpose} •{" "}
                    {new Date(d.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donations;
