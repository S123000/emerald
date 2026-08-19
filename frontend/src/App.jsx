import React, { useState, useEffect } from 'react';
import './App.css';
import ManagerDashboard from './ManagerDashboard';

// 1. MENU & MARQUEE DATA
const MENU_CATEGORIES = [
  {
    category: "Breakfast & Specialties",
    items: [
      { id: 1, title: "Emerald Special Omelet", description: "Rich, seasoned breakfast specialty served fresh daily.", price: "ETB 1,023.00", image: "/r1.jpg" },
      { id: 2, title: "French Toast Delight", description: "Golden toasted brioche served with honey and fresh fruit.", price: "ETB 850.00", image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&auto=format&fit=crop&q=80" },
      { id: 3, title: "Avocado Toast", description: "Fresh mashed avocado on toasted sourdough with poached egg.", price: "ETB 780.00", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop&q=80" }
    ]
  },
  {
    category: "Mains & Entrees",
    items: [
      { id: 4, title: "Steak Pinwheels", description: "Tender rolled beef steak packed with vibrant herbs and flavors.", price: "ETB 1,628.00", image: "/r2.jpg" },
      { id: 5, title: "Grilled Chicken Breast", description: "Juicy marinated chicken breast served with roasted veggies.", price: "ETB 1,450.00", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&auto=format&fit=crop&q=80" },
      { id: 6, title: "Emerald Club Sandwich", description: "Triple-decker toasted sandwich with chicken, bacon, and egg.", price: "ETB 1,100.00", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80" }
    ]
  },
  {
    category: "Salads & Healthy Bowls",
    items: [
      { id: 7, title: "Quinoa Broccoli Salad", description: "Nutritious and fresh salad prepared daily with light house dressing.", price: "ETB 1,298.00", image: "/r3.jpg" },
      { id: 8, title: "Emerald Garden Salad", description: "Crisp local greens, cherry tomatoes, cucumbers, and olive oil.", price: "ETB 920.00", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80" }
    ]
  }
];

const ROW_1_DATA = [
  { title: "Steak Pinwheels", img: "/moving1.jpg" },
  { title: "Grilled Chicken", img: "/moving2.jpg" },
  { title: "Chicken Teriyaki", img: "/moving3.jpg" },
  { title: "Spinach Cheese Omelet", img: "/moving4.jpg" },
  { title: "Full Madams", img: "/moving5.jpg" },
  { title: "Croissant Sandwich", img: "/moving6.jpg" },
  { title: "Quinoa Broccoli Salad", img: "/moving7.jpg" },
  { title: "Nicoise Salad", img: "/moving8.jpg" },
  { title: "Broccoli & Apple Salad", img: "/moving9.jpg" }
];

const ROW_2_DATA = [
  { title: "Burrito Chicken Salad Bowl", img: "/moving10.jpg" },
  { title: "Classic Cheese Burger", img: "/moving11.jpg" },
  { title: "Chicken Sandwich", img: "/moving12.jpg" },
  { title: "Club Sandwich", img: "/moving13.jpg" },
  { title: "Waffle Sandwich", img: "/moving14.jpg" },
  { title: "Avocado Wrap", img: "/moving15.jpg" },
  { title: "Vegetable Wrap", img: "/moving16.jpg" },
  { title: "Tuna Wrap", img: "/moving17.jpg" },
  { title: "Beef Wrap", img: "/moving18.jpg" }
];

// 2. MAIN APP COMPONENT
export default function App() {
  // Check if URL ends with ?panel=manager
  const isManagerPage = window.location.search.includes('panel=manager');

  if (isManagerPage) {
    return <ManagerDashboard />;
  }

  const [navOpen, setNavOpen] = useState(false);
  const [showFullMenu, setShowFullMenu] = useState(false);

  // Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');

  const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Emerald+restaurant/@8.9924391,38.7917678,15z/data=!4m10!1m2!2m1!1semerald+restaurant!3m6!1s0x164b85fde27342bd:0x14a3a54550b5fea3!8m2!3d8.9925062!4d38.7918724!15sChJlbWVyYWxkIHJlc3RhdXJhbnRaFCISZW1lcmFsZCByZXN0YXVyYW50kgEKcmVzdGF1cmFudJoBRENpOURRVWxSUVVOdlpFTm9kSGxqUmpsdlQydE9UMVZWY0hOWk1tY3pWbE14VjA1NmFHWk5iR3N3VjBSS2FGb3hSUkFC4AEA-gEFCKECEDs!16s%2Fg%2F11ynvq42tm?entry=ttu&g_ep=EgoyMDI2MDgxNi4wIKXMDSoASAFQAw%3D%3D";

// AUTOMATIC 30-SECOND TIMER WITH 30-DAY EXPIRATION
  useEffect(() => {
    const timer = setTimeout(() => {
      const lastReviewed = localStorage.getItem('emerald_reviewed_timestamp');
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

      // Show modal if user has never reviewed, or if 30 days have passed
      if (!lastReviewed || (Date.now() - parseInt(lastReviewed, 10) > THIRTY_DAYS)) {
        setShowReviewModal(true);
      }
    }, 30000); // 30-second delay on page visit

    return () => clearTimeout(timer);
  }, []);

const handleStarClick = (selectedStars) => {
    setRating(selectedStars);
    
    // Redirect 4 and 5-star reviews straight to Google Maps
    if (selectedStars >= 4) {
      // Save current timestamp for the 30-day cooldown
      localStorage.setItem('emerald_reviewed_timestamp', Date.now().toString());
      setTimeout(() => {
        window.open(GOOGLE_MAPS_URL, '_blank');
        setShowReviewModal(false);
        resetReviewForm();
      }, 600);
    }
  };

  const handleLowRatingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://emerald-backend-2ysf.onrender.com/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName || 'Anonymous',
          email: customerEmail || 'Not provided',
          rating,
          feedback,
        }),
      });

      if (response.ok) {
        setSubmittedMessage('Thank you for your feedback! Our management team has been notified.');
      } else {
        setSubmittedMessage('Thank you! Your feedback was logged.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmittedMessage('Thank you for your feedback!');
    } finally {
      setIsSubmitting(false);
      // Save current timestamp for the 30-day cooldown
      localStorage.setItem('emerald_reviewed_timestamp', Date.now().toString());
      setTimeout(() => {
        setShowReviewModal(false);
        resetReviewForm();
      }, 2500);
    }
  };

  const resetReviewForm = () => {
    setRating(0);
    setHoverRating(0);
    setFeedback('');
    setCustomerName('');
    setCustomerEmail('');
    setSubmittedMessage('');
  };

  return (
    <div className="App">
      {/* Header Navigation Section */}
      <header className="header_section">
        <div className="container">
          <nav className="navbar navbar-expand-lg custom_nav-container">
            <a className="navbar-brand d-flex align-items-center" href="#home">
              <img src="/logo.jpg" alt="Emerald Restaurant Logo" className="site-logo me-2" />
              <span className="brand-text">Emerald Restaurant</span>
            </a>
            <button 
              className="navbar-toggler" 
              type="button" 
              onClick={() => setNavOpen(!navOpen)}
              aria-expanded={navOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"><i className="fas fa-bars"></i></span>
            </button>

            <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="navbarSupportedContent">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item active"><a className="nav-link" href="#home">Home</a></li>
                <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
                <li className="nav-item"><a className="nav-link" href="#gallery">Gallery</a></li>
                <li className="nav-item"><a className="nav-link" href="#menu">Menu</a></li>
                <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
              </ul>
              <div className="quote_btn-container">
                <a href="https://www.ridefood.app/en/addis-ababa/vendor/953" target="_blank" rel="noopener noreferrer" className="order-btn">
                  Order Online
                </a>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero / Banner Section */}
      <section className="slider_section" id="home">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-6 mb-4 mb-md-0">
              <div className="detail-box">
                <h1>Fresh Food,<br />Fresh Vibe</h1>
                <p>Experience fresh dishes, special breakfasts, and craft salads in the heart of Bole Brass at Reality Plaza.</p>
                <div className="btn-box">
                  <a href="#menu" className="btn1">Explore Menu</a>
                  <a href="https://www.instagram.com/emeraldrestaurant_/" target="_blank" rel="noopener noreferrer" className="btn2">
                    <i className="fab fa-instagram"></i> Instagram
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-5 col-md-6 text-center">
              <div className="vertical-dishes-wrapper d-flex flex-row flex-md-column align-items-center justify-content-space-evenly justify-content-md-center w-100 px-2">
                <div className="dish-circle mb-md-3">
                  <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80" alt="Fresh Healthy Bowl" />
                </div>
                <div className="dish-circle mb-md-3 offset-circle">
                  <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80" alt="Craft Salad Dish" />
                </div>
                <div className="dish-circle">
                  <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80" alt="Gourmet Platter" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about_section layout_padding" id="about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="img-box">
                <img src="/about-img.jpg" alt="Emerald Dining Space" className="img-fluid rounded shadow" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-box">
                <div className="heading_container mb-3">
                  <h2>About Emerald Restaurant</h2>
                </div>
                <p>
                  Located in Reality Plaza, Bole Brass, Emerald Restaurant provides a vibrant atmosphere for work, coffee, and casual dining. Whether you're stopping by for breakfast, a quick business lunch, or relaxing with friends, we serve top-quality dishes made fresh every day.
                </p>
                <a href="https://www.instagram.com/emeraldrestaurant_/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-emerald">
                  Follow Us on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery_section layout_padding bg-light" id="gallery">
        <div className="container">
          <div className="heading_container text-center mb-5">
            <h2>Photo Gallery</h2>
            <p>A glimpse of our vibrant dishes, cozy space, and fresh brews</p>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="gallery-item rounded shadow-sm overflow-hidden">
                <img src="/n1.jpg" alt="Freshly Brewed Coffee" className="img-fluid w-100 gallery-img" />
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="gallery-item rounded shadow-sm overflow-hidden">
                <img src="/n2.jpg" alt="Craft Meals" className="img-fluid w-100 gallery-img" />
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="gallery-item rounded shadow-sm overflow-hidden">
                <img src="/r1.jpg" alt="Special Breakfast" className="img-fluid w-100 gallery-img" />
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="gallery-item rounded shadow-sm overflow-hidden">
                <img src="/r2.jpg" alt="Steak Pinwheels" className="img-fluid w-100 gallery-img" />
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="gallery-item rounded shadow-sm overflow-hidden">
                <img src="/r3.jpg" alt="Quinoa Salad" className="img-fluid w-100 gallery-img" />
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="gallery-item rounded shadow-sm overflow-hidden">
                <img src="/about-img.jpg" alt="Dining Space" className="img-fluid w-100 gallery-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sliding Brick Menu Section */}
      <section className="recipe_section layout_padding overflow-hidden" id="menu">
        <div className="container-fluid px-0">
          <div className="heading_container text-center mb-5">
            <h2>Our Menu</h2>
            <p>Popular favorites served daily at Reality Plaza</p>
          </div>

          <div className="marquee-wrapper mb-3">
            <div className="marquee-track track-1">
              {[...ROW_1_DATA, ...ROW_1_DATA].map((item, index) => (
                <div key={`r1-${index}`} className="marquee-card shadow-sm rounded">
                  <img src={item.img} alt={item.title} className="marquee-img" />
                  <div className="marquee-info p-3 text-center">
                    <h6 className="mb-0 fw-bold">{item.title}</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="marquee-wrapper mb-5">
            <div className="marquee-track track-2">
              {[...ROW_2_DATA, ...ROW_2_DATA].map((item, index) => (
                <div key={`r2-${index}`} className="marquee-card shadow-sm rounded">
                  <img src={item.img} alt={item.title} className="marquee-img" />
                  <div className="marquee-info p-3 text-center">
                    <h6 className="mb-0 fw-bold">{item.title}</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button 
              onClick={() => setShowFullMenu(!showFullMenu)} 
              className="btn btn-outline-emerald btn-menu-action"
            >
              {showFullMenu ? "Hide Full Menu" : "See All Menu"}
            </button>
            <a 
              href="https://www.ridefood.app/en/addis-ababa/vendor/953" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-emerald-action btn-menu-action"
            >
              Order Now on RIDE
            </a>
          </div>

          {showFullMenu && (
            <div className="container mt-5 pt-4 border-top animate-fade-in">
              {MENU_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="mb-5">
                  <h3 className="category-title mb-4">{cat.category}</h3>
                  <div className="row">
                    {cat.items.map((item) => (
                      <div className="col-md-6 col-lg-4 mb-4" key={item.id}>
                        <div className="card box h-100 shadow-sm">
                          <div className="img-box">
                            <img src={item.image} alt={item.title} className="card-img-top" />
                          </div>
                          <div className="detail-box card-body d-flex flex-column justify-content-between">
                            <div>
                              <h5>{item.title}</h5>
                              <p className="text-muted small mb-3">{item.description}</p>
                            </div>
                            <div className="options d-flex justify-content-between align-items-center">
                              <span className="price">{item.price}</span>
                              <a 
                                href="https://www.ridefood.app/en/addis-ababa/vendor/953" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-sm btn-outline-emerald"
                              >
                                Order
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Review Modal Popup */}
      {showReviewModal && (
        <div className="review-modal-overlay animate-fade-in">
          <div className="review-modal-content rounded shadow-lg p-4">
            <button 
              className="close-modal-btn" 
              onClick={() => { 
                localStorage.setItem('emerald_reviewed_timestamp', Date.now().toString());
                setShowReviewModal(false); 
                resetReviewForm(); 
              }}
            >
              &times;
            </button>
            
            <h3 className="text-center mb-2 fw-bold text-emerald">Enjoying Emerald Restaurant?</h3>
            <p className="text-center text-muted small mb-3">How was your experience with us today?</p>

            <div className="d-flex justify-content-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fa-star star-icon ${star <= (hoverRating || rating) ? 'fas active' : 'far'}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleStarClick(star)}
                ></i>
              ))}
            </div>

            {submittedMessage ? (
              <div className="alert alert-success text-center">{submittedMessage}</div>
            ) : (
              <>
                {rating > 0 && rating < 4 && (
                  <form onSubmit={handleLowRatingSubmit} className="animate-fade-in">
                    <p className="small text-danger text-center mb-3">
                      We're sorry to hear that. Please let us know how we can improve:
                    </p>
                    <div className="mb-2">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Your Name (optional)" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Your Email (optional)" 
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <textarea 
                        className="form-control" 
                        rows="3" 
                        required 
                        placeholder="Please tell us what went wrong..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-emerald-action w-100" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Send Feedback'}
                    </button>
                  </form>
                )}

                {rating >= 4 && (
                  <p className="text-center text-success animate-fade-in fw-bold">
                    Taking you to Google Maps to post your review...
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="footer_section" id="contact">
        <div className="container">
          <div className="row py-5">
            <div className="col-md-4 mb-4 mb-md-0">
              <h4>Location</h4>
              <p>Reality Plaza, Bole Brass<br />Addis Ababa, Ethiopia</p>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <h4>Hours</h4>
              <p>Monday – Sunday<br />07:00 AM – 08:30 PM</p>
            </div>
            <div className="col-md-4">
              <h4>Follow Us</h4>
              <a href="https://www.instagram.com/emeraldrestaurant_/" target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="fab fa-instagram"></i> @emeraldrestaurant_
              </a>
            </div>
          </div>

          {/* UPDATED FOOTER BOTTOM BAR WITH MANAGER LINK */}
          <div className="text-center py-3 border-top border-secondary">
            <p className="mb-0 text-white">
              &copy; Emerald Restaurant. All Rights Reserved. | 
              <a href="/?panel=manager" className="text-white-50 ms-2 text-decoration-none">
                Manager Panel
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}