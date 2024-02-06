import React, { useState } from 'react'
import { singUpValidationHandler } from '../../validationForSignUp';
import './signUp.css'
import { FaRegUser } from "react-icons/fa";
import { IoKeyOutline, IoMailOutline } from "react-icons/io5";
import Cookies from 'js-cookie';
import { signUpForm } from '../../interface/typs';
import { useNavigate } from 'react-router-dom';

// const expirationTimeInSeconds = 120; // 5 minutes

// const expirationDate = new Date();
// expirationDate.setTime(expirationDate.getTime() + expirationTimeInSeconds * 1000);

function SignUp(props: { setIsConncted: Function, isConnected: boolean, isADminConncted: boolean, setIsADminConncted: Function }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(Cookies.get('token'));
  const [worngCredentials, setWorngCredentials] = useState(false);
  const [alreadySignedUp, setAlreadySignedUp] = useState(true);
  const [allFieldsAreFilled, setAllFieldsAreFilled] = useState(true);
  const [formData, setFormData] = useState<signUpForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImg: ''
  });

  const [validation, setValidation] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleForChangeEventLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    (document.querySelector('.userNameLogin') as HTMLInputElement).value="";
    (document.querySelector('.passwordLogin') as HTMLInputElement).value="";
    event.preventDefault();
    fetch('http://127.0.0.1:3005/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAdminConnected) {
          document.cookie = `admin= ${data.token};  path=/`;
          props.setIsADminConncted(true);
        }
        if (data.token) {
          // Cookies.set('token', data.token);
          //max-age=${expirationTimeInSeconds}; expires=${expirationDate.toUTCString()};
          document.cookie = `token= ${data.token};  path=/`;
          setToken(data.token);
          props.setIsConncted(true);
          navigate('/feed')
        }
        else {
          setWorngCredentials(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setAllFieldsAreFilled(false);
      return;
    }
    if (!validation.username && !validation.email && !validation.password && !validation.confirmPassword) {
      fetch('http://127.0.0.1:3005/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .catch((error) => {
          console.error(error);
        });
        setAlreadySignedUp(!alreadySignedUp);
    }
  };

  const handleForChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });


    setValidation({
      ...validation,
      [event.target.name]: singUpValidationHandler(event.target.name, event.target.value, formData.password)
    })
  };

  const toggleHandler = () => {
    setAlreadySignedUp(!alreadySignedUp);
    setWorngCredentials(false);
    setAllFieldsAreFilled(true);
    setValidation({
      username: false,
      email: false,
      password: false,
      confirmPassword: false
    })
    }
  

  return (
    <div className='loginPageBody'>
      {alreadySignedUp && <div className="loginDiv" >
        <form onSubmit={(e) => { handleLogin(e) }} id='signFormDiv'>
          <h1 className='title'>Login</h1>
          <div className='signUp__field'>
            <FaRegUser />
            <input type="text" placeholder='User Name' name='username' className=' userNameLogin' onChange={(e) => { handleForChangeEventLogin(e) }} />
            {/* {validation.username && <div className='validationDiv'>user name must be at least 8 charter</div>} */}
          </div>
          <div className='signUp__field'>
            <IoKeyOutline />
            <input type="text" placeholder='password' name='password' className=' passwordLogin' onChange={(e) => { handleForChangeEventLogin(e) }} />
          </div>
          {worngCredentials && <div className='worngCredentials'>
          <div>Wrong credentials invalid user name or password</div>
        </div>}
          <button type='submit' className='signUp_submit'>LOGIN</button>
          <div className='toggleDiv' onClick={toggleHandler}>register</div>
        </form> 
        
        </div>}

      {!alreadySignedUp && <div className='signUpDiv'>
        <form onSubmit={(e) => { handleSubmit(e) }} id='signFormDiv'>
          <h1 className='title'>Sign Up</h1>
          <div className='signUp__field'>
            <div className='iconInputDiv'><FaRegUser />
              <input type="text" placeholder='User Name' name='username' className='signUp__input' onChange={(e) => { handleForChangeEvent(e) }} /></div>
            {validation.username && <div className='validationDiv'>user name must be at least 8 charter</div>}
          </div>
          <div className='signUp__field'>
            <div className='iconInputDiv'><IoMailOutline />
              <input type="text" placeholder='example@gmail.com' name='email' className='signUp__input' onChange={(e) => { handleForChangeEvent(e) }} />
            </div>
            <div>{validation.email && <div className='validationDiv'>exsample@gmail.com</div>}</div>
          </div>

          <div className='signUp__field'>
            <div className='iconInputDiv'><IoKeyOutline />
              <input type="text" placeholder='password' name='password' className='signUp__input' onChange={(e) => { handleForChangeEvent(e) }} /></div>
            {validation.password && <div className='validationDiv'>the password must inculde:
              <ul>
                {<li>more than 8 charters and less than 30</li>}
                <li>upperCase</li>
                <li>lowerCase</li>
                <li>numbers</li>
                <li>specialChar</li>
              </ul></div>}
          </div>
          <div className='signUp__field'>
            <div className='iconInputDiv'><IoKeyOutline />
              <input type="text" placeholder=" confirm you'r password" name='confirmPassword' className='signUp__input' onChange={(e) => { handleForChangeEvent(e) }} /></div>
            {validation.confirmPassword && <div className='validationDiv'>the passwords not match</div>}
          </div>
          {!allFieldsAreFilled && <div className='provideAllFieldsMessage'>You must provide all fields</div>}
          <button type='submit' className='signUp_submit'>register</button>
          <div className='toggleDiv' onClick={toggleHandler}>already register?</div>
        </form>
      </div>}
    </div>
  )
}

export default SignUp