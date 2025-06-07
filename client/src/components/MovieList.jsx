import { useSelector } from "react-redux";

import MovieCard from "./MovieCard";

const MovieList = () => {

    const movies = useSelector((state) => state.slice.currentWeekMovies);
    const selectedDay = useSelector((state) => state.slice.selectedDay);

    const filteredMovies = movies.filter((movie) =>
        movie.screenings.some((screening) => (screening.week_day === selectedDay))
    );
    
    if (filteredMovies.length === 0) {
        return (
            <div style = {{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                textAlign: "center",
                marginTop: "20px"
            }}>
                <h2>No movies available for the selected day.</h2>
            </div>
        );
    }

    return (
        <div style = {{
            display: "flex",    
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px"
        }}>
            {
                filteredMovies.map((movie) => (
                    <MovieCard key = { movie.id } movie = { movie } />
                ))
            }
        </div>
      );
};

export default MovieList;