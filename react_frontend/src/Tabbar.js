import React from 'react';
import  * as headerStyles from './assets/css/header.css';
import Tab from './Tab';


export default function Tabbar({tabs, activeTab, handelTabClick, handleTabClose, tabBarRef, dragEnter, dragStart, drop}){
    return (
        <div className={headerStyles.tabBar} ref={tabBarRef}>
            <div
                className={`${headerStyles.tab} ${activeTab === '/' ? headerStyles.activeTab : ''} ${headerStyles.home}`}
                onClick={() => {
                    handelTabClick('/')
                }}
            >
                {'홈'}
            </div>
            {tabs.map((tab, idx) => (
                <Tab key={idx} idx={idx} tab={tab} activeTab={activeTab} handelTabClick={handelTabClick} handleTabClose={handleTabClose} dragStart={dragStart} dragEnter={dragEnter} drop={drop}/>
                
            ))}
        </div>
    ); 
};