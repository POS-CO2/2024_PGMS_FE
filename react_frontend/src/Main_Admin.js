import React, { useState, useRef, useEffect } from 'react';
import * as gridStyles from './assets/css/gridAdmin.css';
import { Card } from '@mui/material';
import { Code, Menu, ManageAccounts, Terminal, PeopleAlt, Engineering, Business, Settings, Today } from '@mui/icons-material';
import { SwiperSlide, Swiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import styled from 'styled-components';
import ApexCharts from 'react-apexcharts';
import { Link } from 'react-router-dom';

const StyledRoot = styled.div`
    .swiper {

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

const StyledChart = styled.div`
    .apexcharts-canvas {
        width: 100%;
        height: 100%;
    }
`;

const ChartOptions = (title, xdata) => {
    const chartOption = {
      chart: {
        type: "line",
        toolbar: {
          show: false
        },
        width: "100%",
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
        grid: {
            show: false,
            xaxis: { 
            show: false,
            categories: xdata,
            }
        },
        xaxis: {
            categories: xdata
        },
        yaxis: {
            title: {
            text: "배출량"
            },
            show: false,
        },
        stroke: {
            width: 2,
            curve: "smooth",
        },
        markers: {
            size: 3,
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            enabled: true,
        },
        colors: ["red"],
        legend: {
            position: "top",
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
                color:  'rgb(55,57,78)'
            },
        }
    }
    return chartOption;
};


export default function Main_Admin() {
    
    const [showMenuBar, setShowMenuBar] = useState(false);

    const [dateArray, setDateArray] = useState([]);

    const handleMouseOver = () => {
        setShowMenuBar(true);
    }

    const handleMouseLeave = () => {
        setShowMenuBar(false);
    }

    const getLast7Days = () => {
        const days = [];
        const today = new Date();
    
        for (let i = 0; i < 7; i++) {
            const priorDate = new Date();
            priorDate.setDate(today.getDate() - i);
        
            const month = priorDate.getMonth() + 1;
            const day = priorDate.getDate();
        
            days.push(`${month}/${day}`);
        }
    
        return days.reverse(); // 과거 -> 현재 순으로 정렬
    };

    useEffect(() => {
        const xAxisChart = getLast7Days();
        setDateArray(xAxisChart);
        console.log(xAxisChart);

    }, []);
    console.log(dateArray);
    return (
            <div className={gridStyles.main_grid}>
                <div className={gridStyles.left_box}>
                    <Card sx={{width:"90%", height:"25%", borderRadius:"10px"}}>
                        서버 관리
                    </Card>
                    <Card sx={{width:"90%", height:"25%", borderRadius:"10px"}}>
                        예외 관리
                    </Card>
                </div>
                <div className={gridStyles.mid_box}> 
                    <div className={gridStyles.real_board}>
                        <Card sx={{width:"98%", height:"100%", borderRadius:"10px"}}>

                        </Card>
                        {/* 아래 메뉴 바로가기 구현부 */}
                        <div onMouseEnter={handleMouseOver} onMouseLeave={handleMouseLeave} className={`${gridStyles.menu_bar} ${showMenuBar ? gridStyles.menu_bar_hover : ''}`}>
                            {showMenuBar ? (
                                // 호버 시 보이는 카드
                                <Card sx={{width:"98%", height:"70%", borderRadius:"10px", backgroundColor:"rgba(0,0,30,0.3)", backdropFilter: "blur(2px)", display:"flex", justifyContent:"center", alignItems:"center"}}>
                                    <div className={gridStyles.icon_box}>
                                        {/* 바로가기 구현 필요 */}
                                        <Link to="/cm">
                                        <Card sx={{backgroundColor:"rgb(211,245,230)", width:"4rem", height:"4rem", display:"flex",justifyContent:"center", alignItems:"center", borderRadius:"10px"}}>
                                            <Code fontSize='large' sx={{color:"white"}} />
                                        </Card>
                                        </Link>
                                        <Card sx={{backgroundColor:"rgb(196,247,254)", width:"4rem", height:"4rem", display:"flex",justifyContent:"center", alignItems:"center", borderRadius:"10px"}}>
                                            <ManageAccounts fontSize='large' sx={{color:"white"}}/>
                                        </Card>
                                        <Card sx={{backgroundColor:"rgb(253,241,187)", width:"4rem", height:"4rem", display:"flex",justifyContent:"center", alignItems:"center", borderRadius:"10px"}}>
                                            <Menu fontSize="large" sx={{color:"white"}} />
                                        </Card>
                                        <Card sx={{backgroundColor:"rgb(213,212,249)", width:"4rem", height:"4rem", display:"flex",justifyContent:"center", alignItems:"center", borderRadius:"10px"}}>
                                            <Terminal fontSize='large' sx={{color:"white"}} />
                                        </Card>
                                    </div>
                                </Card>
                            ) : (
                                <Card sx={{width:"98%", height:"100%", borderRadius:"10px 10px 0 0", backgroundColor:"rgba(0,0,30,0.3)", backdropFilter: "blur(2px)", display:"flex", justifyContent:"center", alignItems:"center"}}>
                                    <div className={gridStyles.icon_box_before}>
                                        <Card sx={{backgroundColor:"rgb(211,245,230)", width:"4rem", height:"1rem", display:"flex",justifyContent:"center", alignItems:"center", borderRadius:"10px 10px 0 0"}}></Card>
                                        <Card sx={{backgroundColor:"rgb(196,247,254)", width:"4rem", height:"1rem", display:"flex",justifyContent:"center", alignItems:"center", borderRadius:"10px 10px 0 0"}}></Card>
                                        <Card sx={{backgroundColor:"rgb(253,241,187)", width:"4rem", height:"1rem", display:"flex",justifyContent:"center", alignItems:"center", borderRadius:"10px 10px 0 0"}}></Card>
                                        <Card sx={{backgroundColor:"rgb(213,212,249)", width:"4rem", height:"1rem", display:"flex",justifyContent:"center", alignItems:"center", borderRadius:"10px 10px 0 0"}}></Card>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
                <div className={gridStyles.right_box}>
                    {/* 동시접속자 */}
                    <div className={gridStyles.right_box_top}>
                        <Card sx={{width:"95%", height:"100%", borderRadius:"10px"}}>
                            <div className={gridStyles.right_box_text}>
                                접속자 수
                            </div>
                            <div className={gridStyles.right_box_user}>
                                <div className={gridStyles.online_dot}>●</div>
                                <div className={gridStyles.online_user}>19,830</div>
                                <div className={gridStyles.online_icon}>
                                    <PeopleAlt fontSize='large' sx={{color:"gray"}} />
                                </div>
                            </div>
                            <div className={gridStyles.right_box_access}>
                                <div className={gridStyles.online_access}>
                                    <Engineering fontSize='small' sx={{color:"gray"}} />
                                    1999
                                </div>
                                <div className={gridStyles.online_access}>
                                    <Business fontSize='small' sx={{color:"gray"}} />
                                    204
                                </div>
                                <div className={gridStyles.online_access}>
                                    <Settings fontSize='small' sx={{color:"gray"}} />
                                    4
                                </div>
                            </div>
                        </Card>
                    </div>
                    {/* 메뉴별 접속 차트 */}
                    <div className={gridStyles.right_box_bottom}>
                        <Card sx={{width:"95%", height:"100%", borderRadius:"10px"}} >
                            <div className={gridStyles.right_bottom_logo}>
                                메뉴별 접속 현황
                            </div>
                            <StyledRoot style={{width:"100%", height:"100%", overflow:"hidden"}}>
                                <Swiper
                                    direction='vertical'
                                    spaceBetween={30}    // 슬라이드 사이의 간격
                                    slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                    // centeredSlides={true}
                                    pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                    navigation={true}           // 이전/다음 버튼 네비게이션
                                    modules={[Navigation, Pagination]}
                                >
                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                        <Card sx={{backgroundColor:"white", width:"90%", height:"100%", margin:"1rem auto", borderRadius:"15px", display:"flex", flexDirection:"column", backgroundColor:"rgb(241,244,248)"}}>
                                            <StyledChart>
                                                <ApexCharts
                                                    options={ChartOptions("메뉴관리", dateArray)}
                                                    series={[{
                                                        name: "접속자",
                                                        data: [4, 5, 6, 3, 2, 9, 6] // 차트 데이터
                                                    }]}
                                                    type="line"
                                                    height="100%"
                                                />
                                            </StyledChart>
                                        </Card>
                                    </SwiperSlide>
                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                        <Card sx={{backgroundColor:"white", width:"90%", height:"100%", margin:"1rem auto", borderRadius:"15px", display:"flex", flexDirection:"column", backgroundColor:"rgb(241,244,248)"}}>
                                            <StyledChart>
                                                <ApexCharts
                                                    options={ChartOptions("배출원관리", dateArray)}
                                                    series={[{
                                                        name: "접속자",
                                                        data: [4, 5, 6, 3, 2, 9, 6] // 차트 데이터
                                                    }]}
                                                    type="line"
                                                    height="100%"
                                                />
                                            </StyledChart>
                                        </Card>
                                    </SwiperSlide>
                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                        <Card sx={{backgroundColor:"white", width:"90%", height:"100%", margin:"1rem auto", borderRadius:"15px", display:"flex", flexDirection:"column", backgroundColor:"rgb(241,244,248)"}}>
                                        <StyledChart>
                                                <ApexCharts
                                                    options={ChartOptions("실적조회", dateArray)}
                                                    series={[{
                                                        name: "접속자",
                                                        data: [4, 5, 6, 3, 2, 9, 6] // 차트 데이터
                                                    }]}
                                                    type="line"
                                                    height="100%"
                                                />
                                            </StyledChart>
                                        </Card>
                                    </SwiperSlide>
                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                        <Card sx={{backgroundColor:"white", width:"90%", height:"100%", margin:"1rem auto", borderRadius:"15px", display:"flex", flexDirection:"column", backgroundColor:"rgb(241,244,248)"}}>
                                        <StyledChart>
                                                <ApexCharts
                                                    options={ChartOptions("설비지정", dateArray)}
                                                    series={[{
                                                        name: "접속자",
                                                        data: [4, 5, 6, 3, 2, 9, 6] // 차트 데이터
                                                    }]}
                                                    type="line"
                                                    height="100%"
                                                />
                                            </StyledChart>
                                        </Card>
                                    </SwiperSlide>
                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                        <Card sx={{backgroundColor:"white", width:"90%", height:"100%", margin:"1rem auto", borderRadius:"15px", display:"flex", flexDirection:"column", backgroundColor:"rgb(241,244,248)"}}>
                                        </Card>
                                    </SwiperSlide>
                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                        <Card sx={{backgroundColor:"white", width:"90%", height:"100%", margin:"1rem auto", borderRadius:"15px", display:"flex", flexDirection:"column", backgroundColor:"rgb(241,244,248)"}}>
                                        </Card>
                                    </SwiperSlide>
                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                        <Card sx={{backgroundColor:"white", width:"90%", height:"100%", margin:"1rem auto", borderRadius:"15px", display:"flex", flexDirection:"column", backgroundColor:"rgb(241,244,248)"}}>
                                        </Card>
                                    </SwiperSlide>
                                </Swiper>
                            </StyledRoot>
                        </Card>
                    </div>
                </div>
            </div>
    );
}