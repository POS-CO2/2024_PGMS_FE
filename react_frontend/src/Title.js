import React from "react";
import { NavLink } from "react-router-dom";
import * as navigationStyles from "./assets/css/navigation.css";



export default function  Title(){
    return(
        <h2 className={navigationStyles.title}>
          <NavLink to={"/"}>
          <span>
            PGMS
          </span>  

          <span>
            온실가스관리스시스템
          </span>
          </NavLink>
          
        </h2>

    );
}