import * as navStyles from "./assets/css/navigation.css"; 
import React, { useState } from "react";
import Title from "./Title";
import Footer from "./Footer";
import MenuList from "./MenuList";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ArrowBackIos } from "@mui/icons-material";

export default function Navigation({ menus, onMenuClick, activeTab }){
    const [fold, setFold] = useState(false);

    const handleFoldClick = () => {
        setFold(!fold);
    }

    return(
        <>
            {(!fold) ? (
                <div className={navStyles.navigation_container}>
                    <div>
                    <Title/>
                    </div>
                    <MenuList menus={menus} onMenuClick={onMenuClick} activeTab={activeTab}/>
                    <div className={navStyles.navigation_fold} onClick={handleFoldClick}>
                    <ArrowBackIos fontSize="small" sx={{color:"black", marginLeft:"50%"}} />
                    </div>
                    <Footer/>
                </div>
            ) : (
                <div className={navStyles.navigation_unfold} onClick={handleFoldClick}>
                    <ArrowForwardIosIcon sx={{color:"white"}}/>
                </div>
            )}
        </>       
    );  
}