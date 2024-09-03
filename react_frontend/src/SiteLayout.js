import React, {useState, useEffect, useRef} from 'react';
import Navigation from './Navigation';
import  * as mainStyles from './assets/css/main.css';
import  * as headerStyles from './assets/css/header.css';
import AppContainer from './AppContainer';
import { Outlet, useLocation, useNavigate } from 'react-router';
import Tabbar from './Tabbar';
import axiosInstance from './utils/AxiosInstance';


export default function SiteLayout({handleLogout, menus, user}){

    const [tabs, setTabs] = useState(() => {
        const savedTabs = localStorage.getItem('tabs');
        return savedTabs ? JSON.parse(savedTabs) : [];
    });
    const [activeTab, setActiveTab] = useState(() => {
        const savedActiveTab = localStorage.getItem('activeTab');
        return savedActiveTab || null;
    });

    const [fav, setFav] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const tabBarRef = useRef(null);

    const dragItem = useRef();
    const dragOverItem = useRef();

    // 메뉴 클릭 시 해당 url 로 이동 하는 코드.
    // 탭도 생성함
    const handleMenuClick = async (item) => {
        // console.log(item);
        setLoading(true);
        const response = await axiosInstance.post(`/sys/log/click?menuId=${item.id}`)
        // console.log(response);
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
        setLoading(false);
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
        setFav(!fav);
    }
    if (loading) {
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
                {/* skeleton */}
            </AppContainer>
        </div>
        );
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