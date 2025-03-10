import { useEffect, useState } from 'react';
import './App.css';
import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloud.jpg";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.jpg";
import snowIcon from "./assets/snow.png";
import searchIcon from "./assets/search.png";
import humdityIcon from "./assets/humdity.png";
import windIcon from "./assets/wind.png";

// WeatherDetails Component
const WeatherDetails = ({ icon, temp, city, country, lat, log, humdity, wind }) => {
  return (
    <div className='weather-details'>
      <div className='image'>
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className='lat'>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>Longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className='datacontainer'>
        <div className='element'>
          <img src={humdityIcon} alt="Humidity" className='icon' />
          <div className="data">
            <div className="humditypercent">{humdity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="Wind Speed" className='icon' />
          <div className="data">
            <div className="windpercent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const apikey = "a5cb6fd47ebb2c2670013f7850fb715f";
  const [text, setText] = useState("Hosur");
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Hosur");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humdity, setHumdity] = useState(0);
  const [wind, setWind] = useState(0);

  const [citynotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": drizzleIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon
  };

  const search = async () => {
    setLoading(true);
    setCityNotFound(false);
    setError(null);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&units=metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === "404") {
        setCityNotFound(true);
        setIcon(snowIcon); // Default icon when city is not found
        return;
      }

      setHumdity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
    } catch (error) {
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className='container'>
      <div className='inputcontainer'>
        <input
          type='text'
          placeholder='Search City'
          className='cityinput'
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className='searchicon' onClick={search}>
          <img src={searchIcon} height="20px" width="20px" alt="Search" />
        </div>
      </div>

      {loading && <div className='loadingmessage'>Loading...</div>}
      {error && <div className='errormessage'>{error}</div>}
      {citynotFound && <div className='citynotfound'>City not found</div>}

      {!loading && !citynotFound && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          log={log}
          humdity={humdity}
          wind={wind}
        />
      )}

      <p className='copyright'>
        Developed by <span>KARAN</span>
      </p>
    </div>
  );
}

export default App;
