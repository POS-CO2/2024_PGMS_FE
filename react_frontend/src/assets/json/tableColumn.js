export const pjtColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'pjtCode', label: '프로젝트 코드', hidden: false },
    { key: 'pjtName', label: '프로젝트 이름', hidden: false },
    { key: 'pjtType', label: '프로젝트 유형', hidden: false },
    { key: 'regCode', label: '지역 코드', hidden: false },
    { key: 'ctrtFrYear', label: '계약 시작 년', hidden: false },
    { key: 'ctrtFrMth', label: '계약 시작 월', hidden: false },
    { key: 'ctrtToYear', label: '계약 종료 년', hidden: false },
    { key: 'ctrtToMnt', label: '계약 종료 월', hidden: false },
    { key: 'divCode', label: '본부 코드', hidden: false },
    { key: 'bldArea', label: '연면적값', hidden: false },
    { key: 'pjtProgStus', label: '프로젝트진행 상태', hidden: false },
    { key: 'pgmsYn', label: 'Y/N', hidden: false },
    { key: 'userLoginId', label: '로그인 아이디', hidden: true },
    { key: 'userName', label: '유저 명', hidden: true },
    { key: 'startDate', label: '시작 일', hidden: true },
    { key: 'endDate', label: '종료 일', hidden: true },
]

export const equipColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'equipDvs', label: '설비구분', hidden: false },
    { key: 'equipLibName', label: '설비LIB명', hidden: false },
    { key: 'equipName', label: '설비명', hidden: false },
    { key: 'equipSpecUnit', label: '설비사양단위', hidden: false },
    { key: 'equipType', label: '설비유형', hidden: false },
]

export const equipLibColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'equipLibId', label: '설비LIB아이디', hidden: false },
    { key: 'pjtId', label: '프로젝트 ID', hidden: false },
    { key: 'equipName', label: '설비 명', hidden: false },
    { key: 'creatorId', label: '생성자', hidden: true },
    { key: 'createDate', label: '생성일', hidden: true },
    { key: 'mdfrId', label: '수정자', hidden: true },
    { key: 'updateDate', label: '수정일', hidden: true },
]

export const codeColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'codeGrpNo', label: '코드그룹ID', hidden: false },
    { key: 'codeGrpName', label: '코드 그룹 명', hidden: false },
    { key: 'code', label: '코드 번호', hidden: false },
    { key: 'codeName', label: '코드 명', hidden: false },
    { key: 'attri1', label: '속성1', hidden: false },
    { key: 'attri2', label: '속성2', hidden: false },
    { key: 'note', label: '비고', hidden: false },
    { key: 'creatorId', label: '작성자', hidden: true },
    { key: 'createDate', label: '작성일', hidden: true },
    { key: 'mdfrId', label: '수정자', hidden: true },
    { key: 'updateDate', label: '수정일', hidden: true },
]

export const codeGroupColumns = [
    { key: 'codeGrpNo', label: '코드 그룹 번호', hidden: false },
    { key: 'codeGrpName', label: '코드 그룹 명', hidden: false },
    { key: 'codeGrpNameEn', label: '코드 그룹 영문명', hidden: false },
    { key: 'note', label: '비고', hidden: false },
]

export const userColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'userName', label: '사용자 명', hidden: false },
    { key: 'loginId', label: '로그인 아이디', hidden: false },
    { key: 'password', label: '비밀번호', hidden: true },
    { key: 'deptCode', label: '부서 명', hidden: false },
    { key: 'role', label: '역할', hidden: false }
]

export const menuTableColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'level', label: '단계', hidden: true },
    { key: 'bd', label: '대분류', hidden: false },
    { key: 'md', label: '중분류', hidden: false },
    { key: 'sd', label: '소분류', hidden: false },
    { key: 'url', label: 'Url', hidden: false },
    { key: 'name', label: '메뉴 명', hidden: false },
    { key: 'accessUser', label: '접근 가능 권한', hidden: false },
]

export const menuLogColumns = [
    { key: 'menuName', label: '접속 메뉴', hidden: false },
    { key: 'cnt', label: '접속 횟수', hidden: false },
]

