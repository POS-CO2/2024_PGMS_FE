import React from 'react';
import  * as headerStyles from './assets/css/header.css';
import Tab from './Tab';


export default function Tabbar({tabs, activeTab, handelTabClick, handleTabClose}){
    console.log(tabs);
    return (
        <div className={headerStyles.tabBar}>
            <div
                className={`${headerStyles.tab} ${activeTab === '/' ? headerStyles.activeTab : ''}`}
                onClick={() => {
                    handelTabClick('/')
                }}
            >
                {'홈'}
            </div>
            {tabs.map(tab => (
                <Tab key={tab.name} tab={tab} activeTab={activeTab} handelTabClick={handelTabClick} handleTabClose={handleTabClose}/>
                
            ))}
        </div>
    );
};