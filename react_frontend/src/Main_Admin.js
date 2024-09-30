import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import * as gridStyles from './assets/css/gridAdmin.css';
import { useSpring, animated } from '@react-spring/web';
import { Card, CircularProgress, Divider, IconButton, LinearProgress, Skeleton } from '@mui/material';
import { Code, Menu, ManageAccounts, Terminal, PeopleAlt, Engineering, Business, Settings, Today, AddCircleTwoTone, RemoveCircleTwoTone, Person, RemoveCircleOutline, MoreHoriz, ScoreSharp } from '@mui/icons-material';
import { SwiperSlide, Swiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import styled from 'styled-components';
import ApexCharts from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { openTabsState, activeTabState, itemsState, selectedKeyState, openKeysState } from './atoms/tabAtoms';
import EcrLogo from './assets/images/ecrlogo.png';
import TerminalLogo from './assets/images/terminal.png';
import ContainerLogo from './assets/images/container.png';
import ContainerAddLogo from './assets/images/containeradd.png';
import ApiLogo from './assets/images/api.png';
import { ConfigProvider, Tabs, DatePicker, Input, Select, Collapse } from 'antd';
import dayjs from 'dayjs';
import axiosInstance from './utils/AxiosInstance';
import useFetchData from './customhook/useFetchData';
import useInterval from './customhook/useInterval'
import Swal from 'sweetalert2';

const { RangePicker } = DatePicker;

const StyledDatePicker = styled(RangePicker)`
    .ant-picker {
        height: 80%;
    }
`;

const StyledCollapse = styled(Collapse)`

    .ant-collapse-item {
        height: 100%;
    }

    .ant-collapse-header {
        height: 100%;
        align-items: center !important;
    }

    .ant-collapse-expand-icon {
        height: 100%;
    }

    .ant-collapse-header-text {
        height: 100%;
        align-items: center;
    }

    .ant-collapse-content {
        white-space: wrap;
        overflow-x: auto;
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
        width: 80% !important;
        height: 100% !important;
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
            width: 100%;import useInterval from './customhook/useInterval';

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

const ChartOptions = (title, xdata) => {
    const chartOption = {
    chart: {
        offsetY: 20,
        type: "line",
        toolbar: {
            show: false
        },
        width: "auto",
        height: 'auto',
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
            }],
        },
        grid: {
            show: false,
            xaxis: { 
            show: false,
            categories: xdata,
            }
        },
        xaxis: {
            categories: xdata,
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
                color:  'rgb(55,57,78)',
                fontFamily: "SUITE-Regular",
            },
        }
    }
    return chartOption;
};

const ProgressComponent = memo(({ progress }) => {
    return (
        <div style={{ width: "5%" }}>
            <LinearProgress variant="determinate" value={progress} />
        </div>
    );
});

export default function Main_Admin({ handleMenuClick=()=>{} }) {
    const today = new Date();
    const defaultStartDate = dayjs(today).format('YYYY-MM-DD') + 'T00:00:00.000';
    const defaultEndDate = dayjs(today).format('YYYY-MM-DD') + 'T23:59:59.999';

    const [showMenuBar, setShowMenuBar] = useState(false);
    const [main, setMain] = useState("server");
    const [dateArray, setDateArray] = useState([]);
    const [menuLogArray, setMenuLogArray] = useState([]);
    const [serviceTab, setServiceTab] = useState("common");
    const [selectedPeriod, setSelectedPeriod] = useState({
        start: defaultStartDate,
        end: defaultEndDate,
    });
    const [count, setCount] = useState(10);
    const [errorCode, setErrorCode] = useState("");
    const [errorLog, setErrorLog] = useState([]);
    const [logLoading, setLogLoading] = useState(false);
    const navigate = useNavigate();
    const [openTabs, setOpenTabs] = useRecoilState(openTabsState);
    const setActiveKey = useSetRecoilState(activeTabState);
    const items = useRecoilValue(itemsState);
    const setSelectedKeys = useSetRecoilState(selectedKeyState);
    const [openKeys, setOpenKeys] = useRecoilState(openKeysState);

    const findParentItem = (items, childKey) => {
        return items.reduce((acc, item) => {
            if (acc) return acc;
            if (item.children && item.children.some(child => child.key === childKey)) {
                return item;  // 해당 childKey를 가진 부모 아이템을 반환
            }
            if (item.children) {
                return findParentItem(item.children, childKey); // 재귀적으로 탐색
            }
            return null;
        }, null);
    };

    // 메뉴를 클릭했을 때, key값으로 item을 찾음
    const findItemByLabel = (items, targetLabel) =>
        items.reduce((acc, item) => {
        if (acc) return acc;
        if (typeof item.label === 'string' && item.label.replace(/\*/g, '') === targetLabel) // label에 * 이 있으면 없애고 비교
        return item;
        if (item.children) return findItemByLabel(item.children, targetLabel);
        return null;
    }, null);

    const handleButtonClick = (path, label) => {
        const item = findItemByLabel(items, label);

        if (item) {
            setSelectedKeys([item.key]);
        }

        // 대분류(상위 메뉴)를 찾아 openKeys에 추가
        const parentItem = findParentItem(items, item.key);
        if (parentItem) {
            setOpenKeys([...openKeys, parentItem.key]);
        }

        const newTab = { key: path, tab: label, accessUser: item.accessUser };

        if (!openTabs.find(tab => tab.key === path)) {
          setOpenTabs([...openTabs, newTab]);  // 새로운 탭 추가
        }

        setActiveKey(path);  // activeKey를 변경
        navigate(path);  // 경로 이동
    };

    const userCnt = useFetchData(`/sys/session`, 10000);
    const commonUrl = '/sys/containers/item?clusterName=pgms_common&arn=arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/';

    const handleCountChange = (value) => {
        setCount(value);
    }

    const handleErrorCodeChange = (value) => {
        setErrorCode(value);
    }
    
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
    
    // 탭 체인지
    const handleTabChange = async (key) => {
        setServiceTab(key);
    }

    const tabItems = [
        {
            key: "common",
            label: "공통",
        },
        {
            key: "equipment",
            label: "설비",
        },
        {
            key: "project",
            label: "프로젝트",
        },
        {
            key: "anal",
            label: "분석 및 예측",
        },
        {
            key: "socket",
            label: "채팅",
        },
    ]

    const logItems = errorLog.map(data => ({
        key: data.id,
        label: <p>
            {`서비스 명:`} <span style={{color:"white", fontWeight:"bold", fontSize:"1.2rem", padding:"0 0.5rem"}}>{data.serviceName}</span> 
        {`에러 코드:`} <span style={{color:"white", fontWeight:"bold", fontSize:"1.2rem", padding:"0 0.5rem"}}>{data.errorCode}</span> 
        {`사번:`} <span style={{color:"white", fontWeight:"bold", fontSize:"1.2rem", padding:"0 0.5rem"}}>{data.loginId ?? "x"}</span>
        {`발생 일시:`} <span style={{color:"white", fontWeight:"bold", fontSize:"1.2rem", padding:"0 0.5rem"}}>{data.createDate}</span>
        </p>,
        children: <p>{data.message}</p>,
    }))

    const loadMoreLog = async () => {
        if (!logLoading && errorLog.length > 0) {
            setLogLoading(true);
            try{
                const lastLogId = errorLog[errorLog.length - 1].id;
                const response = await axiosInstance.get(`/sys/error?serviceName=${serviceTab}&errorCode=${errorCode ?? ""}&startDate=${selectedPeriod.start ?? ""}&endDate=${selectedPeriod.end ?? ""}&count=${count}&objectId=${lastLogId}`);
                const newLogs = response.data;

                if (newLogs.length > 0) {
                    setErrorLog((prevContent) => [...prevContent, ...newLogs]);
                }
            } catch(error) {
                console.error(error);
            }
            setLogLoading(false);
        }
    }

    const springProps = useSpring({
        transform: showMenuBar ? 'translateY(-20px)' : 'translateY(75px)',
        config: {tension: 250, friction: 20},
    });

    const handleMouseOver = () => {
        setShowMenuBar(true);
    }
    const handleMouseLeave = () => {
        setShowMenuBar(false);
    }

    const handleServerClick = () => {
        setMain("server");
    }

    const handleErrorLogClick = () => {
        setMain("errorlog");
    }
    
    const getLast7Days = () => {
        const days = [];
        
    
        for (let i = 0; i < 7; i++) {
            const priorDate = new Date();
            priorDate.setDate(today.getDate() - i);
            
            const year = priorDate.getFullYear();
            const month = priorDate.getMonth() + 1;
            const day = priorDate.getDate();
        
            days.push(`${year}-${String(month).padStart(2, '0')}-${day}`);
        }
    
        return days.reverse(); // 과거 -> 현재 순으로 정렬
    };

    // 메뉴별 접속횟수관리 
    useEffect(() => {
        const xAxisChart = getLast7Days();
        setDateArray(xAxisChart);
        const fetchMenuLog = async () => {
            try {
                const menuCntResponse = await axiosInstance.get(`/sys/log/board?startDate=${xAxisChart[0]}`);
                setMenuLogArray(menuCntResponse.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchMenuLog();
        
    }, []);

    const [commonContainer, setCommonContainer] = useState(null);
    const [ccLoading, setCcLoading] = useState(false);
    const [equipmentContainer, setEquipmentContainer] = useState(null);
    const [eqLoading, setEqLoading] = useState(false);
    const [projectContainer, setProjectContainer] = useState(null);
    const [pjtLoading, setPjtLoading] = useState(false);
    const [analContainer, setAnalContainer] = useState(null)
    const [analLoading, setAnalLoading] = useState(false);
    const [socketContainer, setSocketContainer] = useState(null);
    const [skLoading, setSkLoading] = useState(false);
    const [prePendingCm, setPrePendingCm] = useState(false);
    const [prePendingEq, setPrePendingEq] = useState(false);
    const [prePendingPj, setPrePendingPj] = useState(false);
    const [prePendingAn, setPrePendingAn] = useState(false);
    const [prePendingSk, setPrePendingSk] = useState(false);
    const [progress, setProgress] = useState(0);

    const fetchCommonService = async () => {
        try {
            const commonResponse = await axiosInstance.get(commonUrl.concat('pgms_common_service'));
            setCommonContainer(commonResponse.data);
            setCcLoading(false);
        } catch (error) {
            console.log(error);
        }
        
    }

    const fetchEquipmentService = async () => {
        try {
            const equipmentResponse = await axiosInstance.get(commonUrl.concat('pgms_equipment_service'));    
            setEquipmentContainer(equipmentResponse.data);
            setEqLoading(false);
        } catch (error) {
            console.log(error);
        }
        
        
    }

    const fetchProjectService = async () => {
        try {
            const projectResponse = await axiosInstance.get(commonUrl.concat('pgms_project_service'));
            setProjectContainer(projectResponse.data);
            setPjtLoading(false)    
        } catch (error) {
            console.log(error);
        }
    }

    const fetchAnalService = async () => {
        try {
            const analResponse = await axiosInstance.get(commonUrl.concat('pgms_anal_service'));
            setAnalContainer(analResponse.data);
            setAnalLoading(false);    
        } catch (error) {
            console.log(error);
        }
    }

    const fetchServiceData = async (url, setData, setLoading) => {
        try {
            const response = await axiosInstance.get(url);
            setData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFetch = async () => {
        const commonUrl = '/sys/containers/item?clusterName=pgms_common&arn=arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/';
        const services = [
            { url: commonUrl.concat('pgms_common_service'), setData: setCommonContainer, setLoading: setCcLoading },
            { url: commonUrl.concat('pgms_equipment_service'), setData: setEquipmentContainer, setLoading: setEqLoading },
            { url: commonUrl.concat('pgms_project_service'), setData: setProjectContainer, setLoading: setPjtLoading },
            { url: commonUrl.concat('pgms_anal_service'), setData: setAnalContainer, setLoading: setAnalLoading },
            { url: commonUrl.concat('pgms_socket_service'), setData: setSocketContainer, setLoading: setSkLoading }
        ];

        await Promise.all(services.map(service => fetchServiceData(service.url, service.setData, service.setLoading)));
    };
    const fetchData = useCallback(async () => {
        try {
            await Promise.all([
                fetchCommonService(),
                fetchEquipmentService(),
                fetchProjectService(),
                fetchAnalService(),
                fetchSocketService(),
            ]);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchSocketService = async () => {
        try {
            const socketResponse = await axiosInstance.get(commonUrl.concat('pgms_socket_service'));
            setSocketContainer(socketResponse.data);
            setSkLoading(false);    
        } catch (error) {
            console.log(error);
        }
    }

    useInterval(() => {
        if (main === "server"){
            fetchData();
        }
    }, 5000);

    const handleContainerAddClick = async (data) => {
        let swalOptions = {
            confirmButtonText: '확인'
        };
        
        try {
            await axiosInstance.post(`/sys/containers/up?clusterName=pgms_common&arn=`.concat(data.arn));
            
            if (data.arn === "arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/pgms_common_service") {
                setPrePendingCm(true);
                await fetchCommonService();
                setPrePendingCm(false);
            }
            else if (data.arn === "arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/pgms_equipment_service") {
                setPrePendingEq(true);
                await fetchEquipmentService();
                setPrePendingEq(false);
            }
            else if (data.arn === "arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/pgms_project_service") {
                setPrePendingPj(true);
                await fetchProjectService();
                setPrePendingPj(false);
            }
            else if (data.arn === "arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/pgms_anal_service") {
                setPrePendingAn(true);
                await fetchAnalService();
                setPrePendingAn(false);
            }
            else if (data.arn === "arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/pgms_socket_service") {
                setPrePendingSk(true);
                await fetchSocketService();
                setPrePendingSk(false);
            }
            swalOptions.title = '성공!',
            swalOptions.text = `성공적으로 등록되었습니다. 잠시만 기다려주세요.`;
            swalOptions.icon = 'success';
        } catch (error) {
            swalOptions.title = '실패!',
            swalOptions.text = error.response.data.message;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
    }

    const handleContainerDeleteClick = async (data) => {
        let swalOptions = {
            confirmButtonText: '확인'
        };
        try {
            await axiosInstance.post(`/sys/containers/down?clusterName=pgms_common&arn=`.concat(data.arn));
            if (data.arn === "arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/pgms_common_service") {
                setPrePendingCm(true);
                await fetchCommonService();
                setPrePendingCm(false);
            }
            else if (data.arn === "arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/pgms_equipment_service") {
                setPrePendingEq(true);
                await fetchEquipmentService();
                setPrePendingEq(false);
            }
            else if (data.arn === "arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/pgms_project_service") {
                setPrePendingPj(true);
                await fetchProjectService();
                setPrePendingPj(false);
            }
            else if (data.arn === "arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/pgms_anal_service") {
                setPrePendingAn(true);
                await fetchAnalService();
                setPrePendingAn(false);
            }
            else if (data.arn === "arn:aws:ecs:ap-northeast-2:011528301196:service/pgms_common/pgms_socket_service") {
                setPrePendingSk(true);
                await fetchSocketService();
                setPrePendingSk(false);
            }
            swalOptions.title = '성공!',
            swalOptions.text = `성공적으로 삭제되었습니다. 잠시만 기다려주세요.`;
            swalOptions.icon = 'success';
        } catch (error) {
            swalOptions.title = '실패!',
            swalOptions.text = error.response.data.message;
            swalOptions.icon = 'error';
        }
        Swal.fire(swalOptions);
    }

    // 예외 관리
    useEffect(() => {
        if (main === "errorlog") {
            const fetchData = async () => {
                const logResponse = await axiosInstance.get(`/sys/error?serviceName=${serviceTab}&errorCode=${errorCode ?? ""}&startDate=${selectedPeriod.start ?? ""}&endDate=${selectedPeriod.end ?? ""}&count=${count}`);
                setErrorLog(logResponse.data);
            }
            
            fetchData();
        }
    }, [selectedPeriod, errorCode, count, serviceTab, main])

    return (
            <div className={gridStyles.main_grid}>
                <div className={gridStyles.left_box}>
                    <Card onClick={handleServerClick} sx={{width:"90%", height:"18%", borderRadius:"10px", margin:"0 auto", backgroundColor:"rgb(36,46,59)", margin:"0 auto", cursor:"pointer"}}>
                        <div className={gridStyles.left_icon}>
                            <img src={EcrLogo} alt='ecrlogo' style={{width:"100px", height:"100px"}}/>
                        </div>
                        <div className={gridStyles.left_icon_title}>
                            서버 관리
                        </div>
                    </Card>
                    <Card onClick={handleErrorLogClick} sx={{width:"90%", height:"18%", borderRadius:"10px", backgroundColor:"rgb(209,214,221)", cursor:"pointer"}}>
                        <div className={gridStyles.left_icon}>
                            <img src={TerminalLogo} alt='terminal' style={{width:"100px", height:"100px", margin:"0 auto"}} />
                        </div>
                        <div className={gridStyles.left_icon_title}>
                            예외 관리
                        </div>
                    </Card>
                </div>
                <div className={gridStyles.mid_box}> 
                    <div className={gridStyles.real_board}>
                            {main === "server" ? (
                                // 서버관리
                                <Card sx={{width:"98%", height:"100%", borderRadius:"10px"}}>
                                    <div className={gridStyles.server_header}>
                                        <div style={{width:"20%"}}>
                                        서버 관리
                                        </div>
                                        {/* <ProgressComponent progress={progress} /> */}
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
                                            <StyledRoot2 style={{width:"75%", height:"100%", overflow:"hidden", position: "relative"}}>
                                                {
                                                    !ccLoading&&commonContainer !== null ? (
                                                        <Swiper
                                                            spaceBetween={30}    // 슬라이드 사이의 간격
                                                            slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                                            // centeredSlides={true}
                                                            pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                                            navigation={true}           // 이전/다음 버튼 네비게이션
                                                            modules={[Navigation, Pagination]}
                                                        >
                                                            {commonContainer.tasks.map(data => (
                                                                <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                                    <div className={gridStyles.container}>
                                                                        {
                                                                            data.lastStatus === "RUNNING" ? (
                                                                                <>
                                                                                    <img src={ContainerLogo} style={{width:"85px", height:"85px"}}/>
                                                                                    <div className={gridStyles.container_status}>
                                                                                        {
                                                                                            data.cpu !== null ? (
                                                                                                <>
                                                                                                <div style={{color: data.cpu >= 70 ? 'red' : 'black'}}>CPU : {data.cpu.toFixed(2)}%</div>
                                                                                                <div>
                                                                                                    RAM : {data.memory}MB
                                                                                                </div>
                                                                                                </>
                                                                                            ) : (
                                                                                                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                                                                데이터<br/>
                                                                                                수집중 
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <img src={ContainerAddLogo} style={{width:"85px", height:"85px", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}}/>
                                                                                    <div className={gridStyles.container_status} style={{width:"100%", height:"30%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                                                        <CircularProgress size="30px"/>
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </SwiperSlide>
                                                            ))}
                                                            <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                                <div className={gridStyles.container}>
                                                                    <img src={ContainerAddLogo} style={{width:"85px", height:"85px", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}} />
                                                                    <div style={{display:"flex", flexDirection:"row"}}>
                                                                        <div className={gridStyles.container_status} >
                                                                            <IconButton color='success' onClick={() => handleContainerAddClick(commonContainer)}>
                                                                                <AddCircleTwoTone />
                                                                            </IconButton>
                                                                        </div>
                                                                        <div className={gridStyles.container_status} >
                                                                            {commonContainer.taskCount === 1 || commonContainer.taskCount === 0 ? (
                                                                                <IconButton disabled color='error' onClick={() => handleContainerDeleteClick(commonContainer)}>
                                                                                    <RemoveCircleTwoTone />
                                                                                </IconButton>
                                                                            ) : (
                                                                                <IconButton color='error' onClick={() => handleContainerDeleteClick(commonContainer)}>
                                                                                    <RemoveCircleTwoTone />
                                                                                </IconButton>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </SwiperSlide>
                                                        </Swiper>
                                                    ) : (
                                                        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", alignContent:"center", width:"100%", height:"100%"}}>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                        </div>
                                                    )  
                                                }
                                                {prePendingCm && (
                                                    <Overlay>
                                                        <CircularProgress />
                                                    </Overlay>
                                                )}
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
                                            <StyledRoot2 style={{width:"75%", height:"100%", overflow:"hidden", position:"relative"}}>
                                                {
                                                    !eqLoading&&equipmentContainer !== null ? (
                                                        <Swiper
                                                            spaceBetween={30}    // 슬라이드 사이의 간격
                                                            slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                                            // centeredSlides={true}
                                                            pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                                            navigation={true}           // 이전/다음 버튼 네비게이션
                                                            modules={[Navigation, Pagination]}
                                                        >
                                                            {equipmentContainer.tasks.map(data => (
                                                                <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                                    <div className={gridStyles.container}>
                                                                        {
                                                                            data.lastStatus === "RUNNING" ? (
                                                                                <>
                                                                                    <img src={ContainerLogo} style={{width:"85px", height:"85px"}}/>
                                                                                    <div className={gridStyles.container_status}>
                                                                                        {
                                                                                            data.cpu !== null ? (
                                                                                                <>
                                                                                                <div style={{color: data.cpu >= 70 ? 'red' : 'black'}}>CPU : {data.cpu.toFixed(2)}%</div>
                                                                                                <div>
                                                                                                    RAM : {data.memory}MB
                                                                                                </div>
                                                                                                </>
                                                                                            ) : (
                                                                                                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                                                                데이터<br/>
                                                                                                수집중 
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <img src={ContainerAddLogo} style={{width:"85px", height:"85px", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}}/>
                                                                                    <div className={gridStyles.container_status} style={{width:"100%", height:"30%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                                                        <CircularProgress size="30px"/>
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </SwiperSlide>
                                                            ))}
                                                            <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                                <div className={gridStyles.container}>
                                                                    <img src={ContainerAddLogo} style={{width:"85px", height:"85px", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}} />
                                                                    <div style={{display:"flex", flexDirection:"row"}}>
                                                                        <div className={gridStyles.container_status} >
                                                                            <IconButton color='success' onClick={() => handleContainerAddClick(equipmentContainer)}>
                                                                                <AddCircleTwoTone />
                                                                            </IconButton>
                                                                        </div>
                                                                        <div className={gridStyles.container_status}>
                                                                            {equipmentContainer.taskCount === 1 || equipmentContainer.taskCount === 0 ? (
                                                                                <IconButton disabled color='error' onClick={() => handleContainerDeleteClick(equipmentContainer)}>
                                                                                    <RemoveCircleTwoTone />
                                                                                </IconButton>
                                                                            ) : (
                                                                                <IconButton color='error' onClick={() => handleContainerDeleteClick(equipmentContainer)}>
                                                                                    <RemoveCircleTwoTone />
                                                                                </IconButton>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </SwiperSlide>
                                                        </Swiper>
                                                    ) : (
                                                        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", alignContent:"center", width:"100%", height:"100%"}}>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                        </div>
                                                    )  
                                                }
                                                {prePendingEq && (
                                                    <Overlay>
                                                        <CircularProgress />
                                                    </Overlay>
                                                )}
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
                                            <StyledRoot2 style={{width:"75%", height:"100%", overflow:"hidden", position:"relative"}}>
                                                {
                                                    !pjtLoading&&projectContainer !== null ? (
                                                        <Swiper
                                                            spaceBetween={30}    // 슬라이드 사이의 간격
                                                            slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                                            // centeredSlides={true}
                                                            pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                                            navigation={true}           // 이전/다음 버튼 네비게이션
                                                            modules={[Navigation, Pagination]}
                                                        >
                                                            {projectContainer.tasks.map(data => (
                                                                <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                                    <div className={gridStyles.container}>
                                                                        {
                                                                            data.lastStatus === "RUNNING" ? (
                                                                                <>
                                                                                    <img src={ContainerLogo} style={{width:"85px", height:"85px"}}/>
                                                                                    <div className={gridStyles.container_status}>
                                                                                        {
                                                                                            data.cpu !== null ? (
                                                                                                <>
                                                                                                <div style={{color: data.cpu >= 70 ? 'red' : 'black'}}>CPU : {data.cpu.toFixed(2)}%</div>
                                                                                                <div>
                                                                                                    RAM : {data.memory}MB
                                                                                                </div>
                                                                                                </>
                                                                                            ) : (
                                                                                                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                                                                데이터<br/>
                                                                                                수집중 
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <img src={ContainerAddLogo} style={{width:"85px", height:"85px", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}}/>
                                                                                    <div className={gridStyles.container_status} style={{width:"100%", height:"30%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                                                        <CircularProgress size="30px"/>
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </SwiperSlide>
                                                            ))}
                                                            <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                                <div className={gridStyles.container}>
                                                                    <img src={ContainerAddLogo} style={{width:"85px", height:"85px", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}} />
                                                                    <div style={{display:"flex", flexDirection:"row"}}>
                                                                        <div className={gridStyles.container_status} >
                                                                            <IconButton color='success' onClick={() => handleContainerAddClick(projectContainer)}>
                                                                                <AddCircleTwoTone />
                                                                            </IconButton>
                                                                        </div>
                                                                        <div className={gridStyles.container_status} >
                                                                            {projectContainer.taskCount === 1 || projectContainer.taskCount === 0 ? (
                                                                                <IconButton disabled color='error' onClick={() => handleContainerDeleteClick(projectContainer)}>
                                                                                    <RemoveCircleTwoTone />
                                                                                </IconButton>
                                                                            ) : (
                                                                                <IconButton color='error' onClick={() => handleContainerDeleteClick(projectContainer)}>
                                                                                    <RemoveCircleTwoTone />
                                                                                </IconButton>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </SwiperSlide>
                                                        </Swiper>
                                                    ) : (
                                                        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", alignContent:"center", width:"100%", height:"100%"}}>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                        </div>
                                                    )  
                                                }
                                                {prePendingPj && (
                                                    <Overlay>
                                                        <CircularProgress />
                                                    </Overlay>
                                                )}
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
                                            <StyledRoot2 style={{width:"75%", height:"100%", overflow:"hidden", position:"relative"}}>
                                            {
                                                    !analLoading&&analContainer !== null ? (
                                                        <Swiper
                                                            spaceBetween={30}    // 슬라이드 사이의 간격
                                                            slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                                            // centeredSlides={true}
                                                            pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                                            navigation={true}           // 이전/다음 버튼 네비게이션
                                                            modules={[Navigation, Pagination]}
                                                        >
                                                            {analContainer.tasks.map(data => (
                                                                <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                                    <div className={gridStyles.container}>
                                                                        {
                                                                            data.lastStatus === "RUNNING" ? (
                                                                                <>
                                                                                    <img src={ContainerLogo} style={{width:"85px", height:"85px"}}/>
                                                                                    <div className={gridStyles.container_status}>
                                                                                        {
                                                                                            data.cpu !== null ? (
                                                                                                <>
                                                                                                <div style={{color: data.cpu >= 70 ? 'red' : 'black'}}>CPU : {data.cpu.toFixed(2)}%</div>
                                                                                                <div>
                                                                                                    RAM : {data.memory}MB
                                                                                                </div>
                                                                                                </>
                                                                                            ) : (
                                                                                                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                                                                데이터<br/>
                                                                                                수집중 
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <img src={ContainerAddLogo} style={{width:"85px", height:"85px", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}}/>
                                                                                    <div className={gridStyles.container_status} style={{width:"100%", height:"30%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                                                        <CircularProgress size="30px"/>
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </SwiperSlide>
                                                            ))}
                                                            <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                                <div className={gridStyles.container}>
                                                                    <img src={ContainerAddLogo} style={{width:"85px", height:"85px", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}} />
                                                                    <div style={{display:"flex", flexDirection:"row"}}>
                                                                        <div className={gridStyles.container_status} >
                                                                            <IconButton color='success' onClick={() => handleContainerAddClick(analContainer)}>
                                                                                <AddCircleTwoTone />
                                                                            </IconButton>
                                                                        </div>
                                                                        <div className={gridStyles.container_status}>
                                                                            {analContainer.taskCount === 1 || analContainer.taskCount === 0 ? (
                                                                                <IconButton disabled color='error' onClick={() => handleContainerDeleteClick(analContainer)}>
                                                                                    <RemoveCircleTwoTone />
                                                                                </IconButton>
                                                                            ) : (
                                                                                <IconButton color='error' onClick={() => handleContainerDeleteClick(analContainer)}>
                                                                                    <RemoveCircleTwoTone />
                                                                                </IconButton>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </SwiperSlide>
                                                        </Swiper>
                                                    ) : (
                                                        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", alignContent:"center", width:"100%", height:"100%"}}>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                        </div>
                                                    )  
                                                }
                                                {prePendingAn && (
                                                    <Overlay>
                                                        <CircularProgress />
                                                    </Overlay>
                                                )}
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
                                            <StyledRoot2 style={{width:"75%", height:"100%", overflow:"hidden", position:"relative"}}>
                                                {
                                                    !skLoading&&socketContainer !== null ? (
                                                        <Swiper
                                                            spaceBetween={30}    // 슬라이드 사이의 간격
                                                            slidesPerView={3.5}     // 화면에 보여질 슬라이드 수
                                                            // centeredSlides={true}
                                                            pagination={{ clickable: true }}  // 페이지 네이션 (점으로 표시되는 네비게이션)
                                                            navigation={true}           // 이전/다음 버튼 네비게이션
                                                            modules={[Navigation, Pagination]}
                                                        >
                                                            {socketContainer.tasks.map(data => (
                                                                <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                                    <div className={gridStyles.container}>
                                                                        {
                                                                            data.lastStatus === "RUNNING" ? (
                                                                                <>
                                                                                    <img src={ContainerLogo} style={{width:"85px", height:"85px"}}/>
                                                                                    <div className={gridStyles.container_status}>
                                                                                        {
                                                                                            data.cpu !== null ? (
                                                                                                <>
                                                                                                <div style={{color: data.cpu >= 70 ? 'red' : 'black'}}>CPU : {data.cpu.toFixed(2)}%</div>
                                                                                                <div>
                                                                                                    RAM : {data.memory}MB
                                                                                                </div>
                                                                                                </>
                                                                                            ) : (
                                                                                                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                                                                데이터<br/>
                                                                                                수집중 
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <img src={ContainerAddLogo} style={{width:"85px", height:"85px", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}}/>
                                                                                    <div className={gridStyles.container_status} style={{width:"100%", height:"30%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                                                        <CircularProgress size="30px"/>
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </SwiperSlide>
                                                            ))}
                                                            <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                                <div className={gridStyles.container}>
                                                                    <img src={ContainerAddLogo} style={{width:"85px", height:"85px", color:"grey", filter:"brightness(0) invert(0.7) opacity(0.5)"}} />
                                                                    <div style={{display:"flex", flexDirection:"row"}}>
                                                                        <div className={gridStyles.container_status} >
                                                                            <IconButton color='success' onClick={() => handleContainerAddClick(socketContainer)}>
                                                                                <AddCircleTwoTone />
                                                                            </IconButton>
                                                                        </div>
                                                                        <div className={gridStyles.container_status} >
                                                                            {socketContainer.taskCount === 1 || socketContainer.taskCount === 0 ? (
                                                                                <IconButton disabled color='error' onClick={() => handleContainerDeleteClick(socketContainer)}>
                                                                                    <RemoveCircleTwoTone />
                                                                                </IconButton>
                                                                            ) : (
                                                                                <IconButton color='error' onClick={() => handleContainerDeleteClick(socketContainer)}>
                                                                                    <RemoveCircleTwoTone />
                                                                                </IconButton>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </SwiperSlide>
                                                        </Swiper>
                                                    ) : (
                                                        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around", alignContent:"center", width:"100%", height:"100%"}}>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                            <Skeleton variant='h1' sx={{width:"20%", height:"90%", borderRadius:"10px", margin:"auto 0"}}/>
                                                        </div>
                                                    )  
                                                }
                                                {prePendingSk && (
                                                    <Overlay>
                                                        <CircularProgress />
                                                    </Overlay>
                                                )}
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
                                            <div className={gridStyles.log_content_header}>
                                                <ConfigProvider
                                                    theme={{
                                                        token:{
                                                            colorPrimary:"#0eaa00",
                                                            fontFamily:"SUITE-Regular",
                                                        }
                                                }}>
                                                <div style={{width:"fit-content", fontSize:"1.2rem", fontWeight:"500", display:"flex", alignItems:"center", justifyContent:"center", color:"white", gap:"0.5rem"}}>
                                                    <RemoveCircleOutline sx={{color:"white"}} /> ErrorCode
                                                </div>
                                                <Select 
                                                    showSearch
                                                    placeholder="ErrorCode"
                                                    optionFilterProp='label'
                                                    onChange={handleErrorCodeChange}
                                                    onSearch={(value) => console.log(value)}
                                                    defaultValue={"All"}
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: "All"
                                                        },
                                                        {
                                                            value: 400,
                                                            label: "400",
                                                        },
                                                        {
                                                            value: 405,
                                                            label: "405",
                                                        },
                                                        {
                                                            value: 500,
                                                            label: "500",
                                                        },
                                                    ]}
                                                    style={{width:"10%"}}
                                                />
                                                <div style={{width:"fit-content", fontSize:"1.2rem", fontWeight:"500", display:"flex", alignItems:"center", justifyContent:"center", color:"white", gap:"0.5rem"}}>
                                                    <Terminal sx={{color:"white"}} /> 출력개수
                                                </div>
                                                <Select 
                                                    placeholder="ErrorCode"
                                                    onChange={handleCountChange}
                                                    options={[
                                                        {
                                                            value: 10,
                                                            label: "10",
                                                        },
                                                        {
                                                            value: 20,
                                                            label: "20",
                                                        },
                                                        {
                                                            value: 40,
                                                            label: "40",
                                                        },
                                                    ]}
                                                    defaultValue={10}
                                                    style={{width:"10%"}}
                                                />
                                                </ConfigProvider>
                                            </div>
                                            <div>
                                                <ConfigProvider
                                                theme={{
                                                    components:{
                                                        Collapse:{
                                                            contentBg: "black",
                                                        }
                                                    },
                                                    token:{
                                                        colorPrimary:"#0eaa00",
                                                        fontFamily:"SUITE-Regular",
                                                        colorText:"#20de07",
                                                        colorBorder:"black",
                                                        fontSize:"1.1rem"
                                                    }
                                                }}>
                                                    <StyledCollapse accordion items={logItems} style={{alignItems:"center"}}/>
                                                </ConfigProvider>
                                            </div>
                                            {logLoading ? (
                                                <div style={{margin:"0 auto"}}>
                                                    <CircularProgress color="success" />
                                                </div>
                                            ) : (
                                                <div style={{margin:"0 auto"}}>
                                                    <IconButton sx={{color:"grey", fontSize:"0.8rem", fontWeight:"500"}} onClick={loadMoreLog}>
                                                        <MoreHoriz sx={{color:"white"}}/> LoadMore
                                                    </IconButton>
                                                </div>
                                            )}
                                    </div>
                                </Card>
                            )}
                        {/* 아래 메뉴 바로가기 구현부 */}
                        <animated.div
                            style={{
                                ...springProps, // useSpring 애니메이션 스타일 적용
                            }}
                            className={gridStyles.menu_bar}
                            onMouseEnter={handleMouseOver}
                            onMouseLeave={handleMouseLeave}
                            >
                            <Card
                                sx={{
                                width: "98%",
                                height: "70%",
                                borderRadius: "10px",
                                backgroundColor: "rgba(0,0,30,0.3)",
                                backdropFilter: "blur(2px)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                }}
                            >
                                <div className={gridStyles.icon_box}>
                                {/* 바로가기 구현 필요 */}
                                <Card
                                    onClick={() => handleButtonClick('/cm', '코드 관리')}
                                    sx={{
                                    backgroundColor: "rgb(115 213 170)",
                                    width: "4rem",
                                    height: "4rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "10px",
                                    cursor:"pointer"
                                    }}
                                >
                                    <Code fontSize="large" sx={{ color: "white" }} />
                                </Card>
                                <Card
                                    onClick={() => handleButtonClick('/um', '사용자 관리')}
                                    sx={{
                                    backgroundColor: "rgb(137 231 244)",
                                    width: "4rem",
                                    height: "4rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "10px",
                                    cursor:"pointer"
                                    }}
                                >
                                    <ManageAccounts fontSize="large" sx={{ color: "white" }} />
                                </Card>
                                <Card
                                    onClick={() => handleButtonClick('/mm', '메뉴 관리')}
                                    sx={{
                                    backgroundColor: "rgb(255 232 131)",
                                    width: "4rem",
                                    height: "4rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "10px",
                                    cursor:"pointer"
                                    }}
                                >
                                    <Menu fontSize="large" sx={{ color: "white" }} />
                                </Card>
                                <Card
                                    onClick={() => handleButtonClick('/mal', '접속로그 조회')}
                                    sx={{
                                    backgroundColor: "rgb(192 191 249)",
                                    width: "4rem",
                                    height: "4rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "10px",
                                    cursor:"pointer"
                                    }}
                                >
                                    <Terminal fontSize="large" sx={{ color: "white" }} />
                                </Card>
                                </div>
                            </Card>
                        </animated.div>
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
                                <div className={gridStyles.online_user}>
                                    {userCnt.data.TOTAL}
                                </div>
                                <div className={gridStyles.online_icon}>
                                    <PeopleAlt fontSize='large' sx={{color:"gray"}} />
                                </div>
                            </div>
                            <div className={gridStyles.right_box_access}>
                                <div className={gridStyles.online_access}>
                                    <Engineering fontSize='small' sx={{color:"gray"}} />
                                    {userCnt.data.FP}
                                </div>
                                <div className={gridStyles.online_access}>
                                    <Business fontSize='small' sx={{color:"gray"}} />
                                    {userCnt.data.HP}
                                </div>
                                <div className={gridStyles.online_access}>
                                    <Settings fontSize='small' sx={{color:"gray"}} />
                                    {userCnt.data.ADMIN}
                                </div>
                            </div>
                        </Card>
                    </div>
                    {/* 메뉴별 접속 차트 */}
                    <div className={gridStyles.right_box_bottom}>
                        <Card sx={{width:"95%", height:"100%", borderRadius:"10px"}} >
                            <div className={gridStyles.right_bottom_logo}>
                                <div>
                                메뉴별 접속 현황
                                </div>
                                <div style={{fontSize:"0.8rem", color:"grey"}}>
                                    일주일간
                                </div>
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
                                    {
                                        menuLogArray.map(data => (
                                            <SwiperSlide style={{width:"100%", height:"100%"}}>
                                                <Card sx={{backgroundColor:"white", width:"90%", height:"100%", margin:"1rem auto", borderRadius:"15px", display:"flex", flexDirection:"column", backgroundColor:"rgb(241,244,248)"}}>
                                                    <StyledChart style={{width:"80%", margin:"0 auto"}}>
                                                        <ApexCharts
                                                            options={ChartOptions(data.menuName, dateArray)}
                                                            series={[{
                                                                name: "접속자",
                                                                data: data.dateCountList.map(d => d.count) // 차트 데이터
                                                            }]}
                                                            type="line"
                                                            height="100%"
                                                        />
                                                    </StyledChart>
                                                </Card>
                                            </SwiperSlide>
                                        ))
                                    }
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