import React, { useState, useRef } from 'react';
import * as gridStyles from './assets/css/grid.css'
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import earthTextureUrl from './assets/images/earth.jpg';
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc, useGaugeState, Gauge, gaugeClasses} from '@mui/x-charts';
import { Card,CardContent } from '@mui/material';
import { CustomBarChart } from './Chart';
import { temp_data } from './assets/json/chartData';

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
        value: 33,
    };

    return (
            <div className={gridStyles.grid_container}>
                <Card className={gridStyles.box1} sx={{borderRadius:"10px"}}>
                    {"실적스코프"}
                    <CustomBarChart data={temp_data} />
                </Card>
                <Card className={gridStyles.box2} sx={{borderRadius:"10px"}}>
                    <CardContent>                        
                    <GaugeContainer
                        width={450}
                        height={150}
                        startAngle={-110}
                        endAngle={110}
                        value={86}
                    >
                    <GaugeReferenceArc />
                    <GaugeValueArc />
                    <GaugePointer />
                    </GaugeContainer>
                    <div className={gridStyles.box2_text}>{`${GaugeContainer.value}/100`}</div>
                    </CardContent>
                </Card>
                <Card className={gridStyles.box3} sx={{borderRadius:"10px"}}>
                    <div>
                    <Gauge 
                    {...settings}
                    cornerRadius="50%"
                    sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 40,
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                        fill: '#52b202',
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                        fill: theme.palette.text.disabled,
                        },
                    })}
                    />
                    {"프로젝트1"}
                    </div>
                    <div>
                    <Gauge
                    {...settings}
                    cornerRadius="50%"
                    sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 40,
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                        fill: '#52b202',
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                        fill: theme.palette.text.disabled,
                        },
                    })}
                    />
                    {"프로젝트2"}
                    </div>
                </Card>
                <Card className={gridStyles.box4} sx={{borderRadius:"10px"}}>box4</Card>
                <Card className={gridStyles.box5} sx={{borderRadius:"10px"}}>box5</Card>
                <Card className={gridStyles.box6} sx={{borderRadius:"10px"}}>
                    <Canvas>
                        <ambientLight intensity={2.0} />
                        <pointLight position={[10, 10, 10]} />
                        <Earth />
                        <OrbitControls />
                    </Canvas>
                </Card>
            </div>
    );
}