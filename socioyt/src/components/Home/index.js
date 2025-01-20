import React, { useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./index.css"; // Import the CSS file for styling
import Header from "../Header"; // Import the new Header component
import Logo from "../../assets/91627.png";

// Cards Data
const cards = [
  {
    name: "Channel Analysis",
    link: "channel",
    description:
      "Provide us with a channel ID and we'll provide you with its engagement rate and statistics.",
  },
  {
    name: "Video Analysis",
    link: "video",
    description:
      "Provide us with a video ID and we'll provide you with its engagement predictions and tips for improvement.",
  },
];

const Home = () => {
  const navigate = useNavigate(); // Hook to access navigation functionality
  const cardContainerRef = useRef(null);

  const handleGetStartedClick = () => {
    if (cardContainerRef.current) {
      cardContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCardClick = (link) => {
    navigate(`/${link}`); // Redirect to the respective page
  };

  return (
    <div className="home">
      <Header />
      <div className="content-container">
        <img src={Logo} alt="central logo" className="logo-styling" />
        <h1>Unlock Insights with Our YouTube Content Analyzer</h1>
        <p>
          Analyze trends, track performance, and optimize your content strategy
          with actionable insights.
        </p>
        <button className="get-started-button" onClick={handleGetStartedClick}>
          Get Started
        </button>
      </div>

      <div className="card-container" ref={cardContainerRef}>
        {cards.map((card, index) => (
          <div
            className="card"
            key={index}
            onClick={() => handleCardClick(card.link)} // Pass the link to handleCardClick
          >
            <div className="card-inner">
              <div className="card-front">
                <div className="card-name">{card.name}</div>
              </div>
              <div className="card-back">
                <h1>{card.name}</h1>
                <p>{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
