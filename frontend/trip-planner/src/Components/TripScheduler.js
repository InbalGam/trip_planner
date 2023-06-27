import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import { useParams } from 'react-router-dom';
import {getSpecificTrip, getActivities} from '../Api';
import { useState, useEffect } from "react";
import dateFormat, { masks } from "dateformat";
import ActivityAddUpdate from './ActivityAddUpdate';


function TripScheduler() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState({});
    const [schedulerData, setSchedulerData] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [isActivities, setIsActivities] = useState(true);
    const [showForm, setShowForm] = useState(false);



    async function getTripInfo(id) {
        const result = await getSpecificTrip(id);
        const jsonData = await result.json();
        setTrip(jsonData);
    };


    async function getTripActivities(id) {
        const result = await getActivities(id);
        const jsonData = await result.json();
        if (jsonData.length > 0) {
            const activities = jsonData.map(el => {
                const newDate = dateFormat(new Date(el.date), "yyyy, mm, dd");
                return { title: el.activity_name, startDate: new Date(newDate + ', ' + el.start_time), endDate: new Date(newDate + ', ' + el.end_time) }
            });
            setSchedulerData(activities);
            const formattedDate = dateFormat(new Date(activities[0].startDate), "yyyy-mm-dd");
            setCurrentDate(formattedDate.toString());
        } else {
            setIsActivities(false);
        }
    };

    useEffect(() => {
        getTripInfo(tripId);
        getTripActivities(tripId);
    }, []);


    function showActivity() {
        setShowForm(!showForm);
    };


    return (
        <>
            <Paper>
                <p>{isActivities ? '' : 'No activities yet'}</p>
                <Scheduler data={schedulerData}>
                    <ViewState currentDate={'2023-05-01'} />
                    <MonthView />
                    <Appointments />
                </Scheduler>
            </Paper>
            <div>
                <button className='add_activity' onClick={showActivity}>Add a new activity</button>
                {showForm === false ? '' : <ActivityAddUpdate />}
            </div>
        </>
    );
};


export default TripScheduler;