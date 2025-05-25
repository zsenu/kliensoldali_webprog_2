import React from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DaySelector = ({ selectedDay, onDayChange }) => {
    return (
        <div style = {{ width: "100%", textAlign: "center" }}>
            { days.map((day) => (
                <button
                    key = {day}
                    onClick = {() => onDayChange(day)}
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
                {day}
                </button>
            ))}
        </div>
    )
}

export default DaySelector;