import React, { useState, useEffect } from "react";
import axios from "axios";

export default function WeatherByCurrentLocation() {
  const [weather, setWeather] = useState(null);
  console.log("🚀 ~ WeatherByCurrentLocation ~ weather:", weather);
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
    <div>
      <h1>Weather by Current Location</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="icon"
          />
        </div>
      )}
    </div>
  );
}
