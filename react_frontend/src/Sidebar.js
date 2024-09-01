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
  flex-grow: 1;
  overflow-y: auto;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

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

const SidebarContainer = styled.div.attrs((props) => ({
  // DOM 요소에 전달하지 않도록 처리
  collapsed: undefined,
}))`
  width: ${props => (props.collapsed ? '5rem' : '12.5rem')};
  background-color: #FFFFFF;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div.attrs((props) => ({
  collapsed: undefined,
}))`
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

const LogoTextContainer = styled.div.attrs((props) => ({
  collapsed: undefined,
}))`
  display: ${props => (props.collapsed ? 'none' : 'block')};
  margin-left: ${props => (props.collapsed ? '0.625rem' : '1.25rem')};
`;

const ToggleButton = styled(Button).attrs((props) => ({
  collapsed: undefined,
}))`
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

const FooterContainer = styled.div`
  margin-top: auto;
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

export default function Sidebar({ collapsed, toggleCollapsed, items, onMenuClick, openKeys, onOpenChange }) {
  return (
    <SidebarContainer collapsed={collapsed}>
      <LogoContainer collapsed={collapsed}>
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
          onClick={onMenuClick}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        />
      </ConfigProvider>
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </SidebarContainer>
  );
};