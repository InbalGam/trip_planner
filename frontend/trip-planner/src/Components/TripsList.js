import { useState, useEffect } from "react";
import TripAddUpdate from './TripAddUpdate';
import TripCard from './TripCard';
import {getTrips, insertTrip} from '../Api';
import { useNavigate } from 'react-router-dom';
import styles from './Styles/TripsList.css';
import AddIcon from '@mui/icons-material/Add';
import ClipLoader from 'react-spinners/ClipLoader';


function TripsList() {
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const [insertFailed, setInsertFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  

    async function getUserTrips() {
        try {
            setIsLoading(true);
            const result = await getTrips();
            if (result.status === 401) {
                navigate('/login');
            } else {
                const jsonData = await result.json();
                setTrips(jsonData);
                setIsLoading(false);
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


    async function onTripSubmit(trip) {
        try {
            setIsLoading(true);
            const result = await insertTrip(trip);
            if (result.status === 401) {
                navigate('/login');
            } else {
                if (result.status === 200) {
                    getUserTrips();
                    setShowForm(false);
                    setIsLoading(false);
                    return result;
                } else {
                    setInsertFailed(true);
                }
            };
        } catch (e) {
            navigate('/error');
        }
    };

    return (
        <div className="trips_container">
            <div className="trips">
                <div className="add_trip_container">
                    <button className='add_trip' onClick={showTrip}><AddIcon /></button>
                </div>
                {showForm === false ? '' : <TripAddUpdate onTripSubmit={onTripSubmit} setIsLoading={setIsLoading} />}
                <h2>Your trips</h2>
                {isLoading ? <ClipLoader color={'#3c0c21'} size={150} /> : <div className="userTrips">
                    <ul className="listOfTrips">
                        {trips.map((trip, ind) =>
                            <li key={ind}>
                                <TripCard trip={trip} getUserTrips={getUserTrips} setShowForm={setShowForm} setIsLoading={setIsLoading} />
                            </li>)}
                    </ul>
                </div> }
                {insertFailed ? 'Problem adding trip' : ''}
            </div>
        </div>
    );
};

export default TripsList;