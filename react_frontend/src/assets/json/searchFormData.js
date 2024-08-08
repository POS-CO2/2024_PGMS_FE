// 필요한 서치바 여기서 만들어서 데이터 임포트 해서 사용하기
// import {formField_ps12} from "../../assets/json/searchFormData.js"
// <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_ps12}/>
// 이런식으로 사용하면됨

export const formField_ps12 = [ 
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트코드/명', /*required: true,*/ modalType: '프로젝트 찾기' },
    { type: 'DropDown', name: 'actvYear', label: '대상년도', required: true, options: [
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
        { value: '2021', label: '2021' },
        { value: '2020', label: '2020' }
    ], defaultSelected: true },
    { type: 'DropDown', name: 'equipType', label: '배출활동유형', options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        { value: 'option4', label: 'Option 4' },
        { value: 'option5', label: 'Option 5' }
    ] },
    { type: 'InputText', name: 'equipName', label: '설비명' },
];

export const formFieldEx1 = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트명/코드', modalType: '프로젝트 찾기' },
    { type: 'SearchAtModal', name: 'searchLib', label: '설비LIB명', modalType: '설비LIB 찾기' },
    { type: 'SearchAtModal', name: 'ModalTest', label: 'default', required: true },
    { type: 'InputText', name: 'email', label: '이메일' },
    { type: 'DropDown', name: 'dropDown1', label: '드롭다운', options: [
        { value: '1', label: '안' },
        { value: '2', label: '녕' },
        { value: '3', label: '하' },
        { value: '4', label: '세' },
        { value: '5', label: '요' }
    ] },
    { type: 'DropDown', name: 'dropDown2', label: '필수 드롭다운', required: true, options: [
        { value: '1', label: '안' },
        { value: '2', label: '녕' },
        { value: '3', label: '하' },
        { value: '4', label: '세' },
        { value: '5', label: '요' }
    ], defaultSelected: true },
    { type: 'SelectCalendar', name: 'calendar', label: '날짜선택' }
];

export const formFieldEx2 = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트명/코드', modalType: '프로젝트 찾기' },
    { type: 'InputText', name: 'email', label: '이메일' },
    { type: 'SelectCalendar', name: 'calendar', label: '날짜선택' }
]

export const formField_tep = [
    { type: 'DropDown', name: 'actvYear', label: '대상년도', required: true, options: [
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
        { value: '2021', label: '2021' },
        { value: '2020', label: '2020' }
    ], defaultSelected: true },
];


export const formField_cm = [
    { type: 'InputText', name: 'codeGroupId', label: '코드그룹ID'},
]

export const formField_um = [
    { type: 'InputText', name: 'loginId', label: '로그인 아이디'},
    { type: 'InputText', name: 'name', label: '이름'},
    { type: 'DropDown', name: 'priviledge', label: '권한', required: true, options: [
        {value: '1', label: '현장 담당자'},
        {value: '2', label: '본사 담당자'},
        {value: '3', label: '시스템 관리자'},
    ]},
]

export const formField_mal = [
    { type: 'InputText', name: 'userName', label: "사용자명"},
    { type: 'InputText', name: 'userID', label: "사용자 아이디"},
    { type: 'SelectCalendar', name: 'calendar', label: "조회기간"},
]

export const formField_fm = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트명/코드', modalType: '프로젝트 찾기' },
]

export const formField_efm = [
    { type: 'InputText', name: 'actvDataName', label: "활동자료명"},
    { type: 'InputText', name: 'applyYear', label: "적용년도"},
    { type: 'DropDown', name: 'applydvs', label: "적용구분", options: [
        {value: '1', label: '적용구분1'},
        {value: '2', label: '적용구분2'},
        {value: '3', label: '적용구분3'},
    ]},
    { type: 'DropDown', name: 'ghgCode', label: "온실가스코드", options: [
        {value: '1', label: '온가코1'},
        {value: '2', label: '온가코2'},
        {value: '3', label: '온가코3'},
    ]},
    { type: 'DropDown', name: 'coefClassCode', label: "계수구분코드", options: [
        {value: '1', label: '계구코1'},
        {value: '2', label: '계구코2'},
        {value: '3', label: '계구코3'},
    ]},
    { type: 'DropDown', name: 'unitCode', label: "단위코드", options: [
        {value: '1', label: '단코1'},
        {value: '2', label: '단코2'},
        {value: '3', label: '단코3'},
    ]},
]
// 필요한 서치바 여기서 만들어서 데이터 임포트 해서 사용하기
// import {formField_ps12} from "../../assets/json/searchFormData.js"
// import { formField_ps12 } from './searchFormData';
// 이런식으로 사용하면됨