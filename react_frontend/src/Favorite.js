import React from 'react';
import * as favoriteStyles from './assets/css/favorite.css';

function Favorite({handleMenuClick}) {
    
    const cm = {
        "level" : 2,
        "name" : "코드 관리",
        "url" : "/cm",
        "menu" : []
    }
    const um = {
        "level" : 2,
        "name" : "사용자 관리",
        "url" : "/um",
        "menu" : []
    }
    const mm = {
        "level": 2,
        "name" : "메뉴 관리",
        "url" : "/mm",
        "menu" : []
    }
    const mal = {
        "level" : 2,
        "url" : "/mal",
        "name" : "접속로그 조회",
        "menu" : []
    }
    return (
        <div className={favoriteStyles.favorite}>
            <div className={favoriteStyles.title}>즐겨찾기</div>
            {/* 메뉴 즐겨찾기 설정 시 아래 코드 새로운 컴포넌트로 생성 후 매핑 */}
            <div className={favoriteStyles.content}>
                <ul>
                    <li>코드 관리</li>
                    <li>사용자 관리</li>
                    <li>메뉴 관리</li>
                    <li>접속로그 조회</li>
                </ul>
            </div>
        </div>
    );
}

export default Favorite;