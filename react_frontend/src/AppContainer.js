import React from "react";
import * as appStyles from "./assets/css/app.css"
import * as tableStyles from "./assets/css/table.css"
import Header from "./Header";
import MenuList from "./MenuList";
import Favorite from "./Favorite";
import Table from "./Table";

export default function AppContainer({children, tabs, handleMenuClick, activeTab, handelTabClick, handleTabClose, dragEnter, dragStart, drop, handleFavClick, fav}){
    return(
        <div className={appStyles.app}>
            <Header tabs = {tabs} activeTab={activeTab} handelTabClick={handelTabClick} handleTabClose={handleTabClose} dragStart={dragStart} dragEnter={dragEnter} drop={drop}/>
            <div className="comp">
                {children}
            </div>
            <Favorite handleFavClick={handleFavClick} fav={fav}/>

            <div className={tableStyles.menu}>현장정보 &gt; 프로젝트 &gt; 담당자 지정</div>

            <div className={tableStyles.tableTitle}>조회결과</div>
            <Table />
            
            <div className={tableStyles.tableTitle}>배출원목록</div>
            <Table />
        </div>
        );
}