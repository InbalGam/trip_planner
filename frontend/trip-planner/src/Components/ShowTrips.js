function ShowTrips(props) {
    return (
        props.trips.map((el, ind) =>
            <li key={ind}>
                <div className="trip">
                    <p>{el.country.label}</p>
                    <p>{el.city}</p>
                    <p>{new Date(el.start_date)}</p>
                    <p>{new Date(el.end_date)}</p>
                    <p>{el.emails ? '' : el.emails}</p>
                </div>
            </li>)
    );
};


export default ShowTrips;