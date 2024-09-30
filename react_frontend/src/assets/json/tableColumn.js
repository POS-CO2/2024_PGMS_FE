export const pjtColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'pjtCode', label: '프로젝트코드', hidden: false },
    { key: 'pjtName', label: '프로젝트명', hidden: false },
    { key: 'pjtType', label: '프로젝트유형', hidden: false },
    { key: 'regCode', label: '지역', hidden: false },
    { key: 'ctrtFrYear', label: '계약시작년', hidden: false },
    { key: 'ctrtFrMth', label: '계약시작월', hidden: false },
    { key: 'ctrtToYear', label: '계약종료년', hidden: false },
    { key: 'ctrtToMth', label: '계약종료월', hidden: false },
    { key: 'divCode', label: '본부', hidden: false },
    { key: 'bldArea', label: '연면적(m²)', hidden: false },
    { key: 'pjtProgStus', label: '프로젝트진행상태', hidden: false },
    { key: 'userLoginId', label: '담당자사번', hidden: true },
    { key: 'userName', label: '담당자이름', hidden: true },
    { key: 'pgmsYn', label: 'Y/N', hidden: true },
    { key: 'userLoginId', label: '로그인 아이디', hidden: true },
    { key: 'userName', label: '유저 명', hidden: true },
    { key: 'startDate', label: '시작 일', hidden: true },
    { key: 'endDate', label: '종료 일', hidden: true },
]

export const equipColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'equipLibName', label: '설비LIB명', hidden: false },
    { key: 'equipName', label: '설비명', hidden: false },
    { key: 'equipDvs', label: '설비구분', hidden: false },
    { key: 'equipType', label: '설비유형', hidden: false },
    { key: 'equipSpecUnit', label: '설비사양단위', hidden: false },
]

export const equipLibColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'equipLibName', label: '설비LIB명', hidden: false },
    { key: 'equipDvs', label: '설비구분', hidden: false },
    { key: 'equipType', label: '설비유형', hidden: false },
    { key: 'equipSpecUnit', label: '설비사양단위', hidden: false },
]

export const codeColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'codeGrpNo', label: '코드그룹ID', hidden: false },
    { key: 'codeGrpName', label: '코드그룹명', hidden: false },
    { key: 'code', label: '코드ID', hidden: false },
    { key: 'codeName', label: '코드명', hidden: false },
    { key: 'attri1', label: '속성1', hidden: false },
    { key: 'attri2', label: '속성2', hidden: false },
    { key: 'note', label: '노트', hidden: false },
]

export const codeGroupColumns = [
    { key: 'codeGrpNo', label: '코드그룹ID', hidden: false },
    { key: 'codeGrpName', label: '코드그룹명', hidden: false },
    { key: 'codeGrpNameEn', label: '코드그룹영문명', hidden: false },
    { key: 'note', label: '노트', hidden: false },
]

export const userColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'userName', label: '이름', hidden: false },
    { key: 'loginId', label: '로그인ID', hidden: false },
    { key: 'password', label: '비밀번호', hidden: true },
    { key: 'deptCode', label: '부서명', hidden: false },
    { key: 'role', label: '접근권한', hidden: false }
]

export const menuTableColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'level', label: '단계', hidden: true },
    { key: 'bd', label: '대분류', hidden: false },
    { key: 'md', label: '중분류', hidden: false },
    { key: 'sd', label: '소분류', hidden: false },
    { key: 'url', label: 'Url', hidden: false },
    { key: 'name', label: '메뉴명', hidden: false },
    { key: 'accessUser', label: '접근가능권한', hidden: false },
]

export const menuLogColumns = [
    { key: 'menuName', label: '접속메뉴', hidden: false },
    { key: 'cnt', label: '접속횟수', hidden: false },
]

export const equipActvColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'actvDataName', label: '활동자료명', hidden: false },
    { key: 'actvDataDvs', label: '활동자료구분', hidden: false },
    { key: 'emtnActvType', label: '배출활동유형', hidden: false },
    { key: 'inputUnitCode', label: '입력단위', hidden: false },
    { key: 'calUnitCode', label: '산정단위', hidden: false },
    { key: 'unitConvCoef', label: '단위환산계수', hidden: false },
]

export const equipCoefColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'applyYear', label: '적용년도', hidden: false },
    { key: 'applyDvs', label: '적용구분', hidden: false },
    { key: 'coefClassCode', label: '계수구분코드', hidden: false },
    { key: 'ghgCode', label: '온실가스코드', hidden: false },
    { key: 'unitCode', label: '단위', hidden: false },
    { key: 'coef', label: '계수', hidden: false },
]

export const pjtSalesColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'year', label: '년도', hidden: true },
    { key: 'mth', label: '월', hidden: false },
    { key: 'salesAmt', label: '매출액', hidden: false },
]

export const pjtManagerColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'loginId', label: '로그인ID', hidden: false },
    { key: 'userName', label: '이름', hidden: false },
    { key: 'userDeptCode', label: '부서명', hidden: false },
]

