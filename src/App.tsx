import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate, Outlet, BrowserRouter } from 'react-router-dom';

import NavBar from './components/NavBar';
import SignIn from './features/auth/SignIn';
import SignUp from './features/auth/SignUp';
import Home from './screens/Home';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/store';
import jwtDecode from 'jwt-decode';
import { login, logout, setUser } from './features/user/userSlice';
import UserProfile from './screens/user/UserProfile';

function App() {
  const token = sessionStorage.getItem('user');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  useEffect(() => {
    if (!token) return;
    const { exp, user } = jwtDecode<any>(token);
    dispatch(setUser(user));
    const dateNow = +new Date();
    exp * 1000 < dateNow ? dispatch(logout()) : dispatch(login(token));
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/user/profile' element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
