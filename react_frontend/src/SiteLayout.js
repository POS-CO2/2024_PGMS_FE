import React, {useState, useEffect, useRef} from 'react';
import Navigation from './Navigation';
import  * as mainStyles from './assets/css/main.css';
import  * as headerStyles from './assets/css/header.css';
import AppContainer from './AppContainer';
import { Outlet, useLocation, useNavigate } from 'react-router';
import Tabbar from './Tabbar';


// const menus =
// [
//     {
//         "level" : 1,
//         "name": "배출실적",
//         "menu": [
//             {
//                 "level" : 2,
//                 "url" : "/ps_1_2",
//                 "name": "실적Scope 1, 2",
//                 "menu": []
//             },
//             {
//                 "level" : 2,
//                 "name": "실적조회",
//                 "menu" : [
//                     {
//                         "level" : 3,
//                         "name" : "총량실적 조회",
//                         "url" : "/tep",
//                         "menu" : []
//                     },
//                     {
//                         "level" : 3,
//                         "url" : "/psq",
//                         "name" : "프로젝트별 조회",
//                         "menu" : []
//                     },
//                 ]
//             },
//             {
//                 "level" : 2,
//                 "name" : "실적 관리",
//                 "url" : "/pmg",
//                 "menu" : []
//             }
//         ]
//     },

//     {
//         "level" : 1,
//         "name" : "현장정보",
//         "menu" : [
//             {
//                 "level" : 2,
//                 "name" : "프로젝트",
//                 "menu" : [
//                     {
//                         "level" : 3,
//                         "name" : "프로젝트 관리",
//                         "menu" : [],
//                         "url" : "/pg"
//                     },
//                     {
//                         "level" : 3,
//                         "name" : "담당자 지정",
//                         "menu" : [],
//                         "url" : "/pd"
//                     },
//                     {
//                         "level" : 3,
//                         "name" : "매출액 관리",
//                         "menu" : [],
//                         "url" : "/rm"
//                     },
//                 ]
//             },
//             {
//                 "level" : 2,
//                 "name" : "설비",
//                 "menu" : [
//                     {
//                         "level" : 3,
//                         "name" : "설비 지정",
//                         "menu" : [],
//                         "url" : "/fm"
//                     },
//                     {
//                         "level" : 3,
//                         "url" : "/fl",
//                         "name" : "설비LIB 관리",
//                         "menu" : []
                        
//                     },
//                     {
//                         "level" : 3,
//                         "name" : "활동자료 관리",
//                         "url" : "/fam",
//                         "menu" : []
//                     },
//                     {
//                         "level" : 3,
//                         "name" : "활동자료 지정",
//                         "url" : "/fad",
//                         "menu" : []
//                     },
                    
//                 ]
//             },
//             {
//                 "level" : 2,
//                 "name" : "배출원",
//                 "menu" : [
//                     {
//                         "level" : 3,
//                         "name" : "배출원 지정",
//                         "url" : "/esm",
//                         "menu" : []
//                     },
//                     {
//                         "level" : 3,
//                         "name" : "증빙자료 관리",
//                         "url" : "/sd",
//                         "menu" : []
//                     }
//                 ]
//             },

//             {
//                 "level" : 2,
//                 "url" : "/efm",
//                 "name" : "배출계수 관리",
//                 "menu" : [
        
//                 ]
//             }

//         ]

        
//     },

//     {
//         "level" : 1,
//         "name" : "시스템관리",
//         "menu" : [
//             {
//                 "level" : 2,
//                 "name" : "코드 관리",
//                 "url" : "/cm",
//                 "menu" : []
//             },
//             {
//                 "level" : 2,
//                 "name" : "사용자 관리",
//                 "url" : "/um",
//                 "menu" : []
//             },
//             {
//                 "level": 2,
//                 "name" : "메뉴 관리",
//                 "url" : "/mm",
//                 "menu" : []
//             },
//             {
//                 "level" : 2,
//                 "url" : "/mal",
//                 "name" : "접속로그 조회",
//                 "menu" : []
//             }
//         ]

//     }
// ]


