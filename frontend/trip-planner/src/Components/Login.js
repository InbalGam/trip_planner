import { Link } from 'react-router-dom';
import { useState } from "react";
import {login} from '../Api';
import { useNavigate } from 'react-router-dom';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authFailed, setAuthFailed] = useState(false);
    const navigate = useNavigate();

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
        <div className="login">
            <p>Log in below</p>
            <form onSubmit={submitLogin}>
                <label for='username'>Username</label>
                <input id='username' type='text' name='username' value={username} placeholder={'username'} onChange={handleUsernameChange} />
                <label for='password'>Password</label>
                <input id='password' type='password' name='password' value={password} placeholder={'password'} onChange={handlePasswordChange} />
                <button type="submit" value="Submit">Submit</button>
            </form>
            <div className='authStatus'>
                {authFailed ? 'Username or Password are incorrect, try again' : ''}
            </div>
            <p>Not registered yet?</p>
            <Link to='/register'>Register here</Link>
        </div>
    );
};

export default Login;