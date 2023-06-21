import { useState } from "react";
import Trip from './Trip';


function TripsList() {
    const {trips, setTrips} = useState([]);
    const [showForm, setShowForm] = useState(false);
    // Example- trips = [
    //     {
    //         id: 1,
    //         country: 'Italy',
    //         city: 'Rome',
    //         start_date: '2023-08-18',
    //         end_date: '2023-08-29'
    //     }
    // ]

    function showTrip() {
        setShowForm(!showForm);
    };

    return (
        <div className="trips-div">
            <button className='add_trip' onClick={showTrip}>Add a new trip</button>
            {showForm === false ? '' : <Trip />}
        </div>
    );
};

export default TripsList;