import { useState } from "react";
import './App.css';
import axios from "axios";

function App() {
  const [unit, setUnit] = useState("metric");
  const [weatherData, setWeatherData] = useState(null);


  // Change unit when radio selected
  const changeUnit = (newUnit) => setUnit(newUnit);

  const fetchWeather = async (city) => {
    const apiKey = "2351d5b92bd489c41385010b522764c5";
    const baseURL = "https://api.openweathermap.org/data/2.5";

    try {
      const currentWeatherData = await axios.get(
        `${baseURL}/weather?q=${city}&units=${unit}&appid=${apiKey}`
      );
      const currentWeather = currentWeatherData.data;

      const forecastWeatherData = await axios.get(
        `${baseURL}/forecast?q=${city}&units=${unit}&appid=${apiKey}`
      );
      const forecast = forecastWeatherData.data;

      setWeatherData({ current: currentWeather, forecast});

    } catch (error) {
      console.error("Error while fetching weather data:", error);
      alert("Failed to retrieve weather data. Please reload or try again.");
    }
  };

  const Header = () => (

    <header>
      <h1>Weather Forecast</h1>
      <p>Enter a city to check the weather.</p>
    </header>
  );

  const WeatherToggle = ({ onUnitChange }) => (
    <div>
      <label>
        <input
          type="radio"
          name="unit"
          value="metric"
          onChange={() => changeUnit("metric")}
          defaultChecked
        />
        Celsius
      </label>
      <label>
        <input
          type="radio"
          name="unit"
          value="imperial"
          onChange={() => changeUnit("Imperial")}
        />
        Fahrenheit
      </label>
    </div>
  );

  // Current Weather
  const WeatherInfo = ({ data }) => (
    <div>
      <h2>{data.name}</h2>
      <p>
        {data.weather[0].description}, {data.main.temp}°{""}
        {unit === "metric" ? "C" : "F"}
      </p>
    </div>
  );

  // Weather Forecast for 1 Week
  const WeeklyForecast = ({ data }) => {
    const dailyData = data.list.filter((_, index) => index % 8 === 0);

    return (
      <div>
        <h3>7-Day Forecast</h3>
        <ul>
          {dailyData.map((item, index) => (
            <li key={index}>
              {new Date(item.dt * 1000).toLocaleDateString()} -{" "}
              {item.weather[0].description}, {item.main.temp}°
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div classname="App">
      <Header />
      <WeatherToggle onUnitChange={{changeUnit}} />
      <input
        type="text"
        placeholder="Enter city"
        onKeyDown={(e) => {
          if (e.key === "Enter") fetchWeather(e.target.value);
        }}
      />
      {weatherData && (
        <>
          <WeatherInfo data={weatherData.current} />
          <WeeklyForecast data={weatherData.forecast}/>
        </>
      )}
    </div>
  );
}

export default App;