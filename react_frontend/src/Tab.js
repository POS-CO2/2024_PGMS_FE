import React from 'react';
import  * as mainStyles from './assets/css/main.css';

export default function Tab({tab, activeTab, handleTabClose, handelTabClick}){
    return (
        <div
            key={tab.url}
            className={`${mainStyles.tab} ${activeTab === tab.url ? mainStyles.activeTab : ''}`}
            onClick={() => {
                handelTabClick(tab.url)
            }}
        >
            {tab.name}
            <button onClick={(e) => handleTabClose(tab.url, e)}>x</button>
        </div>
);
};