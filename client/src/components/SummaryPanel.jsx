import { useDispatch, useSelector } from "react-redux";
import { setBookings } from "../redux/moviesSlice";

import UseLocalStorage from "./UseLocalStorage";

const SummaryPanel = ({ seats, setSeats, ticketTypes, adultTickets, studentTickets, seniorTickets, resetSelection, resetTickets }) => {

    const dispatch = useDispatch();

    const movie = useSelector((state) => state.slice.selectedMovie);
    const selectedDay = useSelector((state) => state.slice.selectedDay);
    const screening = useSelector((state) => state.slice.selectedScreening);

    const totalTickets = adultTickets + studentTickets + seniorTickets;
    const totalPrice = (adultTickets * ticketTypes[0].price) + (studentTickets * ticketTypes[1].price) + (seniorTickets * ticketTypes[2].price);

    const [localBookings, setLocalBookings] = UseLocalStorage(`bookings-${ screening.id }`, []);

    const handlePurchase = () => {
        const newBookings = [];
        seats.forEach((row, rowIndex) => {
            row.forEach((seat, colIndex) => {
                if (seat === 1) {
                    newBookings.push({ row: rowIndex + 1, seat: colIndex + 1 });
                }
            });
        });

        const allBookings = [...screening.bookings, ...localBookings, ...newBookings];
        setLocalBookings(allBookings);
        dispatch(setBookings(allBookings));

        const updatedSeats = Array.from({ length: screening.room.rows }, () => Array(screening.room.seatsPerRow).fill(0));
        allBookings.forEach((booking) => { updatedSeats[booking.row - 1][booking.seat - 1] = -1; });
        setSeats(updatedSeats);
        resetSelection();
        resetTickets();

        alert("Booking finalized and saved to localStorage!");
    }

    return (
        <div style = {{
            background: "#222222",
            color: "white",
            paddingLeft: "20px",
            paddingRight: "20px",
            border: "2px solid white",
            borderRadius: "10px",
            marginTop: "20px",
            textAlign: "center"
        }}>
            <div style = {{ textAlign: "left" }}>
                <h3 style = {{ textAlign: "center" }}>Booking summary:</h3>
                <p style = {{ margin: "3px 0px" }}>Movie Title: <strong>{ movie.title }</strong></p>
                <p style = {{ margin: "3px 0px" }}>Screening time: <strong>{ selectedDay }, { screening.start_time }</strong> ({ movie.duration } minutes)</p>
                <p style = {{ margin: "0px" }}><strong>{ totalTickets } seats</strong> selected:</p>
                <ul style = {{ marginTop: "0px" }}>
                {
                    seats.map((row, rowIndex) => (
                        row.some((seat) => seat === 1) ? (
                        <li key={ rowIndex }>
                            row { rowIndex + 1 } -
                            {
                                row.map((seat, seatIndex) => (
                                    seat === 1 ? <span key={ seatIndex }> #{ seatIndex + 1 } </span> : null
                                ))
                            }
                        </li>
                    ) : null
                    ))
                }
                </ul>
            </div>
            <h4>Tickets selected for purchase:</h4>
            <div>
                {
                    adultTickets > 0 ? (
                        <pre>Adult      { String(adultTickets).padStart(2, " ") } x { ticketTypes[0].price } HUF    { String(adultTickets * ticketTypes[0].price).padStart(6, " ") } HUF</pre>
                    ) : null
                }
                {
                    studentTickets > 0 ? (
                        <pre>Student    { String(studentTickets).padStart(2, " ") } x { ticketTypes[1].price } HUF    { String(studentTickets * ticketTypes[1].price).padStart(6, " ") } HUF</pre>
                    ) : null
                }
                {
                    seniorTickets > 0 ? (
                        <pre>Senior     { String(seniorTickets).padStart(2, " ") } x { ticketTypes[2].price } HUF    { String(seniorTickets * ticketTypes[2].price).padStart(6, " ") } HUF</pre>
                    ) : null
                }
                <pre><hr style = {{ width: "65%" }}/><br />
                    Total:                      { String(totalPrice).padStart(6, " ") } HUF
                </pre>
            </div>
            <button
                onClick = {() => handlePurchase()}
                style = {{
                    background: "#5fc850",
                    color: "black",
                    width: "40%",
                    height: "50px",
                    border: "2px solid white",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: "10px"
                }}
            >
                Purchase tickets
            </button>
        </div>
    );
};

export default SummaryPanel;