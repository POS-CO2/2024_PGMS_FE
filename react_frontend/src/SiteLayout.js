import React, {useState, useEffect} from 'react';
import Navigation from './Navigation';
import  * as mainStyles from './assets/css/main.css';
import AppContainer from './AppContainer';
import { Outlet } from 'react-router';

const menus =
[
    {
        "level" : 1,
        "name": "배출실적",
        "menu": [
            {
                "level" : 2,
                "url" : "/ps_1_2",
                "name": "실적Scope1,2",
                "menu": []
            },
            {
                "level" : 2,
                "name": "실적조회",
                "menu" : [

                    {
                        "level" : 3,
                        "url" : "/psq",
                        "name" : "프로젝트별조회",
                        "menu" : []
                    },
                    {
                        "level" : 3,
                        "name" : "총량실적",
                        "url" : "/tep",
                        "menu" : []
                    }
                ]
            }
        ]
    },

    {
        "level" : 1,
        "name" : "현장정보",
        "menu" : [
            {
                "level" : 2,
                "name" : "설비",
                "menu" : [
                    {
                        "level" : 3,
                        "name" : "설비관리",
                        "menu" : [],
                        "url" : "/fm"
                    },
                    {
                        "level" : 3,
                        "name" : "설비활동자료",
                        "url" : "/fad",
                        "menu" : []
                    },
                    {
                        "level" : 3,
                        "url" : "/fl",
                        "name" : "설비LIB",
                        "menu" : []
                        
                    }
                ]
            },
            {
                "level" : 2,
                "name" : "배출원",
                "menu" : [
                    {
                        "level" : 3,
                        "name" : "배출원관리",
                        "url" : "/esm",
                        "menu" : []
                    },
                    {
                        "level" : 3,
                        "name" : "증빙자료",
                        "url" : "/sd",
                        "menu" : []
                    }
                ]
            },

            {
                "level" : 2,
                "url" : "/efm",
                "name" : "배출계수관리",
                "menu" : [
        
                ]
            }

        ]

        
    },

    {
        "level" : 1,
        "name" : "시스템관리",
        "menu" : [
            {
                "level" : 2,
                "name" : "코드관리",
                "url" : "/cm",
                "menu" : []
            },
            {
                "level" : 2,
                "name" : "사용자관리",
                "url" : "/um",
                "menu" : []
            },
            {
                "level": 2,
                "name" : "메뉴관리",
                "url" : "/mm",
                "menu" : []
            },
            {
                "level" : 2,
                "url" : "/mal",
                "name" : "메뉴접속로그",
                "menu" : []
            }
        ]

    }
]


export default function SiteLayout(){
    return (
        <div id={mainStyles.root}>
            <Navigation menus={menus}/>
            <AppContainer>
                <Outlet/>
            </AppContainer>
        </div>
    );
}