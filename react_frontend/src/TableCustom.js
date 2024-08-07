import React from 'react';
import Table from "./Table.js";
import * as tableStyles from "./assets/css/newTable.css"
import { AddButton, AddAndDeleteButton, AllButton } from "./Button.js";
import PdModal from "./modals/PdModal.js";

export default function TablePage({ title, data, button, onRowClick, modal }) {
    let ButtonComponent;

    const renderModal = () => {
        return <PdModal isModalOpen={modal.isModalOpen} handleOk={modal.handleOk} handleCancel={modal.handleCancel}/>
    }

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
                    {ButtonComponent && <ButtonComponent onClick={modal.buttonClick} />}
                </div>

                {renderModal()}
            </div>
            <Table data={data} onRowClick={onRowClick}/>
        </>
    );
}