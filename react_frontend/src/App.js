import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { RecoilRoot } from 'recoil';
import { login } from './utils/Api';
import SiteLayout from './SiteLayout';
import Main from './Main';
import Main_Hp from './Main_Hp';
import Main_Admin from './Main_Admin';
import Efm from './components/fieldinfo/Efm';
import Ps_1_2 from './components/emperf/Ps_1_2';
import Ps_1_2_Fp from './components/emperf/Ps_1_2_Fp';
import Psq from './components/emperf/perflook/Psq';
import Psq_Fp from './components/emperf/perflook/Psq_Fp';
import Tep from './components/emperf/perflook/Tep';
import Pds from './components/fieldinfo/project/detailSet/Pds';
import Pg from './components/fieldinfo/project/Pg';
import Fm from './components/fieldinfo/facility/Fm';
import Fad from './components/fieldinfo/facility/Fad';
import Adm from './components/fieldinfo/facility/Adm';
import Fl from './components/fieldinfo/facility/Fl';
import Esm from './components/fieldinfo/emission/Esm';
import Esm_Fp from './components/fieldinfo/emission/Esm_Fp';
import Sd from './components/fieldinfo/emission/Sd';
import Cm from './components/sysmng/Cm';
import Mm from './components/sysmng/Mm';
import Um from './components/sysmng/Um';
import Mal from './components/sysmng/Mal';
import Pmg from './components/emperf/Pmg';
import Login from './components/login/Login';
import Sa from './components/analfc/Sa';
import Ea from './components/analfc/Ea';
import Ca from './components/analfc/Ca';
import Error404 from './Error404';
import axiosInstance from './utils/AxiosInstance';

export default function App() {
    const [token, setToken] = useState(null);
    const [menu, setMenu] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    const handleLogin = async (id, password) => {
        try {
            const { data, headers } = await login(id, password);
            localStorage.setItem('token', headers['authorization']);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('menu', JSON.stringify(data.menu));
            window.location.href = "/";
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                alert("비밀번호가 틀렸습니다.");
            }
        }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("menu");
        localStorage.removeItem("user");
        localStorage.removeItem("tabs");
        localStorage.removeItem("activeTab");
    };

    const handleMenuSet = () => {
        (async () => {
            const {data} = await axiosInstance.get('/sys/menu');
            localStorage.setItem('menu', JSON.stringify(data));
            setMenu(JSON.parse(localStorage.getItem("menu")));
        })();
    };

    useEffect(() => {
        const jwt = localStorage.getItem("token");
        const roleMenu = localStorage.getItem("menu");
        const loginUser = localStorage.getItem("user");
        if (jwt) {
            setToken(jwt);
            setMenu(JSON.parse(roleMenu));
            setUser(JSON.parse(loginUser));
        }
        setLoading(false); // 로딩 완료 설정
    }, []);

    if (loading) {
        return <div>Loading...</div>; // 로딩 상태일 때 표시할 화면
    }

    return (
        <RecoilRoot>
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
                                    <Route path='/esm' element={<Esm />} />
                                </>
                                :
                                (user. role === 'HP'
                                ?
                                <>
                                    <Route index path='' element={<Main_Hp />} /> 
                                    <Route path='/ps_1_2' element={<Ps_1_2 />} />
                                    <Route path='/psq' element={<Psq />} />
                                    <Route path='/esm' element={<Esm />} />
                                </>
                                :
                                <>
                                    <Route index path='' element={<Main />} />
                                    <Route path='/ps_1_2' element={<Ps_1_2_Fp />} />
                                    <Route path='/psq' element={<Psq_Fp />} />
                                    <Route path='/esm' element={<Esm_Fp />} />
                                </>
                                )
                            }
                            <Route path='/efm' element={<Efm />} />
                            <Route path='/tep' element={<Tep />} />
                            <Route path='/pmg' element={<Pmg />} />
                            <Route path='/pds' element={<Pds />} />
                            <Route path='/pg' element={<Pg />} />
                            <Route path='/fm' element={<Fm />} />
                            <Route path='/fad' element={<Fad />} />
                            <Route path='/adm' element={<Adm />} />
                            <Route path='/fl' element={<Fl />} />
                            <Route path='/sd' element={<Sd />} />
                            <Route path='/cm' element={<Cm />} />
                            <Route path='/um' element={<Um />} />
                            <Route path='/mm' element={<Mm menus={menu} handleMenuSet={handleMenuSet} />} />
                            <Route path='/mal' element={<Mal />} />
                            <Route path='/SalesAnal' element={<Sa />} />
                            <Route path='/EquipAnal' element={<Ea />} />
                            <Route path='/ClimateAnal' element={<Ca />} />
                            <Route path='*' element={<Error404 />} />
                        </Route>
                    ) : (
                        <Route path='*' element={<Login handleLogin={handleLogin} />} />
                    )}
                </Routes>
            </Router>
        </RecoilRoot>
    );
}