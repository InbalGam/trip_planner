import { useRef,useState } from "react";
import DatePicker from 'react-date-picker';


function Trip() {
    const [text, setText] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    function handleTextChange(e) {
        setText(e.target.value);
    };

    function submitTrip() {
        
    };

    return (
        <form onSubmit={submitTrip}>
            <label for='country'>Country</label>
            <input id='country' type='text' name='country' value={text} placeholder={'Enter country here'} onChange={handleTextChange} className="trip_input"/>
            <label for='city'>City</label>
            <input id='city' type='text' name='city' value={text} placeholder={'Enter city here'} onChange={handleTextChange} className="trip_input"/>
            <label for='start_date'>Start date</label>
            <DatePicker value={startDate} onChange={date => setStartDate(date)} />
            <label for='end_date'>End date</label>
            <DatePicker value={endDate} onChange={date => setEndDate(date)} />
            <button type="submit" value="Submit" className="submitButton">Submit trip</button>
        </form>
    );
};

export default Trip;