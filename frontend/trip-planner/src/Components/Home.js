import ClipLoader from 'react-spinners/ClipLoader';
import { useEffect } from "react";
import {getTrips} from '../Api';
import { useNavigate } from 'react-router-dom';


function Home() {
    const navigate = useNavigate();

    async function getUserTrips() {
        try {
            const result = await getTrips();
            if (result.status === 200) {
                navigate('/trips');
            } else if (result.status === 401) {
                navigate('/login');
            }
        } catch (e) {
            navigate('/error');
        }
    };

    useEffect(() => {
        getUserTrips();
    },[]);

    return (
        <ClipLoader color={'#3c0c21'} size={150} className='loader' />
    );
};

export default Home;