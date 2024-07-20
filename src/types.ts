export interface Location {
  url: string;
  description: string;
  countryID: number;
  userID: number;
}

export interface List {
  name: string;
  description: string;
  isPublic: boolean;
  locations: Location[];
}

export interface Data {
  unlisted: Location[];
  listed: List[];
}
