import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoginInfo } from "../redux/moviesSlice";

const LoginPage = () => {

    const dispatch = useDispatch();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Login successful!");
                dispatch(setLoginInfo(data));
            } else {
                setMessage(data.message || "Login failed.");
            }
        } catch (error) {
            setMessage("An error occurred: " + error.message);
        }
    };

    return (
        <div style = {{
            maxWidth: "400px",
            margin: "40px auto",
            padding: "24px",
            background: "#222222",
            borderRadius: "8px",
            boxShadow: "0 2px 8px black"
        }}>
            <h2 style = {{ textAlign: "center", color: "#ffffff" }}> Log in </h2>
            <form onSubmit = { handleSubmit } style = {{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input
                    type = "email"
                    name = "email"
                    placeholder = "E-mail"
                    value = { form.email }
                    onChange = { handleChange }
                    required
                    autoComplete = "on"
                    style = {{ padding: "10px", borderRadius: "4px", border: "1px solid #444444" }}
                />
                <input
                    type = "password"
                    name = "password"
                    placeholder = "Password"
                    value = { form.password }
                    onChange = { handleChange }
                    required
                    autoComplete = "on"
                    style = {{ padding: "10px", borderRadius: "4px", border: "1px solid #444444" }}
                />
                <button
                    type = "submit"
                    style = {{
                        padding: "10px",
                        borderRadius: "4px",
                        border: "none",
                        background: "#c0392b",
                        color: "#ffffff",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}> Log in </button>
            </form>
            { message && (
                <div style = {{ marginTop: "16px", color: "#ffffff", textAlign: "center" }}>
                    { message }
                </div>
            )}
        </div>
    );
};

export default LoginPage;