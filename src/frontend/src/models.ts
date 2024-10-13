export interface UserData {
  type: string;
  id: string;
  username: string | undefined;
  email: string | undefined;
  given_name: string;
  family_name: string;
}

export interface UserStub {
  id: string;
  name: string;
}

export interface Event {
  id: number;
  name: string;
  location: string;
  startTime: Date;
  endTime: Date;
  creator: UserStub;
  cars?: Car[];
}

export interface Car {
  id: number;
  driver: UserStub;
  riders: UserStub[];
  maxCapacity: number;
  departureTime: Date;
  returnTime: Date;
  comment: string;
}

export enum PopupType {
  Danger = 'bg-danger',
  Warning = 'bg-warning',
  Success = 'bg-success',
  Default = 'bg-primary'
}

export interface Place {
  place_id: number;
  display_name: string;
}
