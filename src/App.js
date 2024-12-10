import { useState } from "react";
import './App.css';
import axios from "axios";

function App() {

  const [unit, setUnit] = useState("metric");
  const [weatherData, setWeatherData] = useState(null);

  // Fetch the data from API using axios 
  const fetchWeather = async (city, unit ="metric") => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const baseURL = "https://api.openweathermap.org/data/2.5";

    // Await API request to go through before proceeding
    try {
      const currentWeatherData = await axios.get(
        `${baseURL}/weather?q=${city}&units=${unit}&appid=${apiKey}`
      );

      const forecastWeatherData = await axios.get(
        `${baseURL}/forecast?q=${city}&units=${unit}&appid=${apiKey}`
      );
     
      // Store the Weather Data
      setWeatherData({ 
        current: currentWeatherData.data, 
        forecast: forecastWeatherData.data,
      });

    } catch (error) {
      console.error("Error while fetching weather data:", error);
      alert("Please enter a valid city or try again.");
    }
  };

    // Change unit when radio selected
    const changeUnit = (newUnit) => {
        setUnit(newUnit);
        if (weatherData && weatherData.current) {
            fetchWeather(weatherData.current.name, newUnit);
        }
    };


  const Header = () => (
    <header>
      <h1>Weather Forecast</h1>
      <p>Enter a city to check the weather.</p>
    </header>
  );

  // Change the weather Unit
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

  // Current Weather
  const WeatherInfo = () => {
    const { current } = weatherData;

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
                {current.main.temp}° {unit === "metric" ? "C" : "F"}
            </h3>
        </div>
    );
  };


  // Weather Forecast for 1 Week
  const WeeklyForecast = () => {
    // Group the forecast data by day
    const forecastData = weatherData.forecast.list
      .filter((item, index, self) => {

        // Keep only the first item for each day 
        const forecastDate = new Date(item.dt * 1000);
        const day = forecastDate.getDate();
        const month = forecastDate.getMonth();
        const year = forecastDate.getFullYear();
        
        return self.findIndex(other => {
          const otherDate = new Date(other.dt * 1000);
          return otherDate.getDate() === day && otherDate.getMonth() === month && otherDate.getFullYear() === year;
        }) === index;
      })
      .slice(0, 7); // Show 7 days of forecast
    return (
      <div className="forecast">
        <h3>7-Day Forecast</h3>
        <div className="forecast-graph">
          {forecastData.map((item, index) => {
            // Convert time to Date
            const forecastDate = new Date(item.dt * 1000);
            // Format date to GB
            const formattedDate = new Intl.DateTimeFormat('en-GB').format(forecastDate);
  
            return (
              <div key={index} className="forecast-item">
                <p>{formattedDate}</p> {}
                <div className="icon forecast">{item.weather[0].description}</div>
                <p>{item.main.temp}° {unit === "metric" ? "C" : "F"}</p>
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
          if (e.key === "Enter") fetchWeather(e.target.value);
        }}
      />
      {weatherData && (
        <>
          <WeatherInfo />
          <WeeklyForecast />
        </>
      )}
    </div>
  );
}

export default App;