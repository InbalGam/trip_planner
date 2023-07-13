import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, DayView, WeekView, Appointments, Toolbar, DateNavigator, AppointmentTooltip, ViewSwitcher } from '@devexpress/dx-react-scheduler-material-ui';
import { useParams, useNavigate } from 'react-router-dom';
import {getSpecificTrip, getActivities, deleteSpecificTripActivity, insertTripActivity} from '../Api';
import { useState, useEffect } from "react";
import dateFormat, { masks } from "dateformat";
import ActivityAddUpdate from './ActivityAddUpdate';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from './Styles/TripScheduler.css';
import AddIcon from '@mui/icons-material/Add';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

function TripScheduler() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState({});
    const [schedulerData, setSchedulerData] = useState([]);
    const [currentDate, setCurrentDate] = useState(dateFormat(new Date(), "yyyy-mm-dd"));
    const [isActivities, setIsActivities] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [deleteFailed, setDeleteFailed] = useState(false);
    const [insertFailed, setInsertFailed] = useState(false);



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
                const activities = jsonData.map(el => {
                    const newDate = dateFormat(new Date(el.date), "yyyy, mm, dd");
                    return { id: el.id, title: el.activity_name, startDate: new Date(newDate + ', ' + el.start_time), endDate: new Date(newDate + ', ' + el.end_time), type: el.type }
                });
                setSchedulerData(activities);
                if (!activities) {
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


    function showActivity(e) {
        setShowForm(!showForm);
    };


    async function deleteAnActivity(activityId) {
        try {
            setIsLoading(true);
            const result = await deleteSpecificTripActivity(tripId, activityId);
            if (result.status === 401) {
                navigate('/login');
              } else {
                if (result.status === 200) {
                  await getTripActivities(tripId);
                  setDeleteFailed(false);
                  setIsLoading(false);
                } else {
                  setDeleteFailed(true);
                  setIsLoading(false);
                }
            } 
        } catch (e) {
            navigate('/error');
        }
    };

    async function onActivitySubmit(tripId, activity) {
        try {
            setIsLoading(true);
            setShowForm(false);
            const result = await insertTripActivity(tripId, activity);
            if (result.status === 401) {
                navigate('/login');
            } else {
                if (result.status === 200) {
                    await getTripActivities(tripId);
                    setIsLoading(false);
                    return result;
                } else {
                    setInsertFailed(true);
                    setIsLoading(false);
                }
            };
        } catch (e) {
            navigate('/error');
        }
    };


    const myAppointmentComponent = (props) => <Appointments.Appointment {...props} onDoubleClick={(e) => navigate(`/trips/${tripId}/activities/${props.data.id}`)}  className={props.data.type ? `appointment_${props.data.type}` : 'appointment'} />;
    const myLayoutComponent = (props) => <AppointmentTooltip.Layout {...props} onDeleteButtonClick={(e) => {props.onHide(); return deleteAnActivity(props.appointmentMeta.data.id)}} />
    const myHeaderComponent = (props) => <AppointmentTooltip.Header {...props} ><button className='activity_open_button' onClick={(e) => navigate(`/trips/${tripId}/activities/${props.appointmentData.id}`)} ><OpenInNewIcon/></button></AppointmentTooltip.Header>


    return (
        <div className='schedulerLoaderContainder'>
            {isLoading ? <ClipLoader color={'#3c0c21'} size={150} className='loader' /> : ''}
            <div className='schedulerContainder'>
                {deleteFailed === false ? '' : 'Could not delete activity'}
                <Paper className='paper'>
                    <p>{isActivities ? '' : ''}</p>
                    <Scheduler data={schedulerData}>
                        <ViewState currentDate={currentDate} onCurrentDateChange={(date) => { setCurrentDate(date) }} />
                        <WeekView startDayHour={5} cellDuration={60} />
                        <DayView startDayHour={5} cellDuration={60} />
                        <Appointments appointmentComponent={myAppointmentComponent} />
                        <AppointmentTooltip showCloseButton showDeleteButton layoutComponent={myLayoutComponent} headerComponent={myHeaderComponent} />
                        <Toolbar />
                        <ViewSwitcher/>
                        <DateNavigator />
                    </Scheduler>
                </Paper>
                <div className='addActivityContainer'>
                    <button className='add_activity' onClick={showActivity} ><AddIcon className='addIcon' style={{fontSize: '32px'}}/></button>
                    {showForm === false ? '' : <ActivityAddUpdate onActivitySubmit={onActivitySubmit} />}
                    {insertFailed ? 'Problem adding activity' : ''}
                </div>
            </div>
        </div>
    );
};


export default TripScheduler;