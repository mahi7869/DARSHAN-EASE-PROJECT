import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const SlotModal = ({ slot, temple, onClose, onSuccess }) => {
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [visitorNames, setVisitorNames] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const availableCount = slot.totalCapacity - slot.bookedCount;
  const totalAmount = slot.pricePerTicket * numberOfPeople;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (numberOfPeople < 1 || numberOfPeople > availableCount) {
      toast.error(`Please enter a valid number of people (max ${availableCount})`);
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/bookings", {
        slotId: slot._id,
        numberOfPeople: Number(numberOfPeople),
        visitorNames: visitorNames
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean),
      });
      toast.success("🎉 Booking confirmed successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="de-modal-backdrop" onClick={onClose}>
      <div className="de-modal" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Book Darshan Slot</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="de-slot-summary mb-3">
          <p className="mb-1"><strong>Temple:</strong> {temple.name}</p>
          <p className="mb-1">
            <strong>Date:</strong> {new Date(slot.date).toLocaleDateString()}
          </p>
          <p className="mb-1">
            <strong>Time:</strong> {slot.startTime} - {slot.endTime}
          </p>
          <p className="mb-1"><strong>Type:</strong> {slot.slotType}</p>
          <p className="mb-1">
            <strong>Price:</strong>{" "}
            {slot.pricePerTicket > 0 ? `₹${slot.pricePerTicket} / person` : "Free"}
          </p>
          <p className="mb-0 text-success">
            <strong>Available:</strong> {availableCount} tickets
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Number of People</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max={availableCount}
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Visitor Names (comma separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Ramesh Kumar, Sita Devi"
              value={visitorNames}
              onChange={(e) => setVisitorNames(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3 fw-bold">
            <span>Total Amount:</span>
            <span>{totalAmount > 0 ? `₹${totalAmount}` : "Free"}</span>
          </div>

          <button type="submit" className="btn btn-de-primary w-100" disabled={submitting}>
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SlotModal;
