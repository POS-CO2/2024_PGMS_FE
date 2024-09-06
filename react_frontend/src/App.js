import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { RecoilRoot } from 'recoil';
import { login } from './utils/Api';
import SiteLayout from './SiteLayout';
import Main from './Main';
import Efm from './components/fieldinfo/Efm';
import Ps_1_2 from './components/emperf/Ps_1_2';
import Psq from './components/emperf/perflook/Psq';
import Tep from './components/emperf/perflook/Tep';
import Pd from './components/fieldinfo/project/Pd';
import Pg from './components/fieldinfo/project/Pg';
import Rm from './components/fieldinfo/project/Rm';
import Fm from './components/fieldinfo/facility/Fm';
import Fad from './components/fieldinfo/facility/Fad';
import Fam from './components/fieldinfo/facility/Fam';
import Fl from './components/fieldinfo/facility/Fl';
import Esm from './components/fieldinfo/emission/Esm';
import Sd from './components/fieldinfo/emission/Sd';
import Cm from './components/sysmng/Cm';
import Mm from './components/sysmng/Mm';
import Um from './components/sysmng/Um';
import Mal from './components/sysmng/Mal';
import Pmg from './components/emperf/Pmg';
import Login from './components/login/Login';
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
    console.log(menu);
    return (
        <RecoilRoot>
            <Router>
                <Routes>
                    {token ? (
                        <Route path='/' element={<SiteLayout handleLogout={handleLogout} menus={menu} user={user} />}>
                            <Route index path='' element={<Main />} />
                            <Route path='/ps_1_2' element={<Ps_1_2 />} />
                            <Route path='/efm' element={<Efm />} />
                            <Route path='/psq' element={<Psq />} />
                            <Route path='/tep' element={<Tep />} />
                            <Route path='/pmg' element={<Pmg />} />
                            <Route path='/pd' element={<Pd />} />
                            <Route path='/pg' element={<Pg />} />
                            <Route path='/rm' element={<Rm />} />
                            <Route path='/fm' element={<Fm />} />
                            <Route path='/fad' element={<Fad />} />
                            <Route path='/fam' element={<Fam />} />
                            <Route path='/fl' element={<Fl />} />
                            <Route path='/esm' element={<Esm />} />
                            <Route path='/sd' element={<Sd />} />
                            <Route path='/cm' element={<Cm />} />
                            <Route path='/um' element={<Um />} />
                            <Route path='/mm' element={<Mm menus={menu} handleMenuSet={handleMenuSet} />} />
                            <Route path='/mal' element={<Mal />} />
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