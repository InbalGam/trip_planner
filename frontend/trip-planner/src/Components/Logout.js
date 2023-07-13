import { useState, useEffect } from "react";
import {logout} from '../Api';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';


function Logout() {
    const navigate = useNavigate();

    async function loggingOut() {
        try {
            const result = await logout();
            if (result.status === 200) {
                navigate('/login?logout=1');
            } else {
                navigate('/error');
            }
        } catch (e) {
            navigate('/error');
        }
    };

    useEffect(() => {
        loggingOut();
    }, []);

    return (
        <div>
            <ClipLoader color={'#3c0c21'} size={150} className='submitLoader' />
        </div>
    );
};

export default Logout;