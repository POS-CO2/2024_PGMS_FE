// 매출액별 분석
// 테이블
export const saData = [
    {
        "pjtCode": "070687CA",
        "pjtName": "삼진 태양광",
        "regCode": "100",
        "divCode": "D000859",
        "prodTypeCode": "902",
        "totalEmissionQty": 2114.2896,
        "totalSales": 0.123456,
        "emissionQtyPerSales": 17125.85536547434,
        "formattedTotalEmissionQty": "2,114.2896",
        "formattedTotalSales": "0.123456",
        "formattedEmissionQtyPerSales": "17,125.855365"
    },
    {
        "pjtCode": "B00503CA",
        "pjtName": "울산 대현 더샵",
        "regCode": "2300",
        "divCode": "CEBOI00",
        "prodTypeCode": "1201",
        "totalEmissionQty": 0.0,
        "totalSales": 17.116612,
        "emissionQtyPerSales": 0.0,
        "formattedTotalEmissionQty": "0",
        "formattedTotalSales": "17.116612",
        "formattedEmissionQtyPerSales": "0"
    },
    {
        "pjtCode": "E00503CA",
        "pjtName": "포항 6코크스 신설(공사) 1차(사전공사)",
        "regCode": "3100",
        "divCode": "CEALD00",
        "prodTypeCode": "907",
        "totalEmissionQty": 6387713.758910767,
        "totalSales": 165216.025962,
        "emissionQtyPerSales": 38.66279752050175,
        "formattedTotalEmissionQty": "6,387,713.758911",
        "formattedTotalSales": "165,216.025962",
        "formattedEmissionQtyPerSales": "38.662798"
    },
    {
        "pjtCode": "C00501CA",
        "pjtName": "포항 포스코 퓨처엠 양극재 2차",
        "regCode": "3100",
        "divCode": "CEALD00",
        "prodTypeCode": "904",
        "totalEmissionQty": 0.03040608,
        "totalSales": 28228.2282,
        "emissionQtyPerSales": 1.07715155852396E-6,
        "formattedTotalEmissionQty": "0.030406",
        "formattedTotalSales": "28,228.2282",
        "formattedEmissionQtyPerSales": "0.000001"
    }
]

// 본부별 평균 원단위
export const avgUnitPerDivData = [
    {
        "divCode": "플랜트사업본부",
        "avgEmissionQtyPerSales": 23451,
        "formattedAvgEmissionQtyPerSales": "105,638.998165"
    },
    {
        "divCode": "건축사업본부",
        "avgEmissionQtyPerSales": 35612,
        "formattedAvgEmissionQtyPerSales": "123,456"
    },
    {
        "divCode": "인프라사업본부",
        "avgEmissionQtyPerSales": 12456,
        "formattedAvgEmissionQtyPerSales": "17,125.855365"
    },
    {
        "divCode": "1CEALD00",
        "avgEmissionQtyPerSales": 43512,
        "formattedAvgEmissionQtyPerSales": "105,638.998165"
    },
    {
        "divCode": "2CEBOI00",
        "avgEmissionQtyPerSales": 33124,
        "formattedAvgEmissionQtyPerSales": "0"
    },
    {
        "divCode": "3D000859",
        "avgEmissionQtyPerSales": 24215,
        "formattedAvgEmissionQtyPerSales": "17,125.855365"
    }
]

export const avgUnitPerDivData2 = [
    {
        "divCode": "플랜트사업본부",
        "avgEmissionQtyPerSales": 2731676.7911541113,
        "formattedAvgEmissionQtyPerSales": "2,731,676.791154"
    },
    {
        "divCode": "건축사업본부", 
        "avgEmissionQtyPerSales": 2855.561622199165, 
        "formattedAvgEmissionQtyPerSales": "2,855.561622"
    },
    {
        "divCode": "인프라사업본부", 
        "avgEmissionQtyPerSales": 0, 
        "formattedAvgEmissionQtyPerSales": "0"
    }
]

