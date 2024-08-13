import React, { useState, useRef } from 'react';
import * as gridStyles from './assets/css/grid.css'
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import earthTextureUrl from './assets/images/earth.jpg';
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState, Gauge, gaugeClasses} from '@mui/x-charts';
import { Card,CardContent, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { CustomBarChart, CustomLineChart } from './Chart';
import { temp_data } from './assets/json/chartData';
import SsidChartRoundedIcon from '@mui/icons-material/SsidChartRounded';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { Girl } from '@mui/icons-material';

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
                                <FormControl sx={{ m: 1, minWidth: 120, backgroundColor:"white", borderRadius:"10px" }} size="small">
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
                            <Card sx={{borderRadius:"10px", height:"100%"}}>
                                <div className={gridStyles.box2_1_1_1}>
                                    <div className={gridStyles.box2_1_1_1_1}>
                                    {"프로젝트1"}
                                    </div>    
                                    <div className={gridStyles.box2_1_1_1_2}>
                                    {"프로젝트 1 정보"}
                                    </div>
                                </div>
                                <div className={gridStyles.box2_1_1_2}>
                                    <Gauge 
                                    {...settings}
                                    cornerRadius="50%"
                                    sx={(theme) => ({
                                        [`& .${gaugeClasses.valueText}`]: {
                                        fontSize: "1.5rem",
                                        },
                                        [`& .${gaugeClasses.valueArc}`]: {
                                        fill: '#52b202',
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
                        <div className={gridStyles.box2_1_2}>
                            <Card sx={{borderRadius:"10px", height:"100%"}}>
                                <div>
                                    <Gauge 
                                    {...settings}
                                    cornerRadius="50%"
                                    sx={(theme) => ({
                                        [`& .${gaugeClasses.valueText}`]: {
                                        fontSize: "1.5rem",
                                        },
                                        [`& .${gaugeClasses.valueArc}`]: {
                                        fill: '#52b202',
                                        },
                                        [`& .${gaugeClasses.referenceArc}`]: {
                                        fill: theme.palette.text.disabled,
                                        },
                                    })}
                                    text={
                                        ({ value, valueMax }) => `${value} / ${valueMax}`
                                    }
                                    />
                                    {"프로젝트2"}
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className={gridStyles.box2_2}>
                        <Card sx={{borderRadius:"10px", height:"100%"}}>
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
                            <Card sx={{borderRadius:"10px", height:"100%"}}>
                                <CardContent>                        
                                <GaugeContainer
                                    height={150}
                                    startAngle={-110}
                                    endAngle={110}
                                    value={86}
                                    sx={{
                                        [`& .${gaugeClasses.valueText}`]: {
                                            fontSize: 40,
                                            transform: 'translate(0px, 0px)',
                                        },
                                    }}
                                >
                                <GaugeReferenceArc />
                                <GaugeValueArc />
                                <GaugePointer />
                                </GaugeContainer>
                                </CardContent> 
                            </Card>
                        </div>
                        <div className={gridStyles.box2_3_2}>
                            <Card sx={{borderRadius:"10px", height:"100%"}}>
                                <CardContent>                        
                                <GaugeContainer
                                    height={150}
                                    startAngle={-110}
                                    endAngle={110}
                                    value={86}
                                >
                                <GaugeReferenceArc />
                                <GaugeValueArc />
                                <GaugePointer />
                                </GaugeContainer>
                                </CardContent> 
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
    );
}