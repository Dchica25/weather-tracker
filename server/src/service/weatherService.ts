import dotenv from 'dotenv';
dotenv.config();

// Define interfaces
interface Coordinates {
  lat: number;
  lon: number;
  name: string;
  state: string;
  country: string;
}

interface Weather {
  city: string;
  date: string;
  icon: string;
  icondescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

class WeatherService {
  private baseURL: string = 'https://api.openweathermap.org';
  private apiKey: string = process.env.API_KEY || '';
  private cityName: string = '';

  // Fetch location data
  private async fetchLocationData(query: string, requestId: string) {
    console.log(requestId, 'fetchLocationData');
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    const data = await response.json();
    if (data.length === 0) {
      throw new Error('Location not found.');
    }
    return data[0];
  }

  // Extract coordinates
  private destructureLocationData(locationData: any, requestId: string): Coordinates {
    console.log(requestId, 'destructureLocationData', locationData);
    const { lat, lon, name, state, country } = locationData;
    return { lat, lon, name, state, country };
  }

  // Build weather query
  private buildWeatherQuery(coordinates: Coordinates, requestId: string): string {
    console.log(requestId, 'buildWeatherQuery');
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
  }

  // Fetch weather data
  private async fetchWeatherData(coordinates: Coordinates, requestId: string) {
    console.log(requestId, 'fetchWeatherData');
    const weatherQuery = this.buildWeatherQuery(coordinates, requestId);
    const response = await fetch(weatherQuery);
    const data = await response.json();
    return data;
  }

  // Parse current weather
  private parseCurrentWeather(response: any, requestId: string): Weather {
    console.log(requestId, 'parseCurrentWeather');
    const currentWeather = response.list[0];
    return {
      city: response.city.name,
      date: currentWeather.dt_txt,
      icon: currentWeather.weather[0].icon,
      icondescription: currentWeather.weather[0].description,
      tempF: currentWeather.main.temp,
      windSpeed: currentWeather.wind.speed,
      humidity: currentWeather.main.humidity,
    };
  }

  // Build forecast array
  private buildForecastArray(currentWeather: Weather, weatherData: any[], requestId: string): Weather[] {
    console.log(requestId, 'buildForecastArray');
    const forecast = weatherData.slice(1, 6).map((entry: any) => ({
      city: currentWeather.city,
      date: entry.dt_txt,
      icon: entry.weather[0].icon,
      icondescription: entry.weather[0].description,
      tempF: entry.main.temp,
      windSpeed: entry.wind.speed,
      humidity: entry.main.humidity,
    }));
    return [currentWeather, ...forecast];
  }

  // Main method to get weather for a city
  async getWeatherForCity(city: string, requestId: string) {
    console.log(requestId, 'getWeatherForCity', city);
    this.cityName = city;
    const locationData = await this.fetchLocationData(city, requestId);
    const coordinates = this.destructureLocationData(locationData, requestId);
    const weatherData = await this.fetchWeatherData(coordinates, requestId);
    const currentWeather = this.parseCurrentWeather(weatherData, requestId);
    const forecast = this.buildForecastArray(currentWeather, weatherData.list, requestId);
    return forecast;
  }
}

export default new WeatherService();
