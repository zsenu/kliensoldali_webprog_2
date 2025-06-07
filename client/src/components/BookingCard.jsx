function formatDate(dateStr) {

    const date = new Date(dateStr);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[date.getDay()];
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return { dayName, time, date: date.toLocaleDateString() };
}

const ticketInfo = [
        { type: "normal", price: 2500},
        { type: "adult", price: 2500},
        { type: "student", price: 2000},
        { type: "senior", price: 1500}
];

const BookingCard = ({ booking, isPast = false }) => {
    
    const { screening } = booking;
    const { dayName, time, date } = formatDate(screening.start_time);
    return (
        <div
            key = { booking.id }
            style = {{
                background: "#222222",
                color: "white",
                borderRadius: 8,
                boxShadow: "0 2px 8px #000",
                marginBottom: 24,
                padding: 20,
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                opacity: isPast ? 0.6 : 1
            }}
        >
            <img
                src = { screening.movie.image_path }
                alt = { screening.movie.title }
                style = {{
                    width: 110,
                    objectFit: "cover",
                    borderRadius: 6,
                    filter: isPast ? "grayscale(100%)" : "none"
                }}
            />
            <div style = {{ flex: 1 }}>
                <h3 style = {{ margin: 0 }}>{ screening.movie.title }</h3>
                <div style = {{ margin: "8px 0" }}>
                    <strong>{ date }</strong> ({ dayName }) - <strong>{ time }</strong>
                </div>
                <div>
                    <strong>Purchased tickets:</strong>
                    { booking.ticket_types.map((tt, i) => {
                        const priceObj = ticketInfo.find(t => t.type === tt.type);
                        const price = priceObj ? priceObj.price : 0;
                        const quantity = tt.quantity ?? tt.count ?? 0;
                        const total = price * quantity;
                        return (
                            <div key = { i }>
                                { quantity } x { tt.type } - { total } HUF
                            </div>
                        );
                    })}
                </div>
                <div style = {{ marginTop: 8 }}>
                    <strong>Booked seats:</strong>
                    <div>
                        { booking.seats.map((seat, i) => (
                            <span key = { i }>
                                {i > 0 && <br />}
                                row #{ seat.row } seat #{ seat.seat }
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;