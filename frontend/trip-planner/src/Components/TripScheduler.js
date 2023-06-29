import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, WeekView, Appointments, Toolbar, DateNavigator } from '@devexpress/dx-react-scheduler-material-ui';
import { useParams, useNavigate } from 'react-router-dom';
import {getSpecificTrip, getActivities} from '../Api';
import { useState, useEffect } from "react";
import dateFormat, { masks } from "dateformat";
import ActivityAddUpdate from './ActivityAddUpdate';
import ClipLoader from 'react-spinners/ClipLoader';


function TripScheduler() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState({});
    const [schedulerData, setSchedulerData] = useState([]);
    const [currentDate, setCurrentDate] = useState(dateFormat(new Date(), "yyyy-mm-dd"));
    const [isActivities, setIsActivities] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const[isActivityAdd, setIsActivityAdd] = useState(false);
    const navigate = useNavigate();



    async function getTripInfo(id) {
        try {
            setIsLoading(true);
            const result = await getSpecificTrip(id);
            if (result.status === 401) {
                navigate('/login');
            } else {
                const jsonData = await result.json();
            setTrip(jsonData);
            const justDate = jsonData.start_date.split('T')[0]
            const formattedDate = dateFormat(new Date(justDate), "yyyy-mm-dd");
            setCurrentDate(formattedDate.toString());
            setIsLoading(false);
            };
        } catch (e) {
            navigate('/error');
        }
    };


    async function getTripActivities(id) {
        try {
            setIsLoading(true);
            const result = await getActivities(id);
            if (result.status === 401) {
                navigate('/login');
            } else {
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
                setIsLoading(false);
            };
        } catch (e) {
            navigate('/error');
        }
    };

    useEffect(() => {
        getTripInfo(tripId);
        getTripActivities(tripId);
    }, []);


    function showActivity() {
        setShowForm(!showForm);
        setIsActivityAdd(true);
    };


    function actionsOnActivity(e) {
        console.log('hello');
        setShowForm(true);
        setIsActivityAdd(false);
    };


    return (
        <>
            {isLoading ? <ClipLoader color={'#3c0c21'} size={150} /> : <Paper>
                <p>{isActivities ? '' : 'No activities yet'}</p>
                <Scheduler data={schedulerData}>
                    <ViewState currentDate={currentDate} onCurrentDateChange={(date) => { setCurrentDate(date) }} />
                    <WeekView startDayHour={5} cellDuration={60} />
                    <Appointments onClick={actionsOnActivity} draggable={true}/>
                    <Toolbar />
                    <DateNavigator />
                </Scheduler>
            </Paper>}
            <div>
                <button className='add_activity' onClick={showActivity} >Add a new activity</button>
                {showForm === false ? '' : <ActivityAddUpdate getTripActivities={getTripActivities} setShowForm={setShowForm} isActivityAdd={isActivityAdd} />}
            </div>
        </>
    );
};


export default TripScheduler;