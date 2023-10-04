import {  Outlet, NavLink } from "react-router-dom";
import styles from './Styles/Root.css';
import Header from "./Header";


function Root() {
    return (
        <div>
            <Header/>
            <Outlet />
        </div>
    );

};

export default Root;