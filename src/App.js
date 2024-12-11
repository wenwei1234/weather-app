import { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import Header from "./components/Header";
import WeatherToggle from "./components/WeatherToggle";
import WeatherInfo from "./components/WeatherInfo";
import WeeklyForecast from "./components/WeeklyForecast";

function App() {
  // State to track current unit
  const [unit, setUnit] = useState("metric");
  // State to store raw data from API
  const [rawWeatherData, setRawWeatherData] = useState(null);
  // State to store city 
  const [city, setCity] = useState("");

  // Fetch data from API 
  const fetchWeatherData = async (city) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const baseURL = "https://api.openweathermap.org/data/2.5";

    try {
      const currentWeatherResponse = await axios.get(
        `${baseURL}/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const forecastWeatherResponse = await axios.get(
        `${baseURL}/forecast?q=${city}&units=metric&appid=${apiKey}`
      );

      // Store fetched data
      setRawWeatherData({
        current: currentWeatherResponse.data,
        forecast: forecastWeatherResponse.data,
      });
    } catch (error) {
      console.error("Error while fetching weather data:", error);
      alert("Please enter a valid city or try again.");
    }
  };

  // Fetch data when city changes
  useEffect(() => {
    if (city) {
      fetchWeatherData(city);
    }
  }, [city]);

  // Function to change temp unit
  const changeUnit = (newUnit) => {
    setUnit(newUnit);
  };

  return (
    <div className="App">
      <Header />
      <WeatherToggle unit={unit} changeUnit={changeUnit}/>
      <input
        type="text"
        placeholder="Enter city"
        onKeyDown={(e) => {
          if (e.key === "Enter") setCity(e.target.value);
        }}
      />
      {rawWeatherData && (
        <>
          <WeatherInfo rawWeatherData={rawWeatherData} unit={unit}/>
          <WeeklyForecast rawWeatherData={rawWeatherData} unit={unit}/>
        </>
      )}
    </div>
  );
}

export default App;