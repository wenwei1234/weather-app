  // Radio buttons for unit
  const WeatherToggle = ({ unit, changeUnit }) => (
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
  

  export default WeatherToggle;