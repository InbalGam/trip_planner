import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Email from './EmailAdd';
import Select from 'react-select';
import countryList from 'react-select-country-list';


function Trip(props) {
    const [text, setText] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [emails, setEmails] = useState([]);

    const options = useMemo(() => countryList().getData(), []);
    const changeHandler = value => {
        setCountry(value)
    };

    function handleTextChange(e) {
        setText(e.target.value);
        setCity(text);
    };

    function submitTrip(e) {
        e.preventDefault();
        const newTrip = {
            country: country,
            city: city,
            start_date: startDate,
            end_date: endDate,
            emails: emails
        }
        props.setTrips((prev) => [newTrip, ...prev]);
    };

    return (
        <form onSubmit={submitTrip}>
            <Select options={options} value={country} onChange={changeHandler} />
            <label for='city'>City</label>
            <input id='city' type='text' name='city' value={text} placeholder={'Enter city here'} onChange={handleTextChange} className="trip_input"/>
            <label for='start_date'>Start date</label>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat='dd-MMM-yy' />
            <label for='end_date'>End date</label>
            <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat='dd-MMM-yy' />
            <Email email={emails} setEmails={setEmails} />
            <button type="submit" value="Submit" className="submitButton">Submit trip</button>
        </form>
    );
};

export default Trip;