import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSelectedMovie } from "../redux/moviesSlice";
import { fetchMovies } from "../redux/moviesThunks";

import WeekAndDaySelector from "../components/WeekAndDaySelector";
import MovieList from "../components/MovieList";
import SelectedMovie from "../components/SelectedMovie";

const MainPage = () => {

    const dispatch = useDispatch();

    useEffect(() => { dispatch(fetchMovies()); }, [dispatch]);

    const clearScriptData = () => {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("bookings-")) {
                localStorage.removeItem(key);
            }
        });
        alert("Cleared localStorage data related to this page.");
        dispatch(setSelectedMovie(null));
    };

    return (
        <div
            style = {{
                padding: "20px",
                maxWidth: "1200px",
                margin: "0 auto",
                boxSizing: "border-box",
            }}
        >
            <h1 style = {{ textAlign: "center" }}> Cinema Booking </h1>
            <div style = {{ width: "100%", textAlign: "center" }}>
                <p> Made by: Fiók Nándor (GSTQLI) </p>
                <button onClick = {() => { clearScriptData; }} style = {{ marginBottom: "20px" }}>
                    Clear localStorage data related to this page
                </button>
            </div>
            < WeekAndDaySelector />

            <div
                style = {{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                    gap: "20px",
                }}
            >
                <div style = {{ width: "60%" }}>
                    < MovieList />
                </div>
                <div style = {{ width: "40%" }}>
                    < SelectedMovie />
                </div>
            </div>
        </div>
    );
};

export default MainPage;