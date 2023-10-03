import { Link } from 'react-router-dom';
import { useState } from "react";
import {login} from '../Api';
import { useNavigate, useSearchParams } from 'react-router-dom';
//import styles from './Styles/Login.css';
import ClipLoader from 'react-spinners/ClipLoader';
import AnimationRevealPage from "./helpers/AnimationRevealPage.js";
import * as lst from './Styles/LoginStyles';
//import illustration from "./Styles/images/login-illustration.svg";
import loginImg from './Styles/images/marissa-grootes-TVllFyGaLEA-unsplash.jpg';
import googleIconImageSrc from "./Styles/images/google-icon.png";
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import {baseURL} from '../apiKey';
import Alert from '@mui/material/Alert';
//import { Container as ContainerBase } from "./helpers/Layouts";


function Login({
    socialButtons = [
    {
      iconImageSrc: googleIconImageSrc,
      text: "Sign In With Google",
      url: `${baseURL}/login/google`
    }
  ],
  submitButtonText = "Sign In",
  SubmitButtonIcon = LoginIcon,
  illustrationImageSrc = loginImg,
  signupUrl='/register'
}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authFailed, setAuthFailed] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    };

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    };

    async function submitLogin(e) {
        setIsLoading(true);
        e.preventDefault();
        setAuthFailed(false);
        try {
            const result = await login(username, password);
            if (result === true) {
                navigate('/trips');
                setIsLoading(false);
            } else {
                setAuthFailed(true);
                setIsLoading(false);
            }
        } catch (e) {
            navigate('/error');
        }
    };

    return (
        <AnimationRevealPage className='iframe#webpack-dev-server-client-overlay{display:none!important}'>
            <lst.Container>
                <lst.Content>
                    <lst.MainContainer>
                        <lst.MainContent>
                            <lst.Heading>{'Sign In To The Trip Planner'}</lst.Heading>
                            <p className='mt-4'>{searchParams.get("logout") ? <Alert severity="success">Succefully logged out</Alert> : ''}</p>
                            <p className='mt-4'>{searchParams.get("register") ? <Alert severity="success">Succefully registered, you can log in</Alert> : ''}</p>
                            <lst.FormContainer>
                                <lst.SocialButtonsContainer>
                                    {socialButtons.map((socialButton, index) => (
                                        <lst.SocialButton key={index} href={socialButton.url}>
                                            <span className="iconContainer">
                                                <img src={socialButton.iconImageSrc} className="icon" alt="" />
                                            </span>
                                            <span className="text">{socialButton.text}</span>
                                        </lst.SocialButton>
                                    ))}
                                </lst.SocialButtonsContainer>
                                <lst.DividerTextContainer>
                                    <lst.DividerText>Or Sign in with your e-mail</lst.DividerText>
                                </lst.DividerTextContainer>
                                <lst.Form onSubmit={submitLogin}>
                                    <lst.Input type="email" placeholder="Email" value={username} onChange={handleUsernameChange}/>
                                    <lst.Input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                                    {isLoading ? <ClipLoader color={'#3c0c21'} size={150} className='submitLoader'/> :
                                    <lst.SubmitButton type="submit">
                                        <SubmitButtonIcon className="icon" />
                                        <span className="text">{submitButtonText}</span>
                                    </lst.SubmitButton>}
                                </lst.Form>
                                <p className="mt-6 text-xs text-gray-600 text-center">
                                    {authFailed ? <Alert severity="warning">Username or Password are incorrect, try again</Alert> : ''}
                                    {/* <a href={forgotPasswordUrl} tw="border-b border-gray-500 border-dotted">
                                        Forgot Password ?
                                    </a> */}
                                </p>
                                <p className="mt-8 text-sm text-gray-600 text-center">
                                    Dont have an account?{" "}
                                    <a href={signupUrl} className="border-b border-gray-500 border-dotted">
                                        Sign Up
                                    </a>
                                </p>
                            </lst.FormContainer>
                        </lst.MainContent>
                    </lst.MainContainer>
                    <lst.IllustrationContainer>
                        <lst.IllustrationImage imageSrc={illustrationImageSrc} />
                    </lst.IllustrationContainer>
                </lst.Content>
            </lst.Container>
        </AnimationRevealPage>
        // <div className={'login_container'}>
        //     <p className={'messages'}>{searchParams.get("logout") ? 'Succefully logged out' : ''}</p>
        //     <p className={'messages'}>{searchParams.get("register") ? 'Succefully registered, you can log in' : ''}</p>
        //     <h1 className='loginH1'><LuggageIcon /> The Trip Planner</h1>
        //     <p className={'loginHeadline'}>Log in below</p>
        //     <form onSubmit={submitLogin} className={'loginForm'}>
        //         <label for='username'>Username</label>
        //         <input id='username' type='text' name='username' value={username} placeholder={'username'} onChange={handleUsernameChange} />
        //         <label for='password'>Password</label>
        //         <input id='password' type='password' name='password' value={password} placeholder={'password'} onChange={handlePasswordChange} />
        //         {isLoading ? <ClipLoader color={'#3c0c21'} size={150} className='submitLoader'/> : <button type="submit" value="Submit">Log in</button>}
        //     </form>
        //     <div className={'authStatus'}>
        //         {authFailed ? 'Username or Password are incorrect, try again' : ''}
        //     </div>
        //     <p className={'registrationHeadline'}>Not registered yet?</p>
        //     <Link to='/register' className={'registrationLink'} >Register here</Link>
        // </div>
    );
};

export default Login;