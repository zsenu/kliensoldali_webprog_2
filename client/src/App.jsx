import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';

import RequireUser from './components/RequireUser';
import RequireAdmin from './components/RequireAdmin';
import RequireGuest from './components/RequireGuest';

import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import BookingsPage from './pages/BookingsPage';
import AddMoviePage from './pages/AddMoviePage';
import AddScreeningPage from './pages/AddScreeningPage';

const App = () => (

    < BrowserRouter >
        < NavigationBar />
        < Routes >
            < Route path = "/" element = { < MainPage /> } />
            < Route path = "/register" element = { 
                < RequireGuest >    
                    < RegisterPage /> 
                </ RequireGuest >
            } />
            < Route path = "/login" element = { 
                < RequireGuest >    
                    < LoginPage /> 
                </ RequireGuest >
            } />
            < Route path = "/bookings" element = { 
                < RequireUser >    
                    < BookingsPage /> 
                </ RequireUser >
            } />
            < Route path = "/addmovie" element = { 
                < RequireAdmin >    
                    < AddMoviePage /> 
                </ RequireAdmin >
            } />
            < Route path = "/addscreening" element = { 
                < RequireAdmin >    
                    < AddScreeningPage /> 
                </ RequireAdmin >
            } />
            < Route path = "*" element = { < Navigate to = "/" /> } />
        </ Routes >
    </ BrowserRouter >

);

export default App;