import React from 'react';
import { ConfigProvider, Tabs } from 'antd';
import * as innerTabsStyles from "./assets/css/innerTabs.css";

const theme = {
    token: {
        colorBorder: '#ffffff',
        colorBorderSecondary: '#000046', // 탭 밑줄
        colorBgContainer: '#000046',
        lineWidth: 1,
    },
    components: {
        Tabs: {
            cardPaddingLG: '0.3rem 1.7rem',
            itemColor: '#707070',
            itemSelectedColor: '#ffffff',
            itemHoverColor: '#707070', // hover 글자색 기본과 똑같이
        },

    }
}

export default function InnerTabs({ items }) {
        return (
            <ConfigProvider theme={theme}>
                <Tabs
                    defaultActiveKey="1"
                    type="card"
                    size="large" // "small", "middle", "large"
                    items={items}
                    className={innerTabsStyles.customTabs}
                />
            </ConfigProvider>
        )
}