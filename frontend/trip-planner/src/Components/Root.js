import {  Outlet, NavLink } from "react-router-dom";
import styles from './Styles/Root.css';
import LuggageIcon from '@mui/icons-material/Luggage';


function Root() {
    return (
        <div>
            <div className='nav-bar'>
                <p><LuggageIcon className="luggageIcon"/> The Trip Planner</p>
                <div className='nav-links'>
                    <NavLink to='/trips' className='tripsLink'>Trips</NavLink>
                    <NavLink to='/logout' className='logoutLink'>Log out</NavLink>
                </div>
            </div>
            <Outlet />
        </div>
    );

};

export default Root;