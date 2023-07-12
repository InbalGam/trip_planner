import { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Email from './EmailAdd';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import styles from './Styles/TripAddUpdate.css';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import {getSpecificTrip} from '../Api';
import AutoComplete from 'react-google-autocomplete';
import {GOOGLE_API} from '../apiKey';


function TripAdd(props) {
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [emails, setEmails] = useState([]);
    const [fieldsFilled, setFieldsFilled] = useState(false);
    const navigate = useNavigate();


    const options = useMemo(() => countryList().getData(), []);
    const changeHandler = value => {
        setCountry(value)
    };

    function handleTextChange(e) {
        setCity(e.target.value);
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
            props.onTripSubmit(newTrip);
            setCity('');
            setCountry('');
            setEmails([]);
            setStartDate(new Date());
            setEndDate(new Date());
        }
    };

    return (
        <form onSubmit={submitTrip} className={'tripForm'}>
            <Select options={options} value={country} onChange={changeHandler} className="countrySelect"/>
            <label for='city'>City</label>
            <AutoComplete apiKey={GOOGLE_API} value={city} placeholder={'Enter city here'} onChange={handleTextChange} onPlaceSelected={(place) => setCity(place.formatted_address)} options={{fields:['ALL']}}/>
            <label for='start_date'>Start date</label>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat='dd-MMM-yy' className="datePick" />
            <label for='end_date'>End date</label>
            <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat='dd-MMM-yy' className="datePick" />
            <Email email={emails} emails={emails} setEmails={setEmails} className='emails'/>
            <button type="submit" value="Submit" className="submitButton"><SendIcon/></button>
            <div className="failed">
                {fieldsFilled ? 'All fields needs to be filled' : ''}
            </div>
        </form>
    );
};

export default TripAdd;