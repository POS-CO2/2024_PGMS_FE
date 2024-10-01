import React, { useState, useEffect } from 'react';
import * as gridStyles from './assets/css/grid.css'
import { Gauge, gaugeClasses } from '@mui/x-charts';
import { Card, CircularProgress, IconButton } from '@mui/material';
import { CustomBarChart } from './Chart';
import DataSaverOffOutlinedIcon from '@mui/icons-material/DataSaverOffOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import { GppGoodTwoTone, NotificationsActive, NotificationsOff, SdCardAlertTwoTone, Star, WarningTwoTone } from '@mui/icons-material';
import { Transfer, Select, Progress, ConfigProvider } from 'antd';
import axiosInstance from './utils/AxiosInstance';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import Swal from 'sweetalert2';

const StyledRoot = styled.div`
    .swiper {
        &.swiper-initialized {
            width: 100%;
            height: 100%;
        }
        &-wrapper {
            display: flex;
            width: 100rem;
            height: 100%;
        }
        &-slide {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 90%;
            margin: auto 0;
        },
        &-slide-active{
        }
        &-slide-next {
            width: 100%;
            height: 85%;
            margin: auto 0;
            
        }
        &-slide-prev {
            width: 100%;
            height: 85%;
            margin: auto 0;
            
        }
        &-button-next {
            z-idnex: 1;
        }
    }    
`;

