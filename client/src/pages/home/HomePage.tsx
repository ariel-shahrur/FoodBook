import React, { useState } from 'react';
import './homePage.css';
import { Navigate, useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className='homePageDiv'>
      <h1 className='homePageHeadLine'>Looking for  your next meal?</h1>
      <div className='homePageDescriptionDiv'>
        <span>Share</span>
        <span>Cook</span>
        <span>Taste</span>
      </div>
        <div className='toSignUp' onClick={() => { navigate('/login') }}>{`Sign Up to elevate your kitchen adventures -> `}</div>
    </div>
  );
}

export default HomePage;
