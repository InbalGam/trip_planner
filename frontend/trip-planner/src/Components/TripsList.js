import { useState, useEffect } from "react";
import TripAddUpdate from './TripAddUpdate';
import TripCard from './TripCard';
import {getTrips} from '../Api';
import { useNavigate } from 'react-router-dom';
import styles from './Styles/TripsList.css';
import AddIcon from '@mui/icons-material/Add';


function TripsList() {
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
  

    async function getUserTrips() {
        try {
            const result = await getTrips();
            if (result.status === 401) {
                navigate('/login');
            } else {
                const jsonData = await result.json();
                setTrips(jsonData);
            }
        } catch (e) {
            navigate('/error');
        }
    };


    useEffect(() => {
        getUserTrips();
    }, []);


    function showTrip() {
        setShowForm(!showForm);
    };

    return (
        <div className="trips_container">
            <div className="trips">
                <div className="add_trip_container">
                    <button className='add_trip' onClick={showTrip}><AddIcon /></button>
                </div>
                {showForm === false ? '' : <TripAddUpdate getUserTrips={getUserTrips} setShowForm={setShowForm} isTripAdd={true} />}
                <h2>Your trips</h2>
                <div className="userTrips">
                    <ul className="listOfTrips">
                        {trips.map((trip, ind) =>
                            <li key={ind}>
                                <TripCard trip={trip} getUserTrips={getUserTrips} setShowForm={setShowForm} />
                            </li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TripsList;