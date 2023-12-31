import { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Email from './EmailAdd';
import Select from 'react-select';
import countryList from 'react-select-country-list';
//import styles from './Styles/TripAddUpdate.css';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import {getSpecificTrip, getTripPhoto} from '../Api';
import AutoComplete from 'react-google-autocomplete';
import {GOOGLE_API} from '../apiKey';
import Alert from '@mui/material/Alert';

import * as tst from './Styles/TripAddUpdateStyles';
import tw from "twin.macro";
import {css} from "styled-components/macro"; //eslint-disable-line


function TripAdd(props) {
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [emails, setEmails] = useState([]);
    const [fieldsFilled, setFieldsFilled] = useState(false);
    const [tripPhoto, setTripPhoto] = useState('');
    const navigate = useNavigate();


    const options = useMemo(() => countryList().getData(), []);
    const changeHandler = value => {
        setCountry(value)
    };

    function handleTextChange(e) {
        setCity(e.target.value);
    };

    async function getPhotoForTrip() {
        try {
            const place = country.label + ', ' + city;
            const tripImg = await getTripPhoto({place});
            const jsonData = await tripImg.json();
            setTripPhoto(jsonData);
        } catch (e) {
            navigate('/error');
        }
    };


    async function getATrip(id) {
        try {
            const tripDB = await getSpecificTrip(id);
            if (tripDB.status === 401) {
                navigate('/login');
            } else {
                const jsonData = await tripDB.json();
                setCountry(options.filter(obj => obj.label === jsonData.country)[0]);
                setCity(jsonData.city);
                const emailsDB = jsonData.userData.map(el => el.username);
                setEmails(emailsDB);
                setStartDate(new Date(jsonData.start_date));
                setEndDate(new Date(jsonData.end_date));
                setTripPhoto(jsonData.photo);
            };
        } catch (e) {
            navigate('/error');
        }
    };


    useEffect(() => {
        if (props.trip) {
            getATrip(props.trip.id);
        }
    }, []);

    useEffect(() => {
        getPhotoForTrip();
    }, [city]);


    async function submitTrip(e) {
        e.preventDefault();
        if (!country.label || !city || !startDate || !endDate || !emails) {
            setFieldsFilled(true);
        } else {
            const newTrip = {
                country: country.label,
                city: city,
                start_date: startDate,
                end_date: endDate,
                emails: emails,
                photo: tripPhoto
            }
            props.onTripSubmit(newTrip);
            setCity('');
            setCountry('');
            setEmails([]);
            setStartDate(new Date());
            setEndDate(new Date());
        }
    };

    return (
        <tst.Form onSubmit={submitTrip} data-testid="tripForm">
            <Select options={options} value={country} onChange={changeHandler} className="countrySelect" data-testid="selectCountry" inputId='selectCountry' name='selectCountry' placeholder="Select Country" tw="mb-4"/>
            {/* <AutoComplete tw="w-full rounded pl-1" apiKey={GOOGLE_API} value={city} placeholder={'Enter city here'} onChange={handleTextChange} onPlaceSelected={(place) => {setCity(place.formatted_address); getPhotoForTrip();}} options={{fields:['ALL']}} data-testid="city"/> */}
            <input tw="w-full rounded pl-1" value={city} placeholder={'Enter city here'} onChange={handleTextChange}/>
            <div tw="mt-4 flex flex-col">
                <label htmlFor='start_date' >Start date</label>
                <DatePicker tw="rounded pl-1" selected={startDate} onChange={date => setStartDate(date)} dateFormat='dd-MMM-yy' className="datePick" />
            </div>
            <div tw="mt-4 flex flex-col">
                <label htmlFor='end_date'>End date</label>
                <DatePicker tw="rounded pl-1" selected={endDate} onChange={date => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} dateFormat='dd-MMM-yy' className="datePick" />
            </div>
            <Email email={emails} emails={emails} setEmails={setEmails} className='emails' />
            <div tw="flex justify-center">
            <tst.SubmitButton type="submit">
                <SendIcon className="icon" />
                {/* <span className="text">{'Submit'}</span> */}
            </tst.SubmitButton>
            </div>
            {fieldsFilled ? <Alert severity="warning">All fields needs to be filled</Alert> : ''}
        </tst.Form>
    );
};

export default TripAdd;