// 필요한 서치바 여기서 만들어서 데이터 임포트 해서 사용하기
// import {formField_ps12} from "../../assets/json/searchFormData.js"
// <SearchForms onFormSubmit={handleFormSubmit} formFields={formField_ps12}/>
// 이런식으로 사용하면됨

export const formField_ps12 = [ 
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트코드/명', required: true, modalType: '프로젝트 찾기' },
    { type: 'DropDown', name: 'actvYear', label: '대상년도', required: true, options: []/*, defaultSelected: true*/ },
    { type: 'DropDown', name: 'emtnActvType', label: '배출활동유형', options: [] },
];

export const formField_ps12_fp = [ 
    { type: 'DropDown', name: 'searchProject', label: '프로젝트코드/명', required: true, options: [] },
    { type: 'DropDown', name: 'actvYear', label: '대상년도', required: true, options: []/*, defaultSelected: true*/ },
    { type: 'DropDown', name: 'emtnActvType', label: '배출활동유형', options: [] },
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
    { type: 'InputYear', name: 'year', label: '대상년도', required: true, defaultSelected: true }
];

export const formField_psq = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트코드/명', required: true, modalType: '프로젝트 찾기' },
    { type: 'DropDown', name: 'actvYear', label: '대상년도', required: true, options: [] },
];

export const formField_psq_fp = [
    { type: 'DropDown', name: 'searchProject', label: '프로젝트코드/명', required: true, options: [] },
    { type: 'DropDown', name: 'actvYear', label: '대상년도', required: true, options: []/*, defaultSelected: true*/ },
];

export const formField_esm = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트코드/명', required: true, modalType: '프로젝트 찾기' },
];

export const formField_esm_fp = [
    { type: 'DropDown', name: 'searchProject', label: '프로젝트코드/명', required: true, options: [] },
];

export const formField_sd = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트코드/명', required: true, modalType: '프로젝트 찾기' },
];

export const formField_cm = [
    { type: 'InputText', name: 'codeGrpNo', label: '코드그룹ID'},
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
    { type: 'InputText', name: 'userName', label: "이름"},
    { type: 'InputText', name: 'loginId', label: "로그인ID"},
    { type: 'DropDown', name: 'deptCode', label: "부서명", options: []},
    { type: 'DropDown', name: 'role', label: '접근권한', required: false, options: [
        {value: 'FP', label: '현장 담당자'},
        {value: 'HP', label: '본사 담당자'},
        {value: 'ADMIN', label: '시스템 관리자'},
    ]},
]

export const formField_fm = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트명/코드', required: true, modalType: '프로젝트 찾기' },
]

export const formField_efm = [
    { type: 'InputText', name: 'actvDataName', label: "활동자료명"},
]
export const formField_pg = [
    { type: 'InputText', name: 'pjtCode', label: '프로젝트코드'},
    { type: 'InputText', name: 'pjtName', label: '프로젝트명'},
    { type: 'DropDown', name: 'reg', label: '지역', options: []},
    { type: 'SelectCalendar', name: 'calendar', label: '조회기간' },
    { type: 'DropDown', name: 'divCode', label: '본부명', options: []},
    { type: 'DropDown', name: 'pjtProgStus', label: '프로젝트진행상태', options: []},
    { type: 'InputText', name: 'managerId', label: '담당자사번'},
    { type: 'InputText', name: 'managerName', label: '담당자명'},
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
    { type: 'DropDown', name: 'equipDvs', label: '설비구분', options: []},
    { type: 'DropDown', name: 'equipType', label: '설비유형', options: []},
    { type: 'DropDown', name: 'equipSpecUnit', label: '설비사양단위', options: []}
]

export const formField_fam = [
    { type: 'InputText', name: 'actvDataName', label: '활동자료명'},
    { type: 'DropDown', name: 'actvDataDvs', label: '활동자료구분', options: []},
    { type: 'DropDown', name: 'emtnActvType', label: '배출활동유형', options: []},
    { type: 'DropDown', name: 'inputUnit', label: '입력단위', options: []}
]

export const formField_fad = [
    { type: 'SearchAtModal', name: 'searchLib', label: '설비LIB명', required: true, modalType: '설비LIB 찾기' }
];

export const formField_sa = [
    { type: 'SelectCalendar', name: 'calendar', label: '분석기간', required: true, isAnal: true }
];

export const formField_ea = [
    { type: 'SelectCalendar', name: 'calendar', label: '분석기간', required: true, isAnal: true },
    { type: 'DropDown', name: 'selected', label: '분석기준', required: true, options: [
        { value: '설비LIB', label: '설비LIB' },
        { value: '설비유형', label: '설비유형' },
        { value: '에너지원', label: '에너지원' }
    ], defaultSelected: true }
];

export const formField_ca = [
    { type: 'SelectCalendar', name: 'calendar', label: '분석기간', required: true, isAnal: true },
    { type: 'DropDown', name: 'regCode', label: '지역', required: true, options: [
        { value: '서울', label: '100' },
        { value: '강원도', label: '300' },
        { value: '대전', label: '500' },
        { value: '충남', label: '700' },
        { value: '충북', label: '900' },
        { value: '인천', label: '1100' },
        { value: '경기도', label: '1300' },
        { value: '광주', label: '1500' },
        { value: '전남', label: '1700' },
        { value: '전남 광양시', label: '1719' },
        { value: '전북', label: '1900' },
        { value: '부산', label: '2100' },
        { value: '울산', label: '2300' },
        { value: '제주', label: '2500' },
        { value: '대구', label: '2700' },
        { value: '경남', label: '2900' },
        { value: '경북', label: '3100' },
        { value: '경북 포항시', label: '3122' },
        { value: '세종시', label: '3400' }
    ], defaultSelected: true },
    { type: 'DropDown', name: 'selected', label: '영향인자', required: true, options: [
        { value: '평균기온', label: '평균기온' },
        { value: '평균강수량', label: '평균강수량' },
        { value: '평균습도', label: '평균습도' }
    ], defaultSelected: true }
];

// 필요한 서치바 여기서 만들어서 데이터 임포트 해서 사용하기
// import {formField_ps12} from "../../assets/json/searchFormData.js"
// import { formField_ps12 } from './searchFormData';
// 이런식으로 사용하면됨