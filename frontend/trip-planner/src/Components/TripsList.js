import { useState } from "react";
import Trip from './Trip';


function TripsList() {
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(false);
    // Example- trips = [
    //     {
    //         id: 1,
    //         country: 'Italy',
    //         city: 'Rome',
    //         start_date: '2023-08-18',
    //         end_date: '2023-08-29',
    //         emails: []
    //     }
    // ]

    function showTrip() {
        setShowForm(!showForm);
    };

    return (
        <div className="trips-div">
            <button className='add_trip' onClick={showTrip}>Add a new trip</button>
            {showForm === false ? '' : <Trip setTrips={setTrips} />}
            <p>Your trips</p>
            {console.log(trips)}
            <div className="currentTrips">
                <ul>
                    {trips.map((el, ind) =>
                        <li key={ind}>
                            <div className="trip">
                                <p>{el.country.label}</p>
                                <p>{el.city}</p>
                                <p>{el.start_date.toDateString()}</p>
                                <p>{el.end_date.toDateString()}</p>
                                <p>{el.emails ? el.emails : ''}</p>
                            </div>
                        </li>)}
                </ul>
            </div>
        </div>
    );
};

export default TripsList;