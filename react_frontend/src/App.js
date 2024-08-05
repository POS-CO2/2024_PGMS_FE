import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {Routes, Route, useNavigate} from 'react-router';
import {login} from './utils/Api';
import SiteLayout from './SiteLayout';
import Main from './Main';
import Efm from './components/fieldinfo/Efm';
import Ps_1_2 from './components/emperf/Ps_1_2';
import Psq from './components/emperf/perflook/Psq';
import Tep from './components/emperf/perflook/Tep';
import Pd from './components/fieldinfo/project/Pd'
import Pg from './components/fieldinfo/project/Pg'
import Rm from './components/fieldinfo/project/Rm'
import Fm from './components/fieldinfo/facility/Fm';
import Fad from './components/fieldinfo/facility/Fad';
import Fam from './components/fieldinfo/facility/Fam'
import Fl from './components/fieldinfo/facility/Fl';
import Esm from './components/fieldinfo/emission/Esm';
import Sd from './components/fieldinfo/emission/Sd';
import Cm from './components/sysmng/Cm';
import Mm from './components/sysmng/Mm';
import Um from './components/sysmng/Um';
import Mal from './components/sysmng/Mal';
import Pmg from './components/emperf/Pmg';
import Login from './components/login/Login'
import Error404 from './Error404';


export default function App() {
    // 로그인 시 true
    // 로그아웃 시 토큰 비워줄 것
    // 어떤 ajax라도 401이 뜨면, 로그아웃 절차 
    const [token,setToken] = useState(null);

    const handleLogin = async (id,password) => {
        /*
            서버에 요청 후, 로컬스토리지에 토큰 저장, 실패했을 때는 저장 x
            setToken
        */
        try{
            const data = await login(id, password);
            
            localStorage.setItem('token', data.token);
            setToken(data.token);
            window.location.href="/";
        }
        catch(error){
            console.log(error);
            if (error.response.status === 400){
                alert("비밀번호가 틀렸습니다.");
                window.location.href="/";
            }
        
        }
    };

    const handleLogout = ()=>{
        /*
            로컬 스토리지 지우고
            naviage to "/"
        */
        setToken(null)
        localStorage.removeItem("token");
    }

    useEffect(()=>{
        const jwt = localStorage.getItem("token");
        if (jwt) {
            setToken(jwt);
        }
    },[]);
    
    return (
        <Router>
            <Routes>
                {(token) ? (    
                    <Route path='/' element={<SiteLayout handleLogout={handleLogout}/> }>
                    <Route index path='' element={<Main />}/>
                    {
                        /*
                            efm : 배출계수관리(emission factor management)
                            ps_1_2 : 실적Scope1,2(performance scope 1,2)
                            psq : 프로젝트별조회(project specific query)
                            tep : 총량배출실적(total emissions performance)
                            fm : 설비관리(facility management)
                            fl : 설비LIB(facility library)
                            esm : 배출원관리(emission source management)
                            sd : 증빙자료(supporting documentation)
                            cm : 코드관리(code management) 
                            um : 사용자관리(user management)
                            mm : 메뉴관리(menu management)
                            mal : 메뉴접속로그(menu access log)
    
    
                            
                        */
                    }
                        <Route path='/ps_1_2' element={<Ps_1_2/>}/>
                        <Route path='/efm' element={<Efm/>} />
                        <Route path='/psq' element={<Psq/>}/>
                        <Route path='/tep' element={<Tep/>}/>
                        <Route path='/pmg' element={<Pmg/>}/>
                        <Route path='/pd' element={<Pd/>}/>
                        <Route path='/pg' element={<Pg/>}/>
                        <Route path='/rm' element={<Rm/>}/>
                        <Route path='/fm' element={<Fm/>}/>
                        <Route path='/fad' element={<Fad/>}/>
                        <Route path='/fam' element={<Fam/>}/>
                        <Route path='/fl' element={<Fl/>}/>
                        <Route path='/esm' element={<Esm/>}/>
                        <Route path='/sd' element={<Sd/>}/>
                        <Route path='/cm' element={<Cm/>}/>
                        <Route path='/um' element={<Um/>}/>
                        <Route path='/mm' element={<Mm/>}/>
                        <Route path='/mal' element={<Mal/>}/>
                        <Route path='*' element={<Error404 />}/>
                    </Route>
                ) : (
                    <Route path='*' element={<Login handleLogin={handleLogin} />}/>
                )}
            </Routes>
        </Router>
        
    );
}

