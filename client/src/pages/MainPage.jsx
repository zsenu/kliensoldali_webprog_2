import WeekAndDaySelector from "../components/WeekAndDaySelector";
import MovieList from "../components/MovieList";
import SelectedMovie from "../components/SelectedMovie";

const MainPage = () => {

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
            </div>
            < WeekAndDaySelector />

            <div style = {{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                gap: "20px",
            }}>
                <div style = {{ flex: 1, minWidth: 0 }}>
                    < MovieList />
                </div>
                <div style = {{ width: "500px", minWidth: "300px" }}>
                    < SelectedMovie />
                </div>
            </div>
        </div>
    );
};

export default MainPage;