import React from 'react';
import * as favoriteStyles from './assets/css/favorite.css';

function Favorite({handleFavClick, fav, favRef, dragFavStart, dragFavMove, dropFav}) {
    
    if (fav) {
        return (
            <div className={favoriteStyles.favorite} ref={favRef}
                draggable
                onDragStart={dragFavStart}
                onDrag={dragFavMove}
                onDragEnd={dropFav}
            >
                <div className={favoriteStyles.title} onClick={() => handleFavClick()}
                >즐겨찾기</div>
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
    else {
        return (
            <div className={favoriteStyles.fold_favorite} onClick={() => handleFavClick()} ref={favRef}
                draggable
                onDragStart={dragFavStart}
                onDrag={dragFavMove}
                onDragEnd={dropFav}
            >
                <div className={favoriteStyles.fold_text}>★</div>
            </div>
        )
    }
    
}

export default Favorite;