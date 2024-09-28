import React, {useState, useRef, useEffect} from 'react';
import { useRecoilState } from "recoil";
import { itemsState } from './atoms/tabAtoms';
import { useNavigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import TabsContainer from './TabsContainer';
import  * as mainStyles from './assets/css/main.css';
import {
    TruckOutlined,
    BankOutlined,
    PieChartOutlined,
    SettingOutlined,
  } from '@ant-design/icons';
import axiosInstance from './utils/AxiosInstance';
import { Badge, Box } from '@mui/material';
import { ChatBubble } from '@mui/icons-material';
import Chat from './Chat';

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
    return menuData.map((menuItem) => {
      const icon = menuItem.name === '배출실적' ? <TruckOutlined /> : 
        menuItem.name === '현장정보' ? <BankOutlined /> : 
        menuItem.name === '분석및예측' ? <PieChartOutlined /> :
        menuItem.name === '시스템관리' ? <SettingOutlined /> : <></>;
  
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
                label: (
                    <>
                        {childItem.name}
                        {childItem.accessUser !== 'FP' && <span style={{ color: '#FF7474' }}>*</span>} {/* * 기호를 빨간색으로 표시 */}
                    </>
                ),
                path: childItem.url,  // 하위 메뉴가 없을 경우 path를 직접 설정
            };
            }
        });
    };
        return {
            key: `sub${menuItem.id}`,
            label: 
                <>
                    {menuItem.name}
                    {menuItem.accessUser !== 'FP' && <span style={{ color: '#FF7474' }}>*</span>} {/* 현장이 볼 수 없는 메뉴명 뒤에 *을 빨간색으로 */}
                </>,
            icon: icon,
            children: mapChildren(menuItem.menu),
        };
    });
};

export default function SiteLayout({handleLogout, menus, user}){
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useRecoilState(itemsState);
    const [collapsed, setCollapsed] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const navigate = useNavigate();
    const tabsContainerRef = useRef(null);
    
    useEffect(() => {
        setItems(mapMenuDataToItems(menus));
    }, [menus]);

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

    // 메뉴를 클릭했을 때, key값으로 item을 찾음
    const findItemByKey = (items, key) =>
        items.reduce((acc, item) => {
        if (acc) return acc;
        if (item.key === key) return item;
        if (item.children) return findItemByKey(item.children, key);
        return null;
    }, null);

    const handleChatClick = () => {
        setChatOpen(true);
    }

    const handleCloseClick = () => {
        setChatOpen(false);
    }

    if (loading) {
        return (
            <div id={mainStyles.root}>
                <Sidebar
                    collapsed={collapsed}
                    toggleCollapsed={toggleCollapsed}
                    onMenuClick={handleMenuClick}
                    items={items}
                />
                <ContentContainer>
                    <StyledTabsContainer 
                        handleLogout={handleLogout} 
                        user={user} 
                        handleMenuClick={handleMenuClick}
                        ref={tabsContainerRef} 
                    />
                    <Outlet />
                </ContentContainer>
            </div>
        );
    }
    const [totCnt, setTotCnt] = useState(0);

    const getTotalUnReadCnt = async () => {
        const {data} = await axiosInstance.get(`/chat/unread`);

        setTotCnt(data);
    }

    useEffect(() => {
        getTotalUnReadCnt();
    },[chatOpen])

    return (
        <div id={mainStyles.root}>
            <Sidebar
                collapsed={collapsed}
                toggleCollapsed={toggleCollapsed}
                onMenuClick={handleMenuClick}
                items={items}
            />
            <ContentContainer>
                <TabsContainer 
                    handleLogout={handleLogout} 
                    user={user} 
                    handleMenuClick={handleMenuClick}
                    ref={tabsContainerRef} 
                />
                <div style={{ overflowY: 'auto' }}>
                    <Outlet />
                </div>
                {
                    chatOpen ? (
                        <Chat handleCloseClick={handleCloseClick}/>
                    ) : (
                            <Box component="span" onClick={handleChatClick} sx={{borderRadius:"50%", backgroundColor:"rgb(14, 170, 0)", position:"fixed", bottom: "16px", right:"16px", width:"70px", height:"70px", display:"flex", justifyContent:"center", alignItems:"center", cursor:"pointer", zIndex:"1000"}}>
                                <Badge color='error' badgeContent={totCnt} >
                                    <ChatBubble fontSize='large' sx={{color:"white"}}/>
                                </Badge>
                            </Box>
                    )
                }
            </ContentContainer>
        </div>
    );
}