import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingScreen from './LoadingScreen';
import './WeatherApp.css';

function WeatherApp() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);


  const backgroundImages = {
    sunny: './public/imagen_soleada.png',
    rainy: './public/lluvia.png',
    clouds: './public/nublado.png',
  };

  const backgroundStyle = {
    backgroundImage: weatherData
      ? `url(${backgroundImages[weatherData.weather[0].main.toLowerCase()]})`
      : '',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  };

  const toggleUnits = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemperature = (tempInKelvin) => {
    if (isCelsius) {
      return tempInKelvin - 273.15; // Conversión a Celsius
    } else {
      return (tempInKelvin - 273.15) * 1.8 + 32; // Conversión a Fahrenheit
    }
  };

 
  useEffect(() => {
    async function fetchData() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = '1a7b9cc2a152266f81c7d13a4615a9f2';

            try {
              const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
              );

              setLatitude(lat);
              setLongitude(lon);
              setWeatherData(response.data);
              setLoading(false);
            } catch (error) {
              console.error('Error al obtener datos del clima:', error);
              setError('Error al obtener datos del clima. Inténtalo de nuevo más tarde.');
              setLoading(false);
            }
          },
          function (error) {
            console.error('Error al obtener la geolocalización:', error);
            setLoading(false);
          }
        );
      } else {
        console.error('Geolocalización no soportada en este navegador.');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="weather-app" style={backgroundStyle}>
      <h1 className="app-title"> Weather App</h1>
      {loading ? (
        <p>Obteniendo ubicación y datos del clima...</p>
      ) : (
        <div className="weather-info">
          <p>Ciudad: {weatherData.name}</p>
          <p>País: {weatherData.sys.country}</p>
          <p>Latitud: {latitude}</p>
          <p>Longitud: {longitude}</p>
          {weatherData && (
            <div>
              <h2>Información del clima:</h2>
              <p>Condición del clima: {weatherData.weather[0].description}</p>
              <p>Velocidad del viento: {weatherData.wind.speed} m/s</p>
              <p>Porcentaje de nubes: {weatherData.clouds.all}%</p>
              <p>Presión atmosférica: {weatherData.main.pressure} hPa</p>
              <p>Temperatura actual: {weatherData.main.temp} K</p>
              <p>
                Temperatura actual: {convertTemperature(weatherData.main.temp).toFixed(2)}{' '}
                {isCelsius ? '°C' : '°F'}
              </p>
              <button className="buttom-temp" onClick={toggleUnits}>
                Cambiar Unidades ({isCelsius ? '°F' : '°C'})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
