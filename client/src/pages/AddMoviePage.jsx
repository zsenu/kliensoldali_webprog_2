import { useState } from "react";
import { useSelector } from "react-redux";

const AddMoviePage = () => {

    const [form, setForm] = useState({
        title: "",
        description: "",
        duration: "",
        genre: "",
        release_year: "",
        image_path: ""
    });

    const [message, setMessage] = useState(null);
    const loginInfo = useSelector((state) => state.slice.loginInfo);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/movies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ loginInfo.token }`
                },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    duration: Number(form.duration),
                    genre: form.genre,
                    release_year: Number(form.release_year),
                    image_path: form.image_path
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Movie added successfully!");
                setForm({
                    title: "",
                    description: "",
                    duration: "",
                    genre: "",
                    release_year: "",
                    image_path: ""
                });
            } else {
                setMessage(data.message || "Failed to add movie.");
            }
        } catch (error) {
            setMessage("An error occurred: " + error.message);
        }
    };

    return (
        <div style = {{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#222222", borderRadius: 8, color: "white" }}>
            <h2>Add Movie</h2>
            <form onSubmit = { handleSubmit } style = {{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input
                    type = "text"
                    name = "title"
                    placeholder = "Movie Title"
                    value = { form.title }
                    onChange = { handleChange }
                    required
                    style = {{ padding: 10, borderRadius: 4, border: "1px solid #444444" }}
                />
                <textarea
                    name = "description"
                    placeholder = "Movie Description"
                    value = { form.description }
                    onChange = { handleChange }
                    required
                    style = {{ padding: 10, borderRadius: 4, border: "1px solid #444444", minHeight: 60 }}
                />
                <input
                    type = "number"
                    name = "duration"
                    placeholder = "Length (in minutes)"
                    value = { form.duration }
                    onChange = { handleChange }
                    required
                    min = { 1 }
                    style = {{ padding: 10, borderRadius: 4, border: "1px solid #444444" }}
                />
                <input
                    type = "text"
                    name = "genre"
                    placeholder = "Genre"
                    value = { form.genre }
                    onChange = { handleChange }
                    required
                    style = {{ padding: 10, borderRadius: 4, border: "1px solid #444444" }}
                />
                <input
                    type = "number"
                    name = "release_year"
                    placeholder = "Release Year"
                    value = { form.release_year }
                    onChange = { handleChange }
                    required
                    min = { 1800 }
                    max = { 2100 }
                    style = {{ padding: 10, borderRadius: 4, border: "1px solid #444444" }}
                />
                <input
                    type = "text"
                    name = "image_path"
                    placeholder = "Cover Image URL"
                    value = { form.image_path }
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
                > Add Movie </button>
            </form>
            {message && (
                <div style = {{ marginTop: 16, color: "white", textAlign: "center" }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default AddMoviePage;