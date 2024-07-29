import React from 'react';
import  * as headerStyles from './assets/css/header.css';
import Tab from './Tab';


export default function Tabbar({tabs, activeTab, handelTabClick, handleTabClose}){
    return (
        <div className={headerStyles.tabBar}>
            
            {tabs.map(tab => (
                <Tab key={tab.name} tab={tab} activeTab={activeTab} handelTabClick={handelTabClick} handleTabClose={handleTabClose}/>
                
            ))}
        </div>
    );
};