const StyledRootColumn = styled.div`
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

const Overlay = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검정색
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10001, // 스피너가 위에 보이도록 설정
});

export default function Main() {

    const [mockData, setMockData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);
    const [myPjt, setMyPjt] = useState([]);
    const [selectedMyPjt, setSelectedMyPjt] = useState(null);
    const [scope, setScope] = useState([]);
    const [afterEmission, setAfterEmission] = useState([]);
    const [beforeEmission, setBeforeEmission] = useState([]);
    const [pjtStartYear, setPjtStartYear] = useState(0);
    const [pjtStartMonth, setPjtStartMonth] = useState(0);
    const [pjtEndYear, setPjtEndYear] = useState(0);
    const [pjtEndMonth, setPjtEndMonth] = useState(0);
    const [scopeOne, setScopeOne] = useState(0);
    const [scopeTwo, setScopeTwo] = useState(0);
    const [documentStatus, setDocumentStatus] = useState([]);
    const [dpPjt, setDpPjt] = useState([]);
    const [scopeOneData, setScopeOneData] = useState([]);
    const [scopeTwoData, setScopeTwoData] = useState([]);
    const [alarm, setAlarm] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    let today = new Date();
    let toYear = today.getFullYear();
    let toMonth = today.getMonth();
    
    const getMock = (ae,be) => {
        const tempTargetKeys = [];
        const tempMockData = [];
        const bae = ae.concat(be);
        bae.map(v => {
            const data = {
                key: [v.equipId, v.actvDataId],
                title: `${v.equipName} (${v.actvDataName})`,
                description: v.equipLibName,
                chosen: v.id != null,
            }
            if (data.chosen) {
                tempTargetKeys.push(data.key);
            }
            tempMockData.push(data);
        });
        setMockData(tempMockData);
        setTargetKeys(tempTargetKeys);
    };

    function calculateTotalMonths(startYear, startMonth, endYear, endMonth) {
        const yearDifference = endYear - startYear;
        
        const monthDifference = endMonth - startMonth;
        
        const totalMonths = (yearDifference * 12) + monthDifference + 1;
        
        return totalMonths;
    }

    useEffect(() => {
        const fetchData = async () => {
            try{
                const pjtResponse = await axiosInstance.get(`/pjt/my`);
                const myPjt = pjtResponse.data;
                setMyPjt(myPjt);
                

                if (myPjt.length > 0){
                    const initialAlarms = myPjt.map((data) => ({
                        id: data.id,
                        alarmYn: data.alarmYn,
                    }));
                    setAlarm(initialAlarms)
                    const initialPjt = myPjt[0];
                    setSelectedMyPjt(initialPjt);
                    setPjtStartYear(initialPjt.ctrtFrYear);
                    setPjtStartMonth(initialPjt.ctrtFrMth);
                    setPjtEndYear(initialPjt.ctrtToYear);
                    setPjtEndMonth(initialPjt.ctrtToMth);
                    const chartResponse = await axiosInstance.get(`/perf/pjt?pjtId=${initialPjt.pjtId}&year=${toYear}`);
                    const scope1Data = chartResponse.data.map(perf => perf.scope1 || null);
                    const scope2Data = chartResponse.data.map(perf => perf.scope2 || null);
                    const formattedChartPerfs = [
                        { data: scope1Data, stack: 'A', label: 'Scope 1' },
                        { data: scope2Data, stack: 'A', label: 'Scope 2' }
                    ];
                    setScope(formattedChartPerfs);
                    // 실적스코프 전월대비 구하기
                    setScopeOne(Math.floor(scope1Data[toMonth-1] / scope1Data[toMonth-2] * 100 - 100) ?? 0);
                    setScopeOneData([scope1Data[toMonth-2] ?? 0, scope1Data[toMonth-1] ?? 0]);
                    setScopeTwo(Math.floor(scope2Data[toMonth-1] / scope2Data[toMonth-2] * 100 - 100) ?? 0);
                    setScopeTwoData([scope2Data[toMonth-2] ?? 0, scope2Data[toMonth-1] ?? 0]);
                    
                    // 증빙자료 제출현황 3개월치 구하기
                    const documentResponse = await axiosInstance.get(`/equip/document-status?pjtId=${initialPjt.pjtId}`);
                    setDocumentStatus(documentResponse.data);
                    // 배출원 지정 
                    const emissionResponse = await axiosInstance.get(`/equip/emission?projectId=${initialPjt.pjtId}`);
                    const ae = emissionResponse.data;
                    setAfterEmission(ae);
                    const beforeEmissionResponse = await axiosInstance.get(`/equip/emission/cand?projectId=${initialPjt.pjtId}`);
                    const be = beforeEmissionResponse.data;
                    setBeforeEmission(be);
                    getMock(ae, be);
                    
                }
            }
            catch(error){
                console.error(error);
            }
        };
        fetchData();
        
    }, []);

    useEffect(() => {
        const fetchMyPjt = async () => {
            setIsLoading(true)
            const pjtResponse = await axiosInstance.get(`/pjt/my`);
            const myPjt = pjtResponse.data;
            setMyPjt(myPjt);
        };
        const fetchSelectedProjectData = async () => {
            if (!selectedMyPjt) return;
            setPjtStartYear(selectedMyPjt.ctrtFrYear);
            setPjtStartMonth(selectedMyPjt.ctrtFrMth);
            setPjtEndYear(selectedMyPjt.ctrtToYear);
            setPjtEndMonth(selectedMyPjt.ctrtToMth);

            try {
                const [chartResponse, documentResponse, emissionResponse, beforeEmissionResponse] = await Promise.all([
                    axiosInstance.get(`/perf/pjt?pjtId=${selectedMyPjt.pjtId}&year=${toYear}`),
                    axiosInstance.get(`/equip/document-status?pjtId=${selectedMyPjt.pjtId}`),
                    axiosInstance.get(`/equip/emission?projectId=${selectedMyPjt.pjtId}`),
                    axiosInstance.get(`/equip/emission/cand?projectId=${selectedMyPjt.pjtId}`)
                ]);
    
                // Process chart data
                const scope1Data = chartResponse.data.map(perf => perf.scope1 || null);
                const scope2Data = chartResponse.data.map(perf => perf.scope2 || null);
                const formattedChartPerfs = [
                    { data: scope1Data, stack: 'A', label: 'Scope 1' },
                    { data: scope2Data, stack: 'A', label: 'Scope 2' }
                ];
                setScope(formattedChartPerfs);
                setScopeOne(Math.floor(scope1Data[toMonth - 1] / scope1Data[toMonth - 2] * 100 - 100) ?? 0);
                setScopeOneData([scope1Data[toMonth - 2] ?? 0, scope1Data[toMonth - 1] ?? 0]);
                setScopeTwo(Math.floor(scope2Data[toMonth - 1] / scope2Data[toMonth - 2] * 100 - 100) ?? 0);
                setScopeTwoData([scope2Data[toMonth - 2] ?? 0, scope2Data[toMonth - 1] ?? 0]);
    
                // Set document and emission data
                setDocumentStatus(documentResponse.data);
                setAfterEmission(emissionResponse.data);
                setBeforeEmission(beforeEmissionResponse.data);
    
                // Update mock data
                getMock(emissionResponse.data, beforeEmissionResponse.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMyPjt();
        fetchSelectedProjectData();
    }, [selectedMyPjt]);

    useEffect(() => {
        const fetchEmission = async () => {
            if (!selectedMyPjt) return;
            try {
                const emissionResponse = await axiosInstance.get(`/equip/emission?projectId=${selectedMyPjt.pjtId}`);
                const ae = emissionResponse.data;
                if (JSON.stringify(ae) !== JSON.stringify(afterEmission)) {
                    setAfterEmission(ae);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchEmission();
    }, [targetKeys]);

    const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

    const handleChange = async (newTargetKeys, direction, moveKeys) => {
        let swalOptions = {
            confirmButtonText: '확인'
        };
        if (direction === "right") {
            for (const key of moveKeys){
                const formDatas = [{
                    equipId: key[0],
                    actvDataId: key[1],
                }]
                try {
                    const {data} = await axiosInstance.post(`/equip/emission`, formDatas);    
                    swalOptions.title = '성공!',
                    swalOptions.text = `배출원이 성공적으로 등록되었습니다.`;
                    swalOptions.icon = 'success';
                    setTargetKeys(newTargetKeys);
                } catch (error) {
                    console.error(error);
                    swalOptions.title = '실패!',
                    swalOptions.text = error.response.data.message,
                    swalOptions.icon = 'error';
                }
                
            }
        }
        else {
            for (const key of moveKeys){
                const deleteData = afterEmission.find(item => item.equipId === key[0] && item.actvDataId === key[1]);
                if (deleteData) {
                    try {
                        const {data} = await axiosInstance.delete(`/equip/emission?id=${deleteData.id}`);    
                        swalOptions.title = '성공!',
                        swalOptions.text = `배출원이 성공적으로 삭제되었습니다.`;
                        swalOptions.icon = 'success';
                        setTargetKeys(newTargetKeys);
                    } catch (error) {
                        swalOptions.title = '실패!',
                        swalOptions.text = error.response.data.message,
                        swalOptions.icon = 'error';
                    }
                }
                else{
                    console.error("no id");
                }
                
            }
        }
        Swal.fire(swalOptions);

    };

    const handleDropClick = (e) => {
        const selectedItem = myPjt.find(item => item.pjtName === e);
        setSelectedMyPjt(selectedItem);
    }


    const handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    const settings = {
        width: 200,
        height: 200,
    };

    const twoColors = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };

    const progressPjt = () => {
        const entirePjt = calculateTotalMonths(pjtStartYear, pjtStartMonth, pjtEndYear, pjtEndMonth);
        let nowPjt = calculateTotalMonths(pjtStartYear, pjtStartMonth, toYear, toMonth);
        let result = Math.floor(nowPjt / entirePjt * 100);
        return result;
    }

    const handleSetDpPjt = async (e) => {
        let swalOptions = {
            confirmButtonText: '확인'
        };
        const formData = {
            pjtId : e.pjtId,
        }
        try {
            const {data} = await axiosInstance.patch(`/pjt/selected`, formData);
            swalOptions.title = '성공!',
            swalOptions.text = `대표프로젝트가 성공적으로 설정되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            swalOptions.title = '실패!',
            swalOptions.text = `${error.response.data.message}`;
            swalOptions.icon = 'error';
        }
        setDpPjt(e);
        setSelectedMyPjt(e);
        Swal.fire(swalOptions);
    }
    
    const handleSetAlarm = async (e) => {    
        try {
            const request = await axiosInstance.patch(`/pjt/my/alarm?projectUserId=${e.id}`);
            setAlarm((prev) => 
                prev.map((item) => 
                    item.id === e.id 
                    ? { ...item, alarmYn: item.alarmYn === 'y' ? 'n' : 'y'} 
                    : item
                )
            );

        } catch (error) {
            console.error("error");
        }
    }
    return (
        <>
            <div className={gridStyles.grid_container} >
                <Card className={gridStyles.box1} sx={{borderRadius:"10px", color:"white"}}>
                    <div className={gridStyles.box1_header}>
                        {/* 로고  */}
                        <div className={gridStyles.box1_logo}>
                            PGMS
                        </div>
                        <ConfigProvider theme={{token:{fontFamily:"SUITE-Regular", fontSize:"1rem"}}}>
                        <Select defaultValue={selectedMyPjt?.pjtName} value={selectedMyPjt?.pjtName} onChange={(e) => handleDropClick(e)} style={{width:"20%", height:"2.5rem", fontSize:"4rem", color:"rgb(55, 57, 78)"}}>
                            {myPjt.map((pjt) => (
                                <Select.Option key={pjt.id} value={pjt.pjtName} >
                                {pjt.pjtName}
                                </Select.Option>
                            ))}
                        </Select>
                        </ConfigProvider>
                    </div>
                    <div className={gridStyles.box1_comp}>
                        <Card className={gridStyles.box1_1} sx={{borderRadius:"10px"}} >
                            <div className={gridStyles.box1_1_head}>
                                <div className={gridStyles.box1_1_logo}>
                                    <DataSaverOffOutlinedIcon fontSize='large' sx={{marginRight:"0.5rem"}}/>프로젝트 진행현황
                                </div>
                                <Progress percent={progressPjt()} strokeColor={twoColors} style={{marginBottom:"2rem"}}/>
                                <div className={gridStyles.box1_1_logo}>
                                    <LeaderboardOutlinedIcon fontSize='large' sx={{marginRight:"0.5rem"}}/>전월 대비 실적Scope
                                </div>
                                <div className={gridStyles.box1_1_gauge}>
                                    <div style={{height:"100%"}}>
                                        {
                                            isNaN(scopeOne) ? (
                                                <div style={{display:"flex", flexDirection:"row",width:"100%", height:"100%", justifyContent:"space-around", alignItems:"center", fontSize:"3rem", fontWeight:"bold", color:"rgb(55, 57, 78)", gap:"1rem"}}>
                                                    <SdCardAlertTwoTone fontSize='large' sx={{color:"rgb(55,57,78)"}} />
                                                    <div>
                                                        No Data
                                                    </div>
                                                </div>
                                            ) : (
                                                scopeOne >= 0 ? (
                                                    <div style={{display:"flex", flexDirection:"row",width:"100%", height:"100%", justifyContent:"space-around", alignItems:"center", fontSize:"3rem", fontWeight:"bold", color:"red", gap:"1rem"}}>
                                                        <WarningTwoTone fontSize='large' sx={{color:"red"}}/>
                                                        <div>
                                                        +{scopeOne}%
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div style={{display:"flex", flexDirection:"row",width:"100%", height:"100%", justifyContent:"space-around", alignItems:"center", fontSize:"3rem", fontWeight:"bold", color:"#0eaa00", gap:"1rem"}}>
                                                        <GppGoodTwoTone fontSize='large' sx={{color:"#0eaa00"}} />
                                                        <div>
                                                            {scopeOne}%
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        }
                                        <div className={gridStyles.box1_1_logo}>
                                            <SpeedIcon fontSize='large' sx={{marginRight:"0.5rem"}}/>실적Scope1
                                        </div>
                                    </div>
                                    <div style={{height:"100%"}}>
                                        {
                                            isNaN(scopeTwo) ? (
                                                <div style={{display:"flex", flexDirection:"row",width:"100%", height:"100%", justifyContent:"space-around", alignItems:"center", fontSize:"3rem", fontWeight:"bold", color:"rgb(55, 57, 78)", gap:"1rem"}}>
                                                    <SdCardAlertTwoTone fontSize='large' sx={{color:"rgb(55,57,78)"}} />
                                                    <div>
                                                        No Data
                                                    </div>
                                                </div>
                                            ) : (
                                                scopeTwo >= 0 ? (
                                                    <div style={{display:"flex", flexDirection:"row",width:"100%", height:"100%", justifyContent:"space-around", alignItems:"center", fontSize:"3rem", fontWeight:"bold", color:"red", gap:"1rem"}}>
                                                        <WarningTwoTone fontSize='large' sx={{color:"red"}}/>
                                                        <div>
                                                        +{scopeTwo}%
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div style={{display:"flex", flexDirection:"row",width:"100%", height:"100%", justifyContent:"space-around", alignItems:"center", fontSize:"3rem", fontWeight:"bold", color:"#0eaa00", gap:"1rem"}}>
                                                        <GppGoodTwoTone fontSize='large' sx={{color:"#0eaa00"}} />
                                                        <div>
                                                            {scopeTwo}%
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        }
                                    <div className={gridStyles.box1_1_logo}>
                                        <SpeedIcon fontSize='large' sx={{marginRight:"0.5rem"}}/>실적Scope2
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card className={gridStyles.box1_2} sx={{borderRadius:"10px", backgroundColor: "rgb(23, 27, 38)"}}>
                            <CustomBarChart data={scope} 
                            />
                        </Card>
                    </div>
                </Card>
                <div className={gridStyles.box2}>
                    {/* 대표프로젝트설정 */}
                    <div className={gridStyles.box2_2}>
                        <Card sx={{borderRadius:"10px", height:"100%"}}>
                            <div className={gridStyles.box2_2_title}>
                                대표 프로젝트 설정
                            </div>
                            <div className={gridStyles.box2_2_pjt}>
                                <StyledRootColumn style={{width:"100%", height:"100%", overflow:"hidden"}}>
                                    <Swiper
                                        direction='vertical'
                                        spaceBetween={30}    // 슬라이드 사이의 간격
                                        slidesPerView={2}     // 화면에 보여질 슬라이드 수
                                        pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                        navigation={true}           // 이전/다음 버튼 네비게이션
                                        modules={[Navigation, Pagination]}
                                    >
                                        {myPjt.map((data, idx) => {
                                            
                                            const matchingAlarm = alarm.find(e => e.id === data.id)
                                            
                                            return (
                                            <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                <Card sx={{backgroundColor:"white", width:"90%", height:"100%", margin:"1rem auto", borderRadius:"15px", display:"flex", flexDirection:"column", backgroundColor:"rgb(241,244,248)"}}>
                                                    <div className={gridStyles.star}>
                                                        {idx === 0 ? (
                                                            <IconButton>
                                                                <Star fontSize='large' sx={{color:"#ffd700"}} />
                                                            </IconButton>
                                                        ): (
                                                            <IconButton onClick={() => handleSetDpPjt(data)}>
                                                                <Star fontSize='large' sx={{color:"gray"}}/>
                                                            </IconButton>
                                                        )}
                                                        {matchingAlarm?.alarmYn === "y"? (
                                                            <IconButton onClick={() => handleSetAlarm(data)}>
                                                                <NotificationsActive fontSize='large' sx={{color:"gold"}}/>
                                                            </IconButton>
                                                        ) : (
                                                            <IconButton onClick={() => handleSetAlarm(data)}>
                                                                <NotificationsOff fontSize='large' />
                                                            </IconButton>
                                                        )}
                                                    </div>
                                                    <div className={gridStyles.dp_pjt}>
                                                        {`${data.pjtName}`}
                                                    </div>
                                                    <div className={gridStyles.dp_pjt_period}>
                                                        {`${data.ctrtFrYear}년 ${data.ctrtFrMth}월 ~ ${data.ctrtToYear}년 ${data.ctrtToMth}월`}
                                                    </div>
                                                </Card>    
                                            </SwiperSlide>
                                        )})}
                                        <SwiperSlide>
                                        </SwiperSlide>
                                    </Swiper>
                                </StyledRootColumn>
                            </div>
                        </Card>
                    </div>
                    <div className={gridStyles.box2_1}>
                        <div className={gridStyles.box2_1_1}>
                            <Card 
                                className={gridStyles.box2_1_1_card}
                                sx={{
                                borderRadius:"15px",
                                height:"100%", 
                                width:"100%",
                                display:"flex"
                                }}>
                                <div className={gridStyles.box2_1_1_1} style={{background:"linear-gradient(to right, #38b0a8, #14a492)"}}>
                                    <div className={gridStyles.box1_1_logo} style={{color:'white', fontSize:"1rem", paddingLeft:"2rem"}}>
                                        증빙자료 제출 현황
                                    </div>
                                </div>
                                <div className={gridStyles.box2_swap}>
                                <StyledRoot style={{height:"80%", width:"100%", margin:"0 auto", overflow: "hidden"}}>
                                <Swiper
                                    dir="rtl"
                                    spaceBetween={100}    // 슬라이드 사이의 간격
                                    slidesPerView={2}     // 화면에 보여질 슬라이드 수
                                    centeredSlides={true}
                                    pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                    navigation={true}           // 이전/다음 버튼 네비게이션
                                    modules={[Navigation, Pagination]}
                                    >
                                    {documentStatus.map(document => (
                                        <SwiperSlide style={{width:"100%", alignContent:"center"}}>
                                            <div style={{ backgroundColor: 'white', width:'60rem', height: '100%', borderRadius:"15px", boxShadow:"0 0 10px"}}>
                                                <Gauge 
                                                    {...settings}
                                                    value={document.currentCnt}
                                                    valueMax={document.totalCnt}
                                                    cornerRadius="50%"
                                                    sx={(theme) => ({
                                                        [`& .${gaugeClasses.valueText}`]: {
                                                        fontSize: "1.5rem",
                                                        fontWeight:"bold",
                                                        color:"rgb(55, 57, 78)",
                                                        },
                                                        [`& .${gaugeClasses.valueArc}`]: {
                                                        fill: '#008CFF',
                                                        },
                                                        [`& .${gaugeClasses.referenceArc}`]: {
                                                        fill: theme.palette.text.disabled,
                                                        },
                                                        margin: "1rem auto",
                                                    })}
                                                    text={
                                                        ({ value, valueMax }) => `${valueMax} / ${value}`
                                                    }
                                                />
                                                <div style={{fontSize:"2rem", fontWeight:"bold", textAlign:"center", marginTop:"1rem", color:"rgb(55, 57, 78)"}}>
                                                {`${document.year}년 ${document.mth}월`}
                                                <br/>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                    
                                    </Swiper>
                                    </StyledRoot>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className={gridStyles.box2_3}>
                        <div className={gridStyles.box2_3_1}>
                            <Card sx={{borderRadius:"10px", height:"100%", display:"flex", justifyContent:"center", alignContent:"center", flexDirection:"column", gap:"2%"}}>
                                <div style={{
                                    width:"100%",
                                    height:"10%", 
                                    background:"linear-gradient(to right, rgb(74, 122, 230), rgb(42, 69, 178))", 
                                    display:"flex",
                                    justifyContent:"space-between",
                                    fontWeight:"bold",
                                    alignItems:"center",
                                    padding:"0 2rem"
                                }}>
                                    <div style={{width:"20%", color:"white", fontSize:"1rem"}}>
                                        배출원 지정
                                    </div>
                                </div>
                                <div style={{margin:"0 auto", height:"90%"}}>
                                    <ConfigProvider theme={{token:{fontFamily:"SUITE-Regular", color:"rgb(55, 57, 78)"}}} >
                                    <Transfer
                                        dataSource={mockData}
                                        showSearch
                                        titles={["미지정 배출원","지정 배출원"]}
                                        filterOption={filterOption}
                                        targetKeys={targetKeys}
                                        onChange={handleChange}
                                        onSearch={handleSearch}
                                        render={(item) => item.title}
                                        style={{
                                            height:"95%",
                                        }}
                                        listStyle={{
                                            height:"100%",
                                            width:250,
                                            textOverflow:"ellipsis",
                                        }}
                                    />
                                    </ConfigProvider>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
                {isLoading && 
                    <Overlay >
                        <CircularProgress />
                    </Overlay>
                }
            </div>
            
        </>
    );
}