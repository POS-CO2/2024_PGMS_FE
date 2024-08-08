import * as React from 'react';
import { BarChart } from '@mui/x-charts';

export function CustomBarChart({ data }){

    return(
        <BarChart
            series={data}
            barLabel={(item, context) => {
                return context.bar.height < 60 ? null : item.value?.toString();
            }}
            xAxis={[
                {
                    scaleType: 'band',
                    data: ['Jan', 'Feb', 'Mar', "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    id: 'months'
                }
            ]}
            leftAxis={null}
            width={800}
            height={350}
        />
    );
}
