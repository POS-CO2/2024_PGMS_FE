import { Card } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import ApexChart from "react-apexcharts";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-coverflow';
import * as gridStyles from './assets/css/gridHp.css'


export default function Main_Hp() {
    
    
    return (
        <>
            <div className={gridStyles.maingrid}>
                <div className={gridStyles.left_box}>
                    <div className={gridStyles.left_box_top}>
                        <Card sx={{backgroundColor:"red",width:"25%", height: "100%"}}>
                        </Card>
                        <Card sx={{backgroundColor:"yellow", width:"25%", height: "90%"}}>b</Card>
                        <Card sx={{backgroundColor:"green", width:"25%", height: "90%"}}>c</Card>
                    </div>
                    <div className={gridStyles.left_box_chart}>
                        {/* <ApexChart /> */}
                    </div>
                    <div className={gridStyles.left_box_bottom}>
                        <div style={{backgroundColor:"red",width:"50%", height: "100%"}}>1</div>
                        <div style={{backgroundColor:"red",width:"50%", height: "100%"}}>1</div>
                        <div style={{backgroundColor:"red",width:"50%", height: "100%"}}>1</div>
                        <div style={{backgroundColor:"red",width:"50%", height: "100%"}}>1</div>
                        <div style={{backgroundColor:"red",width:"50%", height: "100%"}}>1</div>
                    </div>
                </div>
            </div>
        </>
    )
}