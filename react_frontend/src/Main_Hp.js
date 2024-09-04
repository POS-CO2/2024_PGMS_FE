import { Card } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import ApexChart from "react-apexcharts";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import * as gridStyles from './assets/css/gridHp.css'
import styled from 'styled-components';
import axiosInstance from './utils/AxiosInstance';
import { KeyboardArrowDown, KeyboardArrowUp, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';

const StyledChart = styled.div`
    .apexcharts-canvas {
        width: 100%;
        height: 100%;
    }
`;

const StyledRoot = styled.div`
    .swiper {
        // position: relative;
        // width: 100%;
        // height: 100%;

        &.swiper-initialized {
            width: 100%;
            height: 100%;
        }
        &-wrapper {
            display: flex;
            width: 100%;
            height: 100%;
        }
        &-slide {
            flex-shrink: 0; // important
            width: 100%;
            height: 100%;
        },
    }    
`;

const chartOptions = (title) => {
    const chartOption = {
    chart: {
        type: "line",
        toolbar: {
            show: false // 차트 툴바를 숨김
        },
        width: "100%",  // 부모 요소의 100%를 채우도록 설정
        height: "100%",
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    width: '100%',
                    height: '100%',
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    },
    xaxis: {
        categories: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
    },
    yaxis: {
        title: {
            text: "배출량" // Y축에 표시될 제목
        }
    },
    stroke: {
        curve: "smooth", // 라인을 부드럽게 곡선으로 표시
    },
    markers: {
        size: 4, // 각 데이터 포인트에 표시될 원의 크기
    },
    dataLabels: {
        enabled: false // 데이터 라벨 표시 여부
    },
    tooltip: {
        enabled: true, // 툴팁 활성화
    },
    colors: ["#FF1654", "#247BA0"], // 차트 라인의 색상 설정
    legend: {
        position: "top", // 범례의 위치
        horizontalAlign: "right"
    },
    title: {
        text: title,
        align: 'left',
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
            fontSize:  '25px',
            fontWeight:  'bold',
            color:  '#66c66e'
        },
    }
    }
    return chartOption;
};

const miniChartOptions = (title, toMonth) => {
    const chartOption = {
    chart: {
        type: "line",
        toolbar: {
            show: false // 차트 툴바를 숨김
        },
        width: "100%",  // 부모 요소의 100%를 채우도록 설정
        height: "100%",
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    width: '100%',
                    height: '100%',
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    },
    xaxis: {
        categories: [toMonth-1, toMonth, toMonth+1]
    },
    yaxis: {
        title: {
            text: "배출량" // Y축에 표시될 제목
        },
        show: false,
    },
    stroke: {
        curve: "smooth", // 라인을 부드럽게 곡선으로 표시
    },
    markers: {
        size: 4, // 각 데이터 포인트에 표시될 원의 크기
    },
    dataLabels: {
        enabled: false // 데이터 라벨 표시 여부
    },
    tooltip: {
        enabled: true, // 툴팁 활성화
    },
    colors: ["#FF1654", "#247BA0"], // 차트 라인의 색상 설정
    legend: {
        position: "top", // 범례의 위치
        horizontalAlign: "right",
        show: false,
    },
    title: {
        text: title,
        align: 'left',
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
            fontSize:  '25px',
            fontWeight:  'bold',
            color:  'green'
        },
    }
    }
    return chartOption;
};

const chartSeries = (data, beforeData, toYear) => {
    const charData = [
        {
            name: `${toYear}년`,
            data: data.map(e=> e === 0 ? null : e)
        },
        {
            name: `${toYear-1}년`,
            data: beforeData.map(e=> e === 0 ? null : e)
        }
    ];
    return charData;
} 

const miniChartSeries = (data, beforeData, toYear, toMonth) => {
    const charData = [
        {
            name: `${toYear}년`,
            data: data.map(e=> e === 0 ? null : e).slice(toMonth-2, toMonth+1)
        },
        {
            name: `${toYear-1}년`,
            data: beforeData.map(e=> e === 0 ? null : e).slice(toMonth-2, toMonth+1)
        }
    ];
    return charData;
} 

