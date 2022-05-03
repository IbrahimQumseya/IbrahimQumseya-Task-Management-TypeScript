import { UserState } from '../features/user/userSlice';

export interface Pages {
  id: number;
  name: string;
  path: string;
}
export interface Settings {
  id: number;
  name: string;
}

export interface BodyCreateUserDetails {
  idUser: string;
  location: string;
  address: string;
  number: string;
  telephone: string;
}
export interface BodyUpdateUserDetails {
  firstName: string;
  lastName: string;
  location: string;
  address: string;
  number: string;
  telephone: string;
}
export type User = Omit<UserState, 'isAuthenticated' | 'status'>;
export interface UserDetails {
  id: string;
  location: string;
  address: string;
  number: string;
  telephone: string;
}

export interface SignInInterface {
  username: string;
  password: string;
}
