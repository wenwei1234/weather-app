import convertTemperature from "./ConvertTemp";

  // Component to display current weather
  const WeatherInfo = ({ rawWeatherData, unit}) => {
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

export default WeatherInfo;