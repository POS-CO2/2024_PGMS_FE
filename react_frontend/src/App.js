import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {Routes, Route} from 'react-router';
import SiteLayout from './SiteLayout';
import Main from './Main';
import Efm from './components/Efm';
import Ps_1_2 from './components/Ps_1_2';
import Psq from './components/Psq';
import Tep from './components/Tep';
import Fm from './components/Fm';
import Fad from './components/Fad';
import Fl from './components/Fl';
import Esm from './components/Esm';
import Sd from './components/Sd';
import Cm from './components/Cm';
import Mm from './components/Mm';
import Um from './components/Um';
import Mal from './components/Mal';
import Error404 from './Error404';


export default function App() {
    
    
    return (
        <Router>
            <Routes>
                <Route path='/' element={<SiteLayout /> }>
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
                    <Route path='/fm' element={<Fm/>}/>
                    <Route path='/fad' element={<Fad/>}/>
                    <Route path='/fl' element={<Fl/>}/>
                    <Route path='/esm' element={<Esm/>}/>
                    <Route path='/sd' element={<Sd/>}/>
                    <Route path='/cm' element={<Cm/>}/>
                    <Route path='/um' element={<Um/>}/>
                    <Route path='/mm' element={<Mm/>}/>
                    <Route path='/mal' element={<Mal/>}/>
                    <Route path='*' element={<Error404 />}/>
                </Route>
                
            </Routes>
        </Router>
        
    );
}

