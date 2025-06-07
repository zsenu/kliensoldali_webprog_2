import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    password_confirmation: form.confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Registration successful!");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setMessage(data.message || "Registration failed.");
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
            <h2 style = {{ textAlign: "center", color: "white" }}> Register </h2>
            <form onSubmit = { handleSubmit } style = {{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input
                    type = "text"
                    name = "name"
                    placeholder = "Name"
                    value = { form.name }
                    onChange = { handleChange }
                    required
                    autoComplete = "on"
                    style = {{ padding: "10px", borderRadius: "4px", border: "1px solid #444444" }}
                />
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
                <input
                    type = "password"
                    name = "confirmPassword"
                    placeholder = "Confirm Password"
                    value = { form.confirmPassword }
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
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}> Register </button>
            </form>
            { message && (
                <div style = {{ marginTop: "16px", color: "white", textAlign: "center" }}>
                    { message }
                </div>
            )}
        </div>
    );
};

export default RegisterPage;