export const perfColumns = [
    { key: 'emissionId', label: '배출ID', hidden: true },
    { key: 'equipName', label: '설비명', hidden: false },
    { key: 'emtnActvType', label: '배출활동유형코드', hidden: true },
    { key: 'emtnActvTypeName', label: '배출활동유형', hidden: false },
    { key: 'actvDataName', label: '활동자료명', hidden: false },
    { key: 'inputUnitCode', label: '단위', hidden: false },
    { key: 'quantityList', label: '퀀티티리스트', hidden: true },
]
// 월별 칼럼 추가
for (let month = 0; month < 12; month++) {
    perfColumns.push({
        key: `${month}`,
        label: `${month+1}월`,
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

export const emissionPerfPjtColumns = [
    { key: 'equipName', label: '배출원', hidden: false },
    { key: '1', label: '1월', hidden: false },
    { key: '2', label: '2월', hidden: false },
    { key: '3', label: '3월', hidden: false },
    { key: '4', label: '4월', hidden: false },
    { key: '5', label: '5월', hidden: false },
    { key: '6', label: '6월', hidden: false },
    { key: '7', label: '7월', hidden: false },
    { key: '8', label: '8월', hidden: false },
    { key: '9', label: '9월', hidden: false },
    { key: '10', label: '10월', hidden: false },
    { key: '11', label: '11월', hidden: false },
    { key: '12', label: '12월', hidden: false },
    { key: 'formattedTotalQty', label: '총배출량', hidden: false },
]

export const perfPjtColumns = [
    { key: 'scope', label: 'scope 구분', hidden: false },
    { key: '1', label: '1월', hidden: false },
    { key: '2', label: '2월', hidden: false },
    { key: '3', label: '3월', hidden: false },
    { key: '4', label: '4월', hidden: false },
    { key: '5', label: '5월', hidden: false },
    { key: '6', label: '6월', hidden: false },
    { key: '7', label: '7월', hidden: false },
    { key: '8', label: '8월', hidden: false },
    { key: '9', label: '9월', hidden: false },
    { key: '10', label: '10월', hidden: false },
    { key: '11', label: '11월', hidden: false },
    { key: '12', label: '12월', hidden: false },
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
    { key: 'unitConvCoef', label: '단위변환계수', hidden: false },
    { key: 'fileStatus', label: '증빙자료현황', hidden: false },
]

export const equipDocumentColumns = [
    { key: 'id', label: 'id', hidden: true },
    { key: 'actvYear', label: '활동년도', hidden: true },
    { key: 'actvMth', label: '활동월', hidden: false },
    { key: 'name', label: '자료명', hidden: false },
    { key: 'creatorDeptCode', label: '등록자 부서명', hidden: true },
    { key: 'creatorName', label: '등록자', hidden: false },
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
    { key: 'unitConvCoef', label: '단위변환계수', hidden: false },
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

export const salesAnalColumns = [
    { key: 'pjtCode', label: '프로젝트코드', hidden: false },
    { key: 'pjtName', label: '프로젝트명', hidden: false },
    { key: 'regCode', label: '지역', hidden: true },
    { key: 'divCode', label: '본부', hidden: false },
    { key: 'prodTypeCode', label: '상품', hidden: false },
    //{ key: 'totalEmissionQty', label: '총배출량', hidden: true },
    //{ key: 'totalSales', label: '매출액', hidden: true },
    //{ key: 'emissionQtyPerSales', label: '배출량/매출액', hidden: true },
    { key: 'formattedTotalEmissionQty', label: '총배출량(kgGHG)', hidden: false },
    { key: 'formattedTotalSales', label: '매출액(백만원)', hidden: false },
    { key: 'formattedEmissionQtyPerSales', label: '배출량/매출액', hidden: false },
]

export const equipAnalLibColumns = [
    { key: 'equipLibName', label: '설비LIB명', hidden: false },
    { key: 'totalEmissionQty', label: '총배출량(kgGHG)', hidden: true },
    { key: 'formattedTotalEmissionQty', label: '총배출량(kgGHG)', hidden: false },
]

export const equipAnalTypeColumns = [
    { key: 'equipType', label: '설비유형', hidden: false },
    { key: 'totalEmissionQty', label: '총배출량', hidden: true },
    { key: 'formattedTotalEmissionQty', label: '총배출량', hidden: false },
]

export const equipAnalSourceColumns = [
    { key: 'energySource', label: '에너지원', hidden: false },
    { key: 'equipSpecUnit', label: '설비사양단위', hidden: false },
    { key: 'totalEmissionQty', label: '총배출량', hidden: true },
    { key: 'formattedTotalEmissionQty', label: '총배출량', hidden: false },
]

export const climateAnalColumns = [
    { key: 'year', label: '대상연도', hidden: false },
    { key: 'mth', label: '대상월', hidden: false },
    { key: 'regCode', label: '지역', hidden: false },
    { key: 'avgTm', label: '영향인자값', hidden: true }, // 선택한 영향인자로 동적 변경
    { key: 'co2EmtnConvTotalQty', label: '총CO2배출량', hidden: true },
    { key: 'formattedAvgTm', label: '영향인자값', hidden: false }, // 선택한 영향인자로 동적 변경
    { key: 'formattedCo2EmtnConvTotalQty', label: '총CO2배출량(kgGHG)', hidden: false },
]