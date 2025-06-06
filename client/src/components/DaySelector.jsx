import { useDispatch, useSelector } from "react-redux";
import { setSelectedDay } from "../redux/moviesSlice";

const DaySelector = () => {

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const dispatch = useDispatch();
    
    const selectedDay = useSelector((state) => state.slice.selectedDay);

    return (
        <div style = {{ width: "100%", textAlign: "center" }}>
            { days.map((day) => (
                <button
                    key = { day }
                    onClick = {() => dispatch(setSelectedDay(day))}
                    style =
                    {
                        {
                            backgroundColor: selectedDay === day ? "maroon" : "#eeeeee",
                            color: selectedDay === day ? "#ffffff" : "#000000",
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
    );
};

export default DaySelector;