import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { favState, itemsState, selectedKeyState, openKeysState } from './atoms/tabAtoms';
import { openTabsState, activeTabState } from './atoms/tabAtoms';
import styled from 'styled-components';
import { ConfigProvider, List } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const FavoritesContainer = styled.div`
  width: 100%;
  background-color: transparent;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto; /* 가상 요소를 가운데 정렬 */
    width: 90%; /* border-top 너비를 80%로 설정 */
    height: 0.125rem; /* 2px -> 0.125rem */
    background-color: #D9D9D9;
  }
`;

const FavoritesTitle = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #777777;
  padding: 0 0.5rem;
`;

const FavoritesList = styled(List)`
  color: #777777;
  padding: 0.75rem 0.75rem;

  .ant-list-item {
    padding: 0.5rem 0;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: flex-start;
    margin-left: 0.3rem;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #0EAA00; /* 호버 시 색상을 #0EAA00으로 변경 */
    }
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const FavoriteItem = styled.div`
  display: flex;
  justify-content: flex-start;
`;


const Favorite = () => {
  const fav = useRecoilValue(favState);
  const navigate = useNavigate();
  const [openTabs, setOpenTabs] = useRecoilState(openTabsState);
  const setActiveKey = useSetRecoilState(activeTabState);
  const items = useRecoilValue(itemsState);
  const setSelectedKeys = useSetRecoilState(selectedKeyState);
  const [openKeys, setOpenKeys] = useRecoilState(openKeysState);

  // 메뉴를 클릭했을 때, key값으로 item을 찾음
  const findItemByLabel = (items, targetLabel) =>
    items.reduce((acc, item) => {
    if (acc) return acc;
    if (typeof item.label === 'string' && item.label.replace(/\*/g, '') === targetLabel) // label에 * 이 있으면 없애고 비교
      return item;
    if (item.children) return findItemByLabel(item.children, targetLabel);
    return null;
  }, null);

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

  const onFavClick = (label) => {
    const item = findItemByLabel(items, label);

    if (item) {
      setSelectedKeys([item.key]);

      // 대분류(상위 메뉴)를 찾아 openKeys에 추가
      const parentItem = findParentItem(items, item.key);
      if (parentItem) {
        setOpenKeys([...openKeys, parentItem.key]);
      }
    }

    const path = item.path;
    const newTab = { key: path, tab: label, accessUser: item.accessUser };

    if (!openTabs.find(tab => tab.key === path)) {
      setOpenTabs([...openTabs, newTab]);  // 새로운 탭 추가
    }
    
    setActiveKey(path);  // activeKey를 변경
    navigate(path);  // 경로 이동
  };

  return (
      <ConfigProvider
          theme={{
              token:{
                  fontFamily:"SUITE-Regular"
              }
          }} 
      >
          <FavoritesContainer>
              <FavoritesTitle>즐겨찾기</FavoritesTitle>
              <FavoritesList
                  dataSource={fav}
                  renderItem={item => (
                  <List.Item onClick={() => onFavClick(item.menuName)}>
                      <IconContainer>
                          <StarOutlined style={{ color: '#FFCC00' }}/>
                      </IconContainer>
                      <FavoriteItem>
                          {item.menuName}
                      </FavoriteItem>
                  </List.Item>
                  )}
              />
          </FavoritesContainer>
      </ConfigProvider>
  );
};

export default Favorite;