export default function SiteLayout({handleLogout, menus, user}){

    const [tabs, setTabs] = useState(() => {
        const savedTabs = localStorage.getItem('tabs');
        return savedTabs ? JSON.parse(savedTabs) : [];
    });
    const [activeTab, setActiveTab] = useState(() => {
        const savedActiveTab = localStorage.getItem('activeTab');
        return savedActiveTab || null;
    });

    const [fav, setFav] = useState(true);

    const navigate = useNavigate();
    const tabBarRef = useRef(null);

    const dragItem = useRef();
    const dragOverItem = useRef();

    // 메뉴 클릭 시 해당 url 로 이동 하는 코드.
    // 탭도 생성함
    const handleMenuClick = (item) => {
        console.log(item);
        const existingTab = tabs.find(tab => tab.url === item.url );
        // 중복 탭 여부 검사(이미 열려있는지)
        if (item.menu.length === 0){
            if (!existingTab) {
                const newTabs = [...tabs, item];
                setTabs(newTabs);
                localStorage.setItem('tabs', JSON.stringify(newTabs));
            }
            setActiveTab(item.url);
            localStorage.setItem('activeTab', item.url);
            navigate(item.url);
        }
    };

    // 탭 클릭시 해당 url 로 이동하는 코드
    const handelTabClick = (url) => {
        setActiveTab(url);
        localStorage.setItem('activeTab', url);
        navigate(url);
    }

    // 탭을 지우는 코드
    const handleTabClose = (url, event) => {
        event.stopPropagation();
        const filteredTabs = tabs.filter(tab => tab.url !== url);
        setTabs(filteredTabs);
        localStorage.setItem('tabs', JSON.stringify(filteredTabs));
        // 활성화된 탭이 있을 경우 인덱스 - 1의 탭을 보여줌 
        if (activeTab === url && filteredTabs.length > 0) {
            const newActiveTab = filteredTabs[filteredTabs.length - 1].url;
            setActiveTab(newActiveTab);
            localStorage.setItem('activeTab', newActiveTab);
            navigate(newActiveTab);
        } 
        // 활성화된 탭이 없을 경우 
        else if (filteredTabs.length === 0) {
            setActiveTab("/");
            localStorage.removeItem('activeTab');
            navigate('/')
        }
    }

    useEffect(() => {
        const adjustTabWidth = () => {
            if (tabBarRef.current) {
                const tabBarWidth = tabBarRef.current.offsetWidth;
                const profileWidth = document.querySelector(`.${headerStyles.header_profile}`).offsetWidth;
                const availableWidth = tabBarWidth - profileWidth - 20; // 20은 여유 공간
                const maxTabs = Math.floor(availableWidth / 130);
                const newTabWidth = tabs.length > maxTabs ? availableWidth / tabs.length : 130;

                Array.from(tabBarRef.current.children).forEach(tab => {
                    tab.style.minWidth = `${newTabWidth}px`;
                    tab.style.maxWidth = `${newTabWidth}px`;
                    tab.style.overflow = 'hidden';
                    tab.style.textOverflow = 'ellipsis';
                    tab.style.whiteSpace = 'nowrap';
                });
            }
        };

        adjustTabWidth();
        window.addEventListener('resize', adjustTabWidth);
        return () => {
            window.removeEventListener('resize', adjustTabWidth);
        };
    }, [tabs]);

    useEffect(() => {
        if (activeTab) {
            navigate(activeTab);
        }
    }, [activeTab, navigate]);

    // drag 구현
    const dragStart = (e, position) => {
        dragItem.current = position;
        console.log(e.target.innerHTML);
    };

    const dragEnter = (e, position) => {
        dragOverItem.current = position;
    }

    const drop = (e) => {
        const newList = [...tabs];
        const dragItemValue = newList[dragItem.current];
        newList.splice(dragItem.current, 1);
        newList.splice(dragOverItem.current, 0, dragItemValue);
        dragItem.current = null;
        dragOverItem.current = null;
        setTabs(newList);
    }

    const handleFavClick = () => {
        console.log(fav);
        setFav(!fav);
    }

    
    

    return (
        <div id={mainStyles.root}>
            <Navigation menus={menus} onMenuClick={handleMenuClick} activeTab={activeTab}/>
            <AppContainer 
                tabs = {tabs} 
                handleMenuClick={handleMenuClick} 
                activeTab={activeTab} 
                handelTabClick={handelTabClick} 
                handleTabClose={handleTabClose} 
                dragStart={dragStart} 
                dragEnter={dragEnter} 
                drop={drop}
                handleFavClick={handleFavClick}
                fav={fav}
                handleLogout={handleLogout}
                user={user}
                menus={menus}
            >
                <Outlet/>
            </AppContainer>
        </div>
    );
}