import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { useState,  useEffect } from "react";
//import styles from './Styles/ActivityAddUpdate.css';
import Select from 'react-select';
import SendIcon from '@mui/icons-material/Send';
import AutoComplete from 'react-google-autocomplete';
import {GOOGLE_API} from '../apiKey';

import * as ast from './Styles/ActivityAddUpdateStyles';
import tw from "twin.macro";
import {css} from "styled-components/macro"; //eslint-disable-line
import Alert from '@mui/material/Alert';


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
        <ast.Form onSubmit={submitActivity} data-testid="tripForm">
            <ast.DividerTextContainer>
                <ast.Input type="text" placeholder="Enter activity name here" value={activityName} onChange={handleTextChange} data-testid="activityName"/>
                <label htmlFor='selectType' tw="mt-2">Activity Type</label>
                <Select options={typeOptions} value={activityType} onChange={changeHandler} placeholder='select activity type' className="selectActivityType" inputId='selectType' name='selectType' tw="z-99999"/>
                <AutoComplete tw="mt-4" apiKey={GOOGLE_API} value={address} placeholder={'Enter address here'} onChange={handleAddressChange} 
                    onPlaceSelected={(place) => {setAddress(place.formatted_address); setAddressLAT(place.geometry.location.lat()); setAddressLNG(place.geometry.location.lng());}} options={{types: [], fields:['ALL']}} data-testid="activityAddress" />
                <ast.Input type="text" placeholder="Enter link here" value={link} onChange={handleLinkChange} data-testid="activityURL"/>
            </ast.DividerTextContainer>
            <ast.DividerTextContainer>
                <label htmlFor='activity_date' tw="mt-2">Activity date</label>
                <DatePicker selected={activityDate} onChange={date => setActivityDate(date)} dateFormat='dd-MMM-yy' tw="w-full"/>
                <label htmlFor='start_time' tw="mt-2">Start time</label>
                <input type="time" id="start_time" name="start_time" min="08:00" max="24:00" value={startValue} onChange={(e) => setStartValue(e.target.value)} />
                <label htmlFor='end_time' tw="mt-2">End time</label>
                <input type="time" id="start_time" name="start_time" min="08:00" max="24:00" value={endValue} onChange={(e) => setEndValue(e.target.value)} />
            </ast.DividerTextContainer>
            <ast.DividerTextContainer>
                <label htmlFor='user_notes' tw="mt-2">Notes</label>
                <ast.TextArea id="message-input" name="message" placeholder="E.g. Details about your event"/>
                <ast.SubmitButton type="submit">
                    <SendIcon className="icon" />
                </ast.SubmitButton>
                {fieldsFilled ? <Alert severity="warning">All fields needs to be filled</Alert> : ''}
            </ast.DividerTextContainer>
        </ast.Form>
    );
};

export default ActivityAddUpdate;