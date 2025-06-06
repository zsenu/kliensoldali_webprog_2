import { createSlice } from '@reduxjs/toolkit';

import { fetchMovies } from './moviesThunks';

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

const initialState = {
    movies: [],
    selectedWeek: getWeekNumber(new Date()),
    selectedDay: new Date().getDay(),
    selectedMovie: null,
    selectedScreening: null,
    loginInfo: {
        isLoggedIn: false,
        isAdmin: false,
        username: null,
        token: null
    },
    loading: false,
    error: null
};

const moviesSlice = createSlice({
    name: 'slice',
    initialState,
    reducers: {
        setMovies(state, action) {
            state.movies = action.payload;
        },
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
            state.selectedScreening.bookings = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload.data;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setMovies, setSelectedWeek, setSelectedDay, setSelectedMovie, setSelectedScreening, setBookings } = moviesSlice.actions;
export default moviesSlice.reducer;