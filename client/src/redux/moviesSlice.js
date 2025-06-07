import { createSlice } from '@reduxjs/toolkit';

import { fetchAllMovies, fetchMoviesByWeek, fetchUsersBookings } from './moviesThunks';

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

const initialState = {
    allMovies: [],
    currentWeekMovies: [],
    selectedWeek: getWeekNumber(new Date()),
    selectedDay: new Date().getDay(),
    selectedMovie: null,
    selectedScreening: null,
    loginInfo: {
        isLoggedIn: false,
        isAdmin: false,
        username: null,
        email: null,
        token: null
    },
    usersBookings: [],
    loading: false,
    error: null
};

const moviesSlice = createSlice({
    name: 'slice',
    initialState,
    reducers: {
        setSelectedWeek(state, action) {
            state.selectedWeek = action.payload;
            state.selectedMovie = null;
            state.selectedScreening = null;
        },
        setSelectedDay(state, action) {
            state.selectedDay = action.payload;
            state.selectedMovie = null;
            state.selectedScreening = null;
        },
        setSelectedMovie(state, action) {
            state.selectedMovie = action.payload;
            state.selectedScreening = null;
        },
        setSelectedScreening(state, action) {
            state.selectedScreening = action.payload;
        },
        setBookings(state, action) {
            state.selectedScreening = {
                ...state.selectedScreening,
                bookings: action.payload
            };
        },
        setLoginInfo(state, action) {
            state.loginInfo = {
                isLoggedIn: true,
                isAdmin: action.payload.data.user.role === "admin",
                username: action.payload.data.user.name,
                email: action.payload.data.user.email,
                token: action.payload.data.token
            }
        },
        logout(state) {
            state.loginInfo = {
                isLoggedIn: false,
                isAdmin: false,
                username: null,
                email: null,
                token: null
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.allMovies = action.payload;
            })
            .addCase(fetchAllMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMoviesByWeek.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMoviesByWeek.fulfilled, (state, action) => {
                state.loading = false;
                state.currentWeekMovies = action.payload;
            })
            .addCase(fetchMoviesByWeek.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUsersBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsersBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.usersBookings = action.payload;
            })
            .addCase(fetchUsersBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setMovies, setSelectedWeek, setSelectedDay, setSelectedMovie, setSelectedScreening, setBookings, setLoginInfo, logout } = moviesSlice.actions;
export default moviesSlice.reducer;