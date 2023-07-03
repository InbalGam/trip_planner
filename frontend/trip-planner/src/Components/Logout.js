import { useState, useEffect } from "react";
import {logout} from '../Api';
import { useNavigate } from 'react-router-dom';


function Logout() {
    const [logOut, setLogOut] = useState(false);
    const navigate = useNavigate();

    async function loggingOut() {
        const result = await logout();
        if (result.status === 200) {
            setLogOut(true);
            navigate('/login?logout=1');
        }
    };

    useEffect(() => {
        loggingOut();
    }, []);

    return (
        <div>
            <p>{logOut ? 'Succefully logged out' : ''}</p>
        </div>
    );
};

export default Logout;