export const equipActvColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'emtnActvType', label: '활동유형', hidden: false },
    { key: 'actvDataDvs', label: '활동자료구분', hidden: false },
    { key: 'actvDataName', label: '활동자료명', hidden: false },
    { key: 'inputUnitCode', label: '입력단위코드', hidden: false },
    { key: 'calUnitCode', label: '산정단위코드', hidden: false },
    { key: 'unitConvCoef', label: '단위환산계수', hidden: false },
    { key: 'creatorId', label: '등록자ID', hidden: true },
    { key: 'createDate', label: '등록일시', hidden: true },
    { key: 'mdfrId', label: '수정자ID', hidden: true },
    { key: 'updateDate', label: '수정일시', hidden: true },
]

export const equipCoefColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'applyYear', label: '적용년도', hidden: false },
    { key: 'applyDvs', label: '적용구분', hidden: false },
    { key: 'ghgCode', label: '온실가스코드', hidden: false },
    { key: 'coefClassCode', label: '계수종류코드', hidden: false },
    { key: 'unitCode', label: '단위코드', hidden: false },
    { key: 'coef', label: '값', hidden: false },
]

export const pjtSalesColumns = [
    { key: 'pjtId', label: '프로젝트ID', hidden: false },
    { key: 'year', label: '년도', hidden: false },
]

export const pjtManagerColumns = [
    { key: 'id', label: '', hidden: true },
    { key: 'pjtId', label: '', hidden: false },
    { key: 'pjtCode', label: '', hidden: false },
    { key: 'pjtName', label: '', hidden: false },
    { key: 'pjtType', label: '', hidden: false },
    { key: 'regCode', label: '', hidden: false },
    { key: 'ctrtFrYear', label: '', hidden: false },
    { key: 'ctrtFrMth', label: '', hidden: false },
    { key: 'ctrtToYear', label: '', hidden: false },
    { key: 'ctrtToMth', label: '', hidden: false },
    { key: 'divCode', label: '', hidden: false },
    { key: 'bldArea', label: '', hidden: false },
    { key: 'pjtProgStus', label: '', hidden: false },
    { key: 'userId', label: '', hidden: false },
    { key: 'userLoginId', label: '', hidden: false },
    { key: 'userName', label: '', hidden: false },
    { key: 'userDeptCode', label: '', hidden: false },
]

export const pjtSelectedColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'pjtCode', label: '프로젝트 코드', hidden: false },
    { key: 'pjtName', label: '프로젝트 이름', hidden: false },
    { key: 'pjtType', label: '프로젝트 유형', hidden: false },
    { key: 'regCode', label: '지역 코드', hidden: false },
    { key: 'ctrtFrYear', label: '계약 시작 년', hidden: false },
    { key: 'ctrtFrMth', label: '계약 시작 월', hidden: false },
    { key: 'ctrtToYear', label: '계약 종료 년', hidden: false },
    { key: 'ctrtToMnt', label: '계약 종료 월', hidden: false },
    { key: 'divCode', label: '본부 코드', hidden: false },
    { key: 'bldArea', label: '연면적값', hidden: false },
    { key: 'pjtProgStus', label: '프로젝트진행 상태', hidden: false },
    { key: 'userId', label: '유저 ID', hidden: true },
    { key: 'userLoginId', label: '로그인 아이디', hidden: true },
    { key: 'userName', label: '유저 명', hidden: true },
    { key: 'userDeptCode', label: '부서 명', hidden: true },
]

export const pjtNotManagerColumns = [
    { key: 'pjtId', label: '프로젝트ID', hidden: false },
    { key: 'userName', label: '사용자명', hidden: false },
    { key: 'loginId', label: '로그인ID', hidden: false },
]

export const pjtMyColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'pjtCode', label: '프로젝트 코드', hidden: false },
    { key: 'pjtName', label: '프로젝트 이름', hidden: false },
    { key: 'pjtType', label: '프로젝트 유형', hidden: false },
    { key: 'regCode', label: '지역 코드', hidden: false },
    { key: 'ctrtFrYear', label: '계약 시작 년', hidden: false },
    { key: 'ctrtFrMth', label: '계약 시작 월', hidden: false },
    { key: 'ctrtToYear', label: '계약 종료 년', hidden: false },
    { key: 'ctrtToMnt', label: '계약 종료 월', hidden: false },
    { key: 'divCode', label: '본부 코드', hidden: false },
    { key: 'bldArea', label: '연면적값', hidden: false },
    { key: 'pjtProgStus', label: '프로젝트진행 상태', hidden: false },
]

