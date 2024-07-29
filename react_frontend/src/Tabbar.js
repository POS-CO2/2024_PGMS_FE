import React from 'react';
import  * as mainStyles from './assets/css/main.css';
import Tab from './Tab';


export default function Tabbar({tabs, activeTab, handelTabClick, handleTabClose}){
    return (
        <div className={mainStyles.tabBar}>
            
            {tabs.map(tab => (
                <Tab key={tab.name} tab={tab} activeTab={activeTab} handelTabClick={handelTabClick} handleTabClose={handleTabClose}/>
                
            ))}
        </div>
    );
};