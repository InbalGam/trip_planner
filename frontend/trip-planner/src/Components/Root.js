import {  Outlet, NavLink } from "react-router-dom";
import styles from './Styles/Root.css';


function Root() {
    return (
        <div>
            <div className="nav">
                <div className='nav-bar'>
                    <p>The Trip Planner</p>
                    <div className='nav-links'>
                        <NavLink to='/trips' className='tripsLink'>Trips</NavLink>
                        <NavLink to='/logout' className='logoutLink'>Log out</NavLink>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );

};

export default Root;