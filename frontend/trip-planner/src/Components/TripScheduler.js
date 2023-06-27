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


function TripScheduler() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState({});
    const [schedulerData, setSchedulerData] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
        


    async function getTripInfo(id) {
        const result = await getSpecificTrip(id);
        const jsonData = await result.json();
        setTrip(jsonData);
    };


    async function getTripActivities(id) {
        const result = await getActivities(id);
        const jsonData = await result.json();
        const activities = jsonData.map(el => {
            const newDate = dateFormat(new Date(el.date), "yyyy, mm, dd");
            return {title: el.activity_name, startDate: new Date(newDate + ', ' + el.start_time), endDate: new Date(newDate + ', ' + el.end_time)}
        });
        setSchedulerData(activities);
        const formattedDate = dateFormat(new Date(activities[0].startDate), "yyyy-mm-dd");
        setCurrentDate(formattedDate.toString());
    };

    useEffect(() => {
        getTripInfo(tripId);
        getTripActivities(tripId);
    }, []);


    return (<Paper>
        <Scheduler data={schedulerData}>
            <ViewState currentDate={currentDate} />
            <MonthView />
            <Appointments />
        </Scheduler>
    </Paper>);
};


export default TripScheduler;