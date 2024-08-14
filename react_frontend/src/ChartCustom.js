import React from 'react';
import { CustomBarChart } from './Chart';
import * as chartStyles from "./assets/css/chart.css"

export default function ChartCustom({ title, data }) {
    return (
        <>
            <div className={chartStyles.chart_title}>{title}</div>

            <CustomBarChart data={data} />
        </>
    );
}