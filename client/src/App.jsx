import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMovies, setSelectedMovie } from "./redux/moviesSlice";

import DaySelector from "./components/DaySelector";
import MovieList from "./components/MovieList";
import SelectedMovie from "./components/SelectedMovie";

// todo: remove this
import moviesData from "./movies.json";

const App = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMovies(moviesData));
    }, [dispatch]);

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
        <div style = {{ padding: "20px" }}>
            <h1 style = {{ textAlign: "center" }}>Cinema Booking</h1>
            <div style={{ width: "100%", textAlign: "center" }}>
                <p>Made by: Fiók Nándor (GSTQLI)</p>
                <button onClick = { clearScriptData } style = {{ marginBottom: "20px" }}>
                    Clear localStorage data related to this page
                </button>
            </div>
            < DaySelector />
            
            <div style =
            {{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
            }}>
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

export default App;