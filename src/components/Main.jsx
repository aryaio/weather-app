import { useState, useEffect } from 'react';

function Main() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Shiraz');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const API_KEY = '114f56dad78c4758a77163729260606'; 
        // UPDATED: Changed to forecast.json and added days=7
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no`
        );

        if (!response.ok) {
          throw new Error('City not found. Please try another search.');
        }

        const data = await response.json();
        setWeatherData(data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSearch = () => {
    if (searchInput.trim() !== '') {
      setCity(searchInput);
      setSearchInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Helper function to get day name from date string
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Helper function to format 24h time to AM/PM
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  return (
    <>
      <div className="main-header"> 
        <h1>How's the sky looking today?</h1>
      </div>

      <div className="main-container">
        <input 
          type="text" 
          placeholder="Search for a place..." 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>
      
      {loading && <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading weather data...</div>}
      {error && <div style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>{error}</div>}

      {!loading && !error && weatherData && (
        <div className="weather-dashboard">
          
          <div className="dashboard-content">
            
            <div className="country-container">
              <div className="country-header">
                <h3>{weatherData.location.name}, {weatherData.location.country}</h3>
                {/* Dynamically get the local time/date of the searched city */}
                <h4>{new Date(weatherData.location.localtime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</h4>
              </div>
              <h1 className="degrees">{Math.round(weatherData.current.temp_c)}°</h1>
            </div>

            {/* DYNAMIC CURRENT STATS (Feels Like, Humidity, Wind, Precipitation) */}
            <div className="current-stats-container" style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
              <div className="stat-box">
                <h5>Feels Like</h5>
                <h3>{Math.round(weatherData.current.feelslike_c)}°</h3>
              </div>
              <div className="stat-box">
                <h5>Humidity</h5>
                <h3>{weatherData.current.humidity}%</h3>
              </div>
              <div className="stat-box">
                <h5>Wind</h5>
                <h3>{weatherData.current.wind_kph} km/h</h3>
              </div>
              <div className="stat-box">
                <h5>Precipitation</h5>
                <h3>{weatherData.current.precip_mm} mm</h3>
              </div>
            </div>
              
            <h4>Daily forecast</h4>
            <div className="daily-container">
              {/* DYNAMIC DAILY FORECAST */}
              {weatherData.forecast.forecastday.map((day, index) => (
                <div className="daily" key={index}>
                  <h5>{index === 0 ? 'Today' : getDayName(day.date)}</h5>
                  <img src={day.day.condition.icon} alt="weather icon" width="40" />
                  <h3>{Math.round(day.day.maxtemp_c)}°</h3>
                </div>
              ))}
            </div>
          </div>      
            
          <div className="hourly-sidebar">
            <div className="hourly-container">
              <h4>Hourly Forecast</h4>
              {/* DYNAMIC HOURLY FORECAST (Taking the first 8 hours of today) */}
              {weatherData.forecast.forecastday[0].hour.slice(0, 8).map((hour, index) => (
                <div className="hourly" key={index}>
                  <p>{formatTime(hour.time)}</p>
                  <img src={hour.condition.icon} alt="icon" width="40" />
                  <h4>{Math.round(hour.temp_c)}°</h4>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </>
  );
}

export default Main;
