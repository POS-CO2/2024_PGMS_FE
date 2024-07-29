import React from 'react';
import  * as headerStyles from './assets/css/header.css';
import Header from './Header';

export default function Tab({tab, activeTab, handleTabClose, handelTabClick}){
    return (
        <div
            key={tab.url}
            className={`${headerStyles.tab} ${activeTab === tab.url ? headerStyles.activeTab : ''}`}
            onClick={() => {
                handelTabClick(tab.url)
            }}
        >
            {tab.name}
            <button onClick={(e) => handleTabClose(tab.url, e)}>x</button>
        </div>
);
};