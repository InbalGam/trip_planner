import { useState } from "react";
import {register} from '../Api';
import {validateEmail} from '../utils';
import { Link, useNavigate} from 'react-router-dom';


function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [validUsername, setValidUsername] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [validNickname, setValidNickname] = useState(true);
    const [registerAuth, setRegisterAuth] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const[msg, setMsg] = useState('');
    const navigate = useNavigate();

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    };

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    };

    function handleNicknameChange(e) {
        setNickname(e.target.value);
    };


    async function submitForm(e) {
        e.preventDefault();
        setValidPassword(password.length >= 8);
        setValidNickname(nickname.length >= 3);
        setValidUsername(validateEmail(username));
        
        if ((password.length >= 8) && (nickname.length >= 3) && (validateEmail(username))) {
            try {
                const result = await register(username, password, nickname);
                const jsonData = await result.json();
                setMsg(jsonData.msg);
                console.log(jsonData.msg);
                if (result.status === 201) {
                    setRegisterSuccess(!registerSuccess);
                    setUsername('');
                    setPassword('');
                    setNickname('');
                    setValidNickname(true);
                    setValidPassword(true);
                    setValidUsername(true);
                    navigate('/login?register=1')
                } else {
                    setRegisterAuth(!registerAuth);
                }
            } catch (e) {
                navigate('/error');
            }
        }
    };


    return (
        <div>
            <h2>Welcome to The Trip Planner</h2>
            <h3>You are minutes away from starting to plan your dream vacation!</h3>
            <form onSubmit={submitForm}>
                <label htmlFor='username'>Email-</label>
                <input id='username' type='text' name='username' value={username} placeholder={'Enter your email here'} onChange={handleUsernameChange} />
                {validUsername ? '' : 'The username needs to be a valid email'}
                <label htmlFor='password'>Password-</label>
                <input id='password' type='password' name='password' value={password} placeholder={'Enter your password here'} onChange={handlePasswordChange} />
                {validPassword ? '' : 'Your password must be at least 8 characters'}
                <label htmlFor='nickname'>Nickname-</label>
                <input id='nickname' type='text' name='nickname' value={nickname} placeholder={'Enter your nickname here'} onChange={handleNicknameChange} />
                {validNickname ? '' : 'Your nickname must be at least 3 characters'}
                <button type="submit" value="Submit" className="submitButton">Submit</button>
                {registerAuth ? 'Could not register' : ''}
                {msg ? msg : ''}
            </form>
        </div>
    );
};

export default Register;