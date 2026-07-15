import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import SlotModal from "../components/SlotModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TempleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchTemple = async () => {
    try {
      const res = await api.get(`/temples/${id}`);
      setTemple(res.data.data);
    } catch (err) {
      toast.error("Temple not found");
    }
  };

  const fetchSlots = async (date) => {
    try {
      const params = date ? `?date=${date}` : "";
      const res = await api.get(`/slots/temple/${id}${params}`);
      setSlots(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemple();
    fetchSlots();
    // eslint-disable-next-line
  }, [id]);

  const handleDateFilter = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchSlots(date);
  };

  const openBookingModal = (slot) => {
    if (!user) {
      toast.info("Please login to book a darshan slot");
      navigate("/login");
      return;
    }
    setSelectedSlot(slot);
  };

  if (!temple) return <div className="container py-5 text-center">Loading temple details...</div>;

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-md-5">
          <img
            src={temple.imageUrl}
            alt={temple.name}
            className="img-fluid rounded shadow-sm de-temple-detail-img"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800";
            }}
          />
        </div>
        <div className="col-md-7">
          <h2 className="fw-bold">{temple.name}</h2>
          <p className="text-muted mb-1">🙏 Deity: {temple.deity}</p>
          <p className="mb-1">
            📍 {temple.location?.address ? `${temple.location.address}, ` : ""}
            {temple.location?.city}, {temple.location?.state}
          </p>
          <p className="mb-2">
            🕐 Timings: {temple.timings?.openTime} - {temple.timings?.closeTime}
          </p>
          <p className="text-secondary">{temple.description}</p>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {temple.facilities?.map((f, i) => (
              <span key={i} className="badge de-badge">{f}</span>
            ))}
          </div>
        </div>
      </div>

      <hr className="my-5" />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h4 className="fw-bold mb-0">Available Darshan Slots</h4>
        <input
          type="date"
          className="form-control w-auto"
          value={selectedDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleDateFilter}
        />
      </div>

      {loading ? (
        <p>Loading slots...</p>
      ) : slots.length === 0 ? (
        <p className="text-muted text-center py-4">
          No slots available for this date. Try another date.
        </p>
      ) : (
        <div className="row g-3">
          {slots.map((slot) => {
            const available = slot.totalCapacity - slot.bookedCount;
            const isFull = available <= 0;
            return (
              <div className="col-md-4" key={slot._id}>
                <div className={`card de-slot-card h-100 ${isFull ? "de-slot-full" : ""}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="fw-bold mb-1">
                        {new Date(slot.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </h6>
                      <span className={`badge ${slot.slotType === "VIP" ? "bg-warning text-dark" : "bg-secondary"}`}>
                        {slot.slotType}
                      </span>
                    </div>
                    <p className="mb-1">🕐 {slot.startTime} - {slot.endTime}</p>
                    <p className="mb-1">
                      💰 {slot.pricePerTicket > 0 ? `₹${slot.pricePerTicket}/person` : "Free"}
                    </p>
                    <p className={`mb-3 fw-semibold ${isFull ? "text-danger" : "text-success"}`}>
                      {isFull ? "Fully Booked" : `${available} tickets available`}
                    </p>
                    <button
                      className="btn btn-de-primary w-100"
                      disabled={isFull}
                      onClick={() => openBookingModal(slot)}
                    >
                      {isFull ? "Sold Out" : "Book Now"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedSlot && (
        <SlotModal
          slot={selectedSlot}
          temple={temple}
          onClose={() => setSelectedSlot(null)}
          onSuccess={() => fetchSlots(selectedDate)}
        />
      )}
    </div>
  );
};

export default TempleDetail;
