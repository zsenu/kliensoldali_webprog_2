import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersBookings } from "../redux/moviesThunks.js";

import BookingCard from "../components/BookingCard.jsx";

const BookingsPage = () => {

    const dispatch = useDispatch();
    const loginInfo = useSelector((state) => state.slice.loginInfo);
    const usersBookings = useSelector((state) => state.slice.usersBookings);

    useEffect(() => {
        if (loginInfo.isLoggedIn) {
            dispatch(fetchUsersBookings(loginInfo.token));
        }
    }, [dispatch, loginInfo]);

    const bookings = usersBookings?.data || [];

    const now = new Date();
    const upcoming = [];
    const previous = [];
    bookings.forEach((booking) => {
        const screeningDate = new Date(booking.screening.start_time);
        if (screeningDate >= now) { upcoming.push(booking); }
        else { previous.push(booking); }
    });

    return (
        <div style = {{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
            <h2 style = {{ color: "white", marginBottom: 24 }}>My Bookings</h2>
            { upcoming.length === 0 && (
                <div style = {{ color: "white" }}>No upcoming bookings found.</div>
            )}
            { upcoming.map((booking) => < BookingCard key = { booking.id } booking = { booking } isPast = { false } />)}

            {previous.length > 0 && (
                <>
                    <h2 style = {{ color: "white", marginTop: 40 }}>Previous bookings</h2>
                    { previous.map((booking) => < BookingCard key = { booking.id } booking = { booking } isPast = { true } />)}
                </>
            )}
        </div>
    );
};

export default BookingsPage;