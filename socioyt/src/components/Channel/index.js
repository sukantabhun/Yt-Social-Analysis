import React, { useState } from "react";
import "./index.css"; // Import the CSS file for styling
import Header from "../Header"; // Import the new Header component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPerson,
  faEye,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import ClipLoader from "react-spinners/ClipLoader"; // Import the new loader component

const Channel = () => {
  const [data, setData] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputFunction = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission behavior on "Enter"
      if (!inputVal) {
        setError(true);
        setData(""); // Clear response if there's an error
      } else {
        setError(null);
        setLoading(true); // Start loading
        setError(null); // Clear previous error
        setData(null);
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/channel/${inputVal}`
          );
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const result = await response.json();
          console.log(result);
          setData(result); // Update data with the fetched result
          console.log(result); // Set sentiment value
        } catch (err) {
          setError(err.message); // Update error message
        } finally {
          setLoading(false); // Stop loading
        }
      }
    }
  };

  const handleInputChange = (e) => {
    setInputVal(e.target.value); // Update input value on every change
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!inputVal) {
      setError(true);
      setData(""); // Clear response if there's an error
    } else {
      setError(null);
      setLoading(true); // Start loading
      setError(null); // Clear previous error
      setData(null);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/channel/${inputVal}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        setData(result); // Update data with the fetched result
        console.log(result); // Set sentiment value
      } catch (err) {
        setError(err.message); // Update error message
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };
  const text = () => {
    const engagementRate = data["EngagementRate"];

    if (engagementRate >= 10) {
      return "Excellent Engagement";
    } else if (engagementRate >= 5) {
      return "Good Engagement";
    } else if (engagementRate >= 2) {
      return "Average Engagement";
    } else {
      return "Low Engagement";
    }
  };

  return (
    <div className="home">
      <Header />
      <h1>Channel Statistics</h1>
      <div className="form-wrapper">
        <form onSubmit={handleFormSubmit} className="form-container">
          <input
            type="text"
            id="videoId"
            placeholder="Enter Channel Id"
            className="input-element"
            value={inputVal}
            onChange={handleInputChange} // Update input value on change
            onKeyDown={handleInputFunction} // Handle Enter key
          />
          <button type="submit" className="proceed-button">
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </form>
        {error && <p className="error">*Please enter a valid video ID</p>}
      </div>

      {/* Show the loader while loading */}
      {loading && (
        <div className="loader-container">
          <ClipLoader
            size={50}
            color="#00BFFF"
            loading={loading}
            aria-label="loading"
          />
        </div>
      )}

      {/* Show "Nothing to Show" when there's no response and loading is false */}
      {!loading && data === "" && !error && (
        <div className="output-container">
          <h1>Nothing to Show</h1>
        </div>
      )}

      {/* Show the actual response when data is available */}
      {!loading && data && (
        <div className="output-container">
          <div className="output-details-container">
            <img
              src={data["pfp"]}
              alt="channel logo
            "
              style={{ height: "250px" }}
            />
            <h1>{data["ChannelName"]}</h1>
            <div>
              <div className="output-details-container">
                <h1>Statistics</h1>
                <div>
                  <div class="cards-container">
                    <div class="card">
                      <FontAwesomeIcon
                        icon={faPerson}
                        style={{ height: "80px" }}
                      />
                      <h3>Subscribers</h3>
                      <p>{data["Subscribers"]}</p>
                    </div>
                    <div class="card">
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ height: "80px" }}
                      />
                      <h3>View Count</h3>
                      <p>{data["ViewCount"]}</p>
                    </div>
                    <div class="card">
                      <FontAwesomeIcon
                        icon={faPlay}
                        style={{ height: "80px" }}
                      />
                      <h3>Video Count</h3>
                      <p>{data["VideoCount"]}</p>
                    </div>
                  </div>

                  <div>
                    <h1>Engagement Rate</h1>
                    <h2>{data["EngagementRate"]}</h2>
                    <p>{text()}</p>
                  </div>
                </div>
                <div>
                  <h1>Top 10 Videos based on views</h1>
                  <ol className="ordered-list-channel">
                    {data["TopVideos"].map((eachItem) => {
                      const value =
                        ((Number(eachItem["Comments"]) +
                          Number(eachItem["Likes"])) *
                          100) /
                        Number(eachItem["Views"]);
                      return (
                        <li className="list-item-container">
                          <img src={eachItem["thumbnails"]} alt="thumbnails" />
                          <div>
                            <h2>{eachItem["Title"]}</h2>
                            <div className="list-item">
                              <p>{`Likes: ${eachItem["Likes"]}`}</p>
                              <p>{`Comments: ${eachItem["Comments"]}`}</p>
                              <p>{`Views: ${eachItem["Views"]}`}</p>
                              <p>{`Published on: ${eachItem["PublishedDate"]}`}</p>
                              <p>{`Engagement: ${value}`}</p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channel;
