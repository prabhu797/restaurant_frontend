import React,{ useState, useContext, useEffect } from 'react';
import ApiContext from '../contexts/ApiContext';

function Login(props) {

    let apiKeyFucntion = useContext(ApiContext);

    //SignuUp start
    const [email, setEmail] = useState('');
    const [validateEmail, setValidateEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [validateContact, setValidateContact] = useState('');
    const [password, setPassword] = useState('');
    const [validatePassword, setValidatePassword] = useState('');
    const [hidden, setHidden] = useState(true);
    const [message, setMessage] = useState('');
    const [responseCode, setResponseCode] = useState('');

    const validateEmailForm = (e) => {
        let emailValue = e.target.value;
        if(emailValue.length === 0) {
            setValidateEmail('');
        }
        if(emailValue.length > 11) {
            if(emailValue.endsWith('@gmail.com')) {
                setValidateEmail('valid');
                setEmail(emailValue);
            } else if(emailValue.includes('@') && emailValue.includes('.com')) {
                setValidateEmail('invalid');
            } else {
                setValidateEmail('');
            }
        }
    }

    const validateContactNumber = (e) => {
        let number = "" + e.target.value;
        let res = ['5', '4', '3', '2', '1', '0'].some(word => number.startsWith(word));
        if(number.length === 10 && !res) {
            setValidateContact("valid");
            setContactNumber(number);
        } else if(number.length === 0) {
            setValidateContact('');
        } 
        else {
            setValidateContact("invalid");
        }
    }

    const validatePasswordForm = (e) => {
        let pass = e.target.value;
        if(pass.length >= 6) {
            setValidatePassword("valid");
            setPassword(pass);
        } else {
            setValidatePassword("invalid");
        }
    }

    const submitSignUp = (e) => {
        e.preventDefault();
        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let name = '';
        for(let i=0; i<firstName.length; i++) {
            if(firstName.charAt(i) !== ' ') {
                name += firstName.charAt(i);
            }
        }
        name += ' ';
        for(let i=0; i<lastName.length; i++) {
            if(lastName.charAt(i) !== ' ') {
                name += lastName.charAt(i);
            }
        }
        let obj = {
            "name": name,
            "contactNumber": contactNumber,
            "email": email,
            "password": password
        }
        let url = `http://localhost:8080/user/signup`;
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj)
        })
        .then((res) => {
            let response = res.status;
            if(response === 200) {
                setResponseCode('success');
            } else if(response === 400) {
                setResponseCode('warning');
            } else {
                setResponseCode('danger');
            }
            return res.json();
        })
        .then((data) => {
            setHidden(false);
            setMessage(data.message);
            setTimeout(() => {
                setHidden(true);
            }, 5000);
        })
        .catch(error => console.log(error));
    }
    //Signup ends

    //login start
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [hidden1, setHidden1] = useState(true);
    const [message1, setMessage1] = useState('');
    const [responseCode1, setResponseCode1] = useState('');

    const changeSignIn = () => {
        setKeepSignedIn(keepSignedIn? false : true);
    }

    useEffect(() => {
        // console.log(keepSignedIn);
    }, [keepSignedIn])
    

    const submitLogin = () => {
        let email = document.getElementById('loginEmail').value;
        let password = document.getElementById('loginPassword').value;
        let obj = {
            "email": email,
            "password": password
        }

        let url = `http://localhost:8080/user/login`;
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj)
        })
        .then((res) => {
            let response = res.status;
            if(response === 200) {
                setResponseCode1('success');
            } else if (response === 400) {
                setResponseCode1('warning');
            } else {
                setResponseCode1('danger');
            }
            return res.json();
        })
        .then((data) => {
            setHidden1(false);
            setMessage1(data.message? data.message : data.token);
            if(data.token) {
                apiKeyFucntion.changeApiKey(data.token);
                if(keepSignedIn) {
                    window.localStorage.setItem("apiKey",data.token);
                } else {
                    localStorage.removeItem("apiKey");
                }
            }
            setTimeout(() => {
                setHidden1(true);
            }, 5000);
            decoding(data.token);
        })
        .catch(error => console.log(error));
    }

    let decoding = (token) => {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        let final =  JSON.parse(window.atob(base64));
        console.log(final.role , final.sub);
    }
    //login ends

    //forgot password start
    const [hidden2, setHidden2] = useState(true);
    const [message2, setMessage2] = useState('');
    const [responseCode2, setResponseCode2] = useState('');

    const submitForgotPassword = () => {
        let forgotPasswordEmail = document.getElementById('forgotPasswordEmail').value;
        let obj = {
            "email": forgotPasswordEmail
        }
        console.log(obj)    
        let url = `http://localhost:8080/user/forgotPassword`;
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj)
        })
        .then((res) => {
            let response = res.status;
            if(response === 200) {
                setResponseCode2('success');
            } else if (response === 400) {
                setResponseCode2('warning');
            } else {
                setResponseCode2('danger');
            }
            return res.json();
        })
        .then((data) => {
            setHidden2(false);
            console.log(obj)
            setMessage2(data.message? data.message : data.token);
            if(data.token) {
                props.setApiKeyFucntion(data.token);
            }
            setTimeout(() => {
                setHidden2(true);
            }, 5000);
        })
        .catch(error => console.log(error));
    }
    //forgot password ends

  return (
    <>
        <div className="container my-3" style={{display: 'flex',justifyContent: 'space-between'}}>


            <div className="card container" style={{width: '25rem', height: '40rem'}}>
                <h1 className='text-center'>Log in</h1>
                <form>
                    <div className="mb-3 my-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="loginEmail" aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" id="loginPassword"/>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" onClick={changeSignIn} id="flexCheckDefault"/>
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Keep me signed in
                        </label>
                    </div>
                    <input type="button" className="btn btn-primary" onClick={submitLogin} value='Submit'/>
                </form>
                <div className="result my-3" hidden={hidden1}>
                    <div className={`alert alert-${responseCode1}`} role="alert">
                        {message1}
                    </div>
                </div>
            </div>


            <div className="card" style={{width: '25rem'}}>
                <h1 className='text-center'>Sign up</h1>
                <form className='container my-3'>
                    <div className="row">
                        <div className="col">
                            <input type="text" className="form-control" placeholder="First name" aria-label="First name" id='firstName' required/>
                        </div>
                        <div className="col">
                            <input type="text" className="form-control" placeholder="Last name" id='lastName' aria-label="Last name"/>
                        </div>
                    </div>
                    <div className="mb-3 my-3">
                        <label htmlFor="formGroupExampleInput" className="form-label">Contact Number</label>
                        <input type="tel" className={`form-control is-${validateContact}`} id="formGroupExampleInput" placeholder="Contact number..." onChange={validateContactNumber}/>
                        <div id='formGroupExampleInput' className='invalid-feedback'>Please enter a valid contact number.</div>
                    </div>
                    <div className="mb-3 my-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className={`form-control is-${validateEmail}`} id="exampleInputEmail1" onChange={validateEmailForm} aria-describedby="emailHelp" placeholder='example@abc.com' required/>
                        <div id='exampleInputEmail1' className='invalid-feedback'>Enter a valid gmail account</div>
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className={`form-control is-${validatePassword}`} id="exampleInputPassword1" onChange={validatePasswordForm} required/>
                        <div id='exampleInputPassword1' className='invalid-feedback'>Password should be minimun 6 characters long.</div>
                    </div>
                    <input type="submit" className={`btn btn-primary ${(validateEmail === 'valid' && validateContact === 'valid' && validatePassword === 'valid')? '':'disabled'}`} onClick={submitSignUp} value='Submit'/>
                </form>
                <div className="result container" hidden={hidden}>
                    <div className={`alert alert-${responseCode}`} role="alert">
                        {message}
                    </div>
                </div>
            </div>


            <div className="card container" style={{width: '25rem'}}>
                <h1 className='text-center'>Forgot password</h1>
                    <div className="mb-3 my-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="forgotPasswordEmail" aria-describedby="emailHelp"/>
                    </div>
                    <input type="button" className="btn btn-primary" onClick={submitForgotPassword} value='Submit'/>
                    <div className="result my-3" hidden={hidden2}>
                    <div className={`alert alert-${responseCode2}`} role="alert">
                        {message2}
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Login;