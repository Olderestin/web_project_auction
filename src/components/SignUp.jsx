import { useState } from "react"
import ControlledInput from './ControlledInput'
import { register } from '../api/authApi'
import '../styles/SignUp.scss'
import Icon from '@mdi/react';
import { mdiFacebook, mdiGoogle, mdiChevronLeftCircle, mdiEyeOff, mdiEye } from '@mdi/js';

function SignUp({ setOnPage, setUserData }) {
    const [currForm, setCurrForm] = useState({first_name: '', last_name: '', username: '', password: ''});
    const [agreement, setAgreement] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function signUp(currForm) {
        register(currForm)
            .then((data) => {
                console.log(data);
                setUserData({username: data.username, tokens: {...data.tokens}});
                sessionStorage.setItem('onPage', 'profile');
                setOnPage('profile');
            })
            .catch((error) => {
                alert('Sign up error. Try again later.');
            });
    }

    const handleAgreement = (e) => {
        e.stopPropagation();
        setAgreement(e.target.checked);
      }

    const handleShowPassword = (e) => {
        e.stopPropagation();
        setShowPassword(!showPassword);
     }

    return (
        <>
        <button className="back-btn" type='button' onClick={() => {
            sessionStorage.setItem('onPage', 'init');
            setOnPage('init');
            }}>
            <Icon className="back-icon" path={mdiChevronLeftCircle} />
            <p className="back-text">Back</p>
        </button>
        <div className="container">
            <div className="header-block">
                <h1 className="header">Sign up</h1>
                <p className="text">to continue</p>
            </div>
            <form className="form">
                <div className="inputs-block">
                    <ControlledInput placeholder="First name" maxLength={50} name='first_name' currForm={currForm} setCurrForm={setCurrForm} type='text' />
                    <ControlledInput placeholder="Last name" maxLength={50} name='last_name' currForm={currForm} setCurrForm={setCurrForm} type='text' />
                    <ControlledInput placeholder="Username" maxLength={50} name='username' currForm={currForm} setCurrForm={setCurrForm} type='text' />
                    <div className="password-container">
                        <ControlledInput placeholder="Password" maxLength={50} name='password' currForm={currForm} setCurrForm={setCurrForm} type={showPassword ? 'text': 'password'} />
                        <button type='button' className="password-btn" onClick={handleShowPassword}>
                            <Icon className="password-icon" path={showPassword ? mdiEye: mdiEyeOff}/>
                        </button>
                    </div>
                </div>
                <div>
                    <div className="agree-container">
                        <input type="checkbox" id="agree" onChange={handleAgreement}/>
                        <label htmlFor="agree">I agree with User Agreement and Privacy Policy</label>
                    </div>
                </div>
                <button disabled={!agreement} className="btn" type='button' onClick={() => {
                    if (currForm.first_name.length < 6) {
                        alert ('First name must contain at least 6 characters.');
                        return;
                    }
                    else if (currForm.last_name.length < 6) {
                        alert ('Last name must contain at least 6 characters.');
                        return;
                    }
                    else if (currForm.username.length < 6) {
                        alert ('Username must contain at least 6 characters.');
                        return;
                    }
                    else if (currForm.password.length < 6) {
                        alert ('Password must contain at least 6 characters.');
                        return;
                    }
                    const regex = /^[a-zA-Z0-9_]+$/
                    if (!regex.test(currForm.username)) {
                        alert('Username must contain only letters, numbers and underscores.');
                        return;
                    }
                    signUp(currForm);
                }}>Sign up</button>
            </form>
            <div className="line-block">
                <div className="line"></div>
                <p className="or-text">or</p>
                <div className="line"></div>
            </div>
            <div className="or-icons">
                <Icon className="or-icon" path={mdiGoogle} />
                <Icon className="or-icon" path={mdiFacebook} />
            </div>
            <div className="have-account-texts">
                <div className="have-account-text1">Have an account?</div>
                <a className="have-account-text2" onClick={() => {
                    sessionStorage.setItem('onPage', 'signUp');
                    setOnPage('signIn');
                    }}>Sign in</a>
            </div>
        </div>
        </>
    )
}

export default SignUp;