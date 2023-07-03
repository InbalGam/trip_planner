import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { getSpecificTripActivity } from '../Api';


function Activity() {
    const { tripId, activityId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [activity, setActivity] = useState({});
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');


    async function getSpecificActivity(idTrip, idActivity) {
        try {
            setIsLoading(true);
            const result = await getSpecificTripActivity(idTrip, idActivity);
            if (result.status === 401) {
                navigate('/login');
            } else {
                const jsonData = await result.json();
                setActivity(jsonData);
                console.log(jsonData);
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

    return (
        <div>
            <h2>{activity.activity_name}</h2>
            <p>{activity.date}</p>
            <p>{startTime} - {endTime}</p>
            <p>{activity.address === "" ? 'No address entered' : activity.address}</p>
            <p>{activity.url === "" ? 'No URL entered' : activity.url}</p>
            <p>Activity Notes-</p>
            <p>{activity.user_notes === "" ? 'None' : activity.user_notes}</p>
        </div>
    );
};

export default Activity;