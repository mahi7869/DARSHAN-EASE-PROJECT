import React from "react";

const Footer = () => {
  return (
    <footer className="de-footer text-light mt-5">
      <div className="container py-4">
        <div className="row gy-4">
          <div className="col-md-4">
            <h5 className="fw-bold">🛕 DarshanEase</h5>
            <p className="small text-light-50 mb-0">
              Explore temples, view live darshan slots, and book your visit online —
              simple, secure, and hassle-free.
            </p>
          </div>
          <div className="col-md-4">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><a href="/temples" className="footer-link">Explore Temples</a></li>
              <li><a href="/my-bookings" className="footer-link">My Bookings</a></li>
              <li><a href="/donations" className="footer-link">Make a Donation</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="fw-semibold">Support</h6>
            <p className="small mb-1">📧 support@darshanease.com</p>
            <p className="small mb-0">📞 1800-XXX-XXXX (Toll Free)</p>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="text-center small mb-0">
          © {new Date().getFullYear()} DarshanEase. Built with the MERN Stack.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
