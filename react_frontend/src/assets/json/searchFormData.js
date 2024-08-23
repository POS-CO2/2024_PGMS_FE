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
    { type: 'DropDown', name: 'equipType', label: '배출활동유형', required: true, options: [
        { value: 'option1', label: 'OptionOption 1' },
        { value: 'option2', label: 'OptionOpt 2' },
        { value: 'option3', label: 'OptionOptio 3' },
        { value: 'option4', label: 'OptionOption 4' },
        { value: 'option5', label: 'OptionOp 5' }
    ] },
    { type: 'InputText', name: 'equipName', label: '설비명' },
];

export const formField_ps12_fm = [ 
    { type: 'DropDown', name: 'searchProject', label: '프로젝트코드/명', required: true, options: [
        { value: 'B80593CA', label: 'B80593CA/양산 석산지역주택조합 공동주택' },
        { value: 'E00503CA', label: 'E00503CA/포항 6코크스 신설(공사) 1차(사전공사)' },
        { value: '070687CA', label: '070687CA/삼진태양광' }
    ] },
    { type: 'DropDown', name: 'actvYear', label: '대상년도', required: true, options: [
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
        { value: '2021', label: '2021' },
        { value: '2020', label: '2020' }
    ], defaultSelected: true },
    { type: 'DropDown', name: 'equipType', label: '배출활동유형', required: true, options: [
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

export const formField_psq = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트코드/명', required: true, modalType: '프로젝트 찾기' },
    { type: 'DropDown', name: 'actvYear', label: '대상년도', required: true, options: [
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
        { value: '2021', label: '2021' },
        { value: '2020', label: '2020' }
    ], defaultSelected: true },
];

export const formField_psq_fm = [
    { type: 'DropDown', name: 'searchProject', label: '프로젝트코드/명', required: true, options: [
        { value: 'B80593CA', label: 'B80593CA/양산 석산지역주택조합 공동주택' },
        { value: 'E00503CA', label: 'E00503CA/포항 6코크스 신설(공사) 1차(사전공사)' },
        { value: '070687CA', label: '070687CA/삼진태양광' }
    ] },
    { type: 'DropDown', name: 'actvYear', label: '대상년도', required: true, options: [
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
        { value: '2021', label: '2021' },
        { value: '2020', label: '2020' }
    ], defaultSelected: true },
];

export const formField_esm = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트코드/명', required: true, modalType: '프로젝트 찾기' },
];

export const formField_esm_fm = [
    { type: 'DropDown', name: 'searchProject', label: '프로젝트코드/명', required: true, options: [
        { value: 'B80593CA', label: 'B80593CA/양산 석산지역주택조합 공동주택' },
        { value: 'E00503CA', label: 'E00503CA/포항 6코크스 신설(공사) 1차(사전공사)' },
        { value: '070687CA', label: '070687CA/삼진태양광' }
    ] },
];

export const formField_sd = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트코드/명', required: true, modalType: '프로젝트 찾기' },
];

export const formField_cm = [
    { type: 'InputText', name: 'codeGrpNo', label: '코드그룹ID'},
    { type: 'InputText', name: 'codeGrpName', label: '코드그룹 이름'},
    { type: 'InputText', name: 'codeGrpNameEn', label: '코드그룹 영문이름'},
    { type: 'InputText', name: 'note', label: '노트'},
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
    { type: 'InputText', name: 'loginId', label: "사용자 아이디"},
    { type: 'DropDown', name: 'deptCode', label: "부서 명", options: []},
    { type: 'DropDown', name: 'role', label: '권한', required: false, options: [
        {value: 'FP', label: '현장 담당자'},
        {value: 'HP', label: '본사 담당자'},
        {value: 'ADMIN', label: '시스템 관리자'},
    ]},
]

export const formField_fm = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트명/코드', modalType: '프로젝트 찾기' },
]

export const formField_efm = [
    { type: 'InputText', name: 'actvDataName', label: "활동자료명"},
]
export const formField_pg = [
    { type: 'InputText', name: 'pjtCode', label: '프로젝트코드'},
    { type: 'InputText', name: 'pjtName', label: '프로젝트명'},
    { type: 'InputText', name: 'managerId', label: '담당자사번'},
    { type: 'InputText', name: 'managerName', label: '담당자명'},
    { type: 'InputText', name: 'DivName', label: '본부명'},
    { type: 'DropDown', name: 'PjtProgStus', label: '프로젝트진행상태', options: []},
    { type: 'DropDown', name: 'reg', label: '지역', options: []},
    { type: 'SelectCalendar', name: 'calendar', label: '조회기간' }
]

const currentYear = new Date().getFullYear();
const startYear = currentYear - 10; // 현재 연도 기준 10년 전까지 (2020년까지)
const yearsOptions = [];
for (let year = currentYear; year >= startYear; year--) {
    yearsOptions.push({
        value: year.toString(),
        label: year
    });
}

export const formField_rm = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트코드/명', required: true, modalType: '프로젝트 찾기' },
    { type: 'DropDown', name: 'searchYear', label: '조회년도', required: true, options: yearsOptions, defaultSelected: true }
]

export const formField_fl = [
    { type: 'InputText', name: 'equipLibName', label: '설비LIB명'},
    { type: 'DropDown', name: 'equpDvs', label: '설비구분', options: []},
    { type: 'DropDown', name: 'equipType', label: '설비유형', options: []},
    { type: 'DropDown', name: 'equipSpecUnit', label: '설비사양단위', options: []}
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
    ]},
    { type: 'DropDown', name: 'equipType', label: '배출활동유형', options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        { value: 'option4', label: 'Option 4' },
        { value: 'option5', label: 'Option 5' }
    ] },
    { type: 'DropDown', name: 'calUnitCode', label: '산정단위', options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        { value: 'option4', label: 'Option 4' },
        { value: 'option5', label: 'Option 5' }
    ] },

]

export const formField_fad = [
    { type: 'SearchAtModal', name: 'searchLib', label: '설비LIB명', required: true, modalType: '설비LIB 찾기' }
];

// 필요한 서치바 여기서 만들어서 데이터 임포트 해서 사용하기
// import {formField_ps12} from "../../assets/json/searchFormData.js"
// import { formField_ps12 } from './searchFormData';
// 이런식으로 사용하면됨