export default function Main_Hp() {
    // 각 카드의 상태를 관리
    const [cardStyles, setCardStyles] = useState([
        { width: '28%', height: '90%', backgroundColor: '#adf8a7', isActive: true },
        { width: '25%', height: '80%', backgroundColor: 'white', isActive: false },
        { width: '25%', height: '80%', backgroundColor: 'white', isActive: false }
    ]);

    const [scope1, setScope1] = useState([]);
    const [scope2, setScope2] = useState([]);
    const [totScope, setTotScope] = useState([]);
    const [beforeScope1, setBeforeScope1] = useState([]);
    const [beforeScope2, setBeforeScope2] = useState([]);
    const [beforeTotScope, setBeforeTotScope] = useState([]);
    const [showScope1, setShowScope1] = useState(true);
    const [showScope2, setShowScope2] = useState(false);
    const [showTotScope, setShowTotScope] = useState(false);
    const [showChartIdx, setShowChartIdx] = useState(0);

    let today = new Date();
    let toYear = today.getFullYear();
    let toMonth = today.getMonth();

    // 카드 클릭 시 호출되는 핸들러
    const handleCardClick = (index) => {
        setCardStyles(prevStyles =>
            prevStyles.map((style, i) =>
                i === index
                    ? {
                        ...style,
                        width: style.isActive ? '25%' : '28%', // 클릭 시 35%로 확대, 다시 클릭 시 원래 크기로 축소
                        height: style.isActive ? '80%' : '90%',
                        backgroundColor: style.isActive ? style.originalColor : '#adf8a7', // 색상을 초록색으로 변경 또는 원래 색으로 복구
                        isActive: !style.isActive // 클릭 상태 토글
                    }
                    : {
                        ...style,
                        width: '25%', // 다른 카드는 원래 크기로 축소
                        height: '80%',
                        backgroundColor: style.originalColor, // 다른 카드는 원래 색상으로 복구
                        isActive: false
                    }
            )
        );
        setShowChartIdx(index);
    };

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                // 올해 스코프
                const scopeResponse = await axiosInstance.get(`/perf/total?year=${toYear}`);
                const afterScope = scopeResponse.data;
                setScope1(prev=>prev.concat(afterScope.map(e => e.scope1)));
                setScope2(prev=>prev.concat(afterScope.map(e => e.scope2)));
                setTotScope(prev=>prev.concat(afterScope.map(e => e.total)));

                //작년 스코프
                const beforeScopeResponse = await axiosInstance.get(`/perf/total?year=${toYear-1}`)
                const beforeScope = beforeScopeResponse.data;
                setBeforeScope1(prev=>prev.concat(beforeScope.map(e=>e.scope1)));
                setBeforeScope2(prev=>prev.concat(beforeScope.map(e=>e.scope2)));
                setBeforeTotScope(prev=>prev.concat(beforeScope.map(e=>e.total)));

            } catch (error) {
                
            }
        }
        fetchChartData();
        
    }, [])

    const topData = [
        {
            name: "scope1",
            value: (scope1[toMonth-1] / scope1[toMonth-2] * 100).toFixed(2) ?? 0,
        },
        {
            name: "scope2",
            value: (scope2[toMonth-1] / scope2[toMonth-2] * 100).toFixed(2) ?? 0,
        },
        {
            name: "총량실적",
            value: (totScope[toMonth-1] / totScope[toMonth-2] * 100).toFixed(2) ?? 0,
        },
    ]
    
    console.log(scope1);
    console.log(topData);
    

    return (
        <>
            <div className={gridStyles.maingrid}>
                <div className={gridStyles.left_box}>
                    <div className={gridStyles.left_box_top}>
                        {cardStyles.map((style, index) => (
                            <Card 
                                key={{index}}
                                sx={{
                                    ...style,
                                    cursor: "pointer",
                                    transition:"width 0.5s ease, background-color 0.5s ease",
                                    borderRadius:"0px 0px 15px 15px"
                                }}
                                onClick={() => handleCardClick(index)}
                            >
                                {style.isActive ? (
                                    <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
                                        <br/>
                                        <ApexChart
                                            options={miniChartOptions("Scope1", toMonth)}
                                            series={miniChartSeries(scope1, beforeScope1, toYear, toMonth)}
                                            type="line"
                                            height="100%"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{}}>
                                        {topData[index].name}
                                        </div>
                                        <div>
                                            {topData[index].value > 0 ? (
                                                <div style={{color:"red", display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                    {topData[index].value > 10 ? (<>
                                                        <KeyboardDoubleArrowUp fontSize='large'/>{topData[index].value}%
                                                    </>) : (<>
                                                        <KeyboardArrowUp fontSize="large"/>{topData[index].value}%
                                                    </>)}
                                                </div>
                                            ) : (
                                                <div style={{color:"green", display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                    {topData[index].value < -15 ? (<>
                                                        <KeyboardDoubleArrowDown fontSize='large' />{topData[index].value}%
                                                    </>) : (<>
                                                        <KeyboardArrowDown fontSize='large'/>{topData[index].value}%
                                                    </>)}
                                                    
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                        {/* <Card sx={{backgroundColor:"white",width:"25%", height: "100%"}}>ㅁ</Card>
                        <Card sx={{backgroundColor:"white", width:"25%", height: "90%"}}>b</Card>
                        <Card sx={{backgroundColor:"white", width:"25%", height: "90%"}}>c</Card> */}
                    </div>
                    <div className={gridStyles.left_box_chart}>
                        <StyledChart style={{width:"100%", height:"100%"}}>
                            {(showChartIdx === 0) ? (
                                <ApexChart
                                    options={chartOptions("Scope1")}
                                    series={chartSeries(scope1, beforeScope1, toYear)}
                                    type="line"
                                    height="100%"
                                />
                            ) : (
                                (showChartIdx === 1 ? (
                                    <ApexChart
                                        options={chartOptions("Scope2")}
                                        series={chartSeries(scope2, beforeScope2, toYear)}
                                        type="line"
                                        height="100%"
                                    />
                                ) : (
                                    <ApexChart
                                        options={chartOptions("총량실적")}
                                        series={chartSeries(totScope, beforeTotScope, toYear)}
                                        type="line"
                                        height="100%"
                                    />
                                ))
                            )}
                            
                        </StyledChart>
                    </div>
                    <div className={gridStyles.left_box_bottom}>
                        <StyledRoot style={{width:"100%", height:"100%"}}>
                            <Swiper
                                spaceBetween={30}    // 슬라이드 사이의 간격
                                slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                // centeredSlides={true}
                                pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                navigation={true}           // 이전/다음 버튼 네비게이션
                                modules={[Navigation, Pagination]}
                            >
                                <SwiperSlide style={{width:"100%", height:"100%"}}>
                                    <Card sx={{backgroundColor:"white", width:"80%", height:"80%", margin:"1rem auto", borderRadius:"10px", display:"flex", justifyContent:"center", alignItems:"center"}}>a</Card>
                                </SwiperSlide>
                                <SwiperSlide style={{width:"100%", height:"100%"}}>
                                    <Card sx={{backgroundColor:"white", width:"80%", height:"80%", margin:"1rem auto", borderRadius:"10px", display:"flex", justifyContent:"center", alignItems:"center"}}>a</Card>
                                </SwiperSlide>
                                <SwiperSlide style={{width:"100%", height:"100%"}}>
                                    <Card sx={{backgroundColor:"white", width:"80%", height:"80%", margin:"1rem auto", borderRadius:"10px", display:"flex", justifyContent:"center", alignItems:"center"}}>a</Card>
                                </SwiperSlide>
                                <SwiperSlide style={{width:"100%", height:"100%"}}>
                                    <Card sx={{backgroundColor:"white", width:"80%", height:"80%", margin:"1rem auto", borderRadius:"10px", display:"flex", justifyContent:"center", alignItems:"center"}}>a</Card>
                                </SwiperSlide>
                                <SwiperSlide style={{width:"100%", height:"100%"}}>
                                    <Card sx={{backgroundColor:"white", width:"80%", height:"80%", margin:"1rem auto", borderRadius:"10px", display:"flex", justifyContent:"center", alignItems:"center"}}>a</Card>
                                </SwiperSlide>
                            </Swiper>
                        </StyledRoot>
                    </div>
                </div>
                <div className={gridStyles.right_box}>
                    <Card sx={{backgroundColor:"white", width:"100%", height:"100%"}}/>
                    {/* <ApexChart/> */}
                    <div>
                        <Swiper/>
                    </div>
                </div>
            </div>
        </>
    )
}