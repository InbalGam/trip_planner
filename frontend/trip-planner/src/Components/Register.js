import { useState } from "react";
import {register} from '../Api';
import {validateEmail} from '../utils';
import { useNavigate} from 'react-router-dom';
//import styles from './Styles/Register.css';
import ClipLoader from 'react-spinners/ClipLoader';
import tw from "twin.macro";
import {css} from "styled-components/macro"; //eslint-disable-line
import Alert from '@mui/material/Alert';
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import googleIconImageSrc from "./Styles/images/google-icon.png";
import * as rst from './Styles/RegisterStyles';
import {baseURL} from '../apiKey';
import signupImg from './Styles/images/clarisse-meyer-d6pLNFVZt_4-unsplash.jpg';


function Register({
    socialButtons = [
        {
          iconImageSrc: googleIconImageSrc,
          text: "Sign Up With Google",
          url: `${baseURL}/login/google`
        }
      ],
    submitButtonText = "Sign Up",
    SubmitButtonIcon = SignUpIcon,
    signInUrl='/login',
    illustrationImageSrc = signupImg
}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [validUsername, setValidUsername] = useState(true);
    const [registerAuth, setRegisterAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const[msg, setMsg] = useState('');
    const navigate = useNavigate();

    function handleUsernameChange(e) {
        setUsername(e.target.value);
        setValidUsername(validateEmail(e.target.value));
    };

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    };

    function handleNicknameChange(e) {
        setNickname(e.target.value);
    };


    async function submitForm(e) {
        e.preventDefault();
        
        if ((password.length >= 8) && (nickname.length >= 3) && validUsername) {
            try {
                setIsLoading(true);
                const result = await register(username, password, nickname);
                const jsonData = await result.json();
                setMsg(jsonData.msg);
                if (result.status === 201) {
                    setUsername('');
                    setPassword('');
                    setNickname('');
                    setValidUsername(true);
                    navigate('/login?register=1');
                    setIsLoading(false);
                } else {
                    setRegisterAuth(true);
                    setMsg(jsonData.msg);
                    setIsLoading(false);
                }
            } catch (e) {
                navigate('/error');
            }
        }
    };


    return (
        <rst.Container>
            <rst.Content>
                <rst.MainContainer>
                    <rst.MainContent>
                        <rst.Heading>{'Sign Up To The Trip Planner'}</rst.Heading>
                        <rst.FormContainer>
                            <rst.SocialButtonsContainer>
                                {socialButtons.map((socialButton, index) => (
                                    <rst.SocialButton key={index} href={socialButton.url}>
                                        <span className="iconContainer">
                                            <img src={socialButton.iconImageSrc} className="icon" alt="" />
                                        </span>
                                        <span className="text">{socialButton.text}</span>
                                    </rst.SocialButton>
                                ))}
                            </rst.SocialButtonsContainer>
                            <rst.DividerTextContainer>
                                <rst.DividerText>Or Sign up with your e-mail</rst.DividerText>
                            </rst.DividerTextContainer>
                            <rst.Form onSubmit={submitForm}>
                                <rst.Input type="email" placeholder="Email" value={username} onChange={handleUsernameChange} />
                                <p tw="mt-4">{username && !validUsername ? <Alert severity="warning">The username needs to be a valid email</Alert> : ''}</p>
                                <rst.Input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                                <p tw="mt-4">{password && (password.length < 8) ? <Alert severity="warning">Password is less than 8 characters</Alert> : ''}</p>
                                <rst.Input type="text" placeholder="Username" value={nickname} onChange={handleNicknameChange} />
                                <p tw="mt-4">{nickname && (nickname.length < 3) ? <Alert severity="warning">Nickname is less than 3 characters</Alert> : ''}</p>
                                <rst.LoaderContainer>
                                    {isLoading ? <ClipLoader color={'#3c0c21'} size={150} className='submitLoader' /> :
                                        <rst.SubmitButton type="submit">
                                            <SubmitButtonIcon className="icon" />
                                            <span className="text">{submitButtonText}</span>
                                        </rst.SubmitButton>}
                                </rst.LoaderContainer>
                                <p tw="mt-4">{msg ? <Alert severity="warning">{msg}</Alert> : ''}</p>
                            </rst.Form>
                            <p tw="mt-4">{registerAuth ? <Alert severity="warning">Could not register</Alert> : ''}</p>
                            <p tw="mt-8 text-sm text-gray-600 text-center">
                                Already have an account?{" "}
                                <a href={signInUrl} tw="border-b border-gray-500 border-dotted">
                                    Sign In
                                </a>
                            </p>
                        </rst.FormContainer>
                    </rst.MainContent>
                </rst.MainContainer>
                <rst.IllustrationContainer>
                    <rst.IllustrationImage imageSrc={illustrationImageSrc} aria-label="Photo by Clarisse Meyer"/>
                </rst.IllustrationContainer>
            </rst.Content>
        </rst.Container>
    );
};

export default Register;