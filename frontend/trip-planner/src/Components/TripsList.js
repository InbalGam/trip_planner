import { useState, useEffect } from "react";
import TripAddUpdate from './TripAddUpdate';
import TripCard from './TripCard';
import {getTrips} from '../Api';
import { useNavigate } from 'react-router-dom';


function TripsList() {
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
  
    
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
            {showForm === false ? '' : <TripAddUpdate getUserTrips={getUserTrips} setShowForm={setShowForm} isTripAdd={true} />}
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