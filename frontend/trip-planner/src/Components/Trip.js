import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Email from './EmailAdd';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import {insertTrip} from '../Api';


function Trip(props) {
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [emails, setEmails] = useState([]);
    const [insertFailed, setInsertFailed] = useState(false);
    const [fieldsFilled, setFieldsFilled] = useState(false);


    const options = useMemo(() => countryList().getData(), []);
    const changeHandler = value => {
        setCountry(value)
    };

    function handleTextChange(e) {
        setCity(e.target.value);
    };

    async function insertUserTrip(trip) {
        const result = await insertTrip(trip);
        if (result.status === 200) {
            return result;
        } else {
            setInsertFailed(true);
        }
    }

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
            await insertUserTrip(newTrip);
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
            <Email email={emails} setEmails={setEmails} />
            <button type="submit" value="Submit" className="submitButton">Submit trip</button>
            <div className="failed">
                {fieldsFilled ? 'All fields needs to be filled' : ''}
                {insertFailed ? 'Problem adding trip' : ''}
            </div>
        </form>
    );
};

export default Trip;