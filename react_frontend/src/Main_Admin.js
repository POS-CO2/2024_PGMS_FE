import React, { useState, useRef, useEffect } from 'react';
import * as gridStyles from './assets/css/gridAdmin.css';
import { Card, Divider, IconButton } from '@mui/material';
import { Code, Menu, ManageAccounts, Terminal, PeopleAlt, Engineering, Business, Settings, Today, AddCircleTwoTone, RemoveCircleTwoTone } from '@mui/icons-material';
import { SwiperSlide, Swiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import styled from 'styled-components';
import ApexCharts from 'react-apexcharts';
import { Link } from 'react-router-dom';
import EcrLogo from './assets/images/ecrlogo.png';
import TerminalLogo from './assets/images/terminal.png';
import ContainerLogo from './assets/images/container.png';
import ContainerAddLogo from './assets/images/containeradd.png';
import ApiLogo from './assets/images/api.png';
import { ConfigProvider, Tabs, DatePicker } from 'antd';
import TabsContainer from './TabsContainer';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const StyledDatePicker = styled(RangePicker)`
    .ant-picker {
        height: 80%;
    }
`;

const TabsWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden; /* 탭이 영역을 벗어나지 않도록 설정 */
    width: 60%;
    height: 100%;
`;

const TabContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1;
    padding-top: 16px;
    padding-left: 14px;
    padding-right: 16px; /* 탭과 유저 정보 사이의 간격 */
    overflow: hidden;
`;

const StyledTabs = styled(Tabs)`
    .ant-tabs .ant-tabs-top{
        height: 100%;
    }



    .ant-tabs-tab .ant-tabs-tab-btn{
        font-size:1.1rem;
        font-weight: 600;
        color: white;
    }

    .ant-tabs-tab:hover .ant-tabs-tab-btn {
        font-size:20px;
        color: #66C65E; /* 탭 호버 시 레이블 색상 변경 */
    }

    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #0EAA00; /* 활성화된 탭 레이블의 색상 변경 */
    }

    .ant-tabs-nav {
        height:100%;
    }

    .ant-tabs-nav-wrap {
        height: 100%;
    }

    .ant-tabs-nav-list {
        height: 100% !important;
    }
`;

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
            flex-direction: row;
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
    const today = new Date();

    const defaultStartDate = dayjs(today).format('YYYY-MM-DD') + 'T00:00:00.000';
    const defaultEndDate = dayjs(today).format('YYYY-MM-DD') + 'T23:59:59.999';

    const [showMenuBar, setShowMenuBar] = useState(false);
    const [main, setMain] = useState(1);
    const [dateArray, setDateArray] = useState([]);
    const [serviceTab, setServiceTab] = useState("common");
    const [selectedPeriod, setSelectedPeriod] = useState({
        start: defaultStartDate,
        end: defaultEndDate,
    });

    const handleDateChange = (value) => {
        if (value) {
            const startDate = dayjs(value[0]).format('YYYY-MM-DD') + 'T00:00:00.000';
            const endDate = dayjs(value[1]).format('YYYY-MM-DD') + 'T23:59:59.999';

            setSelectedPeriod({
                start: startDate,
                end: endDate,
            });
        } else {
            setSelectedPeriod({
                start: defaultStartDate,
                end: defaultEndDate,
            });
        }
    }
    
    const handleTabChange = (key) => {
        console.log(key);
        setServiceTab(key);
    }

    const tabItems = [
        {
            key: "pgms_common_service",
            label: "공통",
        },
        {
            key: "pgms_equipment_service",
            label: "설비",
        },
        {
            key: "pgms_project_service",
            label: "프로젝트",
        },
        {
            key: "pgms_anal_servie",
            label: "분석 및 예측",
        },
        {
            key: "pgms_socekt_service",
            label: "채팅",
        },
    ]

    const handleMouseOver = () => {
        setShowMenuBar(true);
    }
    const handleMouseLeave = () => {
        setShowMenuBar(false);
    }

    const handleServerClick = () => {
        setMain(1);
    }

    const handleErrorLogClick = () => {
        setMain(2);
    }
    
    const getLast7Days = () => {
        const days = [];
        
    
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

    }, []);
    return (
            <div className={gridStyles.main_grid}>
                <div className={gridStyles.left_box}>
                    <Card onClick={handleServerClick} sx={{width:"90%", height:"18%", borderRadius:"10px", margin:"0 auto", backgroundColor:"rgb(36,46,59)", margin:"0 auto"}}>
                        <div className={gridStyles.left_icon}>
                            <img src={EcrLogo} alt='ecrlogo' style={{width:"100%", height:"100%"}}/>
                        </div>
                        <div className={gridStyles.left_icon_title}>
                            서버 관리
                        </div>
                    </Card>
                    <Card onClick={handleErrorLogClick} sx={{width:"90%", height:"18%", borderRadius:"10px", backgroundColor:"rgb(209,214,221)"}}>
                        <div className={gridStyles.left_icon}>
                            <img src={TerminalLogo} alt='terminal' style={{width:"100%", height:"100%"}} />
                        </div>
                        <div className={gridStyles.left_icon_title}>
                            예외 관리
                        </div>
                    </Card>
                </div>
                <div className={gridStyles.mid_box}> 
                    <div className={gridStyles.real_board}>
                        
                            {main === 1 ? (
                                // 서버관리
                                <Card sx={{width:"98%", height:"100%", borderRadius:"10px"}}>
                                    <div className={gridStyles.server_header}>
                                        서버관리
                                    </div>
                                    <div className={gridStyles.server_list}>
                                        <div className={gridStyles.server}>
                                            <div className={gridStyles.server_info}>
                                                <div className={gridStyles.server_logo}>
                                                    <img src={ApiLogo} style={{width:"100px", height:"100px"}}/>
                                                </div>
                                                <div className={gridStyles.server_text}>
                                                    공통 서비스
                                                </div>
                                                
                                            </div>
                                            <Divider orientation='vertical' variant='middle' flexItem/>
                                            <StyledRoot2 style={{width:"75%", height:"100%", overflow:"hidden"}}>
                                                <Swiper
                                                    spaceBetween={30}    // 슬라이드 사이의 간격
                                                    slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                                    // centeredSlides={true}
                                                    pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                                    navigation={true}           // 이전/다음 버튼 네비게이션
                                                    modules={[Navigation, Pagination]}
                                                >
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 50% <br/>
                                                                RAM : 47%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 35% <br/>
                                                                RAM : 63%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 82% <br/>
                                                                RAM : 78%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 13% <br/>
                                                                RAM : 24%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerAddLogo} style={{width:"60%", height:"60%", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}} />
                                                            <div style={{display:"flex", flexDirection:"row"}}>
                                                                <div className={gridStyles.container_status} >
                                                                    <IconButton color='success' >
                                                                        <AddCircleTwoTone />
                                                                    </IconButton>
                                                                </div>
                                                                <div className={gridStyles.container_status} >
                                                                    <IconButton color='error' >
                                                                        <RemoveCircleTwoTone />
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                </Swiper>
                                            </StyledRoot2>
                                        </div>
                                        <Divider />
                                        <div className={gridStyles.server}>
                                            <div className={gridStyles.server_info}>
                                                <div className={gridStyles.server_logo}>
                                                    <img src={ApiLogo} style={{width:"100px", height:"100px"}}/>
                                                </div>
                                                <div className={gridStyles.server_text}>
                                                    설비 서비스
                                                </div>
                                                
                                            </div>
                                            <Divider orientation='vertical' variant='middle' flexItem/>
                                            <StyledRoot2 style={{width:"75%", height:"100%", overflow:"hidden"}}>
                                                <Swiper
                                                    spaceBetween={30}    // 슬라이드 사이의 간격
                                                    slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                                    // centeredSlides={true}
                                                    pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                                    navigation={true}           // 이전/다음 버튼 네비게이션
                                                    modules={[Navigation, Pagination]}
                                                >
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 50% <br/>
                                                                RAM : 47%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 13% <br/>
                                                                RAM : 24%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerAddLogo} style={{width:"60%", height:"60%", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}} />
                                                            <div style={{display:"flex", flexDirection:"row"}}>
                                                                <div className={gridStyles.container_status} >
                                                                    <IconButton color='success' >
                                                                        <AddCircleTwoTone />
                                                                    </IconButton>
                                                                </div>
                                                                <div className={gridStyles.container_status} >
                                                                    <IconButton color='error' >
                                                                        <RemoveCircleTwoTone />
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                </Swiper>
                                            </StyledRoot2>
                                        </div>
                                        <Divider />
                                        <div className={gridStyles.server}>
                                            <div className={gridStyles.server_info}>
                                                <div className={gridStyles.server_logo}>
                                                    <img src={ApiLogo} style={{width:"100px", height:"100px"}}/>
                                                </div>
                                                <div className={gridStyles.server_text}>
                                                    프로젝트 서비스
                                                </div>
                                                
                                            </div>
                                            <Divider orientation='vertical' variant='middle' flexItem/>
                                            <StyledRoot2 style={{width:"75%", height:"100%", overflow:"hidden"}}>
                                                <Swiper
                                                    spaceBetween={30}    // 슬라이드 사이의 간격
                                                    slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                                    // centeredSlides={true}
                                                    pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                                    navigation={true}           // 이전/다음 버튼 네비게이션
                                                    modules={[Navigation, Pagination]}
                                                >
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 13% <br/>
                                                                RAM : 24%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerAddLogo} style={{width:"60%", height:"60%", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}} />
                                                            <div style={{display:"flex", flexDirection:"row"}}>
                                                                <div className={gridStyles.container_status} >
                                                                    <IconButton color='success' >
                                                                        <AddCircleTwoTone />
                                                                    </IconButton>
                                                                </div>
                                                                <div className={gridStyles.container_status} >
                                                                    <IconButton color='error' >
                                                                        <RemoveCircleTwoTone />
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                </Swiper>
                                            </StyledRoot2>
                                        </div>
                                        <Divider />
                                        <div className={gridStyles.server}>
                                            <div className={gridStyles.server_info}>
                                                <div className={gridStyles.server_logo}>
                                                    <img src={ApiLogo} style={{width:"100px", height:"100px"}}/>
                                                </div>
                                                <div className={gridStyles.server_text}>
                                                    분석 & 예측 서비스
                                                </div>
                                                
                                            </div>
                                            <Divider orientation='vertical' variant='middle' flexItem/>
                                            <StyledRoot2 style={{width:"75%", height:"100%", overflow:"hidden"}}>
                                                <Swiper
                                                    spaceBetween={30}    // 슬라이드 사이의 간격
                                                    slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                                    // centeredSlides={true}
                                                    pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                                    navigation={true}           // 이전/다음 버튼 네비게이션
                                                    modules={[Navigation, Pagination]}
                                                >
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 35% <br/>
                                                                RAM : 63%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 82% <br/>
                                                                RAM : 78%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 13% <br/>
                                                                RAM : 24%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerAddLogo} style={{width:"60%", height:"60%", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}} />
                                                            <div style={{display:"flex", flexDirection:"row"}}>
                                                                <div className={gridStyles.container_status} >
                                                                    <IconButton color='success' >
                                                                        <AddCircleTwoTone />
                                                                    </IconButton>
                                                                </div>
                                                                <div className={gridStyles.container_status} >
                                                                    <IconButton color='error' >
                                                                        <RemoveCircleTwoTone />
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                </Swiper>
                                            </StyledRoot2>
                                        </div>
                                        <Divider />
                                        <div className={gridStyles.server}>
                                            <div className={gridStyles.server_info}>
                                                <div className={gridStyles.server_logo}>
                                                    <img src={ApiLogo} style={{width:"100px", height:"100px"}}/>
                                                </div>
                                                <div className={gridStyles.server_text}>
                                                    채팅 서비스
                                                </div>
                                                
                                            </div>
                                            <Divider orientation='vertical' variant='middle' flexItem/>
                                            <StyledRoot2 style={{width:"75%", height:"100%", overflow:"hidden"}}>
                                                <Swiper
                                                    spaceBetween={30}    // 슬라이드 사이의 간격
                                                    slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                                    // centeredSlides={true}
                                                    pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                                    navigation={true}           // 이전/다음 버튼 네비게이션
                                                    modules={[Navigation, Pagination]}
                                                >
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 50% <br/>
                                                                RAM : 47%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 35% <br/>
                                                                RAM : 63%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 82% <br/>
                                                                RAM : 78%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerLogo} style={{width:"60%", height:"60%"}}/>
                                                            <div className={gridStyles.container_status}>
                                                                CPU : 13% <br/>
                                                                RAM : 24%
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                    <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                        <div className={gridStyles.container}>
                                                            <img src={ContainerAddLogo} style={{width:"60%", height:"60%", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}} />
                                                            <div style={{display:"flex", flexDirection:"row"}}>
                                                                <div className={gridStyles.container_status} >
                                                                    <IconButton color='success' >
                                                                        <AddCircleTwoTone />
                                                                    </IconButton>
                                                                </div>
                                                                <div className={gridStyles.container_status} >
                                                                    <IconButton color='error' >
                                                                        <RemoveCircleTwoTone />
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                </Swiper>
                                            </StyledRoot2>
                                        </div>
                                        <Divider />
                                    </div>
                                </Card>
                            ) : (
                                // 로그관리
                                <Card sx={{width:"98%", height:"100%", borderRadius:"10px", backgroundColor:"rgb(30,30,30)", border:"3px solid rgb(100,100,100)", display:"flex", flexDirection:"column"}}>
                                    <div className={gridStyles.log_header}>
                                        <div style={{display:"flex", flexDirection:"row", gap:"2rem", alignItems:"center"}}>
                                            <ConfigProvider
                                            locale={{locale:"ko"}}
                                            theme={{
                                                components:{
                                                    DatePicker:{
                                                        // activeBorderColor: "#66C65E",
                                                        activeBorderColor:"#0EAA00",
                                                        cellActiveWithRangeBg : "#c3e59e",
                                                        cellRangeBorderColor:"#0EAA00",
                                                        hoverBorderColor:"#0EAA00",
                                                        multipleItemBg:"#0EAA00",
                                                        addonBg:"#0EAA00",
                                                        multipleItemBorderColor:"#0EAA00"

                                                    },
                                                },
                                                token:{
                                                    colorPrimary: "#0EAA00",
                                                    fontFamily:"SUITE-Regular",
                                                }
                                            }}>
                                                <TabsWrapper>
                                                    <TabContainer>
                                                        <StyledTabs 
                                                            defaultActiveKey='common'
                                                            onChange={handleTabChange}
                                                            items={tabItems}
                                                        />
                                                    </TabContainer>
                                                </TabsWrapper>
                                                <StyledDatePicker 
                                                    defaultValue={[dayjs(today), dayjs(today)]}
                                                    onChange={handleDateChange}
                                                />
                                            </ConfigProvider>
                                        </div>
                                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:"1rem", paddingRight:"1rem"}}>
                                            <div style={{width:"20px", height:"20px", borderRadius:"50%", backgroundColor:"rgb(245,191,79)", textAlign:"center", verticalAlign:"middle", color:"white", fontWeight:"bold"}}></div>
                                            <div style={{width:"20px", height:"20px", borderRadius:"50%", backgroundColor:"rgb(97,197,84)", textAlign:"center", verticalAlign:"middle", color:"white", fontWeight:"bold"}}></div>
                                            <div style={{width:"20px", height:"20px", borderRadius:"50%", backgroundColor:"rgb(236,106,94)", textAlign:"center", verticalAlign:"middle", color:"white", fontWeight:"bold"}}></div>
                                        </div>
                                    </div>
                                    <div className={gridStyles.log_content}>
                                        
                                    </div>
                                </Card>
                            )}
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
                                        <Link to="/um">
                                        <Card sx={{backgroundColor:"rgb(196,247,254)", width:"4rem", height:"4rem", display:"flex",justifyContent:"center", alignItems:"center", borderRadius:"10px"}}>
                                            <ManageAccounts fontSize='large' sx={{color:"white"}}/>
                                        </Card>
                                        </Link>
                                        <Link to="/mm">
                                        <Card sx={{backgroundColor:"rgb(253,241,187)", width:"4rem", height:"4rem", display:"flex",justifyContent:"center", alignItems:"center", borderRadius:"10px"}}>
                                            <Menu fontSize="large" sx={{color:"white"}} />
                                        </Card>
                                        </Link>
                                        <Link to="/mal">
                                        <Card sx={{backgroundColor:"rgb(213,212,249)", width:"4rem", height:"4rem", display:"flex",justifyContent:"center", alignItems:"center", borderRadius:"10px"}}>
                                            <Terminal fontSize='large' sx={{color:"white"}} />
                                        </Card>
                                        </Link>
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
                                                        data: [4, 10, 6, 1, 5, 6, 6] // 차트 데이터
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
                                                        data: [2, 15, 6, 9, 6, 7, 2] // 차트 데이터
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
                                    </SwiperSlide>
                                </Swiper>
                            </StyledRoot>
                        </Card>
                    </div>
                </div>
            </div>
    );
}