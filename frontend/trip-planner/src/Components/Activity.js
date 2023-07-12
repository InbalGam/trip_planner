import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { getSpecificTripActivity } from '../Api';
import ClipLoader from 'react-spinners/ClipLoader';
import ActivityAddUpdate from './ActivityAddUpdate';
import dateFormat, { masks } from "dateformat";
import CommentsList from './CommentsList';
import styles from './Styles/Activity.css';
import EditIcon from '@mui/icons-material/Edit';
import GoogleMapReact from 'google-map-react';
import {GOOGLE_API} from '../apiKey';
import LocationOnIcon from '@mui/icons-material/LocationOn';


function Activity() {
    const { tripId, activityId } = useParams();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activity, setActivity] = useState({});
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [commentsForm, setCommentsForm] = useState(false);

    const Marker = () => <div><LocationOnIcon className='mapMarker'/></div>;


    async function getSpecificActivity(idTrip, idActivity) {
        try {
            setIsLoading(true);
            const result = await getSpecificTripActivity(idTrip, idActivity);
            if (result.status === 401) {
                navigate('/login');
            } else {
                const jsonData = await result.json();
                setActivity(jsonData);
                const splittedStartTime = jsonData.start_time.split(':');
                setStartTime(splittedStartTime[0] + ':' + splittedStartTime[1]);
                const splittedEndTime = jsonData.end_time.split(':');
                setEndTime(splittedEndTime[0] + ':' + splittedEndTime[1]);
                setIsLoading(false);
            };
        } catch (e) {
            navigate('/error');
        }
    };


    useEffect(() => {
        getSpecificActivity(tripId, activityId);
    }, []);


    function showActivityForm(e) {
        setShowForm(!showForm);
    };

    return (
        <div className='activityContainer'>
            <div className='activityInfoContainer'>
                <div className='editActivityDiv'>
                    <button className='activityEdit' onClick={showActivityForm}><EditIcon /></button>
                </div>
                {showForm === false ? '' : <ActivityAddUpdate setShowForm={setShowForm} isActivityAdd={false} activityId={activityId} getSpecificActivity={getSpecificActivity} />}

                {isLoading ? <ClipLoader color={'#3c0c21'} size={150} /> :
                    showForm === false ?
                        <div className='ActivityInfo' data-testid='ActivityInfo'>
                            <h2 className='activityName'>{activity.activity_name}</h2>
                            <p>{dateFormat(new Date(activity.date), "dddd, mmmm dS, yyyy")}</p>
                            <p>{startTime} - {endTime}</p>
                            <p>{activity.address === "" ? 'No address entered' : activity.address}</p>
                            <p className='activityURL'>{activity.url === "" ? 'No URL entered' : activity.url}</p>
                            <p>{activity.user_notes === "" ? 'No activity notes' : activity.user_notes}</p>
                            <div className='GoogleMap'><GoogleMapReact bootstrapURLKeys={{ key: GOOGLE_API, libraries:['places']}} defaultCenter={{ lat: activity.address_lat, lng: activity.address_lng }} defaultZoom={15} >
                                    <Marker lat={activity.address_lat} lng={activity.address_lng} />
                            </GoogleMapReact></div>
                        </div> : ''}
            </div>
            <div className='comments'>
                <h3 className='commentsHeadline'>Comments</h3>
                <CommentsList />
            </div>
        </div>
    );
};

export default Activity;