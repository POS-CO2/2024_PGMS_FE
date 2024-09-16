import React, { useState, useRef, useEffect } from 'react';
import * as gridStyles from './assets/css/gridAdmin.css';
import { Card, Divider, IconButton } from '@mui/material';
import { Code, Menu, ManageAccounts, Terminal, PeopleAlt, Engineering, Business, Settings, Today, AddCircleTwoTone } from '@mui/icons-material';
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
    
    const [showMenuBar, setShowMenuBar] = useState(false);
    const [main, setMain] = useState(1);
    const [dateArray, setDateArray] = useState([]);

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
                                                            <div className={gridStyles.container_status} >
                                                                <IconButton color='success' >
                                                                    <AddCircleTwoTone />
                                                                </IconButton>
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
                                                            <div className={gridStyles.container_status} >
                                                                <IconButton color='success' >
                                                                    <AddCircleTwoTone />
                                                                </IconButton>
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
                                                            <div className={gridStyles.container_status} >
                                                                <IconButton color='success' >
                                                                    <AddCircleTwoTone />
                                                                </IconButton>
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
                                                            <div className={gridStyles.container_status} >
                                                                <IconButton color='success' >
                                                                    <AddCircleTwoTone />
                                                                </IconButton>
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
                                                            <div className={gridStyles.container_status} >
                                                                <IconButton color='success' >
                                                                    <AddCircleTwoTone />
                                                                </IconButton>
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
                                        <div></div>
                                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:"1rem", paddingRight:"1rem"}}>
                                            <div style={{width:"20px", height:"20px", borderRadius:"50%", backgroundColor:"rgb(245,191,79)", textAlign:"center", verticalAlign:"middle", color:"white", fontWeight:"bold"}}></div>
                                            <div style={{width:"20px", height:"20px", borderRadius:"50%", backgroundColor:"rgb(97,197,84)", textAlign:"center", verticalAlign:"middle", color:"white", fontWeight:"bold"}}></div>
                                            <div style={{width:"20px", height:"20px", borderRadius:"50%", backgroundColor:"rgb(236,106,94)", textAlign:"center", verticalAlign:"middle", color:"white", fontWeight:"bold"}}></div>
                                        </div>
                                    </div>
                                    <div className={gridStyles.log_content}>
                                    `2024-09-12T04:36:37.657Z ERROR 1474668 --- [nio-8080-exec-4] pgms.controller.ControllerAdvice         : 에러 메시지: class java.lang.String cannot be cast to class pgms.domain.vo.UserVo (java.lang.String is in module java.base of loader 'bootstrap'; pgms.domain.vo.UserVo is in unnamed module of loader org.springframework.boot.loader.LaunchedURLClassLoader @6d03e736)

java.lang.ClassCastException: class java.lang.String cannot be cast to class pgms.domain.vo.UserVo (java.lang.String is in module java.base of loader 'bootstrap'; pgms.domain.vo.UserVo is in unnamed module of loader org.springframework.boot.loader.LaunchedURLClassLoader @6d03e736)
	at pgms.controller.SystemController.updateMenu(SystemController.java:492) ~[classes!/:0.0.1-SNAPSHOT]
	at jdk.internal.reflect.GeneratedMethodAccessor284.invoke(Unknown Source) ~[na:na]
	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[na:na]
	at java.base/java.lang.reflect.Method.invoke(Method.java:569) ~[na:na]
	at org.springframework.aop.support.AopUtils.invokeJoinpointUsingReflection(AopUtils.java:343) ~[spring-aop-6.0.11.jar!/:6.0.11]
	at org.springframework.aop.framework.ReflectiveMethodInvocation.invokeJoinpoint(ReflectiveMethodInvocation.java:196) ~[spring-aop-6.0.11.jar!/:6.0.11]
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163) ~[spring-aop-6.0.11.jar!/:6.0.11]
	at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:756) ~[spring-aop-6.0.11.jar!/:6.0.11]
	at org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:97) ~[spring-aop-6.0.11.jar!/:6.0.11]
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184) ~[spring-aop-6.0.11.jar!/:6.0.11]
	at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:756) ~[spring-aop-6.0.11.jar!/:6.0.11]
	at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:708) ~[spring-aop-6.0.11.jar!/:6.0.11]
	at pgms.controller.SystemController$$SpringCGLIB$$0.updateMenu() ~[classes!/:0.0.1-SNAPSHOT]
	at jdk.internal.reflect.GeneratedMethodAccessor284.invoke(Unknown Source) ~[na:na]
	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[na:na]
	at java.base/java.lang.reflect.Method.invoke(Method.java:569) ~[na:na]
	at org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:205) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:150) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:118) ~[spring-webmvc-6.0.11.jar!/:6.0.11]
	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:884) ~[spring-webmvc-6.0.11.jar!/:6.0.11]
	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:797) ~[spring-webmvc-6.0.11.jar!/:6.0.11]
	at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87) ~[spring-webmvc-6.0.11.jar!/:6.0.11]
	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1081) ~[spring-webmvc-6.0.11.jar!/:6.0.11]
	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:974) ~[spring-webmvc-6.0.11.jar!/:6.0.11]
	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1011) ~[spring-webmvc-6.0.11.jar!/:6.0.11]
	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:888) ~[spring-webmvc-6.0.11.jar!/:6.0.11]
	at jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:205) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:51) ~[tomcat-embed-websocket-10.1.12.jar!/:na]
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:174) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:110) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:174) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:101) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:174) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$3(FilterChainProxy.java:231) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:365) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:100) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:126) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:120) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:131) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:85) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:179) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at pgms.config.security.filter.JwtAuthenticationFilter.doFilterInternal(JwtAuthenticationFilter.java:50) ~[classes!/:0.0.1-SNAPSHOT]
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:101) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:107) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:93) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:374) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:233) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:191) ~[spring-security-web-6.1.3.jar!/:6.1.3]
	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:352) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:268) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:174) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:174) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:174) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116) ~[spring-web-6.0.11.jar!/:6.0.11]
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:174) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:149) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:166) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:90) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:482) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:93) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:341) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:391) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:894) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1740) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61) ~[tomcat-embed-core-10.1.12.jar!/:na]
	at java.base/java.lang.Thread.run(Thread.java:840) ~[na:na]
`
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