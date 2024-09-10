import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Tabs, Dropdown, Menu, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import { useNavigate } from 'react-router-dom';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Main from './Main';
import Language from './Language';
import styled from 'styled-components';

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
  flex-wrap: nowrap;
  flex-shrink: 1;
  max-width: calc(100% - 160px);
  width: 100%;
  height: 50px;
  padding-top: 6px;
  // flex-direction: column;
  // align-items: flex-start;
  // flex-grow: 1;
  // padding-top: 18px;
  padding-left: 28px;
  padding-right: 16px; /* 탭과 유저 정보 사이의 간격 */
  overflow: hidden;
`;

const TopRightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px; /* 언어 선택기와 유저 정보 사이의 간격 */
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

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;

  img {
    width: 40px;
    height: 40px;
  }
`;

const StyledButton = styled(Button)`
  margin-left: 10px;
  color: #0A7800; /* 기본 텍스트 색상 */
  border-color: #777777; /* 기본 보더 색상 */
  padding: 2px 4px;
  height: auto; /* 높이를 자동으로 설정하여 텍스트(userName)와 일치시킴 */
  font-size: 12px;

  &:hover {
    color: #8AC784 !important; /* 호버 시 텍스트 색상 */
    border-color: #777777; /* 호버 시 보더 색상 유지 */
  }
`;

const Photo = styled.div`
  display: flex;
  background-color: antiquewhite;
  border-radius: 70%;
  margin-left: 10px;
  margin-right: 10px;

  img {
    width: 40px;
    height: 40px;
  }
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
    padding: 1rem 0.5rem;
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

const TabsContainer = forwardRef(({ handleLogout, user }, ref) => {
  const [tabs, setTabs] = useState([]);
  const [activeKey, setActiveKey] = useState('');
  const navigate = useNavigate();
  const homeTabAdded = useRef(false); // 홈 탭이 추가되었는지 추적하는 플래그

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
        content: <Main />,
      };
      setTabs([homeTab]);
      setActiveKey(homeTab.key);
      homeTabAdded.current = true;
    }
  }, []);

  useEffect(() => {
    if (activeKey) {
      localStorage.setItem('activeTab', activeKey);
      navigate(activeKey);
    }
  }, [activeKey, navigate]);

  // 탭 상태를 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs));
  }, [tabs]);

  useImperativeHandle(ref, () => ({
    addTab(path, label, content) {
      const newTab = { key: path, tab: label, content };
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

  const onTabChange = path => {
    setActiveKey(path);
    if (path === '') {  // 홈 탭을 클릭했을 때 명시적으로 홈 경로로 이동
      navigate('');
    } else {
      navigate(path);
    }
    localStorage.setItem('activeTab', path);
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
      } else {
        newActiveKey = newTabs[0].key;
      }
    }

    setTabs(newTabs);

    // If the active tab was the one removed, switch to the home tab
    if (!newTabs.length || newActiveKey === '') {
      newActiveKey = '';
    }

    setActiveKey(newActiveKey);
    navigate(newActiveKey);
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
          </div>
          <div>
            {tab.key !== '' && ( // 홈 탭에는 닫기 버튼을 표시하지 않음
              <CloseOutlined
                style={{ color:"red", paddingLeft:"5px"}}
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
  const menu = (
    <Menu>
      <Menu.Item key="userInfo" disabled>
        <UserDetails>
          <Row>
            <div style={{ marginRight: '16px'}}>
              <img src="http://sanriokorea.co.kr/wp-content/themes/sanrio/images/kuromi.png" alt="User" />
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
      </Menu.Item>
    </Menu>
  );

  // 다국어 메뉴
  const languageMenu = (
    <div style={{ padding: '10px' }}>
      <Language />
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <TabsWrapper>
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
        <TopRightWrapper>
          <Dropdown overlay={languageMenu} trigger={['click']} placement="bottomCenter">
            <GTranslateIcon style={{ cursor: 'pointer', color: '#0A7800', fontSize: '30px' }} />
          </Dropdown>
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <UserInfo>
              <Photo>
                <img src="http://sanriokorea.co.kr/wp-content/themes/sanrio/images/kuromi.png" alt="User" />
              </Photo>
            </UserInfo>
          </Dropdown>
        </TopRightWrapper>
      </TabsWrapper>
    </DndProvider>
  );
});

export default TabsContainer;
