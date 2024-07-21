export interface Location {
  id: number;
  url: string;
  description: string;
  country: string;
  userID: number;
  meta: string;
}

export interface List {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  locations: Location[];
}

export interface Data {
  unlisted: List;
  listed: List[];
}

export interface Meta {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
}
