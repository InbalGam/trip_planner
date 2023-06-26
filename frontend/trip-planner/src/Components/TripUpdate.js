import { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Email from './EmailAdd';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import {getSpecificTrip, updateTrip} from '../Api';


function TripUpdate(props) {
    const [trip, setTrip] = useState({});
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [emails, setEmails] = useState([]);
    const [updateFailed, setUpdateFailed] = useState(false);
    const [fieldsFilled, setFieldsFilled] = useState(false);


    const options = useMemo(() => countryList().getData(), []);
    const changeHandler = value => {
        setCountry(value)
    };

    function handleTextChange(e) {
        setCity(e.target.value);
    };

    async function getATrip(id) {
        const tripDB = await getSpecificTrip(id);
        const jsonData = await tripDB.json();
        setTrip(jsonData);
        setCountry(options.filter(obj => obj.label === jsonData.country)[0]);
        setCity(jsonData.city);
        const emailsDB = jsonData.userData.map(el => el.username);
        setEmails(emailsDB);
        setStartDate(new Date(jsonData.start_date));
        setEndDate(new Date(jsonData.end_date));
    };


    useEffect(() => {
        getATrip(props.trip.id);
    }, []);


    async function updateUserTrip(updatedTrip) {
        const result = await updateTrip(updatedTrip, props.trip.id);
        if (result.status === 200) {
            return result;
        } else {
            setUpdateFailed(true);
        }
    };


    async function updateTrip(e) {
        e.preventDefault();
        if (!country.label || !city || !startDate || !endDate || !emails) {
            setFieldsFilled(true);
        } else {
            const updatedTrip = {
                country: country.label,
                city: city,
                start_date: startDate,
                end_date: endDate,
                emails: emails
            }
            await updateUserTrip(updatedTrip);
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
        <form onSubmit={updateTrip}>
            <Select options={options} value={country} onChange={changeHandler} />
            <label for='city'>City</label>
            <input id='city' type='text' name='city' value={city} placeholder={'Enter city here'} onChange={handleTextChange} className="trip_input"/>
            <label for='start_date'>Start date</label>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat='dd-MMM-yy' />
            <label for='end_date'>End date</label>
            <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat='dd-MMM-yy' />
            <Email email={emails} emails={emails} setEmails={setEmails} />
            <button type="submit" value="Submit" className="submitButton">Update trip</button>
            <div className="failed">
                {fieldsFilled ? 'All fields needs to be filled' : ''}
                {updateFailed ? 'Problem updating trip' : ''}
            </div>
        </form>
    );
};

export default TripUpdate;