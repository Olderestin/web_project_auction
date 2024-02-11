import { useState } from "react"
import { login } from '../api/authApi'
import ControlledInput from './ControlledInput'
import Icon from '@mdi/react'
import { mdiChevronLeftCircle, mdiEyeOff, mdiEye } from '@mdi/js'
import '../styles/SignIn.scss'
import '../styles/SignUp.scss'

function SignIn({ setOnPage, setUserData }) {
    const [currForm, setCurrForm] = useState({username: '', password: ''});
    const [showPassword, setShowPassword] = useState(false);

    function signIn(currForm) {
        login(currForm)
            .then((data) => {
                const userDataString = JSON.stringify(data);
                sessionStorage.setItem('userData', userDataString)
                setUserData(data);
                sessionStorage.setItem('onPage', 'profile');
                setOnPage('profile');
            })
            .catch((error) => {
                alert('Invalid credentials.');
            });
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
                    <h1 className="header">Sign in</h1>
                    <p className="text">to continue</p>
                </div>
            <form className="form">
                <div className="inputs-block">
                    <ControlledInput placeholder="Username" maxLength={50} name='username' currForm={currForm} setCurrForm={setCurrForm} type='text' />
                    <div className="password-container">
                        <ControlledInput placeholder="Password" maxLength={50} name='password' currForm={currForm} setCurrForm={setCurrForm} type={showPassword ? 'text': 'password'} />
                        <button type='button' className="password-btn" onClick={handleShowPassword}>
                            <Icon className="password-icon" path={showPassword ? mdiEye: mdiEyeOff}/>
                        </button>
                    </div>
                </div>
                <div className="remember-forgot-container">
                    <div className="remember-container">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                    </div>
                    <a className="forgot-container">Forgot your password?</a>
                </div>
                <button className="btn" type='button' onClick={() => {
                    if (currForm.username.length < 6) {
                        alert('Username must contain at least 6 characters');
                        return;
                    }
                    else if (currForm.password.length < 6) {
                        alert('Password must contain at least 6 characters');
                        return;
                    }
                    else {
                        signIn(currForm);
                    }
                }}>Sign in</button>
            </form>
            <div className="not-have-account-texts">
                <div className="not-have-account-text1">Don't have an account?</div>
                <a className="not-have-account-text2" onClick={() => {
                    sessionStorage.setItem('onPage', 'signUp');
                    setOnPage('signUp');
                    }}>Sign up</a>
            </div>
        </div>
        </>
    )
}

export default SignIn;