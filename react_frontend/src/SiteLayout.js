import React, {useState, useRef, useEffect} from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import TabsContainer from './TabsContainer';
import  * as mainStyles from './assets/css/main.css';

import {
    AppstoreOutlined,
    MailOutlined,
    PieChartOutlined,
  } from '@ant-design/icons';
import axiosInstance from './utils/AxiosInstance';

const StyledTabsContainer = styled(TabsContainer)`
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    width: 100%;
    overflow-x: hidden;
`;

const ContentContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    width: calc(100% - 12.5rem);
    min-width: 600px;
    flex-grow: 1;
    height:100vh;
    background-color: #F5F5F5;
    overflow: hidden;
`;


// 백엔드에서 받은 메뉴 데이터를 라이브러리 형식에 맞춰 items(key, label, path)로 변환 
const mapMenuDataToItems = (menuData) => {
    return menuData.map((menuItem, index) => {
      const icon = index === 0 ? <PieChartOutlined /> : index === 1 ? <MailOutlined /> : <AppstoreOutlined />;
  
      // 하위 메뉴를 재귀적으로 매핑
      const mapChildren = (children) => {
        return children.map(childItem => {
          if (childItem.menu && childItem.menu.length > 0) {
            return {
                key: `${childItem.id}`,
                label: childItem.name,
                children: mapChildren(childItem.menu),  // 하위 메뉴가 있을 때만 children 추가
            };
          } else {
            return {
                key: `${childItem.id}`,
                label: childItem.name,
                path: childItem.url,  // 하위 메뉴가 없을 경우 path를 직접 설정
            };
          }
        });
    };
        return {
            key: `sub${menuItem.id}`,
            label: menuItem.name,
            icon: icon,
            children: mapChildren(menuItem.menu),
        };
    });
};

export default function SiteLayout({handleLogout, menus, user}){
    const [fav, setFav] = useState(false);
    const [loading, setLoading] = useState(false);

    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState([]);
    const navigate = useNavigate();
    const tabsContainerRef = useRef(null);
    
    let items = mapMenuDataToItems(menus);

    useEffect(() => {
        items = mapMenuDataToItems(menus);
    }, [menus]);

    const handleFavClick = () => {
        setFav(!fav);
    }

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    }

    const handleMenuClick = async e => {
        setLoading(true);
        const item = findItemByKey(items, e.key);
        if (item && item.path) {
            navigate(item.path);
            tabsContainerRef.current.addTab(item.path, item.label);
        }
        setLoading(false);
        const response = await axiosInstance.post(`/sys/log/click?menuId=${item.key}`);
    };

    // 마지막으로 선택한 대분류 토글만 내리기
    const handleOpenChange = (keys) => {
        const latestOpenKey = keys.find(key => !openKeys.includes(key));
        if (items.map(item => item.key).includes(latestOpenKey)) {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        } else {
        setOpenKeys(keys);
        }
    };

    // 메뉴를 클릭했을 때, key값으로 item을 찾음
    const findItemByKey = (items, key) =>
        items.reduce((acc, item) => {
        if (acc) return acc;
        if (item.key === key) return item;
        if (item.children) return findItemByKey(item.children, key);
        return null;
    }, null);

    if (loading) {
        return (
            <div id={mainStyles.root}>
                <Sidebar
                    collapsed={collapsed}
                    toggleCollapsed={toggleCollapsed}
                    onMenuClick={handleMenuClick}
                    items={items}
                    openKeys={openKeys}
                    onOpenChange={handleOpenChange}
                />
                <ContentContainer>
                    <StyledTabsContainer 
                        handleLogout={handleLogout} 
                        user={user} 
                        ref={tabsContainerRef} 
                    />
                    <Outlet />
                </ContentContainer>
            </div>
        );
    }

    return (
        <div id={mainStyles.root}>
            <Sidebar
                collapsed={collapsed}
                toggleCollapsed={toggleCollapsed}
                onMenuClick={handleMenuClick}
                items={items}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
            />
            <ContentContainer>
                <TabsContainer 
                    handleLogout={handleLogout} 
                    user={user} 
                    ref={tabsContainerRef} 
                />
                <div style={{ overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </ContentContainer>
        </div>
    );
}