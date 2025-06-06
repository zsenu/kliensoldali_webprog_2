import { useSelector } from "react-redux";

import MovieCard from "./MovieCard";

const MovieList = () => {

    const movies = useSelector((state) => state.slice.movies);
    const selectedWeek = useSelector((state) => state.slice.selectedWeek);
    const selectedDay = useSelector((state) => state.slice.selectedDay);

    const filteredMovies = movies.filter((movie) =>
        movie.screenings.some((screening) => (screening.week_day === selectedDay && screening.week_number === selectedWeek))
    );

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