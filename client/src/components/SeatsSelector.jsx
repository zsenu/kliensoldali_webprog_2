import { useState , useEffect } from "react";
import { useSelector } from "react-redux";

import SummaryPanel from "./SummaryPanel";

const SeatsSelector = () => {
    
    const ticketTypes = [
        { type: "Adult",   price: 2500 },
        { type: "Student", price: 2000 },
        { type: "Senior",  price: 1800 }
    ];
    
    const screening = useSelector((state) => state.slice.selectedScreening);

    const rows = screening.room.rows;
    const cols = screening.room.seatsPerRow;
    const totalSeats = rows * cols;
    const availableSeats = totalSeats - screening.bookings.length;
    
    // seat status: 0 = free, -1 = booked, 1 = selected
    const [seats, setSeats] = useState( Array.from({ length: rows }, () => Array(cols).fill(0)));

    useEffect(() => {
        setSelectedAdultTickets(0);
        setSelectedStudentTickets(0);
        setSelectedSeniorTickets(0);
        const newSeats = Array.from({ length: rows }, () => Array(cols).fill(0));
        screening.bookings.forEach((booking) => { newSeats[booking.row - 1][booking.seat - 1] = -1; });
        setSeats(newSeats);
    }, [screening, rows, cols]);

    const [selectedAdultTickets, setSelectedAdultTickets] = useState(0);
    const [selectedStudentTickets, setSelectedStudentTickets] = useState(0);
    const [selectedSeniorTickets, setSelectedSeniorTickets] = useState(0);
    const selectedTickets = selectedAdultTickets + selectedStudentTickets + selectedSeniorTickets;

    const [selectedSeats, setSelectedSeats] = useState(0);

    const handleSeatClick = (row, col) => {
        if (seats[row][col] === 0 && selectedSeats < selectedTickets)
        {
            seats[row][col] = 1;
            setSelectedSeats(selectedSeats + 1);
        }
        else if (seats[row][col] === 1)
        {
            seats[row][col] = 0;
            setSelectedSeats(selectedSeats - 1);
        }
    }

    const resetSelection = () => {
        const newSeats = Array.from({ length: rows }, () => Array(cols).fill(0));
        screening.bookings.forEach((booking) => { newSeats[booking.row - 1][booking.seat - 1] = -1; });
        setSeats(newSeats);
        setSelectedSeats(0);
    }

    const resetTickets = () => {
        setSelectedAdultTickets(0);
        setSelectedStudentTickets(0);
        setSelectedSeniorTickets(0);
    }

    const handleTicketChange = (type, change) => {

        resetSelection();

        if (type === "Adult")
        {
            let newAdultTickets = selectedAdultTickets + change;
            if (newAdultTickets >= 0 && selectedTickets + change <= availableSeats)
            { setSelectedAdultTickets(newAdultTickets); }
        }
        else if (type === "Student")
        {
            let newStudentTickets = selectedStudentTickets + change;
            if (newStudentTickets >= 0 && selectedTickets + change <= availableSeats)
            { setSelectedStudentTickets(newStudentTickets); }
        }
        else if (type === "Senior")
        {
            let newSeniorTickets = selectedSeniorTickets + change;
            if (newSeniorTickets >= 0 && selectedTickets + change <= availableSeats)
            { setSelectedSeniorTickets(newSeniorTickets); }
        }
        else { console.error("error: invalid ticket type"); }
    }

    const priceToPay = (selectedAdultTickets * ticketTypes[0].price) +
                       (selectedStudentTickets * ticketTypes[1].price) +
                       (selectedSeniorTickets * ticketTypes[2].price);

    return (
        <div style = {{textAlign: "center"}}>
            <p>Available seats: { availableSeats } / { totalSeats }</p>
            <div style = {{
                background: "white",
                color: "black",
                width: "60%",
                margin: "10px auto",
                marginRight: "85px",
                marginBottom: "20px",
                borderRadius: "5px"
            }}> Canvas </div>
            { seats.map((row, rowIndex) => (
                <div key = { rowIndex } style = {{ display: "flex", justifyContent: "center" }}>
                    <span style = {{ 
                        marginRight: "10px",
                        display: "inline-block",
                        width: "2em",
                        textAlign: "right"
                    }}>{ rowIndex + 1 }.</span>
                    {
                        row.map((seat, colIndex) => (
                            <button
                                key = { colIndex }
                                disabled = { seat == -1 }
                                onClick = {() => handleSeatClick(rowIndex, colIndex)}
                                style = {{
                                    width: "25px",
                                    height: "25px",
                                    margin: "2px",
                                    backgroundColor: seat == -1 ? "#333333" : seat == 0 ? "#5fc850" : "white",
                                    borderRadius: "5px",
                                    cursor: seat == -1 ? "not-allowed" : "pointer"
                                }}
                            />
                        ))
                    }
                </div>
            ))}
            <p/>
            {
                ticketTypes.map((ticket) => (
                    <div key = { ticket.type }>
                        <span
                            style = {{
                                display: "inline-block",
                                width: "35%"
                        }}>
                            { ticket.type } ({ ticket.price } HUF)
                        </span>

                        <button onClick = {() => handleTicketChange(ticket.type, -1)}> - </button>

                        <span
                            style = {{
                                display: "inline-block",
                                width: "10%"
                        }}>
                            { ticket.type === "Adult" ? selectedAdultTickets : ticket.type === "Student" ? selectedStudentTickets : selectedSeniorTickets }
                        </span>

                        <button onClick = {() => handleTicketChange(ticket.type, 1)}> + </button>
                    </div>
                ))
            }
            { selectedTickets > 0 && selectedTickets != selectedSeats ? <p>Selected tickets: { selectedSeats } / { selectedTickets }<br/>Price to pay: { priceToPay } HUF</p> : null }
            { selectedTickets > 0 && selectedTickets === selectedSeats ? 
                < SummaryPanel
                    seats = { seats }
                    setSeats = { setSeats }
                    ticketTypes = { ticketTypes }
                    adultTickets = { selectedAdultTickets }
                    studentTickets = { selectedStudentTickets }
                    seniorTickets = { selectedSeniorTickets }
                    resetSelection = { resetSelection }
                    resetTickets = { resetTickets }
                /> : null
            }
        </div>
    );
};

export default SeatsSelector;