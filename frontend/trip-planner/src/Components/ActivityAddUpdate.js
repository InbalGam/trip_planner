import {insertTripActivity, updateTripActivity, getSpecificTripActivity} from '../Api';
import { useParams, useNavigate, json } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { useState,  useEffect } from "react";
import styles from './Styles/ActivityAddUpdate.css';
import Select from 'react-select';


function ActivityAddUpdate(props) {
    const { tripId } = useParams();
    const [activityName, setActivityName] = useState('');
    const [address, setAddress] = useState('');
    const [link, setLink] = useState('');
    const [userNotes, setUserNotes] = useState('');
    const [startValue, setStartValue] = useState('10:00');
    const [endValue, setEndValue] = useState('10:00');
    const [activityDate, setActivityDate] = useState(new Date());
    const [insertFailed, setInsertFailed] = useState(false);
    const [fieldsFilled, setFieldsFilled] = useState(false);
    const [updateFailed, setUpdateFailed] = useState(false);
    const navigate = useNavigate();
    const [activityType, setActivityType] = useState('');

    const options = [{value: 'OD' , label: 'Outdoor'}, {value: 'FD' , label: 'Food & Drink'}, {value: 'M' , label: 'Meeting'},
        {value: 'MU' , label: 'Museum'}, {value: 'CT' , label: 'City Tour'}, {value: 'S' , label: 'Sports'}];
    const changeHandler = value => {
        setActivityType(value)
    };

    function handleTextChange(e) {
        setActivityName(e.target.value);
    };

    function handleAddressChange(e) {
        setAddress(e.target.value);
    };

    function handleLinkChange(e) {
        setLink(e.target.value);
    };


    async function insertUserActivity(id, activity) {
        try {
            const result = await insertTripActivity(id, activity);
            if (result.status === 401) {
                navigate('/login');
            } else {
                if (result.status === 200) {
                    return result;
                } else {
                    setInsertFailed(true);
                }
            };
        } catch (e) {
            navigate('/error');
        }
    };


    async function getAnActivity(tripId, activityId) {
        try {
            const result = await getSpecificTripActivity(tripId, activityId);
            if (result.status === 401) {
                navigate('/login');
            } else {
                const jsonData = await result.json();
                setActivityName(jsonData.activity_name);
                setAddress(jsonData.address);
                setLink(jsonData.url);
                setUserNotes(jsonData.user_notes);
                setStartValue(jsonData.start_time);
                setEndValue(jsonData.end_time);
                setActivityDate(new Date(jsonData.date));
                setActivityType(jsonData.type);
            };
        } catch (e) {
            navigate('/error');
        }
    };


    useEffect(() => {
        if (!props.isActivityAdd) {
            getAnActivity(tripId, props.activityId);
        }
    }, []);

    async function updateUserActivity(tripId, activity, activityId) {
        try {
            const result = await updateTripActivity(tripId, activity, activityId);
            if (result.status === 401) {
                navigate('/login');
            } else {
                if (result.status === 200) {
                    return result;
                } else {
                    setInsertFailed(true);
                }
            };
        } catch (e) {
            navigate('/error');
        }
    };


    async function submitActivity(e) {
        e.preventDefault();
        if (!activityDate || !activityName || !startValue || !endValue) {
            setFieldsFilled(true);
        } else {
            const newActivity = {
                date: activityDate, 
                activity_name: activityName, 
                address: address, 
                activityURL: link, 
                start_time: startValue, 
                end_time: endValue, 
                user_notes: userNotes,
                type: activityType
            };
            if (props.isActivityAdd) {
                await insertUserActivity(tripId, newActivity);
                props.getTripActivities(tripId);
                props.setShowForm(false);
            } else {
                await updateUserActivity(tripId, newActivity, props.activityId);
                props.getSpecificActivity(tripId, props.activityId);
                props.setShowActivity(true);
            }
            setActivityDate(new Date());
            setActivityName('');
            setAddress('');
            setLink('');
            setUserNotes('');
            setStartValue('10:00');
            setEndValue('10:00');
            setActivityType('');
        };
    };

    return (
        <form onSubmit={submitActivity} className='activityForm'>
            <div className='activityFormDiv1'>
                <input id='activity_name' type='text' name='activity_name' value={activityName} placeholder={'Enter activity name here'} onChange={handleTextChange} />
                <Select options={options} value={activityType} onChange={changeHandler} placeholder='select activity type' className="selectActivityType"/>
                <input id='address' type='text' name='address' value={address} placeholder={'Enter address here'} onChange={handleAddressChange} />
                <input id='link' type='text' name='link' value={link} placeholder={'Enter link here'} onChange={handleLinkChange} />
            </div>
            <div className='activityFormDiv2'>
                <label htmlFor='activity_date'>Activity date</label>
                <DatePicker selected={activityDate} onChange={date => setActivityDate(date)} dateFormat='dd-MMM-yy' />
                <label htmlFor='start_time'>Activity start time</label>
                <input type="time" id="start_time" name="start_time" min="08:00" max="24:00" value={startValue} onChange={(e) => setStartValue(e.target.value)} />
                <label htmlFor='end_time'>Activity end time</label>
                <input type="time" id="start_time" name="start_time" min="08:00" max="24:00" value={endValue} onChange={(e) => setEndValue(e.target.value)} />
            </div>
            <div className='activityFormDiv3'>
                <label htmlFor='user_notes'>Notes</label>
                <textarea id='user_notes' name="user_notes" rows="5" cols="33" value={userNotes} onChange={(e) => setUserNotes(e.target.value)}>Enter notes here</textarea>
                <button type="submit" value="Submit" className="submitButton">Submit activity</button>
                <div className="failed">
                    {fieldsFilled ? 'All fields needs to be filled' : ''}
                    {insertFailed ? 'Problem adding activity' : ''}
                    {updateFailed ? 'Problem updating activity' : ''}
                </div>
            </div>
        </form>
    );
};

export default ActivityAddUpdate;