import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/moviesSlice";

const navLinkStyle = {
    color: "white",
    textDecoration: "none",
    background: "#444",
    padding: "8px 14px",
    borderRadius: "4px",
    marginRight: "8px",
    fontWeight: "bold",
    transition: "background 0.2s",
};

const NavigationBar = () => {

    const dispatch = useDispatch();

    const loginInfo = useSelector((state) => state.slice.loginInfo);
    const role = loginInfo.isAdmin ? " (admin)" : " (user)";

    const handleLogout = () => { dispatch(logout()); };

    return (
        <nav
            style = {{
                width: "100%",
                height: "50px",
                display: "flex",
                alignItems: "center",
                padding: "0 20px",
                gap: "10px",
            }}
        >
            <Link
                to = "/"
                style = {{
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    marginRight: "20px",
                }}
            > Tikera </Link>
            { !loginInfo.isLoggedIn && (
                <div style = {{ marginLeft: "auto"}}>
                    <Link to = "/register" style = { navLinkStyle }>
                        Register
                    </Link>
                    <Link to = "/login" style = { navLinkStyle }>
                        Login
                    </Link>
                </div>
            )}
            { loginInfo.isLoggedIn && (
                <>
                    <div style = {{ marginRight: "10px" }}>{ "Logged in as " + loginInfo.username + role }</div>
                    <Link to = "/bookings" style = { navLinkStyle }>
                        My Bookings
                    </Link>
                </>
            )}
            { loginInfo.isLoggedIn && loginInfo.isAdmin && (
                <div>
                    <Link to = "/addmovie" style = { navLinkStyle }>
                        Add Movie
                    </Link>
                    <Link to = "/addscreening" style = { navLinkStyle }>
                        Add Screening
                    </Link>
                </div>
            )}
            { loginInfo.isLoggedIn && (
                <button
                    onClick = { handleLogout }
                    style = {{
                        marginLeft: "auto",
                        background: "#c0392b",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                > Logout </button>
            )}
        </nav>
    );
};

export default NavigationBar;