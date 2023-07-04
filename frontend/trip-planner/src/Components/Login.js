import { Link } from 'react-router-dom';
import { useState } from "react";
import {login} from '../Api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Styles/Login.css';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authFailed, setAuthFailed] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    };

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    };

    async function submitLogin(e) {
        e.preventDefault();
        setAuthFailed(false);
        try {
            const result = await login(username, password);
            if (result === true) {
                navigate('/trips');
            } else {
                setAuthFailed(true);
            }
        } catch (e) {
            navigate('/error');
        }
    };

    return (
        <div className={styles.login_container}>
            <p className={styles.messages}>{searchParams.get("logout") ? 'Succefully logged out' : ''}</p>
            <p className={styles.messages}>{searchParams.get("register") ? 'Succefully registered, you can log in' : ''}</p>
            <p className={styles.loginHeadline}>Log in below</p>
            <form onSubmit={submitLogin} className={styles.loginForm}>
                <label for='username'>Username</label>
                <input id='username' type='text' name='username' value={username} placeholder={'username'} onChange={handleUsernameChange} />
                <label for='password'>Password</label>
                <input id='password' type='password' name='password' value={password} placeholder={'password'} onChange={handlePasswordChange} />
                <button type="submit" value="Submit">Submit</button>
            </form>
            <div className={styles.authStatus}>
                {authFailed ? 'Username or Password are incorrect, try again' : ''}
            </div>
            <p className={styles.registrationHeadline}>Not registered yet?</p>
            <Link to='/register' className={styles.registrationLink} >Register here</Link>
        </div>
    );
};

export default Login;