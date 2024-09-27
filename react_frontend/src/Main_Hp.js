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
import { DataThresholding, Delete, ElectricBolt, KeyboardArrowDown, KeyboardArrowUp, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp, LeaderboardOutlined, LocalFireDepartment, MoreHoriz, MoveDown, OilBarrel, Public, WaterDrop, WorkspacePremium } from '@mui/icons-material';
import { ConfigProvider, Popover } from 'antd';

const StyledChart = styled.div`
    .apexcharts-canvas {
        width: 100%;
        height: 100%;
    }
`;

const StyledChart2 = styled.div`
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

const StyledRoot2 = styled.div`
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
            flex-direction: column;
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
        fontFamily: "SUITE-Regular",
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
        },
        labels: {
            formatter: function (value) {
                return Math.floor(value);
            }
        }
    },
    stroke: {
        width: 3,
        curve: "smooth", // 라인을 부드럽게 곡선으로 표시
    },
    markers: {
        
        size: 3, // 각 데이터 포인트에 표시될 원의 크기
    },
    dataLabels: {
        enabled: false // 데이터 라벨 표시 여부
    },
    tooltip: {
        enabled: true, // 툴팁 활성화
    },
    colors: ["rgb(14, 170, 0)", "#fefd48"], // 차트 라인의 색상 설정
    legend: {
        position: "top", // 범례의 위치
        horizontalAlign: "right"
    },
    title: {
        text: title,
        align: 'left',
        offsetX: 10,
        offsetY: 0,
        floating: false,
        style: {
            fontSize:  '25px',
            fontWeight:  'bold',
            color:  'rgb(14, 170, 0)',
            fontFamily:"SUITE-Regular",
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
        fontFamily:"SUITE-Regular",
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
    grid: {
        show: false,
        xaxis: {
            show: false,
        }
    },
    xaxis: {
        categories: [`${toMonth-1}월`, `${toMonth}월`, `${toMonth+1}월`]
    },
    yaxis: {
        title: {
            text: "배출량" // Y축에 표시될 제목
        },
        show: false,
    },
    stroke: {
        width: 2,
        curve: "smooth", // 라인을 부드럽게 곡선으로 표시
    },
    markers: {
        size: 3, // 각 데이터 포인트에 표시될 원의 크기
    },
    dataLabels: {
        enabled: false // 데이터 라벨 표시 여부
    },
    tooltip: {
        enabled: true, // 툴팁 활성화
    },
    colors: ["#ffffff", "#b6b6b6"], // 차트 라인의 색상 설정
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
            color:  'white',
            fontFamily:"SUITE-Regular"
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

const polarChartSeries = (data) => {
    return data;
}

const polarAreaChartOptions = (labels) => {
    if (!labels || labels.length === 0) return {};
    return {
        width:"100%",
        height:"100%",
        chart: {
            type: 'pie',
            toolbar: {
            show: false, // 차트 툴바 숨김
            fontFamily:"SUITE-Regular",
            },
        },
        dataLabels:{
            enabled: true,
            enabledOnSeries: undefined,
            formatter: function (val, opts) {
                return `${val.toFixed(2)}%`;
            },
            textAnchor: 'middle',
            distributed: false,
            offsetX: 0,
            offsetY: 0,
            style: {
                fontSize: "1rem",
                fontWeight:"bold",
                color: "rgb(55,57,78)",
                fontFamily:"SUITE-Regular",
            },
            dropShadow: {
                enabled: false,
            }
        },
        labels: labels, // 레이블 설정
        legend: {
            show: false,
            position: "top",
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
        },
        xaxis: {
            show: false,
        },
        yaxis: {
            show: false,
        },
        plotOptions: {
            polarArea: {
                rings: {
                    strokeWidth: 0,
                },
            },
        },
        stroke: {
            colors: ['#fff'], // 폴라 차트의 경계선 색상
        },
        fill: {
            opacity: 0.8, // 채우기 투명도
        },
        responsive: [{
            breakpoint: 480,
            options: {
            chart: {
                width: 300 // 작은 화면일 때 너비 설정
            },
            legend: {
                position: 'bottom'
            }
            }
        }],
        grid: {
            show: false
        },
        title: {
            text: ' 배출 현황', // 차트 제목
            align: 'left',
            style: {
                fontSize: '22px',
                fontWeight: 'bold',
                color: "rgb(55,57,78)",
                fontFamily:"SUITE-Regular",
            },
        },
        };
    };

export default function Main_Hp() {
    // 각 카드의 상태를 관리
    const [cardStyles, setCardStyles] = useState([
        { width: '28%', height: '90%', backgroundColor: '#6cbb66', isActive: true },
        { width: '20%', height: '70%', backgroundColor: 'white', isActive: false },
        { width: '20%', height: '70%', backgroundColor: 'white', isActive: false }
    ]);

    const [scope1, setScope1] = useState([]);
    const [scope2, setScope2] = useState([]);
    const [totScope, setTotScope] = useState([]);
    const [beforeScope1, setBeforeScope1] = useState([]);
    const [beforeScope2, setBeforeScope2] = useState([]);
    const [beforeTotScope, setBeforeTotScope] = useState([]);
    const [showChartIdx, setShowChartIdx] = useState(0);
    const [saleAmount, setSaleAmount] = useState([]);
    const [emtn, setEmtn] = useState([]);
    const [emtnName, setEmtnName] = useState([]);
    const [emtnAmt, setEmtnAmt] = useState([]);

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
                        width: style.isActive ? '20%' : '28%', // 클릭 시 35%로 확대, 다시 클릭 시 원래 크기로 축소
                        height: style.isActive ? '70%' : '90%',
                        backgroundColor: style.isActive ? style.originalColor : '#6cbb66', // 색상을 초록색으로 변경 또는 원래 색으로 복구
                        isActive: !style.isActive // 클릭 상태 토글
                    }
                    : {
                        ...style,
                        width: '20%', // 다른 카드는 원래 크기로 축소
                        height: '70%',
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
                const beforeScopeResponse = await axiosInstance.get(`/perf/total?year=${toYear-1}`);
                const beforeScope = beforeScopeResponse.data;
                setBeforeScope1(prev=>prev.concat(beforeScope.map(e=>e.scope1)));
                setBeforeScope2(prev=>prev.concat(beforeScope.map(e=>e.scope2)));
                setBeforeTotScope(prev=>prev.concat(beforeScope.map(e=>e.total)));

                const salesResponse = await axiosInstance.get(`/pjt/sales-sum`);
                const sales = salesResponse.data;
                setSaleAmount(sales);

                const emtnResponse = await axiosInstance.get(`/perf/by-emtn`);
                const emtnData = emtnResponse.data;
                setEmtn(emtnData);
                setEmtnName(prev => prev.concat(emtnData.map(e=>e.emtnActvType)));
                setEmtnAmt(prev => prev.concat(emtnData.map(e=>e.totalActvQty ?? 0)));
                

            } catch (error) {
                
            }
        }
        fetchChartData()

    }, [])

    const topData = [
        {
            name: "Scope1",
            value: (scope1[toMonth-1] / scope1[toMonth-2] * 100).toFixed(2) ?? 0,
        },
        {
            name: "Scope2",
            value: (scope2[toMonth-1] / scope2[toMonth-2] * 100).toFixed(2) ?? 0,
        },
        {
            name: "총량실적",
            value: (totScope[toMonth-1] / totScope[toMonth-2] * 100).toFixed(2) ?? 0,
        },
    ]
    const renderIcon = (e) => {
        switch (e) {
            case 'T0':  //공통
                return <Public fontSize='large' sx={{color:"green"}} />;
            case 'RK':  //참고데이터
                return <DataThresholding fontSize='large' sx={{color:"blue"}} />;
            case 'F0':  //연료
                return <OilBarrel fontSize='large' sx={{color:"orange"}} />;
            case 'R1':  //원료
            case 'R2':  //촉매
            case 'R3':  //환원재
                return <WaterDrop fontSize='large' sx={{color:"#79edff"}} />;
            case 'P1':  //최종산출물
            case 'P2':  //중간산출물
            case 'P3':  //기타산출물
                return <MoveDown fontSize='large' sx={{color:"rgb(55, 57, 78)"}} />;
            case 'S0':  //열
                return <LocalFireDepartment fontSize='large' sx={{color: "red"}} />;
            case 'E0':  //전기
                return <ElectricBolt fontSize='large' sx={{color:"yellow"}} />;
            case 'W0':  //폐기물
                return <Delete fontSize='large' sx={{color:"gray"}} />;
            case 'O0':  //기타부산물
                return <MoreHoriz fontSize='large' sx={{color:"rgb(55, 57, 78)"}} />;
            case 'IC':  //지표데이터
                return <DataThresholding fontSize='large' sx={{color:"blue"}} />;
            default:
                return <></>;
        }
    };
    console.log(emtn);

    const content = (
        emtn?.actvQtyEmtnEquipList?.map(v => (
            <div>hello</div>
        ))
    );
    
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
                                        {index === 0 ? (
                                            <ApexChart
                                                options={miniChartOptions("Scope1", toMonth)}
                                                series={miniChartSeries(scope1, beforeScope1, toYear, toMonth)}
                                                type="line"
                                                height="100%"
                                            />
                                        ) : (
                                            (index === 1 ? (
                                                <ApexChart
                                                    options={miniChartOptions("Scope2", toMonth)}
                                                    series={miniChartSeries(scope2, beforeScope2, toYear, toMonth)}
                                                    type="line"
                                                    height="100%"
                                                />
                                            ) : (
                                                <ApexChart
                                                    options={miniChartOptions("총량실적", toMonth)}
                                                    series={miniChartSeries(totScope, beforeTotScope, toYear, toMonth)}
                                                    type="line"
                                                    height="100%"
                                                />
                                            ))
                                        )}
                                        
                                    </div>
                                ) : (
                                    <div className={gridStyles.top_logo}>
                                        <div style={{color:"rgb(55, 57, 78)", fontSize:"1.5rem", fontWeight:"bold", margin:"2rem 0 0 2rem"}}>
                                        {topData[index].name}
                                        </div>
                                        <div className={gridStyles.top_box_percentage}>
                                            {topData[index].value > 0 ? (
                                                <div style={{color:"red", display:"flex", justifyContent:"center", alignItems:"center", gap:"0.7rem"}}>
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
                        <div className={gridStyles.left_bottom_logo}></div>
                        <StyledRoot style={{width:"100%", height:"100%"}}>
                            <Swiper
                                spaceBetween={30}    // 슬라이드 사이의 간격
                                slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                navigation={true}           // 이전/다음 버튼 네비게이션
                                modules={[Navigation, Pagination]}
                            >
                                {saleAmount.map((data, idx) => (
                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                        <Card sx={{backgroundColor:"white", width:"95%", height:"70%", margin:"1rem auto", borderRadius:"15px", display:"flex", flexDirection:"column"}}>
                                            <div className={gridStyles.left_bottom_1}>
                                                <div className={gridStyles.left_bottom_medal}>
                                                    {idx === 0 ? <WorkspacePremium fontSize='large' sx={{color:"gold"}} /> : (idx === 1 ? <WorkspacePremium fontSize='large' sx={{color:"silver"}} /> : (idx === 2 ? <WorkspacePremium fontSize='large' sx={{color:"#cd7f32"}} /> : <></>))}
                                                </div>
                                                <div className={gridStyles.left_bottom_pjtname}>
                                                    {data.pjtName}
                                                </div>
                                            </div>
                                            <div className={gridStyles.left_bottom_amt}>{`₩ ${(data.totalSalesAmt/1000000).toFixed(2)}백만원`}</div>
                                        </Card>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </StyledRoot>
                    </div>
                </div>
                <div className={gridStyles.right_box}>
                    <Card sx={{backgroundColor:"white", width:"100%", height:"100%"}}>
                        <div className={gridStyles.right_chart_area}>
                        <StyledChart2 style={{width:"100%", height:"100%"}}>
                            <ApexChart
                                options={polarAreaChartOptions(emtnName)}
                                series={polarChartSeries(emtnAmt)}
                                type="pie"
                                width={"100%"}
                                height={"100%"}
                            />
                        </StyledChart2>
                        </div>
                        <div className={gridStyles.right_swiper_area}>
                            <div style={{fontWeight:"bold", fontSize:"22px", marginLeft:"0.5rem", color:"rgb(55, 57, 78)"}}>
                                활동량
                            </div>
                            <StyledRoot2 style={{width:"100%", height:"100%", overflow:"hidden"}}>
                                <Swiper
                                    direction='vertical'
                                    spaceBetween={40}    // 슬라이드 사이의 간격
                                    slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                    pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                    navigation={true}           // 이전/다음 버튼 네비게이션
                                    modules={[Navigation, Pagination]}
                                >
                                    {emtn.map((data) => (
                                        <SwiperSlide style={{width:"100%", height:"100%"}}>
                                            <ConfigProvider
                                            theme={{
                                                token:{
                                                    fontFamily:"SUITE-Regular",
                                                    fontSize:"1.2rem"
                                                }
                                            }} >
                                                <Popover placement='left' title={data.emtnActvType} content={data.actvQtyEmtnEquipList.map(v => (
                                                <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignContent:"center", gap:"1rem"}}>
                                                    <div>
                                                    {v.equipLibName}
                                                    </div>
                                                    <div>
                                                        {`${v.formattedEquipActvQty} ${data.inputUnitCode}`}
                                                    </div>
                                                </div>
                                                ))} arrow={true}>
                                                    <Card sx={{backgroundColor:"white", width:"90%", height:"100%", margin:"1rem auto", borderRadius:"15px", display:"flex", flexDirection:"column", backgroundColor:"rgb(241,244,248)"}}>
                                                        <div className={gridStyles.left_bottom_1}>
                                                            <div className={gridStyles.right_swiper_box_logo}>
                                                                {renderIcon(data.actvDataDvs)}
                                                                {data.emtnActvType}
                                                            </div>
                                                        </div>
                                                        <div className={gridStyles.right_swiper_emtn}>{`${data.formattedTotalActvQty !== "" ? data.formattedTotalActvQty : 0} ${data.inputUnitCode}`}</div>
                                                    </Card>
                                                </Popover>
                                            </ConfigProvider>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </StyledRoot2>
                        </div>
                    </Card>
                    
                </div>
            </div>
        </>
    )
}