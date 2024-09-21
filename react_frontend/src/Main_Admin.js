import React, { useState, useRef, useEffect } from 'react';
import * as gridStyles from './assets/css/grid.css'
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import earthTextureUrl from './assets/images/earth.jpg';
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState, Gauge, gaugeClasses} from '@mui/x-charts';
import { Card,CardContent, FormControl, InputLabel, MenuItem, Chip, ButtonGroup, Button, IconButton } from '@mui/material';
import { CustomBarChart, CustomLineChart } from './Chart';
import { temp_data } from './assets/json/chartData';
import SsidChartRoundedIcon from '@mui/icons-material/SsidChartRounded';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DataSaverOffOutlinedIcon from '@mui/icons-material/DataSaverOffOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import { ArrowBackIos, ArrowForward, ArrowForwardIos, Girl, MarginRounded } from '@mui/icons-material';
import { color } from 'three/webgpu';
import { Transfer, Select, Progress } from 'antd';
import axiosInstance from './utils/AxiosInstance';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, A11y, Grid } from 'swiper/modules';
import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import Swal from 'sweetalert2';
import { green, yellow, red } from '@mui/material/colors';

function GaugePointer() {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();

    if (valueAngle === null) {
        return null;
    }

    const target = {
      x: cx + outerRadius * Math.sin(valueAngle),
      y: cy - outerRadius * Math.cos(valueAngle),
    };
    return (
        <g>
            <circle cx={cx} cy={cy} r={5} fill="black" />
            <path
                d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
                stroke="red"
                strokeWidth={3}
            />
        </g>
    );
}

function Earth() {
    const earthRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [hoveredCity, setHoveredCity] = useState(null);

    // 도시 위치 및 이름
    const cities = [
        { name: 'New York', position: new THREE.Vector3(0.6, 0.5, 0.5) },
        { name: 'London', position: new THREE.Vector3(0.5, 0.6, -0.4) },
        { name: 'Tokyo', position: new THREE.Vector3(0.6, -0.5, 0.4) },
    ];

    useFrame(() => {
        if (earthRef.current) {
            const rotation = earthRef.current.rotation;
        }
    });

    // 텍스처 로더
    const textureLoader = new TextureLoader();
    const earthTexture = textureLoader.load(earthTextureUrl); // 텍스처 이미지 경로

    return (
        <mesh ref={earthRef}>
            {/* 지구의 텍스처 */}
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial map={earthTexture} />
            {cities.map((city, index) => (
                <mesh
                    key={index}
                    position={city.position.toArray()}
                    onPointerOver={() => {
                        setHovered(true);
                        setHoveredCity(city);
                    }}
                    onPointerOut={() => {
                        setHovered(false);
                        setHoveredCity(null);
                    }}
                >
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="red" />
                {hovered && hoveredCity === city && (
                <Html position={[city.position.x, city.position.y + 0.1, city.position.z]} distanceFactor={10}>
                    <div style={{ color: 'white', backgroundColor: 'green', padding: '2px 5px', borderRadius: '3px' }}>
                        {city.name}
                    </div>
                </Html>
            )}
                </mesh>
        ))}
        </mesh>
    );
}

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
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        },
        &-slide-active{
        }
        &-slide-next {
            width: 100%;
            height: 95%;
            margin: auto 0;
        }
        &-slide-prev {
            width: 100%;
            height: 95%;
            margin: auto 0;
        }
        &-button-next {
            z-idnex: 1;
        }
    }    
