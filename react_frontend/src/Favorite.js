import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { favState } from './atoms/tabAtoms';
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
  const [fav, setFav] = useRecoilState(favState);
  const navigate = useNavigate();
  const [openTabs, setOpenTabs] = useRecoilState(openTabsState);
  const [activeKey, setActiveKey] = useRecoilState(activeTabState);

  const onFavClick = (path, label) => {
    const newTab = { key: path, tab: label };

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
                  <List.Item onClick={() => onFavClick(item.address, item.menuName)}>
                      <IconContainer>
                          <StarOutlined />
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