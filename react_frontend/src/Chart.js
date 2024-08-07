import * as React from 'react';
import { BarChart } from '@mui/x-charts';

export function CustomBarChart({ data }){

    return(
        <BarChart
            series={data}
            barLabel={(item, context) => {
                return context.bar.height < 60 ? null : item.value?.toString();
            }}
            width={600}
            height={350}
        />
    );
}
