import { UserState } from '../features/user/userSlice';
export enum UserRoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}
export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}
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
