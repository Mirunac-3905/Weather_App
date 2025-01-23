import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState(null);
  const [aqi, setAqi] = useState(null); // State to store AQI

  const getWeatherData = async () => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=7db7f4dc24f41ff2956b0ddce4ddf5da&units=metric`
    );
    let result = await response.json();
    setCity(result);

    // Fetch AQI data based on the coordinates from the weather API
    if (result.coord) {
      const { lon, lat } = result.coord;
      const aqiResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=7db7f4dc24f41ff2956b0ddce4ddf5da`
      );
      const aqiResult = await aqiResponse.json();
      setAqi(aqiResult.list[0].main.aqi); // Set AQI value
    }
  };

  useEffect(() => {
    getWeatherData();
  });

  // Helper function to interpret AQI value
  const interpretAqi = (value) => {
    const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    return levels[value - 1] || "Unknown";
  };

  return (
    <div className="App">
      <div className="weather-card">
        <div className="search">
          <input
            type="search"
            placeholder="enter city name"
            spellCheck="false"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="weather">
          <img
            className="weather-icon"
            src="https://static.vecteezy.com/system/resources/previews/024/825/182/non_2x/3d-weather-icon-day-with-rain-free-png.png"
            alt="weather icon"
          />
          <h1 className="temp">{city?.main?.temp}°C</h1>
          <h2 className="city">{city?.name}</h2>
          <p className="description">{city?.weather?.[0]?.description}</p> {/* Weather description */}
          
          <div className="details">
            <div style={{ display: 'flex' }} className="col">
              <img
                className="humi"
                src="https://static-00.iconduck.com/assets.00/humidity-icon-2048x1675-xxsge5os.png"
                alt="humidity icon"
              />
              <div className="info">
                <p className="humidity">{city?.main?.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
            <div className="col">
              <img
                src="https://cdn-icons-png.flaticon.com/512/136/136712.png"
                alt="wind speed icon"
              />
              <div className="info">
                <p className="wind">{city?.wind?.speed} km/h</p>
                <p>Wind Speed</p>
              </div>
              
            </div>
          </div>
          {/* Sunrise and Sunset Times */}
          <div className="col">
            <p>Sunrise: {city?.sys?.sunrise ? new Date(city.sys.sunrise * 1000).toLocaleTimeString() : "N/A"}</p>
            <p>Sunset: {city?.sys?.sunset ? new Date(city.sys.sunset * 1000).toLocaleTimeString() : "N/A"}</p>
          </div>
        </div>
        
        {/* AQI Section */}
        {aqi && (
          <div className="aqi">
            <h3>Air Quality Index (AQI): {aqi}</h3>
            <p>{interpretAqi(aqi)}</p>
          </div>
        )}
      </div>
    </div>
  );
}


export default App;