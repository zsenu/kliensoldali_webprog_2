import { useDispatch } from "react-redux";
import { setSelectedMovie } from "../redux/moviesSlice";

const MovieCard = ({ movie }) => {
    
    const dispatch = useDispatch();

    return (
        <div style =
        {{
            backgroundColor: "#ffffff",
            color: "black",
            width: "180px",
            margin: "10px",
            padding: "10px",
            textAlign: "center",
            border: "2px solid #aaaaaa",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "transform 0.2s"
        }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick = {() => dispatch(setSelectedMovie(movie))}
        >

            <img
                src = { `assets/images/${ movie.image }` }
                alt = { `image for ${ movie.title }: ${ movie.image }` }
                style = {{ width: "100%", height: "auto", borderRadius: "5px" }}
            />
            <h3 style = {{ fontSize: "18px", margin: "10px 0" }}> { movie.title } </h3>
            <p style = {{ fontSize: "14px", color: "#666666" }}> { movie.genre } - { movie.duration } minutes </p>
          </div>
    );
};

export default MovieCard;