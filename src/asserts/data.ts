import { Pages, Settings } from '../interfaces/data.interface';

const pages: Array<Pages> = [
  {
    id: 1,
    name: 'Login',
    path: '/login',
  },
  {
    id: 2,
    name: 'Register',
    path: '/register',
  },
  {
    id: 3,
    name: 'Home',
    path: '/home',
  },
  {
    id: 4,
    name: 'Profile',
    path: '/user/profile',
  },
];
const settings: Array<Settings> = [
  {
    name: 'Profile',
    id: 1,
  },
  {
    name: 'Account',
    id: 2,
  },
  {
    name: 'Dashboard',
    id: 3,
  },
  {
    name: 'Logout',
    id: 4,
  },
];

export { settings, pages };
