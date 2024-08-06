import React from 'react';
import { Tabs } from 'antd';

export default function InnerTabs({ items }) {
    return (
        <Tabs
            defaultActiveKey="1"
            type="card"
            size="large" // "small", "middle", "large"
            items={items}
        />
    )
}