import { useSelector } from "react-redux";

import MovieCard from "./MovieCard";

const MovieList = () => {

    const movies = useSelector((state) => state.slice.movies);
    const selectedDay = useSelector((state) => state.slice.selectedDay);

    const filteredMovies = movies.filter((movie) =>
        movie.screenings.some((screening) => screening.weekday === selectedDay)
    );

    return (
        <div style = {{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            marginTop: "20px"
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