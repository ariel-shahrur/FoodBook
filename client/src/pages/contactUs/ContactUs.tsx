import React, { useState } from 'react'
import './contactUs.css'
import { MdEmail } from "react-icons/md";
import { FaPhone,FaLocationDot  } from "react-icons/fa6";
import conactUsImg from './contactUsimg.png'
import { error } from 'console';

function ContactUs() {

  interface FormData {
  fullName: string;
  email: string;
  message: string;
}

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    message: ''});

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.trim(),
  });
  console.log(formData);
  
  };


  const isValidEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleForSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const validationErrors={
      fullName: '',
      email: '',
      message: ''};

    if (!formData.fullName.trim()) {
      validationErrors.fullName = 'Full Name is required';
      // setErrors({...errors,
      //   fullName:'Full Name is required'
      // })
    }

    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required';
      // setErrors({...errors,
      //   email:'Email is required'
      // })
    } else if (!isValidEmail(formData.email)) {
      validationErrors.email = 'Invalid email format';
      // setErrors({...errors,
      //   email:'Invalid email format'
      // })
    }

    if (!formData.message.trim()) {
      validationErrors.message = 'Message is required';
      // setErrors({...errors,
      //   message:'Message is required'
      // })
    }
console.log(Object.values(validationErrors).filter(error=>{return error !==""}));

    if ((Object.values(validationErrors).filter(error=>{return error !==""})).length>0) {
      setErrors(validationErrors);
      return
    } else {
      setFormData({
        fullName: '',
        email: '',
        message: '',
      });
      setErrors({fullName: '',
        email: '',
        message: ''}
        );
    }
    
  }

  return (
    <div className='contactUsDiv'>
      <div className='formDiv'>
        <h2>Get In Touch</h2>
        <h4>We are here for you, how can we help you?</h4>
        <form className='form' >
         { <input type="text" name='fullName' placeholder='Enter your full name' onChange={(e)=>handleChange(e)} />}
          <input type="text" name='email' placeholder='Enter your email address' onChange={(e)=>handleChange(e)} />
          <textarea cols={25} rows={5}  name='message' placeholder='Go ahead, we are listening...' onChange={(e)=>handleChange(e)} />
          <button className='submitBtn' onClick={(e) => handleForSubmit(e)} >Submit</button>
        </form>
      </div>
    <div className='contactInfoDiv'>
      <div className='imgDiv'><img src={conactUsImg} alt="" /></div>
      <div>
      <div className='contactIconDiv'><FaLocationDot className='icons' size={40} color='rgb(47, 128, 226)' /> <span>Lorem ipsum dolor sit amet.</span></div>
      <div className='contactIconDiv'><FaPhone className='icons' size={40} color='rgb(47, 128, 226)'/> <span>050-7766289</span></div>
        <div className='contactIconDiv'><MdEmail className='icons' size={40} color='rgb(47, 128, 226)'/> <span>Ariel02888@gmail.com</span></div>
    
      </div>
      </div>
    </div>
  )
}

export default ContactUs