import { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Email from './EmailAdd';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import {insertTrip, getSpecificTrip, updateTrip} from '../Api';
import { useNavigate } from 'react-router-dom';


function TripAdd(props) {
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [emails, setEmails] = useState([]);
    const [insertFailed, setInsertFailed] = useState(false);
    const [fieldsFilled, setFieldsFilled] = useState(false);
    const [updateFailed, setUpdateFailed] = useState(false);
    const [trip, setTrip] = useState({});
    const navigate = useNavigate();


    const options = useMemo(() => countryList().getData(), []);
    const changeHandler = value => {
        setCountry(value)
    };

    function handleTextChange(e) {
        setCity(e.target.value);
    };


    async function insertUserTrip(trip) {
        try {
            const result = await insertTrip(trip);
            if (result.status === 200) {
                return result;
            } else {
                setInsertFailed(true);
            }
        } catch (e) {
            navigate('/error');
        }
    };


    async function getATrip(id) {
        try {
            const tripDB = await getSpecificTrip(id);
            const jsonData = await tripDB.json();
            setTrip(jsonData);
            setCountry(options.filter(obj => obj.label === jsonData.country)[0]);
            setCity(jsonData.city);
            const emailsDB = jsonData.userData.map(el => el.username);
            setEmails(emailsDB);
            setStartDate(new Date(jsonData.start_date));
            setEndDate(new Date(jsonData.end_date));
        } catch (e) {
            navigate('/error');
        }
    };


    useEffect(() => {
        if (!props.isTripAdd) {
            getATrip(props.trip.id);
        }
    }, []);


    async function updateUserTrip(updatedTrip) {
        try {
            const result = await updateTrip(updatedTrip, props.trip.id);
            if (result.status === 200) {
                return result;
            } else {
                setUpdateFailed(true);
            }
        } catch (e) {
            navigate('/error');
        }
    };


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
                emails: emails
            }
            if (props.isTripAdd) {
                await insertUserTrip(newTrip);
            } else {
                await updateUserTrip(newTrip);
            }
            props.getUserTrips();
            setCity('');
            setCountry('');
            setEmails([]);
            setStartDate(new Date());
            setEndDate(new Date());
            props.setShowForm(false);
        }
    };

    return (
        <form onSubmit={submitTrip}>
            <Select options={options} value={country} onChange={changeHandler} />
            <label for='city'>City</label>
            <input id='city' type='text' name='city' value={city} placeholder={'Enter city here'} onChange={handleTextChange} className="trip_input"/>
            <label for='start_date'>Start date</label>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat='dd-MMM-yy' />
            <label for='end_date'>End date</label>
            <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat='dd-MMM-yy' />
            <Email email={emails} emails={emails} setEmails={setEmails} />
            <button type="submit" value="Submit" className="submitButton">Submit trip</button>
            <div className="failed">
                {fieldsFilled ? 'All fields needs to be filled' : ''}
                {insertFailed ? 'Problem adding trip' : ''}
                {updateFailed ? 'Problem updating trip' : ''}
            </div>
        </form>
    );
};

export default TripAdd;