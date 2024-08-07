import React, { useState } from 'react';
import * as gridStyles from './assets/css/grid.css'

export default function Main() {
    

    return (
            <div className={gridStyles.grid_container}>
                <div className={gridStyles.box1}>box1</div>
                <div className={gridStyles.box2}>box2</div>
                <div className={gridStyles.box3}>box3</div>
                <div className={gridStyles.box4}>box4</div>
                <div className={gridStyles.box5}>box5</div>
                <div className={gridStyles.box6}>box6</div>
            </div>
    );
}