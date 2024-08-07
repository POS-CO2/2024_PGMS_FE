import React from 'react';
import Table from "./Table.js";
import * as tableStyles from "./assets/css/newTable.css"
import { ButtonGroup } from './Button';

export default function TableCustom({ title, data, buttons, onRowClick }) {
    return (
        <>
            <div className={tableStyles.container}>
                <div className={tableStyles.table_title}>{title}</div>
                <ButtonGroup buttons={buttons} />
            </div>
            <Table data={data} onRowClick={onRowClick} />
        </>
    );
}