import { useState, useEffect } from "react";
import {logout} from '../Api';


function Logout() {
    const [logOut, setLogOut] = useState(false);

    async function loggingOut() {
        const result = await logout();
        if (result.status === 200) {
            setLogOut(true);
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