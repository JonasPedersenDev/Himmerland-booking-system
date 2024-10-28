import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="NotFoundContainer">
    <h1>{`404 Siden findes ikke :(`}</h1>
      <button
        className="NotFoundButton"
        onClick={() => navigate("/homepage")}
      >
        Tilbage til hjem
      </button>
    </div>
  );
};

export default NotFoundPage;