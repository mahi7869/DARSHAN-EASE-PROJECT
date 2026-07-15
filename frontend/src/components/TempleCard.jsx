import React from "react";
import { Link } from "react-router-dom";

const TempleCard = ({ temple }) => {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card de-temple-card h-100 shadow-sm">
        <img
          src={temple.imageUrl}
          alt={temple.name}
          className="de-temple-img"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800";
          }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold mb-1">{temple.name}</h5>
          <p className="text-muted small mb-2">🙏 {temple.deity}</p>
          <p className="mb-2 small">
            📍 {temple.location?.city}, {temple.location?.state}
          </p>
          <p className="card-text small text-secondary flex-grow-1">
            {temple.description?.slice(0, 90)}
            {temple.description?.length > 90 ? "..." : ""}
          </p>
          <div className="d-flex flex-wrap gap-1 mb-3">
            {temple.facilities?.slice(0, 3).map((f, i) => (
              <span key={i} className="badge de-badge">{f}</span>
            ))}
          </div>
          <Link to={`/temples/${temple._id}`} className="btn btn-de-primary mt-auto">
            View Slots & Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TempleCard;
