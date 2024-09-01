import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Tabs, Dropdown, Menu } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Main from './Main';
import styled from 'styled-components';
import * as headerStyles from "./assets/css/header.css";

const ITEM_TYPE = 'TAB';

const TabsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 16px; /* 탭과 유저 정보 사이의 간격 */
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
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
    // 홈 탭은 삭제할 수 없도록 설정
    if (targetKey === '') return;
    
    setTabs(prevTabs => prevTabs.filter(tab => tab.key !== targetKey));
    if (activeKey === targetKey && tabs.length > 1) {
      const nextTabKey = tabs.filter(tab => tab.key !== targetKey)[0].key;
      setActiveKey(nextTabKey);
      navigate(nextTabKey); // 첫 번째 탭으로 이동
    }
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

  // 로그아웃 메뉴 정의
  const menuItems = [
    {
      key: 'logout',
      label: '로그아웃',
      onClick: () => handleLogout(),
    },
  ];

  const menu = <Menu items={menuItems} />;

  return (
    <DndProvider backend={HTML5Backend}>
      <TabsWrapper>
        <Tabs
          activeKey={activeKey}
          onChange={onTabChange}
          items={tabsData}
          hideAdd
        />
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <UserInfo>
            <div className={headerStyles.header_profile}>
              <div className={headerStyles.photo}>
                <img src="http://sanriokorea.co.kr/wp-content/themes/sanrio/images/kuromi.png" alt="User" />
              </div>
              <div className={headerStyles.header_name}>{user.userName}</div>
            </div>
          </UserInfo>
        </Dropdown>
      </TabsWrapper>
    </DndProvider>
  );
});

export default TabsContainer;
