import { Link } from 'react-router-dom';
import styles from './Styles/Navigation.css';


function Navigation() {
    return (
        <div className="nav">
            <div className='nav-bar'>
                <p>The Trip Planner</p>
                <div className='nav-links'>
                    <Link to='/trips' className='tripsLink'>Trips</Link>
                    <Link to='/logout' className='logoutLink'>Log out</Link>
                </div>
            </div>
        </div>
    );
};

export default Navigation;