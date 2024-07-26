import React from "react";
import * as appStyles from "./assets/css/app.css"
import Header from "./Header";
import MenuList from "./MenuList";

export default function AppContainer({children}){
    return(
        <div className={appStyles.app}>
           <Header/>
            {children}
        </div>
        );
}