import { useState, useEffect } from "react";
import {logout} from '../Api';
import { useNavigate } from 'react-router-dom';


function Logout() {
    const navigate = useNavigate();

    async function loggingOut() {
        const result = await logout();
        if (result.status === 200) {
            navigate('/login?logout=1');
        }
    };

    useEffect(() => {
        loggingOut();
    }, []);
};

export default Logout;