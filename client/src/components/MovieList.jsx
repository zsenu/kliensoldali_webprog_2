import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ movies, selectedDay, setSelectedMovie }) => {
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
                    <MovieCard key = {movie.id} movie = {movie} setSelectedMovie = {setSelectedMovie} />
                ))
            }
            
        </div>
      );
};

export default MovieList;