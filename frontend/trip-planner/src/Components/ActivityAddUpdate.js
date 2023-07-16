import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { useState,  useEffect } from "react";
import styles from './Styles/ActivityAddUpdate.css';
import Select from 'react-select';
import SendIcon from '@mui/icons-material/Send';
import AutoComplete from 'react-google-autocomplete';
import {GOOGLE_API} from '../apiKey';


function ActivityAddUpdate(props) {
    const { tripId } = useParams();
    const [activityName, setActivityName] = useState('');
    const [address, setAddress] = useState('');
    const [link, setLink] = useState('');
    const [userNotes, setUserNotes] = useState('');
    const [startValue, setStartValue] = useState('10:00');
    const [endValue, setEndValue] = useState('10:00');
    const [activityDate, setActivityDate] = useState(new Date());
    const [fieldsFilled, setFieldsFilled] = useState(false);
    const [activityType, setActivityType] = useState('');
    const [addressLAT, setAddressLAT] = useState('');
    const [addressLNG, setAddressLNG] = useState('');

    const typeOptions = [{value: 'OD' , label: 'Outdoor'}, {value: 'F' , label: 'Food'}, {value: 'D' , label: 'Drink'}, {value: 'M' , label: 'Meeting'},
        {value: 'MU' , label: 'Museum'}, {value: 'T' , label: 'Tour'}, {value: 'S' , label: 'Sports'}];
    const changeHandler = value => {
        setActivityType(value);
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


    async function setAnActivity(tripActivity) {
        setActivityName(tripActivity.activity_name);
        setAddress(tripActivity.address);
        setLink(tripActivity.url);
        setUserNotes(tripActivity.user_notes);
        setStartValue(tripActivity.start_time);
        setEndValue(tripActivity.end_time);
        setActivityDate(new Date(tripActivity.date));
        setActivityType(typeOptions.filter(obj => obj.label === tripActivity.type)[0]);
        setAddressLAT(tripActivity.address_lat);
        setAddressLNG(tripActivity.address_lng);
    };


    useEffect(() => {
        if (props.activity) {
            setAnActivity(props.activity);
        }
    }, []);


    function submitActivity(e) {
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
                type: activityType.label,
                address_lat: addressLAT,
                address_lng: addressLNG
            };
            props.onActivitySubmit(tripId, newActivity);
            
            setActivityDate(new Date());
            setActivityName('');
            setAddress('');
            setLink('');
            setUserNotes('');
            setStartValue('10:00');
            setEndValue('10:00');
            setActivityType('');
            setAddressLAT('');
            setAddressLNG('');
        };
    };

    return (
        <form onSubmit={submitActivity} className='activityForm'>
            <div className='activityFormDiv1'>
                <input id='activity_name' type='text' name='activity_name' value={activityName} placeholder={'Enter activity name here'} onChange={handleTextChange} />
                <Select options={typeOptions} value={activityType} onChange={changeHandler} placeholder='select activity type' className="selectActivityType"/>
                <AutoComplete apiKey={GOOGLE_API} value={address} placeholder={'Enter address here'} onChange={handleAddressChange} 
                    onPlaceSelected={(place) => {setAddress(place.formatted_address); setAddressLAT(place.geometry.location.lat()); setAddressLNG(place.geometry.location.lng());}} options={{types: [], fields:['ALL']}}/>
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
                <button type="submit" value="Submit" className="submitButton"><SendIcon/></button>
                <div className="failed">
                    {fieldsFilled ? 'All fields needs to be filled' : ''}
                </div>
            </div>
        </form>
    );
};

export default ActivityAddUpdate;