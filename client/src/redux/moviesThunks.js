import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAllMovies = createAsyncThunk(
    "slice/fetchAllMovies",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/movies`);
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to fetch movies");
            }
            return data.data || data; // adjust if your API returns { data: [...] }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMoviesByWeek = createAsyncThunk(
    'slice/fetchMoviesByWeek',
    async (weekNumber, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/movies/week?week_number=${weekNumber}`);
            if (!response.ok) throw new Error('Failed to fetch movies for week');
            const data = await response.json();
            return data.data; // adjust if your API returns differently
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchUsersBookings = createAsyncThunk(
    "slice/fetchUsersBookings",
    async (token, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to fetch bookings");
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);