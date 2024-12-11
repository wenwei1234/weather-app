  // Convert unit locally
  const convertTemperature = (temp, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return temp;
    return toUnit === "imperial" ? temp * 1.8 + 32 : (temp - 32) / 1.8;
  };

export default convertTemperature;