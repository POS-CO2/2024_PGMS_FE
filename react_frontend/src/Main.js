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
import { ArrowBackIos, ArrowForward, ArrowForwardIos, Girl, MarginRounded } from '@mui/icons-material';
import { color } from 'three/webgpu';
import { Transfer, Select } from 'antd';
import axiosInstance from './utils/AxiosInstance';

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

export default function Main() {

    const [mockData, setMockData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);
    const [choosenData, setChoosenData] = useState([]);
    const [candData, setCandData] = useState([]);
    const getMock = (tempArray) => {
        const tempTargetKeys = [];
        const tempMockData = [];
        
        // tempArray.map(v => {
        //     const data = {
        //         key: v.equipId,
        //         title: v.equipName,
        //         description: v.equipLibName,
        //         chosen: v.id != null,
        //     }
        //     console.log(data);
        //     if (data.chosen) {
        //         tempTargetKeys.push(data.key);
        //     }
        //     tempMockData.push(data);
        // });
        for (let i = 0; i < 20; i++) {
            const data = {
            key: i.toString(),
            title: `배출원${i + 1}`,
            description: `description of content${i + 1}`,
            chosen: i % 2 === 0,
            };
            if (data.chosen) {
                console.log(data.chosen);
                console.log(data.key);
            tempTargetKeys.push(data.key);
            }
            tempMockData.push(data);
        }
        setMockData(tempMockData);
        setTargetKeys(tempTargetKeys);
    };
    useEffect(() => {
        (async () => {
            try{
                const {data} = await axiosInstance.get(`/equip/emission?projectId=2`);
                setChoosenData(data);
            }
            catch(error){
                console.error(error);
            }
        })();

        (async () => {
            try {
                const {data} = await axiosInstance.get(`/equip/emission/cand?projectId=8`)
                setCandData(data);
            } catch (error) {
                console.error(error);
            }
        })();
        getMock();
    }, []);

    const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    const handleChange = (newTargetKeys) => {
        setTargetKeys(newTargetKeys);
        };
    const handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    const settings = {
        width: 150,
        height: 150,
        value: 9,
        valueMax: 12,
    };

    const [year, setYear] = useState(null);

    const handleYear = (event) => {
        setYear(event.target.value);
    }

    return (
            <div className={gridStyles.grid_container}>
                <Card className={gridStyles.box1} sx={{borderRadius:"15px", backgroundColor:"rgb(6, 10, 18)", color:"white"}}>
                    {/* 로고  */}
                    <div className={gridStyles.box1_logo}>
                        <SsidChartRoundedIcon sx={{width:"2rem",height:"2rem", paddingRight:"0.5rem"}}/>PGMS
                    </div>
                    <div className={gridStyles.box1_comp}>
                        <Card className={gridStyles.box1_1} sx={{borderRadius:"10px", alignItems:"center"}} >
                            <div className={gridStyles.box1_1_head}>
                                <div className={gridStyles.box1_1_logo}>
                                    <AutoGraphIcon fontSize='large' sx={{color:"white"}}/>분석 및 예측
                                </div>
                                <FormControl sx={{ minWidth: 120, backgroundColor:"white", borderRadius:"10px" }} size="small">
                                    <InputLabel id="demo-select-small-label">년도</InputLabel>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        defaultValue={2024}
                                        value={year}
                                        label="년도"
                                        onChange={handleYear}
                                    >
                                        <MenuItem value="">
                                        <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={2024}>2024</MenuItem>
                                        <MenuItem value={2023}>2023</MenuItem>
                                        <MenuItem value={2022}>2022</MenuItem>
                                    </Select>
                                    </FormControl>
                            </div>
                            <CustomLineChart sx={{color:"white"}}/>
                        </Card>
                        <Card className={gridStyles.box1_2} sx={{borderRadius:"10px", backgroundColor: "rgb(23, 27, 38)"}}>
                            <CustomBarChart data={temp_data}/>
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
                                background:"linear-gradient(to right, #FFEB7B, #FFD900 )", 
                                width:"100%",
                                display:"flex"
                                }}>
                                <div className={gridStyles.box2_1_1_1}>
                                    <div className={gridStyles.box2_1_1_1_1}>
                                    <Chip label="광양 포스코 홍보관" variant="outlined" onClick={() => {}} sx={{backgroundColor:"white", fontSize:"1rem", fontWeight:"bold"}}/>
                                    </div>
                                    <div className={gridStyles.box2_1_1_1_2}>
                                        <div className={gridStyles.box2_year}>2024년</div>
                                        <div className={gridStyles.box2_monthselect}>
                                            <IconButton aria-label='left_button'>
                                                <ArrowBackIos fontSize="large" sx={{color:"white"}} />
                                            </IconButton>
                                            <div className={gridStyles.box2_month} >
                                                7월
                                            </div>
                                            <IconButton aria-label='right_button'>
                                                <ArrowForwardIos fontSize="large" sx={{color:"white"}} />
                                            </IconButton>
                                        </div>
                                    </div>    
                                    <div className={gridStyles.box2_1_1_1_3}>
                                        <ButtonGroup
                                            disableElevation
                                            variant='contained'
                                            aria-label='box2 button group'
                                        >
                                            <Button>프로젝트 조회</Button>
                                            <Button>증빙자료 제출</Button>

                                        </ButtonGroup>
                                    </div>
                                </div>
                                <div className={gridStyles.box2_1_1_2}>
                                    <Gauge 
                                    {...settings}
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
                                    })}
                                    text={
                                        ({ value, valueMax }) => `${value} / ${valueMax}`
                                    }
                                    />
                                </div>
                            </Card>
                        </div>
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
                                    <div className={gridStyles.box2_1_1_1_1}>
                                    <Chip label="고양 데이터센터" variant="outlined" onClick={() => {}} sx={{backgroundColor:"white", fontSize:"1rem", fontWeight:"bold"}}/>
                                    </div>    
                                    <div className={gridStyles.box2_1_1_1_2}>
                                        <div className={gridStyles.box2_year}>2024년</div>
                                        <div className={gridStyles.box2_monthselect}>
                                            <IconButton aria-label='left_button'>
                                                <ArrowBackIos fontSize="large" sx={{color:"white"}} />
                                            </IconButton>
                                            <div className={gridStyles.box2_month} >
                                                7월
                                            </div>
                                            <IconButton aria-label='right_button'>
                                                <ArrowForwardIos fontSize="large" sx={{color:"white"}} />
                                            </IconButton>
                                        </div>
                                    </div>
                                    <div className={gridStyles.box2_1_1_1_3}>
                                        <ButtonGroup
                                            disableElevation
                                            variant='contained'
                                            aria-label='box2 button group'
                                        >
                                            <Button>프로젝트 조회</Button>
                                            <Button>증빙자료 제출</Button>

                                        </ButtonGroup>
                                    </div>
                                </div>
                                <div className={gridStyles.box2_1_1_2}>
                                    <Gauge 
                                    {...settings}
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
                                    })}
                                    text={
                                        ({ value, valueMax }) => `${value} / ${valueMax}`
                                    }
                                    />
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
                                    <Select value={"광양 포스코 홍보관"} onChange={(e) => {e.target.value}} style={{width:"40%", height:"2.5rem", fontSize:"4rem", marginRight:"10%"}}>
                                        <Select.Option key={1} value={"광양 포스코 홍보관"}>
                                            광양 포스코 홍보관
                                        </Select.Option>
                                        <Select.Option key={2} value={"고양 데이터센터"}>
                                            고양 데이터센터
                                        </Select.Option>
                                    </Select>   
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