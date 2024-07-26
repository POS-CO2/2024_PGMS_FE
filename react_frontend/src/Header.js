import React from "react";
import * as headerStyles from "./assets/css/header.css";

export default function Header(){


    return(
        <div className={headerStyles.header}>
            <div className={headerStyles.header_profile}>
                <div className={headerStyles.photo}><img src="http://sanriokorea.co.kr/wp-content/themes/sanrio/images/kuromi.png" /></div>
                <div className={headerStyles.header_name}>{"임병준"}</div>

            </div>
            
        </div>
    );
}