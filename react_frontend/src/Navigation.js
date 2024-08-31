import React, { useState } from 'react';
import Footer from "./Footer";
import {
  AppstoreOutlined,
  MailOutlined,
  LeftOutlined,
  RightOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider, Menu } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Logo from './assets/logo.svg';

const StyledLeftOutlined = styled(LeftOutlined)`
  font-size: 1.125rem;
  color: #777777;
  font-weight: bold;
`;

const StyledRightOutlined = styled(RightOutlined)`
  font-size: 1.125rem;
  color: #777777;
  font-weight: bold;
`;

const StyledMenu = styled(Menu)`
  padding: 0 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  .ant-menu-item,
  .ant-menu-submenu-title {
    padding-left: 0.625rem !important;
    margin-left: 0px !important;
    width: 100% !important;
  }

  .ant-menu-item-selected,
  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    background-color: #dcf9d9 !important;
    color: #0eaa00 !important;
  }

  .ant-menu-item:hover,
  .ant-menu-submenu-title:hover {
    background-color: #e0f8f0 !important;
  }

  .ant-menu-sub {
    padding-left: 0.625rem !important; /* 서브메뉴 들여쓰기 조정 */
    background: transparent !important; /* 서브메뉴 배경색 제거 */
  }
`;

const SidebarContainer = styled.div`
  width: ${props => (props.collapsed ? '5rem' : '12.5rem')};
  background-color: #FFFFFF;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row
  align-items: center;
  padding: 1rem;
  margin-left: 0.25rem;
  margin-top: 0.625rem;
`;

const LogoImage = styled.img`
  width: 0.9375rem; /* 로고 크기 조절 */
  height: 1.875rem;
  margin-top: 0.8125rem;
`;

const LogoTextContainer = styled.div`
  display: ${props => (props.collapsed ? 'none' : 'block')};
  margin-left: ${props => (props.collapsed ? '0.625rem' : '1.25rem')};
`;

const ToggleButton = styled(Button)`
  position: absolute;
  right: 0;
  transform: none;
  border: none;
  box-shadow: none;
  padding-left: 0;
  padding-right: 0;
  margin-right: ${props => (props.collapsed ? '0.75rem' : '1.5625rem')};
  margin-top: 0.625rem !important;
`;

const theme = {
  components: {
    Menu: {
        itemSelectedColor: '#0EAA00',
        itemSelectedBg: '#DCF9D9',
        itemColor: '#777777',
        itemActiveBg: '#DCF9D9',
      },

  }
}

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

export default function Navigation({ menus, onMenuClick, activeTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 네비게이션 처리
  const items = mapMenuDataToItems(menus);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    const item = findItemByKey(items, e.key);
    if (item && item.path) {
      navigate(item.path);
    }
  };

  const handleOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => !openKeys.includes(key));
    if (items.map(item => item.key).includes(latestOpenKey)) {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    } else {
      setOpenKeys(keys);
    }
  };

  const findItemByKey = (items, key) => {
    for (const item of items) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findItemByKey(item.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <SidebarContainer collapsed={collapsed}>
      <LogoContainer>
        <LogoImage src={Logo} alt="로고" />
        <LogoTextContainer collapsed={collapsed}>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0EAA00' }}>PGMS</div>
          <div style={{ fontSize: '0.8125rem', color: '#0EAA00' }}>온실관리시스템</div>
        </LogoTextContainer>
        <ToggleButton onClick={toggleCollapsed} collapsed={collapsed}>
          {collapsed ? <StyledRightOutlined /> : <StyledLeftOutlined />}
        </ToggleButton>
      </LogoContainer>
      <ConfigProvider theme={theme}>
        <StyledMenu
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={items}
          onClick={handleMenuClick}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          style={{ flex: 1 }} // 메뉴가 공간을 차지하도록 설정
        />
      </ConfigProvider>
      <Footer />
    </SidebarContainer>
  );
};