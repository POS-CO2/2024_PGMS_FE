import React from 'react';
import  * as headerStyles from './assets/css/header.css';
import Header from './Header';

export default function Tab({idx, tab, activeTab, handleTabClose, handelTabClick, dragStart, dragEnter, drop}){
    return (
        <div
            key={tab.url}
            className={`${headerStyles.tab} ${activeTab === tab.url ? headerStyles.activeTab : ''}`}
            draggable
            onDragStart={(e) => dragStart(e, idx)}
            onDragEnter={(e) => dragEnter(e, idx)}
            onDragEnd={drop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => {
                handelTabClick(tab.url)
            }}
        >
            {tab.name}
            <button onClick={(e) => handleTabClose(tab.url, e)}>X</button>
        </div>
);
};