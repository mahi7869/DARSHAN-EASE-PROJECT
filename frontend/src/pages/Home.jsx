import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import TempleCard from "../components/TempleCard";

const Home = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/temples?limit=3");
        setTemples(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="de-hero text-white">
        <div className="container py-5 text-center">
          <h1 className="display-4 fw-bold mb-3">🛕 Welcome to DarshanEase</h1>
          <p className="lead mb-4">
            Discover sacred temples, check real-time darshan slot availability,
            and book your visit — all from one place.
          </p>
          <Link to="/temples" className="btn btn-warning btn-lg text-dark fw-semibold px-4">
            Explore Temples
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container py-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="de-feature-icon mb-3">🔍</div>
            <h5 className="fw-bold">Browse Temples</h5>
            <p className="text-muted small">
              Search temples by name, deity, or city and explore full details.
            </p>
          </div>
          <div className="col-md-4">
            <div className="de-feature-icon mb-3">🎟️</div>
            <h5 className="fw-bold">Book Darshan Slots</h5>
            <p className="text-muted small">
              View real-time slot availability and instantly reserve your tickets.
            </p>
          </div>
          <div className="col-md-4">
            <div className="de-feature-icon mb-3">🙏</div>
            <h5 className="fw-bold">Donate Online</h5>
            <p className="text-muted small">
              Contribute to Annadanam, temple maintenance, and special sevas securely.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Temples */}
      <section className="container pb-5">
        <h3 className="fw-bold mb-4 text-center">Featured Temples</h3>
        {loading ? (
          <p className="text-center">Loading temples...</p>
        ) : temples.length === 0 ? (
          <p className="text-center text-muted">
            No temples available yet. Please seed the database or ask an admin to add temples.
          </p>
        ) : (
          <div className="row g-4">
            {temples.map((t) => (
              <TempleCard key={t._id} temple={t} />
            ))}
          </div>
        )}
        <div className="text-center mt-4">
          <Link to="/temples" className="btn btn-outline-secondary">
            View All Temples →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