`;

export default function Main_Admin() {

    const [mockData, setMockData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);
    const [myPjt, setMyPjt] = useState([]);
    const [selectedMyPjt, setSelectedMyPjt] = useState(null);
    const [scope, setScope] = useState([]);
    const [info, setInfo] = useState({});
    const [afterEmission, setAfterEmission] = useState([]);
    const [beforeEmission, setBeforeEmission] = useState([]);
    const [pjtStartYear, setPjtStartYear] = useState(0);
    const [pjtStartMonth, setPjtStartMonth] = useState(0);
    const [pjtEndYear, setPjtEndYear] = useState(0);
    const [pjtEndMonth, setPjtEndMonth] = useState(0);
    const [scopeOne, setScopeOne] = useState(0);
    const [scopeTwo, setScopeTwo] = useState(0);
    const [documentStatus, setDocumentStatus] = useState([]);

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
                title: v.equipName,
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
                    setScopeOne(Math.floor(scope1Data[toMonth-1] / scope1Data[toMonth-2] * 100) ?? 0);
                    setScopeTwo(Math.floor(scope2Data[toMonth-1] / scope2Data[toMonth-2] * 100) ?? 0);

                    // 증빙자료 제출현황 3개월치 구하기
                    const documentResponse = await axiosInstance.get(`/equip/document-status?pjtId=${initialPjt.pjtId}`);
                    setDocumentStatus(documentResponse.data);
                    console.log(initialPjt);
                    // 배출원 지정 
                    const emissionResponse = await axiosInstance.get(`/equip/emission?projectId=${initialPjt.pjtId}`);
                    const ae = emissionResponse.data;
                    setAfterEmission(ae);
                    const beforeEmissionResponse = await axiosInstance.get(`/equip/emission/cand?projectId=${initialPjt.pjtId}`);
                    const be = beforeEmissionResponse.data;
                    setBeforeEmission(be);
                    getMock(ae, be);
                    
                    console.log(documentResponse.data);
                    console.log(ae);
                    console.log(be);
                }
            }
            catch(error){
                console.error(error);
            }
        };
        fetchData();
        
    }, []);

    useEffect(() => {
        const fetchSelectedProjectData = async () => {
            if (!selectedMyPjt) return;
            setPjtStartYear(selectedMyPjt.ctrtFrYear);
            setPjtStartMonth(selectedMyPjt.ctrtFrMth);
            setPjtEndYear(selectedMyPjt.ctrtToYear);
            setPjtEndMonth(selectedMyPjt.ctrtToMth);

            try {
                const chartResponse = await axiosInstance.get(`/perf/pjt?pjtId=${selectedMyPjt.pjtId}&year=${toYear}`);
                const scope1Data = chartResponse.data.map(perf => perf.scope1 || null);
                const scope2Data = chartResponse.data.map(perf => perf.scope2 || null);
                const formattedChartPerfs = [
                    { data: scope1Data, stack: 'A', label: 'Scope 1' },
                    { data: scope2Data, stack: 'A', label: 'Scope 2' }
                ];
                setScope(formattedChartPerfs);
                setScopeOne(Math.floor(scope1Data[toMonth-1] / scope1Data[toMonth-2] * 100) ?? 0);
                setScopeTwo(Math.floor(scope2Data[toMonth-1] / scope2Data[toMonth-2] * 100) ?? 0);

                const documentResponse = await axiosInstance.get(`/equip/document-status?pjtId=${selectedMyPjt.pjtId}`);
                setDocumentStatus(documentResponse.data);

                const emissionResponse = await axiosInstance.get(`/equip/emission?projectId=${selectedMyPjt.pjtId}`);
                const ae = emissionResponse.data;
                setAfterEmission(ae);
                const beforeEmissionResponse = await axiosInstance.get(`/equip/emission/cand?projectId=${selectedMyPjt.pjtId}`);
                const be = beforeEmissionResponse.data;
                setBeforeEmission(be);
                getMock(ae, be);
            } catch (error) {
                console.error(error);
            }
        };
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
                const formDatas = {
                    equipId: key[0],
                    actvDataId: key[1],
                }
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
                console.log(deleteData);
                if (deleteData) {
                    try {
                        const {data} = await axiosInstance.delete(`/equip/emission?id=${deleteData.id}`);    
                        swalOptions.title = '성공!',
                        swalOptions.text = `배출원이 성공적으로 삭제되었습니다.`;
                        swalOptions.icon = 'success';
                        setTargetKeys(newTargetKeys);
                    } catch (error) {
                        console.error(error);
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

        // setTargetKeys(newTargetKeys);
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

    const scopeSettings1 = {
        width: 175,
        height: 175,
        value: scopeOne,
    };
    const scopeSettings2 = {
        width: 175,
        height: 175,
        value: scopeTwo,
    };

    const [year, setYear] = useState(null);

    const handleYear = (event) => {
        setYear(event.target.value);
    }

    const twoColors = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };

    const getStrokeColor = (value) => {
        if (value <= 50) return green['A700'];
        if (value <= 100) return yellow['800'];
        return red['A700'];
    };

    const progressPjt = () => {
        const entirePjt = calculateTotalMonths(pjtStartYear, pjtStartMonth, pjtEndYear, pjtEndMonth);
        let nowPjt = calculateTotalMonths(pjtStartYear, pjtStartMonth, toYear, toMonth);
        let result = Math.floor(nowPjt / entirePjt * 100);
        return result;
    }

    return (
            <div className={gridStyles.grid_container}>
                <Card className={gridStyles.box1} sx={{borderRadius:"15px", backgroundColor:"rgb(6, 10, 18)", color:"white"}}>
                    <div className={gridStyles.box1_header}>
                        
                        {/* 로고  */}
                        <div className={gridStyles.box1_logo}>
                            {/* <SsidChartRoundedIcon sx={{width:"2rem",height:"2rem", paddingRight:"0.5rem"}}/> */}
                            PGMSADMIN
                        </div>
                        <Select defaultValue={selectedMyPjt?.pjtName} value={selectedMyPjt?.pjtName} onChange={(e) => handleDropClick(e)} style={{width:"20%", height:"2.5rem", fontSize:"4rem"}}>
                            {myPjt.map(pjt => (
                                <Select.Option key={pjt.id} value={pjt.pjtName}>
                                {pjt.pjtName}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div className={gridStyles.box1_comp}>
                        <Card className={gridStyles.box1_1} sx={{borderRadius:"10px"}} >
                            <div className={gridStyles.box1_1_head}>
                                <div className={gridStyles.box1_1_logo}>
                                    <DataSaverOffOutlinedIcon fontSize='large' sx={{marginRight:"0.5rem"}}/>프로젝트 진행현황
                                </div>
                                <Progress percent={progressPjt()} strokeColor={twoColors} />
                                <div className={gridStyles.box1_1_logo}>
                                    <LeaderboardOutlinedIcon fontSize='large' sx={{marginRight:"0.5rem"}}/>전월 대비 실적Scope
                                </div>
                                <div className={gridStyles.box1_1_gauge}>
                                    <div>
                                        <Gauge
                                        {...scopeSettings1}
                                        cornerRadius="50%"
                                        sx={(theme) => ({
                                            [`& .${gaugeClasses.valueText}`]: {
                                            fontSize: 40,
                                            color: 'white',
                                            fontWeight: 700,
                                            },
                                            [`& .${gaugeClasses.valueArc}`]: {
                                            fill: getStrokeColor(scopeSettings1.value),
                                            },
                                            [`& .${gaugeClasses.referenceArc}`]: {
                                            fill: theme.palette.text.disabled,
                                            },
                                        })}
                                        text={
                                            ({ value }) => `${value}%`
                                        }
                                        />
                                        <div className={gridStyles.box1_1_logo}>
                                            <SpeedIcon fontSize='large' sx={{marginRight:"0.5rem"}}/>실적Scope1
                                        </div>
                                    </div>
                                    <dib>
                                    <Gauge
                                    {...scopeSettings2}
                                    cornerRadius="50%"
                                    sx={(theme) => ({
                                        [`& .${gaugeClasses.valueText}`]: {
                                        fontSize: 40,
                                        color: 'white',
                                        fontWeight: 700,
                                        },
                                        [`& .${gaugeClasses.valueArc}`]: {
                                        fill: getStrokeColor(scopeSettings2.value),
                                        },
                                        [`& .${gaugeClasses.referenceArc}`]: {
                                        fill: theme.palette.text.disabled,
                                        },
                                    })}
                                    text={
                                        ({ value }) => `${value}%`
                                    }
                                    />
                                    <div className={gridStyles.box1_1_logo}>
                                        <SpeedIcon fontSize='large' sx={{marginRight:"0.5rem"}}/>실적Scope2
                                    </div>
                                    </dib>
                                </div>
                            </div>
                        </Card>
                        <Card className={gridStyles.box1_2} sx={{borderRadius:"10px", backgroundColor: "rgb(23, 27, 38)"}}>
                            <CustomBarChart data={scope}/>
                        </Card>
                    </div>
                </Card>
                <div className={gridStyles.box2}>
                    <div className={gridStyles.box2_1}>
                        <div className={gridStyles.box2_1_1}>
                            <Card 
                                className={gridStyles.box2_1_1_card}
                                sx={{
                                borderRadius:"15px",
                                height:"100%", 
                                background:"linear-gradient(to right, #66C869, #02A007)", 
                                width:"100%",
                                display:"flex"
                                }}>
                                <div className={gridStyles.box2_1_1_1}>
                                    <div className={gridStyles.box1_1_logo} style={{color:'white'}}>
                                        <SummarizeOutlinedIcon fontSize='large' sx={{margin:"0 0.3rem 0 1rem"}}/>증빙자료 제출 현황
                                    </div>
                                    <div className={gridStyles.box2_1_1_1_1}>
                                    <Chip label={selectedMyPjt?.pjtName} variant="outlined" onClick={() => {}} sx={{backgroundColor:"white", fontSize:"1rem", fontWeight:"bold", width: "100%"}}/>
                                    </div>
                                </div>
                                <div className={gridStyles.box2_swap}>
                                <StyledRoot style={{height:"80%", width:"100%", margin:"0 auto", overflow: "hidden"}}>
                                <Swiper
                                    effect={'coverflow'}
                                    spaceBetween={15}    // 슬라이드 사이의 간격
                                    slidesPerView={2}     // 화면에 보여질 슬라이드 수
                                    coverflowEffect={{
                                        rotate: 60,
                                        stretch: 10,
                                        depth: 100,
                                        modifier: 1,
                                        slideShadows: true,
                                    }}
                                    
                                    centeredSlides={true}
                                    pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                    navigation={true}           // 이전/다음 버튼 네비게이션
                                    modules={[Navigation, Pagination, EffectCoverflow]}
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
                                                        ({ value, valueMax }) => `${value} / ${valueMax}`
                                                    }
                                                />
                                                <div style={{fontSize:"2rem", fontWeight:"bold", textAlign:"center", marginTop:"1rem"}}>
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
                    <div className={gridStyles.box2_2}>
                        <Card sx={{borderRadius:"10px", height:"100%", backgroundColor:"black"}}>
                        <Canvas>
                            <ambientLight intensity={2.0} />
                            <pointLight position={[10, 10, 10]} />
                            <Earth />
                            <OrbitControls />
                        </Canvas>
                        </Card>
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
                                    padding:"0 5%"
                                }}>
                                    <div style={{width:"20%", color:"white", fontSize:"1rem"}}>
                                        배출원 지정
                                    </div>
                                </div>
                                <div style={{margin:"0 auto", height:"90%"}}>
                                    <Transfer
                                        dataSource={mockData}
                                        showSearch
                                        filterOption={filterOption}
                                        targetKeys={targetKeys}
                                        onChange={handleChange}
                                        onSearch={handleSearch}
                                        render={(item) => item.title}
                                        style={{
                                            height:"95%",
                                        }}
                                        listStyle={{
                                            height:"100%"
                                        }}
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
    );
}