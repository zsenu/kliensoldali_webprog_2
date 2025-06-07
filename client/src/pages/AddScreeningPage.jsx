import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMovies } from "../redux/moviesThunks.js";

const AddScreeningPage = () => {
    
    const dispatch = useDispatch();
    const movies = useSelector((state) => state.slice.allMovies || []);
    const loginInfo = useSelector((state) => state.slice.loginInfo);

    const [form, setForm] = useState({
        movie_id: "",
        room_id: "1",
        date: "",
        start_time: ""
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        dispatch(fetchAllMovies());
    }, [dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}api/screenings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loginInfo.token}`
                },
                body: JSON.stringify({
                    movie_id: Number(form.movie_id),
                    room_id: Number(form.room_id),
                    date: form.date,
                    start_time: form.start_time
                })
            });

            const data = await response.json();

            console.log(data);
            
            if (response.ok) {
                setMessage("Screening added successfully!");
                setForm({
                    movie_id: "",
                    room_id: "1",
                    date: "",
                    start_time: ""
                });
            } else {
                setMessage(data.message || "Failed to add screening.");
            }
        } catch (error) {
            setMessage("An error occurred: " + error.message);
        }
    };

    return (
        <div style = {{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#222", borderRadius: 8, color: "#fff" }}>
            <h2> Add Screening </h2>
            <form onSubmit = { handleSubmit } style = {{ display: "flex", flexDirection: "column", gap: 16 }}>
                <select
                    name = "movie_id"
                    value = { form.movie_id }
                    onChange = { handleChange }
                    required
                    style = {{ padding: 10, borderRadius: 4, border: "1px solid #444444" }}
                >
                    <option value=""> Select Movie </option>
                    {movies.map((movie) => (
                        <option key = { movie.id } value = { movie.id }>
                            { movie.title }
                        </option>
                    ))}
                </select>
                <select
                    name = "room_id"
                    value = { form.room_id }
                    onChange = { handleChange }
                    required
                    style = {{ padding: 10, borderRadius: 4, border: "1px solid #444444" }}
                >
                    <option value = "1"> Room 1 </option>
                    <option value = "2"> Room 2 </option>
                </select>
                <input
                    type = "date"
                    name = "date"
                    value = { form.date }
                    onChange = { handleChange }
                    required
                    style = {{ padding: 10, borderRadius: 4, border: "1px solid #444444" }}
                />
                <input
                    type = "time"
                    name = "start_time"
                    value = { form.start_time }
                    onChange = { handleChange }
                    required
                    style = {{ padding: 10, borderRadius: 4, border: "1px solid #444444" }}
                />
                <button
                    type = "submit"
                    style = {{
                        padding: 10,
                        borderRadius: 4,
                        border: "none",
                        background: "#c0392b",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                > Add screening </button>
            </form>
            {message && (
                <div style = {{ marginTop: 16, color: "white", textAlign: "center" }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default AddScreeningPage;