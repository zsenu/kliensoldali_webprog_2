import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchMovies = createAsyncThunk(
    'movies/fetchMovies',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/movies`);
            if (!response.ok) throw new Error('Failed to fetch movies');
            const data = await response.json();
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);