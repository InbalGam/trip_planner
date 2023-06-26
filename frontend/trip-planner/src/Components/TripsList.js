import { useState, useEffect } from "react";
import TripAdd from './TripAdd';
import TripCard from './TripCard';
import {getTrips} from '../Api';
import { useNavigate } from 'react-router-dom';


function TripsList() {
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
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
    async function getUserTrips() {
        const result = await getTrips();
        if (result.status === 401) {
            navigate('/login');
        } else {
            const jsonData = await result.json();
            setTrips(jsonData);
        }
    };


    useEffect(() => {
        getUserTrips();
    }, []);


    function showTrip() {
        setShowForm(!showForm);
    };

    return (
        <div className="trips-div">
            <button className='add_trip' onClick={showTrip}>Add a new trip</button>
            {showForm === false ? '' : <TripAdd getUserTrips={getUserTrips} setShowForm={setShowForm} />}
            <p>Your trips</p>
            {console.log(trips)}
            <div className="currentTrips">
                <ul>
                    {trips.map((trip, ind) =>
                        <li key={ind}>
                            <TripCard trip={trip} getUserTrips={getUserTrips} setShowForm={setShowForm} />
                        </li>)}
                </ul>
            </div>
        </div>
    );
};

export default TripsList;