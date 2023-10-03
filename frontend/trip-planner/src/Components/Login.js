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
import tw from "twin.macro";
import {css} from "styled-components/macro"; //eslint-disable-line


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
                            <p tw="mt-4">{searchParams.get("logout") ? <Alert severity="success">Succefully logged out</Alert> : ''}</p>
                            <p tw="mt-4">{searchParams.get("register") ? <Alert severity="success">Succefully registered, you can log in</Alert> : ''}</p>
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
                                    <lst.LoaderContainer>
                                        {isLoading ? <ClipLoader color={'#3c0c21'} size={150} className='submitLoader'/> :
                                        <lst.SubmitButton type="submit">
                                            <SubmitButtonIcon className="icon" />
                                            <span className="text">{submitButtonText}</span>
                                        </lst.SubmitButton>}
                                    </lst.LoaderContainer>
                                </lst.Form>
                                <p tw="mt-4">{authFailed ? <Alert severity="warning">Username or Password are incorrect, try again</Alert> : ''}</p>
                                {/* <p tw="mt-6 text-xs text-gray-600 text-center">
                                    <a href={forgotPasswordUrl} tw="border-b border-gray-500 border-dotted">
                                        Forgot Password ?
                                    </a>
                                </p> */}
                                <p tw="mt-8 text-sm text-gray-600 text-center">
                                    Dont have an account?{" "}
                                    <a href={signupUrl} tw="border-b border-gray-500 border-dotted">
                                        Sign Up
                                    </a>
                                </p>
                            </lst.FormContainer>
                        </lst.MainContent>
                    </lst.MainContainer>
                    <lst.IllustrationContainer>
                        <lst.IllustrationImage imageSrc={illustrationImageSrc} aria-label="Photo by Marissa Grootes"/>
                    </lst.IllustrationContainer>
                </lst.Content>
            </lst.Container>
        </AnimationRevealPage>
    );
};

export default Login;