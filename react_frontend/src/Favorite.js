import React from 'react';
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

const Favorite = ({ favoriteData, items }) => {

    // 즐겨찾기 메뉴를 클릭했을때, label값으로 item을 찾음
    const findItemByLabel = (items, key) =>
        items.reduce((acc, item) => {
        if (acc) return acc;
        if (item.key === key) return item;
        if (item.children) return findItemByKey(item.children, key);
        return null;
    }, null);

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
                    dataSource={favoriteData}
                    renderItem={item => (
                    <List.Item>
                        <IconContainer>
                            <StarOutlined />
                        </IconContainer>
                        <FavoriteItem>
                            {item}
                        </FavoriteItem>
                    </List.Item>
                    )}
                />
            </FavoritesContainer>
        </ConfigProvider>
    );
};

export default Favorite;