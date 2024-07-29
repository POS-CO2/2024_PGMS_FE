import React, {useState, useEffect} from 'react';
import Navigation from './Navigation';
import  * as mainStyles from './assets/css/main.css';
import AppContainer from './AppContainer';
import { Outlet, useNavigate } from 'react-router';
import Tabbar from './Tabbar';

const menus =
[
    {
        "level" : 1,
        "name": "배출실적",
        "menu": [
            {
                "level" : 2,
                "url" : "/ps_1_2",
                "name": "실적Scope1,2",
                "menu": []
            },
            {
                "level" : 2,
                "name": "실적조회",
                "menu" : [

                    {
                        "level" : 3,
                        "url" : "/psq",
                        "name" : "프로젝트별조회",
                        "menu" : []
                    },
                    {
                        "level" : 3,
                        "name" : "총량실적",
                        "url" : "/tep",
                        "menu" : []
                    }
                ]
            }
        ]
    },

    {
        "level" : 1,
        "name" : "현장정보",
        "menu" : [
            {
                "level" : 2,
                "name" : "설비",
                "menu" : [
                    {
                        "level" : 3,
                        "name" : "설비관리",
                        "menu" : [],
                        "url" : "/fm"
                    },
                    {
                        "level" : 3,
                        "name" : "설비활동자료",
                        "url" : "/fad",
                        "menu" : []
                    },
                    {
                        "level" : 3,
                        "url" : "/fl",
                        "name" : "설비LIB",
                        "menu" : []
                        
                    }
                ]
            },
            {
                "level" : 2,
                "name" : "배출원",
                "menu" : [
                    {
                        "level" : 3,
                        "name" : "배출원관리",
                        "url" : "/esm",
                        "menu" : []
                    },
                    {
                        "level" : 3,
                        "name" : "증빙자료",
                        "url" : "/sd",
                        "menu" : []
                    }
                ]
            },

            {
                "level" : 2,
                "url" : "/efm",
                "name" : "배출계수관리",
                "menu" : [
        
                ]
            }

        ]

        
    },

    {
        "level" : 1,
        "name" : "시스템관리",
        "menu" : [
            {
                "level" : 2,
                "name" : "코드관리",
                "url" : "/cm",
                "menu" : []
            },
            {
                "level" : 2,
                "name" : "사용자관리",
                "url" : "/um",
                "menu" : []
            },
            {
                "level": 2,
                "name" : "메뉴관리",
                "url" : "/mm",
                "menu" : []
            },
            {
                "level" : 2,
                "url" : "/mal",
                "name" : "메뉴접속로그",
                "menu" : []
            }
        ]

    }
]


export default function SiteLayout(){

    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const navigate = useNavigate();

    // 메뉴 클릭 시 해당 url 로 이동 하는 코드.
    // 탭도 생성함
    const handleMenuClick = (item) => {
        const existingTab = tabs.find(tab => tab.url === item.url );
        // 중복 탭 여부 검사(이미 열려있는지)
        if (item.menu.length === 0){
            if (!existingTab) {
                setTabs([...tabs, item]);
            }
            setActiveTab(item.url);
            navigate(item.url);
        }
    };

    // 탭 클릭시 해당 url 로 이동하는 코드
    const handelTabClick = (url) => {
        setActiveTab(url);
        navigate(url);
    }

    // 탭을 지우는 코드
    const handleTabClose = (url, event) => {
        event.stopPropagation();
        const filteredTabs = tabs.filter(tab => tab.url !== url);
        setTabs(filteredTabs);
        // 활성화된 탭이 있을 경우 인덱스 - 1의 탭을 보여줌 
        if (activeTab === url && filteredTabs.length > 0) {
            const newActiveTab = filteredTabs[filteredTabs.length - 1].url;
            setActiveTab(newActiveTab);
            navigate(newActiveTab);
        } 
        // 활성화된 탭이 없을 경우 
        else if (filteredTabs.length === 0) {
            setActiveTab(null);
            navigate('/')
        }
    }




    return (
        <div id={mainStyles.root}>
            <Navigation menus={menus} onMenuClick={handleMenuClick}/>
            <AppContainer tabs = {tabs} activeTab={activeTab} handelTabClick={handelTabClick} handleTabClose={handleTabClose}>
                <Outlet/>
            </AppContainer>
        </div>
    );
}