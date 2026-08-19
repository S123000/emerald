import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function ManagerDashboard() {
  const [reviews, setReviews] = useState([]);
  const [liveAlert, setLiveAlert] = useState(null);

  // Fetch initial reviews & listen for live alerts via Socket.io
  useEffect(() => {
    fetch('http://localhost:5000/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setReviews(data.data);
      })
      .catch((err) => console.error('Error fetching reviews:', err));

    // Real-time broadcast listener
    socket.on('new_low_rating_alert', (newReview) => {
      setReviews((prev) => [newReview, ...prev]);
      setLiveAlert(`Alert: New ${newReview.rating}-star review from ${newReview.name}!`);
      setTimeout(() => setLiveAlert(null), 5000);
    });

    return () => socket.off('new_low_rating_alert');
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2>Emerald Manager Panel</h2>
        <span className="badge bg-danger fs-6">Live Monitoring Active</span>
      </div>

      {/* Real-Time Toast Alert */}
      {liveAlert && (
        <div className="alert alert-danger alert-dismissible fade show shadow" role="alert">
          <strong><i className="fas fa-bell me-2"></i></strong> {liveAlert}
        </div>
      )}

      {/* Summary Analytics Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-dark mb-3 p-3 text-center">
            <h5>Total Low Reviews</h5>
            <p className="display-6 fw-bold mb-0">{reviews.length}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3 p-3 text-center">
            <h5>1-Star Urgent Escalations</h5>
            <p className="display-6 fw-bold mb-0">
              {reviews.filter((r) => r.rating === 1).length}
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-secondary mb-3 p-3 text-center">
            <h5>2–3 Star Customer Issues</h5>
            <p className="display-6 fw-bold mb-0">
              {reviews.filter((r) => r.rating > 1).length}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white fw-bold">Recent Low Rating Customer Logs</div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date & Time</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Feedback Description</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No low-rating customer issues logged.
                    </td>
                  </tr>
                ) : (
                  reviews.map((item) => (
                    <tr key={item.id}>
                      <td className="small text-muted">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="fw-bold">{item.name}</td>
                      <td>{item.email}</td>
                      <td>
                        <span className={`badge ${item.rating === 1 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                          {item.rating} Stars
                        </span>
                      </td>
                      <td>{item.feedback}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}