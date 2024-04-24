import React from "react";
import Header from "../../components/Header";
import Options from "../../components/estoqueOption";
import { Link } from "react-router-dom";
import { HiMiniArrowLeft } from "react-icons/hi2";

export default function Estoque(){
  return(
    <div>
     <Header/>
     <Link to='/home'  title="Voltar">  
      
      <HiMiniArrowLeft className="iconVoltar" />
     
      </Link>
      <Options/>
    </div>
   
  )
}