// 필요한 서치바 여기서 만들어서 데이터 임포트 해서 사용하기
// import {formField_ps12} from "../../assets/json/searchFormData.js"
// <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_ps12}/>
// 이런식으로 사용하면됨

export const formField_ps12 = [ 
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트코드/명', required: true, modalType: '프로젝트 찾기' },
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

export const formField_pg = [
    { type: 'InputText', name: 'pjtCode', label: '프로젝트코드'},
    { type: 'InputText', name: 'pjtName', label: '프로젝트명'},
    { type: 'InputText', name: 'managerId', label: '담당자사번'},
    { type: 'InputText', name: 'managerName', label: '담당자명'},
    { type: 'InputText', name: 'DivName', label: '본부명'},
    { type: 'DropDown', name: 'PjtProgStus', label: '프로젝트진행상태', options: [
        {value: '1', label: 1},
        {value: '2', label: 2},
        {value: '3', label: 9},
    ]},
    { type: 'DropDown', name: 'reg', label: '지역', options: [
        {value: '1', label: '서울'},
        {value: '2', label: '강원도'},
        {value: '3', label: '대전'},
        {value: '4', label: '충남'},
        {value: '5', label: '충북'},
        {value: '6', label: '인천'},
        {value: '7', label: '경기도'},
        {value: '8', label: '광주'},
        {value: '9', label: '전남'},
        {value: '10', label: '전남 광양시'},
        {value: '11', label: '전북'},
        {value: '12', label: '부산'},
        {value: '13', label: '울산'},
        {value: '14', label: '제주'},
        {value: '15', label: '대구'},
        {value: '16', label: '경남'},
        {value: '17', label: '경북 포항시'},
        {value: '18', label: '세종시'},
    ]}
]

export const formField_fl = [
    { type: 'InputText', name: 'EquipName', label: '설비LIB명'},
    { type: 'DropDown', name: 'EqupDvs', label: '설비구분', options: [
        {value: '1', label: 1},
        {value: '2', label: 2},
        {value: '3', label: 3},
        {value: '4', label: 4},
        {value: '5', label: 5}
    ]},
    { type: 'DropDown', name: 'EquipType', label: '설비유형', options: [
        {value: '1', label: 1},
        {value: '2', label: 3},
        {value: '3', label: 6},
        {value: '4', label: 9},
        {value: '5', label: 11}
    ]},
    { type: 'DropDown', name: 'EquipSpecUnit', label: '설비사양단위', options: [
        {value: '1', label: 'kWh'},
        {value: '2', label: 'ℓ'},
        {value: '3', label: 'TJ'},
        {value: '4', label: 'N㎥'}
    ]},
]

export const formField_fam = [
    { type: 'InputText', name: 'ActvDataName', label: '활동자료명'},
    { type: 'DropDown', name: 'ActvDataDvs', label: '활동자료구분', options: [
        {value: '1', label: '제철용 PCI탄'},
        {value: '2', label: '석유코크(고체)'},
        {value: '3', label: '폐기물 소각열'},
        {value: '4', label: '공정폐열'},
        {value: '5', label: '원유'},
        {value: '6', label: '오리멀젼'},
        {value: '7', label: '천연가스액(NGL)'},
        {value: '8', label: '휘발유'}
    ]}
]

export const formField_fad = [
    { type: 'SearchAtModal', name: 'searchLib', label: '설비LIB명', required: true, modalType: '설비LIB 찾기' }
];

// 필요한 서치바 여기서 만들어서 데이터 임포트 해서 사용하기
// import {formField_ps12} from "../../assets/json/searchFormData.js"
// import { formField_ps12 } from './searchFormData';
// 이런식으로 사용하면됨