import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';

const store = configureStore({
    reducer: {
        slice: moviesReducer
    }
});

export default store;