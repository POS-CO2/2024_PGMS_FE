import React, {useState, useEffect, useRef} from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Favorite from "./Favorite";
import TabsContainer from './TabsContainer';
import  * as mainStyles from './assets/css/main.css';
import  * as headerStyles from './assets/css/header.css';
import {
    AppstoreOutlined,
    MailOutlined,
    PieChartOutlined,
  } from '@ant-design/icons';
import axiosInstance from './utils/AxiosInstance';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-width: 100%;
  padding-left: 16px;
`;

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
    const [fav, setFav] = useState(true);
    const [loading, setLoading] = useState(false);

    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState([]);
    const navigate = useNavigate();
    const tabsContainerRef = useRef(null);
    
    const items = mapMenuDataToItems(menus);

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

    /* 마지막으로 선택한 대분류 토글만 내리기 */
    const handleOpenChange = (keys) => {
        const latestOpenKey = keys.find(key => !openKeys.includes(key));
        if (items.map(item => item.key).includes(latestOpenKey)) {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        } else {
        setOpenKeys(keys);
        }
    };

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
                <TabsContainer 
                    handleLogout={handleLogout} 
                    user={user} 
                    ref={tabsContainerRef} 
                />
                <div style={{ padding: '16px', overflowY: 'auto' }}>
                    <Outlet />
                </div>
                <Favorite handleFavClick={handleFavClick} fav={fav}/>
            </ContentContainer>
        </div>
        );
    }

    return (
        <LayoutContainer>
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
                <div style={{ padding: '16px', overflowY: 'auto' }}>
                    <Outlet />
                </div>
                <Favorite handleFavClick={handleFavClick} fav={fav}/>
            </ContentContainer>
        </LayoutContainer>
    );
}