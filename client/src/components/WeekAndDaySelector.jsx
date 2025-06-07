import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedWeek, setSelectedDay } from "../redux/moviesSlice";
import { fetchMoviesByWeek } from "../redux/moviesThunks";

const getDate = (weekNumber, dayNumber) =>{

    const why_are_dates_so_weird = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    const year = new Date().getFullYear();
    const firstDay = new Date(year, 0, 1);

    const daysOffset = (weekNumber - 2) * 7 + (dayNumber - 1);
    firstDay.setDate(firstDay.getDate() + daysOffset - 1 + 7);

    return firstDay.toISOString().slice(0, 10) + " - " + why_are_dates_so_weird[firstDay.getDay()];
};

const WeekAndDaySelector = () => {

    const handleWeekChange = (increment) => {
        dispatch(setSelectedWeek(selectedWeek + increment));
        dispatch(fetchMoviesByWeek(selectedWeek + increment));
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const dispatch = useDispatch();
    
    const selectedWeek = useSelector((state) => state.slice.selectedWeek);
    const selectedDay = useSelector((state) => state.slice.selectedDay);

    useEffect(() => { dispatch(fetchMoviesByWeek(selectedWeek)); }, [dispatch, selectedWeek]);

    return (
        <div>
            <div style = {{ width: "100%", textAlign: "center", marginBottom: "10px" }}>
                <button onClick = {() => { handleWeekChange(-1); }}> { "<" } </button>
                <span style = {{ margin: "0 10px" }}> Week { selectedWeek } </span>
                <button onClick = {() => { handleWeekChange(+1); }}> { ">" } </button>
            </div>
            <div style = {{ width: "100%", textAlign: "center", marginBottom: "10px" }}>
                { days.map((day) => (
                    <button
                        key = { day }
                        onClick = {() => dispatch(setSelectedDay(days.indexOf(day) + 1))}
                        style =
                        {
                            {
                                backgroundColor: selectedDay === days.indexOf(day) + 1 ? "maroon" : "#eeeeee",
                                color: selectedDay === days.indexOf(day) + 1 ? "white" : "black",
                                margin: "5px",
                                padding: "10px",
                                border: "2px solid #eeeeee",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }
                        }
                    >
                    { day }
                    </button>
                ))}
            </div>
            <div style = {{ width: "100%", textAlign: "center" }}>
                Currently viewing: { getDate(selectedWeek, selectedDay) }
            </div>
        </div>
    );
};

export default WeekAndDaySelector;