import React from 'react';
import * as chartStyles from "./assets/css/chart.css"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function ChartCustom({ title, data }) {
    return (
        <>
            <div className={chartStyles.chart_title}>{title}</div>

            <BarChart
                width={900}
                height={500}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Scope1" stackId="a" fill="#8884d8" />
                <Bar dataKey="Scope2" stackId="a" fill="#82ca9d" />
            </BarChart>
        </>
    );
}