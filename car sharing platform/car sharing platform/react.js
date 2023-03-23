mport React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function CarSharingPlatform() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch cars and bookings data from server
    fetch('/api/cars')
      .then(response => response.json())
      .then(data => setCars(data))
      .catch(error => console.log(error));

    fetch('/api/bookings')
      .then(response => response.json())
      .then(data => setBookings(data))
      .catch(error => console.log(error));

    // Set the current user from local storage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  function handleLogin(user) {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  function handleLogout() {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }

  function handleCreateBooking(carId, bookingDate) {
    const booking = {
      carId,
      bookingDate,
      userId: currentUser.id
    };

    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    })
      .then(response => response.json())
      .then(data => {
        setBookings([...bookings, data]);
      })
      .catch(error => console.log(error));
  }

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cars">Cars</Link>
            </li>
            {currentUser ? (
              <>
                <li>
                  <Link to="/bookings">Bookings</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>

        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/cars">
            <CarListPage cars={cars} onCreateBooking={handleCreateBooking} />
          </Route>
          <Route path="/bookings">
            <BookingListPage bookings={bookings} />
          </Route>
          <Route path="/login">
            <LoginPage onLogin={handleLogin} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div>
      <h1>Welcome to Car Sharing Platform</h1>
      <p>Share your car with others and earn money!</p>
    </div>
  );
}

function CarListPage({ cars, onCreateBooking }) {
  return (
    <div>
      <h2>Cars</h2>
      <ul>
        {cars.map(car => (
          <li key={car.id}>
            <h3>{car.make} {car.model}</h3>
            <p>{car.description}</p>
            <p>Price per day: ${car.pricePerDay}</p>
            {