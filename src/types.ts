export interface Actionable {
  id: number;
}

export interface Stringable {
  toString(): string;
}

export interface List extends Actionable, Stringable {
  id: number;
  name: string;
  description: string;
  locations: Location[];
  toString(): string;
}

export interface Location extends Actionable {
  id: number;
  url: string;
  description: string;
  countryName: string;
  userID: number;
  meta: string;
}

export interface LocInfo {
  id: string;
  url: string;
  description: string;
  countryName: string;
  meta: string;
  userID: number;
  listIDs: number[];
}

export interface ListInfo {
  id: string;
  name: string;
  description: string;
}

export interface Meta extends Stringable {
  id: number;
  name: string;
}

export interface Country extends Stringable {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  jwt: string;
}

export interface LocationFilter {
  name: string;
  country: string;
  meta: string;
}

export interface Handlers {
  handleEdit: (item: Actionable) => void;
  handleUnlink: null | ((item: Actionable) => void);
  handleDelete: (item: Actionable) => void;
}
