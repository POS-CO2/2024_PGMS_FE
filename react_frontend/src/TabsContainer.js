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
import * as headerStyles from "./assets/css/header.css";
//cal(100%-140px)

const ITEM_TYPE = 'TAB';

const TabsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  margin-left: 28px;
  padding-right: 16px; /* 탭과 유저 정보 사이의 간격 */
  overflow: hidden; /* 탭이 영역을 벗어나지 않도록 설정 */
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

const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    font-weight: bold;
  }

  .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: #66C65E; /* 탭 호버 시 레이블 색상 변경 */
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #0EAA00; /* 활성화된 탭 레이블의 색상 변경 */
  }

  .ant-tabs-ink-bar {
    background-color: #0EAA00 !important; /* 밑줄 색상 변경 */
  }

  .ant-tabs-nav-more {
    display: none !important; /* ...을 숨기기 위해 설정 */
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
  const [activeKey, setActiveKey] = useState('홈');
  const navigate = useNavigate();
  const homeTabAdded = useRef(false); // 홈 탭이 추가되었는지 추적하는 플래그

  // 홈 탭 추가 (한 번만)
  useEffect(() => {
    if (!homeTabAdded.current) {
      const homeTab = {
        key: '',
        tab: '홈',
        path: '', // index path를 지정
        content: <Main />, // 이 부분을 <Main /> 컴포넌트로 바꿔서 사용
      };
      setTabs([homeTab]);
      navigate(homeTab.path);
      homeTabAdded.current = true; // 홈 탭이 추가되었음을 표시
    }
  }, [navigate]);

  useImperativeHandle(ref, () => ({
    addTab(path, label, content) {
      const newTab = { key: path, tab: label, content };
      setTabs(prevTabs => {
        if (!prevTabs.find(tab => tab.key === path)) {
          return [...prevTabs, newTab];
        }
        return prevTabs;
      });
      setActiveKey(path);
      navigate(path);
    },
  }));

  const onTabChange = path => {
    setActiveKey(path);
    navigate(path); // 탭이 선택될 때 해당 경로로 이동
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
    setActiveKey(newActiveKey);
    navigate(newActiveKey); // 선택된 탭으로 이동
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
        <span>
          {tab.tab}
          {tab.key !== '' && ( // 홈 탭에는 닫기 버튼을 표시하지 않음
            <CloseOutlined
              style={{ marginLeft: 8 }}
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 전파를 막아 탭 전환을 방지
                removeTab(tab.key);
              }}
            />
          )}
        </span>
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
        <StyledTabs
          activeKey={activeKey}
          onChange={onTabChange}
          items={tabsData}
          hideAdd
          moreIcon={null}
        />
        <TopRightWrapper>
          {/* <Language /> */}
          <Dropdown overlay={languageMenu} trigger={['click']} placement="bottomCenter">
            <GTranslateIcon style={{ cursor: 'pointer', color: '#0A7800', fontSize: '30px' }} />
          </Dropdown>
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <UserInfo>
              <div className={headerStyles.photo}>
                <img src="http://sanriokorea.co.kr/wp-content/themes/sanrio/images/kuromi.png" alt="User" />
              </div>
            </UserInfo>
          </Dropdown>
        </TopRightWrapper>
      </TabsWrapper>
    </DndProvider>
  );
});

export default TabsContainer;
