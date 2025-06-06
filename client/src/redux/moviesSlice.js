import { createSlice } from '@reduxjs/toolkit';

const daysShifted = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const initialState = {
    movies: [],
    selectedDay: daysShifted[new Date().getDay()],
    selectedMovie: null,
    selectedScreening: null,
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
    }
});

export const { setMovies, setSelectedDay, setSelectedMovie, setSelectedScreening, setBookings } = moviesSlice.actions;
export default moviesSlice.reducer;