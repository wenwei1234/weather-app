import { useState, useEffect } from "react";
import './App.css';
import axios from "axios";

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

  const Header = () => (
    <header>
      <h1>Weather Forecast</h1>
      <p>Enter a city to check the weather.</p>
    </header>
  );

  // Radio buttons for unit
  const WeatherToggle = () => (
    <div className="unit-toggle">
      <label>
        <input
          type="radio"
          name="unit"
          value="metric"
          onChange={() => changeUnit("metric")}
          checked={unit === "metric"}
        />
        Celsius
      </label>
      <label>
        <input
          type="radio"
          name="unit"
          value="imperial"
          onChange={() => changeUnit("imperial")}
          checked={unit === "imperial"}
        />
        Fahrenheit
      </label>
    </div>
  );

  // Convert unit locally
  const convertTemperature = (temp, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return temp;
    return toUnit === "imperial" ? temp * 1.8 + 32 : (temp - 32) / 1.8;
  };

  // Component to display current weather
  const WeatherInfo = () => {
    const { current } = rawWeatherData;
    const temperature = convertTemperature(
      current.main.temp,
      "metric",
      unit
    );

    // Function to get weather icons
    const getCustomWeatherIcon = (description) => {
      switch (description.toLowerCase()) {
        case "clear sky":
          return <div className="icon sunny" />;
        case "few clouds":
          return <div className="icon cloudy" />;
        case "rain":
        case "light rain":
          return <div className="icon rainy" />;
        case "snow":
          return <div className="icon snowy" />;
        default:
          return <div className="icon default" />;
      }
    };

    return (
      <div className="weather-card">
        <h2>{current.name}</h2>
        {getCustomWeatherIcon(current.weather[0].description)}
        <p>{current.weather[0].description}</p>
        <h3>
          {temperature.toFixed(1)}° {unit === "metric" ? "C" : "F"}
        </h3>
      </div>
    );
  };

  // Component to display weekly forecast
  const WeeklyForecast = () => {
    const forecastData = rawWeatherData.forecast.list
      .filter((item, index, self) => {
        const forecastDate = new Date(item.dt * 1000);
        const day = forecastDate.getDate();
        const month = forecastDate.getMonth();
        const year = forecastDate.getFullYear();

        // Only the first forecast item is kept for each day
        return (
          self.findIndex((other) => {
            const otherDate = new Date(other.dt * 1000);
            return (
              otherDate.getDate() === day &&
              otherDate.getMonth() === month &&
              otherDate.getFullYear() === year
            );
          }) === index
        );
      })
      .slice(0, 7);

    return (
      <div className="forecast">
        <h3>7-Day Forecast</h3>
        <div className="forecast-graph">
          {forecastData.map((item, index) => {
            const forecastDate = new Date(item.dt * 1000);
            const formattedDate = new Intl.DateTimeFormat("en-GB").format(
              forecastDate
            );

            const temperature = convertTemperature(
              item.main.temp,
              "metric",
              unit
            );

            return (
              <div key={index} className="forecast-item">
                <p>{formattedDate}</p>
                <div className="icon forecast">{item.weather[0].description}</div>
                <p>
                  {temperature.toFixed(1)}° {unit === "metric" ? "C" : "F"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <Header />
      <WeatherToggle />
      <input
        type="text"
        placeholder="Enter city"
        onKeyDown={(e) => {
          if (e.key === "Enter") setCity(e.target.value);
        }}
      />
      {rawWeatherData && (
        <>
          <WeatherInfo />
          <WeeklyForecast />
        </>
      )}
    </div>
  );
}

export default App;
