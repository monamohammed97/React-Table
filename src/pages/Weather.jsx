import React, { useState, useEffect } from "react";
import axios from "axios";
import Title from "../components/Title";
import Loader from "../components/loader/Loader";

export default function WeatherByCurrentLocation() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "7159a0bebe9060ad3c2845a67f6cad15";

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        setWeather(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <>
      <Title>Weather by Current Location</Title>

      <div className="weather-container">
        {loading && <Loader />}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {weather && (
          <div className="weather-info">
            <h3>
              {weather.name}, {weather.sys.country}
            </h3>
            <p>
              Temperature:<strong> {weather.main.temp}</strong> °C
            </p>
            <p>
              Weather: <strong>{weather.weather[0].description}</strong>
            </p>
            <p>
              Humidity: <strong>{weather.main.humidity}</strong>%
            </p>
            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="icon"
            />
          </div>
        )}
      </div>
    </>
  );
}
