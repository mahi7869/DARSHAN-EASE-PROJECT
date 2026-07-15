import React, { useEffect, useState } from "react";
import api from "../api/axios";
import TempleCard from "../components/TempleCard";

const Temples = () => {
  const [temples, setTemples] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchTemples = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (city) params.append("city", city);
      params.append("page", p);
      params.append("limit", 9);

      const res = await api.get(`/temples?${params.toString()}`);
      setTemples(res.data.data);
      setPages(res.data.pages || 1);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples(1);
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTemples(1);
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">Explore Temples</h2>

      <form className="row g-2 justify-content-center mb-4" onSubmit={handleSearch}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or deity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-de-primary w-100">
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-center">Loading temples...</p>
      ) : temples.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p className="fs-5">No temples found.</p>
          <p className="small">
            Try adjusting your search, or ask an Admin to add new temples.
          </p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {temples.map((t) => (
              <TempleCard key={t._id} temple={t} />
            ))}
          </div>

          {pages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                    <button className="page-link" onClick={() => fetchTemples(p)}>
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Temples;
