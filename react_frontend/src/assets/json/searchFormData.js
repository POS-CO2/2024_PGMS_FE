export const formField_ps12 = [
    { type: 'SearchAtModal', name: 'searchProject', label: '프로젝트명/코드', modalType: '프로젝트 찾기' },
    { type: 'SearchAtModal', name: 'searchLib', label: '설비LIB명', modalType: '설비LIB 찾기' },
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

export const formField_cm = [
    { type: 'InputText', name: 'codeGroupId', label: '코드그룹ID'},
]

// 필요한 서치바 여기서 만들어서 데이터 임포트 해서 사용하기
// import {formField_ps12} from "../../assets/json/searchFormData.js"
// import { formField_ps12 } from './searchFormData';
// 이런식으로 사용하면됨