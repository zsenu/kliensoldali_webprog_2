import { useDispatch, useSelector } from "react-redux";
import { setSelectedScreening } from "../redux/moviesSlice";

import SeatsSelector from "./SeatsSelector";

const ScreeningSelector = () => {

    const dispatch = useDispatch();

    const movie = useSelector((state) => state.slice.selectedMovie);
    const selectedWeek = useSelector((state) => state.slice.selectedWeek);
    const selectedDay = useSelector((state) => state.slice.selectedDay);
    const selectedScreening = useSelector((state) => state.slice.selectedScreening);

    const screenings = movie.screenings
        .filter((screening) => (screening.week_day === selectedDay && screening.week_number === selectedWeek))
        .sort((a, b) => a.start_time.localeCompare(b.start_time));

    return (
        <div>
            <div style = 
            {{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "5px",
                marginTop: "5px"
            }}>
                <h3 style = {{ width: "100%", textAlign: "center" }}>Showtimes:</h3>
                {
                    screenings.map((screening) => (
                        <button
                        key = { screening.id }
                        onClick = {() => dispatch(setSelectedScreening(screening))}
                        style =
                        {{
                            background: (screening === selectedScreening) ? "white" : "#222222",
                            color: (screening === selectedScreening) ? "black" : "white",
                            width: "80px",
                            height: "50px",
                            borderRadius: "5px",
                            textAlign: "center"
                        }}>
                            { screening.start_time }
                        </button>
                    )
                )}
            </div>
            { selectedScreening ? < SeatsSelector /> : null }
        </div>
    );
};

export default ScreeningSelector;