import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties
class City {
  private name: string;
  private _id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this._id = id;
  }
  getName() {
    return this.name;
  }
  get id() {
    return this._id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const filestorge = await fs.promises.readFile(path.join(__dirname, '../../dbdb.json'), 'utf-8');
    return JSON.parse(filestorge);
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await fs.promises.writeFile(path.join(__dirname, '../../dbdb.json'), JSON.stringify(cities));
  }

  async getCities() {
  const cities = await this.read();
  return cities;
}
async addCity(city: string) {
  const cities = await this.read();
  const id = cities.length + 1;
  const newCity = new City(city, id.toString());
  cities.push(newCity);
  await this.write(cities);
}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
