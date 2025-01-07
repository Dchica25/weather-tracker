import { Router } from 'express';
const router = Router();
import { randomUUID } from 'crypto';

import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  console.log("POST /api/weather", req.ip);
  const requestId = randomUUID();
  try {
    const { city } = req.body;
    console.log(requestId, "city", city); 

    const weather = await WeatherService.getWeather(city, requestId);
    await HistoryService.addCity(city);
    return res.status(200).send("post /api/weather");




    return res.status(200).send("post /api/weather");
  } catch (error) {
    console.log(requestId, "caught error"); 0
    console.error(error);
    if (error instanceof TypeError) {
      return res.status(400).send("bad request");
    }
    return res.status(500).send("internal server error");
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  const requestId = randomUUID();
  console.log(requestId, "GET /api/weather/history", req.ip);
  try {
    const cities = await HistoryService.getCities();
    res.status(200).send("get /api/weather/history");
  } catch (error) {
    console.log(requestId, "caught error");
    console.error(error);
    return res.status(500).send("internal server error");
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => { });

export default router;
