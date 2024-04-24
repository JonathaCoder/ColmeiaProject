import React from "react";
import ModalHeader from "./modalHeader";
import { useState } from "react";
import { IoExitOutline } from "react-icons/io5";
import logo from '../img/logoTIpo.jpg'


export default function Header(){

  const [user,setUser] = useState(null);
  const [error, setError] = useState("");


  const handleLogout = () => {
 
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  return(
    <div>
      <header className="header_home">
      <div className="home_header" >
      <img src={logo} alt="" />
       </div>
      <div className="btn_logout2">
    
       <button type="button" className="btn-logout"
        onClick={(e) =>handleLogout(e)}><IoExitOutline  className="icon_btn" /> </button>
          <ModalHeader />
       </div>
    
      
    </header>
    </div>
  )
}