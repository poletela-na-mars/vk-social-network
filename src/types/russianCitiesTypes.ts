export interface Coords {
  lat: string;
  lon: string;
}

export interface City {
  coords: Coords;
  district: string;
  name: string;
  population: number;
  subject: string;
}