export const perfColumns = [
    { key: 'emissionId', label: '배출ID', hidden: true },
    { key: 'equipName', label: '설비명', hidden: false },
    { key: 'emtnActvType', label: '배출활동유형', hidden: false },
    { key: 'actvDataName', label: '활동자료명', hidden: false },
    { key: 'inputUnitCode', label: '단위', hidden: false },
    { key: 'quantityList', label: '퀀티티리스트', hidden: true },
]
// 월별 칼럼 추가
for (let month = 1; month <= 12; month++) {
    perfColumns.push({
        key: `month${month}`,
        label: `${month}월`,
        hidden: false
    });
}

export const perfTotalColumns = [
    { key: 'actvYear', label: '활동시작년', hidden: true },
    { key: 'actvMth', label: '월', hidden: false },
    { key: 'scope1', label: 'Scope1배출량', hidden: false },
    { key: 'scope2', label: 'Scope2배출량', hidden: false },
    { key: 'total', label: '총배출량', hidden: false },
]

export const perfPjtColumns = [
    { key: 'actvYear', label: '활동시작년', hidden: true },
    { key: 'actvMth', label: '월', hidden: false },
    { key: 'scope1', label: 'Scope1배출량', hidden: false },
    { key: 'scope2', label: 'Scope2배출량', hidden: false },
    { key: 'total', label: '총배출량', hidden: false },
]

export const equipEmissionColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'equipId', label: '설비ID', hidden: true },
    { key: 'actvDataId', label: '활동자료ID', hidden: true },
    { key: 'equipName', label: '설비명', hidden: false },
    { key: 'equipLibName', label: '설비LIB명', hidden: false },
    { key: 'equipDvs', label: '설비구분', hidden: false },
    { key: 'equipType', label: '설비유형', hidden: false },
    { key: 'equipSpecUnit', label: '설비사양단위', hidden: false },
    { key: 'emtnActvType', label: '배출활동유형', hidden: false },
    { key: 'actvDataDvs', label: '활동자료구분', hidden: false },
    { key: 'actvDataName', label: '활동자료이름', hidden: false },
    { key: 'inputUnitCode', label: '입력단위코드', hidden: false },
    { key: 'calUnitCode', label: '산정단위코드', hidden: false },
    { key: 'unitConvCoef', label: '유닛콘브코에프', hidden: false },
]

export const equipDocumentColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'actvYear', label: '활동년도', hidden: false },
    { key: 'actvMth', label: '활동월', hidden: false },
    { key: 'name', label: '이름', hidden: false },
]

export const equipEmissionCandColumns = [
    { key: 'id', label: 'id', hidden: false },
    { key: 'equipId', label: '설비ID', hidden: false },
    { key: 'actvDataId', label: '활동자료ID', hidden: false },
    { key: 'equipName', label: '설비명', hidden: false },
    { key: 'equipLibName', label: '설비LIB명', hidden: false },
    { key: 'equipDvs', label: '설비구분', hidden: false },
    { key: 'equipType', label: '설비유형', hidden: false },
    { key: 'equipSpecUnit', label: '설비사양단위', hidden: false },
    { key: 'emtnActvType', label: '배출활동유형', hidden: false },
    { key: 'actvDataDvs', label: '활동자료구분', hidden: false },
    { key: 'actvDataName', label: '활동자료이름', hidden: false },
    { key: 'inputUnitCode', label: '입력단위코드', hidden: false },
    { key: 'calUnitCode', label: 'cal단위코드', hidden: false },
    { key: 'unitConvCoef', label: '유닛콘브코에프', hidden: false },
]

export const equipDocumentDetailColumns = [
    { key: 'name', label: '이름', hidden: false },
    { key: 'url', label: 'Url', hidden: false },
]

export const equipActvLibColumns = [
    { key: 'emtnActvType', label: '활동유형', hidden: false },
    { key: 'actvDataDvs', label: '활동자료구분', hidden: false },
    { key: 'actvDataName', label: '활동자료명', hidden: false },
    { key: 'inputUnitCode', label: '입력단위코드', hidden: false },
    { key: 'calUnitCode', label: '산정단위코드', hidden: false },
    { key: 'unitConvCoef', label: '단위환산계수', hidden: false },
    { key: 'equipLibId', label: '설비LIBID', hidden: true },
]