import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { selectedKeyState, openKeysState } from './atoms/tabAtoms';
import Favorite from './Favorite';
import { LeftOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Menu, List } from 'antd';
import styled from 'styled-components';
import Logo from './assets/logo.svg';

const StyledLeftOutlined = styled(LeftOutlined)`
  font-size: 1.125rem;
  color: #777777;
  font-weight: bold;
`;

const StyledMenu = styled(Menu)`
  padding: 0 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;  /* 부모의 width를 따르도록 설정 */

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

  .ant-menu-title-content {
    font-family: SUITE-Regular;
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
  // 전달되지 않도록 undefined 설정
  collapsed: undefined,
}))`
  width: ${({ $collapsed }) => ($collapsed ? '3.5rem' : '12.5rem')};
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
  cursor: pointer;
`;

const LogoImage = styled.img`
  width: 0.9375rem; /* 로고 크기 조절 */
  height: 1.875rem;
  margin-top: 0.8125rem;
  cursor: pointer;
`;

const LogoTextContainer = styled.div.attrs((props) => ({
  // 전달되지 않도록 undefined 설정
  collapsed: undefined,
}))`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
  margin-left: ${({ $collapsed }) => ($collapsed ? '0.625rem' : '1.25rem')};
`;

const ToggleButton = styled(Button).attrs((props) => ({
  // 전달되지 않도록 undefined 설정
  collapsed: undefined,
}))`
  position: absolute;
  right: 0;
  transform: none;
  border: none;
  box-shadow: none;
  padding-left: 0;
  padding-right: 0;
  margin-right: ${({ collapsed }) => (collapsed ? '0.75rem' : '1.5625rem')};
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

export default function Sidebar({ collapsed, toggleCollapsed, items, onMenuClick }) {
  const [selectedKeys, setSelectedKeys] = useRecoilState(selectedKeyState);
  const [openKeys, setOpenKeys] = useRecoilState(openKeysState);

  // label 뒤에 * 추가하는 새로운 items 배열 생성
  const itemsWithAsterisk = items.map(item => ({
    ...item, // 기존 item의 나머지 속성 유지
    label: (
      <>
        {item.label}
        {item.accessUser !== 'FP' && <span style={{ color: '#FF7474' }}> *</span>}
      </>
    ),
    children: item.children ? item.children.map(child => ({
      ...child,
      label: (
        <>
          {child.label}
          {child.accessUser !== 'FP' && <span style={{ color: '#FF7474' }}> *</span>}
        </>
      )
    })) : null
  }));

  // 마지막으로 선택한 대분류 토글만 내리기
  const handleOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => !openKeys.includes(key));
    if (items.map(item => item.key).includes(latestOpenKey)) {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    } else {
      setOpenKeys(keys);
    }
  };

  return (
    <SidebarContainer $collapsed={collapsed}>

      {/* 로고 섹션 */}
      <LogoContainer onClick={toggleCollapsed}>
        <LogoImage src={Logo} alt="로고" />
        <LogoTextContainer $collapsed={collapsed}>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0EAA00' }}>PGMS</div>
          <div style={{ fontSize: '0.8125rem', color: '#0EAA00' }}>온실관리시스템</div>
        </LogoTextContainer>
        <ToggleButton $collapsed={collapsed} onClick={toggleCollapsed}>
          {collapsed ? null : <StyledLeftOutlined />}
        </ToggleButton>
      </LogoContainer>

      {/* 메뉴 섹션 */}
      <ConfigProvider theme={theme}>
        <StyledMenu
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={itemsWithAsterisk}
          onClick={onMenuClick}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          selectedKeys={selectedKeys}
        >
        </StyledMenu>
      </ConfigProvider>

      {/* 즐겨찾기 섹션 (사이드바가 접혔을 때는 숨기기) */}
      {!collapsed && <Favorite />}

    </SidebarContainer>
  );
};