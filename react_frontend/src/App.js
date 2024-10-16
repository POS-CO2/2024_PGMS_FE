import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { useRecoilState } from 'recoil';
import { favState } from './atoms/tabAtoms';
import { login } from './utils/Api';
import SiteLayout from './SiteLayout';
import Main from './Main';
import Main_Hp from './Main_Hp';
import Main_Admin from './Main_Admin';
import Ps_1_2 from './components/emperf/Ps_1_2';
import Ps_1_2_Fp from './components/emperf/Ps_1_2_Fp';
import Psq from './components/emperf/perflook/Psq';
import Psq_Fp from './components/emperf/perflook/Psq_Fp';
import Tep from './components/emperf/perflook/Tep';
import Pds from './components/fieldinfo/project/detailSet/Pds';
import Esd_Fp from './components/fieldinfo/project/detailSet/Esd_Fp';
import Pg from './components/fieldinfo/project/Pg';
import Adm from './components/fieldinfo/facility/Adm';
import Fl from './components/fieldinfo/facility/Fl';
import Cm from './components/sysmng/Cm';
import Mm from './components/sysmng/Mm';
import Um from './components/sysmng/Um';
import Mal from './components/sysmng/Mal';
import Login from './components/login/Login';
import Sa from './components/analfc/Sa';
import Ea from './components/analfc/Ea';
import Ca from './components/analfc/Ca';
import Eqf from './components/analfc/Eqf';
import Error404 from './Error404';
import axiosInstance from './utils/AxiosInstance';
import { CircularProgress } from '@mui/material';
import { ContinuousColorLegend } from '@mui/x-charts';
import Swal from 'sweetalert2';

export default function App() {
    const [token, setToken] = useState(null);
    const [menu, setMenu] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [favorites, setFavorites] = useRecoilState(favState);

    const handleLogin = async (id, password) => {
        let swalOptions = {
            confirmButtonText: '확인'
        }
        try {
            const { data, headers } = await login(id, password);
            localStorage.setItem('token', headers['authorization']);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('menu', JSON.stringify(data.menu));
            window.location.href = "/";

        } catch (error) {
            if (error.response?.status === 400) {
                swalOptions.title = '실패!',
                swalOptions.text = "잘못된 아이디/비밀번호 입니다. 다시 확인해 주세요.";
                swalOptions.icon = 'error';
                Swal.fire(swalOptions);
            }
        }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.clear();
    };

    const handleMenuSet = () => {
        (async () => {
            const {data} = await axiosInstance.get('/sys/menu');
            localStorage.setItem('menu', JSON.stringify(data));
            setMenu(JSON.parse(localStorage.getItem("menu")));
        })();
    };

    // 즐겨찾기 API 호출
    const fetchFavorites = async () => {
        try {
            const response = await axiosInstance.get('/sys/log/cnt'); // 즐겨찾기 API 호출
            // logMenuList가 null이거나 undefined일 때 빈 배열을 기본값으로 설정
            const logMenuList = response.data?.logMenuList || [];
            
            // API 응답을 즐겨찾기 상태에 저장
            setFavorites(logMenuList.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        }
    };

    useEffect(() => {
        const jwt = localStorage.getItem("token");
        const roleMenu = localStorage.getItem("menu");
        const loginUser = localStorage.getItem("user");
        
        if (jwt) {
            setToken(jwt);
            setMenu(JSON.parse(roleMenu));
            setUser(JSON.parse(loginUser));
            fetchFavorites();
        }
        setLoading(false); // 로딩 완료 설정
    }, []);

    if (loading) {
        return <CircularProgress color='success' sx={{position:"fixed", top:"50%", right:"50%"}}/>; // 로딩 상태일 때 표시할 화면
    }

    return (
        <Router>
            <Routes>
                {token ? (
                    <Route path='/' element={<SiteLayout handleLogout={handleLogout} menus={menu} user={user} />}>
                        {
                            user.role === 'ADMIN'
                            ?
                            <>
                                <Route index path='' element={<Main_Admin />} />
                                <Route path='/ps_1_2' element={<Ps_1_2 />} />
                                <Route path='/psq' element={<Psq />} />
                            </>
                            :
                            (user.role === 'HP'
                            ?
                            <>
                                <Route index path='' element={<Main_Hp />} /> 
                                <Route path='/ps_1_2' element={<Ps_1_2 />} />
                                <Route path='/psq' element={<Psq />} />
                            </>
                            :
                            <>
                                <Route index path='' element={<Main />} />
                                <Route path='/ps_1_2' element={<Ps_1_2_Fp />} />
                                <Route path='/psq' element={<Psq_Fp />} />
                            </>
                            )
                        }
                        <Route path='/tep' element={<Tep />} />
                        <Route path='/pds' element={user.role === 'FP' ? <Esd_Fp /> : <Pds />} />
                        <Route path='/pg' element={<Pg />} />
                        <Route path='/adm' element={<Adm />} />
                        <Route path='/fl' element={<Fl />} />
                        <Route path='/cm' element={<Cm />} />
                        <Route path='/um' element={<Um />} />
                        <Route path='/mm' element={<Mm menus={menu} handleMenuSet={handleMenuSet} />} />
                        <Route path='/mal' element={<Mal />} />
                        <Route path='/SalesAnal' element={<Sa />} />
                        <Route path='/EquipAnal' element={<Ea />} />
                        <Route path='/ClimateAnal' element={<Ca />} />
                        <Route path='/EmissionQuantityForecast' element={<Eqf />} />
                        <Route path='*' element={<Error404 />} />
                    </Route>
                ) : (
                    <Route path='*' element={<Login handleLogin={handleLogin} />} />
                )}
            </Routes>
        </Router>
    );
}