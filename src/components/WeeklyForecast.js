import convertTemperature from "./ConvertTemp";

  // Component to display weekly forecast
  const WeeklyForecast = ({ rawWeatherData, unit}) => {
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

export default WeeklyForecast;