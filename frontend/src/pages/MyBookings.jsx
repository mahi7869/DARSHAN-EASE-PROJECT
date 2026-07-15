import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data.data);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed");
    }
  };

  const statusBadge = (status) => {
    const map = {
      CONFIRMED: "bg-success",
      CANCELLED: "bg-danger",
      COMPLETED: "bg-secondary",
    };
    return `badge ${map[status] || "bg-secondary"}`;
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">My Bookings</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-muted py-5">
          You haven't booked any darshan slots yet. Head over to{" "}
          <a href="/temples">Temples</a> to book one!
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white shadow-sm rounded">
            <thead className="table-light">
              <tr>
                <th>Booking Code</th>
                <th>Temple</th>
                <th>Date & Time</th>
                <th>People</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="fw-semibold">{b.bookingCode}</td>
                  <td>{b.temple?.name}</td>
                  <td>
                    {b.slot ? (
                      <>
                        {new Date(b.slot.date).toLocaleDateString()} <br />
                        <small className="text-muted">
                          {b.slot.startTime} - {b.slot.endTime}
                        </small>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{b.numberOfPeople}</td>
                  <td>{b.totalAmount > 0 ? `₹${b.totalAmount}` : "Free"}</td>
                  <td>
                    <span className={statusBadge(b.bookingStatus)}>{b.bookingStatus}</span>
                  </td>
                  <td>
                    {b.bookingStatus === "CONFIRMED" && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleCancel(b._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
