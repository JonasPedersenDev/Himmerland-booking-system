import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/HomePage"
          element={
            <div style={{ marginLeft: "250px", padding: "20px", flex: 1 }}>
              <HomePage />
            </div>
          }
        />
        <Route path ="/Checkoutpage" element ={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
