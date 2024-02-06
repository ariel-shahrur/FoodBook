import React, { useState } from 'react';
import './App.css';
import RecipePost from './components/recipePost component/RecipePost';
import SignUp from './components/signUp component/SignUp';
import { FooterItemArr, NavBarItemArr } from './staticData';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import Footer from './components/footer component/Footer';
import Cookies from 'js-cookie'
import Feed from './components/feed component/Feed';
import LikedRecipes from './components/favorite component/Favorites';
import Cart from './components/cart componant/Cart';
import NavBar from './components/navBar component/NavBar';
import ManagementAcoontOreder from './components/ManagementAccontOreder component/ManagementAccontOreder';
import ManagementAcoontOrederInventory from './components/ManagementAccontInventory component/ManagementAccontInventory';
import About from './pages/about/About';
import ContactUs from './pages/contactUs/ContactUs';
import Messages from './components/messages component/Messages';



function App() {
  const [isConncted, setIsConncted] = useState(!!Cookies.get('token'));//!! change to boolean
  const [isADminConncted, setIsAdminConncted] = useState(!!Cookies.get('admin'));
  const [numberOfMessages, setNumberOfMessages] = useState(0);


  return (
    <div className="App">
      <NavBar navItems={NavBarItemArr} isConncted={isConncted} setIsConncted={setIsConncted} isADminConncted={isADminConncted} setIsADminConncted={setIsAdminConncted} numberOfMessages={numberOfMessages} setNumberOfMessages={setNumberOfMessages}></NavBar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignUp isConnected={isConncted} setIsConncted={setIsConncted} isADminConncted={isADminConncted} setIsADminConncted={setIsAdminConncted} />} />
        <Route path="/uploadrecipe" element={<RecipePost />} />
        <Route path="/feed" element={<Feed isADminConncted={isADminConncted} />} />
        <Route path="/favorite" element={<LikedRecipes />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/ManagementAcoontOreder" element={<ManagementAcoontOreder />} />
        <Route path="/Inventory" element={<ManagementAcoontOrederInventory />} />
        <Route path="/about" element={<About />} />
        <Route path="/messages" element={<Messages setNumberOfMessages={setNumberOfMessages} />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
      <Footer footerItems={FooterItemArr}></Footer>
    </div>
  );
}

export default App;