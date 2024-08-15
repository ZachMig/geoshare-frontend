export interface List {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  locations: Location[];
}

export interface Location {
  id: number;
  url: string;
  description: string;
  countryName: string;
  userID: number;
  meta: string;
}

export interface Meta {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  jwt: string;
}
