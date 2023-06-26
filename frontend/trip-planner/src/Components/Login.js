import { Link } from 'react-router-dom';
import { useState } from "react";


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    };

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    };


    return(
        <div className="login">
            <p>Log in below</p>
            <label for='username'>Username</label>
            <input id='username' type='text' name='username' value={username} placeholder={'username'} onChange={handleUsernameChange}/>
            <label for='password'>Password</label>
            <input id='password' type='text' name='password' value={password} placeholder={'password'} onChange={handlePasswordChange}/>
            <p>Not registered yet?</p>
            <Link to='/register'>Register here</Link>
        </div>
    );
};

export default Login;