// 상품별 평균 원단위
export const unitPerProdData = [
    {
        "prodTypeCode": "1201",
        "avgEmissionQtyPerSales": 54321,
        "formattedAvgEmissionQtyPerSales": "12,345"
    },
    {
        "prodTypeCode": "902",
        "avgEmissionQtyPerSales": 78522,
        "formattedAvgEmissionQtyPerSales": "17,125.855365"
    },
    {
        "prodTypeCode": "904",
        "avgEmissionQtyPerSales": 37541,
        "formattedAvgEmissionQtyPerSales": "55,555"
    },
    {
        "prodTypeCode": "907",
        "avgEmissionQtyPerSales": 41238,
        "formattedAvgEmissionQtyPerSales": "106,799.866277"
    },
    {
        "prodTypeCode": "453",
        "avgEmissionQtyPerSales": 41253,
        "formattedAvgEmissionQtyPerSales": "12,345"
    },
    {
        "prodTypeCode": "562",
        "avgEmissionQtyPerSales": 12537,
        "formattedAvgEmissionQtyPerSales": "17,125.855365"
    },
    {
        "prodTypeCode": "947",
        "avgEmissionQtyPerSales": 84231,
        "formattedAvgEmissionQtyPerSales": "55,555"
    },
    {
        "prodTypeCode": "847",
        "avgEmissionQtyPerSales": 24358,
        "formattedAvgEmissionQtyPerSales": "106,799.866277"
    },
    {
        "prodTypeCode": "753",
        "avgEmissionQtyPerSales": 12537,
        "formattedAvgEmissionQtyPerSales": "17,125.855365"
    },
    {
        "prodTypeCode": "5378",
        "avgEmissionQtyPerSales": 84231,
        "formattedAvgEmissionQtyPerSales": "55,555"
    },
    {
        "prodTypeCode": "125",
        "avgEmissionQtyPerSales": 24358,
        "formattedAvgEmissionQtyPerSales": "106,799.866277"
    }
]

// 설비별 분석
// 설비LIB
export const libData = [
    {
        "equipLibName": "가설사무실 전력",
        "totalEmissionQty": 352094.3804618,
        "formattedTotalEmissionQty": "352,094.380462"
    },
    {
        "equipLibName": "공사용 전력",
        "totalEmissionQty": 23653.5181155016,
        "formattedTotalEmissionQty": "23,653.518116"
    },
    {
        "equipLibName": "법인차량",
        "totalEmissionQty": 2114.2896,
        "formattedTotalEmissionQty": "2,114.2896"
    }
]

// 설비유형
export const typeData = [
    {
        "equipType": "1",
        "totalEmissionQty": 2114.2896,
        "formattedTotalEmissionQty": "2,114.2896"
    },
    {
        "equipType": "9",
        "totalEmissionQty": 375747.8985773016,
        "formattedTotalEmissionQty": "375,747.898577"
    }
]

// 에너지원
export const sourceData = [
    {
        "energySource": "전력",
        "equipSpecUnit": "kWh",
        "totalEmissionQty": 375747.8985773016,
        "formattedTotalEmissionQty": "375,747.898577"
    },
    {
        "energySource": "액체연료",
        "equipSpecUnit": "ℓ",
        "totalEmissionQty": 2114.2896,
        "formattedTotalEmissionQty": "2,114.2896"
    }
]

// 기후별 분석
// 평균기온
export const tempData = [
    {
        "regCode": "서울",
        "year": 2024,
        "mth": 1,
        "avgTm": -0.3,
        "co2EmtnConvTotalQty": 689.1,
        "formattedAvgTm": "-0.3",
        "formattedCo2EmtnConvTotalQty": "689.1"
    },
    {
        "regCode": "서울",
        "year": 2024,
        "mth": 2,
        "avgTm": 3.9,
        "co2EmtnConvTotalQty": 598.8,
        "formattedAvgTm": "3.9",
        "formattedCo2EmtnConvTotalQty": "598.8"
    },
    {
        "regCode": "서울",
        "year": 2024,
        "mth": 3,
        "avgTm": 7.3,
        "co2EmtnConvTotalQty": 499.4,
        "formattedAvgTm": "7.3",
        "formattedCo2EmtnConvTotalQty": "499.4"
    },
    {
        "regCode": "서울",
        "year": 2024,
        "mth": 4,
        "avgTm": 16.9,
        "co2EmtnConvTotalQty": 399.8,
        "formattedAvgTm": "16.9",
        "formattedCo2EmtnConvTotalQty": "399.8"
    },
    {
        "regCode": "서울",
        "year": 2024,
        "mth": 5,
        "avgTm": 18.1,
        "co2EmtnConvTotalQty": 328.1,
        "formattedAvgTm": "18.1",
        "formattedCo2EmtnConvTotalQty": "328.1"
    },
    {
        "regCode": "서울",
        "year": 2024,
        "mth": 6,
        "avgTm": 23.81,
        "co2EmtnConvTotalQty": 159.9,
        "formattedAvgTm": "23.81",
        "formattedCo2EmtnConvTotalQty": "159.9"
    }
]