import {insertTripActivity} from '../Api';
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { TimePicker } from "@mui/x-date-pickers";
import { useState,  useEffect } from "react";

function ActivityAddUpdate() {
    const { tripId } = useParams();
    const [activityName, setActivityName] = useState('');
    const [address, setAddress] = useState('');
    const [link, setLink] = useState('');
    const [startValue, setStartValue] = useState('10:00');
    const [endValue, setEndValue] = useState('10:00');
    const [activityDate, setActivityDate] = useState(new Date());

    function handleTextChange(e) {
        setActivityName(e.target.value);
    };

    function handleAddressChange(e) {
        setAddress(e.target.value);
    };

    function handleLinkChange(e) {
        setLink(e.target.value);
    };


//date, activity_name, address, activityURL, start_time, end_time, user_notes
    return (
        <form>
            <label for='activity_date'>Activity date</label>
            <DatePicker selected={activityDate} onChange={date => setActivityDate(date)} dateFormat='dd-MMM-yy' />
            <label for='activity_name'>Activity name</label>
            <input id='activity_name' type='text' name='activity_name' value={activityName} placeholder={'Enter activity name here'} onChange={handleTextChange} />
            <label for='address'>Address</label>
            <input id='address' type='text' name='address' value={address} placeholder={'Enter address here'} onChange={handleAddressChange} />
            <label for='link'>Activity link</label>
            <input id='link' type='text' name='link' value={link} placeholder={'Enter link here'} onChange={handleLinkChange} />
            <label for='start_time'>Activity start time</label>
            <TimePicker label="Controlled picker" value={startValue} onChange={(newValue) => setStartValue(newValue)}/>
            <label for='end_time'>Activity end time</label>
            <TimePicker label="Controlled picker" value={endValue} onChange={(newValue) => setEndValue(newValue)}/>
            <label for='user_notes'>Notes</label>
            <textarea id='user_notes' name="user_notes"rows="5" cols="33">Enter notes here</textarea>
        </form>
    );
};

export default ActivityAddUpdate;