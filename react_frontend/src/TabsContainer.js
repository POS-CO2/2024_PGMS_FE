import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { openTabsState, activeTabState, itemsState, selectedKeyState, openKeysState, collapsedState } from './atoms/tabAtoms';
import { Tabs, Dropdown, Menu, Button, Tooltip } from 'antd';
import { CloseOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { ChatTwoTone } from '@mui/icons-material';
import { Badge, IconButton, Avatar } from '@mui/material';

const ITEM_TYPE = 'TAB';
const TABS_STORAGE_KEY = 'tabs'; // 로컬 스토리지 키

const TabsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden; /* 탭이 영역을 벗어나지 않도록 설정 */
  width: 100%;
  height: 7vh;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
  flex-wrap: nowrap;
  flex-shrink: 1;
  max-width: calc(100% - 160px);
  width: 100%;
  height: 50px;
  padding-left: 28px;
  padding-right: 16px; /* 탭과 유저 정보 사이의 간격 */
  overflow: hidden;
`;

const TopRightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px; /* 언어 선택기와 유저 정보 사이의 간격 */
  font-family: SUITE-Regular;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const StyledCloseCircleOutlined = styled(CloseCircleOutlined)`
  font-size: 1.3rem; /* 아이콘 크기 */
  color: #777777; /* 아이콘 색상 */
  margin-right: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;
  font-family: SUITE-Regular;
  img {
    width: 40px;
    height: 40px;
  }
`;

const StyledButton = styled(Button)`
  margin-left: 10px;
  color: #0A7800; /* 기본 텍스트 색상 */
  border-color: #777777; /* 기본 보더 색상 */
  padding: 0px 4px;
  height: auto; /* 높이를 자동으로 설정하여 텍스트(userName)와 일치시킴 */
  font-size: 12px;

  &:hover {
    color: #8AC784 !important; /* 호버 시 텍스트 색상 */
    border-color: #777777; /* 호버 시 보더 색상 유지 */
  }
`;

const StyledAvatar = styled(Avatar)`
  font-weight: 200;
  display: flex;
  background-color: #FFA310;
  color: #FFF;
  border-radius: 70%;
  margin-left: 10px;
  margin-right: 10px;
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs {
    margin: 0 !important;
    width: 100% !important;
  }

  .ant-tabs-tab {
    width: auto;
    margin: 0 !important;
    justify-content: flex-start;
    padding: 0.6rem 0.5rem;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    min-width: 30px;
  }

  .ant-tabs-tab-btn {
    overflow: hidden;
    white-space: norwap;
    text-overflow: ellipsis;
  }

  .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: #66C65E; /* 탭 호버 시 레이블 색상 변경 */
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #0EAA00; /* 활성화된 탭 레이블의 색상 변경 */
  }

  .ant-tabs-ink-bar {
    background-color: #0EAA00 !important; /* 밑줄 색상 변경 */
    margin-bottom: 8px;
  }

  .ant-tabs-nav-more {
    display: none !important; /* ...을 숨기기 위해 설정 */
  }

  .ant-tabs-nav {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
  }

  .ant-tabs-nav-list {
    width: 100%;
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const DraggableTabNode = ({ index, moveTabNode, children }) => {
  const ref = useRef();

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTabNode(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
    >
      {children}
    </div>
  );
};

const TabsContainer = forwardRef(({ handleLogout, user, handleMenuClick, handleChatClick, totCnt }, ref) => {
  const [tabs, setTabs] = useRecoilState(openTabsState);
  const [activeKey, setActiveKey] = useRecoilState(activeTabState);
  const navigate = useNavigate();
  const homeTabAdded = useRef(false); // 홈 탭이 추가되었는지 추적하는 플래그
  const items = useRecoilValue(itemsState);
  const setSelectedKeys = useSetRecoilState(selectedKeyState);
  const [openKeys, setOpenKeys] = useRecoilState(openKeysState);
  const [collapsed, setCollapsed] = useRecoilState(collapsedState);

  useEffect(() => {
    const savedTabs = JSON.parse(localStorage.getItem(TABS_STORAGE_KEY)) || [];
    const savedActiveKey = localStorage.getItem('activeTab');

    if (savedTabs.length > 0) {
      setTabs(savedTabs);
      setActiveKey(savedActiveKey || savedTabs[0].key);
    } else if (!homeTabAdded.current) {
      const homeTab = {
        key: '',
        tab: '홈',
        path: '',
        accessUser: 'FP'
      };
      setTabs([homeTab]);
      setActiveKey(homeTab.key);
      homeTabAdded.current = true;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeKey);
    navigate(activeKey);
  }, [activeKey, navigate]);

  // 탭 상태를 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs));
  }, [tabs]);

  useImperativeHandle(ref, () => ({
    addTab(path, label, accessUser) {
      const newTab = { key: path, tab: label, accessUser: accessUser };
      setTabs(prevTabs => {
        const existingTab = prevTabs.find(tab => tab.key === path);
        if (!existingTab) {
          return [...prevTabs, newTab];
        }
        return prevTabs;
      });
      setActiveKey(path);
    },
  }));

  // 경로를 기준으로 메뉴 항목 찾기
  const findItemByPath = (items, path) => {
    return items.reduce((acc, item) => {
        if (acc) return acc;
        if (item.path === path) return item;
        if (item.children) return findItemByPath(item.children, path);
        return null;
    }, null);
  };

  const findParentItem = (items, childKey) => {
    return items.reduce((acc, item) => {
        if (acc) return acc;
        if (item.children && item.children.some(child => child.key === childKey)) {
            return item;  // 해당 childKey를 가진 부모 아이템을 반환
        }
        if (item.children) {
            return findParentItem(item.children, childKey); // 재귀적으로 탐색
        }
        return null;
    }, null);
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

  const onTabChange = path => {
    setActiveKey(path);

    // 메뉴 클릭을 처리
    const item = findItemByPath(items, path);
    
    if (item) {
      setSelectedKeys([item.key]);
      handleMenuClick({ key: item.key });

      // 대분류(상위 메뉴)를 찾아 openKeys에 추가
      const parentItem = findParentItem(items, item.key);
      if (parentItem && !collapsed) {
        handleOpenChange([parentItem.key]);
      }
    }

    if (path === '') {  // 홈 탭을 클릭했을 때 명시적으로 홈 경로로 이동
      navigate('');
      setOpenKeys([]); //사이드바 대분류 토글 다 접기
      setSelectedKeys(null); //사이드바 선택된 메뉴 null
    } else {
      navigate(path);
    }
  };

  const removeTab = targetKey => {
    if (targetKey === '') return; // 홈 탭은 삭제할 수 없도록 설정

    let newActiveKey = activeKey;
    let lastIndex = -1;

    tabs.forEach((tab, i) => {
      if (tab.key === targetKey) {
        lastIndex = i - 1;
      }
    });

    const newTabs = tabs.filter(tab => tab.key !== targetKey);

    if (newTabs.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newTabs[lastIndex].key;
        if(newActiveKey === '') {
          setOpenKeys([]);
          setSelectedKeys(null);
        }
      }
    }

    setTabs(newTabs);

    if (newTabs.length === 1) {
      newActiveKey = '';
    }
    
    const item = findItemByPath(items, newActiveKey);
    if (item) {
      setSelectedKeys([item.key]);

      // 대분류(상위 메뉴)를 찾아 openKeys에 추가
      const parentItem = findParentItem(items, item.key);
      if (parentItem) {
        setOpenKeys([...openKeys, parentItem.key]);
      }
    }

    setActiveKey(newActiveKey);
    navigate(newActiveKey);
  };

  // 홈 탭만 남기고 나머지 탭 제거
  const closeAllTabs = () => {
    const homeTab = tabs.find(tab => tab.key === '');
    setTabs([homeTab]);     // 홈 탭만 남기고 나머지 모두 제거
    setActiveKey('');       // 홈 탭으로 activeKey를 설정
    navigate('');           // 홈 탭으로 이동
    setOpenKeys([]);        // 사이드바 토글 내리기
    setSelectedKeys(null);  // 사이드바 선택된 메뉴 지우기
  };

  const moveTabNode = (dragIndex, hoverIndex) => {
    const newTabs = [...tabs];
    const draggedTab = newTabs.splice(dragIndex, 1)[0];
    newTabs.splice(hoverIndex, 0, draggedTab);
    setTabs(newTabs);
  };

  const tabsData = tabs.map((tab, index) => ({
    label: (
      <DraggableTabNode index={index} moveTabNode={moveTabNode}>
        <div style={{display:"flex", alignContent:"center", cursor:"pointer"}}>
          <div style={{ textOverflow:"ellipsis", whiteSpace:"nowrap", overflowX:"hidden", fontFamily:'SUITE-Regular'}}>
            {tab.tab}
            {/* accessUser가 'FP'가 아닐 때 *을 추가 */}
            {tab.accessUser !== 'FP' && <span style={{ color: '#FF7474' }}> *</span>}
          </div>
          <div>
            {tab.key !== '' && ( // 홈 탭에는 닫기 버튼을 표시하지 않음
              <CloseOutlined
                style={{ color:"red", fontSize:"0.7rem", paddingLeft:"5px"}}
                onClick={(e) => {
                  e.stopPropagation(); // 이벤트 전파를 막아 탭 전환을 방지
                  removeTab(tab.key);
                }}
              />
            )}
          </div>
        </div>
      </DraggableTabNode>
    ),
    key: tab.key,
    children: tab.children,
  }));

  // 로그아웃 메뉴 정의 및 사용자 정보
  const menuItems = [
    {
      key: 'userInfo',
      label: (
        <UserDetails>
          <Row>
            <div style={{ marginLeft: '-0.9375rem', marginRight: '0.3125rem'}}>
              <StyledAvatar>
                  {user.userName ? user.userName.substring(1, 4) : ''}
              </StyledAvatar>
            </div>
            <div>
              <Row>
                <span style={{ fontWeight: 'bold' }}>{user.userName}님</span>
                <StyledButton type="link" onClick={handleLogout}>
                  로그아웃
                </StyledButton>
              </Row>
              <Row>
                <span>{user.loginId}</span>
              </Row>
              <Row>
                <span>{user.deptCode}부서</span>
              </Row>
              <Row>
                <span>{user.role}</span>
              </Row>
            </div>
          </Row>
        </UserDetails>
      ),
      disabled: true,
    },
  ];
  
  return (
    <DndProvider backend={HTML5Backend}>
      <TabsWrapper>
        {/* 탭 섹션 */}
        <TabContainer>
          <StyledTabs
            activeKey={activeKey}
            onChange={onTabChange}
            items={tabsData}
            hideAdd
            moreIcon={null}
            style={{width:"100%", textOverflow:"ellipsis"}}
          />
        </TabContainer>

        {/* 탭 모두 닫기 섹션 */}
        <TopRightWrapper>
          <Tooltip title="탭 모두 닫기">
            <StyledCloseCircleOutlined
              style={{ cursor: "pointer" }} // 커서 모양을 추가
              onClick={closeAllTabs}
            />
          </Tooltip>

          {/* 채팅 섹션 */}
          <IconButton onClick={handleChatClick} sx={{ cursor:"pointer"}}>
            <Badge badgeContent={totCnt} color='error'>
              <ChatTwoTone fontSize="large" sx={{color:"rgb(14, 170, 0)"}}/>
            </Badge>
          </IconButton>

          {/* 유저 섹션 */}
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <UserInfo>
              {/* 성을 표시하는 Avatar 컴포넌트 */}
              <StyledAvatar>
                {user.userName ? user.userName.substring(1, 4) : ''}
              </StyledAvatar>
            </UserInfo>
          </Dropdown>
        </TopRightWrapper>
      </TabsWrapper>
    </DndProvider>
  );
});

export default TabsContainer;
