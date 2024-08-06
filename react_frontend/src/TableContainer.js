import React from 'react';
import Table from "./Table.js";
import * as tableStyles from "./assets/css/newTable.css"
import { AddButton, AddAndDeleteButton, AllButton } from "./Button.js";

export default function TablePage({ title, data, button }) {
    let ButtonComponent;
    switch (button) {
        case 'AddButton':
            ButtonComponent = AddButton;
            break;
        case 'AddAndDeleteButton':
            ButtonComponent = AddAndDeleteButton;
            break;
        case 'AllButton':
            ButtonComponent = AllButton;
            break;
        default:
            ButtonComponent = null;
    }

    return (
        <>
            <div className={tableStyles.container}>
                <div className={tableStyles.table_title}>{title}</div>
                <div style={{ marginRight: '23px' }}>
                    {ButtonComponent && <ButtonComponent />}
                </div>
            </div>
            <Table data={data} />
        </>
    );
}