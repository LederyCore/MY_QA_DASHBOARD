/* 품질보증 업무 대시보드 - 대체본 (데이터 파일 data/를 읽을 수 없을 때 사용). 생성: 2026-10-08 */

window.DASHBOARD_CONFIG = {
 "appName": "품질보증 업무 현황",
 "owner": "품질보증팀",
 "pages": [
  {
   "id": "overview",
   "title": "종합 현황",
   "group": "현황판",
   "desc": "고객 클레임, 공정 불량률, 8D, 품질 비용과 이상 알림을 한눈에 봅니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "이번 달 고객 클레임",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "thisMonth",
        "filter": [],
        "ds": "claims",
        "compare": true,
        "spark": true
       },
       "goal": 12,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "이번 달 공정 불량률",
       "unit": "PPM",
       "src": {
        "agg": "ratio",
        "period": "thisMonth",
        "filter": [],
        "ds": "inspections",
        "field": "defects",
        "field2": "inspected",
        "scale": 1000000,
        "spark": true
       },
       "goal": 3000,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "진행 중 8D",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "!=",
          "v": "완료"
         }
        ],
        "ds": "capa"
       },
       "goal": 6,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "이번 달 품질 비용",
       "unit": "만원",
       "src": {
        "agg": "sum",
        "period": "thisMonth",
        "filter": [],
        "ds": "copq",
        "field": "amount",
        "compare": true,
        "spark": true
       },
       "lowerIsBetter": true
      }
     ]
    },
    {
     "type": "gauge",
     "span": 4,
     "title": "이번 달 고객 클레임 (목표 ≤ 12)",
     "unit": "건",
     "goal": 2,
     "lowerIsBetter": true,
     "src": {
      "ds": "claims",
      "agg": "count",
      "period": "thisMonth",
      "filter": []
     }
    },
    {
     "type": "yoy",
     "span": 8,
     "title": "고객 클레임 전년 비교",
     "unit": "건",
     "lowerIsBetter": true,
     "src": {
      "ds": "claims",
      "agg": "count",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "alerts",
     "span": 6,
     "title": "이상 알림",
     "limit": 3,
     "rules": [
      {
       "ds": "cpk",
       "label": "Cpk 1.33 미만 (최근 측정)",
       "level": "critical",
       "filter": [
        {
         "f": "cpk",
         "op": "<",
         "v": "1.33"
        },
        {
         "f": "date",
         "op": ">=",
         "v": "today-40"
        }
       ]
      },
      {
       "ds": "capa",
       "label": "8D 기한 초과",
       "level": "serious",
       "filter": [
        {
         "f": "status",
         "op": "=",
         "v": "지연"
        }
       ]
      },
      {
       "ds": "ppap",
       "label": "PPAP 제출 지연",
       "level": "serious",
       "filter": [
        {
         "f": "status",
         "op": "=",
         "v": "지연"
        }
       ]
      },
      {
       "ds": "calib",
       "label": "측정기 교정 기한 지남",
       "level": "serious",
       "filter": [
        {
         "f": "next",
         "op": "<",
         "v": "today"
        },
        {
         "f": "status",
         "op": "!=",
         "v": "폐기"
        }
       ]
      },
      {
       "ds": "claims",
       "label": "30일 넘은 미결 클레임",
       "level": "warning",
       "filter": [
        {
         "f": "date",
         "op": "<",
         "v": "today-30"
        },
        {
         "f": "status",
         "op": "!=",
         "v": "완료"
        }
       ]
      },
      {
       "ds": "nc",
       "label": "부적합 조치 기한 초과",
       "level": "warning",
       "filter": [
        {
         "f": "due",
         "op": "<",
         "v": "today"
        },
        {
         "f": "status",
         "op": "!=",
         "v": "완료"
        }
       ]
      }
     ]
    },
    {
     "type": "dday",
     "span": 6,
     "title": "다가오는 고객 일정 (PPAP)",
     "src": {
      "ds": "ppap",
      "title": "name",
      "date": "due",
      "sub": "customer",
      "limit": 4,
      "period": "all",
      "filter": [
       {
        "f": "status",
        "op": "!=",
        "v": "승인"
       }
      ]
     }
    },
    {
     "type": "line",
     "span": 8,
     "title": "검사 구분별 불량률 추이",
     "unit": "PPM",
     "target": 3000,
     "src": {
      "ds": "inspections",
      "agg": "ratio",
      "field": "defects",
      "field2": "inspected",
      "scale": 1000000,
      "x": "month",
      "months": 12,
      "series": "kind",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "donut",
     "span": 4,
     "title": "올해 품질 비용 구성",
     "unit": "만원",
     "src": {
      "ds": "copq",
      "agg": "sum",
      "field": "amount",
      "by": "kind",
      "period": "ytd",
      "filter": []
     }
    },
    {
     "type": "history",
     "span": 6,
     "title": "최근 변경 내역",
     "limit": 8
    },
    {
     "type": "links",
     "span": 6,
     "title": "바로가기",
     "items": [
      {
       "label": "H사 협력사 포털",
       "url": "https://partner.example.com/h-motors",
       "desc": "클레임 접수·8D 회신"
      },
      {
       "label": "K사 SQ 시스템",
       "url": "https://sq.example.com/k",
       "desc": "PPAP 제출"
      },
      {
       "label": "품질보증 공유 폴더",
       "url": "\\\\fileserver\\QA",
       "desc": "성적서·8D 보고서"
      },
      {
       "label": "사내 MES",
       "url": "http://mes.local/quality",
       "desc": "공정 불량·검사 실적"
      }
     ]
    },
    {
     "type": "summary",
     "span": 6,
     "title": "이번 달 고객 클레임 요약",
     "unit": "건",
     "src": {
      "ds": "claims",
      "period": "thisMonth",
      "filter": [],
      "agg": "count",
      "by": "customer",
      "by2": "type"
     }
    },
    {
     "type": "rankchange",
     "span": 6,
     "title": "클레임 부품 순위 변화",
     "unit": "건",
     "src": {
      "ds": "claims",
      "period": "all",
      "filter": [],
      "agg": "count",
      "by": "part",
      "cmp": "3m",
      "top": 7
     }
    }
   ]
  },
  {
   "id": "weekly",
   "title": "주간 회의",
   "group": "현황판",
   "desc": "주간 품질 회의 때 띄워 두는 페이지입니다.",
   "widgets": [
    {
     "type": "alerts",
     "span": 6,
     "title": "이번 주 확인할 것",
     "limit": 3,
     "rules": [
      {
       "ds": "capa",
       "label": "8D 기한 초과",
       "level": "serious",
       "filter": [
        {
         "f": "status",
         "op": "=",
         "v": "지연"
        }
       ]
      },
      {
       "ds": "tasks",
       "label": "기한 지난 업무",
       "level": "warning",
       "filter": [
        {
         "f": "due",
         "op": "<",
         "v": "today"
        },
        {
         "f": "status",
         "op": "!=",
         "v": "완료"
        }
       ]
      },
      {
       "ds": "claims",
       "label": "이번 주 새 클레임",
       "level": "warning",
       "filter": [
        {
         "f": "date",
         "op": ">=",
         "v": "today-7"
        }
       ]
      }
     ]
    },
    {
     "type": "dday",
     "span": 6,
     "title": "다가오는 심사 · 초기유동",
     "items": [
      {
       "label": "IATF 16949 사후심사",
       "date": "2026-11-11",
       "note": "인증기관 2명"
      },
      {
       "label": "H사 공정 감사",
       "date": "2026-10-21",
       "note": "도어래치 라인"
      },
      {
       "label": "테일게이트 힌지 SOP",
       "date": "2026-10-26",
       "note": "R사"
      }
     ]
    },
    {
     "type": "calendar",
     "span": 6,
     "title": "업무 일정",
     "src": {
      "ds": "tasks",
      "date": "due",
      "title": "title",
      "color": "category",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "tasks",
     "span": 6,
     "title": "진행 중인 업무",
     "src": {
      "ds": "tasks",
      "period": "all",
      "filter": [
       {
        "f": "status",
        "op": "!=",
        "v": "완료"
       }
      ],
      "limit": 7,
      "map": {
       "title": "title",
       "owner": "owner",
       "due": "due",
       "status": "status",
       "progress": "progress"
      }
     }
    },
    {
     "type": "note",
     "span": 6,
     "title": "최근 회의록 · 이슈",
     "src": {
      "ds": "memos",
      "period": "all",
      "filter": [],
      "main": "content",
      "pre": "date",
      "post": "owner",
      "tag": "category",
      "limit": 7
     }
    },
    {
     "type": "quickform",
     "span": 6,
     "title": "메모 바로 입력",
     "src": {
      "ds": "memos",
      "cols": [
       "date",
       "category",
       "content",
       "owner"
      ]
     }
    },
    {
     "type": "history",
     "span": 12,
     "title": "이번 주 변경 내역",
     "limit": 10
    },
    {
     "type": "summary",
     "span": 6,
     "title": "이번 달 공정 불량 요약",
     "unit": "개",
     "src": {
      "ds": "defects",
      "period": "thisMonth",
      "filter": [],
      "agg": "sum",
      "field": "qty",
      "by": "line",
      "by2": "type"
     }
    },
    {
     "type": "burndown",
     "span": 6,
     "title": "8D 미결 추이 (최근 60일)",
     "src": {
      "ds": "capa",
      "period": "all",
      "filter": [],
      "start": "issued",
      "end": "closed",
      "days": 60
     }
    }
   ]
  },
  {
   "id": "claims-pg",
   "title": "고객 클레임",
   "group": "고객 품질",
   "desc": "고객 클레임 접수·처리 현황과 유형·부품·고객사별 분석입니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "이번 달 클레임",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "thisMonth",
        "filter": [],
        "ds": "claims",
        "compare": true,
        "spark": true
       },
       "goal": 12,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "평균 처리 기간 (최근 3개월)",
       "unit": "일",
       "src": {
        "agg": "avg",
        "period": "last3m",
        "filter": [
         {
          "f": "status",
          "op": "=",
          "v": "완료"
         }
        ],
        "ds": "claims",
        "field": "lead"
       },
       "goal": 20,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "미결 클레임",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "!=",
          "v": "완료"
         }
        ],
        "ds": "claims"
       },
       "goal": 8,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "이번 달 클레임 비용",
       "unit": "만원",
       "src": {
        "agg": "sum",
        "period": "thisMonth",
        "filter": [],
        "ds": "claims",
        "field": "cost",
        "compare": true,
        "spark": true
       },
       "lowerIsBetter": true
      }
     ]
    },
    {
     "type": "bar",
     "span": 8,
     "title": "월별 클레임 (고객사별)",
     "unit": "건",
     "stacked": true,
     "src": {
      "ds": "claims",
      "agg": "count",
      "x": "month",
      "months": 12,
      "series": "customer",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "donut",
     "span": 4,
     "title": "고객사 비중 (최근 3개월)",
     "unit": "건",
     "src": {
      "ds": "claims",
      "agg": "count",
      "by": "customer",
      "period": "last3m",
      "filter": []
     }
    },
    {
     "type": "pareto",
     "span": 6,
     "title": "불량 유형 파레토 (최근 12개월)",
     "unit": "건",
     "mark": 80,
     "src": {
      "ds": "claims",
      "agg": "count",
      "by": "type",
      "top": 8,
      "period": "last12m",
      "filter": []
     }
    },
    {
     "type": "hbar",
     "span": 6,
     "title": "부품별 클레임 비용 (최근 12개월)",
     "unit": "만원",
     "src": {
      "ds": "claims",
      "agg": "sum",
      "field": "cost",
      "by": "part",
      "top": 7,
      "period": "last12m",
      "filter": []
     }
    },
    {
     "type": "heatmap",
     "span": 12,
     "title": "부품 × 불량 유형 (최근 12개월)",
     "unit": "건",
     "src": {
      "ds": "claims",
      "agg": "count",
      "by": "part",
      "by2": "type",
      "topRows": 9,
      "topCols": 6,
      "period": "last12m",
      "filter": []
     }
    },
    {
     "type": "table",
     "span": 12,
     "title": "최근 클레임",
     "src": {
      "ds": "claims",
      "period": "all",
      "filter": [],
      "cols": [
       "no",
       "date",
       "customer",
       "part",
       "type",
       "qty",
       "owner",
       "status",
       "lead"
      ],
      "limit": 10
     }
    },
    {
     "type": "gallery",
     "span": 12,
     "title": "클레임 사진",
     "src": {
      "ds": "claims",
      "file": "files",
      "title": "no",
      "imagesOnly": true,
      "limit": 12,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "goaltable",
     "span": 6,
     "title": "2026년 클레임 건수 목표 대비 실적",
     "unit": "건",
     "goal": 13,
     "lowerIsBetter": true,
     "goals": [
      15,
      15,
      14,
      14,
      13,
      13,
      13,
      12,
      12,
      12,
      11,
      11
     ],
     "src": {
      "ds": "claims",
      "period": "all",
      "filter": [],
      "agg": "count"
     }
    },
    {
     "type": "summary",
     "span": 6,
     "title": "이번 달 클레임 요약",
     "unit": "건",
     "src": {
      "ds": "claims",
      "period": "thisMonth",
      "filter": [],
      "agg": "count",
      "by": "customer",
      "by2": "type"
     }
    },
    {
     "type": "scatter",
     "span": 6,
     "title": "클레임 수량 vs 비용",
     "src": {
      "ds": "claims",
      "period": "all",
      "filter": [],
      "xf": "qty",
      "yf": "cost",
      "color": "customer",
      "label": "no",
      "limit": 300
     }
    },
    {
     "type": "rankchange",
     "span": 6,
     "title": "부품별 클레임 순위 변화",
     "unit": "건",
     "src": {
      "ds": "claims",
      "period": "all",
      "filter": [],
      "agg": "count",
      "by": "part",
      "cmp": "3m",
      "top": 8
     }
    },
    {
     "type": "burndown",
     "span": 6,
     "title": "클레임 미결 추이",
     "src": {
      "ds": "claims",
      "period": "all",
      "filter": [],
      "start": "date",
      "end": "closed",
      "days": 90
     }
    },
    {
     "type": "annotate",
     "span": 6,
     "title": "최근 클레임 불량 위치",
     "img": "files/claims/261002-r10g08-도어래치 ASSY 용접 스패터.svg",
     "marks": [
      {
       "x": 57,
       "y": 62,
       "t": "용접 스패터 부착 (고객 지적 부위)"
      },
      {
       "x": 40,
       "y": 47,
       "t": "인접 부위 동일 현상 확인 필요"
      }
     ]
    }
   ]
  },
  {
   "id": "capa-pg",
   "title": "8D / 시정조치",
   "group": "고객 품질",
   "desc": "8D 단계 진행과 기한, 지연 건을 관리합니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "진행 중 8D",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "!=",
          "v": "완료"
         }
        ],
        "ds": "capa"
       }
      },
      {
       "label": "기한 초과",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "=",
          "v": "지연"
         }
        ],
        "ds": "capa"
       },
       "goal": 0,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "이번 달 종결",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "thisMonth",
        "filter": [
         {
          "f": "status",
          "op": "=",
          "v": "완료"
         }
        ],
        "ds": "capa",
        "dateField": "closed"
       }
      },
      {
       "label": "평균 처리 기간 (최근 6개월)",
       "unit": "일",
       "src": {
        "agg": "avg",
        "period": "last6m",
        "filter": [
         {
          "f": "status",
          "op": "=",
          "v": "완료"
         }
        ],
        "ds": "capa",
        "field": "lead"
       },
       "goal": 40,
       "lowerIsBetter": true,
       "status": "auto"
      }
     ]
    },
    {
     "type": "kanban",
     "span": 12,
     "title": "8D 단계 보드",
     "src": {
      "ds": "capa",
      "col": "step",
      "title": "subject",
      "owner": "owner",
      "due": "due",
      "hideEmpty": false,
      "limit": 6,
      "period": "all",
      "filter": [
       {
        "f": "issued",
        "op": ">=",
        "v": "today-120"
       }
      ]
     }
    },
    {
     "type": "gantt",
     "span": 12,
     "title": "진행 중 8D 일정",
     "src": {
      "ds": "capa",
      "title": "subject",
      "sub": "owner",
      "start": "issued",
      "end": "due",
      "status": "status",
      "done": "closed",
      "range": "auto",
      "limit": 14,
      "period": "all",
      "filter": [
       {
        "f": "status",
        "op": "!=",
        "v": "완료"
       }
      ]
     }
    },
    {
     "type": "donut",
     "span": 6,
     "title": "발생 출처 (최근 12개월)",
     "unit": "건",
     "src": {
      "ds": "capa",
      "agg": "count",
      "by": "source",
      "period": "last12m",
      "filter": []
     }
    },
    {
     "type": "line",
     "span": 6,
     "title": "월별 8D 발행",
     "unit": "건",
     "src": {
      "ds": "capa",
      "agg": "count",
      "x": "month",
      "months": 12,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "timeline",
     "span": 12,
     "title": "진행 중인 8D 타임라인",
     "src": {
      "ds": "capa",
      "period": "all",
      "filter": [],
      "rid": "r10g2x"
     }
    },
    {
     "type": "burndown",
     "span": 6,
     "title": "8D 미결 추이",
     "src": {
      "ds": "capa",
      "period": "all",
      "filter": [],
      "start": "issued",
      "end": "closed",
      "days": 180
     }
    },
    {
     "type": "rankchange",
     "span": 6,
     "title": "발생 출처별 8D 순위 (올해 vs 작년)",
     "unit": "건",
     "src": {
      "ds": "capa",
      "period": "all",
      "filter": [],
      "agg": "count",
      "by": "source",
      "cmp": "year",
      "top": 6
     }
    }
   ]
  },
  {
   "id": "ppap-pg",
   "title": "PPAP / 양산 승인",
   "group": "고객 품질",
   "desc": "PPAP 제출 단계와 기한, 승인 현황입니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "진행 중 PPAP",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "=",
          "v": "진행중"
         }
        ],
        "ds": "ppap"
       }
      },
      {
       "label": "제출 지연",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "=",
          "v": "지연"
         }
        ],
        "ds": "ppap"
       },
       "goal": 0,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "올해 승인",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "ytd",
        "filter": [
         {
          "f": "status",
          "op": "=",
          "v": "승인"
         }
        ],
        "ds": "ppap",
        "dateField": "approved"
       }
      }
     ]
    },
    {
     "type": "kanban",
     "span": 12,
     "title": "PPAP 단계",
     "src": {
      "ds": "ppap",
      "col": "stage",
      "title": "name",
      "owner": "customer",
      "due": "due",
      "hideEmpty": false,
      "limit": 6,
      "period": "all",
      "filter": [
       {
        "f": "due",
        "op": ">=",
        "v": "today-60"
       }
      ]
     }
    },
    {
     "type": "calendar",
     "span": 6,
     "title": "제출 기한 달력",
     "src": {
      "ds": "ppap",
      "date": "due",
      "title": "name",
      "color": "status",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "dday",
     "span": 6,
     "title": "다가오는 제출 기한",
     "src": {
      "ds": "ppap",
      "title": "name",
      "date": "due",
      "sub": "customer",
      "limit": 6,
      "period": "all",
      "filter": [
       {
        "f": "status",
        "op": "!=",
        "v": "승인"
       }
      ]
     }
    },
    {
     "type": "table",
     "span": 12,
     "title": "PPAP 목록",
     "src": {
      "ds": "ppap",
      "period": "all",
      "filter": [
       {
        "f": "due",
        "op": ">=",
        "v": "today-90"
       }
      ],
      "cols": [
       "partno",
       "name",
       "customer",
       "level",
       "stage",
       "due",
       "status"
      ],
      "sort": "due",
      "asc": true,
      "limit": 15
     }
    }
   ]
  },
  {
   "id": "launch-pg",
   "title": "초기유동관리",
   "group": "고객 품질",
   "desc": "신규 양산 부품의 SOP 후 90일 관리 현황입니다.",
   "widgets": [
    {
     "type": "gantt",
     "span": 12,
     "title": "초기유동 관리 기간",
     "src": {
      "ds": "launch",
      "title": "part",
      "sub": "customer",
      "start": "sop",
      "end": "end",
      "status": "status",
      "range": "auto",
      "limit": 10,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "bar",
     "span": 6,
     "title": "부품별 누적 불량",
     "unit": "개",
     "src": {
      "ds": "launch",
      "agg": "sum",
      "field": "defects",
      "x": "part",
      "top": 8,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "dday",
     "span": 6,
     "title": "다가오는 SOP",
     "src": {
      "ds": "launch",
      "title": "part",
      "date": "sop",
      "sub": "customer",
      "limit": 4,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "table",
     "span": 12,
     "title": "초기유동 목록",
     "src": {
      "ds": "launch",
      "period": "all",
      "filter": [],
      "cols": [
       "part",
       "customer",
       "sop",
       "end",
       "defects",
       "elapsed",
       "status"
      ],
      "sort": "sop",
      "limit": 10
     }
    }
   ]
  },
  {
   "id": "defects-pg",
   "title": "공정 불량",
   "group": "공정 품질",
   "desc": "공정·입고·출하 불량의 추이, 유형, 라인별 분석입니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "이번 달 불량 수량",
       "unit": "개",
       "src": {
        "agg": "sum",
        "period": "thisMonth",
        "filter": [],
        "ds": "defects",
        "field": "qty",
        "compare": true,
        "spark": true
       },
       "lowerIsBetter": true
      },
      {
       "label": "이번 달 불량 건수",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "thisMonth",
        "filter": [],
        "ds": "defects",
        "compare": true
       },
       "lowerIsBetter": true
      },
      {
       "label": "조치 중",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "!=",
          "v": "완료"
         }
        ],
        "ds": "defects"
       },
       "goal": 10,
       "lowerIsBetter": true,
       "status": "auto"
      }
     ]
    },
    {
     "type": "bar",
     "span": 8,
     "title": "월별 불량 수량 (구분별)",
     "unit": "개",
     "stacked": true,
     "src": {
      "ds": "defects",
      "agg": "sum",
      "field": "qty",
      "x": "month",
      "months": 12,
      "series": "kind",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "donut",
     "span": 4,
     "title": "구분 비중 (최근 3개월)",
     "unit": "개",
     "src": {
      "ds": "defects",
      "agg": "sum",
      "field": "qty",
      "by": "kind",
      "period": "last3m",
      "filter": []
     }
    },
    {
     "type": "pareto",
     "span": 6,
     "title": "불량 유형 파레토 (수량, 최근 3개월)",
     "unit": "개",
     "mark": 80,
     "src": {
      "ds": "defects",
      "agg": "sum",
      "field": "qty",
      "by": "type",
      "top": 8,
      "period": "last3m",
      "filter": []
     }
    },
    {
     "type": "hbar",
     "span": 6,
     "title": "부품별 불량 수량 (최근 3개월)",
     "unit": "개",
     "src": {
      "ds": "defects",
      "agg": "sum",
      "field": "qty",
      "by": "part",
      "top": 7,
      "period": "last3m",
      "filter": []
     }
    },
    {
     "type": "heatmap",
     "span": 12,
     "title": "라인 × 불량 유형 (최근 6개월)",
     "unit": "개",
     "src": {
      "ds": "defects",
      "agg": "sum",
      "field": "qty",
      "by": "line",
      "by2": "type",
      "topRows": 8,
      "topCols": 6,
      "period": "last6m",
      "filter": [
       {
        "f": "kind",
        "op": "=",
        "v": "공정"
       }
      ]
     }
    },
    {
     "type": "gallery",
     "span": 6,
     "title": "불량 사진",
     "src": {
      "ds": "defects",
      "file": "files",
      "title": "part",
      "imagesOnly": true,
      "limit": 9,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "quickform",
     "span": 6,
     "title": "불량 바로 입력",
     "src": {
      "ds": "defects",
      "cols": [
       "date",
       "kind",
       "line",
       "part",
       "type",
       "qty"
      ]
     }
    },
    {
     "type": "floormap",
     "span": 12,
     "title": "라인별 불량 배치도 (최근 3개월)",
     "unit": "개",
     "img": "files/layout/공장 배치도.svg",
     "pos": {
      "프레스 1": {
       "x": 19,
       "y": 31.8
      },
      "프레스 2": {
       "x": 19,
       "y": 63.9
      },
      "용접 1": {
       "x": 40,
       "y": 31.8
      },
      "용접 2": {
       "x": 40,
       "y": 63.9
      },
      "사출 1": {
       "x": 61,
       "y": 31.8
      },
      "도장": {
       "x": 61,
       "y": 63.9
      },
      "조립 1": {
       "x": 82,
       "y": 31.8
      },
      "조립 2": {
       "x": 82,
       "y": 63.9
      }
     },
     "src": {
      "ds": "defects",
      "period": "last3m",
      "filter": [
       {
        "f": "kind",
        "op": "=",
        "v": "공정"
       }
      ],
      "by": "line",
      "agg": "sum",
      "field": "qty"
     }
    },
    {
     "type": "goaltable",
     "span": 6,
     "title": "2026년 불량 수량 목표 대비 실적",
     "unit": "개",
     "goal": 450,
     "lowerIsBetter": true,
     "src": {
      "ds": "defects",
      "period": "all",
      "filter": [],
      "agg": "sum",
      "field": "qty"
     }
    },
    {
     "type": "rankchange",
     "span": 6,
     "title": "불량 유형 순위 변화",
     "unit": "개",
     "src": {
      "ds": "defects",
      "period": "all",
      "filter": [],
      "agg": "sum",
      "field": "qty",
      "by": "type",
      "cmp": "3m",
      "top": 8
     }
    },
    {
     "type": "annotate",
     "span": 6,
     "title": "글로브박스 불량 발생 위치",
     "img": "files/parts/261008-r10fqs-글로브박스 도면.svg",
     "marks": [
      {
       "x": 33,
       "y": 41,
       "t": "힌지 체결부 찍힘 (조립 1)"
      },
      {
       "x": 66,
       "y": 36,
       "t": "래치 홀 버 발생 (사출 1)"
      },
      {
       "x": 51,
       "y": 56,
       "t": "손잡이 홈 수축 · 미성형"
      }
     ]
    },
    {
     "type": "summary",
     "span": 6,
     "title": "이번 달 불량 요약",
     "unit": "개",
     "src": {
      "ds": "defects",
      "period": "thisMonth",
      "filter": [],
      "agg": "sum",
      "field": "qty",
      "by": "line",
      "by2": "type"
     }
    }
   ]
  },
  {
   "id": "spc-pg",
   "title": "검사 · 관리도",
   "group": "공정 품질",
   "desc": "검사 로트 불량률 p 관리도와 월별 불량률 추이입니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "이번 달 검사 수량",
       "unit": "개",
       "src": {
        "agg": "sum",
        "period": "thisMonth",
        "filter": [],
        "ds": "inspections",
        "field": "inspected",
        "compare": true
       }
      },
      {
       "label": "이번 달 불량률",
       "unit": "PPM",
       "src": {
        "agg": "ratio",
        "period": "thisMonth",
        "filter": [],
        "ds": "inspections",
        "field": "defects",
        "field2": "inspected",
        "scale": 1000000,
        "spark": true
       },
       "goal": 3000,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "이번 달 검사 로트",
       "unit": "로트",
       "src": {
        "agg": "count",
        "period": "thisMonth",
        "filter": [],
        "ds": "inspections"
       }
      }
     ]
    },
    {
     "type": "control",
     "span": 12,
     "title": "공정검사 불량률 p 관리도 (로트별)",
     "src": {
      "ds": "inspections",
      "mode": "p",
      "num": "defects",
      "den": "inspected",
      "group": "record",
      "scale": 100,
      "limit": 30,
      "period": "all",
      "filter": [
       {
        "f": "kind",
        "op": "=",
        "v": "공정검사"
       }
      ]
     }
    },
    {
     "type": "control",
     "span": 6,
     "title": "월별 불량률 p 관리도 (전체, PPM)",
     "src": {
      "ds": "inspections",
      "mode": "p",
      "num": "defects",
      "den": "inspected",
      "group": "month",
      "scale": 1000000,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "gauge",
     "span": 6,
     "title": "이번 달 공정 불량률",
     "unit": "PPM",
     "goal": 3000,
     "lowerIsBetter": true,
     "src": {
      "ds": "inspections",
      "agg": "ratio",
      "field": "defects",
      "field2": "inspected",
      "scale": 1000000,
      "period": "thisMonth",
      "filter": [
       {
        "f": "kind",
        "op": "=",
        "v": "공정검사"
       }
      ]
     }
    },
    {
     "type": "line",
     "span": 12,
     "title": "검사 구분별 월 불량률",
     "unit": "PPM",
     "src": {
      "ds": "inspections",
      "agg": "ratio",
      "field": "defects",
      "field2": "inspected",
      "scale": 1000000,
      "x": "month",
      "months": 12,
      "series": "kind",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "histogram",
     "span": 6,
     "title": "브라켓 홀 위치 분포",
     "unit": "mm",
     "lsl": 9.85,
     "usl": 10.15,
     "src": {
      "ds": "measure",
      "period": "last3m",
      "filter": [
       {
        "f": "char",
        "op": "=",
        "v": "브라켓 홀 위치 (mm)"
       }
      ],
      "value": "value",
      "bins": 0
     }
    },
    {
     "type": "histogram",
     "span": 6,
     "title": "용접 너깃 지름 분포",
     "unit": "mm",
     "lsl": 5,
     "src": {
      "ds": "measure",
      "period": "last3m",
      "filter": [
       {
        "f": "char",
        "op": "=",
        "v": "용접 너깃 지름 (mm)"
       }
      ],
      "value": "value",
      "bins": 0
     }
    },
    {
     "type": "scatter",
     "span": 12,
     "title": "검사 수량 vs 불량 수량",
     "subtitle": "최근 6개월 · 검사 구분별",
     "src": {
      "ds": "inspections",
      "period": "last6m",
      "filter": [],
      "xf": "inspected",
      "yf": "defects",
      "color": "kind",
      "label": "part",
      "limit": 300
     }
    }
   ]
  },
  {
   "id": "cpk-pg",
   "title": "공정능력 (Cpk)",
   "group": "공정 품질",
   "desc": "관리 특성별 Cpk와 개선 대상입니다. 기준 1.33.",
   "widgets": [
    {
     "type": "scorecard",
     "span": 6,
     "title": "관리 특성 Cpk (최신)",
     "src": {
      "ds": "cpk",
      "name": "char",
      "score": "cpk",
      "grade": "judge",
      "max": 2.2,
      "pass": 1.33,
      "latest": true,
      "order": "asc",
      "limit": 8,
      "cols": [
       "line"
      ],
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "control",
     "span": 6,
     "title": "도장 막두께 Cpk 추이 (I 관리도)",
     "lsl": 1.33,
     "src": {
      "ds": "cpk",
      "mode": "i",
      "value": "cpk",
      "labelField": "char",
      "limit": 21,
      "period": "all",
      "filter": [
       {
        "f": "char",
        "op": "=",
        "v": "도장 막두께"
       }
      ]
     }
    },
    {
     "type": "line",
     "span": 8,
     "title": "평균 Cpk 추이 (전체 특성)",
     "unit": "",
     "target": 1.33,
     "src": {
      "ds": "cpk",
      "agg": "avg",
      "field": "cpk",
      "x": "month",
      "months": 12,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "donut",
     "span": 4,
     "title": "판정 비중 (최근 3개월)",
     "unit": "건",
     "src": {
      "ds": "cpk",
      "agg": "count",
      "by": "judge",
      "period": "last3m",
      "filter": []
     }
    },
    {
     "type": "alerts",
     "span": 12,
     "title": "공정능력 알림",
     "limit": 8,
     "rules": [
      {
       "ds": "cpk",
       "label": "Cpk 1.0 미만",
       "level": "critical",
       "filter": [
        {
         "f": "cpk",
         "op": "<",
         "v": "1.0"
        },
        {
         "f": "date",
         "op": ">=",
         "v": "today-90"
        }
       ]
      },
      {
       "ds": "cpk",
       "label": "Cpk 1.33 미만",
       "level": "warning",
       "filter": [
        {
         "f": "cpk",
         "op": "<",
         "v": "1.33"
        },
        {
         "f": "cpk",
         "op": ">=",
         "v": "1.0"
        },
        {
         "f": "date",
         "op": ">=",
         "v": "today-40"
        }
       ]
      }
     ]
    },
    {
     "type": "histogram",
     "span": 6,
     "title": "도장 막두께 분포",
     "unit": "µm",
     "lsl": 20,
     "usl": 40,
     "src": {
      "ds": "measure",
      "period": "last3m",
      "filter": [
       {
        "f": "char",
        "op": "=",
        "v": "도장 막두께 (µm)"
       }
      ],
      "value": "value",
      "bins": 0
     }
    },
    {
     "type": "histogram",
     "span": 6,
     "title": "Cpk 값 분포",
     "subtitle": "기준 1.33 미만은 빨간 막대",
     "lsl": 1.33,
     "src": {
      "ds": "cpk",
      "period": "all",
      "filter": [],
      "value": "cpk",
      "bins": 0
     }
    }
   ]
  },
  {
   "id": "calib-pg",
   "title": "측정기 교정",
   "group": "공정 품질",
   "desc": "측정기 교정 기한과 상태를 관리합니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "관리 측정기",
       "unit": "대",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "!=",
          "v": "폐기"
         }
        ],
        "ds": "calib"
       }
      },
      {
       "label": "30일 안에 교정",
       "unit": "대",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "next",
          "op": ">=",
          "v": "today"
         },
         {
          "f": "next",
          "op": "<=",
          "v": "today+30"
         },
         {
          "f": "status",
          "op": "!=",
          "v": "폐기"
         }
        ],
        "ds": "calib"
       }
      },
      {
       "label": "교정 기한 지남",
       "unit": "대",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "next",
          "op": "<",
          "v": "today"
         },
         {
          "f": "status",
          "op": "!=",
          "v": "폐기"
         }
        ],
        "ds": "calib"
       },
       "goal": 0,
       "lowerIsBetter": true,
       "status": "auto"
      }
     ]
    },
    {
     "type": "alerts",
     "span": 6,
     "title": "교정 알림",
     "limit": 6,
     "rules": [
      {
       "ds": "calib",
       "label": "교정 기한 지남",
       "level": "critical",
       "filter": [
        {
         "f": "next",
         "op": "<",
         "v": "today"
        },
        {
         "f": "status",
         "op": "!=",
         "v": "폐기"
        }
       ]
      },
      {
       "ds": "calib",
       "label": "30일 안에 교정",
       "level": "warning",
       "filter": [
        {
         "f": "next",
         "op": ">=",
         "v": "today"
        },
        {
         "f": "next",
         "op": "<=",
         "v": "today+30"
        },
        {
         "f": "status",
         "op": "!=",
         "v": "폐기"
        }
       ]
      }
     ]
    },
    {
     "type": "calendar",
     "span": 6,
     "title": "교정 일정",
     "src": {
      "ds": "calib",
      "date": "next",
      "title": "name",
      "color": "kind",
      "period": "all",
      "filter": [
       {
        "f": "status",
        "op": "!=",
        "v": "폐기"
       }
      ]
     }
    },
    {
     "type": "donut",
     "span": 4,
     "title": "구분별 측정기",
     "unit": "대",
     "src": {
      "ds": "calib",
      "agg": "count",
      "by": "kind",
      "period": "all",
      "filter": [
       {
        "f": "status",
        "op": "!=",
        "v": "폐기"
       }
      ]
     }
    },
    {
     "type": "table",
     "span": 8,
     "title": "측정기 목록 (차기 교정일 순)",
     "src": {
      "ds": "calib",
      "period": "all",
      "filter": [
       {
        "f": "status",
        "op": "!=",
        "v": "폐기"
       }
      ],
      "cols": [
       "no",
       "name",
       "kind",
       "line",
       "last",
       "next",
       "status"
      ],
      "sort": "next",
      "asc": true,
      "limit": 12
     }
    },
    {
     "type": "floormap",
     "span": 12,
     "title": "라인별 측정기 배치",
     "unit": "대",
     "img": "files/layout/공장 배치도.svg",
     "pos": {
      "프레스 1": {
       "x": 19,
       "y": 31.8
      },
      "프레스 2": {
       "x": 19,
       "y": 63.9
      },
      "용접 1": {
       "x": 40.4,
       "y": 31.8
      },
      "용접 2": {
       "x": 39.9,
       "y": 63.1
      },
      "사출 1": {
       "x": 61,
       "y": 31.8
      },
      "도장": {
       "x": 61.4,
       "y": 63.5
      },
      "조립 1": {
       "x": 82,
       "y": 31.8
      },
      "조립 2": {
       "x": 82,
       "y": 63.9
      }
     },
     "src": {
      "ds": "calib",
      "period": "all",
      "filter": [],
      "by": "line",
      "agg": "count"
     }
    }
   ]
  },
  {
   "id": "supplier-pg",
   "title": "협력사 평가",
   "group": "협력사 품질",
   "desc": "협력사 분기 평가 점수·등급과 개선 요구 현황입니다.",
   "widgets": [
    {
     "type": "scorecard",
     "span": 6,
     "title": "협력사 성적표 (최신 분기)",
     "src": {
      "ds": "suppliers",
      "name": "name",
      "score": "score",
      "grade": "grade",
      "max": 100,
      "pass": 80,
      "latest": true,
      "order": "asc",
      "limit": 10,
      "cols": [
       "process"
      ],
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "donut",
     "span": 6,
     "title": "등급 분포 (2026년 3분기)",
     "unit": "곳",
     "src": {
      "ds": "suppliers",
      "agg": "count",
      "by": "grade",
      "period": "all",
      "filter": [
       {
        "f": "date",
        "op": "=",
        "v": "2026-09-30"
       }
      ]
     }
    },
    {
     "type": "line",
     "span": 6,
     "title": "평균 종합 점수 추이",
     "unit": "점",
     "target": 80,
     "src": {
      "ds": "suppliers",
      "agg": "avg",
      "field": "score",
      "x": "month",
      "months": 12,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "hbar",
     "span": 6,
     "title": "공정별 평균 점수 (최근 12개월)",
     "unit": "점",
     "src": {
      "ds": "suppliers",
      "agg": "avg",
      "field": "score",
      "by": "process",
      "top": 9,
      "period": "last12m",
      "filter": []
     }
    },
    {
     "type": "kanban",
     "span": 12,
     "title": "개선 요구 진행 (최근 2분기)",
     "src": {
      "ds": "suppliers",
      "col": "status",
      "title": "name",
      "owner": "action",
      "due": "",
      "hideEmpty": false,
      "limit": 8,
      "period": "all",
      "filter": [
       {
        "f": "date",
        "op": ">=",
        "v": "2026-06-30"
       }
      ]
     }
    },
    {
     "type": "scatter",
     "span": 6,
     "title": "품질 점수 vs 납기 점수",
     "src": {
      "ds": "suppliers",
      "period": "all",
      "filter": [],
      "xf": "quality",
      "yf": "delivery",
      "color": "grade",
      "label": "name",
      "limit": 300
     }
    },
    {
     "type": "goaltable",
     "span": 6,
     "title": "2026년 협력사 종합 점수 (평균)",
     "unit": "점",
     "goal": 85,
     "src": {
      "ds": "suppliers",
      "period": "all",
      "filter": [],
      "agg": "avg",
      "field": "score"
     }
    },
    {
     "type": "rankchange",
     "span": 6,
     "title": "입고 불량 협력사 순위 (올해 vs 작년)",
     "unit": "개",
     "src": {
      "ds": "defects",
      "period": "all",
      "filter": [
       {
        "f": "kind",
        "op": "=",
        "v": "입고"
       }
      ],
      "agg": "sum",
      "field": "qty",
      "by": "vendor",
      "cmp": "year",
      "top": 8
     }
    },
    {
     "type": "histogram",
     "span": 6,
     "title": "협력사 종합 점수 분포",
     "unit": "점",
     "lsl": 70,
     "src": {
      "ds": "suppliers",
      "period": "all",
      "filter": [],
      "value": "score",
      "bins": 10
     }
    }
   ]
  },
  {
   "id": "incoming-pg",
   "title": "수입검사",
   "group": "협력사 품질",
   "desc": "협력사 입고 부품의 수입검사 불량률과 입고 불량입니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "이번 달 수입검사 불량률",
       "unit": "PPM",
       "src": {
        "agg": "ratio",
        "period": "thisMonth",
        "filter": [
         {
          "f": "kind",
          "op": "=",
          "v": "수입검사"
         }
        ],
        "ds": "inspections",
        "field": "defects",
        "field2": "inspected",
        "scale": 1000000,
        "spark": true
       },
       "goal": 4000,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "이번 달 입고 불량",
       "unit": "개",
       "src": {
        "agg": "sum",
        "period": "thisMonth",
        "filter": [
         {
          "f": "kind",
          "op": "=",
          "v": "입고"
         }
        ],
        "ds": "defects",
        "field": "qty",
        "compare": true
       },
       "lowerIsBetter": true
      }
     ]
    },
    {
     "type": "control",
     "span": 12,
     "title": "수입검사 p 관리도 (로트별)",
     "src": {
      "ds": "inspections",
      "mode": "p",
      "num": "defects",
      "den": "inspected",
      "group": "record",
      "scale": 100,
      "limit": 30,
      "period": "all",
      "filter": [
       {
        "f": "kind",
        "op": "=",
        "v": "수입검사"
       }
      ]
     }
    },
    {
     "type": "pareto",
     "span": 6,
     "title": "협력사별 입고 불량 (최근 6개월)",
     "unit": "개",
     "mark": 80,
     "src": {
      "ds": "defects",
      "agg": "sum",
      "field": "qty",
      "by": "vendor",
      "top": 8,
      "period": "last6m",
      "filter": [
       {
        "f": "kind",
        "op": "=",
        "v": "입고"
       }
      ]
     }
    },
    {
     "type": "heatmap",
     "span": 6,
     "title": "협력사 × 불량 유형 (최근 12개월)",
     "unit": "개",
     "src": {
      "ds": "defects",
      "agg": "sum",
      "field": "qty",
      "by": "vendor",
      "by2": "type",
      "topRows": 7,
      "topCols": 5,
      "period": "last12m",
      "filter": [
       {
        "f": "kind",
        "op": "=",
        "v": "입고"
       }
      ]
     }
    },
    {
     "type": "scatter",
     "span": 6,
     "title": "수입검사 수량 vs 불량",
     "src": {
      "ds": "inspections",
      "period": "all",
      "filter": [
       {
        "f": "kind",
        "op": "=",
        "v": "수입검사"
       }
      ],
      "xf": "inspected",
      "yf": "defects",
      "color": "vendor",
      "label": "part",
      "limit": 300
     }
    },
    {
     "type": "rankchange",
     "span": 6,
     "title": "입고 불량 협력사 순위 (올해 vs 작년)",
     "unit": "개",
     "src": {
      "ds": "defects",
      "period": "all",
      "filter": [
       {
        "f": "kind",
        "op": "=",
        "v": "입고"
       }
      ],
      "agg": "sum",
      "field": "qty",
      "by": "vendor",
      "cmp": "year",
      "top": 8
     }
    }
   ]
  },
  {
   "id": "change-pg",
   "title": "변경점 (4M)",
   "group": "협력사 품질",
   "desc": "4M 변경 접수·고객 승인·적용 현황입니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "진행 중 변경",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "!=",
          "v": "완료"
         }
        ],
        "ds": "change4m"
       }
      },
      {
       "label": "고객 승인 대기",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "approval",
          "op": "=",
          "v": "신청"
         }
        ],
        "ds": "change4m"
       },
       "goal": 2,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "올해 변경",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "ytd",
        "filter": [],
        "ds": "change4m"
       }
      }
     ]
    },
    {
     "type": "donut",
     "span": 4,
     "title": "4M 구분 비중 (최근 12개월)",
     "unit": "건",
     "src": {
      "ds": "change4m",
      "agg": "count",
      "by": "kind",
      "period": "last12m",
      "filter": []
     }
    },
    {
     "type": "kanban",
     "span": 8,
     "title": "변경 진행 보드",
     "src": {
      "ds": "change4m",
      "col": "status",
      "title": "content",
      "owner": "approval",
      "due": "apply",
      "hideEmpty": false,
      "limit": 6,
      "period": "all",
      "filter": [
       {
        "f": "date",
        "op": ">=",
        "v": "today-180"
       }
      ]
     }
    },
    {
     "type": "calendar",
     "span": 6,
     "title": "적용 일정",
     "src": {
      "ds": "change4m",
      "date": "apply",
      "title": "content",
      "color": "kind",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "table",
     "span": 6,
     "title": "최근 변경점",
     "src": {
      "ds": "change4m",
      "period": "all",
      "filter": [],
      "cols": [
       "no",
       "date",
       "kind",
       "part",
       "approval",
       "status"
      ],
      "limit": 8
     }
    },
    {
     "type": "burndown",
     "span": 6,
     "title": "미적용 변경점 추이",
     "src": {
      "ds": "change4m",
      "period": "all",
      "filter": [],
      "start": "date",
      "end": "apply",
      "days": 180
     }
    },
    {
     "type": "rankchange",
     "span": 6,
     "title": "부품별 변경점 순위 (올해 vs 작년)",
     "unit": "건",
     "src": {
      "ds": "change4m",
      "period": "all",
      "filter": [],
      "agg": "count",
      "by": "part",
      "cmp": "year",
      "top": 6
     }
    }
   ]
  },
  {
   "id": "audit-pg",
   "title": "감사 / 인증",
   "group": "시스템 · 심사",
   "desc": "내부심사 계획 진행과 심사 부적합 조치 현황입니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "미결 부적합",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "!=",
          "v": "완료"
         }
        ],
        "ds": "nc"
       },
       "goal": 3,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "조치 기한 초과",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "due",
          "op": "<",
          "v": "today"
         },
         {
          "f": "status",
          "op": "!=",
          "v": "완료"
         }
        ],
        "ds": "nc"
       },
       "goal": 0,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "올해 심사 진행률",
       "unit": "%",
       "src": {
        "agg": "avg",
        "period": "all",
        "filter": [],
        "ds": "auditplan",
        "field": "progress"
       }
      }
     ]
    },
    {
     "type": "progress",
     "span": 6,
     "title": "2026 내부심사 진행",
     "src": {
      "ds": "auditplan",
      "mode": "rows",
      "label": "dept",
      "value": "progress",
      "max": 100,
      "noteField": "date",
      "sort": "date",
      "asc": true,
      "limit": 12,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "calendar",
     "span": 6,
     "title": "심사 일정",
     "src": {
      "ds": "auditplan",
      "date": "date",
      "title": "dept",
      "color": "status",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "kanban",
     "span": 12,
     "title": "부적합 조치 보드",
     "src": {
      "ds": "nc",
      "col": "status",
      "title": "clause",
      "owner": "dept",
      "due": "due",
      "hideEmpty": false,
      "limit": 6,
      "period": "all",
      "filter": [
       {
        "f": "issued",
        "op": ">=",
        "v": "today-200"
       }
      ]
     }
    },
    {
     "type": "pareto",
     "span": 6,
     "title": "요구사항 조항별 부적합",
     "unit": "건",
     "mark": 80,
     "src": {
      "ds": "nc",
      "agg": "count",
      "by": "clause",
      "top": 7,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "alerts",
     "span": 6,
     "title": "심사 조치 알림",
     "limit": 5,
     "rules": [
      {
       "ds": "nc",
       "label": "부적합 조치 기한 초과",
       "level": "serious",
       "filter": [
        {
         "f": "due",
         "op": "<",
         "v": "today"
        },
        {
         "f": "status",
         "op": "!=",
         "v": "완료"
        }
       ]
      },
      {
       "ds": "auditfind",
       "label": "고객 지적 조치 기한 초과",
       "level": "serious",
       "filter": [
        {
         "f": "due",
         "op": "<",
         "v": "today"
        },
        {
         "f": "status",
         "op": "!=",
         "v": "완료"
        }
       ]
      }
     ]
    },
    {
     "type": "burndown",
     "span": 6,
     "title": "부적합 미결 추이",
     "src": {
      "ds": "nc",
      "period": "all",
      "filter": [],
      "start": "issued",
      "end": "closed",
      "days": 365
     }
    },
    {
     "type": "summary",
     "span": 6,
     "title": "올해 부적합 요약",
     "unit": "건",
     "src": {
      "ds": "nc",
      "period": "ytd",
      "filter": [],
      "agg": "count",
      "by": "dept",
      "by2": "level"
     }
    }
   ]
  },
  {
   "id": "auditfind-pg",
   "title": "고객 심사 지적사항",
   "group": "시스템 · 심사",
   "desc": "고객·인증 심사 지적의 등급과 조치 진행입니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "미결 지적",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "!=",
          "v": "완료"
         }
        ],
        "ds": "auditfind"
       },
       "lowerIsBetter": true
      },
      {
       "label": "중결함",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "level",
          "op": "=",
          "v": "중결함"
         },
         {
          "f": "status",
          "op": "!=",
          "v": "완료"
         }
        ],
        "ds": "auditfind"
       },
       "goal": 0,
       "lowerIsBetter": true,
       "status": "auto"
      },
      {
       "label": "평균 처리 기간",
       "unit": "일",
       "src": {
        "agg": "avg",
        "period": "all",
        "filter": [
         {
          "f": "status",
          "op": "=",
          "v": "완료"
         }
        ],
        "ds": "auditfind",
        "field": "lead"
       }
      }
     ]
    },
    {
     "type": "kanban",
     "span": 12,
     "title": "조치 단계 보드",
     "src": {
      "ds": "auditfind",
      "col": "status",
      "title": "content",
      "owner": "customer",
      "due": "due",
      "hideEmpty": false,
      "limit": 6,
      "period": "all",
      "filter": [
       {
        "f": "date",
        "op": ">=",
        "v": "today-150"
       }
      ]
     }
    },
    {
     "type": "gantt",
     "span": 12,
     "title": "조치 일정",
     "src": {
      "ds": "auditfind",
      "title": "content",
      "sub": "customer",
      "start": "date",
      "end": "due",
      "status": "status",
      "done": "closed",
      "range": "auto",
      "limit": 12,
      "period": "all",
      "filter": [
       {
        "f": "status",
        "op": "!=",
        "v": "완료"
       }
      ]
     }
    },
    {
     "type": "donut",
     "span": 6,
     "title": "고객사별 지적",
     "unit": "건",
     "src": {
      "ds": "auditfind",
      "agg": "count",
      "by": "customer",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "hbar",
     "span": 6,
     "title": "지적 내용 순위",
     "unit": "건",
     "src": {
      "ds": "auditfind",
      "agg": "count",
      "by": "content",
      "top": 6,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "timeline",
     "span": 12,
     "title": "조치 중인 지적사항 타임라인",
     "src": {
      "ds": "auditfind",
      "period": "all",
      "filter": [],
      "rid": "r10h70"
     }
    },
    {
     "type": "burndown",
     "span": 6,
     "title": "지적사항 미결 추이",
     "src": {
      "ds": "auditfind",
      "period": "all",
      "filter": [],
      "start": "date",
      "end": "closed",
      "days": 365
     }
    },
    {
     "type": "rankchange",
     "span": 6,
     "title": "고객사별 지적 순위 (올해 vs 작년)",
     "unit": "건",
     "src": {
      "ds": "auditfind",
      "period": "all",
      "filter": [],
      "agg": "count",
      "by": "customer",
      "cmp": "year",
      "top": 6
     }
    }
   ]
  },
  {
   "id": "training-pg",
   "title": "교육 · 자격",
   "group": "시스템 · 심사",
   "desc": "교육 시간과 자격 만료를 관리합니다.",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "올해 교육 시간",
       "unit": "시간",
       "src": {
        "agg": "sum",
        "period": "ytd",
        "filter": [],
        "ds": "training",
        "field": "hours"
       }
      },
      {
       "label": "이번 달 교육",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "thisMonth",
        "filter": [],
        "ds": "training",
        "compare": true
       }
      },
      {
       "label": "60일 안에 만료",
       "unit": "건",
       "src": {
        "agg": "count",
        "period": "all",
        "filter": [
         {
          "f": "expire",
          "op": ">=",
          "v": "today"
         },
         {
          "f": "expire",
          "op": "<=",
          "v": "today+60"
         }
        ],
        "ds": "training"
       },
       "goal": 0,
       "lowerIsBetter": true,
       "status": "auto"
      }
     ]
    },
    {
     "type": "alerts",
     "span": 6,
     "title": "자격 만료 알림",
     "limit": 6,
     "rules": [
      {
       "ds": "training",
       "label": "60일 안에 만료",
       "level": "warning",
       "filter": [
        {
         "f": "expire",
         "op": ">=",
         "v": "today"
        },
        {
         "f": "expire",
         "op": "<=",
         "v": "today+60"
        }
       ]
      },
      {
       "ds": "training",
       "label": "만료됨 (재취득 필요)",
       "level": "serious",
       "filter": [
        {
         "f": "expire",
         "op": "<",
         "v": "today"
        },
        {
         "f": "expire",
         "op": ">=",
         "v": "today-365"
        }
       ]
      }
     ]
    },
    {
     "type": "donut",
     "span": 6,
     "title": "교육 구분 (올해)",
     "unit": "건",
     "src": {
      "ds": "training",
      "agg": "count",
      "by": "kind",
      "period": "ytd",
      "filter": []
     }
    },
    {
     "type": "bar",
     "span": 8,
     "title": "월별 교육 시간",
     "unit": "시간",
     "src": {
      "ds": "training",
      "agg": "sum",
      "field": "hours",
      "x": "month",
      "months": 12,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "hbar",
     "span": 4,
     "title": "담당자별 교육 시간 (올해)",
     "unit": "시간",
     "src": {
      "ds": "training",
      "agg": "sum",
      "field": "hours",
      "by": "person",
      "top": 8,
      "period": "ytd",
      "filter": []
     }
    },
    {
     "type": "goaltable",
     "span": 6,
     "title": "2026년 교육 시간 목표 대비 실적",
     "unit": "시간",
     "goal": 30,
     "src": {
      "ds": "training",
      "period": "all",
      "filter": [],
      "agg": "sum",
      "field": "hours"
     }
    },
    {
     "type": "rankchange",
     "span": 6,
     "title": "교육 시간 순위 (올해 vs 작년)",
     "unit": "시간",
     "src": {
      "ds": "training",
      "period": "all",
      "filter": [],
      "agg": "sum",
      "field": "hours",
      "by": "person",
      "cmp": "year",
      "top": 8
     }
    }
   ]
  },
  {
   "id": "copq-pg",
   "title": "품질 비용 (COPQ)",
   "group": "시스템 · 심사",
   "desc": "외부·내부 실패, 평가, 예방 품질 비용입니다. 단위: 만원",
   "widgets": [
    {
     "type": "kpi",
     "items": [
      {
       "label": "이번 달 품질 비용",
       "unit": "만원",
       "src": {
        "agg": "sum",
        "period": "thisMonth",
        "filter": [],
        "ds": "copq",
        "field": "amount",
        "compare": true,
        "spark": true
       },
       "lowerIsBetter": true
      },
      {
       "label": "올해 누적",
       "unit": "만원",
       "src": {
        "agg": "sum",
        "period": "ytd",
        "filter": [],
        "ds": "copq",
        "field": "amount"
       }
      },
      {
       "label": "이번 달 외부 실패 비용",
       "unit": "만원",
       "src": {
        "agg": "sum",
        "period": "thisMonth",
        "filter": [
         {
          "f": "kind",
          "op": "=",
          "v": "외부 실패 (클레임·반품)"
         }
        ],
        "ds": "copq",
        "field": "amount",
        "spark": true
       },
       "lowerIsBetter": true
      }
     ]
    },
    {
     "type": "bar",
     "span": 8,
     "title": "월별 품질 비용 (구분별)",
     "unit": "만원",
     "stacked": true,
     "src": {
      "ds": "copq",
      "agg": "sum",
      "field": "amount",
      "x": "month",
      "months": 12,
      "series": "kind",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "donut",
     "span": 4,
     "title": "올해 비용 구성",
     "unit": "만원",
     "src": {
      "ds": "copq",
      "agg": "sum",
      "field": "amount",
      "by": "kind",
      "period": "ytd",
      "filter": []
     }
    },
    {
     "type": "yoy",
     "span": 12,
     "title": "품질 비용 전년 비교",
     "unit": "만원",
     "lowerIsBetter": true,
     "src": {
      "ds": "copq",
      "agg": "sum",
      "field": "amount",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "pareto",
     "span": 6,
     "title": "부품별 실패 비용 (최근 12개월)",
     "unit": "만원",
     "mark": 80,
     "src": {
      "ds": "copq",
      "agg": "sum",
      "field": "amount",
      "by": "part",
      "top": 8,
      "period": "last12m",
      "filter": [
       {
        "f": "part",
        "op": "filled",
        "v": ""
       }
      ]
     }
    },
    {
     "type": "gauge",
     "span": 6,
     "title": "이번 달 품질 비용 (목표 ≤ 3,500만원)",
     "unit": "만원",
     "goal": 3500,
     "lowerIsBetter": true,
     "src": {
      "ds": "copq",
      "agg": "sum",
      "field": "amount",
      "period": "thisMonth",
      "filter": []
     }
    },
    {
     "type": "goaltable",
     "span": 6,
     "title": "2026년 품질 비용 목표 대비 실적",
     "unit": "만원",
     "goal": 3000,
     "lowerIsBetter": true,
     "src": {
      "ds": "copq",
      "period": "all",
      "filter": [],
      "agg": "sum",
      "field": "amount"
     }
    },
    {
     "type": "summary",
     "span": 6,
     "title": "이번 달 품질 비용 요약",
     "unit": "만원",
     "src": {
      "ds": "copq",
      "period": "thisMonth",
      "filter": [],
      "agg": "sum",
      "field": "amount",
      "by": "kind",
      "by2": "part"
     }
    },
    {
     "type": "rankchange",
     "span": 12,
     "title": "부품별 품질 비용 순위 변화",
     "unit": "만원",
     "src": {
      "ds": "copq",
      "period": "all",
      "filter": [],
      "agg": "sum",
      "field": "amount",
      "by": "part",
      "cmp": "3m",
      "top": 8
     }
    }
   ]
  },
  {
   "id": "tasks-pg",
   "title": "업무 일정",
   "group": "내 업무",
   "desc": "기한이 있는 업무의 진행과 일정입니다.",
   "widgets": [
    {
     "type": "tasks",
     "span": 6,
     "title": "할 일",
     "src": {
      "ds": "tasks",
      "period": "all",
      "filter": [
       {
        "f": "status",
        "op": "!=",
        "v": "완료"
       }
      ],
      "limit": 8,
      "map": {
       "title": "title",
       "owner": "owner",
       "due": "due",
       "status": "status",
       "progress": "progress"
      }
     }
    },
    {
     "type": "progress",
     "span": 6,
     "title": "업무 진행률",
     "src": {
      "ds": "tasks",
      "mode": "rows",
      "label": "title",
      "value": "progress",
      "max": 100,
      "noteField": "owner",
      "sort": "due",
      "asc": true,
      "limit": 8,
      "period": "all",
      "filter": [
       {
        "f": "status",
        "op": "!=",
        "v": "완료"
       }
      ]
     }
    },
    {
     "type": "gantt",
     "span": 12,
     "title": "업무 일정",
     "src": {
      "ds": "tasks",
      "title": "title",
      "sub": "owner",
      "start": "start",
      "end": "due",
      "status": "status",
      "range": "auto",
      "limit": 15,
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "calendar",
     "span": 6,
     "title": "기한 달력",
     "src": {
      "ds": "tasks",
      "date": "due",
      "title": "title",
      "color": "category",
      "period": "all",
      "filter": []
     }
    },
    {
     "type": "kanban",
     "span": 6,
     "title": "상태 보드",
     "src": {
      "ds": "tasks",
      "col": "status",
      "title": "title",
      "owner": "owner",
      "due": "due",
      "hideEmpty": false,
      "limit": 6,
      "period": "all",
      "filter": []
     }
    }
   ]
  }
 ],
 "navOrder": [
  "g:현황판",
  "g:내 업무",
  "g:고객 품질",
  "g:공정 품질",
  "g:협력사 품질",
  "g:시스템 · 심사",
  "data"
 ],
 "migr": {
  "fileStore1": true,
  "attachReset1": true,
  "upg1": true
 },
 "fileRefs": {
  "files/parts/261008-r10fqn-도어래치 ASSY 도면.svg": 1,
  "files/parts/261008-r10fqo-시트프레임 도면.svg": 1,
  "files/parts/261008-r10fqp-콘솔 커버 도면.svg": 1,
  "files/parts/261008-r10fqq-브라켓 BRK-1830 도면.svg": 1,
  "files/parts/261008-r10fqr-힌지 ASSY 도면.svg": 1,
  "files/parts/261008-r10fqs-글로브박스 도면.svg": 2,
  "files/claims/260519-r10fyn-도어래치 ASSY 외관 (스크래치·찍힘).svg": 1,
  "files/claims/260526-r10fyp-리어 브라켓 용접 스패터.svg": 1,
  "files/claims/260604-r10fz5-범퍼 빔 치수 불량.svg": 1,
  "files/claims/260607-r10fz2-도어 트림 작동 불량.svg": 1,
  "files/claims/260615-r10fyu-콘솔 커버 치수 불량.svg": 1,
  "files/claims/260702-r10fz8-힌지 ASSY 외관 (스크래치·찍힘).svg": 1,
  "files/claims/260709-r10fzb-범퍼 빔 치수 불량.svg": 1,
  "files/claims/260718-r10fzd-도어 트림 체결 불량.svg": 1,
  "files/claims/260802-r10fzv-시트프레임 소음·진동.svg": 1,
  "files/claims/260810-r10fzi-시트프레임 소음·진동.svg": 1,
  "files/claims/260819-r10fzs-배터리 트레이 사출 수축.svg": 1,
  "files/claims/260831-r10fzr-힌지 ASSY 도장 핀홀·이물.svg": 1,
  "files/claims/260906-r10g04-도어래치 ASSY 치수 불량.svg": 1,
  "files/claims/260916-r10fzz-범퍼 빔 작동 불량.svg": 1,
  "files/claims/261002-r10g08-도어래치 ASSY 용접 스패터.svg": 2,
  "files/defects/260406-r10gdb-커넥터 하우징 외관 (스크래치·찍힘).svg": 1,
  "files/defects/260503-r10gdi-커넥터 하우징 외관 (스크래치·찍힘).svg": 1,
  "files/defects/260512-r10gdp-브라켓 BRK-1830 외관 (스크래치·찍힘).svg": 1,
  "files/defects/260501-r10gdw-배터리 트레이 외관 (스크래치·찍힘).svg": 1,
  "files/defects/260628-r10ge3-배터리 트레이 용접 강도 미달.svg": 1,
  "files/defects/260607-r10gea-글로브박스 외관 (스크래치·찍힘).svg": 1,
  "files/defects/260630-r10geh-배터리 트레이 용접 스패터.svg": 1,
  "files/defects/260619-r10geo-콘솔 커버 외관 (스크래치·찍힘).svg": 1,
  "files/defects/260722-r10gev-힌지 ASSY 외관 (스크래치·찍힘).svg": 1,
  "files/defects/260714-r10gf2-글로브박스 사출 미성형.svg": 1,
  "files/defects/260728-r10gf9-도어 트림 사출 수축.svg": 1,
  "files/defects/260807-r10gfg-브라켓 BRK-1830 오조립·누락.svg": 1,
  "files/defects/260810-r10gfn-도어 트림 외관 (스크래치·찍힘).svg": 1,
  "files/defects/260809-r10gfu-브라켓 BRK-1830 외관 (스크래치·찍힘).svg": 1,
  "files/defects/260926-r10gg1-글로브박스 외관 (스크래치·찍힘).svg": 1,
  "files/defects/260927-r10gg8-범퍼 빔 용접 스패터.svg": 1,
  "files/defects/260910-r10ggf-배터리 트레이 용접 강도 미달.svg": 1,
  "files/defects/261006-r10ggm-도어 트림 사출 수축.svg": 1,
  "files/layout/공장 배치도.svg": 2
 },
 "changelog": [
  {
   "at": "2026-10-08T07:34:32.295Z",
   "who": "품질보증팀",
   "ds": "change4m",
   "rid": "r10h8c",
   "title": "암레스트 검사 방법 변경",
   "kind": "comment",
   "text": "ㅔㅔㅔ"
  },
  {
   "at": "2026-10-08T07:09:47.686Z",
   "who": "품질보증팀",
   "ds": "nc",
   "rid": "r10h24",
   "title": "8.4.2.4 공급자 모니터링",
   "kind": "edit",
   "fields": [
    {
     "l": "상태",
     "from": "접수",
     "to": "조치중"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T07:09:44.455Z",
   "who": "품질보증팀",
   "ds": "nc",
   "rid": "r10h24",
   "title": "8.4.2.4 공급자 모니터링",
   "kind": "edit",
   "fields": [
    {
     "l": "상태",
     "from": "조치중",
     "to": "접수"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:41:10.468Z",
   "who": "품질보증팀",
   "ds": "defects",
   "rid": "r10gg9",
   "title": [
    "배터리 트레이",
    "리어 브라켓"
   ],
   "kind": "edit",
   "fields": [
    {
     "l": "부품",
     "from": "배터리 트레이",
     "to": "배터리 트레이, 리어 브라켓"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:40:29.771Z",
   "who": "품질보증팀",
   "ds": "defects",
   "rid": "r10ggi",
   "title": [
    "배터리 트레이",
    "도어래치 ASSY"
   ],
   "kind": "edit",
   "fields": [
    {
     "l": "부품",
     "from": "배터리 트레이",
     "to": "배터리 트레이, 도어래치 ASSY"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:40:18.987Z",
   "who": "품질보증팀",
   "ds": "inspections",
   "rid": "r10gtm",
   "title": "커넥터 하우징",
   "kind": "edit",
   "fields": [
    {
     "l": "협력사",
     "from": "삼진프레스",
     "to": "삼진프레스, 세화테크"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:37:20.514Z",
   "who": "품질보증팀",
   "ds": "cpk",
   "rid": "r10gyd",
   "title": "용접 너겟 직경",
   "kind": "edit",
   "fields": [
    {
     "l": "라인",
     "from": "용접 1, 프레스 1",
     "to": "용접 1"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:37:14.473Z",
   "who": "품질보증팀",
   "ds": "cpk",
   "rid": "r10gyd",
   "title": "용접 너겟 직경",
   "kind": "edit",
   "fields": [
    {
     "l": "라인",
     "from": "용접 1",
     "to": "용접 1, 프레스 1"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:36:09.633Z",
   "who": "품질보증팀",
   "ds": "cpk",
   "rid": "r10gvw",
   "title": "도장 막두께",
   "kind": "edit",
   "fields": [
    {
     "l": "부품",
     "from": "콘솔 커버",
     "to": "콘솔 커버, 도어래치 ASSY"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:35:54.545Z",
   "who": "품질보증팀",
   "ds": "cpk",
   "rid": "r10gyc",
   "title": "도장 막두께",
   "kind": "edit",
   "fields": [
    {
     "l": "라인",
     "from": "도장, 프레스 1, 프레스 2",
     "to": "도장"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:35:46.721Z",
   "who": "품질보증팀",
   "ds": "cpk",
   "rid": "r10gyc",
   "title": "도장 막두께",
   "kind": "edit",
   "fields": [
    {
     "l": "라인",
     "from": "도장",
     "to": "도장, 프레스 1, 프레스 2"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:33:10.575Z",
   "who": "품질보증팀",
   "ds": "tasks",
   "rid": "r10h4k",
   "title": "G사 PPAP Level 3 제출",
   "kind": "edit",
   "fields": [
    {
     "l": "담당",
     "from": "윤재호, 김민수",
     "to": "윤재호"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:33:06.855Z",
   "who": "품질보증팀",
   "ds": "tasks",
   "rid": "r10h4k",
   "title": "G사 PPAP Level 3 제출",
   "kind": "edit",
   "fields": [
    {
     "l": "담당",
     "from": "윤재호",
     "to": "윤재호, 김민수"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:32:13.127Z",
   "who": "품질보증팀",
   "ds": "inspections",
   "rid": "r10gtj",
   "title": "암레스트",
   "kind": "edit",
   "fields": [
    {
     "l": "협력사",
     "from": "미래사출",
     "to": "비어 있음"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:32:10.831Z",
   "who": "품질보증팀",
   "ds": "inspections",
   "rid": "r10gtj",
   "title": "암레스트",
   "kind": "edit",
   "fields": [
    {
     "l": "협력사",
     "from": "비어 있음",
     "to": "미래사출"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:30:36.430Z",
   "who": "품질보증팀",
   "ds": "inspections",
   "rid": "r10gtj",
   "title": "암레스트",
   "kind": "edit",
   "fields": [
    {
     "l": "협력사",
     "from": "미래사출",
     "to": "비어 있음"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:30:34.158Z",
   "who": "품질보증팀",
   "ds": "inspections",
   "rid": "r10gtj",
   "title": "암레스트",
   "kind": "edit",
   "fields": [
    {
     "l": "협력사",
     "from": "비어 있음",
     "to": "미래사출"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:27:38.356Z",
   "who": "품질보증팀",
   "ds": "ppap",
   "rid": "r10h43",
   "title": "리어 브라켓 (금형 이관)",
   "kind": "edit",
   "fields": [
    {
     "l": "고객사",
     "from": "H사, K사",
     "to": "H사"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:27:36.013Z",
   "who": "품질보증팀",
   "ds": "ppap",
   "rid": "r10h43",
   "title": "리어 브라켓 (금형 이관)",
   "kind": "edit",
   "fields": [
    {
     "l": "고객사",
     "from": "H사",
     "to": "H사, K사"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:27:34.637Z",
   "who": "품질보증팀",
   "ds": "ppap",
   "rid": "r10h43",
   "title": "리어 브라켓 (금형 이관)",
   "kind": "edit",
   "fields": [
    {
     "l": "제출 레벨",
     "from": "Level 1",
     "to": "Level 3"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:27:32.076Z",
   "who": "품질보증팀",
   "ds": "ppap",
   "rid": "r10h43",
   "title": "리어 브라켓 (금형 이관)",
   "kind": "edit",
   "fields": [
    {
     "l": "제출 레벨",
     "from": "Level 3",
     "to": "Level 1"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:26:16.684Z",
   "who": "품질보증팀",
   "ds": "ppap",
   "rid": "r10h43",
   "title": "리어 브라켓 (금형 이관)",
   "kind": "edit",
   "fields": [
    {
     "l": "고객사",
     "from": "H사, K사",
     "to": "H사"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:26:02.219Z",
   "who": "품질보증팀",
   "ds": "ppap",
   "rid": "r10h43",
   "title": "리어 브라켓 (금형 이관)",
   "kind": "edit",
   "fields": [
    {
     "l": "고객사",
     "from": "H사",
     "to": "H사, K사"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:25:58.011Z",
   "who": "품질보증팀",
   "ds": "ppap",
   "rid": "r10h43",
   "title": "리어 브라켓 (금형 이관)",
   "kind": "edit",
   "fields": [
    {
     "l": "고객사",
     "from": "H사, K사",
     "to": "H사"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:25:55.211Z",
   "who": "품질보증팀",
   "ds": "ppap",
   "rid": "r10h43",
   "title": "리어 브라켓 (금형 이관)",
   "kind": "edit",
   "fields": [
    {
     "l": "고객사",
     "from": "H사",
     "to": "H사, K사"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:25:05.323Z",
   "who": "품질보증팀",
   "ds": "cpk",
   "rid": "r10gyc",
   "title": "도장 막두께",
   "kind": "edit",
   "fields": [
    {
     "l": "부품",
     "from": "콘솔 커버, 도어래치 ASSY",
     "to": "콘솔 커버"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:25:02.915Z",
   "who": "품질보증팀",
   "ds": "cpk",
   "rid": "r10gyc",
   "title": "도장 막두께",
   "kind": "edit",
   "fields": [
    {
     "l": "부품",
     "from": "콘솔 커버",
     "to": "콘솔 커버, 도어래치 ASSY"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:24:14.491Z",
   "who": "품질보증팀",
   "ds": "cpk",
   "rid": "r10gyc",
   "title": "도장 막두께",
   "kind": "edit",
   "fields": [
    {
     "l": "부품",
     "from": "콘솔 커버, 도어래치 ASSY",
     "to": "콘솔 커버"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:24:11.882Z",
   "who": "품질보증팀",
   "ds": "cpk",
   "rid": "r10gyc",
   "title": "도장 막두께",
   "kind": "edit",
   "fields": [
    {
     "l": "부품",
     "from": "콘솔 커버",
     "to": "콘솔 커버, 도어래치 ASSY"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:23:42.522Z",
   "who": "품질보증팀",
   "ds": "people",
   "rid": "r10fq9",
   "title": "김민수",
   "kind": "edit",
   "fields": [
    {
     "l": "소속",
     "from": "협력사품질",
     "to": "고객품질"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:23:40.042Z",
   "who": "품질보증팀",
   "ds": "people",
   "rid": "r10fq9",
   "title": "김민수",
   "kind": "edit",
   "fields": [
    {
     "l": "소속",
     "from": "고객품질",
     "to": "협력사품질"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:22:42.938Z",
   "who": "품질보증팀",
   "ds": "tasks",
   "rid": "r10h4k",
   "title": "G사 PPAP Level 3 제출",
   "kind": "edit",
   "fields": [
    {
     "l": "담당",
     "from": "윤재호, 김민수",
     "to": "윤재호"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:22:39.674Z",
   "who": "품질보증팀",
   "ds": "tasks",
   "rid": "r10h4k",
   "title": "G사 PPAP Level 3 제출",
   "kind": "edit",
   "fields": [
    {
     "l": "담당",
     "from": "윤재호, 김민수, 이서연",
     "to": "윤재호, 김민수"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:22:34.706Z",
   "who": "품질보증팀",
   "ds": "tasks",
   "rid": "r10h4k",
   "title": "G사 PPAP Level 3 제출",
   "kind": "edit",
   "fields": [
    {
     "l": "담당",
     "from": "윤재호, 김민수",
     "to": "윤재호, 김민수, 이서연"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:22:29.809Z",
   "who": "품질보증팀",
   "ds": "tasks",
   "rid": "r10h4k",
   "title": "G사 PPAP Level 3 제출",
   "kind": "edit",
   "fields": [
    {
     "l": "담당",
     "from": "윤재호",
     "to": "윤재호, 김민수"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:19:37.777Z",
   "who": "품질보증팀",
   "ds": "defects",
   "rid": "r10ggi",
   "title": "배터리 트레이",
   "kind": "edit",
   "fields": [
    {
     "l": "라인",
     "from": "용접 2, 용접 1",
     "to": "용접 2"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:19:35.322Z",
   "who": "품질보증팀",
   "ds": "defects",
   "rid": "r10ggi",
   "title": "배터리 트레이",
   "kind": "edit",
   "fields": [
    {
     "l": "라인",
     "from": "용접 2",
     "to": "용접 2, 용접 1"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:19:30.496Z",
   "who": "품질보증팀",
   "ds": "defects",
   "rid": "r10ggi",
   "title": "배터리 트레이",
   "kind": "edit",
   "fields": [
    {
     "l": "불량 유형",
     "from": "용접 스패터, 도장 핀홀·이물",
     "to": "용접 스패터"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:19:27.264Z",
   "who": "품질보증팀",
   "ds": "defects",
   "rid": "r10ggi",
   "title": "배터리 트레이",
   "kind": "edit",
   "fields": [
    {
     "l": "불량 유형",
     "from": "용접 스패터",
     "to": "용접 스패터, 도장 핀홀·이물"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:17:55.383Z",
   "who": "품질보증팀",
   "ds": "ppap",
   "rid": "r10h43",
   "title": "리어 브라켓 (금형 이관)",
   "kind": "edit",
   "fields": [
    {
     "l": "고객사",
     "from": "K사",
     "to": "H사"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:17:53.336Z",
   "who": "품질보증팀",
   "ds": "ppap",
   "rid": "r10h43",
   "title": "리어 브라켓 (금형 이관)",
   "kind": "edit",
   "fields": [
    {
     "l": "고객사",
     "from": "H사",
     "to": "K사"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:16:35.790Z",
   "who": "품질보증팀",
   "ds": "capa",
   "rid": "r10g2y",
   "title": "도어래치 ASSY 외관 (스크래치·찍힘)",
   "kind": "edit",
   "fields": [
    {
     "l": "관련 협력사",
     "from": "대성정밀",
     "to": "삼진프레스"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T06:16:33.822Z",
   "who": "품질보증팀",
   "ds": "capa",
   "rid": "r10g2y",
   "title": "도어래치 ASSY 외관 (스크래치·찍힘)",
   "kind": "edit",
   "fields": [
    {
     "l": "관련 협력사",
     "from": "비어 있음",
     "to": "대성정밀"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T05:24:37.940Z",
   "who": "품질보증팀",
   "ds": "suppliers",
   "rid": "r10gyq",
   "title": "대성정밀",
   "kind": "del"
  },
  {
   "at": "2026-10-08T05:24:34.255Z",
   "who": "품질보증팀",
   "ds": "suppliers",
   "rid": "r10gyp",
   "title": "대성정밀",
   "kind": "edit",
   "fields": [
    {
     "l": "상태",
     "from": "개선요구",
     "to": "평가완료"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T05:24:26.999Z",
   "who": "품질보증팀",
   "ds": "suppliers",
   "rid": "r10gyp",
   "title": "대성정밀",
   "kind": "edit",
   "fields": [
    {
     "l": "상태",
     "from": "평가완료",
     "to": "개선요구"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-08T00:12:00.000Z",
   "who": "김민수",
   "ds": "claims",
   "rid": "r10g07",
   "title": "CL-26-127",
   "kind": "add"
  },
  {
   "at": "2026-10-07T23:40:00.000Z",
   "who": "최유진",
   "ds": "capa",
   "rid": "r10g32",
   "title": "배터리 트레이 도장 핀홀·이물",
   "kind": "edit",
   "fields": [
    {
     "l": "진행 단계",
     "from": "D3",
     "to": "D1~D2"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-07T08:05:00.000Z",
   "who": "이서연",
   "ds": "claims",
   "rid": "r10g09",
   "title": "CL-26-126",
   "kind": "edit",
   "fields": [
    {
     "l": "상태",
     "from": "접수",
     "to": "접수"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-07T06:22:00.000Z",
   "who": "오세린",
   "ds": "calib",
   "rid": "r10h65",
   "title": "버니어 캘리퍼스 D",
   "kind": "edit",
   "fields": [
    {
     "l": "최근 교정일",
     "from": "2025-10-02",
     "to": "2026-05-19"
    },
    {
     "l": "차기 교정일",
     "from": "2026-10-02",
     "to": "2027-05-19"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-07T02:03:00.000Z",
   "who": "박지훈",
   "ds": "suppliers",
   "rid": "r10h1n",
   "title": "한라부품",
   "kind": "edit",
   "fields": [
    {
     "l": "상태",
     "from": "평가완료",
     "to": "평가완료"
    }
   ],
   "more": 0
  },
  {
   "at": "2026-10-06T07:48:00.000Z",
   "who": "정하늘",
   "ds": "nc",
   "rid": "r10h24",
   "title": "8.4.2.4 공급자 모니터링",
   "kind": "add"
  },
  {
   "at": "2026-10-06T01:30:00.000Z",
   "who": "윤재호",
   "ds": "copq",
   "rid": "r10hf4",
   "title": "예방 (교육·개선)",
   "kind": "add"
  },
  {
   "at": "2026-10-05T05:15:00.000Z",
   "who": "한도윤",
   "ds": "launch",
   "rid": "r10h34",
   "title": "스티어링 브라켓",
   "kind": "edit",
   "fields": [
    {
     "l": "누적 불량",
     "from": "3",
     "to": "11"
    }
   ],
   "more": 0
  }
 ],
 "datasets": [
  {
   "id": "people",
   "name": "담당자",
   "master": true,
   "desc": "담당자·작성자로 고르는 품질보증팀 사람 목록입니다.",
   "dateField": "",
   "titleField": "name",
   "asOfField": "",
   "fields": [
    {
     "key": "name",
     "label": "이름",
     "type": "text",
     "req": true
    },
    {
     "key": "team",
     "label": "소속",
     "type": "select",
     "options": [
      "고객품질",
      "협력사품질",
      "공정품질",
      "품질시스템",
      "신규양산",
      "검사",
      "품질기획"
     ]
    },
    {
     "key": "role",
     "label": "담당 업무",
     "type": "text"
    },
    {
     "key": "open_capa",
     "label": "담당 미결 8D",
     "type": "rollup",
     "rel": "capa:owner",
     "agg": "count",
     "where": {
      "f": "status",
      "op": "!=",
      "v": "완료"
     }
    },
    {
     "key": "open_claim",
     "label": "담당 미결 클레임",
     "type": "rollup",
     "rel": "claims:owner",
     "agg": "count",
     "where": {
      "f": "status",
      "op": "!=",
      "v": "완료"
     }
    }
   ],
   "records": [
    {
     "id": "r10fq9",
     "name": "김민수",
     "team": "고객품질",
     "role": "고객 클레임 · 8D"
    },
    {
     "id": "r10fqa",
     "name": "이서연",
     "team": "고객품질",
     "role": "고객 대응 · PPAP"
    },
    {
     "id": "r10fqb",
     "name": "박지훈",
     "team": "협력사품질",
     "role": "협력사 평가 · 수입검사"
    },
    {
     "id": "r10fqc",
     "name": "최유진",
     "team": "공정품질",
     "role": "공정 불량 · SPC"
    },
    {
     "id": "r10fqd",
     "name": "정하늘",
     "team": "품질시스템",
     "role": "IATF · 내부심사"
    },
    {
     "id": "r10fqe",
     "name": "한도윤",
     "team": "신규양산",
     "role": "초기유동 · PPAP"
    },
    {
     "id": "r10fqf",
     "name": "오세린",
     "team": "검사",
     "role": "측정기 · 검사"
    },
    {
     "id": "r10fqg",
     "name": "윤재호",
     "team": "품질기획",
     "role": "품질 비용 · 교육"
    }
   ]
  },
  {
   "id": "customers",
   "name": "고객사",
   "master": true,
   "desc": "완성차·전기차 고객사 목록입니다. 클레임·PPAP·심사에서 골라 씁니다.",
   "dateField": "",
   "titleField": "name",
   "asOfField": "",
   "fields": [
    {
     "key": "name",
     "label": "고객사",
     "type": "text",
     "req": true
    },
    {
     "key": "kind",
     "label": "구분",
     "type": "select",
     "options": [
      "완성차",
      "전기차",
      "1차 협력사",
      "기타"
     ]
    },
    {
     "key": "contact",
     "label": "고객 품질 담당",
     "type": "text"
    },
    {
     "key": "note",
     "label": "비고",
     "type": "text"
    },
    {
     "key": "n_claim",
     "label": "클레임 건수",
     "type": "rollup",
     "rel": "claims:customer",
     "agg": "count"
    },
    {
     "key": "n_open",
     "label": "미결 클레임",
     "type": "rollup",
     "rel": "claims:customer",
     "agg": "count",
     "where": {
      "f": "status",
      "op": "!=",
      "v": "완료"
     }
    },
    {
     "key": "cost_sum",
     "label": "클레임 비용 합계(만원)",
     "type": "rollup",
     "rel": "claims:customer",
     "agg": "sum",
     "field": "cost"
    }
   ],
   "tpls": [],
   "records": [
    {
     "id": "r10fqh",
     "name": "H사",
     "kind": "완성차",
     "contact": "H사 품질팀 이과장",
     "note": ""
    },
    {
     "id": "r10fqi",
     "name": "K사",
     "kind": "완성차",
     "contact": "K사 SQ팀",
     "note": ""
    },
    {
     "id": "r10fqj",
     "name": "G사",
     "kind": "완성차",
     "contact": "G사 협력사품질",
     "note": ""
    },
    {
     "id": "r10fqk",
     "name": "R사",
     "kind": "완성차",
     "contact": "R사 품질보증",
     "note": ""
    },
    {
     "id": "r10fql",
     "name": "S모빌리티",
     "kind": "전기차",
     "contact": "S모빌리티 부품품질",
     "note": ""
    },
    {
     "id": "r10fqm",
     "name": "기타",
     "kind": "기타",
     "contact": "",
     "note": ""
    }
   ]
  },
  {
   "id": "parts",
   "name": "부품",
   "master": true,
   "desc": "관리 대상 부품(품번·품명)과 도면입니다.",
   "dateField": "",
   "titleField": "name",
   "asOfField": "",
   "fields": [
    {
     "key": "name",
     "label": "품명",
     "type": "text",
     "req": true
    },
    {
     "key": "partno",
     "label": "품번",
     "type": "text"
    },
    {
     "key": "customer",
     "label": "고객사",
     "type": "ref",
     "ref": "customers"
    },
    {
     "key": "process",
     "label": "주 공정",
     "type": "select",
     "options": [
      "프레스",
      "용접",
      "사출",
      "도장",
      "조립"
     ]
    },
    {
     "key": "files",
     "label": "사진 · 도면",
     "type": "file"
    },
    {
     "key": "n_claim",
     "label": "클레임 건수",
     "type": "rollup",
     "rel": "claims:part",
     "agg": "count"
    },
    {
     "key": "def_qty",
     "label": "공정 불량 수량",
     "type": "rollup",
     "rel": "defects:part",
     "agg": "sum",
     "field": "qty"
    }
   ],
   "records": [
    {
     "id": "r10fqn",
     "name": "도어래치 ASSY",
     "partno": "LAT-3290",
     "customer": "H사",
     "process": "조립",
     "files": [
      {
       "name": "도어래치 ASSY 도면.svg",
       "path": "files/parts/261008-r10fqn-도어래치 ASSY 도면.svg",
       "type": "image/svg+xml",
       "size": 1607,
       "at": "2026-10-08"
      }
     ]
    },
    {
     "id": "r10fqo",
     "name": "시트프레임",
     "partno": "SF-1150",
     "customer": "K사",
     "process": "용접",
     "files": [
      {
       "name": "시트프레임 도면.svg",
       "path": "files/parts/261008-r10fqo-시트프레임 도면.svg",
       "type": "image/svg+xml",
       "size": 1604,
       "at": "2026-10-08"
      }
     ]
    },
    {
     "id": "r10fqp",
     "name": "콘솔 커버",
     "partno": "CV-4400",
     "customer": "H사",
     "process": "사출",
     "files": [
      {
       "name": "콘솔 커버 도면.svg",
       "path": "files/parts/261008-r10fqp-콘솔 커버 도면.svg",
       "type": "image/svg+xml",
       "size": 1602,
       "at": "2026-10-08"
      }
     ]
    },
    {
     "id": "r10fqq",
     "name": "브라켓 BRK-1830",
     "partno": "BRK-1830",
     "customer": "G사",
     "process": "프레스",
     "files": [
      {
       "name": "브라켓 BRK-1830 도면.svg",
       "path": "files/parts/261008-r10fqq-브라켓 BRK-1830 도면.svg",
       "type": "image/svg+xml",
       "size": 1608,
       "at": "2026-10-08"
      }
     ]
    },
    {
     "id": "r10fqr",
     "name": "힌지 ASSY",
     "partno": "HG-0920",
     "customer": "R사",
     "process": "조립",
     "files": [
      {
       "name": "힌지 ASSY 도면.svg",
       "path": "files/parts/261008-r10fqr-힌지 ASSY 도면.svg",
       "type": "image/svg+xml",
       "size": 1600,
       "at": "2026-10-08"
      }
     ]
    },
    {
     "id": "r10fqs",
     "name": "글로브박스",
     "partno": "GB-2200",
     "customer": "G사",
     "process": "사출",
     "files": [
      {
       "name": "글로브박스 도면.svg",
       "path": "files/parts/261008-r10fqs-글로브박스 도면.svg",
       "type": "image/svg+xml",
       "size": 1604,
       "at": "2026-10-08"
      }
     ]
    },
    {
     "id": "r10fqt",
     "name": "리어 브라켓",
     "partno": "BRK-2041",
     "customer": "H사",
     "process": "프레스",
     "files": []
    },
    {
     "id": "r10fqu",
     "name": "암레스트",
     "partno": "AR-1100",
     "customer": "K사",
     "process": "사출",
     "files": []
    },
    {
     "id": "r10fqv",
     "name": "배터리 트레이",
     "partno": "BT-5100",
     "customer": "S모빌리티",
     "process": "용접",
     "files": []
    },
    {
     "id": "r10fqw",
     "name": "범퍼 빔",
     "partno": "BB-3300",
     "customer": "H사",
     "process": "용접",
     "files": []
    },
    {
     "id": "r10fqx",
     "name": "도어 트림",
     "partno": "DT-7710",
     "customer": "K사",
     "process": "사출",
     "files": []
    },
    {
     "id": "r10fqy",
     "name": "커넥터 하우징",
     "partno": "CH-0451",
     "customer": "S모빌리티",
     "process": "사출",
     "files": []
    },
    {
     "id": "r10fqz",
     "name": "스티어링 브라켓",
     "partno": "SB-6620",
     "customer": "G사",
     "process": "프레스",
     "files": []
    },
    {
     "id": "r10fr0",
     "name": "테일게이트 힌지",
     "partno": "TH-0880",
     "customer": "R사",
     "process": "프레스",
     "files": []
    }
   ]
  },
  {
   "id": "defecttypes",
   "name": "불량 유형",
   "master": true,
   "desc": "클레임·불량 발생에서 고르는 불량 유형입니다.",
   "dateField": "",
   "titleField": "name",
   "asOfField": "",
   "fields": [
    {
     "key": "name",
     "label": "불량 유형",
     "type": "text",
     "req": true
    },
    {
     "key": "group",
     "label": "분류",
     "type": "select",
     "options": [
      "기능",
      "외관",
      "치수",
      "조립",
      "공정",
      "재질",
      "기타"
     ]
    },
    {
     "key": "note",
     "label": "판정 기준 · 비고",
     "type": "text"
    }
   ],
   "records": [
    {
     "id": "r10fr1",
     "name": "작동 불량",
     "group": "기능",
     "note": ""
    },
    {
     "id": "r10fr2",
     "name": "외관 (스크래치·찍힘)",
     "group": "외관",
     "note": ""
    },
    {
     "id": "r10fr3",
     "name": "치수 불량",
     "group": "치수",
     "note": ""
    },
    {
     "id": "r10fr4",
     "name": "소음·진동",
     "group": "기능",
     "note": ""
    },
    {
     "id": "r10fr5",
     "name": "오조립·누락",
     "group": "조립",
     "note": ""
    },
    {
     "id": "r10fr6",
     "name": "도장 핀홀·이물",
     "group": "외관",
     "note": ""
    },
    {
     "id": "r10fr7",
     "name": "용접 스패터",
     "group": "공정",
     "note": ""
    },
    {
     "id": "r10fr8",
     "name": "용접 강도 미달",
     "group": "공정",
     "note": ""
    },
    {
     "id": "r10fr9",
     "name": "사출 수축",
     "group": "재질",
     "note": ""
    },
    {
     "id": "r10fra",
     "name": "사출 미성형",
     "group": "재질",
     "note": ""
    },
    {
     "id": "r10frb",
     "name": "도금 박리",
     "group": "재질",
     "note": ""
    },
    {
     "id": "r10frc",
     "name": "체결 불량",
     "group": "조립",
     "note": ""
    },
    {
     "id": "r10frd",
     "name": "이종 부품 혼입",
     "group": "조립",
     "note": ""
    },
    {
     "id": "r10fre",
     "name": "기타",
     "group": "기타",
     "note": ""
    }
   ]
  },
  {
   "id": "vendors",
   "name": "협력사",
   "master": true,
   "desc": "부품 협력사 목록입니다. 협력사 평가·수입검사에서 골라 씁니다.",
   "dateField": "",
   "titleField": "name",
   "asOfField": "",
   "fields": [
    {
     "key": "name",
     "label": "협력사",
     "type": "text",
     "req": true
    },
    {
     "key": "process",
     "label": "공정",
     "type": "select",
     "options": [
      "프레스",
      "사출",
      "용접",
      "도금",
      "도장",
      "고무",
      "전장",
      "가공",
      "조립"
     ]
    },
    {
     "key": "owner",
     "label": "관리 담당",
     "type": "ref",
     "ref": "people"
    },
    {
     "key": "note",
     "label": "비고",
     "type": "text"
    },
    {
     "key": "in_def",
     "label": "입고 불량 수량",
     "type": "rollup",
     "rel": "defects:vendor",
     "agg": "sum",
     "field": "qty",
     "where": {
      "f": "kind",
      "op": "=",
      "v": "입고"
     }
    },
    {
     "key": "avg_score",
     "label": "평균 평가 점수",
     "type": "rollup",
     "rel": "suppliers:name",
     "agg": "avg",
     "field": "score"
    }
   ],
   "records": [
    {
     "id": "r10frf",
     "name": "대성정밀",
     "process": "프레스",
     "owner": "윤재호",
     "note": ""
    },
    {
     "id": "r10frg",
     "name": "삼진프레스",
     "process": "프레스",
     "owner": "박지훈",
     "note": ""
    },
    {
     "id": "r10frh",
     "name": "세화테크",
     "process": "사출",
     "owner": "박지훈",
     "note": ""
    },
    {
     "id": "r10fri",
     "name": "성원전자",
     "process": "전장",
     "owner": "윤재호",
     "note": ""
    },
    {
     "id": "r10frj",
     "name": "동양도금",
     "process": "도금",
     "owner": "박지훈",
     "note": ""
    },
    {
     "id": "r10frk",
     "name": "한빛고무",
     "process": "고무",
     "owner": "박지훈",
     "note": ""
    },
    {
     "id": "r10frl",
     "name": "미래사출",
     "process": "사출",
     "owner": "윤재호",
     "note": ""
    },
    {
     "id": "r10frm",
     "name": "우진금속",
     "process": "프레스",
     "owner": "박지훈",
     "note": ""
    },
    {
     "id": "r10frn",
     "name": "태광산업",
     "process": "용접",
     "owner": "박지훈",
     "note": ""
    },
    {
     "id": "r10fro",
     "name": "신흥정공",
     "process": "가공",
     "owner": "윤재호",
     "note": ""
    },
    {
     "id": "r10frp",
     "name": "해성화학",
     "process": "사출",
     "owner": "박지훈",
     "note": ""
    },
    {
     "id": "r10frq",
     "name": "진영테크",
     "process": "조립",
     "owner": "박지훈",
     "note": ""
    },
    {
     "id": "r10frr",
     "name": "대명오토",
     "process": "조립",
     "owner": "윤재호",
     "note": ""
    },
    {
     "id": "r10frs",
     "name": "경일산업",
     "process": "도장",
     "owner": "박지훈",
     "note": ""
    },
    {
     "id": "r10frt",
     "name": "유성정밀",
     "process": "가공",
     "owner": "박지훈",
     "note": ""
    },
    {
     "id": "r10fru",
     "name": "한라부품",
     "process": "용접",
     "owner": "윤재호",
     "note": ""
    }
   ]
  },
  {
   "id": "lines",
   "name": "생산 라인",
   "master": true,
   "desc": "공정 불량·Cpk·측정기에서 고르는 생산 라인입니다.",
   "dateField": "",
   "titleField": "name",
   "asOfField": "",
   "fields": [
    {
     "key": "name",
     "label": "라인",
     "type": "text",
     "req": true
    },
    {
     "key": "process",
     "label": "공정",
     "type": "select",
     "options": [
      "프레스",
      "용접",
      "사출",
      "도장",
      "조립"
     ]
    },
    {
     "key": "note",
     "label": "비고",
     "type": "text"
    }
   ],
   "records": [
    {
     "id": "r10frv",
     "name": "프레스 1",
     "process": "프레스",
     "note": ""
    },
    {
     "id": "r10frw",
     "name": "프레스 2",
     "process": "프레스",
     "note": ""
    },
    {
     "id": "r10frx",
     "name": "용접 1",
     "process": "용접",
     "note": ""
    },
    {
     "id": "r10fry",
     "name": "용접 2",
     "process": "용접",
     "note": ""
    },
    {
     "id": "r10frz",
     "name": "사출 1",
     "process": "사출",
     "note": ""
    },
    {
     "id": "r10fs0",
     "name": "도장",
     "process": "도장",
     "note": ""
    },
    {
     "id": "r10fs1",
     "name": "조립 1",
     "process": "조립",
     "note": ""
    },
    {
     "id": "r10fs2",
     "name": "조립 2",
     "process": "조립",
     "note": ""
    }
   ]
  },
  {
   "id": "claims",
   "name": "고객 클레임",
   "desc": "완성차 고객사 클레임 접수부터 종결까지 기록합니다.",
   "dateField": "date",
   "titleField": "no",
   "fields": [
    {
     "key": "no",
     "label": "클레임 번호",
     "type": "text",
     "auto": "CL-{YY}-",
     "req": true
    },
    {
     "key": "date",
     "label": "접수일",
     "type": "date",
     "req": true
    },
    {
     "key": "customer",
     "label": "고객사",
     "type": "ref",
     "ref": "customers",
     "req": true
    },
    {
     "key": "part",
     "label": "부품",
     "type": "ref",
     "ref": "parts"
    },
    {
     "key": "type",
     "label": "불량 유형",
     "type": "ref",
     "ref": "defecttypes"
    },
    {
     "key": "qty",
     "label": "수량",
     "type": "number"
    },
    {
     "key": "cost",
     "label": "클레임 비용(만원)",
     "type": "number"
    },
    {
     "key": "unitcost",
     "label": "건당 비용(만원)",
     "type": "formula",
     "expr": "round({클레임 비용(만원)} / {수량}, 1)"
    },
    {
     "key": "owner",
     "label": "담당",
     "type": "ref",
     "ref": "people"
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "접수",
      "조사중",
      "대책수립",
      "완료"
     ],
     "badge": true
    },
    {
     "key": "closed",
     "label": "완료일",
     "type": "date",
     "closes": true
    },
    {
     "key": "lead",
     "label": "처리 기간(일)",
     "type": "days",
     "from": "date",
     "to": "closed"
    },
    {
     "key": "files",
     "label": "사진 · 자료",
     "type": "file"
    },
    {
     "key": "fmuz3lqn3",
     "label": "새 항목",
     "type": "text"
    },
    {
     "key": "fmuz3m0v2",
     "label": "새 항목 2",
     "type": "text"
    }
   ],
   "records": [
    {
     "id": "r10fsg",
     "no": "CL-25-001",
     "date": "2025-01-03",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 10,
     "cost": 1080,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-02-01",
     "files": []
    },
    {
     "id": "r10fsb",
     "no": "CL-25-002",
     "date": "2025-01-04",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "cost": 265,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-02-11",
     "files": []
    },
    {
     "id": "r10fs4",
     "no": "CL-25-003",
     "date": "2025-01-05",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "소음·진동",
     "qty": 2,
     "cost": 245,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-02-04",
     "files": []
    },
    {
     "id": "r10fs8",
     "no": "CL-25-004",
     "date": "2025-01-10",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "용접 스패터",
     "qty": 3,
     "cost": 300,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-02-06",
     "files": []
    },
    {
     "id": "r10fs5",
     "no": "CL-25-005",
     "date": "2025-01-11",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "소음·진동",
     "qty": 2,
     "cost": 320,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-02-07",
     "files": []
    },
    {
     "id": "r10fs6",
     "no": "CL-25-006",
     "date": "2025-01-11",
     "customer": "G사",
     "part": "글로브박스",
     "type": "체결 불량",
     "qty": 8,
     "cost": 1155,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-01-18",
     "files": []
    },
    {
     "id": "r10fsj",
     "no": "CL-25-007",
     "date": "2025-01-12",
     "customer": "K사",
     "part": "도어 트림",
     "type": "이종 부품 혼입",
     "qty": 1,
     "cost": 160,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-01-24",
     "files": []
    },
    {
     "id": "r10fsf",
     "no": "CL-25-008",
     "date": "2025-01-13",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "도장 핀홀·이물",
     "qty": 1,
     "cost": 195,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-01-25",
     "files": []
    },
    {
     "id": "r10fsh",
     "no": "CL-25-009",
     "date": "2025-01-13",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "작동 불량",
     "qty": 5,
     "cost": 470,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-02-07",
     "files": []
    },
    {
     "id": "r10fsa",
     "no": "CL-25-010",
     "date": "2025-01-15",
     "customer": "K사",
     "part": "시트프레임",
     "type": "오조립·누락",
     "qty": 1,
     "cost": 150,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-02-09",
     "files": []
    },
    {
     "id": "r10fs3",
     "no": "CL-25-011",
     "date": "2025-01-16",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "도장 핀홀·이물",
     "qty": 23,
     "cost": 1570,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-01-30",
     "files": []
    },
    {
     "id": "r10fs9",
     "no": "CL-25-012",
     "date": "2025-01-16",
     "customer": "기타",
     "part": "글로브박스",
     "type": "치수 불량",
     "qty": 19,
     "cost": 545,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-02-06",
     "files": []
    },
    {
     "id": "r10fsd",
     "no": "CL-25-013",
     "date": "2025-01-20",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "cost": 380,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-01-27",
     "files": []
    },
    {
     "id": "r10fs7",
     "no": "CL-25-014",
     "date": "2025-01-23",
     "customer": "K사",
     "part": "도어 트림",
     "type": "치수 불량",
     "qty": 37,
     "cost": 3120,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-02-09",
     "files": []
    },
    {
     "id": "r10fse",
     "no": "CL-25-015",
     "date": "2025-01-25",
     "customer": "G사",
     "part": "글로브박스",
     "type": "작동 불량",
     "qty": 10,
     "cost": 990,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-02-21",
     "files": []
    },
    {
     "id": "r10fsc",
     "no": "CL-25-016",
     "date": "2025-01-26",
     "customer": "G사",
     "part": "글로브박스",
     "type": "작동 불량",
     "qty": 38,
     "cost": 5220,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-02-10",
     "files": []
    },
    {
     "id": "r10fsi",
     "no": "CL-25-017",
     "date": "2025-01-26",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "작동 불량",
     "qty": 11,
     "cost": 855,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-03-03",
     "files": []
    },
    {
     "id": "r10fst",
     "no": "CL-25-018",
     "date": "2025-02-01",
     "customer": "K사",
     "part": "암레스트",
     "type": "용접 스패터",
     "qty": 7,
     "cost": 460,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-03-01",
     "files": []
    },
    {
     "id": "r10fsz",
     "no": "CL-25-019",
     "date": "2025-02-01",
     "customer": "K사",
     "part": "시트프레임",
     "type": "소음·진동",
     "qty": 3,
     "cost": 295,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-02-10",
     "files": []
    },
    {
     "id": "r10fsp",
     "no": "CL-25-020",
     "date": "2025-02-02",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 1,
     "cost": 210,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-02-27",
     "files": []
    },
    {
     "id": "r10fsu",
     "no": "CL-25-021",
     "date": "2025-02-06",
     "customer": "K사",
     "part": "암레스트",
     "type": "오조립·누락",
     "qty": 3,
     "cost": 445,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-02-21",
     "files": []
    },
    {
     "id": "r10fss",
     "no": "CL-25-022",
     "date": "2025-02-09",
     "customer": "K사",
     "part": "시트프레임",
     "type": "기타",
     "qty": 1,
     "cost": 225,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-02-16",
     "files": []
    },
    {
     "id": "r10ft1",
     "no": "CL-25-023",
     "date": "2025-02-09",
     "customer": "K사",
     "part": "시트프레임",
     "type": "작동 불량",
     "qty": 2,
     "cost": 190,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-02-22",
     "files": []
    },
    {
     "id": "r10fsl",
     "no": "CL-25-024",
     "date": "2025-02-12",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "작동 불량",
     "qty": 2,
     "cost": 230,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-02-21",
     "files": []
    },
    {
     "id": "r10fsy",
     "no": "CL-25-025",
     "date": "2025-02-12",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "cost": 150,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-03-04",
     "files": []
    },
    {
     "id": "r10fsm",
     "no": "CL-25-026",
     "date": "2025-02-14",
     "customer": "G사",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 10,
     "cost": 1360,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-03-09",
     "files": []
    },
    {
     "id": "r10fsq",
     "no": "CL-25-027",
     "date": "2025-02-14",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "cost": 220,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-02-25",
     "files": []
    },
    {
     "id": "r10fsr",
     "no": "CL-25-028",
     "date": "2025-02-15",
     "customer": "K사",
     "part": "시트프레임",
     "type": "작동 불량",
     "qty": 6,
     "cost": 300,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-02-28",
     "files": []
    },
    {
     "id": "r10ft0",
     "no": "CL-25-029",
     "date": "2025-02-18",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "cost": 115,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-03-12",
     "files": []
    },
    {
     "id": "r10fsn",
     "no": "CL-25-030",
     "date": "2025-02-23",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "소음·진동",
     "qty": 3,
     "cost": 300,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-03-03",
     "files": []
    },
    {
     "id": "r10fsx",
     "no": "CL-25-031",
     "date": "2025-02-23",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "도장 핀홀·이물",
     "qty": 1,
     "cost": 115,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-03-25",
     "files": []
    },
    {
     "id": "r10fsv",
     "no": "CL-25-032",
     "date": "2025-02-24",
     "customer": "K사",
     "part": "도어 트림",
     "type": "작동 불량",
     "qty": 2,
     "cost": 230,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-03-17",
     "files": []
    },
    {
     "id": "r10fsw",
     "no": "CL-25-033",
     "date": "2025-02-24",
     "customer": "K사",
     "part": "도어 트림",
     "type": "도장 핀홀·이물",
     "qty": 1,
     "cost": 140,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-03-13",
     "files": []
    },
    {
     "id": "r10fsk",
     "no": "CL-25-034",
     "date": "2025-02-25",
     "customer": "R사",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 2,
     "cost": 370,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-03-12",
     "files": []
    },
    {
     "id": "r10fso",
     "no": "CL-25-035",
     "date": "2025-02-28",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 5,
     "cost": 590,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-03-21",
     "files": []
    },
    {
     "id": "r10ft4",
     "no": "CL-25-036",
     "date": "2025-03-02",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 2,
     "cost": 300,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-03-15",
     "files": []
    },
    {
     "id": "r10ft6",
     "no": "CL-25-037",
     "date": "2025-03-02",
     "customer": "R사",
     "part": "테일게이트 힌지",
     "type": "외관 (스크래치·찍힘)",
     "qty": 12,
     "cost": 580,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-03-22",
     "files": []
    },
    {
     "id": "r10ftf",
     "no": "CL-25-038",
     "date": "2025-03-02",
     "customer": "G사",
     "part": "글로브박스",
     "type": "사출 수축",
     "qty": 2,
     "cost": 420,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-04-09",
     "files": []
    },
    {
     "id": "r10ft7",
     "no": "CL-25-039",
     "date": "2025-03-03",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "작동 불량",
     "qty": 12,
     "cost": 1010,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-03-13",
     "files": []
    },
    {
     "id": "r10ft2",
     "no": "CL-25-040",
     "date": "2025-03-04",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 1,
     "cost": 135,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-04-08",
     "files": []
    },
    {
     "id": "r10fta",
     "no": "CL-25-041",
     "date": "2025-03-08",
     "customer": "G사",
     "part": "글로브박스",
     "type": "도장 핀홀·이물",
     "qty": 9,
     "cost": 585,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-04-13",
     "files": []
    },
    {
     "id": "r10fth",
     "no": "CL-25-042",
     "date": "2025-03-13",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "치수 불량",
     "qty": 2,
     "cost": 280,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-04-13",
     "files": []
    },
    {
     "id": "r10ft9",
     "no": "CL-25-043",
     "date": "2025-03-16",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "용접 스패터",
     "qty": 4,
     "cost": 675,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-04-05",
     "files": []
    },
    {
     "id": "r10ftc",
     "no": "CL-25-044",
     "date": "2025-03-16",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "소음·진동",
     "qty": 2,
     "cost": 335,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-04-10",
     "files": []
    },
    {
     "id": "r10fte",
     "no": "CL-25-045",
     "date": "2025-03-16",
     "customer": "K사",
     "part": "암레스트",
     "type": "작동 불량",
     "qty": 2,
     "cost": 165,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-04-09",
     "files": []
    },
    {
     "id": "r10ft5",
     "no": "CL-25-046",
     "date": "2025-03-21",
     "customer": "K사",
     "part": "도어 트림",
     "type": "체결 불량",
     "qty": 5,
     "cost": 600,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-04-26",
     "files": []
    },
    {
     "id": "r10ft8",
     "no": "CL-25-047",
     "date": "2025-03-22",
     "customer": "기타",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 1,
     "cost": 220,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-03-28",
     "files": []
    },
    {
     "id": "r10ft3",
     "no": "CL-25-048",
     "date": "2025-03-29",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "작동 불량",
     "qty": 6,
     "cost": 630,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-04-29",
     "files": []
    },
    {
     "id": "r10ftb",
     "no": "CL-25-049",
     "date": "2025-03-29",
     "customer": "K사",
     "part": "암레스트",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "cost": 70,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-04-02",
     "files": []
    },
    {
     "id": "r10ftg",
     "no": "CL-25-050",
     "date": "2025-03-30",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "사출 수축",
     "qty": 1,
     "cost": 125,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-01",
     "files": []
    },
    {
     "id": "r10ftd",
     "no": "CL-25-051",
     "date": "2025-03-31",
     "customer": "G사",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "cost": 185,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-04-29",
     "files": []
    },
    {
     "id": "r10ftn",
     "no": "CL-25-052",
     "date": "2025-04-01",
     "customer": "G사",
     "part": "글로브박스",
     "type": "작동 불량",
     "qty": 14,
     "cost": 1770,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-04-09",
     "files": []
    },
    {
     "id": "r10ftv",
     "no": "CL-25-053",
     "date": "2025-04-01",
     "customer": "K사",
     "part": "시트프레임",
     "type": "외관 (스크래치·찍힘)",
     "qty": 12,
     "cost": 350,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-04-22",
     "files": []
    },
    {
     "id": "r10ftp",
     "no": "CL-25-054",
     "date": "2025-04-03",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 21,
     "cost": 2545,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-06",
     "files": []
    },
    {
     "id": "r10ftk",
     "no": "CL-25-055",
     "date": "2025-04-04",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 3,
     "cost": 425,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-04-10",
     "files": []
    },
    {
     "id": "r10ftt",
     "no": "CL-25-056",
     "date": "2025-04-05",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "소음·진동",
     "qty": 2,
     "cost": 330,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-02",
     "files": []
    },
    {
     "id": "r10ftq",
     "no": "CL-25-057",
     "date": "2025-04-08",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 31,
     "cost": 1300,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-13",
     "files": []
    },
    {
     "id": "r10ftj",
     "no": "CL-25-058",
     "date": "2025-04-13",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "도장 핀홀·이물",
     "qty": 4,
     "cost": 655,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-04-21",
     "files": []
    },
    {
     "id": "r10ftw",
     "no": "CL-25-059",
     "date": "2025-04-13",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 1,
     "cost": 140,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-05-02",
     "files": []
    },
    {
     "id": "r10fti",
     "no": "CL-25-060",
     "date": "2025-04-16",
     "customer": "G사",
     "part": "글로브박스",
     "type": "기타",
     "qty": 3,
     "cost": 365,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-04-22",
     "files": []
    },
    {
     "id": "r10fto",
     "no": "CL-25-061",
     "date": "2025-04-17",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "이종 부품 혼입",
     "qty": 2,
     "cost": 180,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-04-29",
     "files": []
    },
    {
     "id": "r10ftr",
     "no": "CL-25-062",
     "date": "2025-04-17",
     "customer": "K사",
     "part": "암레스트",
     "type": "작동 불량",
     "qty": 9,
     "cost": 600,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-24",
     "files": []
    },
    {
     "id": "r10ftu",
     "no": "CL-25-063",
     "date": "2025-04-18",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "체결 불량",
     "qty": 1,
     "cost": 200,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-26",
     "files": []
    },
    {
     "id": "r10ftl",
     "no": "CL-25-064",
     "date": "2025-04-20",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 39,
     "cost": 1515,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-11",
     "files": []
    },
    {
     "id": "r10ftm",
     "no": "CL-25-065",
     "date": "2025-04-22",
     "customer": "K사",
     "part": "시트프레임",
     "type": "오조립·누락",
     "qty": 2,
     "cost": 210,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-05-01",
     "files": []
    },
    {
     "id": "r10ftx",
     "no": "CL-25-066",
     "date": "2025-04-23",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "치수 불량",
     "qty": 1,
     "cost": 250,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-05-12",
     "files": []
    },
    {
     "id": "r10fts",
     "no": "CL-25-067",
     "date": "2025-04-29",
     "customer": "K사",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 3,
     "cost": 310,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-04",
     "files": []
    },
    {
     "id": "r10fty",
     "no": "CL-25-068",
     "date": "2025-05-01",
     "customer": "K사",
     "part": "암레스트",
     "type": "도장 핀홀·이물",
     "qty": 2,
     "cost": 70,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-05-26",
     "files": []
    },
    {
     "id": "r10fu4",
     "no": "CL-25-069",
     "date": "2025-05-01",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "작동 불량",
     "qty": 12,
     "cost": 1760,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-05-26",
     "files": []
    },
    {
     "id": "r10fu7",
     "no": "CL-25-070",
     "date": "2025-05-01",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 2,
     "cost": 285,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-24",
     "files": []
    },
    {
     "id": "r10fua",
     "no": "CL-25-071",
     "date": "2025-05-01",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "오조립·누락",
     "qty": 16,
     "cost": 2295,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-05-20",
     "files": []
    },
    {
     "id": "r10fu2",
     "no": "CL-25-072",
     "date": "2025-05-06",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "오조립·누락",
     "qty": 1,
     "cost": 185,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-28",
     "files": []
    },
    {
     "id": "r10fue",
     "no": "CL-25-073",
     "date": "2025-05-06",
     "customer": "K사",
     "part": "도어 트림",
     "type": "치수 불량",
     "qty": 4,
     "cost": 460,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-06-13",
     "files": []
    },
    {
     "id": "r10fuc",
     "no": "CL-25-074",
     "date": "2025-05-08",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "체결 불량",
     "qty": 2,
     "cost": 65,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-19",
     "files": []
    },
    {
     "id": "r10fub",
     "no": "CL-25-075",
     "date": "2025-05-09",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "cost": 85,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-05-17",
     "files": []
    },
    {
     "id": "r10fu0",
     "no": "CL-25-076",
     "date": "2025-05-11",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "사출 수축",
     "qty": 1,
     "cost": 220,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-05-30",
     "files": []
    },
    {
     "id": "r10fu6",
     "no": "CL-25-077",
     "date": "2025-05-12",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 3,
     "cost": 345,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-17",
     "files": []
    },
    {
     "id": "r10fu1",
     "no": "CL-25-078",
     "date": "2025-05-13",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "오조립·누락",
     "qty": 8,
     "cost": 570,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-28",
     "files": []
    },
    {
     "id": "r10fu8",
     "no": "CL-25-079",
     "date": "2025-05-21",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "소음·진동",
     "qty": 19,
     "cost": 2190,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-05-25",
     "files": []
    },
    {
     "id": "r10ftz",
     "no": "CL-25-080",
     "date": "2025-05-25",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "사출 수축",
     "qty": 10,
     "cost": 750,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-06-13",
     "files": []
    },
    {
     "id": "r10fud",
     "no": "CL-25-081",
     "date": "2025-05-26",
     "customer": "K사",
     "part": "시트프레임",
     "type": "외관 (스크래치·찍힘)",
     "qty": 5,
     "cost": 325,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-06-27",
     "files": []
    },
    {
     "id": "r10fu3",
     "no": "CL-25-082",
     "date": "2025-05-29",
     "customer": "G사",
     "part": "글로브박스",
     "type": "이종 부품 혼입",
     "qty": 2,
     "cost": 245,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-06-25",
     "files": []
    },
    {
     "id": "r10fu5",
     "no": "CL-25-083",
     "date": "2025-05-30",
     "customer": "K사",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 9,
     "cost": 320,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-06-29",
     "files": []
    },
    {
     "id": "r10fu9",
     "no": "CL-25-084",
     "date": "2025-05-31",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "도장 핀홀·이물",
     "qty": 23,
     "cost": 2930,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-06-24",
     "files": []
    },
    {
     "id": "r10fun",
     "no": "CL-25-085",
     "date": "2025-06-03",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 3,
     "cost": 135,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-07-11",
     "files": []
    },
    {
     "id": "r10fui",
     "no": "CL-25-086",
     "date": "2025-06-07",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 3,
     "cost": 445,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-08",
     "files": []
    },
    {
     "id": "r10fuo",
     "no": "CL-25-087",
     "date": "2025-06-07",
     "customer": "K사",
     "part": "도어 트림",
     "type": "작동 불량",
     "qty": 27,
     "cost": 730,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-02",
     "files": []
    },
    {
     "id": "r10fut",
     "no": "CL-25-088",
     "date": "2025-06-09",
     "customer": "K사",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 6,
     "cost": 265,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-06-21",
     "files": []
    },
    {
     "id": "r10ful",
     "no": "CL-25-089",
     "date": "2025-06-20",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "사출 수축",
     "qty": 1,
     "cost": 95,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-07-01",
     "files": []
    },
    {
     "id": "r10fuf",
     "no": "CL-25-090",
     "date": "2025-06-22",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "체결 불량",
     "qty": 5,
     "cost": 775,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-07-12",
     "files": []
    },
    {
     "id": "r10fuu",
     "no": "CL-25-091",
     "date": "2025-06-22",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "체결 불량",
     "qty": 10,
     "cost": 1320,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-07-19",
     "files": []
    },
    {
     "id": "r10fum",
     "no": "CL-25-092",
     "date": "2025-06-23",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "작동 불량",
     "qty": 1,
     "cost": 190,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-07-08",
     "files": []
    },
    {
     "id": "r10fup",
     "no": "CL-25-093",
     "date": "2025-06-23",
     "customer": "K사",
     "part": "시트프레임",
     "type": "소음·진동",
     "qty": 6,
     "cost": 595,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-07-19",
     "files": []
    },
    {
     "id": "r10fuq",
     "no": "CL-25-094",
     "date": "2025-06-23",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 6,
     "cost": 400,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-07-31",
     "files": []
    },
    {
     "id": "r10fuk",
     "no": "CL-25-095",
     "date": "2025-06-25",
     "customer": "G사",
     "part": "글로브박스",
     "type": "소음·진동",
     "qty": 9,
     "cost": 905,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-06-30",
     "files": []
    },
    {
     "id": "r10fuh",
     "no": "CL-25-096",
     "date": "2025-06-27",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "cost": 90,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-12",
     "files": []
    },
    {
     "id": "r10fuj",
     "no": "CL-25-097",
     "date": "2025-06-28",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "작동 불량",
     "qty": 1,
     "cost": 125,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-06",
     "files": []
    },
    {
     "id": "r10fur",
     "no": "CL-25-098",
     "date": "2025-06-28",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "외관 (스크래치·찍힘)",
     "qty": 8,
     "cost": 375,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-06",
     "files": []
    },
    {
     "id": "r10fus",
     "no": "CL-25-099",
     "date": "2025-06-28",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "오조립·누락",
     "qty": 5,
     "cost": 180,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-08",
     "files": []
    },
    {
     "id": "r10fug",
     "no": "CL-25-100",
     "date": "2025-06-30",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "사출 수축",
     "qty": 2,
     "cost": 250,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-13",
     "files": []
    },
    {
     "id": "r10fv1",
     "no": "CL-25-101",
     "date": "2025-07-04",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "도장 핀홀·이물",
     "qty": 10,
     "cost": 420,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-08-09",
     "files": []
    },
    {
     "id": "r10fux",
     "no": "CL-25-102",
     "date": "2025-07-06",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 2,
     "cost": 250,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-29",
     "files": []
    },
    {
     "id": "r10fuy",
     "no": "CL-25-103",
     "date": "2025-07-06",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "오조립·누락",
     "qty": 7,
     "cost": 255,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-19",
     "files": []
    },
    {
     "id": "r10fv2",
     "no": "CL-25-104",
     "date": "2025-07-06",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 1,
     "cost": 95,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-07-26",
     "files": []
    },
    {
     "id": "r10fv4",
     "no": "CL-25-105",
     "date": "2025-07-06",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "작동 불량",
     "qty": 1,
     "cost": 270,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-23",
     "files": []
    },
    {
     "id": "r10fv7",
     "no": "CL-25-106",
     "date": "2025-07-10",
     "customer": "R사",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 1,
     "cost": 155,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-22",
     "files": []
    },
    {
     "id": "r10fv0",
     "no": "CL-25-107",
     "date": "2025-07-11",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "기타",
     "qty": 2,
     "cost": 205,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-07-18",
     "files": []
    },
    {
     "id": "r10fuv",
     "no": "CL-25-108",
     "date": "2025-07-12",
     "customer": "R사",
     "part": "테일게이트 힌지",
     "type": "작동 불량",
     "qty": 1,
     "cost": 185,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-07-18",
     "files": []
    },
    {
     "id": "r10fv3",
     "no": "CL-25-109",
     "date": "2025-07-13",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "소음·진동",
     "qty": 9,
     "cost": 440,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-08-14",
     "files": []
    },
    {
     "id": "r10fv5",
     "no": "CL-25-110",
     "date": "2025-07-13",
     "customer": "K사",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "cost": 250,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-18",
     "files": []
    },
    {
     "id": "r10fuz",
     "no": "CL-25-111",
     "date": "2025-07-15",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "작동 불량",
     "qty": 1,
     "cost": 80,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-07-21",
     "files": []
    },
    {
     "id": "r10fv6",
     "no": "CL-25-112",
     "date": "2025-07-15",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "체결 불량",
     "qty": 7,
     "cost": 275,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-07-28",
     "files": []
    },
    {
     "id": "r10fv8",
     "no": "CL-25-113",
     "date": "2025-07-25",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "도장 핀홀·이물",
     "qty": 10,
     "cost": 490,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-08-17",
     "files": []
    },
    {
     "id": "r10fuw",
     "no": "CL-25-114",
     "date": "2025-07-28",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "도장 핀홀·이물",
     "qty": 4,
     "cost": 430,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-08-08",
     "files": []
    },
    {
     "id": "r10fvd",
     "no": "CL-25-115",
     "date": "2025-08-04",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "cost": 85,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-08-31",
     "files": []
    },
    {
     "id": "r10fve",
     "no": "CL-25-116",
     "date": "2025-08-04",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "작동 불량",
     "qty": 1,
     "cost": 215,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-08-25",
     "files": []
    },
    {
     "id": "r10fvh",
     "no": "CL-25-117",
     "date": "2025-08-05",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "치수 불량",
     "qty": 2,
     "cost": 275,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-08-14",
     "files": []
    },
    {
     "id": "r10fvg",
     "no": "CL-25-118",
     "date": "2025-08-12",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "외관 (스크래치·찍힘)",
     "qty": 4,
     "cost": 300,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-09-15",
     "files": []
    },
    {
     "id": "r10fvk",
     "no": "CL-25-119",
     "date": "2025-08-13",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "치수 불량",
     "qty": 1,
     "cost": 170,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-08-28",
     "files": []
    },
    {
     "id": "r10fv9",
     "no": "CL-25-120",
     "date": "2025-08-17",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "도장 핀홀·이물",
     "qty": 3,
     "cost": 410,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-09-13",
     "files": []
    },
    {
     "id": "r10fva",
     "no": "CL-25-121",
     "date": "2025-08-17",
     "customer": "K사",
     "part": "도어 트림",
     "type": "소음·진동",
     "qty": 1,
     "cost": 280,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-09-12",
     "files": []
    },
    {
     "id": "r10fvc",
     "no": "CL-25-122",
     "date": "2025-08-19",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "오조립·누락",
     "qty": 14,
     "cost": 695,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-08-25",
     "files": []
    },
    {
     "id": "r10fvi",
     "no": "CL-25-123",
     "date": "2025-08-19",
     "customer": "G사",
     "part": "글로브박스",
     "type": "체결 불량",
     "qty": 7,
     "cost": 695,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-08-24",
     "files": []
    },
    {
     "id": "r10fvf",
     "no": "CL-25-124",
     "date": "2025-08-22",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "cost": 245,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-09-26",
     "files": []
    },
    {
     "id": "r10fvj",
     "no": "CL-25-125",
     "date": "2025-08-25",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "이종 부품 혼입",
     "qty": 1,
     "cost": 85,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-09-09",
     "files": []
    },
    {
     "id": "r10fvb",
     "no": "CL-25-126",
     "date": "2025-08-29",
     "customer": "K사",
     "part": "시트프레임",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "cost": 250,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-09-10",
     "files": []
    },
    {
     "id": "r10fvt",
     "no": "CL-25-127",
     "date": "2025-09-02",
     "customer": "K사",
     "part": "암레스트",
     "type": "치수 불량",
     "qty": 22,
     "cost": 950,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-09-16",
     "files": []
    },
    {
     "id": "r10fvq",
     "no": "CL-25-128",
     "date": "2025-09-07",
     "customer": "R사",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 9,
     "cost": 825,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-09-24",
     "files": []
    },
    {
     "id": "r10fvp",
     "no": "CL-25-129",
     "date": "2025-09-09",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "소음·진동",
     "qty": 1,
     "cost": 40,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-10-04",
     "files": []
    },
    {
     "id": "r10fvs",
     "no": "CL-25-130",
     "date": "2025-09-12",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "작동 불량",
     "qty": 1,
     "cost": 100,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-09-29",
     "files": []
    },
    {
     "id": "r10fvu",
     "no": "CL-25-131",
     "date": "2025-09-12",
     "customer": "K사",
     "part": "암레스트",
     "type": "오조립·누락",
     "qty": 7,
     "cost": 415,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-09-18",
     "files": []
    },
    {
     "id": "r10fvn",
     "no": "CL-25-132",
     "date": "2025-09-13",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "오조립·누락",
     "qty": 8,
     "cost": 1050,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-09-20",
     "files": []
    },
    {
     "id": "r10fvm",
     "no": "CL-25-133",
     "date": "2025-09-17",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "사출 수축",
     "qty": 28,
     "cost": 3090,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-09-23",
     "files": []
    },
    {
     "id": "r10fvl",
     "no": "CL-25-134",
     "date": "2025-09-20",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 25,
     "cost": 975,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-10-24",
     "files": []
    },
    {
     "id": "r10fvo",
     "no": "CL-25-135",
     "date": "2025-09-23",
     "customer": "K사",
     "part": "도어 트림",
     "type": "작동 불량",
     "qty": 9,
     "cost": 790,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-10-17",
     "files": []
    },
    {
     "id": "r10fvv",
     "no": "CL-25-136",
     "date": "2025-09-25",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "작동 불량",
     "qty": 6,
     "cost": 250,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-10-20",
     "files": []
    },
    {
     "id": "r10fvr",
     "no": "CL-25-137",
     "date": "2025-09-29",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "도장 핀홀·이물",
     "qty": 10,
     "cost": 580,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-10-15",
     "files": []
    },
    {
     "id": "r10fw6",
     "no": "CL-25-138",
     "date": "2025-10-01",
     "customer": "K사",
     "part": "시트프레임",
     "type": "작동 불량",
     "qty": 1,
     "cost": 285,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-10-15",
     "files": []
    },
    {
     "id": "r10fvz",
     "no": "CL-25-139",
     "date": "2025-10-02",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "치수 불량",
     "qty": 1,
     "cost": 130,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-10-29",
     "files": []
    },
    {
     "id": "r10fw1",
     "no": "CL-25-140",
     "date": "2025-10-04",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "오조립·누락",
     "qty": 12,
     "cost": 1000,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-11-01",
     "files": []
    },
    {
     "id": "r10fvw",
     "no": "CL-25-141",
     "date": "2025-10-08",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "소음·진동",
     "qty": 22,
     "cost": 1080,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-11-07",
     "files": []
    },
    {
     "id": "r10fw5",
     "no": "CL-25-142",
     "date": "2025-10-10",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "소음·진동",
     "qty": 2,
     "cost": 190,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-10-27",
     "files": []
    },
    {
     "id": "r10fw2",
     "no": "CL-25-143",
     "date": "2025-10-11",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "작동 불량",
     "qty": 5,
     "cost": 680,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-10-15",
     "files": []
    },
    {
     "id": "r10fvx",
     "no": "CL-25-144",
     "date": "2025-10-14",
     "customer": "K사",
     "part": "도어 트림",
     "type": "작동 불량",
     "qty": 3,
     "cost": 475,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-10-19",
     "files": []
    },
    {
     "id": "r10fw3",
     "no": "CL-25-145",
     "date": "2025-10-16",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "사출 수축",
     "qty": 1,
     "cost": 155,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-10-29",
     "files": []
    },
    {
     "id": "r10fvy",
     "no": "CL-25-146",
     "date": "2025-10-17",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 33,
     "cost": 1800,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-11-01",
     "files": []
    },
    {
     "id": "r10fw0",
     "no": "CL-25-147",
     "date": "2025-10-22",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "사출 수축",
     "qty": 3,
     "cost": 165,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-11-08",
     "files": []
    },
    {
     "id": "r10fw4",
     "no": "CL-25-148",
     "date": "2025-10-30",
     "customer": "G사",
     "part": "글로브박스",
     "type": "작동 불량",
     "qty": 3,
     "cost": 180,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-11-30",
     "files": []
    },
    {
     "id": "r10fw9",
     "no": "CL-25-149",
     "date": "2025-11-04",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 11,
     "cost": 720,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-12-10",
     "files": []
    },
    {
     "id": "r10fwf",
     "no": "CL-25-150",
     "date": "2025-11-12",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 3,
     "cost": 355,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-12-16",
     "files": []
    },
    {
     "id": "r10fwa",
     "no": "CL-25-151",
     "date": "2025-11-18",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 8,
     "cost": 740,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-12-26",
     "files": []
    },
    {
     "id": "r10fwb",
     "no": "CL-25-152",
     "date": "2025-11-18",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "작동 불량",
     "qty": 1,
     "cost": 30,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-11-22",
     "files": []
    },
    {
     "id": "r10fwg",
     "no": "CL-25-153",
     "date": "2025-11-19",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "용접 스패터",
     "qty": 2,
     "cost": 260,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-12-05",
     "files": []
    },
    {
     "id": "r10fw7",
     "no": "CL-25-154",
     "date": "2025-11-22",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 3,
     "cost": 420,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-11-28",
     "files": []
    },
    {
     "id": "r10fwc",
     "no": "CL-25-155",
     "date": "2025-11-24",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "작동 불량",
     "qty": 3,
     "cost": 135,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-01-01",
     "files": []
    },
    {
     "id": "r10fw8",
     "no": "CL-25-156",
     "date": "2025-11-25",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "도장 핀홀·이물",
     "qty": 2,
     "cost": 230,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-12-05",
     "files": []
    },
    {
     "id": "r10fwd",
     "no": "CL-25-157",
     "date": "2025-11-30",
     "customer": "K사",
     "part": "도어 트림",
     "type": "도장 핀홀·이물",
     "qty": 5,
     "cost": 125,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-12-13",
     "files": []
    },
    {
     "id": "r10fwe",
     "no": "CL-25-158",
     "date": "2025-11-30",
     "customer": "K사",
     "part": "시트프레임",
     "type": "외관 (스크래치·찍힘)",
     "qty": 6,
     "cost": 160,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-12-21",
     "files": []
    },
    {
     "id": "r10fwk",
     "no": "CL-25-159",
     "date": "2025-12-01",
     "customer": "K사",
     "part": "도어 트림",
     "type": "용접 스패터",
     "qty": 4,
     "cost": 520,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-12-31",
     "files": []
    },
    {
     "id": "r10fwj",
     "no": "CL-25-160",
     "date": "2025-12-05",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 6,
     "cost": 840,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-12-10",
     "files": []
    },
    {
     "id": "r10fwp",
     "no": "CL-25-161",
     "date": "2025-12-07",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "치수 불량",
     "qty": 2,
     "cost": 130,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-12-19",
     "files": []
    },
    {
     "id": "r10fwr",
     "no": "CL-25-162",
     "date": "2025-12-10",
     "customer": "K사",
     "part": "암레스트",
     "type": "작동 불량",
     "qty": 8,
     "cost": 1010,
     "owner": "김민수",
     "status": "완료",
     "closed": "2025-12-26",
     "files": []
    },
    {
     "id": "r10fwn",
     "no": "CL-25-163",
     "date": "2025-12-13",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "작동 불량",
     "qty": 6,
     "cost": 550,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-01-12",
     "files": []
    },
    {
     "id": "r10fwh",
     "no": "CL-25-164",
     "date": "2025-12-21",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "외관 (스크래치·찍힘)",
     "qty": 8,
     "cost": 450,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-01-15",
     "files": []
    },
    {
     "id": "r10fwo",
     "no": "CL-25-165",
     "date": "2025-12-23",
     "customer": "R사",
     "part": "테일게이트 힌지",
     "type": "작동 불량",
     "qty": 2,
     "cost": 275,
     "owner": "이서연",
     "status": "완료",
     "closed": "2025-12-27",
     "files": []
    },
    {
     "id": "r10fwi",
     "no": "CL-25-166",
     "date": "2025-12-25",
     "customer": "K사",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "cost": 295,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-01-22",
     "files": []
    },
    {
     "id": "r10fwm",
     "no": "CL-25-167",
     "date": "2025-12-25",
     "customer": "K사",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "cost": 320,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-01-08",
     "files": []
    },
    {
     "id": "r10fwl",
     "no": "CL-25-168",
     "date": "2025-12-26",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 4,
     "cost": 590,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-01-12",
     "files": []
    },
    {
     "id": "r10fwq",
     "no": "CL-25-169",
     "date": "2025-12-29",
     "customer": "K사",
     "part": "도어 트림",
     "type": "작동 불량",
     "qty": 4,
     "cost": 410,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-02-04",
     "files": []
    },
    {
     "id": "r10fx0",
     "no": "CL-26-001",
     "date": "2026-01-02",
     "customer": "K사",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "cost": 185,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-01-30",
     "files": []
    },
    {
     "id": "r10fx3",
     "no": "CL-26-002",
     "date": "2026-01-08",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "사출 수축",
     "qty": 1,
     "cost": 55,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-02-15",
     "files": []
    },
    {
     "id": "r10fwx",
     "no": "CL-26-003",
     "date": "2026-01-09",
     "customer": "G사",
     "part": "글로브박스",
     "type": "치수 불량",
     "qty": 1,
     "cost": 180,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-02-10",
     "files": []
    },
    {
     "id": "r10fx4",
     "no": "CL-26-004",
     "date": "2026-01-16",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "작동 불량",
     "qty": 3,
     "cost": 415,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-02-02",
     "files": []
    },
    {
     "id": "r10fws",
     "no": "CL-26-005",
     "date": "2026-01-17",
     "customer": "K사",
     "part": "암레스트",
     "type": "소음·진동",
     "qty": 11,
     "cost": 400,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-02-23",
     "files": []
    },
    {
     "id": "r10fx1",
     "no": "CL-26-006",
     "date": "2026-01-20",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "사출 수축",
     "qty": 2,
     "cost": 190,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-02-24",
     "files": []
    },
    {
     "id": "r10fww",
     "no": "CL-26-007",
     "date": "2026-01-22",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 2,
     "cost": 120,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-02-11",
     "files": []
    },
    {
     "id": "r10fwz",
     "no": "CL-26-008",
     "date": "2026-01-22",
     "customer": "기타",
     "part": "콘솔 커버",
     "type": "치수 불량",
     "qty": 10,
     "cost": 1070,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-02-13",
     "files": []
    },
    {
     "id": "r10fwt",
     "no": "CL-26-009",
     "date": "2026-01-25",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "cost": 215,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-02-28",
     "files": []
    },
    {
     "id": "r10fwu",
     "no": "CL-26-010",
     "date": "2026-01-27",
     "customer": "K사",
     "part": "시트프레임",
     "type": "이종 부품 혼입",
     "qty": 3,
     "cost": 405,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-02-18",
     "files": []
    },
    {
     "id": "r10fwv",
     "no": "CL-26-011",
     "date": "2026-01-29",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "체결 불량",
     "qty": 2,
     "cost": 270,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-02-23",
     "files": []
    },
    {
     "id": "r10fwy",
     "no": "CL-26-012",
     "date": "2026-01-31",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "cost": 230,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-03-05",
     "files": []
    },
    {
     "id": "r10fx2",
     "no": "CL-26-013",
     "date": "2026-01-31",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "cost": 330,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-03-07",
     "files": []
    },
    {
     "id": "r10fxg",
     "no": "CL-26-014",
     "date": "2026-02-01",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "외관 (스크래치·찍힘)",
     "qty": 37,
     "cost": 4155,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-02-20",
     "files": []
    },
    {
     "id": "r10fx6",
     "no": "CL-26-015",
     "date": "2026-02-02",
     "customer": "R사",
     "part": "테일게이트 힌지",
     "type": "오조립·누락",
     "qty": 39,
     "cost": 1710,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-02-23",
     "files": []
    },
    {
     "id": "r10fx9",
     "no": "CL-26-016",
     "date": "2026-02-02",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "체결 불량",
     "qty": 2,
     "cost": 370,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-03-06",
     "files": []
    },
    {
     "id": "r10fx8",
     "no": "CL-26-017",
     "date": "2026-02-09",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "소음·진동",
     "qty": 4,
     "cost": 190,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-02-21",
     "files": []
    },
    {
     "id": "r10fx7",
     "no": "CL-26-018",
     "date": "2026-02-11",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "작동 불량",
     "qty": 30,
     "cost": 4020,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-02-21",
     "files": []
    },
    {
     "id": "r10fxe",
     "no": "CL-26-019",
     "date": "2026-02-13",
     "customer": "K사",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 4,
     "cost": 275,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-03-08",
     "files": []
    },
    {
     "id": "r10fxf",
     "no": "CL-26-020",
     "date": "2026-02-14",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 5,
     "cost": 390,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-03-07",
     "files": []
    },
    {
     "id": "r10fxh",
     "no": "CL-26-021",
     "date": "2026-02-14",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "용접 스패터",
     "qty": 2,
     "cost": 265,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-02-28",
     "files": []
    },
    {
     "id": "r10fxc",
     "no": "CL-26-022",
     "date": "2026-02-16",
     "customer": "K사",
     "part": "도어 트림",
     "type": "오조립·누락",
     "qty": 1,
     "cost": 205,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-03-19",
     "files": []
    },
    {
     "id": "r10fxi",
     "no": "CL-26-023",
     "date": "2026-02-17",
     "customer": "R사",
     "part": "테일게이트 힌지",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "cost": 395,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-03-26",
     "files": []
    },
    {
     "id": "r10fx5",
     "no": "CL-26-024",
     "date": "2026-02-20",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "오조립·누락",
     "qty": 2,
     "cost": 385,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-03-25",
     "files": []
    },
    {
     "id": "r10fxa",
     "no": "CL-26-025",
     "date": "2026-02-22",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "작동 불량",
     "qty": 4,
     "cost": 420,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-03-09",
     "files": []
    },
    {
     "id": "r10fxd",
     "no": "CL-26-026",
     "date": "2026-02-24",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "치수 불량",
     "qty": 2,
     "cost": 115,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-03-31",
     "files": []
    },
    {
     "id": "r10fxb",
     "no": "CL-26-027",
     "date": "2026-02-25",
     "customer": "G사",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 8,
     "cost": 510,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-03-12",
     "files": []
    },
    {
     "id": "r10fxj",
     "no": "CL-26-028",
     "date": "2026-02-26",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "소음·진동",
     "qty": 3,
     "cost": 270,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-03-23",
     "files": []
    },
    {
     "id": "r10fxk",
     "no": "CL-26-029",
     "date": "2026-03-02",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "사출 수축",
     "qty": 3,
     "cost": 200,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-03-10",
     "files": []
    },
    {
     "id": "r10fxp",
     "no": "CL-26-030",
     "date": "2026-03-05",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "작동 불량",
     "qty": 21,
     "cost": 2230,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-04-06",
     "files": []
    },
    {
     "id": "r10fxl",
     "no": "CL-26-031",
     "date": "2026-03-06",
     "customer": "K사",
     "part": "암레스트",
     "type": "치수 불량",
     "qty": 5,
     "cost": 305,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-04-07",
     "files": []
    },
    {
     "id": "r10fxt",
     "no": "CL-26-032",
     "date": "2026-03-09",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "사출 수축",
     "qty": 2,
     "cost": 200,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-04-03",
     "files": []
    },
    {
     "id": "r10fxq",
     "no": "CL-26-033",
     "date": "2026-03-12",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "이종 부품 혼입",
     "qty": 6,
     "cost": 895,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-03-16",
     "files": []
    },
    {
     "id": "r10fxv",
     "no": "CL-26-034",
     "date": "2026-03-12",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "이종 부품 혼입",
     "qty": 3,
     "cost": 250,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-04-09",
     "files": []
    },
    {
     "id": "r10fxs",
     "no": "CL-26-035",
     "date": "2026-03-13",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "작동 불량",
     "qty": 3,
     "cost": 190,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-04-13",
     "files": []
    },
    {
     "id": "r10fxn",
     "no": "CL-26-036",
     "date": "2026-03-15",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 9,
     "cost": 425,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-04-15",
     "files": []
    },
    {
     "id": "r10fxo",
     "no": "CL-26-037",
     "date": "2026-03-18",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "작동 불량",
     "qty": 2,
     "cost": 320,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-04-08",
     "files": []
    },
    {
     "id": "r10fxr",
     "no": "CL-26-038",
     "date": "2026-03-24",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "치수 불량",
     "qty": 5,
     "cost": 205,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-04-24",
     "files": []
    },
    {
     "id": "r10fxm",
     "no": "CL-26-039",
     "date": "2026-03-25",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "용접 스패터",
     "qty": 1,
     "cost": 195,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-04-20",
     "files": []
    },
    {
     "id": "r10fxu",
     "no": "CL-26-040",
     "date": "2026-03-27",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "소음·진동",
     "qty": 1,
     "cost": 190,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-04-11",
     "files": []
    },
    {
     "id": "r10fyb",
     "no": "CL-26-041",
     "date": "2026-04-02",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "오조립·누락",
     "qty": 3,
     "cost": 320,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-05-01",
     "files": []
    },
    {
     "id": "r10fy3",
     "no": "CL-26-042",
     "date": "2026-04-06",
     "customer": "K사",
     "part": "암레스트",
     "type": "체결 불량",
     "qty": 2,
     "cost": 280,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-05-01",
     "files": []
    },
    {
     "id": "r10fxz",
     "no": "CL-26-043",
     "date": "2026-04-07",
     "customer": "K사",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 1,
     "cost": 45,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-04-30",
     "files": []
    },
    {
     "id": "r10fy2",
     "no": "CL-26-044",
     "date": "2026-04-08",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "소음·진동",
     "qty": 3,
     "cost": 540,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-04-18",
     "files": []
    },
    {
     "id": "r10fy8",
     "no": "CL-26-045",
     "date": "2026-04-08",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "cost": 220,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-04-13",
     "files": []
    },
    {
     "id": "r10fy0",
     "no": "CL-26-046",
     "date": "2026-04-10",
     "customer": "K사",
     "part": "암레스트",
     "type": "이종 부품 혼입",
     "qty": 18,
     "cost": 625,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-04-20",
     "files": []
    },
    {
     "id": "r10fy1",
     "no": "CL-26-047",
     "date": "2026-04-12",
     "customer": "R사",
     "part": "테일게이트 힌지",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "cost": 50,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-05-13",
     "files": []
    },
    {
     "id": "r10fyc",
     "no": "CL-26-048",
     "date": "2026-04-12",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "cost": 370,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-05-06",
     "files": []
    },
    {
     "id": "r10fy4",
     "no": "CL-26-049",
     "date": "2026-04-14",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "작동 불량",
     "qty": 5,
     "cost": 300,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-05-02",
     "files": []
    },
    {
     "id": "r10fxw",
     "no": "CL-26-050",
     "date": "2026-04-15",
     "customer": "K사",
     "part": "도어 트림",
     "type": "체결 불량",
     "qty": 3,
     "cost": 300,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-05-11",
     "files": []
    },
    {
     "id": "r10fxy",
     "no": "CL-26-051",
     "date": "2026-04-18",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "치수 불량",
     "qty": 11,
     "cost": 1170,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-04-27",
     "files": []
    },
    {
     "id": "r10fxx",
     "no": "CL-26-052",
     "date": "2026-04-20",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "도장 핀홀·이물",
     "qty": 1,
     "cost": 70,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-05-07",
     "files": []
    },
    {
     "id": "r10fy5",
     "no": "CL-26-053",
     "date": "2026-04-21",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "cost": 340,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-05-13",
     "files": []
    },
    {
     "id": "r10fy6",
     "no": "CL-26-054",
     "date": "2026-04-22",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "오조립·누락",
     "qty": 3,
     "cost": 250,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-05-20",
     "files": []
    },
    {
     "id": "r10fy7",
     "no": "CL-26-055",
     "date": "2026-04-22",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "사출 수축",
     "qty": 1,
     "cost": 130,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-05-27",
     "files": []
    },
    {
     "id": "r10fya",
     "no": "CL-26-056",
     "date": "2026-04-26",
     "customer": "K사",
     "part": "암레스트",
     "type": "도장 핀홀·이물",
     "qty": 9,
     "cost": 1105,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-05-15",
     "files": []
    },
    {
     "id": "r10fy9",
     "no": "CL-26-057",
     "date": "2026-04-28",
     "customer": "K사",
     "part": "암레스트",
     "type": "치수 불량",
     "qty": 2,
     "cost": 225,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-05-13",
     "files": []
    },
    {
     "id": "r10fyh",
     "no": "CL-26-058",
     "date": "2026-05-02",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "도장 핀홀·이물",
     "qty": 6,
     "cost": 595,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-05-12",
     "files": []
    },
    {
     "id": "r10fys",
     "no": "CL-26-059",
     "date": "2026-05-02",
     "customer": "K사",
     "part": "암레스트",
     "type": "외관 (스크래치·찍힘)",
     "qty": 10,
     "cost": 1090,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-06-08",
     "files": []
    },
    {
     "id": "r10fyj",
     "no": "CL-26-060",
     "date": "2026-05-03",
     "customer": "K사",
     "part": "도어 트림",
     "type": "용접 스패터",
     "qty": 2,
     "cost": 260,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-06-10",
     "files": []
    },
    {
     "id": "r10fyg",
     "no": "CL-26-061",
     "date": "2026-05-04",
     "customer": "S모빌리티",
     "part": "커넥터 하우징",
     "type": "체결 불량",
     "qty": 36,
     "cost": 4875,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-05-29",
     "files": []
    },
    {
     "id": "r10fym",
     "no": "CL-26-062",
     "date": "2026-05-09",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "용접 스패터",
     "qty": 26,
     "cost": 955,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-06-04",
     "files": []
    },
    {
     "id": "r10fyr",
     "no": "CL-26-063",
     "date": "2026-05-11",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 12,
     "cost": 1055,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-06-08",
     "files": []
    },
    {
     "id": "r10fyl",
     "no": "CL-26-064",
     "date": "2026-05-14",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 10,
     "cost": 1290,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-05-24",
     "files": []
    },
    {
     "id": "r10fyt",
     "no": "CL-26-065",
     "date": "2026-05-15",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 25,
     "cost": 3100,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-06-03",
     "files": []
    },
    {
     "id": "r10fyk",
     "no": "CL-26-066",
     "date": "2026-05-16",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "오조립·누락",
     "qty": 1,
     "cost": 90,
     "owner": "이서연",
     "status": "대책수립",
     "closed": "",
     "files": []
    },
    {
     "id": "r10fyo",
     "no": "CL-26-067",
     "date": "2026-05-18",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "오조립·누락",
     "qty": 2,
     "cost": 260,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-06-01",
     "files": []
    },
    {
     "id": "r10fyn",
     "no": "CL-26-068",
     "date": "2026-05-19",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "cost": 305,
     "owner": "김민수",
     "status": "대책수립",
     "closed": "",
     "files": [
      {
       "name": "도어래치 ASSY 외관 (스크래치·찍힘).svg",
       "path": "files/claims/260519-r10fyn-도어래치 ASSY 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1573,
       "at": "2026-05-19"
      }
     ]
    },
    {
     "id": "r10fyd",
     "no": "CL-26-069",
     "date": "2026-05-20",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 19,
     "cost": 1025,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-06-01",
     "files": []
    },
    {
     "id": "r10fyq",
     "no": "CL-26-070",
     "date": "2026-05-21",
     "customer": "G사",
     "part": "글로브박스",
     "type": "치수 불량",
     "qty": 1,
     "cost": 205,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-05-30",
     "files": []
    },
    {
     "id": "r10fyf",
     "no": "CL-26-071",
     "date": "2026-05-23",
     "customer": "K사",
     "part": "시트프레임",
     "type": "작동 불량",
     "qty": 3,
     "cost": 430,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-06-22",
     "files": []
    },
    {
     "id": "r10fyp",
     "no": "CL-26-072",
     "date": "2026-05-26",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "용접 스패터",
     "qty": 6,
     "cost": 870,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-06-05",
     "files": [
      {
       "name": "리어 브라켓 용접 스패터.svg",
       "path": "files/claims/260526-r10fyp-리어 브라켓 용접 스패터.svg",
       "type": "image/svg+xml",
       "size": 2322,
       "at": "2026-05-26"
      }
     ]
    },
    {
     "id": "r10fye",
     "no": "CL-26-073",
     "date": "2026-05-28",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "작동 불량",
     "qty": 3,
     "cost": 535,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-07-01",
     "files": []
    },
    {
     "id": "r10fyi",
     "no": "CL-26-074",
     "date": "2026-05-28",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 25,
     "cost": 3250,
     "owner": "이서연",
     "status": "대책수립",
     "closed": "",
     "files": []
    },
    {
     "id": "r10fyv",
     "no": "CL-26-075",
     "date": "2026-06-03",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "이종 부품 혼입",
     "qty": 6,
     "cost": 780,
     "owner": "김민수",
     "status": "대책수립",
     "closed": "",
     "files": []
    },
    {
     "id": "r10fz5",
     "no": "CL-26-076",
     "date": "2026-06-04",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 3,
     "cost": 415,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-07-07",
     "files": [
      {
       "name": "범퍼 빔 치수 불량.svg",
       "path": "files/claims/260604-r10fz5-범퍼 빔 치수 불량.svg",
       "type": "image/svg+xml",
       "size": 1607,
       "at": "2026-06-04"
      }
     ]
    },
    {
     "id": "r10fyw",
     "no": "CL-26-077",
     "date": "2026-06-05",
     "customer": "R사",
     "part": "테일게이트 힌지",
     "type": "오조립·누락",
     "qty": 2,
     "cost": 210,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-06-18",
     "files": []
    },
    {
     "id": "r10fyz",
     "no": "CL-26-078",
     "date": "2026-06-06",
     "customer": "K사",
     "part": "시트프레임",
     "type": "외관 (스크래치·찍힘)",
     "qty": 12,
     "cost": 300,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-06-24",
     "files": []
    },
    {
     "id": "r10fz0",
     "no": "CL-26-079",
     "date": "2026-06-06",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "작동 불량",
     "qty": 38,
     "cost": 2510,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-07-01",
     "files": []
    },
    {
     "id": "r10fz2",
     "no": "CL-26-080",
     "date": "2026-06-07",
     "customer": "K사",
     "part": "도어 트림",
     "type": "작동 불량",
     "qty": 11,
     "cost": 830,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-07-11",
     "files": [
      {
       "name": "도어 트림 작동 불량.svg",
       "path": "files/claims/260607-r10fz2-도어 트림 작동 불량.svg",
       "type": "image/svg+xml",
       "size": 1525,
       "at": "2026-06-07"
      }
     ]
    },
    {
     "id": "r10fz3",
     "no": "CL-26-081",
     "date": "2026-06-08",
     "customer": "K사",
     "part": "암레스트",
     "type": "작동 불량",
     "qty": 6,
     "cost": 665,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-06-22",
     "files": []
    },
    {
     "id": "r10fyx",
     "no": "CL-26-082",
     "date": "2026-06-10",
     "customer": "K사",
     "part": "도어 트림",
     "type": "오조립·누락",
     "qty": 4,
     "cost": 600,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-06-23",
     "files": []
    },
    {
     "id": "r10fyy",
     "no": "CL-26-083",
     "date": "2026-06-10",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "오조립·누락",
     "qty": 5,
     "cost": 785,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-06-24",
     "files": []
    },
    {
     "id": "r10fyu",
     "no": "CL-26-084",
     "date": "2026-06-15",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "치수 불량",
     "qty": 39,
     "cost": 4535,
     "owner": "이서연",
     "status": "대책수립",
     "closed": "",
     "files": [
      {
       "name": "콘솔 커버 치수 불량.svg",
       "path": "files/claims/260615-r10fyu-콘솔 커버 치수 불량.svg",
       "type": "image/svg+xml",
       "size": 1610,
       "at": "2026-06-15"
      }
     ]
    },
    {
     "id": "r10fz1",
     "no": "CL-26-085",
     "date": "2026-06-16",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "체결 불량",
     "qty": 3,
     "cost": 280,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-07-06",
     "files": []
    },
    {
     "id": "r10fz4",
     "no": "CL-26-086",
     "date": "2026-06-24",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 1,
     "cost": 185,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-06-29",
     "files": []
    },
    {
     "id": "r10fz7",
     "no": "CL-26-087",
     "date": "2026-07-02",
     "customer": "K사",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 5,
     "cost": 810,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-07-28",
     "files": []
    },
    {
     "id": "r10fz8",
     "no": "CL-26-088",
     "date": "2026-07-02",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 5,
     "cost": 300,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-08-04",
     "files": [
      {
       "name": "힌지 ASSY 외관 (스크래치·찍힘).svg",
       "path": "files/claims/260702-r10fz8-힌지 ASSY 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1567,
       "at": "2026-07-02"
      }
     ]
    },
    {
     "id": "r10fzg",
     "no": "CL-26-089",
     "date": "2026-07-04",
     "customer": "G사",
     "part": "글로브박스",
     "type": "치수 불량",
     "qty": 3,
     "cost": 330,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-07-15",
     "files": []
    },
    {
     "id": "r10fza",
     "no": "CL-26-090",
     "date": "2026-07-07",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "도장 핀홀·이물",
     "qty": 24,
     "cost": 2330,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-08-03",
     "files": []
    },
    {
     "id": "r10fz6",
     "no": "CL-26-091",
     "date": "2026-07-09",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "소음·진동",
     "qty": 9,
     "cost": 905,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-07-26",
     "files": []
    },
    {
     "id": "r10fzb",
     "no": "CL-26-092",
     "date": "2026-07-09",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 11,
     "cost": 550,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-07-19",
     "files": [
      {
       "name": "범퍼 빔 치수 불량.svg",
       "path": "files/claims/260709-r10fzb-범퍼 빔 치수 불량.svg",
       "type": "image/svg+xml",
       "size": 1607,
       "at": "2026-07-09"
      }
     ]
    },
    {
     "id": "r10fze",
     "no": "CL-26-093",
     "date": "2026-07-10",
     "customer": "G사",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 2,
     "cost": 325,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-07-28",
     "files": []
    },
    {
     "id": "r10fzf",
     "no": "CL-26-094",
     "date": "2026-07-11",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 8,
     "cost": 760,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-07-19",
     "files": []
    },
    {
     "id": "r10fz9",
     "no": "CL-26-095",
     "date": "2026-07-18",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "작동 불량",
     "qty": 17,
     "cost": 965,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-07-29",
     "files": []
    },
    {
     "id": "r10fzd",
     "no": "CL-26-096",
     "date": "2026-07-18",
     "customer": "K사",
     "part": "도어 트림",
     "type": "체결 불량",
     "qty": 3,
     "cost": 160,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-08-19",
     "files": [
      {
       "name": "도어 트림 체결 불량.svg",
       "path": "files/claims/260718-r10fzd-도어 트림 체결 불량.svg",
       "type": "image/svg+xml",
       "size": 1525,
       "at": "2026-07-18"
      }
     ]
    },
    {
     "id": "r10fzc",
     "no": "CL-26-097",
     "date": "2026-07-28",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "도장 핀홀·이물",
     "qty": 2,
     "cost": 145,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-08-07",
     "files": []
    },
    {
     "id": "r10fzh",
     "no": "CL-26-098",
     "date": "2026-07-28",
     "customer": "K사",
     "part": "도어 트림",
     "type": "소음·진동",
     "qty": 13,
     "cost": 1325,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-08-09",
     "files": []
    },
    {
     "id": "r10fzj",
     "no": "CL-26-099",
     "date": "2026-08-02",
     "customer": "K사",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 34,
     "cost": 3480,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-08-26",
     "files": []
    },
    {
     "id": "r10fzv",
     "no": "CL-26-100",
     "date": "2026-08-02",
     "customer": "K사",
     "part": "시트프레임",
     "type": "소음·진동",
     "qty": 1,
     "cost": 105,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-08-06",
     "files": [
      {
       "name": "시트프레임 소음·진동.svg",
       "path": "files/claims/260802-r10fzv-시트프레임 소음·진동.svg",
       "type": "image/svg+xml",
       "size": 1528,
       "at": "2026-08-02"
      }
     ]
    },
    {
     "id": "r10fzp",
     "no": "CL-26-101",
     "date": "2026-08-03",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "오조립·누락",
     "qty": 9,
     "cost": 1190,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-08-26",
     "files": []
    },
    {
     "id": "r10fzu",
     "no": "CL-26-102",
     "date": "2026-08-03",
     "customer": "H사",
     "part": "콘솔 커버",
     "type": "작동 불량",
     "qty": 13,
     "cost": 700,
     "owner": "이서연",
     "status": "완료",
     "closed": "2026-08-11",
     "files": []
    },
    {
     "id": "r10fzt",
     "no": "CL-26-103",
     "date": "2026-08-06",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "도장 핀홀·이물",
     "qty": 2,
     "cost": 285,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-09-09",
     "files": []
    },
    {
     "id": "r10fzi",
     "no": "CL-26-104",
     "date": "2026-08-10",
     "customer": "K사",
     "part": "시트프레임",
     "type": "소음·진동",
     "qty": 3,
     "cost": 255,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-08-18",
     "files": [
      {
       "name": "시트프레임 소음·진동.svg",
       "path": "files/claims/260810-r10fzi-시트프레임 소음·진동.svg",
       "type": "image/svg+xml",
       "size": 1528,
       "at": "2026-08-10"
      }
     ]
    },
    {
     "id": "r10fzo",
     "no": "CL-26-105",
     "date": "2026-08-12",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "작동 불량",
     "qty": 9,
     "cost": 925,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-08-18",
     "files": []
    },
    {
     "id": "r10fzl",
     "no": "CL-26-106",
     "date": "2026-08-14",
     "customer": "K사",
     "part": "암레스트",
     "type": "체결 불량",
     "qty": 8,
     "cost": 305,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-08-25",
     "files": []
    },
    {
     "id": "r10fzq",
     "no": "CL-26-107",
     "date": "2026-08-16",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "도장 핀홀·이물",
     "qty": 2,
     "cost": 325,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-09-10",
     "files": []
    },
    {
     "id": "r10fzs",
     "no": "CL-26-108",
     "date": "2026-08-19",
     "customer": "S모빌리티",
     "part": "배터리 트레이",
     "type": "사출 수축",
     "qty": 2,
     "cost": 395,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-09-21",
     "files": [
      {
       "name": "배터리 트레이 사출 수축.svg",
       "path": "files/claims/260819-r10fzs-배터리 트레이 사출 수축.svg",
       "type": "image/svg+xml",
       "size": 1547,
       "at": "2026-08-19"
      }
     ]
    },
    {
     "id": "r10fzn",
     "no": "CL-26-109",
     "date": "2026-08-26",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 3,
     "cost": 445,
     "owner": "김민수",
     "status": "조사중",
     "closed": "",
     "files": []
    },
    {
     "id": "r10fzm",
     "no": "CL-26-110",
     "date": "2026-08-29",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "기타",
     "qty": 3,
     "cost": 160,
     "owner": "이서연",
     "status": "접수",
     "closed": "",
     "files": []
    },
    {
     "id": "r10fzk",
     "no": "CL-26-111",
     "date": "2026-08-30",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "오조립·누락",
     "qty": 10,
     "cost": 650,
     "owner": "김민수",
     "status": "조사중",
     "closed": "",
     "files": []
    },
    {
     "id": "r10fzr",
     "no": "CL-26-112",
     "date": "2026-08-31",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "도장 핀홀·이물",
     "qty": 3,
     "cost": 390,
     "owner": "김민수",
     "status": "조사중",
     "closed": "",
     "files": [
      {
       "name": "힌지 ASSY 도장 핀홀·이물.svg",
       "path": "files/claims/260831-r10fzr-힌지 ASSY 도장 핀홀·이물.svg",
       "type": "image/svg+xml",
       "size": 1787,
       "at": "2026-08-31"
      }
     ]
    },
    {
     "id": "r10fzy",
     "no": "CL-26-113",
     "date": "2026-09-04",
     "customer": "R사",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 3,
     "cost": 185,
     "owner": "김민수",
     "status": "대책수립",
     "closed": "",
     "files": []
    },
    {
     "id": "r10g02",
     "no": "CL-26-114",
     "date": "2026-09-05",
     "customer": "H사",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "cost": 540,
     "owner": "이서연",
     "status": "접수",
     "closed": "",
     "files": []
    },
    {
     "id": "r10fzx",
     "no": "CL-26-115",
     "date": "2026-09-06",
     "customer": "기타",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 2,
     "cost": 375,
     "owner": "김민수",
     "status": "대책수립",
     "closed": "",
     "files": []
    },
    {
     "id": "r10g04",
     "no": "CL-26-116",
     "date": "2026-09-06",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 2,
     "cost": 195,
     "owner": "김민수",
     "status": "대책수립",
     "closed": "",
     "files": [
      {
       "name": "도어래치 ASSY 치수 불량.svg",
       "path": "files/claims/260906-r10g04-도어래치 ASSY 치수 불량.svg",
       "type": "image/svg+xml",
       "size": 1614,
       "at": "2026-09-06"
      }
     ]
    },
    {
     "id": "r10fzw",
     "no": "CL-26-117",
     "date": "2026-09-13",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "사출 수축",
     "qty": 9,
     "cost": 500,
     "owner": "김민수",
     "status": "완료",
     "closed": "2026-10-05",
     "files": []
    },
    {
     "id": "r10g00",
     "no": "CL-26-118",
     "date": "2026-09-13",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "이종 부품 혼입",
     "qty": 3,
     "cost": 285,
     "owner": "이서연",
     "status": "조사중",
     "closed": "",
     "files": []
    },
    {
     "id": "r10g01",
     "no": "CL-26-119",
     "date": "2026-09-14",
     "customer": "K사",
     "part": "시트프레임",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "cost": 270,
     "owner": "이서연",
     "status": "조사중",
     "closed": "",
     "files": []
    },
    {
     "id": "r10fzz",
     "no": "CL-26-120",
     "date": "2026-09-16",
     "customer": "H사",
     "part": "범퍼 빔",
     "type": "작동 불량",
     "qty": 7,
     "cost": 655,
     "owner": "김민수",
     "status": "조사중",
     "closed": "",
     "files": [
      {
       "name": "범퍼 빔 작동 불량.svg",
       "path": "files/claims/260916-r10fzz-범퍼 빔 작동 불량.svg",
       "type": "image/svg+xml",
       "size": 1522,
       "at": "2026-09-16"
      }
     ]
    },
    {
     "id": "r10g06",
     "no": "CL-26-121",
     "date": "2026-09-17",
     "customer": "K사",
     "part": "도어 트림",
     "type": "치수 불량",
     "qty": 1,
     "cost": 240,
     "owner": "이서연",
     "status": "접수",
     "closed": "",
     "files": []
    },
    {
     "id": "r10g05",
     "no": "CL-26-122",
     "date": "2026-09-22",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "체결 불량",
     "qty": 1,
     "cost": 180,
     "owner": "김민수",
     "status": "대책수립",
     "closed": "",
     "files": []
    },
    {
     "id": "r10g03",
     "no": "CL-26-123",
     "date": "2026-09-25",
     "customer": "G사",
     "part": "브라켓 BRK-1830",
     "type": "작동 불량",
     "qty": 9,
     "cost": 330,
     "owner": "이서연",
     "status": "조사중",
     "closed": "",
     "files": []
    },
    {
     "id": "r10g08",
     "no": "CL-26-124",
     "date": "2026-10-02",
     "customer": "H사",
     "part": "도어래치 ASSY",
     "type": "용접 스패터",
     "qty": 1,
     "cost": 190,
     "owner": "이서연",
     "status": "조사중",
     "closed": "",
     "files": [
      {
       "name": "도어래치 ASSY 용접 스패터.svg",
       "path": "files/claims/261002-r10g08-도어래치 ASSY 용접 스패터.svg",
       "type": "image/svg+xml",
       "size": 2323,
       "at": "2026-10-02"
      }
     ]
    },
    {
     "id": "r10g0a",
     "no": "CL-26-125",
     "date": "2026-10-04",
     "customer": "K사",
     "part": "시트프레임",
     "type": "작동 불량",
     "qty": 1,
     "cost": 55,
     "owner": "김민수",
     "status": "조사중",
     "closed": "",
     "files": []
    },
    {
     "id": "r10g09",
     "no": "CL-26-126",
     "date": "2026-10-05",
     "customer": "K사",
     "part": "암레스트",
     "type": "기타",
     "qty": 9,
     "cost": 865,
     "owner": "김민수",
     "status": "접수",
     "closed": "",
     "files": [],
     "_c": [
      {
       "at": "2026-10-05T05:00:00.000Z",
       "who": "이서연",
       "t": "고객 회신 완료"
      }
     ]
    },
    {
     "id": "r10g07",
     "no": "CL-26-127",
     "date": "2026-10-06",
     "customer": "K사",
     "part": "도어 트림",
     "type": "오조립·누락",
     "qty": 1,
     "cost": 280,
     "owner": "김민수",
     "status": "조사중",
     "closed": "",
     "files": [],
     "_c": [
      {
       "at": "2026-10-06T01:05:00.000Z",
       "who": "김민수",
       "t": "고객사 품질팀에 1차 회신 완료. 현품 회수 요청함."
      },
      {
       "at": "2026-10-07T06:40:00.000Z",
       "who": "이서연",
       "t": "회수품 3개 도착, 치수 측정 진행 예정"
      },
      {
       "at": "2026-10-08T00:20:00.000Z",
       "who": "김민수",
       "t": "측정 결과 규격 상한 0.12 초과 확인 — 8D 발행 필요"
      }
     ]
    }
   ],
   "views": [
    {
     "id": "v-open",
     "name": "미결만",
     "f": [
      {
       "f": "status",
       "k": "pick",
       "v": [
        "접수",
        "조사중",
        "대책수립"
       ]
      }
     ],
     "q": "",
     "sortK": "date",
     "asc": false,
     "group": "",
     "hide": []
    },
    {
     "id": "v-cust",
     "name": "고객사별",
     "f": [],
     "q": "",
     "sortK": "date",
     "asc": false,
     "group": "customer",
     "hide": []
    },
    {
     "id": "v-h",
     "name": "H사 · 상태별",
     "f": [
      {
       "f": "customer",
       "k": "pick",
       "v": [
        "H사"
       ]
      }
     ],
     "q": "",
     "sortK": "date",
     "asc": false,
     "group": "status",
     "hide": [
      "files"
     ]
    }
   ],
   "tpls": [
    {
     "id": "t-dim",
     "name": "H사 · 치수 불량",
     "vals": {
      "customer": "H사",
      "type": "치수 불량",
      "owner": "김민수",
      "qty": 1
     }
    },
    {
     "id": "t-app",
     "name": "K사 · 외관 (스크래치·찍힘)",
     "vals": {
      "customer": "K사",
      "type": "외관 (스크래치·찍힘)",
      "owner": "이서연",
      "qty": 1
     }
    }
   ]
  },
  {
   "id": "capa",
   "name": "8D / 시정조치",
   "desc": "8D 리포트와 시정·예방조치 진행을 단계별로 관리합니다.",
   "dateField": "issued",
   "titleField": "subject",
   "fields": [
    {
     "key": "no",
     "label": "8D 번호",
     "type": "text",
     "auto": "8D-{YY}-"
    },
    {
     "key": "issued",
     "label": "발행일",
     "type": "date",
     "req": true
    },
    {
     "key": "subject",
     "label": "제목",
     "type": "text",
     "req": true
    },
    {
     "key": "source",
     "label": "발생 출처",
     "type": "select",
     "options": [
      "고객 클레임",
      "공정 불량",
      "협력사",
      "심사"
     ]
    },
    {
     "key": "vendor",
     "label": "관련 협력사",
     "type": "ref",
     "ref": "vendors"
    },
    {
     "key": "step",
     "label": "진행 단계",
     "type": "select",
     "options": [
      "D1~D2",
      "D3",
      "D4",
      "D5~D6",
      "D7",
      "D8 완료"
     ]
    },
    {
     "key": "d3",
     "label": "봉쇄 조치일 (D3)",
     "type": "date"
    },
    {
     "key": "d4",
     "label": "원인 규명일 (D4)",
     "type": "date"
    },
    {
     "key": "d6",
     "label": "대책 적용일 (D6)",
     "type": "date"
    },
    {
     "key": "owner",
     "label": "담당",
     "type": "ref",
     "ref": "people"
    },
    {
     "key": "due",
     "label": "완료 기한",
     "type": "date"
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "진행중",
      "지연",
      "완료"
     ],
     "badge": true
    },
    {
     "key": "closed",
     "label": "완료일",
     "type": "date",
     "closes": true
    },
    {
     "key": "lead",
     "label": "처리 기간(일)",
     "type": "days",
     "from": "issued",
     "to": "closed"
    }
   ],
   "records": [
    {
     "id": "r10g0b",
     "no": "8D-25-001",
     "issued": "2025-01-02",
     "subject": "도어래치 ASSY 외관 (스크래치·찍힘)",
     "source": "심사",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-02-18",
     "status": "완료",
     "closed": "2025-02-09",
     "d3": "2025-01-06",
     "d4": "2025-01-14",
     "d6": "2025-01-26"
    },
    {
     "id": "r10g0d",
     "no": "8D-25-002",
     "issued": "2025-01-19",
     "subject": "콘솔 커버 사출 수축",
     "source": "심사",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-02-23",
     "status": "완료",
     "closed": "2025-02-21",
     "d3": "2025-01-22",
     "d4": "2025-01-28",
     "d6": "2025-02-07"
    },
    {
     "id": "r10g0c",
     "no": "8D-25-003",
     "issued": "2025-01-24",
     "subject": "리어 브라켓 사출 수축",
     "source": "협력사",
     "vendor": "신흥정공",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-03-09",
     "status": "완료",
     "closed": "2025-02-24",
     "d3": "2025-01-27",
     "d4": "2025-02-04",
     "d6": "2025-02-11"
    },
    {
     "id": "r10g0g",
     "no": "8D-25-004",
     "issued": "2025-02-05",
     "subject": "테일게이트 힌지 치수 불량",
     "source": "협력사",
     "vendor": "삼진프레스",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-03-10",
     "status": "완료",
     "closed": "2025-03-09",
     "d3": "2025-02-08",
     "d4": "2025-02-16",
     "d6": "2025-02-24"
    },
    {
     "id": "r10g0f",
     "no": "8D-25-005",
     "issued": "2025-02-10",
     "subject": "리어 브라켓 오조립·누락",
     "source": "협력사",
     "vendor": "미래사출",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-03-23",
     "status": "완료",
     "closed": "2025-03-30",
     "d3": "2025-02-14",
     "d4": "2025-02-27",
     "d6": "2025-03-13"
    },
    {
     "id": "r10g0e",
     "no": "8D-25-006",
     "issued": "2025-02-23",
     "subject": "범퍼 빔 도장 핀홀·이물",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-04-11",
     "status": "완료",
     "closed": "2025-04-13",
     "d3": "2025-02-27",
     "d4": "2025-03-08",
     "d6": "2025-03-28"
    },
    {
     "id": "r10g0l",
     "no": "8D-25-007",
     "issued": "2025-03-07",
     "subject": "글로브박스 외관 (스크래치·찍힘)",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "이서연",
     "due": "2025-04-20",
     "status": "완료",
     "closed": "2025-04-05",
     "d3": "2025-03-09",
     "d4": "2025-03-17",
     "d6": "2025-03-25"
    },
    {
     "id": "r10g0j",
     "no": "8D-25-008",
     "issued": "2025-03-08",
     "subject": "시트프레임 도장 핀홀·이물",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-04-11",
     "status": "완료",
     "closed": "2025-04-15",
     "d3": "2025-03-12",
     "d4": "2025-03-21",
     "d6": "2025-04-02"
    },
    {
     "id": "r10g0m",
     "no": "8D-25-009",
     "issued": "2025-03-09",
     "subject": "리어 브라켓 작동 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2025-04-16",
     "status": "완료",
     "closed": "2025-05-02",
     "d3": "2025-03-14",
     "d4": "2025-03-29",
     "d6": "2025-04-14"
    },
    {
     "id": "r10g0h",
     "no": "8D-25-010",
     "issued": "2025-03-16",
     "subject": "도어래치 ASSY 오조립·누락",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2025-04-28",
     "status": "완료",
     "closed": "2025-04-11",
     "d3": "2025-03-18",
     "d4": "2025-03-24",
     "d6": "2025-04-01"
    },
    {
     "id": "r10g0k",
     "no": "8D-25-011",
     "issued": "2025-03-25",
     "subject": "브라켓 BRK-1830 체결 불량",
     "source": "협력사",
     "vendor": "태광산업",
     "step": "D8 완료",
     "owner": "이서연",
     "due": "2025-04-27",
     "status": "완료",
     "closed": "2025-04-22",
     "d3": "2025-03-28",
     "d4": "2025-04-03",
     "d6": "2025-04-14"
    },
    {
     "id": "r10g0i",
     "no": "8D-25-012",
     "issued": "2025-03-31",
     "subject": "도어래치 ASSY 작동 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-05-20",
     "status": "완료",
     "closed": "2025-05-09",
     "d3": "2025-04-04",
     "d4": "2025-04-13",
     "d6": "2025-04-22"
    },
    {
     "id": "r10g0q",
     "no": "8D-25-013",
     "issued": "2025-04-09",
     "subject": "도어 트림 사출 수축",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-05-24",
     "status": "완료",
     "closed": "2025-05-31",
     "d3": "2025-04-15",
     "d4": "2025-04-28",
     "d6": "2025-05-15"
    },
    {
     "id": "r10g0r",
     "no": "8D-25-014",
     "issued": "2025-04-10",
     "subject": "도어 트림 외관 (스크래치·찍힘)",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2025-05-21",
     "status": "완료",
     "closed": "2025-05-25",
     "d3": "2025-04-14",
     "d4": "2025-04-22",
     "d6": "2025-05-08"
    },
    {
     "id": "r10g0n",
     "no": "8D-25-015",
     "issued": "2025-04-23",
     "subject": "배터리 트레이 오조립·누락",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-06-05",
     "status": "완료",
     "closed": "2025-05-25",
     "d3": "2025-04-25",
     "d4": "2025-05-01",
     "d6": "2025-05-15"
    },
    {
     "id": "r10g0o",
     "no": "8D-25-016",
     "issued": "2025-04-29",
     "subject": "도어 트림 소음·진동",
     "source": "협력사",
     "vendor": "대명오토",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-06-11",
     "status": "완료",
     "closed": "2025-06-22",
     "d3": "2025-05-02",
     "d4": "2025-05-15",
     "d6": "2025-06-05"
    },
    {
     "id": "r10g0p",
     "no": "8D-25-017",
     "issued": "2025-04-29",
     "subject": "리어 브라켓 작동 불량",
     "source": "협력사",
     "vendor": "대성정밀",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-06-15",
     "status": "완료",
     "closed": "2025-06-04",
     "d3": "2025-05-03",
     "d4": "2025-05-11",
     "d6": "2025-05-22"
    },
    {
     "id": "r10g0s",
     "no": "8D-25-018",
     "issued": "2025-05-05",
     "subject": "시트프레임 외관 (스크래치·찍힘)",
     "source": "협력사",
     "vendor": "미래사출",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-06-06",
     "status": "완료",
     "closed": "2025-06-26",
     "d3": "2025-05-10",
     "d4": "2025-05-23",
     "d6": "2025-06-10"
    },
    {
     "id": "r10g0t",
     "no": "8D-25-019",
     "issued": "2025-05-05",
     "subject": "범퍼 빔 오조립·누락",
     "source": "협력사",
     "vendor": "대성정밀",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-06-21",
     "status": "완료",
     "closed": "2025-06-13",
     "d3": "2025-05-10",
     "d4": "2025-05-16",
     "d6": "2025-05-29"
    },
    {
     "id": "r10g0u",
     "no": "8D-25-020",
     "issued": "2025-05-14",
     "subject": "스티어링 브라켓 작동 불량",
     "source": "심사",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-07-03",
     "status": "완료",
     "closed": "2025-07-01",
     "d3": "2025-05-17",
     "d4": "2025-05-29",
     "d6": "2025-06-15"
    },
    {
     "id": "r10g0v",
     "no": "8D-25-021",
     "issued": "2025-05-24",
     "subject": "글로브박스 외관 (스크래치·찍힘)",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2025-06-28",
     "status": "완료",
     "closed": "2025-06-15",
     "d3": "2025-05-26",
     "d4": "2025-05-31",
     "d6": "2025-06-06"
    },
    {
     "id": "r10g0w",
     "no": "8D-25-022",
     "issued": "2025-05-28",
     "subject": "범퍼 빔 외관 (스크래치·찍힘)",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-07-15",
     "status": "완료",
     "closed": "2025-07-01",
     "d3": "2025-05-31",
     "d4": "2025-06-06",
     "d6": "2025-06-21"
    },
    {
     "id": "r10g10",
     "no": "8D-25-023",
     "issued": "2025-06-11",
     "subject": "스티어링 브라켓 치수 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-07-31",
     "status": "완료",
     "closed": "2025-07-07",
     "d3": "2025-06-13",
     "d4": "2025-06-20",
     "d6": "2025-06-28"
    },
    {
     "id": "r10g12",
     "no": "8D-25-024",
     "issued": "2025-06-16",
     "subject": "암레스트 오조립·누락",
     "source": "협력사",
     "vendor": "진영테크",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2025-07-29",
     "status": "완료",
     "closed": "2025-08-14",
     "d3": "2025-06-20",
     "d4": "2025-07-07",
     "d6": "2025-07-19"
    },
    {
     "id": "r10g0y",
     "no": "8D-25-025",
     "issued": "2025-06-17",
     "subject": "시트프레임 도장 핀홀·이물",
     "source": "협력사",
     "vendor": "태광산업",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-08-02",
     "status": "완료",
     "closed": "2025-07-30",
     "d3": "2025-06-22",
     "d4": "2025-07-02",
     "d6": "2025-07-17"
    },
    {
     "id": "r10g0x",
     "no": "8D-25-026",
     "issued": "2025-06-20",
     "subject": "스티어링 브라켓 사출 수축",
     "source": "협력사",
     "vendor": "경일산업",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-07-22",
     "status": "완료",
     "closed": "2025-07-14",
     "d3": "2025-06-22",
     "d4": "2025-06-29",
     "d6": "2025-07-06"
    },
    {
     "id": "r10g11",
     "no": "8D-25-027",
     "issued": "2025-06-23",
     "subject": "리어 브라켓 사출 수축",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-07-24",
     "status": "완료",
     "closed": "2025-07-31",
     "d3": "2025-06-27",
     "d4": "2025-07-04",
     "d6": "2025-07-20"
    },
    {
     "id": "r10g0z",
     "no": "8D-25-028",
     "issued": "2025-06-30",
     "subject": "도어 트림 외관 (스크래치·찍힘)",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-08-02",
     "status": "완료",
     "closed": "2025-07-29",
     "d3": "2025-07-03",
     "d4": "2025-07-08",
     "d6": "2025-07-19"
    },
    {
     "id": "r10g17",
     "no": "8D-25-029",
     "issued": "2025-07-07",
     "subject": "리어 브라켓 치수 불량",
     "source": "협력사",
     "vendor": "한빛고무",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-08-18",
     "status": "완료",
     "closed": "2025-08-31",
     "d3": "2025-07-11",
     "d4": "2025-07-24",
     "d6": "2025-08-08"
    },
    {
     "id": "r10g14",
     "no": "8D-25-030",
     "issued": "2025-07-11",
     "subject": "브라켓 BRK-1830 오조립·누락",
     "source": "협력사",
     "vendor": "동양도금",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-08-10",
     "status": "완료",
     "closed": "2025-09-02",
     "d3": "2025-07-15",
     "d4": "2025-07-29",
     "d6": "2025-08-11"
    },
    {
     "id": "r10g16",
     "no": "8D-25-031",
     "issued": "2025-07-21",
     "subject": "글로브박스 치수 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-09-09",
     "status": "완료",
     "closed": "2025-08-27",
     "d3": "2025-07-24",
     "d4": "2025-08-01",
     "d6": "2025-08-13"
    },
    {
     "id": "r10g15",
     "no": "8D-25-032",
     "issued": "2025-07-26",
     "subject": "글로브박스 치수 불량",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-09-04",
     "status": "완료",
     "closed": "2025-09-20",
     "d3": "2025-08-01",
     "d4": "2025-08-12",
     "d6": "2025-09-02"
    },
    {
     "id": "r10g13",
     "no": "8D-25-033",
     "issued": "2025-07-28",
     "subject": "리어 브라켓 오조립·누락",
     "source": "협력사",
     "vendor": "삼진프레스",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2025-09-10",
     "status": "완료",
     "closed": "2025-08-25",
     "d3": "2025-07-31",
     "d4": "2025-08-07",
     "d6": "2025-08-15"
    },
    {
     "id": "r10g18",
     "no": "8D-25-034",
     "issued": "2025-07-28",
     "subject": "범퍼 빔 소음·진동",
     "source": "심사",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-09-10",
     "status": "완료",
     "closed": "2025-08-26",
     "d3": "2025-07-31",
     "d4": "2025-08-05",
     "d6": "2025-08-14"
    },
    {
     "id": "r10g1a",
     "no": "8D-25-035",
     "issued": "2025-08-02",
     "subject": "리어 브라켓 사출 수축",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2025-09-15",
     "status": "완료",
     "closed": "2025-09-10",
     "d3": "2025-08-06",
     "d4": "2025-08-15",
     "d6": "2025-08-27"
    },
    {
     "id": "r10g19",
     "no": "8D-25-036",
     "issued": "2025-08-07",
     "subject": "시트프레임 작동 불량",
     "source": "협력사",
     "vendor": "한라부품",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-09-26",
     "status": "완료",
     "closed": "2025-09-21",
     "d3": "2025-08-12",
     "d4": "2025-08-22",
     "d6": "2025-09-07"
    },
    {
     "id": "r10g1c",
     "no": "8D-25-037",
     "issued": "2025-08-17",
     "subject": "글로브박스 소음·진동",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-09-25",
     "status": "완료",
     "closed": "2025-09-13",
     "d3": "2025-08-20",
     "d4": "2025-08-25",
     "d6": "2025-09-02"
    },
    {
     "id": "r10g1b",
     "no": "8D-25-038",
     "issued": "2025-08-18",
     "subject": "브라켓 BRK-1830 사출 수축",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2025-10-01",
     "status": "완료",
     "closed": "2025-09-20",
     "d3": "2025-08-22",
     "d4": "2025-08-30",
     "d6": "2025-09-05"
    },
    {
     "id": "r10g1d",
     "no": "8D-25-039",
     "issued": "2025-09-05",
     "subject": "커넥터 하우징 소음·진동",
     "source": "협력사",
     "vendor": "경일산업",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2025-10-06",
     "status": "완료",
     "closed": "2025-10-02",
     "d3": "2025-09-08",
     "d4": "2025-09-13",
     "d6": "2025-09-23"
    },
    {
     "id": "r10g1i",
     "no": "8D-25-040",
     "issued": "2025-09-09",
     "subject": "힌지 ASSY 도장 핀홀·이물",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-10-16",
     "status": "완료",
     "closed": "2025-10-25",
     "d3": "2025-09-13",
     "d4": "2025-09-25",
     "d6": "2025-10-09"
    },
    {
     "id": "r10g1g",
     "no": "8D-25-041",
     "issued": "2025-09-10",
     "subject": "도어 트림 체결 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-10-19",
     "status": "완료",
     "closed": "2025-10-13",
     "d3": "2025-09-13",
     "d4": "2025-09-22",
     "d6": "2025-09-30"
    },
    {
     "id": "r10g1f",
     "no": "8D-25-042",
     "issued": "2025-09-12",
     "subject": "도어 트림 작동 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "이서연",
     "due": "2025-11-01",
     "status": "완료",
     "closed": "2025-10-22",
     "d3": "2025-09-15",
     "d4": "2025-09-25",
     "d6": "2025-10-07"
    },
    {
     "id": "r10g1h",
     "no": "8D-25-043",
     "issued": "2025-09-15",
     "subject": "커넥터 하우징 외관 (스크래치·찍힘)",
     "source": "협력사",
     "vendor": "유성정밀",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-10-18",
     "status": "완료",
     "closed": "2025-10-30",
     "d3": "2025-09-20",
     "d4": "2025-10-01",
     "d6": "2025-10-14"
    },
    {
     "id": "r10g1e",
     "no": "8D-25-044",
     "issued": "2025-09-24",
     "subject": "브라켓 BRK-1830 작동 불량",
     "source": "심사",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-10-30",
     "status": "완료",
     "closed": "2025-10-21",
     "d3": "2025-09-27",
     "d4": "2025-10-03",
     "d6": "2025-10-12"
    },
    {
     "id": "r10g1k",
     "no": "8D-25-045",
     "issued": "2025-10-01",
     "subject": "콘솔 커버 사출 수축",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-11-01",
     "status": "완료",
     "closed": "2025-11-22",
     "d3": "2025-10-04",
     "d4": "2025-10-20",
     "d6": "2025-11-05"
    },
    {
     "id": "r10g1j",
     "no": "8D-25-046",
     "issued": "2025-10-06",
     "subject": "콘솔 커버 도장 핀홀·이물",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2025-11-05",
     "status": "완료",
     "closed": "2025-12-04",
     "d3": "2025-10-12",
     "d4": "2025-10-21",
     "d6": "2025-11-15"
    },
    {
     "id": "r10g1l",
     "no": "8D-25-047",
     "issued": "2025-10-07",
     "subject": "배터리 트레이 외관 (스크래치·찍힘)",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "이서연",
     "due": "2025-11-11",
     "status": "완료",
     "closed": "2025-11-25",
     "d3": "2025-10-12",
     "d4": "2025-10-21",
     "d6": "2025-11-09"
    },
    {
     "id": "r10g1m",
     "no": "8D-25-048",
     "issued": "2025-10-11",
     "subject": "도어 트림 작동 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-11-11",
     "status": "완료",
     "closed": "2025-11-25",
     "d3": "2025-10-14",
     "d4": "2025-10-25",
     "d6": "2025-11-09"
    },
    {
     "id": "r10g1n",
     "no": "8D-25-049",
     "issued": "2025-10-29",
     "subject": "스티어링 브라켓 기타",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2025-12-02",
     "status": "완료",
     "closed": "2025-12-04",
     "d3": "2025-10-31",
     "d4": "2025-11-09",
     "d6": "2025-11-23"
    },
    {
     "id": "r10g1o",
     "no": "8D-25-050",
     "issued": "2025-10-29",
     "subject": "테일게이트 힌지 외관 (스크래치·찍힘)",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2025-12-06",
     "status": "완료",
     "closed": "2025-12-11",
     "d3": "2025-11-03",
     "d4": "2025-11-12",
     "d6": "2025-11-23"
    },
    {
     "id": "r10g1q",
     "no": "8D-25-051",
     "issued": "2025-11-09",
     "subject": "글로브박스 작동 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2025-12-24",
     "status": "완료",
     "closed": "2026-01-04",
     "d3": "2025-11-15",
     "d4": "2025-11-25",
     "d6": "2025-12-15"
    },
    {
     "id": "r10g1r",
     "no": "8D-25-052",
     "issued": "2025-11-14",
     "subject": "브라켓 BRK-1830 치수 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "이서연",
     "due": "2025-12-29",
     "status": "완료",
     "closed": "2026-01-05",
     "d3": "2025-11-20",
     "d4": "2025-11-27",
     "d6": "2025-12-13"
    },
    {
     "id": "r10g1p",
     "no": "8D-25-053",
     "issued": "2025-11-30",
     "subject": "테일게이트 힌지 오조립·누락",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-01-18",
     "status": "완료",
     "closed": "2026-01-15",
     "d3": "2025-12-04",
     "d4": "2025-12-13",
     "d6": "2025-12-28"
    },
    {
     "id": "r10g1t",
     "no": "8D-25-054",
     "issued": "2025-12-05",
     "subject": "시트프레임 용접 스패터",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "이서연",
     "due": "2026-01-12",
     "status": "완료",
     "closed": "2026-01-12",
     "d3": "2025-12-09",
     "d4": "2025-12-18",
     "d6": "2025-12-28"
    },
    {
     "id": "r10g1w",
     "no": "8D-25-055",
     "issued": "2025-12-07",
     "subject": "리어 브라켓 작동 불량",
     "source": "심사",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-01-07",
     "status": "완료",
     "closed": "2026-01-01",
     "d3": "2025-12-09",
     "d4": "2025-12-15",
     "d6": "2025-12-21"
    },
    {
     "id": "r10g1v",
     "no": "8D-25-056",
     "issued": "2025-12-10",
     "subject": "테일게이트 힌지 외관 (스크래치·찍힘)",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-01-13",
     "status": "완료",
     "closed": "2026-01-17",
     "d3": "2025-12-13",
     "d4": "2025-12-22",
     "d6": "2025-12-31"
    },
    {
     "id": "r10g1u",
     "no": "8D-25-057",
     "issued": "2025-12-11",
     "subject": "커넥터 하우징 체결 불량",
     "source": "협력사",
     "vendor": "한라부품",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-01-19",
     "status": "완료",
     "closed": "2026-01-16",
     "d3": "2025-12-14",
     "d4": "2025-12-22",
     "d6": "2026-01-01"
    },
    {
     "id": "r10g1x",
     "no": "8D-25-058",
     "issued": "2025-12-18",
     "subject": "브라켓 BRK-1830 작동 불량",
     "source": "협력사",
     "vendor": "해성화학",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-02-03",
     "status": "완료",
     "closed": "2026-01-27",
     "d3": "2025-12-22",
     "d4": "2025-12-30",
     "d6": "2026-01-15"
    },
    {
     "id": "r10g1s",
     "no": "8D-25-059",
     "issued": "2025-12-25",
     "subject": "범퍼 빔 치수 불량",
     "source": "협력사",
     "vendor": "신흥정공",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2026-01-29",
     "status": "완료",
     "closed": "2026-02-10",
     "d3": "2025-12-29",
     "d4": "2026-01-09",
     "d6": "2026-01-21"
    },
    {
     "id": "r10g21",
     "no": "8D-26-001",
     "issued": "2026-01-10",
     "subject": "도어래치 ASSY 외관 (스크래치·찍힘)",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-03-01",
     "status": "완료",
     "closed": "2026-02-04",
     "d3": "2026-01-12",
     "d4": "2026-01-17",
     "d6": "2026-01-27"
    },
    {
     "id": "r10g20",
     "no": "8D-26-002",
     "issued": "2026-01-19",
     "subject": "도어 트림 외관 (스크래치·찍힘)",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2026-02-22",
     "status": "완료",
     "closed": "2026-02-27",
     "d3": "2026-01-22",
     "d4": "2026-02-01",
     "d6": "2026-02-10"
    },
    {
     "id": "r10g1z",
     "no": "8D-26-003",
     "issued": "2026-01-21",
     "subject": "리어 브라켓 치수 불량",
     "source": "협력사",
     "vendor": "태광산업",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-03-12",
     "status": "완료",
     "closed": "2026-03-03",
     "d3": "2026-01-24",
     "d4": "2026-02-05",
     "d6": "2026-02-13"
    },
    {
     "id": "r10g1y",
     "no": "8D-26-004",
     "issued": "2026-01-30",
     "subject": "브라켓 BRK-1830 오조립·누락",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "이서연",
     "due": "2026-03-15",
     "status": "완료",
     "closed": "2026-03-30",
     "d3": "2026-02-04",
     "d4": "2026-02-18",
     "d6": "2026-03-08"
    },
    {
     "id": "r10g22",
     "no": "8D-26-005",
     "issued": "2026-02-02",
     "subject": "배터리 트레이 사출 수축",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-03-21",
     "status": "완료",
     "closed": "2026-03-31",
     "d3": "2026-02-07",
     "d4": "2026-02-19",
     "d6": "2026-03-08"
    },
    {
     "id": "r10g25",
     "no": "8D-26-006",
     "issued": "2026-02-07",
     "subject": "암레스트 소음·진동",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2026-03-21",
     "status": "완료",
     "closed": "2026-04-07",
     "d3": "2026-02-11",
     "d4": "2026-02-25",
     "d6": "2026-03-20"
    },
    {
     "id": "r10g24",
     "no": "8D-26-007",
     "issued": "2026-02-08",
     "subject": "커넥터 하우징 치수 불량",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2026-03-23",
     "status": "완료",
     "closed": "2026-03-16",
     "d3": "2026-02-11",
     "d4": "2026-02-19",
     "d6": "2026-03-03"
    },
    {
     "id": "r10g23",
     "no": "8D-26-008",
     "issued": "2026-02-19",
     "subject": "테일게이트 힌지 용접 스패터",
     "source": "심사",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-03-27",
     "status": "완료",
     "closed": "2026-03-22",
     "d3": "2026-02-22",
     "d4": "2026-02-28",
     "d6": "2026-03-08"
    },
    {
     "id": "r10g26",
     "no": "8D-26-009",
     "issued": "2026-02-19",
     "subject": "테일게이트 힌지 오조립·누락",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2026-04-07",
     "status": "완료",
     "closed": "2026-04-13",
     "d3": "2026-02-24",
     "d4": "2026-03-07",
     "d6": "2026-03-20"
    },
    {
     "id": "r10g27",
     "no": "8D-26-010",
     "issued": "2026-03-10",
     "subject": "힌지 ASSY 체결 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "이서연",
     "due": "2026-04-22",
     "status": "완료",
     "closed": "2026-05-02",
     "d3": "2026-03-13",
     "d4": "2026-03-27",
     "d6": "2026-04-16"
    },
    {
     "id": "r10g29",
     "no": "8D-26-011",
     "issued": "2026-03-19",
     "subject": "콘솔 커버 외관 (스크래치·찍힘)",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "이서연",
     "due": "2026-05-04",
     "status": "완료",
     "closed": "2026-05-14",
     "d3": "2026-03-25",
     "d4": "2026-04-06",
     "d6": "2026-04-25"
    },
    {
     "id": "r10g28",
     "no": "8D-26-012",
     "issued": "2026-03-30",
     "subject": "콘솔 커버 치수 불량",
     "source": "협력사",
     "vendor": "성원전자",
     "step": "D7",
     "owner": "김민수",
     "due": "2026-05-05",
     "status": "지연",
     "closed": "",
     "d3": "2026-04-15",
     "d4": "2026-06-01",
     "d6": "2026-07-23"
    },
    {
     "id": "r10g2e",
     "no": "8D-26-013",
     "issued": "2026-04-10",
     "subject": "도어 트림 오조립·누락",
     "source": "협력사",
     "vendor": "유성정밀",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2026-05-17",
     "status": "완료",
     "closed": "2026-06-03",
     "d3": "2026-04-15",
     "d4": "2026-04-26",
     "d6": "2026-05-13"
    },
    {
     "id": "r10g2a",
     "no": "8D-26-014",
     "issued": "2026-04-11",
     "subject": "리어 브라켓 치수 불량",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-05-26",
     "status": "완료",
     "closed": "2026-06-10",
     "d3": "2026-04-18",
     "d4": "2026-04-29",
     "d6": "2026-05-20"
    },
    {
     "id": "r10g2d",
     "no": "8D-26-015",
     "issued": "2026-04-11",
     "subject": "스티어링 브라켓 용접 스패터",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-05-22",
     "status": "완료",
     "closed": "2026-06-06",
     "d3": "2026-04-16",
     "d4": "2026-05-01",
     "d6": "2026-05-15"
    },
    {
     "id": "r10g2b",
     "no": "8D-26-016",
     "issued": "2026-04-17",
     "subject": "커넥터 하우징 외관 (스크래치·찍힘)",
     "source": "협력사",
     "vendor": "유성정밀",
     "step": "D8 완료",
     "owner": "이서연",
     "due": "2026-06-04",
     "status": "완료",
     "closed": "2026-05-27",
     "d3": "2026-04-20",
     "d4": "2026-04-29",
     "d6": "2026-05-15"
    },
    {
     "id": "r10g2c",
     "no": "8D-26-017",
     "issued": "2026-04-18",
     "subject": "글로브박스 체결 불량",
     "source": "협력사",
     "vendor": "신흥정공",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2026-05-26",
     "status": "완료",
     "closed": "2026-06-08",
     "d3": "2026-04-22",
     "d4": "2026-05-01",
     "d6": "2026-05-17"
    },
    {
     "id": "r10g2f",
     "no": "8D-26-018",
     "issued": "2026-04-25",
     "subject": "힌지 ASSY 이종 부품 혼입",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2026-06-11",
     "status": "완료",
     "closed": "2026-05-22",
     "d3": "2026-04-27",
     "d4": "2026-05-03",
     "d6": "2026-05-12"
    },
    {
     "id": "r10g2i",
     "no": "8D-26-019",
     "issued": "2026-05-05",
     "subject": "배터리 트레이 소음·진동",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2026-06-12",
     "status": "완료",
     "closed": "2026-05-28",
     "d3": "2026-05-07",
     "d4": "2026-05-13",
     "d6": "2026-05-19"
    },
    {
     "id": "r10g2h",
     "no": "8D-26-020",
     "issued": "2026-05-17",
     "subject": "커넥터 하우징 외관 (스크래치·찍힘)",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2026-07-06",
     "status": "완료",
     "closed": "2026-07-10",
     "d3": "2026-05-23",
     "d4": "2026-06-02",
     "d6": "2026-06-16"
    },
    {
     "id": "r10g2g",
     "no": "8D-26-021",
     "issued": "2026-05-25",
     "subject": "암레스트 이종 부품 혼입",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2026-07-14",
     "status": "완료",
     "closed": "2026-07-09",
     "d3": "2026-05-29",
     "d4": "2026-06-06",
     "d6": "2026-06-20"
    },
    {
     "id": "r10g2j",
     "no": "8D-26-022",
     "issued": "2026-05-31",
     "subject": "커넥터 하우징 소음·진동",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2026-07-09",
     "status": "완료",
     "closed": "2026-07-23",
     "d3": "2026-06-04",
     "d4": "2026-06-18",
     "d6": "2026-07-06"
    },
    {
     "id": "r10g2k",
     "no": "8D-26-023",
     "issued": "2026-06-04",
     "subject": "커넥터 하우징 외관 (스크래치·찍힘)",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "이서연",
     "due": "2026-07-09",
     "status": "완료",
     "closed": "2026-07-16",
     "d3": "2026-06-07",
     "d4": "2026-06-17",
     "d6": "2026-07-01"
    },
    {
     "id": "r10g2m",
     "no": "8D-26-024",
     "issued": "2026-06-25",
     "subject": "커넥터 하우징 용접 스패터",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-08-01",
     "status": "완료",
     "closed": "2026-08-11",
     "d3": "2026-06-30",
     "d4": "2026-07-08",
     "d6": "2026-07-23"
    },
    {
     "id": "r10g2l",
     "no": "8D-26-025",
     "issued": "2026-06-28",
     "subject": "시트프레임 치수 불량",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-07-30",
     "status": "완료",
     "closed": "2026-08-02",
     "d3": "2026-06-30",
     "d4": "2026-07-10",
     "d6": "2026-07-19"
    },
    {
     "id": "r10g2r",
     "no": "8D-26-026",
     "issued": "2026-07-07",
     "subject": "도어래치 ASSY 작동 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "박지훈",
     "due": "2026-08-11",
     "status": "완료",
     "closed": "2026-08-28",
     "d3": "2026-07-11",
     "d4": "2026-07-22",
     "d6": "2026-08-11"
    },
    {
     "id": "r10g2q",
     "no": "8D-26-027",
     "issued": "2026-07-10",
     "subject": "스티어링 브라켓 작동 불량",
     "source": "협력사",
     "vendor": "태광산업",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-08-24",
     "status": "완료",
     "closed": "2026-08-18",
     "d3": "2026-07-12",
     "d4": "2026-07-21",
     "d6": "2026-08-01"
    },
    {
     "id": "r10g2s",
     "no": "8D-26-028",
     "issued": "2026-07-15",
     "subject": "리어 브라켓 외관 (스크래치·찍힘)",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-08-20",
     "status": "완료",
     "closed": "2026-08-31",
     "d3": "2026-07-19",
     "d4": "2026-07-27",
     "d6": "2026-08-14"
    },
    {
     "id": "r10g2o",
     "no": "8D-26-029",
     "issued": "2026-07-17",
     "subject": "브라켓 BRK-1830 오조립·누락",
     "source": "공정 불량",
     "vendor": "",
     "step": "D8 완료",
     "owner": "김민수",
     "due": "2026-09-01",
     "status": "완료",
     "closed": "2026-08-31",
     "d3": "2026-07-21",
     "d4": "2026-07-29",
     "d6": "2026-08-16"
    },
    {
     "id": "r10g2p",
     "no": "8D-26-030",
     "issued": "2026-07-19",
     "subject": "콘솔 커버 소음·진동",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-08-18",
     "status": "완료",
     "closed": "2026-09-15",
     "d3": "2026-07-25",
     "d4": "2026-08-09",
     "d6": "2026-08-24"
    },
    {
     "id": "r10g2n",
     "no": "8D-26-031",
     "issued": "2026-07-21",
     "subject": "시트프레임 소음·진동",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D8 완료",
     "owner": "최유진",
     "due": "2026-08-23",
     "status": "완료",
     "closed": "2026-09-05",
     "d3": "2026-07-25",
     "d4": "2026-08-04",
     "d6": "2026-08-15"
    },
    {
     "id": "r10g2u",
     "no": "8D-26-032",
     "issued": "2026-08-01",
     "subject": "브라켓 BRK-1830 치수 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D7",
     "owner": "김민수",
     "due": "2026-09-05",
     "status": "지연",
     "closed": "",
     "d3": "2026-08-09",
     "d4": "2026-08-26",
     "d6": "2026-09-11"
    },
    {
     "id": "r10g2t",
     "no": "8D-26-033",
     "issued": "2026-08-04",
     "subject": "리어 브라켓 작동 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D7",
     "owner": "이서연",
     "due": "2026-09-17",
     "status": "지연",
     "closed": "",
     "d3": "2026-08-09",
     "d4": "2026-08-23",
     "d6": "2026-09-13"
    },
    {
     "id": "r10g2v",
     "no": "8D-26-034",
     "issued": "2026-08-11",
     "subject": "시트프레임 소음·진동",
     "source": "공정 불량",
     "vendor": "",
     "step": "D7",
     "owner": "최유진",
     "due": "2026-09-29",
     "status": "지연",
     "closed": "",
     "d3": "2026-08-16",
     "d4": "2026-08-26",
     "d6": "2026-09-18"
    },
    {
     "id": "r10g2x",
     "no": "8D-26-035",
     "issued": "2026-09-14",
     "subject": "리어 브라켓 사출 수축",
     "source": "심사",
     "vendor": "",
     "step": "D5~D6",
     "owner": "이서연",
     "due": "2026-10-20",
     "status": "진행중",
     "closed": "",
     "d3": "2026-09-16",
     "d4": "2026-09-20"
    },
    {
     "id": "r10g2w",
     "no": "8D-26-036",
     "issued": "2026-09-15",
     "subject": "콘솔 커버 오조립·누락",
     "source": "협력사",
     "vendor": "한라부품",
     "step": "D4",
     "owner": "김민수",
     "due": "2026-11-03",
     "status": "진행중",
     "closed": "",
     "d3": "2026-09-17"
    },
    {
     "id": "r10g30",
     "no": "8D-26-037",
     "issued": "2026-09-20",
     "subject": "도어래치 ASSY 치수 불량",
     "source": "고객 클레임",
     "vendor": "",
     "step": "D3",
     "owner": "김민수",
     "due": "2026-10-25",
     "status": "진행중",
     "closed": "",
     "d3": "2026-09-22"
    },
    {
     "id": "r10g2y",
     "no": "8D-26-038",
     "issued": "2026-09-29",
     "subject": "도어래치 ASSY 외관 (스크래치·찍힘)",
     "source": "고객 클레임",
     "vendor": "삼진프레스",
     "step": "D1~D2",
     "owner": "이서연",
     "due": "2026-11-07",
     "status": "진행중",
     "closed": ""
    },
    {
     "id": "r10g2z",
     "no": "8D-26-039",
     "issued": "2026-09-30",
     "subject": "스티어링 브라켓 외관 (스크래치·찍힘)",
     "source": "공정 불량",
     "vendor": "",
     "step": "D3",
     "owner": "김민수",
     "due": "2026-11-15",
     "status": "진행중",
     "closed": "",
     "d3": "2026-10-02"
    },
    {
     "id": "r10g31",
     "no": "8D-26-040",
     "issued": "2026-10-03",
     "subject": "배터리 트레이 외관 (스크래치·찍힘)",
     "source": "공정 불량",
     "vendor": "",
     "step": "D1~D2",
     "owner": "김민수",
     "due": "2026-11-08",
     "status": "진행중",
     "closed": ""
    },
    {
     "id": "r10g32",
     "no": "8D-26-041",
     "issued": "2026-10-03",
     "subject": "배터리 트레이 도장 핀홀·이물",
     "source": "협력사",
     "vendor": "성원전자",
     "step": "D1~D2",
     "owner": "최유진",
     "due": "2026-11-20",
     "status": "진행중",
     "closed": "",
     "_c": [
      {
       "at": "2026-10-07T02:10:00.000Z",
       "who": "최유진",
       "t": "D3 봉쇄: 재고 120개 전수 선별 완료, 불량 2개"
      },
      {
       "at": "2026-10-07T23:50:00.000Z",
       "who": "김민수",
       "t": "원인 분석 회의 10/10(금) 14시"
      }
     ]
    }
   ],
   "views": [
    {
     "id": "v-step",
     "name": "단계별",
     "f": [
      {
       "f": "status",
       "k": "pick",
       "v": [
        "진행중",
        "지연"
       ]
      }
     ],
     "q": "",
     "sortK": "issued",
     "asc": false,
     "group": "step",
     "hide": []
    },
    {
     "id": "v-month",
     "name": "월별 발행",
     "f": [],
     "q": "",
     "sortK": "issued",
     "asc": false,
     "group": "issued",
     "hide": []
    }
   ],
   "tpls": [
    {
     "id": "t-cl",
     "name": "고객 클레임 8D",
     "vals": {
      "source": "고객 클레임",
      "step": "D1~D2",
      "owner": "김민수"
     }
    }
   ]
  },
  {
   "id": "defects",
   "name": "불량 발생",
   "desc": "공정·입고·출하 단계에서 발견한 불량을 건별로 기록합니다.",
   "dateField": "date",
   "titleField": "part",
   "fields": [
    {
     "key": "date",
     "label": "발생일",
     "type": "date",
     "req": true
    },
    {
     "key": "kind",
     "label": "구분",
     "type": "select",
     "options": [
      "공정",
      "입고",
      "출하"
     ],
     "req": true
    },
    {
     "key": "line",
     "label": "라인",
     "type": "ref",
     "ref": "lines"
    },
    {
     "key": "vendor",
     "label": "협력사 (입고)",
     "type": "ref",
     "ref": "vendors"
    },
    {
     "key": "part",
     "label": "부품",
     "type": "ref",
     "ref": "parts"
    },
    {
     "key": "type",
     "label": "불량 유형",
     "type": "ref",
     "ref": "defecttypes"
    },
    {
     "key": "qty",
     "label": "불량 수량",
     "type": "number"
    },
    {
     "key": "action",
     "label": "조치",
     "type": "text"
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "조치중",
      "완료"
     ],
     "badge": true
    },
    {
     "key": "files",
     "label": "불량 사진",
     "type": "file"
    }
   ],
   "records": [
    {
     "id": "r10g33",
     "date": "2025-01-17",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "체결 불량",
     "qty": 7,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g34",
     "date": "2025-01-22",
     "kind": "입고",
     "line": "",
     "vendor": "세화테크",
     "part": "커넥터 하우징",
     "type": "치수 불량",
     "qty": 54,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g35",
     "date": "2025-01-01",
     "kind": "입고",
     "line": "",
     "vendor": "미래사출",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 6,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g36",
     "date": "2025-01-09",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "사출 미성형",
     "qty": 116,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g37",
     "date": "2025-01-14",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 6,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g38",
     "date": "2025-01-23",
     "kind": "입고",
     "line": "",
     "vendor": "태광산업",
     "part": "범퍼 빔",
     "type": "외관 (스크래치·찍힘)",
     "qty": 26,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g39",
     "date": "2025-01-20",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "리어 브라켓",
     "type": "이종 부품 혼입",
     "qty": 95,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3a",
     "date": "2025-01-14",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "오조립·누락",
     "qty": 10,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3b",
     "date": "2025-01-30",
     "kind": "입고",
     "line": "",
     "vendor": "미래사출",
     "part": "암레스트",
     "type": "도금 박리",
     "qty": 5,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3c",
     "date": "2025-01-20",
     "kind": "입고",
     "line": "",
     "vendor": "미래사출",
     "part": "암레스트",
     "type": "도금 박리",
     "qty": 67,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3d",
     "date": "2025-01-12",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 10,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3e",
     "date": "2025-01-29",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "오조립·누락",
     "qty": 4,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3f",
     "date": "2025-01-04",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 114,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3g",
     "date": "2025-01-21",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 30,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3h",
     "date": "2025-01-12",
     "kind": "출하",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3i",
     "date": "2025-01-19",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 8,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3j",
     "date": "2025-01-08",
     "kind": "입고",
     "line": "",
     "vendor": "경일산업",
     "part": "힌지 ASSY",
     "type": "사출 미성형",
     "qty": 9,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3k",
     "date": "2025-01-22",
     "kind": "입고",
     "line": "",
     "vendor": "대성정밀",
     "part": "힌지 ASSY",
     "type": "사출 미성형",
     "qty": 2,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3l",
     "date": "2025-01-22",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 67,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3m",
     "date": "2025-01-04",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 120,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3n",
     "date": "2025-01-16",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 4,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3o",
     "date": "2025-01-18",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 4,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3p",
     "date": "2025-01-21",
     "kind": "입고",
     "line": "",
     "vendor": "세화테크",
     "part": "도어 트림",
     "type": "도금 박리",
     "qty": 2,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3q",
     "date": "2025-01-28",
     "kind": "출하",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 2,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3r",
     "date": "2025-01-17",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3s",
     "date": "2025-02-23",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 9,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3t",
     "date": "2025-02-11",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 4,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3u",
     "date": "2025-02-02",
     "kind": "입고",
     "line": "",
     "vendor": "대성정밀",
     "part": "암레스트",
     "type": "이종 부품 혼입",
     "qty": 4,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3v",
     "date": "2025-02-03",
     "kind": "입고",
     "line": "",
     "vendor": "대성정밀",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 7,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3w",
     "date": "2025-02-16",
     "kind": "출하",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "체결 불량",
     "qty": 22,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3x",
     "date": "2025-02-05",
     "kind": "입고",
     "line": "",
     "vendor": "진영테크",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 23,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3y",
     "date": "2025-02-25",
     "kind": "출하",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "체결 불량",
     "qty": 10,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g3z",
     "date": "2025-02-28",
     "kind": "입고",
     "line": "",
     "vendor": "동양도금",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 6,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g40",
     "date": "2025-02-04",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 미성형",
     "qty": 66,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g41",
     "date": "2025-02-22",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 4,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g42",
     "date": "2025-02-26",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 31,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g43",
     "date": "2025-02-07",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 9,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g44",
     "date": "2025-02-22",
     "kind": "입고",
     "line": "",
     "vendor": "진영테크",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 7,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g45",
     "date": "2025-02-22",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 1,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g46",
     "date": "2025-02-10",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g47",
     "date": "2025-02-27",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 22,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g48",
     "date": "2025-02-19",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 35,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g49",
     "date": "2025-02-21",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "체결 불량",
     "qty": 24,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4a",
     "date": "2025-02-25",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 2,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4b",
     "date": "2025-02-18",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 강도 미달",
     "qty": 22,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4c",
     "date": "2025-02-13",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "오조립·누락",
     "qty": 20,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4d",
     "date": "2025-02-06",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 25,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4e",
     "date": "2025-02-18",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4f",
     "date": "2025-03-30",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 3,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4g",
     "date": "2025-03-01",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "외관 (스크래치·찍힘)",
     "qty": 5,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4h",
     "date": "2025-03-10",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 4,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4i",
     "date": "2025-03-12",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 96,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4j",
     "date": "2025-03-27",
     "kind": "출하",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "체결 불량",
     "qty": 15,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4k",
     "date": "2025-03-14",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 3,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4l",
     "date": "2025-03-31",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 51,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4m",
     "date": "2025-03-21",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "체결 불량",
     "qty": 9,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4n",
     "date": "2025-03-12",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "오조립·누락",
     "qty": 6,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4o",
     "date": "2025-03-12",
     "kind": "입고",
     "line": "",
     "vendor": "태광산업",
     "part": "커넥터 하우징",
     "type": "도금 박리",
     "qty": 22,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4p",
     "date": "2025-03-12",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 36,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4q",
     "date": "2025-03-21",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 19,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4r",
     "date": "2025-03-07",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "체결 불량",
     "qty": 5,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4s",
     "date": "2025-03-01",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 35,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4t",
     "date": "2025-03-11",
     "kind": "입고",
     "line": "",
     "vendor": "미래사출",
     "part": "도어래치 ASSY",
     "type": "도금 박리",
     "qty": 8,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4u",
     "date": "2025-03-09",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "외관 (스크래치·찍힘)",
     "qty": 8,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4v",
     "date": "2025-03-19",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "사출 수축",
     "qty": 15,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4w",
     "date": "2025-03-13",
     "kind": "출하",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 23,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4x",
     "date": "2025-03-09",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 6,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4y",
     "date": "2025-03-27",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 19,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g4z",
     "date": "2025-03-26",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 54,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g50",
     "date": "2025-03-27",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 1,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g51",
     "date": "2025-03-12",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 75,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g52",
     "date": "2025-03-29",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 31,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g53",
     "date": "2025-03-26",
     "kind": "출하",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 3,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g54",
     "date": "2025-03-26",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 미성형",
     "qty": 27,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g55",
     "date": "2025-04-25",
     "kind": "입고",
     "line": "",
     "vendor": "유성정밀",
     "part": "도어래치 ASSY",
     "type": "이종 부품 혼입",
     "qty": 6,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g56",
     "date": "2025-04-14",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "외관 (스크래치·찍힘)",
     "qty": 55,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g57",
     "date": "2025-04-06",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 37,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g58",
     "date": "2025-04-24",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 5,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g59",
     "date": "2025-04-25",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "사출 미성형",
     "qty": 7,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5a",
     "date": "2025-04-01",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 2,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5b",
     "date": "2025-04-19",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 11,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5c",
     "date": "2025-04-19",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 4,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5d",
     "date": "2025-04-21",
     "kind": "출하",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5e",
     "date": "2025-04-17",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 36,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5f",
     "date": "2025-04-04",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "사출 미성형",
     "qty": 5,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5g",
     "date": "2025-04-26",
     "kind": "입고",
     "line": "",
     "vendor": "경일산업",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 14,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5h",
     "date": "2025-04-07",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 17,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5i",
     "date": "2025-04-17",
     "kind": "입고",
     "line": "",
     "vendor": "해성화학",
     "part": "콘솔 커버",
     "type": "외관 (스크래치·찍힘)",
     "qty": 6,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5j",
     "date": "2025-04-22",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 18,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5k",
     "date": "2025-04-01",
     "kind": "입고",
     "line": "",
     "vendor": "우진금속",
     "part": "브라켓 BRK-1830",
     "type": "도금 박리",
     "qty": 8,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5l",
     "date": "2025-04-29",
     "kind": "입고",
     "line": "",
     "vendor": "세화테크",
     "part": "암레스트",
     "type": "외관 (스크래치·찍힘)",
     "qty": 30,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5m",
     "date": "2025-04-03",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 1,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5n",
     "date": "2025-04-23",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 3,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5o",
     "date": "2025-04-06",
     "kind": "입고",
     "line": "",
     "vendor": "우진금속",
     "part": "범퍼 빔",
     "type": "도금 박리",
     "qty": 11,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5p",
     "date": "2025-04-16",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 1,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5q",
     "date": "2025-04-13",
     "kind": "출하",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "오조립·누락",
     "qty": 18,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5r",
     "date": "2025-04-17",
     "kind": "입고",
     "line": "",
     "vendor": "세화테크",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 17,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5s",
     "date": "2025-04-10",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 31,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5t",
     "date": "2025-05-13",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 29,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5u",
     "date": "2025-05-07",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 4,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5v",
     "date": "2025-05-15",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 4,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5w",
     "date": "2025-05-15",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 2,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5x",
     "date": "2025-05-04",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 14,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5y",
     "date": "2025-05-29",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 5,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g5z",
     "date": "2025-05-19",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 강도 미달",
     "qty": 119,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g60",
     "date": "2025-05-07",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "작동 불량",
     "qty": 5,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g61",
     "date": "2025-05-20",
     "kind": "출하",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 16,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g62",
     "date": "2025-05-25",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 미성형",
     "qty": 105,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g63",
     "date": "2025-05-20",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 7,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g64",
     "date": "2025-05-16",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 7,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g65",
     "date": "2025-05-10",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "사출 수축",
     "qty": 8,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g66",
     "date": "2025-05-21",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 5,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g67",
     "date": "2025-05-06",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "스티어링 브라켓",
     "type": "도금 박리",
     "qty": 9,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g68",
     "date": "2025-05-28",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 9,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g69",
     "date": "2025-05-02",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 6,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6a",
     "date": "2025-05-22",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "작동 불량",
     "qty": 6,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6b",
     "date": "2025-05-24",
     "kind": "입고",
     "line": "",
     "vendor": "성원전자",
     "part": "콘솔 커버",
     "type": "치수 불량",
     "qty": 3,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6c",
     "date": "2025-05-06",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 1,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6d",
     "date": "2025-05-23",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 7,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6e",
     "date": "2025-05-25",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 9,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6f",
     "date": "2025-05-03",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 10,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6g",
     "date": "2025-05-10",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "오조립·누락",
     "qty": 7,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6h",
     "date": "2025-05-12",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "오조립·누락",
     "qty": 90,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6i",
     "date": "2025-05-26",
     "kind": "출하",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 강도 미달",
     "qty": 8,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6j",
     "date": "2025-05-30",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 5,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6k",
     "date": "2025-06-16",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "체결 불량",
     "qty": 3,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6l",
     "date": "2025-06-29",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 32,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6m",
     "date": "2025-06-10",
     "kind": "입고",
     "line": "",
     "vendor": "진영테크",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 2,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6n",
     "date": "2025-06-10",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 3,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6o",
     "date": "2025-06-30",
     "kind": "출하",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 32,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6p",
     "date": "2025-06-30",
     "kind": "입고",
     "line": "",
     "vendor": "해성화학",
     "part": "암레스트",
     "type": "치수 불량",
     "qty": 4,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6q",
     "date": "2025-06-21",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "작동 불량",
     "qty": 9,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6r",
     "date": "2025-06-01",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 2,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6s",
     "date": "2025-06-29",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "작동 불량",
     "qty": 4,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6t",
     "date": "2025-06-29",
     "kind": "입고",
     "line": "",
     "vendor": "세화테크",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 107,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6u",
     "date": "2025-06-21",
     "kind": "입고",
     "line": "",
     "vendor": "유성정밀",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6v",
     "date": "2025-06-29",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "사출 수축",
     "qty": 33,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6w",
     "date": "2025-06-29",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 22,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6x",
     "date": "2025-06-03",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "체결 불량",
     "qty": 10,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6y",
     "date": "2025-06-05",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 2,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g6z",
     "date": "2025-06-06",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 27,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g70",
     "date": "2025-06-16",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "오조립·누락",
     "qty": 10,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g71",
     "date": "2025-06-03",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "작동 불량",
     "qty": 3,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g72",
     "date": "2025-06-14",
     "kind": "입고",
     "line": "",
     "vendor": "동양도금",
     "part": "범퍼 빔",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g73",
     "date": "2025-06-16",
     "kind": "출하",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 53,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g74",
     "date": "2025-06-22",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "리어 브라켓",
     "type": "도금 박리",
     "qty": 3,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g75",
     "date": "2025-06-17",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 11,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g76",
     "date": "2025-06-06",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 7,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g77",
     "date": "2025-07-01",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 4,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g78",
     "date": "2025-07-10",
     "kind": "출하",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "오조립·누락",
     "qty": 3,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g79",
     "date": "2025-07-02",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 12,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7a",
     "date": "2025-07-08",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 9,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7b",
     "date": "2025-07-15",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 33,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7c",
     "date": "2025-07-03",
     "kind": "입고",
     "line": "",
     "vendor": "해성화학",
     "part": "배터리 트레이",
     "type": "외관 (스크래치·찍힘)",
     "qty": 2,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7d",
     "date": "2025-07-31",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "오조립·누락",
     "qty": 4,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7e",
     "date": "2025-07-23",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 6,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7f",
     "date": "2025-07-11",
     "kind": "입고",
     "line": "",
     "vendor": "세화테크",
     "part": "도어 트림",
     "type": "이종 부품 혼입",
     "qty": 4,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7g",
     "date": "2025-07-11",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 4,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7h",
     "date": "2025-07-20",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 미성형",
     "qty": 89,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7i",
     "date": "2025-07-31",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 43,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7j",
     "date": "2025-07-15",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 34,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7k",
     "date": "2025-07-17",
     "kind": "입고",
     "line": "",
     "vendor": "대성정밀",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 28,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7l",
     "date": "2025-07-10",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "사출 미성형",
     "qty": 3,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7m",
     "date": "2025-07-21",
     "kind": "입고",
     "line": "",
     "vendor": "동양도금",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 77,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7n",
     "date": "2025-07-01",
     "kind": "입고",
     "line": "",
     "vendor": "미래사출",
     "part": "시트프레임",
     "type": "도금 박리",
     "qty": 3,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7o",
     "date": "2025-07-24",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "오조립·누락",
     "qty": 3,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7p",
     "date": "2025-07-23",
     "kind": "입고",
     "line": "",
     "vendor": "성원전자",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 8,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7q",
     "date": "2025-07-26",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "암레스트",
     "type": "도금 박리",
     "qty": 27,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7r",
     "date": "2025-07-16",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 85,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7s",
     "date": "2025-07-22",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "힌지 ASSY",
     "type": "치수 불량",
     "qty": 2,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7t",
     "date": "2025-07-31",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 32,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7u",
     "date": "2025-07-06",
     "kind": "입고",
     "line": "",
     "vendor": "한라부품",
     "part": "도어래치 ASSY",
     "type": "도금 박리",
     "qty": 10,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7v",
     "date": "2025-07-09",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 10,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7w",
     "date": "2025-07-30",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "사출 수축",
     "qty": 1,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7x",
     "date": "2025-07-22",
     "kind": "입고",
     "line": "",
     "vendor": "미래사출",
     "part": "글로브박스",
     "type": "이종 부품 혼입",
     "qty": 30,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7y",
     "date": "2025-08-24",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 2,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g7z",
     "date": "2025-08-10",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 39,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g80",
     "date": "2025-08-22",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 1,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g81",
     "date": "2025-08-13",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 10,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g82",
     "date": "2025-08-15",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 6,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g83",
     "date": "2025-08-10",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 2,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g84",
     "date": "2025-08-20",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 강도 미달",
     "qty": 5,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g85",
     "date": "2025-08-04",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g86",
     "date": "2025-08-10",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 34,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g87",
     "date": "2025-08-18",
     "kind": "출하",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "체결 불량",
     "qty": 9,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g88",
     "date": "2025-08-29",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 12,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g89",
     "date": "2025-08-09",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 6,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8a",
     "date": "2025-08-04",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "작동 불량",
     "qty": 1,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8b",
     "date": "2025-08-06",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 7,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8c",
     "date": "2025-08-04",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "체결 불량",
     "qty": 2,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8d",
     "date": "2025-08-17",
     "kind": "입고",
     "line": "",
     "vendor": "태광산업",
     "part": "범퍼 빔",
     "type": "도금 박리",
     "qty": 31,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8e",
     "date": "2025-08-16",
     "kind": "입고",
     "line": "",
     "vendor": "한라부품",
     "part": "범퍼 빔",
     "type": "도금 박리",
     "qty": 1,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8f",
     "date": "2025-08-28",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "외관 (스크래치·찍힘)",
     "qty": 6,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8g",
     "date": "2025-08-05",
     "kind": "입고",
     "line": "",
     "vendor": "한빛고무",
     "part": "범퍼 빔",
     "type": "외관 (스크래치·찍힘)",
     "qty": 23,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8h",
     "date": "2025-08-09",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 미성형",
     "qty": 6,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8i",
     "date": "2025-08-26",
     "kind": "입고",
     "line": "",
     "vendor": "해성화학",
     "part": "커넥터 하우징",
     "type": "도금 박리",
     "qty": 30,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8j",
     "date": "2025-08-28",
     "kind": "입고",
     "line": "",
     "vendor": "유성정밀",
     "part": "도어 트림",
     "type": "치수 불량",
     "qty": 5,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8k",
     "date": "2025-08-01",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 7,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8l",
     "date": "2025-08-08",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 74,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8m",
     "date": "2025-08-01",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 11,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8n",
     "date": "2025-09-22",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 6,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8o",
     "date": "2025-09-23",
     "kind": "입고",
     "line": "",
     "vendor": "대성정밀",
     "part": "커넥터 하우징",
     "type": "사출 미성형",
     "qty": 8,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8p",
     "date": "2025-09-18",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 10,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8q",
     "date": "2025-09-07",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "오조립·누락",
     "qty": 44,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8r",
     "date": "2025-09-11",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "사출 수축",
     "qty": 5,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8s",
     "date": "2025-09-25",
     "kind": "입고",
     "line": "",
     "vendor": "한빛고무",
     "part": "암레스트",
     "type": "도금 박리",
     "qty": 1,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8t",
     "date": "2025-09-04",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 10,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8u",
     "date": "2025-09-20",
     "kind": "입고",
     "line": "",
     "vendor": "태광산업",
     "part": "배터리 트레이",
     "type": "외관 (스크래치·찍힘)",
     "qty": 5,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8v",
     "date": "2025-09-28",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 34,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8w",
     "date": "2025-09-15",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 4,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8x",
     "date": "2025-09-12",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "사출 수축",
     "qty": 30,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8y",
     "date": "2025-09-27",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 36,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g8z",
     "date": "2025-09-18",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 27,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g90",
     "date": "2025-09-22",
     "kind": "입고",
     "line": "",
     "vendor": "우진금속",
     "part": "테일게이트 힌지",
     "type": "사출 미성형",
     "qty": 119,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g91",
     "date": "2025-09-05",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 2,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g92",
     "date": "2025-09-22",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 2,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g93",
     "date": "2025-09-20",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "사출 수축",
     "qty": 5,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g94",
     "date": "2025-09-21",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "사출 미성형",
     "qty": 40,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g95",
     "date": "2025-09-23",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "외관 (스크래치·찍힘)",
     "qty": 21,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g96",
     "date": "2025-09-13",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 89,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g97",
     "date": "2025-09-03",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "오조립·누락",
     "qty": 23,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g98",
     "date": "2025-09-09",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "도어래치 ASSY",
     "type": "사출 미성형",
     "qty": 6,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g99",
     "date": "2025-09-01",
     "kind": "입고",
     "line": "",
     "vendor": "우진금속",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 9,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9a",
     "date": "2025-09-16",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "배터리 트레이",
     "type": "외관 (스크래치·찍힘)",
     "qty": 6,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9b",
     "date": "2025-09-09",
     "kind": "입고",
     "line": "",
     "vendor": "한라부품",
     "part": "시트프레임",
     "type": "도금 박리",
     "qty": 4,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9c",
     "date": "2025-10-06",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 27,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9d",
     "date": "2025-10-22",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "작동 불량",
     "qty": 10,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9e",
     "date": "2025-10-27",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 12,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9f",
     "date": "2025-10-23",
     "kind": "입고",
     "line": "",
     "vendor": "태광산업",
     "part": "브라켓 BRK-1830",
     "type": "사출 미성형",
     "qty": 32,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9g",
     "date": "2025-10-16",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "외관 (스크래치·찍힘)",
     "qty": 7,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9h",
     "date": "2025-10-03",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 9,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9i",
     "date": "2025-10-21",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "오조립·누락",
     "qty": 5,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9j",
     "date": "2025-10-07",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "작동 불량",
     "qty": 12,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9k",
     "date": "2025-10-21",
     "kind": "출하",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "오조립·누락",
     "qty": 29,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9l",
     "date": "2025-10-01",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "오조립·누락",
     "qty": 19,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9m",
     "date": "2025-10-17",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "사출 수축",
     "qty": 77,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9n",
     "date": "2025-10-19",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "오조립·누락",
     "qty": 6,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9o",
     "date": "2025-10-02",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "체결 불량",
     "qty": 13,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9p",
     "date": "2025-10-13",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 미성형",
     "qty": 11,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9q",
     "date": "2025-10-20",
     "kind": "입고",
     "line": "",
     "vendor": "미래사출",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9r",
     "date": "2025-10-08",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 107,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9s",
     "date": "2025-10-09",
     "kind": "입고",
     "line": "",
     "vendor": "태광산업",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 76,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9t",
     "date": "2025-10-20",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 67,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9u",
     "date": "2025-10-25",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 38,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9v",
     "date": "2025-10-26",
     "kind": "입고",
     "line": "",
     "vendor": "태광산업",
     "part": "범퍼 빔",
     "type": "외관 (스크래치·찍힘)",
     "qty": 33,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9w",
     "date": "2025-10-14",
     "kind": "입고",
     "line": "",
     "vendor": "대성정밀",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 39,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9x",
     "date": "2025-10-29",
     "kind": "입고",
     "line": "",
     "vendor": "유성정밀",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 9,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9y",
     "date": "2025-11-07",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "배터리 트레이",
     "type": "사출 미성형",
     "qty": 7,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10g9z",
     "date": "2025-11-30",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 5,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ga0",
     "date": "2025-11-27",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "사출 미성형",
     "qty": 72,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ga1",
     "date": "2025-11-03",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 8,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ga2",
     "date": "2025-11-15",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 강도 미달",
     "qty": 26,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ga3",
     "date": "2025-11-08",
     "kind": "입고",
     "line": "",
     "vendor": "우진금속",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 3,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ga4",
     "date": "2025-11-09",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "체결 불량",
     "qty": 7,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ga5",
     "date": "2025-11-07",
     "kind": "입고",
     "line": "",
     "vendor": "태광산업",
     "part": "글로브박스",
     "type": "사출 미성형",
     "qty": 7,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ga6",
     "date": "2025-11-01",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "체결 불량",
     "qty": 29,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ga7",
     "date": "2025-11-11",
     "kind": "입고",
     "line": "",
     "vendor": "해성화학",
     "part": "커넥터 하우징",
     "type": "치수 불량",
     "qty": 25,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ga8",
     "date": "2025-11-01",
     "kind": "입고",
     "line": "",
     "vendor": "세화테크",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 21,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ga9",
     "date": "2025-11-04",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 강도 미달",
     "qty": 24,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gaa",
     "date": "2025-11-23",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "오조립·누락",
     "qty": 83,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gab",
     "date": "2025-11-11",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 8,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gac",
     "date": "2025-11-10",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 33,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gad",
     "date": "2025-11-11",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 4,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gae",
     "date": "2025-11-07",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 79,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gaf",
     "date": "2025-11-26",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 35,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gag",
     "date": "2025-11-19",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "오조립·누락",
     "qty": 1,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gah",
     "date": "2025-11-24",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 7,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gai",
     "date": "2025-11-19",
     "kind": "입고",
     "line": "",
     "vendor": "우진금속",
     "part": "브라켓 BRK-1830",
     "type": "이종 부품 혼입",
     "qty": 72,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gaj",
     "date": "2025-11-09",
     "kind": "입고",
     "line": "",
     "vendor": "동양도금",
     "part": "범퍼 빔",
     "type": "외관 (스크래치·찍힘)",
     "qty": 7,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gak",
     "date": "2025-11-30",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "체결 불량",
     "qty": 86,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gal",
     "date": "2025-11-25",
     "kind": "입고",
     "line": "",
     "vendor": "경일산업",
     "part": "테일게이트 힌지",
     "type": "도금 박리",
     "qty": 67,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gam",
     "date": "2025-12-25",
     "kind": "입고",
     "line": "",
     "vendor": "해성화학",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 28,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gan",
     "date": "2025-12-13",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "체결 불량",
     "qty": 3,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gao",
     "date": "2025-12-01",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 강도 미달",
     "qty": 24,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gap",
     "date": "2025-12-25",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gaq",
     "date": "2025-12-21",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 3,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gar",
     "date": "2025-12-29",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 5,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gas",
     "date": "2025-12-29",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "오조립·누락",
     "qty": 31,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gat",
     "date": "2025-12-25",
     "kind": "입고",
     "line": "",
     "vendor": "진영테크",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 32,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gau",
     "date": "2025-12-20",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 1,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gav",
     "date": "2025-12-08",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "오조립·누락",
     "qty": 9,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gaw",
     "date": "2025-12-16",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "외관 (스크래치·찍힘)",
     "qty": 8,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gax",
     "date": "2025-12-15",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "힌지 ASSY",
     "type": "도금 박리",
     "qty": 2,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gay",
     "date": "2025-12-18",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "외관 (스크래치·찍힘)",
     "qty": 14,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gaz",
     "date": "2025-12-21",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 강도 미달",
     "qty": 17,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gb0",
     "date": "2025-12-28",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "오조립·누락",
     "qty": 103,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gb1",
     "date": "2025-12-19",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 수축",
     "qty": 6,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gb2",
     "date": "2025-12-31",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "사출 수축",
     "qty": 2,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gb3",
     "date": "2025-12-31",
     "kind": "입고",
     "line": "",
     "vendor": "세화테크",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 37,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gb4",
     "date": "2025-12-07",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 4,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gb5",
     "date": "2025-12-15",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 15,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gb6",
     "date": "2025-12-21",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 12,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gb7",
     "date": "2025-12-20",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "체결 불량",
     "qty": 15,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gb8",
     "date": "2025-12-20",
     "kind": "입고",
     "line": "",
     "vendor": "성원전자",
     "part": "콘솔 커버",
     "type": "이종 부품 혼입",
     "qty": 3,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gb9",
     "date": "2025-12-10",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 8,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gba",
     "date": "2025-12-22",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 11,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbb",
     "date": "2026-01-02",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 5,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbc",
     "date": "2026-01-19",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 5,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbd",
     "date": "2026-01-30",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 4,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbe",
     "date": "2026-01-26",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 2,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbf",
     "date": "2026-01-23",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "체결 불량",
     "qty": 2,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbg",
     "date": "2026-01-15",
     "kind": "입고",
     "line": "",
     "vendor": "우진금속",
     "part": "테일게이트 힌지",
     "type": "사출 미성형",
     "qty": 24,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbh",
     "date": "2026-01-09",
     "kind": "입고",
     "line": "",
     "vendor": "우진금속",
     "part": "시트프레임",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbi",
     "date": "2026-01-07",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 1,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbj",
     "date": "2026-01-16",
     "kind": "입고",
     "line": "",
     "vendor": "태광산업",
     "part": "암레스트",
     "type": "사출 미성형",
     "qty": 22,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbk",
     "date": "2026-01-24",
     "kind": "출하",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "오조립·누락",
     "qty": 8,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbl",
     "date": "2026-01-15",
     "kind": "입고",
     "line": "",
     "vendor": "한라부품",
     "part": "암레스트",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbm",
     "date": "2026-01-24",
     "kind": "입고",
     "line": "",
     "vendor": "성원전자",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 8,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbn",
     "date": "2026-01-25",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "작동 불량",
     "qty": 8,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbo",
     "date": "2026-01-30",
     "kind": "출하",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 30,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbp",
     "date": "2026-01-05",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 10,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbq",
     "date": "2026-01-27",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 8,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbr",
     "date": "2026-01-26",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 4,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbs",
     "date": "2026-01-19",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 강도 미달",
     "qty": 33,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbt",
     "date": "2026-02-23",
     "kind": "출하",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 2,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbu",
     "date": "2026-02-15",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "작동 불량",
     "qty": 10,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbv",
     "date": "2026-02-01",
     "kind": "입고",
     "line": "",
     "vendor": "진영테크",
     "part": "범퍼 빔",
     "type": "외관 (스크래치·찍힘)",
     "qty": 1,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbw",
     "date": "2026-02-15",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "작동 불량",
     "qty": 3,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbx",
     "date": "2026-02-15",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 8,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gby",
     "date": "2026-02-26",
     "kind": "입고",
     "line": "",
     "vendor": "해성화학",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 11,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gbz",
     "date": "2026-02-16",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 25,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gc0",
     "date": "2026-02-12",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 7,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gc1",
     "date": "2026-02-05",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 14,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gc2",
     "date": "2026-02-08",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 2,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gc3",
     "date": "2026-02-09",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 8,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gc4",
     "date": "2026-02-24",
     "kind": "입고",
     "line": "",
     "vendor": "한라부품",
     "part": "도어래치 ASSY",
     "type": "도금 박리",
     "qty": 3,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gc5",
     "date": "2026-02-16",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 수축",
     "qty": 27,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gc6",
     "date": "2026-02-23",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 미성형",
     "qty": 1,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gc7",
     "date": "2026-02-04",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "사출 미성형",
     "qty": 3,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gc8",
     "date": "2026-02-03",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 105,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gc9",
     "date": "2026-02-27",
     "kind": "출하",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "오조립·누락",
     "qty": 77,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gca",
     "date": "2026-02-20",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 미성형",
     "qty": 5,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcb",
     "date": "2026-03-29",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 수축",
     "qty": 31,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcc",
     "date": "2026-03-15",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 6,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcd",
     "date": "2026-03-30",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "콘솔 커버",
     "type": "외관 (스크래치·찍힘)",
     "qty": 7,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gce",
     "date": "2026-03-20",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 5,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcf",
     "date": "2026-03-29",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "오조립·누락",
     "qty": 8,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcg",
     "date": "2026-03-09",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "작동 불량",
     "qty": 38,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gch",
     "date": "2026-03-18",
     "kind": "입고",
     "line": "",
     "vendor": "해성화학",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 36,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gci",
     "date": "2026-03-01",
     "kind": "입고",
     "line": "",
     "vendor": "세화테크",
     "part": "콘솔 커버",
     "type": "치수 불량",
     "qty": 104,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcj",
     "date": "2026-03-27",
     "kind": "출하",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 37,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gck",
     "date": "2026-03-09",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 2,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcl",
     "date": "2026-03-15",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 55,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcm",
     "date": "2026-03-27",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "작동 불량",
     "qty": 4,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcn",
     "date": "2026-03-02",
     "kind": "입고",
     "line": "",
     "vendor": "유성정밀",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 23,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gco",
     "date": "2026-03-07",
     "kind": "입고",
     "line": "",
     "vendor": "성원전자",
     "part": "리어 브라켓",
     "type": "도금 박리",
     "qty": 4,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcp",
     "date": "2026-03-31",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 2,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcq",
     "date": "2026-03-29",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 8,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcr",
     "date": "2026-03-26",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "오조립·누락",
     "qty": 36,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcs",
     "date": "2026-03-09",
     "kind": "입고",
     "line": "",
     "vendor": "진영테크",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 22,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gct",
     "date": "2026-03-16",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 13,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcu",
     "date": "2026-04-20",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 34,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcv",
     "date": "2026-04-09",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 2,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcw",
     "date": "2026-04-06",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 17,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcx",
     "date": "2026-04-26",
     "kind": "입고",
     "line": "",
     "vendor": "대성정밀",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 35,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcy",
     "date": "2026-04-05",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 9,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gcz",
     "date": "2026-04-13",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 수축",
     "qty": 2,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gd0",
     "date": "2026-04-29",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "오조립·누락",
     "qty": 4,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gd1",
     "date": "2026-04-01",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 미성형",
     "qty": 23,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gd2",
     "date": "2026-04-27",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "작동 불량",
     "qty": 10,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gd3",
     "date": "2026-04-13",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "치수 불량",
     "qty": 30,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gd4",
     "date": "2026-04-02",
     "kind": "출하",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 2,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gd5",
     "date": "2026-04-29",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "커넥터 하우징",
     "type": "이종 부품 혼입",
     "qty": 3,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gd6",
     "date": "2026-04-26",
     "kind": "입고",
     "line": "",
     "vendor": "미래사출",
     "part": "콘솔 커버",
     "type": "치수 불량",
     "qty": 19,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gd7",
     "date": "2026-04-07",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "오조립·누락",
     "qty": 4,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gd8",
     "date": "2026-04-05",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "힌지 ASSY",
     "type": "도금 박리",
     "qty": 3,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gd9",
     "date": "2026-04-02",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 33,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gda",
     "date": "2026-04-15",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 7,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdb",
     "date": "2026-04-06",
     "kind": "입고",
     "line": "",
     "vendor": "동양도금",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 8,
     "action": "전수 선별",
     "status": "완료",
     "files": [
      {
       "name": "커넥터 하우징 외관 (스크래치·찍힘).svg",
       "path": "files/defects/260406-r10gdb-커넥터 하우징 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1578,
       "at": "2026-04-06"
      }
     ]
    },
    {
     "id": "r10gdc",
     "date": "2026-04-28",
     "kind": "입고",
     "line": "",
     "vendor": "태광산업",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 8,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdd",
     "date": "2026-04-29",
     "kind": "출하",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "체결 불량",
     "qty": 110,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gde",
     "date": "2026-05-07",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 2,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdf",
     "date": "2026-05-27",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 4,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdg",
     "date": "2026-05-05",
     "kind": "입고",
     "line": "",
     "vendor": "진영테크",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 29,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdh",
     "date": "2026-05-12",
     "kind": "출하",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 스패터",
     "qty": 10,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdi",
     "date": "2026-05-03",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 7,
     "action": "작업자 재교육",
     "status": "완료",
     "files": [
      {
       "name": "커넥터 하우징 외관 (스크래치·찍힘).svg",
       "path": "files/defects/260503-r10gdi-커넥터 하우징 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1578,
       "at": "2026-05-03"
      }
     ]
    },
    {
     "id": "r10gdj",
     "date": "2026-05-16",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 19,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdk",
     "date": "2026-05-19",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 1,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdl",
     "date": "2026-05-27",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 강도 미달",
     "qty": 4,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdm",
     "date": "2026-05-10",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "체결 불량",
     "qty": 35,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdn",
     "date": "2026-05-26",
     "kind": "입고",
     "line": "",
     "vendor": "대명오토",
     "part": "도어래치 ASSY",
     "type": "도금 박리",
     "qty": 5,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdo",
     "date": "2026-05-04",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "체결 불량",
     "qty": 10,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdp",
     "date": "2026-05-12",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 72,
     "action": "협력사 반품",
     "status": "완료",
     "files": [
      {
       "name": "브라켓 BRK-1830 외관 (스크래치·찍힘).svg",
       "path": "files/defects/260512-r10gdp-브라켓 BRK-1830 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1577,
       "at": "2026-05-12"
      }
     ]
    },
    {
     "id": "r10gdq",
     "date": "2026-05-27",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 수축",
     "qty": 29,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdr",
     "date": "2026-05-08",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 98,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gds",
     "date": "2026-05-25",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 30,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdt",
     "date": "2026-05-16",
     "kind": "입고",
     "line": "",
     "vendor": "미래사출",
     "part": "시트프레임",
     "type": "치수 불량",
     "qty": 3,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdu",
     "date": "2026-05-27",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 87,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdv",
     "date": "2026-05-07",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "작동 불량",
     "qty": 81,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdw",
     "date": "2026-05-01",
     "kind": "입고",
     "line": "",
     "vendor": "대성정밀",
     "part": "배터리 트레이",
     "type": "외관 (스크래치·찍힘)",
     "qty": 10,
     "action": "전수 선별",
     "status": "완료",
     "files": [
      {
       "name": "배터리 트레이 외관 (스크래치·찍힘).svg",
       "path": "files/defects/260501-r10gdw-배터리 트레이 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1578,
       "at": "2026-05-01"
      }
     ]
    },
    {
     "id": "r10gdx",
     "date": "2026-05-19",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 강도 미달",
     "qty": 4,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdy",
     "date": "2026-05-24",
     "kind": "입고",
     "line": "",
     "vendor": "진영테크",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 8,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gdz",
     "date": "2026-05-22",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "체결 불량",
     "qty": 7,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ge0",
     "date": "2026-05-17",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 미성형",
     "qty": 3,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ge1",
     "date": "2026-05-09",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 53,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ge2",
     "date": "2026-06-16",
     "kind": "입고",
     "line": "",
     "vendor": "유성정밀",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 24,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ge3",
     "date": "2026-06-28",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 강도 미달",
     "qty": 7,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": [
      {
       "name": "배터리 트레이 용접 강도 미달.svg",
       "path": "files/defects/260628-r10ge3-배터리 트레이 용접 강도 미달.svg",
       "type": "image/svg+xml",
       "size": 1541,
       "at": "2026-06-28"
      }
     ]
    },
    {
     "id": "r10ge4",
     "date": "2026-06-15",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 10,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ge5",
     "date": "2026-06-27",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 33,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ge6",
     "date": "2026-06-26",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "오조립·누락",
     "qty": 5,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ge7",
     "date": "2026-06-02",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "외관 (스크래치·찍힘)",
     "qty": 4,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ge8",
     "date": "2026-06-02",
     "kind": "입고",
     "line": "",
     "vendor": "진영테크",
     "part": "글로브박스",
     "type": "치수 불량",
     "qty": 118,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ge9",
     "date": "2026-06-07",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 30,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gea",
     "date": "2026-06-07",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 7,
     "action": "금형 수정",
     "status": "완료",
     "files": [
      {
       "name": "글로브박스 외관 (스크래치·찍힘).svg",
       "path": "files/defects/260607-r10gea-글로브박스 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1574,
       "at": "2026-06-07"
      }
     ]
    },
    {
     "id": "r10geb",
     "date": "2026-06-18",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 4,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gec",
     "date": "2026-06-15",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 38,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ged",
     "date": "2026-06-18",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 8,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gee",
     "date": "2026-06-02",
     "kind": "입고",
     "line": "",
     "vendor": "삼진프레스",
     "part": "스티어링 브라켓",
     "type": "이종 부품 혼입",
     "qty": 8,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gef",
     "date": "2026-06-25",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 미성형",
     "qty": 8,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10geg",
     "date": "2026-06-26",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 9,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10geh",
     "date": "2026-06-30",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 스패터",
     "qty": 12,
     "action": "폐기",
     "status": "완료",
     "files": [
      {
       "name": "배터리 트레이 용접 스패터.svg",
       "path": "files/defects/260630-r10geh-배터리 트레이 용접 스패터.svg",
       "type": "image/svg+xml",
       "size": 2328,
       "at": "2026-06-30"
      }
     ]
    },
    {
     "id": "r10gei",
     "date": "2026-06-25",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 12,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gej",
     "date": "2026-06-14",
     "kind": "입고",
     "line": "",
     "vendor": "대성정밀",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 6,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gek",
     "date": "2026-06-26",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 84,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gel",
     "date": "2026-06-19",
     "kind": "입고",
     "line": "",
     "vendor": "태광산업",
     "part": "시트프레임",
     "type": "도금 박리",
     "qty": 10,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gem",
     "date": "2026-06-10",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gen",
     "date": "2026-06-06",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 6,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10geo",
     "date": "2026-06-19",
     "kind": "입고",
     "line": "",
     "vendor": "해성화학",
     "part": "콘솔 커버",
     "type": "외관 (스크래치·찍힘)",
     "qty": 10,
     "action": "폐기",
     "status": "완료",
     "files": [
      {
       "name": "콘솔 커버 외관 (스크래치·찍힘).svg",
       "path": "files/defects/260619-r10geo-콘솔 커버 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1572,
       "at": "2026-06-19"
      }
     ]
    },
    {
     "id": "r10gep",
     "date": "2026-07-15",
     "kind": "입고",
     "line": "",
     "vendor": "미래사출",
     "part": "도어래치 ASSY",
     "type": "도금 박리",
     "qty": 2,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10geq",
     "date": "2026-07-08",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 7,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ger",
     "date": "2026-07-11",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "작동 불량",
     "qty": 21,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ges",
     "date": "2026-07-14",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 80,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10get",
     "date": "2026-07-03",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "사출 미성형",
     "qty": 16,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10geu",
     "date": "2026-07-02",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 101,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gev",
     "date": "2026-07-22",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 37,
     "action": "전수 선별",
     "status": "완료",
     "files": [
      {
       "name": "힌지 ASSY 외관 (스크래치·찍힘).svg",
       "path": "files/defects/260722-r10gev-힌지 ASSY 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1570,
       "at": "2026-07-22"
      }
     ]
    },
    {
     "id": "r10gew",
     "date": "2026-07-05",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "작동 불량",
     "qty": 8,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gex",
     "date": "2026-07-18",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 미성형",
     "qty": 8,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gey",
     "date": "2026-07-21",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "외관 (스크래치·찍힘)",
     "qty": 10,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gez",
     "date": "2026-07-18",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 86,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gf0",
     "date": "2026-07-27",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 5,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gf1",
     "date": "2026-07-21",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "사출 수축",
     "qty": 22,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gf2",
     "date": "2026-07-14",
     "kind": "입고",
     "line": "",
     "vendor": "해성화학",
     "part": "글로브박스",
     "type": "사출 미성형",
     "qty": 8,
     "action": "지그 보정",
     "status": "완료",
     "files": [
      {
       "name": "글로브박스 사출 미성형.svg",
       "path": "files/defects/260714-r10gf2-글로브박스 사출 미성형.svg",
       "type": "image/svg+xml",
       "size": 1533,
       "at": "2026-07-14"
      }
     ]
    },
    {
     "id": "r10gf3",
     "date": "2026-07-28",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "사출 미성형",
     "qty": 8,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gf4",
     "date": "2026-07-13",
     "kind": "출하",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 39,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gf5",
     "date": "2026-07-04",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "치수 불량",
     "qty": 97,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gf6",
     "date": "2026-07-10",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "치수 불량",
     "qty": 1,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gf7",
     "date": "2026-07-18",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 미성형",
     "qty": 2,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gf8",
     "date": "2026-07-17",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 13,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gf9",
     "date": "2026-07-28",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 수축",
     "qty": 2,
     "action": "작업자 재교육",
     "status": "완료",
     "files": [
      {
       "name": "도어 트림 사출 수축.svg",
       "path": "files/defects/260728-r10gf9-도어 트림 사출 수축.svg",
       "type": "image/svg+xml",
       "size": 1535,
       "at": "2026-07-28"
      }
     ]
    },
    {
     "id": "r10gfa",
     "date": "2026-07-26",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "type": "용접 강도 미달",
     "qty": 33,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfb",
     "date": "2026-07-16",
     "kind": "출하",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "type": "오조립·누락",
     "qty": 10,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfc",
     "date": "2026-08-06",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfd",
     "date": "2026-08-31",
     "kind": "입고",
     "line": "",
     "vendor": "한라부품",
     "part": "힌지 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 7,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfe",
     "date": "2026-08-26",
     "kind": "출하",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "오조립·누락",
     "qty": 7,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gff",
     "date": "2026-08-28",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 5,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfg",
     "date": "2026-08-07",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "오조립·누락",
     "qty": 32,
     "action": "조건 재설정",
     "status": "완료",
     "files": [
      {
       "name": "브라켓 BRK-1830 오조립·누락.svg",
       "path": "files/defects/260807-r10gfg-브라켓 BRK-1830 오조립·누락.svg",
       "type": "image/svg+xml",
       "size": 1537,
       "at": "2026-08-07"
      }
     ]
    },
    {
     "id": "r10gfh",
     "date": "2026-08-05",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 8,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfi",
     "date": "2026-08-06",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "체결 불량",
     "qty": 37,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfj",
     "date": "2026-08-22",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "type": "외관 (스크래치·찍힘)",
     "qty": 7,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfk",
     "date": "2026-08-05",
     "kind": "출하",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "치수 불량",
     "qty": 32,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfl",
     "date": "2026-08-10",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "type": "오조립·누락",
     "qty": 5,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfm",
     "date": "2026-08-08",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 미성형",
     "qty": 72,
     "action": "전수 선별",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfn",
     "date": "2026-08-10",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 3,
     "action": "조건 재설정",
     "status": "완료",
     "files": [
      {
       "name": "도어 트림 외관 (스크래치·찍힘).svg",
       "path": "files/defects/260810-r10gfn-도어 트림 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1572,
       "at": "2026-08-10"
      }
     ]
    },
    {
     "id": "r10gfo",
     "date": "2026-08-31",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "체결 불량",
     "qty": 2,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfp",
     "date": "2026-08-12",
     "kind": "입고",
     "line": "",
     "vendor": "성원전자",
     "part": "도어 트림",
     "type": "외관 (스크래치·찍힘)",
     "qty": 73,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfq",
     "date": "2026-08-20",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "외관 (스크래치·찍힘)",
     "qty": 6,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfr",
     "date": "2026-08-03",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 21,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfs",
     "date": "2026-08-12",
     "kind": "입고",
     "line": "",
     "vendor": "대성정밀",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 31,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gft",
     "date": "2026-08-30",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 미성형",
     "qty": 22,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfu",
     "date": "2026-08-09",
     "kind": "입고",
     "line": "",
     "vendor": "우진금속",
     "part": "브라켓 BRK-1830",
     "type": "외관 (스크래치·찍힘)",
     "qty": 82,
     "action": "폐기",
     "status": "완료",
     "files": [
      {
       "name": "브라켓 BRK-1830 외관 (스크래치·찍힘).svg",
       "path": "files/defects/260809-r10gfu-브라켓 BRK-1830 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1577,
       "at": "2026-08-09"
      }
     ]
    },
    {
     "id": "r10gfv",
     "date": "2026-09-22",
     "kind": "입고",
     "line": "",
     "vendor": "동양도금",
     "part": "도어 트림",
     "type": "치수 불량",
     "qty": 19,
     "action": "지그 보정",
     "status": "조치중",
     "files": []
    },
    {
     "id": "r10gfw",
     "date": "2026-09-29",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 15,
     "action": "협력사 반품",
     "status": "조치중",
     "files": []
    },
    {
     "id": "r10gfx",
     "date": "2026-09-10",
     "kind": "입고",
     "line": "",
     "vendor": "신흥정공",
     "part": "테일게이트 힌지",
     "type": "도금 박리",
     "qty": 2,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfy",
     "date": "2026-09-26",
     "kind": "입고",
     "line": "",
     "vendor": "우진금속",
     "part": "리어 브라켓",
     "type": "사출 미성형",
     "qty": 2,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gfz",
     "date": "2026-09-30",
     "kind": "공정",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 20,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gg0",
     "date": "2026-09-05",
     "kind": "입고",
     "line": "",
     "vendor": "세화테크",
     "part": "커넥터 하우징",
     "type": "도금 박리",
     "qty": 38,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gg1",
     "date": "2026-09-26",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "외관 (스크래치·찍힘)",
     "qty": 38,
     "action": "선별 후 재작업",
     "status": "조치중",
     "files": [
      {
       "name": "글로브박스 외관 (스크래치·찍힘).svg",
       "path": "files/defects/260926-r10gg1-글로브박스 외관 (스크래치·찍힘).svg",
       "type": "image/svg+xml",
       "size": 1574,
       "at": "2026-09-26"
      }
     ]
    },
    {
     "id": "r10gg2",
     "date": "2026-09-05",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 미성형",
     "qty": 50,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gg3",
     "date": "2026-09-26",
     "kind": "공정",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "작동 불량",
     "qty": 27,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gg4",
     "date": "2026-09-11",
     "kind": "출하",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "치수 불량",
     "qty": 33,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gg5",
     "date": "2026-09-22",
     "kind": "출하",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "치수 불량",
     "qty": 4,
     "action": "폐기",
     "status": "조치중",
     "files": []
    },
    {
     "id": "r10gg6",
     "date": "2026-09-02",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "type": "치수 불량",
     "qty": 8,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gg7",
     "date": "2026-09-12",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 수축",
     "qty": 6,
     "action": "지그 보정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gg8",
     "date": "2026-09-27",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "type": "용접 스패터",
     "qty": 20,
     "action": "금형 수정",
     "status": "조치중",
     "files": [
      {
       "name": "범퍼 빔 용접 스패터.svg",
       "path": "files/defects/260927-r10gg8-범퍼 빔 용접 스패터.svg",
       "type": "image/svg+xml",
       "size": 2319,
       "at": "2026-09-27"
      }
     ]
    },
    {
     "id": "r10gg9",
     "date": "2026-09-30",
     "kind": "공정",
     "line": "용접 2",
     "vendor": "",
     "part": [
      "배터리 트레이",
      "리어 브라켓"
     ],
     "type": "용접 스패터",
     "qty": 9,
     "action": "금형 수정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gga",
     "date": "2026-09-18",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "사출 수축",
     "qty": 30,
     "action": "협력사 반품",
     "status": "조치중",
     "files": []
    },
    {
     "id": "r10ggb",
     "date": "2026-09-06",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "type": "사출 미성형",
     "qty": 1,
     "action": "협력사 반품",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ggc",
     "date": "2026-09-03",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "type": "사출 수축",
     "qty": 27,
     "action": "작업자 재교육",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ggd",
     "date": "2026-09-28",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "type": "체결 불량",
     "qty": 38,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10gge",
     "date": "2026-09-24",
     "kind": "공정",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "type": "외관 (스크래치·찍힘)",
     "qty": 10,
     "action": "폐기",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ggf",
     "date": "2026-09-10",
     "kind": "공정",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "type": "용접 강도 미달",
     "qty": 10,
     "action": "지그 보정",
     "status": "완료",
     "files": [
      {
       "name": "배터리 트레이 용접 강도 미달.svg",
       "path": "files/defects/260910-r10ggf-배터리 트레이 용접 강도 미달.svg",
       "type": "image/svg+xml",
       "size": 1541,
       "at": "2026-09-10"
      }
     ]
    },
    {
     "id": "r10ggg",
     "date": "2026-09-19",
     "kind": "입고",
     "line": "",
     "vendor": "우진금속",
     "part": "스티어링 브라켓",
     "type": "이종 부품 혼입",
     "qty": 8,
     "action": "작업자 재교육",
     "status": "조치중",
     "files": []
    },
    {
     "id": "r10ggh",
     "date": "2026-09-18",
     "kind": "입고",
     "line": "",
     "vendor": "해성화학",
     "part": "글로브박스",
     "type": "이종 부품 혼입",
     "qty": 10,
     "action": "선별 후 재작업",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ggi",
     "date": "2026-10-07",
     "kind": "출하",
     "line": "용접 2",
     "vendor": "",
     "part": [
      "배터리 트레이",
      "도어래치 ASSY"
     ],
     "type": "용접 스패터",
     "qty": 10,
     "action": "금형 수정",
     "status": "조치중",
     "files": []
    },
    {
     "id": "r10ggj",
     "date": "2026-10-06",
     "kind": "공정",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "type": "사출 미성형",
     "qty": 30,
     "action": "전수 선별",
     "status": "조치중",
     "files": []
    },
    {
     "id": "r10ggk",
     "date": "2026-10-06",
     "kind": "입고",
     "line": "",
     "vendor": "세화테크",
     "part": "글로브박스",
     "type": "이종 부품 혼입",
     "qty": 2,
     "action": "지그 보정",
     "status": "조치중",
     "files": []
    },
    {
     "id": "r10ggl",
     "date": "2026-10-07",
     "kind": "공정",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "type": "오조립·누락",
     "qty": 104,
     "action": "조건 재설정",
     "status": "완료",
     "files": []
    },
    {
     "id": "r10ggm",
     "date": "2026-10-06",
     "kind": "출하",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "type": "사출 수축",
     "qty": 26,
     "action": "작업자 재교육",
     "status": "조치중",
     "files": [
      {
       "name": "도어 트림 사출 수축.svg",
       "path": "files/defects/261006-r10ggm-도어 트림 사출 수축.svg",
       "type": "image/svg+xml",
       "size": 1535,
       "at": "2026-10-06"
      }
     ]
    }
   ],
   "views": [
    {
     "id": "v-line",
     "name": "라인별 (최근 90일)",
     "f": [
      {
       "f": "date",
       "k": "date",
       "preset": "last90"
      }
     ],
     "q": "",
     "sortK": "date",
     "asc": false,
     "group": "line",
     "hide": []
    },
    {
     "id": "v-in",
     "name": "입고 불량",
     "f": [
      {
       "f": "kind",
       "k": "pick",
       "v": [
        "입고"
       ]
      }
     ],
     "q": "",
     "sortK": "date",
     "asc": false,
     "group": "vendor",
     "hide": []
    }
   ]
  },
  {
   "id": "inspections",
   "name": "검사 실적",
   "desc": "수입·공정·출하 검사 로트별 검사 수량과 불량 수량입니다.",
   "dateField": "date",
   "titleField": "part",
   "fields": [
    {
     "key": "date",
     "label": "검사일",
     "type": "date",
     "req": true
    },
    {
     "key": "kind",
     "label": "검사 구분",
     "type": "select",
     "options": [
      "수입검사",
      "공정검사",
      "출하검사"
     ],
     "req": true
    },
    {
     "key": "line",
     "label": "라인",
     "type": "ref",
     "ref": "lines"
    },
    {
     "key": "vendor",
     "label": "협력사",
     "type": "ref",
     "ref": "vendors"
    },
    {
     "key": "part",
     "label": "부품",
     "type": "ref",
     "ref": "parts"
    },
    {
     "key": "inspected",
     "label": "검사 수량",
     "type": "number",
     "req": true
    },
    {
     "key": "defects",
     "label": "불량 수량",
     "type": "number"
    },
    {
     "key": "rate",
     "label": "불량률 (%)",
     "type": "formula",
     "expr": "round({불량 수량} / {검사 수량} * 100, 2)"
    }
   ],
   "records": [
    {
     "id": "r10ggn",
     "date": "2025-01-07",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 1986,
     "defects": 4
    },
    {
     "id": "r10ggo",
     "date": "2025-01-17",
     "kind": "수입검사",
     "line": "",
     "vendor": "동양도금",
     "part": "힌지 ASSY",
     "inspected": 2434,
     "defects": 45
    },
    {
     "id": "r10ggp",
     "date": "2025-01-08",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 641,
     "defects": 2
    },
    {
     "id": "r10ggq",
     "date": "2025-01-01",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 3433,
     "defects": 2
    },
    {
     "id": "r10ggr",
     "date": "2025-01-06",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2130,
     "defects": 30
    },
    {
     "id": "r10ggs",
     "date": "2025-01-04",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "콘솔 커버",
     "inspected": 1846,
     "defects": 7
    },
    {
     "id": "r10ggt",
     "date": "2025-01-15",
     "kind": "수입검사",
     "line": "",
     "vendor": "유성정밀",
     "part": "도어래치 ASSY",
     "inspected": 1499,
     "defects": 10
    },
    {
     "id": "r10ggu",
     "date": "2025-01-08",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 651,
     "defects": 2
    },
    {
     "id": "r10ggv",
     "date": "2025-01-13",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 1304,
     "defects": 2
    },
    {
     "id": "r10ggw",
     "date": "2025-01-27",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 1068,
     "defects": 6
    },
    {
     "id": "r10ggx",
     "date": "2025-01-22",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1813,
     "defects": 6
    },
    {
     "id": "r10ggy",
     "date": "2025-01-31",
     "kind": "출하검사",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 1330,
     "defects": 2
    },
    {
     "id": "r10ggz",
     "date": "2025-01-15",
     "kind": "수입검사",
     "line": "",
     "vendor": "해성화학",
     "part": "브라켓 BRK-1830",
     "inspected": 1580,
     "defects": 6
    },
    {
     "id": "r10gh0",
     "date": "2025-01-22",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 2475,
     "defects": 7
    },
    {
     "id": "r10gh1",
     "date": "2025-01-26",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 1642,
     "defects": 1
    },
    {
     "id": "r10gh2",
     "date": "2025-01-05",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 360,
     "defects": 1
    },
    {
     "id": "r10gh3",
     "date": "2025-01-22",
     "kind": "수입검사",
     "line": "",
     "vendor": "삼진프레스",
     "part": "도어 트림",
     "inspected": 2949,
     "defects": 12
    },
    {
     "id": "r10gh4",
     "date": "2025-01-15",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 494,
     "defects": 1
    },
    {
     "id": "r10gh5",
     "date": "2025-01-14",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 1225,
     "defects": 2
    },
    {
     "id": "r10gh6",
     "date": "2025-01-14",
     "kind": "수입검사",
     "line": "",
     "vendor": "태광산업",
     "part": "힌지 ASSY",
     "inspected": 877,
     "defects": 3
    },
    {
     "id": "r10gh7",
     "date": "2025-01-18",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2395,
     "defects": 3
    },
    {
     "id": "r10gh8",
     "date": "2025-01-16",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1000,
     "defects": 2
    },
    {
     "id": "r10gh9",
     "date": "2025-02-20",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 2680,
     "defects": 6
    },
    {
     "id": "r10gha",
     "date": "2025-02-16",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 1204,
     "defects": 4
    },
    {
     "id": "r10ghb",
     "date": "2025-02-22",
     "kind": "수입검사",
     "line": "",
     "vendor": "진영테크",
     "part": "암레스트",
     "inspected": 1731,
     "defects": 8
    },
    {
     "id": "r10ghc",
     "date": "2025-02-25",
     "kind": "출하검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 810,
     "defects": 5
    },
    {
     "id": "r10ghd",
     "date": "2025-02-18",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 2446,
     "defects": 4
    },
    {
     "id": "r10ghe",
     "date": "2025-02-16",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 2673,
     "defects": 11
    },
    {
     "id": "r10ghf",
     "date": "2025-02-23",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 2364,
     "defects": 7
    },
    {
     "id": "r10ghg",
     "date": "2025-02-18",
     "kind": "수입검사",
     "line": "",
     "vendor": "세화테크",
     "part": "도어 트림",
     "inspected": 2148,
     "defects": 11
    },
    {
     "id": "r10ghh",
     "date": "2025-02-17",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 1189,
     "defects": 1
    },
    {
     "id": "r10ghi",
     "date": "2025-02-07",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 2440,
     "defects": 2
    },
    {
     "id": "r10ghj",
     "date": "2025-02-25",
     "kind": "수입검사",
     "line": "",
     "vendor": "대명오토",
     "part": "스티어링 브라켓",
     "inspected": 2152,
     "defects": 14
    },
    {
     "id": "r10ghk",
     "date": "2025-02-02",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "커넥터 하우징",
     "inspected": 1556,
     "defects": 8
    },
    {
     "id": "r10ghl",
     "date": "2025-02-03",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 1787,
     "defects": 5
    },
    {
     "id": "r10ghm",
     "date": "2025-02-17",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 1671,
     "defects": 3
    },
    {
     "id": "r10ghn",
     "date": "2025-02-22",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2550,
     "defects": 5
    },
    {
     "id": "r10gho",
     "date": "2025-02-16",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 2560,
     "defects": 5
    },
    {
     "id": "r10ghp",
     "date": "2025-02-12",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 1899,
     "defects": 3
    },
    {
     "id": "r10ghq",
     "date": "2025-02-09",
     "kind": "수입검사",
     "line": "",
     "vendor": "유성정밀",
     "part": "콘솔 커버",
     "inspected": 1974,
     "defects": 4
    },
    {
     "id": "r10ghr",
     "date": "2025-02-16",
     "kind": "수입검사",
     "line": "",
     "vendor": "한라부품",
     "part": "브라켓 BRK-1830",
     "inspected": 2296,
     "defects": 10
    },
    {
     "id": "r10ghs",
     "date": "2025-02-01",
     "kind": "수입검사",
     "line": "",
     "vendor": "경일산업",
     "part": "도어 트림",
     "inspected": 1242,
     "defects": 8
    },
    {
     "id": "r10ght",
     "date": "2025-02-17",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 1960,
     "defects": 9
    },
    {
     "id": "r10ghu",
     "date": "2025-02-01",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 2840,
     "defects": 22
    },
    {
     "id": "r10ghv",
     "date": "2025-03-23",
     "kind": "수입검사",
     "line": "",
     "vendor": "삼진프레스",
     "part": "브라켓 BRK-1830",
     "inspected": 1542,
     "defects": 10
    },
    {
     "id": "r10ghw",
     "date": "2025-03-11",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1395,
     "defects": 2
    },
    {
     "id": "r10ghx",
     "date": "2025-03-14",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "배터리 트레이",
     "inspected": 2780,
     "defects": 13
    },
    {
     "id": "r10ghy",
     "date": "2025-03-23",
     "kind": "출하검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 3744,
     "defects": 3
    },
    {
     "id": "r10ghz",
     "date": "2025-03-06",
     "kind": "수입검사",
     "line": "",
     "vendor": "세화테크",
     "part": "도어래치 ASSY",
     "inspected": 2440,
     "defects": 7
    },
    {
     "id": "r10gi0",
     "date": "2025-03-18",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 574,
     "defects": 3
    },
    {
     "id": "r10gi1",
     "date": "2025-03-14",
     "kind": "수입검사",
     "line": "",
     "vendor": "동양도금",
     "part": "도어래치 ASSY",
     "inspected": 1210,
     "defects": 7
    },
    {
     "id": "r10gi2",
     "date": "2025-03-26",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 2587,
     "defects": 8
    },
    {
     "id": "r10gi3",
     "date": "2025-03-13",
     "kind": "수입검사",
     "line": "",
     "vendor": "태광산업",
     "part": "암레스트",
     "inspected": 372,
     "defects": 7
    },
    {
     "id": "r10gi4",
     "date": "2025-03-08",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "커넥터 하우징",
     "inspected": 550,
     "defects": 3
    },
    {
     "id": "r10gi5",
     "date": "2025-03-16",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 1542,
     "defects": 4
    },
    {
     "id": "r10gi6",
     "date": "2025-03-05",
     "kind": "출하검사",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 1202,
     "defects": 2
    },
    {
     "id": "r10gi7",
     "date": "2025-03-18",
     "kind": "수입검사",
     "line": "",
     "vendor": "동양도금",
     "part": "커넥터 하우징",
     "inspected": 2217,
     "defects": 10
    },
    {
     "id": "r10gi8",
     "date": "2025-03-12",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 1809,
     "defects": 8
    },
    {
     "id": "r10gi9",
     "date": "2025-03-13",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 414,
     "defects": 2
    },
    {
     "id": "r10gia",
     "date": "2025-03-16",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 2067,
     "defects": 5
    },
    {
     "id": "r10gib",
     "date": "2025-03-13",
     "kind": "출하검사",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 1742,
     "defects": 3
    },
    {
     "id": "r10gic",
     "date": "2025-03-14",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 334,
     "defects": 1
    },
    {
     "id": "r10gid",
     "date": "2025-03-04",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1279,
     "defects": 6
    },
    {
     "id": "r10gie",
     "date": "2025-03-26",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1064,
     "defects": 2
    },
    {
     "id": "r10gif",
     "date": "2025-03-15",
     "kind": "수입검사",
     "line": "",
     "vendor": "한빛고무",
     "part": "암레스트",
     "inspected": 2955,
     "defects": 19
    },
    {
     "id": "r10gig",
     "date": "2025-03-14",
     "kind": "수입검사",
     "line": "",
     "vendor": "대명오토",
     "part": "배터리 트레이",
     "inspected": 1029,
     "defects": 2
    },
    {
     "id": "r10gih",
     "date": "2025-04-02",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 2833,
     "defects": 5
    },
    {
     "id": "r10gii",
     "date": "2025-04-06",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1287,
     "defects": 3
    },
    {
     "id": "r10gij",
     "date": "2025-04-27",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 2357,
     "defects": 11
    },
    {
     "id": "r10gik",
     "date": "2025-04-03",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 1081,
     "defects": 2
    },
    {
     "id": "r10gil",
     "date": "2025-04-03",
     "kind": "수입검사",
     "line": "",
     "vendor": "유성정밀",
     "part": "커넥터 하우징",
     "inspected": 1603,
     "defects": 7
    },
    {
     "id": "r10gim",
     "date": "2025-04-04",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 2774,
     "defects": 11
    },
    {
     "id": "r10gin",
     "date": "2025-04-22",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1301,
     "defects": 3
    },
    {
     "id": "r10gio",
     "date": "2025-04-20",
     "kind": "수입검사",
     "line": "",
     "vendor": "한라부품",
     "part": "테일게이트 힌지",
     "inspected": 1192,
     "defects": 5
    },
    {
     "id": "r10gip",
     "date": "2025-04-11",
     "kind": "수입검사",
     "line": "",
     "vendor": "세화테크",
     "part": "커넥터 하우징",
     "inspected": 375,
     "defects": 1
    },
    {
     "id": "r10giq",
     "date": "2025-04-21",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 2051,
     "defects": 9
    },
    {
     "id": "r10gir",
     "date": "2025-04-08",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 777,
     "defects": 3
    },
    {
     "id": "r10gis",
     "date": "2025-04-21",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 1203,
     "defects": 5
    },
    {
     "id": "r10git",
     "date": "2025-04-26",
     "kind": "출하검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 1596,
     "defects": 2
    },
    {
     "id": "r10giu",
     "date": "2025-04-08",
     "kind": "수입검사",
     "line": "",
     "vendor": "우진금속",
     "part": "스티어링 브라켓",
     "inspected": 2578,
     "defects": 11
    },
    {
     "id": "r10giv",
     "date": "2025-04-11",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 1913,
     "defects": 11
    },
    {
     "id": "r10giw",
     "date": "2025-04-12",
     "kind": "출하검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1426,
     "defects": 2
    },
    {
     "id": "r10gix",
     "date": "2025-04-16",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1478,
     "defects": 1
    },
    {
     "id": "r10giy",
     "date": "2025-04-19",
     "kind": "수입검사",
     "line": "",
     "vendor": "유성정밀",
     "part": "도어래치 ASSY",
     "inspected": 1138,
     "defects": 3
    },
    {
     "id": "r10giz",
     "date": "2025-04-30",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 1269,
     "defects": 3
    },
    {
     "id": "r10gj0",
     "date": "2025-04-29",
     "kind": "수입검사",
     "line": "",
     "vendor": "동양도금",
     "part": "범퍼 빔",
     "inspected": 1569,
     "defects": 9
    },
    {
     "id": "r10gj1",
     "date": "2025-04-15",
     "kind": "수입검사",
     "line": "",
     "vendor": "진영테크",
     "part": "글로브박스",
     "inspected": 1113,
     "defects": 7
    },
    {
     "id": "r10gj2",
     "date": "2025-04-28",
     "kind": "출하검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 3600,
     "defects": 6
    },
    {
     "id": "r10gj3",
     "date": "2025-05-18",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 594,
     "defects": 3
    },
    {
     "id": "r10gj4",
     "date": "2025-05-09",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 526,
     "defects": 1
    },
    {
     "id": "r10gj5",
     "date": "2025-05-17",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "스티어링 브라켓",
     "inspected": 2453,
     "defects": 44
    },
    {
     "id": "r10gj6",
     "date": "2025-05-23",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "콘솔 커버",
     "inspected": 2679,
     "defects": 16
    },
    {
     "id": "r10gj7",
     "date": "2025-05-07",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 1790,
     "defects": 2
    },
    {
     "id": "r10gj8",
     "date": "2025-05-20",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 1384,
     "defects": 2
    },
    {
     "id": "r10gj9",
     "date": "2025-05-11",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 1911,
     "defects": 4
    },
    {
     "id": "r10gja",
     "date": "2025-05-21",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 3509,
     "defects": 4
    },
    {
     "id": "r10gjb",
     "date": "2025-05-04",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1718,
     "defects": 2
    },
    {
     "id": "r10gjc",
     "date": "2025-05-20",
     "kind": "출하검사",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 3842,
     "defects": 4
    },
    {
     "id": "r10gjd",
     "date": "2025-05-26",
     "kind": "출하검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 1042,
     "defects": 1
    },
    {
     "id": "r10gje",
     "date": "2025-05-30",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "배터리 트레이",
     "inspected": 1696,
     "defects": 7
    },
    {
     "id": "r10gjf",
     "date": "2025-05-23",
     "kind": "수입검사",
     "line": "",
     "vendor": "해성화학",
     "part": "글로브박스",
     "inspected": 2894,
     "defects": 16
    },
    {
     "id": "r10gjg",
     "date": "2025-05-11",
     "kind": "수입검사",
     "line": "",
     "vendor": "삼진프레스",
     "part": "커넥터 하우징",
     "inspected": 1052,
     "defects": 6
    },
    {
     "id": "r10gjh",
     "date": "2025-05-16",
     "kind": "수입검사",
     "line": "",
     "vendor": "해성화학",
     "part": "힌지 ASSY",
     "inspected": 2476,
     "defects": 13
    },
    {
     "id": "r10gji",
     "date": "2025-05-27",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 2211,
     "defects": 2
    },
    {
     "id": "r10gjj",
     "date": "2025-05-10",
     "kind": "수입검사",
     "line": "",
     "vendor": "세화테크",
     "part": "글로브박스",
     "inspected": 2622,
     "defects": 5
    },
    {
     "id": "r10gjk",
     "date": "2025-05-25",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 2213,
     "defects": 5
    },
    {
     "id": "r10gjl",
     "date": "2025-05-30",
     "kind": "출하검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 3680,
     "defects": 18
    },
    {
     "id": "r10gjm",
     "date": "2025-05-21",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 930,
     "defects": 2
    },
    {
     "id": "r10gjn",
     "date": "2025-05-03",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 651,
     "defects": 2
    },
    {
     "id": "r10gjo",
     "date": "2025-05-18",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 925,
     "defects": 1
    },
    {
     "id": "r10gjp",
     "date": "2025-06-26",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 2071,
     "defects": 23
    },
    {
     "id": "r10gjq",
     "date": "2025-06-05",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 887,
     "defects": 3
    },
    {
     "id": "r10gjr",
     "date": "2025-06-29",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "테일게이트 힌지",
     "inspected": 2806,
     "defects": 8
    },
    {
     "id": "r10gjs",
     "date": "2025-06-20",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 341,
     "defects": 1
    },
    {
     "id": "r10gjt",
     "date": "2025-06-27",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2949,
     "defects": 7
    },
    {
     "id": "r10gju",
     "date": "2025-06-15",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 1351,
     "defects": 4
    },
    {
     "id": "r10gjv",
     "date": "2025-06-27",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1351,
     "defects": 3
    },
    {
     "id": "r10gjw",
     "date": "2025-06-25",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1791,
     "defects": 5
    },
    {
     "id": "r10gjx",
     "date": "2025-06-22",
     "kind": "수입검사",
     "line": "",
     "vendor": "태광산업",
     "part": "힌지 ASSY",
     "inspected": 2775,
     "defects": 7
    },
    {
     "id": "r10gjy",
     "date": "2025-06-03",
     "kind": "수입검사",
     "line": "",
     "vendor": "대명오토",
     "part": "암레스트",
     "inspected": 1687,
     "defects": 5
    },
    {
     "id": "r10gjz",
     "date": "2025-06-12",
     "kind": "출하검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2164,
     "defects": 14
    },
    {
     "id": "r10gk0",
     "date": "2025-06-23",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 2880,
     "defects": 9
    },
    {
     "id": "r10gk1",
     "date": "2025-06-06",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 3473,
     "defects": 6
    },
    {
     "id": "r10gk2",
     "date": "2025-06-07",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 1308,
     "defects": 3
    },
    {
     "id": "r10gk3",
     "date": "2025-06-28",
     "kind": "수입검사",
     "line": "",
     "vendor": "한라부품",
     "part": "콘솔 커버",
     "inspected": 1256,
     "defects": 7
    },
    {
     "id": "r10gk4",
     "date": "2025-06-13",
     "kind": "수입검사",
     "line": "",
     "vendor": "한빛고무",
     "part": "도어래치 ASSY",
     "inspected": 2911,
     "defects": 9
    },
    {
     "id": "r10gk5",
     "date": "2025-06-24",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "리어 브라켓",
     "inspected": 1152,
     "defects": 10
    },
    {
     "id": "r10gk6",
     "date": "2025-06-08",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 2737,
     "defects": 6
    },
    {
     "id": "r10gk7",
     "date": "2025-06-17",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 843,
     "defects": 3
    },
    {
     "id": "r10gk8",
     "date": "2025-06-05",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1261,
     "defects": 5
    },
    {
     "id": "r10gk9",
     "date": "2025-06-06",
     "kind": "수입검사",
     "line": "",
     "vendor": "유성정밀",
     "part": "리어 브라켓",
     "inspected": 1063,
     "defects": 3
    },
    {
     "id": "r10gka",
     "date": "2025-06-04",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2713,
     "defects": 8
    },
    {
     "id": "r10gkb",
     "date": "2025-07-29",
     "kind": "수입검사",
     "line": "",
     "vendor": "한라부품",
     "part": "힌지 ASSY",
     "inspected": 2005,
     "defects": 12
    },
    {
     "id": "r10gkc",
     "date": "2025-07-22",
     "kind": "출하검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1287,
     "defects": 2
    },
    {
     "id": "r10gkd",
     "date": "2025-07-10",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2903,
     "defects": 9
    },
    {
     "id": "r10gke",
     "date": "2025-07-02",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 673,
     "defects": 3
    },
    {
     "id": "r10gkf",
     "date": "2025-07-30",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1612,
     "defects": 3
    },
    {
     "id": "r10gkg",
     "date": "2025-07-15",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2001,
     "defects": 7
    },
    {
     "id": "r10gkh",
     "date": "2025-07-09",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 2548,
     "defects": 9
    },
    {
     "id": "r10gki",
     "date": "2025-07-25",
     "kind": "출하검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 3104,
     "defects": 3
    },
    {
     "id": "r10gkj",
     "date": "2025-07-19",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 872,
     "defects": 1
    },
    {
     "id": "r10gkk",
     "date": "2025-07-15",
     "kind": "출하검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2866,
     "defects": 3
    },
    {
     "id": "r10gkl",
     "date": "2025-07-21",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 1693,
     "defects": 5
    },
    {
     "id": "r10gkm",
     "date": "2025-07-29",
     "kind": "수입검사",
     "line": "",
     "vendor": "세화테크",
     "part": "리어 브라켓",
     "inspected": 1556,
     "defects": 5
    },
    {
     "id": "r10gkn",
     "date": "2025-07-11",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 1525,
     "defects": 7
    },
    {
     "id": "r10gko",
     "date": "2025-07-13",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "스티어링 브라켓",
     "inspected": 356,
     "defects": 1
    },
    {
     "id": "r10gkp",
     "date": "2025-07-22",
     "kind": "수입검사",
     "line": "",
     "vendor": "신흥정공",
     "part": "암레스트",
     "inspected": 1487,
     "defects": 7
    },
    {
     "id": "r10gkq",
     "date": "2025-07-24",
     "kind": "수입검사",
     "line": "",
     "vendor": "한라부품",
     "part": "글로브박스",
     "inspected": 400,
     "defects": 2
    },
    {
     "id": "r10gkr",
     "date": "2025-07-27",
     "kind": "수입검사",
     "line": "",
     "vendor": "경일산업",
     "part": "힌지 ASSY",
     "inspected": 1233,
     "defects": 4
    },
    {
     "id": "r10gks",
     "date": "2025-07-29",
     "kind": "수입검사",
     "line": "",
     "vendor": "태광산업",
     "part": "도어 트림",
     "inspected": 2534,
     "defects": 9
    },
    {
     "id": "r10gkt",
     "date": "2025-07-18",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 802,
     "defects": 2
    },
    {
     "id": "r10gku",
     "date": "2025-07-07",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1238,
     "defects": 2
    },
    {
     "id": "r10gkv",
     "date": "2025-07-11",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 3956,
     "defects": 4
    },
    {
     "id": "r10gkw",
     "date": "2025-07-21",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 1217,
     "defects": 5
    },
    {
     "id": "r10gkx",
     "date": "2025-08-27",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 1495,
     "defects": 3
    },
    {
     "id": "r10gky",
     "date": "2025-08-19",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2265,
     "defects": 3
    },
    {
     "id": "r10gkz",
     "date": "2025-08-01",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 1878,
     "defects": 9
    },
    {
     "id": "r10gl0",
     "date": "2025-08-10",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 1464,
     "defects": 6
    },
    {
     "id": "r10gl1",
     "date": "2025-08-29",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 398,
     "defects": 6
    },
    {
     "id": "r10gl2",
     "date": "2025-08-17",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 1873,
     "defects": 4
    },
    {
     "id": "r10gl3",
     "date": "2025-08-25",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 545,
     "defects": 1
    },
    {
     "id": "r10gl4",
     "date": "2025-08-09",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 2512,
     "defects": 3
    },
    {
     "id": "r10gl5",
     "date": "2025-08-10",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 2604,
     "defects": 11
    },
    {
     "id": "r10gl6",
     "date": "2025-08-07",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1179,
     "defects": 2
    },
    {
     "id": "r10gl7",
     "date": "2025-08-25",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 2155,
     "defects": 6
    },
    {
     "id": "r10gl8",
     "date": "2025-08-19",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 3387,
     "defects": 4
    },
    {
     "id": "r10gl9",
     "date": "2025-08-20",
     "kind": "수입검사",
     "line": "",
     "vendor": "동양도금",
     "part": "스티어링 브라켓",
     "inspected": 349,
     "defects": 2
    },
    {
     "id": "r10gla",
     "date": "2025-08-26",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 879,
     "defects": 3
    },
    {
     "id": "r10glb",
     "date": "2025-08-25",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2669,
     "defects": 4
    },
    {
     "id": "r10glc",
     "date": "2025-08-04",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 484,
     "defects": 2
    },
    {
     "id": "r10gld",
     "date": "2025-08-03",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 936,
     "defects": 2
    },
    {
     "id": "r10gle",
     "date": "2025-08-16",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 2553,
     "defects": 6
    },
    {
     "id": "r10glf",
     "date": "2025-08-13",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2512,
     "defects": 8
    },
    {
     "id": "r10glg",
     "date": "2025-08-29",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 585,
     "defects": 2
    },
    {
     "id": "r10glh",
     "date": "2025-08-31",
     "kind": "출하검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 1516,
     "defects": 1
    },
    {
     "id": "r10gli",
     "date": "2025-08-23",
     "kind": "수입검사",
     "line": "",
     "vendor": "한빛고무",
     "part": "배터리 트레이",
     "inspected": 1102,
     "defects": 3
    },
    {
     "id": "r10glj",
     "date": "2025-09-02",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2629,
     "defects": 10
    },
    {
     "id": "r10glk",
     "date": "2025-09-20",
     "kind": "수입검사",
     "line": "",
     "vendor": "세화테크",
     "part": "브라켓 BRK-1830",
     "inspected": 1550,
     "defects": 9
    },
    {
     "id": "r10gll",
     "date": "2025-09-03",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 1432,
     "defects": 2
    },
    {
     "id": "r10glm",
     "date": "2025-09-07",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1357,
     "defects": 3
    },
    {
     "id": "r10gln",
     "date": "2025-09-30",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1999,
     "defects": 2
    },
    {
     "id": "r10glo",
     "date": "2025-09-09",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2556,
     "defects": 4
    },
    {
     "id": "r10glp",
     "date": "2025-09-29",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2170,
     "defects": 3
    },
    {
     "id": "r10glq",
     "date": "2025-09-02",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "도어래치 ASSY",
     "inspected": 1907,
     "defects": 11
    },
    {
     "id": "r10glr",
     "date": "2025-09-06",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 1065,
     "defects": 1
    },
    {
     "id": "r10gls",
     "date": "2025-09-04",
     "kind": "수입검사",
     "line": "",
     "vendor": "경일산업",
     "part": "글로브박스",
     "inspected": 2212,
     "defects": 9
    },
    {
     "id": "r10glt",
     "date": "2025-09-21",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 545,
     "defects": 1
    },
    {
     "id": "r10glu",
     "date": "2025-09-28",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 656,
     "defects": 1
    },
    {
     "id": "r10glv",
     "date": "2025-09-04",
     "kind": "수입검사",
     "line": "",
     "vendor": "신흥정공",
     "part": "도어래치 ASSY",
     "inspected": 2195,
     "defects": 13
    },
    {
     "id": "r10glw",
     "date": "2025-09-19",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 1325,
     "defects": 6
    },
    {
     "id": "r10glx",
     "date": "2025-09-03",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 2780,
     "defects": 6
    },
    {
     "id": "r10gly",
     "date": "2025-09-18",
     "kind": "수입검사",
     "line": "",
     "vendor": "유성정밀",
     "part": "도어 트림",
     "inspected": 2413,
     "defects": 12
    },
    {
     "id": "r10glz",
     "date": "2025-09-25",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "글로브박스",
     "inspected": 2814,
     "defects": 14
    },
    {
     "id": "r10gm0",
     "date": "2025-09-28",
     "kind": "수입검사",
     "line": "",
     "vendor": "세화테크",
     "part": "커넥터 하우징",
     "inspected": 880,
     "defects": 2
    },
    {
     "id": "r10gm1",
     "date": "2025-09-19",
     "kind": "출하검사",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 954,
     "defects": 1
    },
    {
     "id": "r10gm2",
     "date": "2025-09-15",
     "kind": "수입검사",
     "line": "",
     "vendor": "한빛고무",
     "part": "도어 트림",
     "inspected": 2306,
     "defects": 5
    },
    {
     "id": "r10gm3",
     "date": "2025-09-07",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 729,
     "defects": 1
    },
    {
     "id": "r10gm4",
     "date": "2025-09-23",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2347,
     "defects": 8
    },
    {
     "id": "r10gm5",
     "date": "2025-10-26",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 2243,
     "defects": 1
    },
    {
     "id": "r10gm6",
     "date": "2025-10-21",
     "kind": "수입검사",
     "line": "",
     "vendor": "대성정밀",
     "part": "브라켓 BRK-1830",
     "inspected": 1116,
     "defects": 6
    },
    {
     "id": "r10gm7",
     "date": "2025-10-05",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 1776,
     "defects": 1
    },
    {
     "id": "r10gm8",
     "date": "2025-10-02",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2879,
     "defects": 13
    },
    {
     "id": "r10gm9",
     "date": "2025-10-04",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 1008,
     "defects": 1
    },
    {
     "id": "r10gma",
     "date": "2025-10-22",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 483,
     "defects": 1
    },
    {
     "id": "r10gmb",
     "date": "2025-10-10",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1673,
     "defects": 2
    },
    {
     "id": "r10gmc",
     "date": "2025-10-17",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 2374,
     "defects": 4
    },
    {
     "id": "r10gmd",
     "date": "2025-10-12",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 1291,
     "defects": 2
    },
    {
     "id": "r10gme",
     "date": "2025-10-26",
     "kind": "수입검사",
     "line": "",
     "vendor": "유성정밀",
     "part": "커넥터 하우징",
     "inspected": 2836,
     "defects": 14
    },
    {
     "id": "r10gmf",
     "date": "2025-10-15",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 2746,
     "defects": 4
    },
    {
     "id": "r10gmg",
     "date": "2025-10-03",
     "kind": "수입검사",
     "line": "",
     "vendor": "대성정밀",
     "part": "도어 트림",
     "inspected": 2516,
     "defects": 5
    },
    {
     "id": "r10gmh",
     "date": "2025-10-24",
     "kind": "출하검사",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 828,
     "defects": 1
    },
    {
     "id": "r10gmi",
     "date": "2025-10-23",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 2359,
     "defects": 9
    },
    {
     "id": "r10gmj",
     "date": "2025-10-31",
     "kind": "수입검사",
     "line": "",
     "vendor": "우진금속",
     "part": "커넥터 하우징",
     "inspected": 1551,
     "defects": 5
    },
    {
     "id": "r10gmk",
     "date": "2025-10-29",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 862,
     "defects": 2
    },
    {
     "id": "r10gml",
     "date": "2025-10-14",
     "kind": "수입검사",
     "line": "",
     "vendor": "우진금속",
     "part": "글로브박스",
     "inspected": 2828,
     "defects": 12
    },
    {
     "id": "r10gmm",
     "date": "2025-10-23",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 2189,
     "defects": 3
    },
    {
     "id": "r10gmn",
     "date": "2025-10-24",
     "kind": "출하검사",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 1127,
     "defects": 2
    },
    {
     "id": "r10gmo",
     "date": "2025-10-28",
     "kind": "수입검사",
     "line": "",
     "vendor": "태광산업",
     "part": "범퍼 빔",
     "inspected": 467,
     "defects": 1
    },
    {
     "id": "r10gmp",
     "date": "2025-10-05",
     "kind": "수입검사",
     "line": "",
     "vendor": "삼진프레스",
     "part": "암레스트",
     "inspected": 1672,
     "defects": 25
    },
    {
     "id": "r10gmq",
     "date": "2025-10-20",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 563,
     "defects": 1
    },
    {
     "id": "r10gmr",
     "date": "2025-11-14",
     "kind": "수입검사",
     "line": "",
     "vendor": "진영테크",
     "part": "리어 브라켓",
     "inspected": 1368,
     "defects": 3
    },
    {
     "id": "r10gms",
     "date": "2025-11-10",
     "kind": "수입검사",
     "line": "",
     "vendor": "경일산업",
     "part": "콘솔 커버",
     "inspected": 2301,
     "defects": 5
    },
    {
     "id": "r10gmt",
     "date": "2025-11-04",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1147,
     "defects": 4
    },
    {
     "id": "r10gmu",
     "date": "2025-11-18",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 2610,
     "defects": 3
    },
    {
     "id": "r10gmv",
     "date": "2025-11-07",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 2087,
     "defects": 9
    },
    {
     "id": "r10gmw",
     "date": "2025-11-06",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 1655,
     "defects": 2
    },
    {
     "id": "r10gmx",
     "date": "2025-11-10",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2911,
     "defects": 5
    },
    {
     "id": "r10gmy",
     "date": "2025-11-27",
     "kind": "수입검사",
     "line": "",
     "vendor": "한빛고무",
     "part": "콘솔 커버",
     "inspected": 308,
     "defects": 1
    },
    {
     "id": "r10gmz",
     "date": "2025-11-15",
     "kind": "수입검사",
     "line": "",
     "vendor": "태광산업",
     "part": "테일게이트 힌지",
     "inspected": 457,
     "defects": 1
    },
    {
     "id": "r10gn0",
     "date": "2025-11-24",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 372,
     "defects": 1
    },
    {
     "id": "r10gn1",
     "date": "2025-11-15",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2581,
     "defects": 17
    },
    {
     "id": "r10gn2",
     "date": "2025-11-22",
     "kind": "수입검사",
     "line": "",
     "vendor": "세화테크",
     "part": "콘솔 커버",
     "inspected": 2507,
     "defects": 11
    },
    {
     "id": "r10gn3",
     "date": "2025-11-23",
     "kind": "수입검사",
     "line": "",
     "vendor": "한빛고무",
     "part": "리어 브라켓",
     "inspected": 2111,
     "defects": 10
    },
    {
     "id": "r10gn4",
     "date": "2025-11-18",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "배터리 트레이",
     "inspected": 705,
     "defects": 12
    },
    {
     "id": "r10gn5",
     "date": "2025-11-03",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1934,
     "defects": 8
    },
    {
     "id": "r10gn6",
     "date": "2025-11-13",
     "kind": "수입검사",
     "line": "",
     "vendor": "한라부품",
     "part": "브라켓 BRK-1830",
     "inspected": 676,
     "defects": 4
    },
    {
     "id": "r10gn7",
     "date": "2025-11-10",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2960,
     "defects": 6
    },
    {
     "id": "r10gn8",
     "date": "2025-11-03",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 1769,
     "defects": 7
    },
    {
     "id": "r10gn9",
     "date": "2025-11-18",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 627,
     "defects": 3
    },
    {
     "id": "r10gna",
     "date": "2025-11-12",
     "kind": "수입검사",
     "line": "",
     "vendor": "대명오토",
     "part": "범퍼 빔",
     "inspected": 2295,
     "defects": 6
    },
    {
     "id": "r10gnb",
     "date": "2025-11-11",
     "kind": "수입검사",
     "line": "",
     "vendor": "유성정밀",
     "part": "범퍼 빔",
     "inspected": 2361,
     "defects": 5
    },
    {
     "id": "r10gnc",
     "date": "2025-11-06",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "암레스트",
     "inspected": 597,
     "defects": 2
    },
    {
     "id": "r10gnd",
     "date": "2025-12-24",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 1882,
     "defects": 3
    },
    {
     "id": "r10gne",
     "date": "2025-12-19",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 2421,
     "defects": 8
    },
    {
     "id": "r10gnf",
     "date": "2025-12-12",
     "kind": "출하검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 3140,
     "defects": 4
    },
    {
     "id": "r10gng",
     "date": "2025-12-28",
     "kind": "출하검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1339,
     "defects": 2
    },
    {
     "id": "r10gnh",
     "date": "2025-12-27",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 1474,
     "defects": 1
    },
    {
     "id": "r10gni",
     "date": "2025-12-25",
     "kind": "수입검사",
     "line": "",
     "vendor": "삼진프레스",
     "part": "콘솔 커버",
     "inspected": 2828,
     "defects": 11
    },
    {
     "id": "r10gnj",
     "date": "2025-12-11",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 1200,
     "defects": 5
    },
    {
     "id": "r10gnk",
     "date": "2025-12-22",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2866,
     "defects": 7
    },
    {
     "id": "r10gnl",
     "date": "2025-12-23",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 3077,
     "defects": 2
    },
    {
     "id": "r10gnm",
     "date": "2025-12-13",
     "kind": "출하검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1289,
     "defects": 1
    },
    {
     "id": "r10gnn",
     "date": "2025-12-12",
     "kind": "출하검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 2994,
     "defects": 3
    },
    {
     "id": "r10gno",
     "date": "2025-12-24",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "시트프레임",
     "inspected": 896,
     "defects": 3
    },
    {
     "id": "r10gnp",
     "date": "2025-12-20",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "배터리 트레이",
     "inspected": 593,
     "defects": 2
    },
    {
     "id": "r10gnq",
     "date": "2025-12-03",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 2919,
     "defects": 5
    },
    {
     "id": "r10gnr",
     "date": "2025-12-29",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 1983,
     "defects": 3
    },
    {
     "id": "r10gns",
     "date": "2025-12-06",
     "kind": "수입검사",
     "line": "",
     "vendor": "대성정밀",
     "part": "시트프레임",
     "inspected": 452,
     "defects": 1
    },
    {
     "id": "r10gnt",
     "date": "2025-12-09",
     "kind": "수입검사",
     "line": "",
     "vendor": "삼진프레스",
     "part": "배터리 트레이",
     "inspected": 2841,
     "defects": 5
    },
    {
     "id": "r10gnu",
     "date": "2025-12-05",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 2313,
     "defects": 8
    },
    {
     "id": "r10gnv",
     "date": "2025-12-08",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 2201,
     "defects": 2
    },
    {
     "id": "r10gnw",
     "date": "2025-12-13",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1966,
     "defects": 9
    },
    {
     "id": "r10gnx",
     "date": "2025-12-17",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 1277,
     "defects": 3
    },
    {
     "id": "r10gny",
     "date": "2025-12-10",
     "kind": "수입검사",
     "line": "",
     "vendor": "동양도금",
     "part": "범퍼 빔",
     "inspected": 2297,
     "defects": 5
    },
    {
     "id": "r10gnz",
     "date": "2026-01-06",
     "kind": "수입검사",
     "line": "",
     "vendor": "대성정밀",
     "part": "브라켓 BRK-1830",
     "inspected": 662,
     "defects": 2
    },
    {
     "id": "r10go0",
     "date": "2026-01-22",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1020,
     "defects": 4
    },
    {
     "id": "r10go1",
     "date": "2026-01-07",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 3215,
     "defects": 2
    },
    {
     "id": "r10go2",
     "date": "2026-01-14",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 2292,
     "defects": 8
    },
    {
     "id": "r10go3",
     "date": "2026-01-30",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 861,
     "defects": 2
    },
    {
     "id": "r10go4",
     "date": "2026-01-06",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 2892,
     "defects": 4
    },
    {
     "id": "r10go5",
     "date": "2026-01-03",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 1297,
     "defects": 2
    },
    {
     "id": "r10go6",
     "date": "2026-01-25",
     "kind": "수입검사",
     "line": "",
     "vendor": "경일산업",
     "part": "콘솔 커버",
     "inspected": 372,
     "defects": 1
    },
    {
     "id": "r10go7",
     "date": "2026-01-02",
     "kind": "수입검사",
     "line": "",
     "vendor": "삼진프레스",
     "part": "테일게이트 힌지",
     "inspected": 1123,
     "defects": 5
    },
    {
     "id": "r10go8",
     "date": "2026-01-02",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 2067,
     "defects": 7
    },
    {
     "id": "r10go9",
     "date": "2026-01-22",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 1207,
     "defects": 4
    },
    {
     "id": "r10goa",
     "date": "2026-01-19",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "테일게이트 힌지",
     "inspected": 2746,
     "defects": 14
    },
    {
     "id": "r10gob",
     "date": "2026-01-31",
     "kind": "수입검사",
     "line": "",
     "vendor": "진영테크",
     "part": "배터리 트레이",
     "inspected": 583,
     "defects": 3
    },
    {
     "id": "r10goc",
     "date": "2026-01-26",
     "kind": "출하검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 2234,
     "defects": 2
    },
    {
     "id": "r10god",
     "date": "2026-01-25",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 947,
     "defects": 2
    },
    {
     "id": "r10goe",
     "date": "2026-01-17",
     "kind": "출하검사",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 2334,
     "defects": 3
    },
    {
     "id": "r10gof",
     "date": "2026-01-20",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 618,
     "defects": 2
    },
    {
     "id": "r10gog",
     "date": "2026-01-11",
     "kind": "수입검사",
     "line": "",
     "vendor": "진영테크",
     "part": "힌지 ASSY",
     "inspected": 786,
     "defects": 4
    },
    {
     "id": "r10goh",
     "date": "2026-01-04",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 2360,
     "defects": 9
    },
    {
     "id": "r10goi",
     "date": "2026-01-19",
     "kind": "출하검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 3857,
     "defects": 2
    },
    {
     "id": "r10goj",
     "date": "2026-01-19",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "배터리 트레이",
     "inspected": 2995,
     "defects": 11
    },
    {
     "id": "r10gok",
     "date": "2026-01-19",
     "kind": "수입검사",
     "line": "",
     "vendor": "해성화학",
     "part": "브라켓 BRK-1830",
     "inspected": 1297,
     "defects": 12
    },
    {
     "id": "r10gol",
     "date": "2026-02-23",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 1211,
     "defects": 1
    },
    {
     "id": "r10gom",
     "date": "2026-02-15",
     "kind": "수입검사",
     "line": "",
     "vendor": "삼진프레스",
     "part": "글로브박스",
     "inspected": 2768,
     "defects": 8
    },
    {
     "id": "r10gon",
     "date": "2026-02-07",
     "kind": "수입검사",
     "line": "",
     "vendor": "우진금속",
     "part": "브라켓 BRK-1830",
     "inspected": 2972,
     "defects": 9
    },
    {
     "id": "r10goo",
     "date": "2026-02-04",
     "kind": "수입검사",
     "line": "",
     "vendor": "삼진프레스",
     "part": "도어래치 ASSY",
     "inspected": 1413,
     "defects": 7
    },
    {
     "id": "r10gop",
     "date": "2026-02-12",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1200,
     "defects": 2
    },
    {
     "id": "r10goq",
     "date": "2026-02-23",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 2629,
     "defects": 2
    },
    {
     "id": "r10gor",
     "date": "2026-02-27",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2079,
     "defects": 6
    },
    {
     "id": "r10gos",
     "date": "2026-02-10",
     "kind": "수입검사",
     "line": "",
     "vendor": "한빛고무",
     "part": "콘솔 커버",
     "inspected": 746,
     "defects": 2
    },
    {
     "id": "r10got",
     "date": "2026-02-13",
     "kind": "출하검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 3297,
     "defects": 5
    },
    {
     "id": "r10gou",
     "date": "2026-02-05",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 2571,
     "defects": 3
    },
    {
     "id": "r10gov",
     "date": "2026-02-28",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2805,
     "defects": 6
    },
    {
     "id": "r10gow",
     "date": "2026-02-25",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1572,
     "defects": 2
    },
    {
     "id": "r10gox",
     "date": "2026-02-15",
     "kind": "수입검사",
     "line": "",
     "vendor": "대명오토",
     "part": "글로브박스",
     "inspected": 412,
     "defects": 2
    },
    {
     "id": "r10goy",
     "date": "2026-02-03",
     "kind": "수입검사",
     "line": "",
     "vendor": "우진금속",
     "part": "콘솔 커버",
     "inspected": 463,
     "defects": 1
    },
    {
     "id": "r10goz",
     "date": "2026-02-17",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1500,
     "defects": 3
    },
    {
     "id": "r10gp0",
     "date": "2026-02-02",
     "kind": "출하검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2746,
     "defects": 3
    },
    {
     "id": "r10gp1",
     "date": "2026-02-01",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 1901,
     "defects": 4
    },
    {
     "id": "r10gp2",
     "date": "2026-02-23",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1961,
     "defects": 2
    },
    {
     "id": "r10gp3",
     "date": "2026-02-24",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 1049,
     "defects": 3
    },
    {
     "id": "r10gp4",
     "date": "2026-02-10",
     "kind": "수입검사",
     "line": "",
     "vendor": "신흥정공",
     "part": "글로브박스",
     "inspected": 2698,
     "defects": 7
    },
    {
     "id": "r10gp5",
     "date": "2026-02-10",
     "kind": "수입검사",
     "line": "",
     "vendor": "세화테크",
     "part": "글로브박스",
     "inspected": 1670,
     "defects": 5
    },
    {
     "id": "r10gp6",
     "date": "2026-02-28",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 1643,
     "defects": 7
    },
    {
     "id": "r10gp7",
     "date": "2026-03-15",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 1415,
     "defects": 6
    },
    {
     "id": "r10gp8",
     "date": "2026-03-31",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1442,
     "defects": 4
    },
    {
     "id": "r10gp9",
     "date": "2026-03-11",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 2439,
     "defects": 7
    },
    {
     "id": "r10gpa",
     "date": "2026-03-20",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 2616,
     "defects": 2
    },
    {
     "id": "r10gpb",
     "date": "2026-03-24",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 1766,
     "defects": 3
    },
    {
     "id": "r10gpc",
     "date": "2026-03-18",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1268,
     "defects": 2
    },
    {
     "id": "r10gpd",
     "date": "2026-03-23",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1087,
     "defects": 5
    },
    {
     "id": "r10gpe",
     "date": "2026-03-25",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1446,
     "defects": 1
    },
    {
     "id": "r10gpf",
     "date": "2026-03-16",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 1815,
     "defects": 7
    },
    {
     "id": "r10gpg",
     "date": "2026-03-10",
     "kind": "수입검사",
     "line": "",
     "vendor": "동양도금",
     "part": "커넥터 하우징",
     "inspected": 873,
     "defects": 5
    },
    {
     "id": "r10gph",
     "date": "2026-03-16",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 2016,
     "defects": 3
    },
    {
     "id": "r10gpi",
     "date": "2026-03-06",
     "kind": "수입검사",
     "line": "",
     "vendor": "한라부품",
     "part": "힌지 ASSY",
     "inspected": 578,
     "defects": 3
    },
    {
     "id": "r10gpj",
     "date": "2026-03-13",
     "kind": "수입검사",
     "line": "",
     "vendor": "한라부품",
     "part": "범퍼 빔",
     "inspected": 788,
     "defects": 3
    },
    {
     "id": "r10gpk",
     "date": "2026-03-13",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2076,
     "defects": 5
    },
    {
     "id": "r10gpl",
     "date": "2026-03-08",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2370,
     "defects": 3
    },
    {
     "id": "r10gpm",
     "date": "2026-03-13",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 669,
     "defects": 1
    },
    {
     "id": "r10gpn",
     "date": "2026-03-17",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 2289,
     "defects": 7
    },
    {
     "id": "r10gpo",
     "date": "2026-03-14",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2050,
     "defects": 2
    },
    {
     "id": "r10gpp",
     "date": "2026-03-19",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 2931,
     "defects": 4
    },
    {
     "id": "r10gpq",
     "date": "2026-03-16",
     "kind": "출하검사",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1610,
     "defects": 5
    },
    {
     "id": "r10gpr",
     "date": "2026-03-04",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 2850,
     "defects": 9
    },
    {
     "id": "r10gps",
     "date": "2026-03-03",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1252,
     "defects": 5
    },
    {
     "id": "r10gpt",
     "date": "2026-04-19",
     "kind": "수입검사",
     "line": "",
     "vendor": "해성화학",
     "part": "범퍼 빔",
     "inspected": 1523,
     "defects": 7
    },
    {
     "id": "r10gpu",
     "date": "2026-04-06",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "스티어링 브라켓",
     "inspected": 927,
     "defects": 5
    },
    {
     "id": "r10gpv",
     "date": "2026-04-23",
     "kind": "수입검사",
     "line": "",
     "vendor": "대성정밀",
     "part": "시트프레임",
     "inspected": 758,
     "defects": 4
    },
    {
     "id": "r10gpw",
     "date": "2026-04-12",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 2239,
     "defects": 2
    },
    {
     "id": "r10gpx",
     "date": "2026-04-08",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 2669,
     "defects": 4
    },
    {
     "id": "r10gpy",
     "date": "2026-04-03",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 1500,
     "defects": 5
    },
    {
     "id": "r10gpz",
     "date": "2026-04-17",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 1831,
     "defects": 7
    },
    {
     "id": "r10gq0",
     "date": "2026-04-18",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 1542,
     "defects": 10
    },
    {
     "id": "r10gq1",
     "date": "2026-04-21",
     "kind": "수입검사",
     "line": "",
     "vendor": "태광산업",
     "part": "범퍼 빔",
     "inspected": 397,
     "defects": 2
    },
    {
     "id": "r10gq2",
     "date": "2026-04-12",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2529,
     "defects": 4
    },
    {
     "id": "r10gq3",
     "date": "2026-04-06",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 2273,
     "defects": 9
    },
    {
     "id": "r10gq4",
     "date": "2026-04-18",
     "kind": "수입검사",
     "line": "",
     "vendor": "태광산업",
     "part": "콘솔 커버",
     "inspected": 381,
     "defects": 1
    },
    {
     "id": "r10gq5",
     "date": "2026-04-09",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1312,
     "defects": 2
    },
    {
     "id": "r10gq6",
     "date": "2026-04-26",
     "kind": "수입검사",
     "line": "",
     "vendor": "대성정밀",
     "part": "커넥터 하우징",
     "inspected": 1300,
     "defects": 5
    },
    {
     "id": "r10gq7",
     "date": "2026-04-07",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 1043,
     "defects": 4
    },
    {
     "id": "r10gq8",
     "date": "2026-04-27",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 621,
     "defects": 2
    },
    {
     "id": "r10gq9",
     "date": "2026-04-25",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 933,
     "defects": 2
    },
    {
     "id": "r10gqa",
     "date": "2026-04-09",
     "kind": "수입검사",
     "line": "",
     "vendor": "유성정밀",
     "part": "배터리 트레이",
     "inspected": 498,
     "defects": 2
    },
    {
     "id": "r10gqb",
     "date": "2026-04-17",
     "kind": "수입검사",
     "line": "",
     "vendor": "경일산업",
     "part": "도어래치 ASSY",
     "inspected": 1202,
     "defects": 2
    },
    {
     "id": "r10gqc",
     "date": "2026-04-22",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2893,
     "defects": 4
    },
    {
     "id": "r10gqd",
     "date": "2026-04-21",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1968,
     "defects": 1
    },
    {
     "id": "r10gqe",
     "date": "2026-04-01",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 2641,
     "defects": 8
    },
    {
     "id": "r10gqf",
     "date": "2026-05-30",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 1992,
     "defects": 5
    },
    {
     "id": "r10gqg",
     "date": "2026-05-26",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 440,
     "defects": 1
    },
    {
     "id": "r10gqh",
     "date": "2026-05-23",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2551,
     "defects": 11
    },
    {
     "id": "r10gqi",
     "date": "2026-05-05",
     "kind": "수입검사",
     "line": "",
     "vendor": "한빛고무",
     "part": "암레스트",
     "inspected": 2912,
     "defects": 10
    },
    {
     "id": "r10gqj",
     "date": "2026-05-11",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2101,
     "defects": 8
    },
    {
     "id": "r10gqk",
     "date": "2026-05-30",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 1983,
     "defects": 18
    },
    {
     "id": "r10gql",
     "date": "2026-05-25",
     "kind": "수입검사",
     "line": "",
     "vendor": "동양도금",
     "part": "배터리 트레이",
     "inspected": 1032,
     "defects": 6
    },
    {
     "id": "r10gqm",
     "date": "2026-05-26",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 2300,
     "defects": 4
    },
    {
     "id": "r10gqn",
     "date": "2026-05-07",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2791,
     "defects": 11
    },
    {
     "id": "r10gqo",
     "date": "2026-05-26",
     "kind": "수입검사",
     "line": "",
     "vendor": "한빛고무",
     "part": "힌지 ASSY",
     "inspected": 1251,
     "defects": 2
    },
    {
     "id": "r10gqp",
     "date": "2026-05-10",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1159,
     "defects": 4
    },
    {
     "id": "r10gqq",
     "date": "2026-05-29",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 2848,
     "defects": 8
    },
    {
     "id": "r10gqr",
     "date": "2026-05-14",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 1476,
     "defects": 4
    },
    {
     "id": "r10gqs",
     "date": "2026-05-02",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 2258,
     "defects": 3
    },
    {
     "id": "r10gqt",
     "date": "2026-05-05",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 1971,
     "defects": 2
    },
    {
     "id": "r10gqu",
     "date": "2026-05-25",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "암레스트",
     "inspected": 617,
     "defects": 1
    },
    {
     "id": "r10gqv",
     "date": "2026-05-02",
     "kind": "수입검사",
     "line": "",
     "vendor": "경일산업",
     "part": "힌지 ASSY",
     "inspected": 1761,
     "defects": 6
    },
    {
     "id": "r10gqw",
     "date": "2026-05-27",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 401,
     "defects": 2
    },
    {
     "id": "r10gqx",
     "date": "2026-05-12",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 1365,
     "defects": 3
    },
    {
     "id": "r10gqy",
     "date": "2026-05-14",
     "kind": "출하검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 2159,
     "defects": 2
    },
    {
     "id": "r10gqz",
     "date": "2026-05-30",
     "kind": "수입검사",
     "line": "",
     "vendor": "진영테크",
     "part": "시트프레임",
     "inspected": 1137,
     "defects": 2
    },
    {
     "id": "r10gr0",
     "date": "2026-05-19",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 2262,
     "defects": 5
    },
    {
     "id": "r10gr1",
     "date": "2026-06-08",
     "kind": "수입검사",
     "line": "",
     "vendor": "대성정밀",
     "part": "콘솔 커버",
     "inspected": 868,
     "defects": 5
    },
    {
     "id": "r10gr2",
     "date": "2026-06-19",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 1079,
     "defects": 2
    },
    {
     "id": "r10gr3",
     "date": "2026-06-16",
     "kind": "수입검사",
     "line": "",
     "vendor": "태광산업",
     "part": "암레스트",
     "inspected": 1716,
     "defects": 9
    },
    {
     "id": "r10gr4",
     "date": "2026-06-11",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "배터리 트레이",
     "inspected": 1818,
     "defects": 3
    },
    {
     "id": "r10gr5",
     "date": "2026-06-27",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2664,
     "defects": 7
    },
    {
     "id": "r10gr6",
     "date": "2026-06-08",
     "kind": "수입검사",
     "line": "",
     "vendor": "동양도금",
     "part": "범퍼 빔",
     "inspected": 1261,
     "defects": 2
    },
    {
     "id": "r10gr7",
     "date": "2026-06-03",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 768,
     "defects": 3
    },
    {
     "id": "r10gr8",
     "date": "2026-06-01",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "도어래치 ASSY",
     "inspected": 1357,
     "defects": 4
    },
    {
     "id": "r10gr9",
     "date": "2026-06-10",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 2832,
     "defects": 5
    },
    {
     "id": "r10gra",
     "date": "2026-06-19",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 1744,
     "defects": 5
    },
    {
     "id": "r10grb",
     "date": "2026-06-11",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 1533,
     "defects": 5
    },
    {
     "id": "r10grc",
     "date": "2026-06-15",
     "kind": "수입검사",
     "line": "",
     "vendor": "경일산업",
     "part": "배터리 트레이",
     "inspected": 2090,
     "defects": 9
    },
    {
     "id": "r10grd",
     "date": "2026-06-17",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 1479,
     "defects": 3
    },
    {
     "id": "r10gre",
     "date": "2026-06-28",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 2198,
     "defects": 7
    },
    {
     "id": "r10grf",
     "date": "2026-06-22",
     "kind": "수입검사",
     "line": "",
     "vendor": "한라부품",
     "part": "배터리 트레이",
     "inspected": 2284,
     "defects": 3
    },
    {
     "id": "r10grg",
     "date": "2026-06-10",
     "kind": "수입검사",
     "line": "",
     "vendor": "대명오토",
     "part": "스티어링 브라켓",
     "inspected": 1094,
     "defects": 3
    },
    {
     "id": "r10grh",
     "date": "2026-06-14",
     "kind": "수입검사",
     "line": "",
     "vendor": "유성정밀",
     "part": "콘솔 커버",
     "inspected": 2532,
     "defects": 7
    },
    {
     "id": "r10gri",
     "date": "2026-06-27",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 1718,
     "defects": 6
    },
    {
     "id": "r10grj",
     "date": "2026-06-22",
     "kind": "수입검사",
     "line": "",
     "vendor": "진영테크",
     "part": "브라켓 BRK-1830",
     "inspected": 644,
     "defects": 4
    },
    {
     "id": "r10grk",
     "date": "2026-06-08",
     "kind": "출하검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 3424,
     "defects": 5
    },
    {
     "id": "r10grl",
     "date": "2026-06-23",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1236,
     "defects": 5
    },
    {
     "id": "r10grm",
     "date": "2026-06-14",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 391,
     "defects": 1
    },
    {
     "id": "r10grn",
     "date": "2026-07-24",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1534,
     "defects": 6
    },
    {
     "id": "r10gro",
     "date": "2026-07-19",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1018,
     "defects": 3
    },
    {
     "id": "r10grp",
     "date": "2026-07-03",
     "kind": "출하검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 1301,
     "defects": 1
    },
    {
     "id": "r10grq",
     "date": "2026-07-13",
     "kind": "수입검사",
     "line": "",
     "vendor": "해성화학",
     "part": "테일게이트 힌지",
     "inspected": 2201,
     "defects": 5
    },
    {
     "id": "r10grr",
     "date": "2026-07-02",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "시트프레임",
     "inspected": 1633,
     "defects": 4
    },
    {
     "id": "r10grs",
     "date": "2026-07-25",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2124,
     "defects": 4
    },
    {
     "id": "r10grt",
     "date": "2026-07-22",
     "kind": "수입검사",
     "line": "",
     "vendor": "세화테크",
     "part": "암레스트",
     "inspected": 2654,
     "defects": 8
    },
    {
     "id": "r10gru",
     "date": "2026-07-17",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 2742,
     "defects": 7
    },
    {
     "id": "r10grv",
     "date": "2026-07-02",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 800,
     "defects": 2
    },
    {
     "id": "r10grw",
     "date": "2026-07-10",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 1015,
     "defects": 4
    },
    {
     "id": "r10grx",
     "date": "2026-07-25",
     "kind": "수입검사",
     "line": "",
     "vendor": "경일산업",
     "part": "범퍼 빔",
     "inspected": 2316,
     "defects": 10
    },
    {
     "id": "r10gry",
     "date": "2026-07-29",
     "kind": "공정검사",
     "line": "용접 2",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 588,
     "defects": 1
    },
    {
     "id": "r10grz",
     "date": "2026-07-13",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 765,
     "defects": 2
    },
    {
     "id": "r10gs0",
     "date": "2026-07-14",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 2083,
     "defects": 6
    },
    {
     "id": "r10gs1",
     "date": "2026-07-09",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1497,
     "defects": 11
    },
    {
     "id": "r10gs2",
     "date": "2026-07-20",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 2501,
     "defects": 8
    },
    {
     "id": "r10gs3",
     "date": "2026-07-26",
     "kind": "수입검사",
     "line": "",
     "vendor": "진영테크",
     "part": "도어 트림",
     "inspected": 661,
     "defects": 2
    },
    {
     "id": "r10gs4",
     "date": "2026-07-27",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 1002,
     "defects": 1
    },
    {
     "id": "r10gs5",
     "date": "2026-07-20",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 2062,
     "defects": 6
    },
    {
     "id": "r10gs6",
     "date": "2026-07-08",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "도어 트림",
     "inspected": 2135,
     "defects": 5
    },
    {
     "id": "r10gs7",
     "date": "2026-07-02",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 1535,
     "defects": 10
    },
    {
     "id": "r10gs8",
     "date": "2026-07-27",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2088,
     "defects": 8
    },
    {
     "id": "r10gs9",
     "date": "2026-08-25",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "배터리 트레이",
     "inspected": 2844,
     "defects": 5
    },
    {
     "id": "r10gsa",
     "date": "2026-08-17",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 2323,
     "defects": 13
    },
    {
     "id": "r10gsb",
     "date": "2026-08-23",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 2427,
     "defects": 1
    },
    {
     "id": "r10gsc",
     "date": "2026-08-22",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "도어 트림",
     "inspected": 1131,
     "defects": 4
    },
    {
     "id": "r10gsd",
     "date": "2026-08-31",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "시트프레임",
     "inspected": 1057,
     "defects": 2
    },
    {
     "id": "r10gse",
     "date": "2026-08-28",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 2503,
     "defects": 1
    },
    {
     "id": "r10gsf",
     "date": "2026-08-05",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2743,
     "defects": 6
    },
    {
     "id": "r10gsg",
     "date": "2026-08-08",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 1974,
     "defects": 6
    },
    {
     "id": "r10gsh",
     "date": "2026-08-28",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 1047,
     "defects": 1
    },
    {
     "id": "r10gsi",
     "date": "2026-08-22",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 2463,
     "defects": 7
    },
    {
     "id": "r10gsj",
     "date": "2026-08-17",
     "kind": "수입검사",
     "line": "",
     "vendor": "대성정밀",
     "part": "힌지 ASSY",
     "inspected": 1021,
     "defects": 5
    },
    {
     "id": "r10gsk",
     "date": "2026-08-30",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 501,
     "defects": 2
    },
    {
     "id": "r10gsl",
     "date": "2026-08-10",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 1435,
     "defects": 1
    },
    {
     "id": "r10gsm",
     "date": "2026-08-24",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 726,
     "defects": 2
    },
    {
     "id": "r10gsn",
     "date": "2026-08-02",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 1441,
     "defects": 22
    },
    {
     "id": "r10gso",
     "date": "2026-08-11",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 1985,
     "defects": 10
    },
    {
     "id": "r10gsp",
     "date": "2026-08-26",
     "kind": "출하검사",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 2156,
     "defects": 3
    },
    {
     "id": "r10gsq",
     "date": "2026-08-02",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1759,
     "defects": 2
    },
    {
     "id": "r10gsr",
     "date": "2026-08-05",
     "kind": "수입검사",
     "line": "",
     "vendor": "대성정밀",
     "part": "범퍼 빔",
     "inspected": 315,
     "defects": 1
    },
    {
     "id": "r10gss",
     "date": "2026-08-26",
     "kind": "수입검사",
     "line": "",
     "vendor": "경일산업",
     "part": "커넥터 하우징",
     "inspected": 335,
     "defects": 2
    },
    {
     "id": "r10gst",
     "date": "2026-08-29",
     "kind": "수입검사",
     "line": "",
     "vendor": "대성정밀",
     "part": "힌지 ASSY",
     "inspected": 1458,
     "defects": 7
    },
    {
     "id": "r10gsu",
     "date": "2026-08-27",
     "kind": "수입검사",
     "line": "",
     "vendor": "미래사출",
     "part": "스티어링 브라켓",
     "inspected": 2278,
     "defects": 6
    },
    {
     "id": "r10gsv",
     "date": "2026-09-16",
     "kind": "출하검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 2369,
     "defects": 2
    },
    {
     "id": "r10gsw",
     "date": "2026-09-24",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 1152,
     "defects": 3
    },
    {
     "id": "r10gsx",
     "date": "2026-09-25",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "커넥터 하우징",
     "inspected": 629,
     "defects": 2
    },
    {
     "id": "r10gsy",
     "date": "2026-09-22",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 2631,
     "defects": 6
    },
    {
     "id": "r10gsz",
     "date": "2026-09-29",
     "kind": "출하검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "리어 브라켓",
     "inspected": 2345,
     "defects": 1
    },
    {
     "id": "r10gt0",
     "date": "2026-09-30",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 1406,
     "defects": 2
    },
    {
     "id": "r10gt1",
     "date": "2026-09-12",
     "kind": "수입검사",
     "line": "",
     "vendor": "우진금속",
     "part": "시트프레임",
     "inspected": 1202,
     "defects": 6
    },
    {
     "id": "r10gt2",
     "date": "2026-09-13",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1339,
     "defects": 3
    },
    {
     "id": "r10gt3",
     "date": "2026-09-01",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 2410,
     "defects": 8
    },
    {
     "id": "r10gt4",
     "date": "2026-09-23",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "글로브박스",
     "inspected": 2034,
     "defects": 6
    },
    {
     "id": "r10gt5",
     "date": "2026-09-17",
     "kind": "출하검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 3228,
     "defects": 4
    },
    {
     "id": "r10gt6",
     "date": "2026-09-30",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "브라켓 BRK-1830",
     "inspected": 1230,
     "defects": 1
    },
    {
     "id": "r10gt7",
     "date": "2026-09-02",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "시트프레임",
     "inspected": 2224,
     "defects": 5
    },
    {
     "id": "r10gt8",
     "date": "2026-09-07",
     "kind": "수입검사",
     "line": "",
     "vendor": "진영테크",
     "part": "콘솔 커버",
     "inspected": 1792,
     "defects": 7
    },
    {
     "id": "r10gt9",
     "date": "2026-09-18",
     "kind": "수입검사",
     "line": "",
     "vendor": "한빛고무",
     "part": "브라켓 BRK-1830",
     "inspected": 2662,
     "defects": 5
    },
    {
     "id": "r10gta",
     "date": "2026-09-28",
     "kind": "수입검사",
     "line": "",
     "vendor": "성원전자",
     "part": "암레스트",
     "inspected": 601,
     "defects": 3
    },
    {
     "id": "r10gtb",
     "date": "2026-09-23",
     "kind": "공정검사",
     "line": "조립 2",
     "vendor": "",
     "part": "힌지 ASSY",
     "inspected": 498,
     "defects": 1
    },
    {
     "id": "r10gtc",
     "date": "2026-09-30",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 852,
     "defects": 1
    },
    {
     "id": "r10gtd",
     "date": "2026-09-29",
     "kind": "공정검사",
     "line": "프레스 2",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 732,
     "defects": 2
    },
    {
     "id": "r10gte",
     "date": "2026-09-23",
     "kind": "출하검사",
     "line": "조립 2",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 1502,
     "defects": 2
    },
    {
     "id": "r10gtf",
     "date": "2026-09-09",
     "kind": "수입검사",
     "line": "",
     "vendor": "해성화학",
     "part": "커넥터 하우징",
     "inspected": 2775,
     "defects": 4
    },
    {
     "id": "r10gtg",
     "date": "2026-09-04",
     "kind": "공정검사",
     "line": "조립 1",
     "vendor": "",
     "part": "도어래치 ASSY",
     "inspected": 1141,
     "defects": 1
    },
    {
     "id": "r10gth",
     "date": "2026-10-05",
     "kind": "공정검사",
     "line": "용접 1",
     "vendor": "",
     "part": "범퍼 빔",
     "inspected": 2308,
     "defects": 8
    },
    {
     "id": "r10gti",
     "date": "2026-10-05",
     "kind": "수입검사",
     "line": "",
     "vendor": "우진금속",
     "part": "커넥터 하우징",
     "inspected": 2652,
     "defects": 13
    },
    {
     "id": "r10gtj",
     "date": "2026-10-07",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "암레스트",
     "inspected": 512,
     "defects": 1
    },
    {
     "id": "r10gtk",
     "date": "2026-10-07",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "테일게이트 힌지",
     "inspected": 1710,
     "defects": 4
    },
    {
     "id": "r10gtl",
     "date": "2026-10-01",
     "kind": "공정검사",
     "line": "프레스 1",
     "vendor": "",
     "part": "스티어링 브라켓",
     "inspected": 962,
     "defects": 3
    },
    {
     "id": "r10gtm",
     "date": "2026-10-08",
     "kind": "수입검사",
     "line": "",
     "vendor": [
      "삼진프레스",
      "세화테크"
     ],
     "part": "커넥터 하우징",
     "inspected": 956,
     "defects": 2
    },
    {
     "id": "r10gtn",
     "date": "2026-10-04",
     "kind": "공정검사",
     "line": "사출 1",
     "vendor": "",
     "part": "콘솔 커버",
     "inspected": 958,
     "defects": 3
    }
   ]
  },
  {
   "id": "cpk",
   "name": "공정능력 (Cpk)",
   "desc": "관리 특성별 공정능력지수 측정 결과입니다. 1.33 미만은 개선 대상입니다.",
   "dateField": "date",
   "titleField": "char",
   "fields": [
    {
     "key": "date",
     "label": "측정일",
     "type": "date",
     "req": true
    },
    {
     "key": "char",
     "label": "관리 특성",
     "type": "text",
     "req": true
    },
    {
     "key": "line",
     "label": "라인",
     "type": "ref",
     "ref": "lines"
    },
    {
     "key": "part",
     "label": "부품",
     "type": "ref",
     "ref": "parts"
    },
    {
     "key": "spec",
     "label": "규격",
     "type": "text"
    },
    {
     "key": "cpk",
     "label": "Cpk",
     "type": "number",
     "req": true
    },
    {
     "key": "judge",
     "label": "판정",
     "type": "select",
     "options": [
      "정상",
      "주의",
      "심각"
     ],
     "badge": true
    }
   ],
   "records": [
    {
     "id": "r10gto",
     "date": "2025-01-27",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.19,
     "judge": "주의"
    },
    {
     "id": "r10gtp",
     "date": "2025-01-26",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.42,
     "judge": "정상"
    },
    {
     "id": "r10gtq",
     "date": "2025-01-22",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.28,
     "judge": "주의"
    },
    {
     "id": "r10gtr",
     "date": "2025-01-26",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.78,
     "judge": "정상"
    },
    {
     "id": "r10gts",
     "date": "2025-01-21",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.78,
     "judge": "정상"
    },
    {
     "id": "r10gtt",
     "date": "2025-01-23",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.38,
     "judge": "정상"
    },
    {
     "id": "r10gtu",
     "date": "2025-01-27",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.38,
     "judge": "정상"
    },
    {
     "id": "r10gtv",
     "date": "2025-01-25",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.78,
     "judge": "정상"
    },
    {
     "id": "r10gtw",
     "date": "2025-02-24",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.25,
     "judge": "주의"
    },
    {
     "id": "r10gtx",
     "date": "2025-02-27",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.53,
     "judge": "정상"
    },
    {
     "id": "r10gty",
     "date": "2025-02-25",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.33,
     "judge": "정상"
    },
    {
     "id": "r10gtz",
     "date": "2025-02-27",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.77,
     "judge": "정상"
    },
    {
     "id": "r10gu0",
     "date": "2025-02-28",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.64,
     "judge": "정상"
    },
    {
     "id": "r10gu1",
     "date": "2025-02-25",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.55,
     "judge": "정상"
    },
    {
     "id": "r10gu2",
     "date": "2025-02-22",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.34,
     "judge": "정상"
    },
    {
     "id": "r10gu3",
     "date": "2025-02-21",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 2.04,
     "judge": "정상"
    },
    {
     "id": "r10gu4",
     "date": "2025-03-26",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.37,
     "judge": "정상"
    },
    {
     "id": "r10gu5",
     "date": "2025-03-23",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.47,
     "judge": "정상"
    },
    {
     "id": "r10gu6",
     "date": "2025-03-22",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.3,
     "judge": "주의"
    },
    {
     "id": "r10gu7",
     "date": "2025-03-27",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.54,
     "judge": "정상"
    },
    {
     "id": "r10gu8",
     "date": "2025-03-27",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.6,
     "judge": "정상"
    },
    {
     "id": "r10gu9",
     "date": "2025-03-22",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.38,
     "judge": "정상"
    },
    {
     "id": "r10gua",
     "date": "2025-03-23",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.45,
     "judge": "정상"
    },
    {
     "id": "r10gub",
     "date": "2025-03-20",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 2.01,
     "judge": "정상"
    },
    {
     "id": "r10guc",
     "date": "2025-04-27",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.37,
     "judge": "정상"
    },
    {
     "id": "r10gud",
     "date": "2025-04-24",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.31,
     "judge": "주의"
    },
    {
     "id": "r10gue",
     "date": "2025-04-22",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.38,
     "judge": "정상"
    },
    {
     "id": "r10guf",
     "date": "2025-04-23",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.72,
     "judge": "정상"
    },
    {
     "id": "r10gug",
     "date": "2025-04-24",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.78,
     "judge": "정상"
    },
    {
     "id": "r10guh",
     "date": "2025-04-25",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.6,
     "judge": "정상"
    },
    {
     "id": "r10gui",
     "date": "2025-04-21",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 0.96,
     "judge": "심각"
    },
    {
     "id": "r10guj",
     "date": "2025-04-25",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.99,
     "judge": "정상"
    },
    {
     "id": "r10guk",
     "date": "2025-05-22",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.28,
     "judge": "주의"
    },
    {
     "id": "r10gul",
     "date": "2025-05-28",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.4,
     "judge": "정상"
    },
    {
     "id": "r10gum",
     "date": "2025-05-24",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.25,
     "judge": "주의"
    },
    {
     "id": "r10gun",
     "date": "2025-05-23",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.5,
     "judge": "정상"
    },
    {
     "id": "r10guo",
     "date": "2025-05-21",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.61,
     "judge": "정상"
    },
    {
     "id": "r10gup",
     "date": "2025-05-24",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.41,
     "judge": "정상"
    },
    {
     "id": "r10guq",
     "date": "2025-05-27",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.24,
     "judge": "주의"
    },
    {
     "id": "r10gur",
     "date": "2025-05-28",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.95,
     "judge": "정상"
    },
    {
     "id": "r10gus",
     "date": "2025-06-24",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.35,
     "judge": "정상"
    },
    {
     "id": "r10gut",
     "date": "2025-06-23",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.52,
     "judge": "정상"
    },
    {
     "id": "r10guu",
     "date": "2025-06-28",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.29,
     "judge": "주의"
    },
    {
     "id": "r10guv",
     "date": "2025-06-23",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.7,
     "judge": "정상"
    },
    {
     "id": "r10guw",
     "date": "2025-06-21",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.58,
     "judge": "정상"
    },
    {
     "id": "r10gux",
     "date": "2025-06-22",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.65,
     "judge": "정상"
    },
    {
     "id": "r10guy",
     "date": "2025-06-28",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.47,
     "judge": "정상"
    },
    {
     "id": "r10guz",
     "date": "2025-06-26",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 2,
     "judge": "정상"
    },
    {
     "id": "r10gv0",
     "date": "2025-07-21",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.29,
     "judge": "주의"
    },
    {
     "id": "r10gv1",
     "date": "2025-07-28",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.54,
     "judge": "정상"
    },
    {
     "id": "r10gv2",
     "date": "2025-07-26",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.37,
     "judge": "정상"
    },
    {
     "id": "r10gv3",
     "date": "2025-07-24",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.2,
     "judge": "주의"
    },
    {
     "id": "r10gv4",
     "date": "2025-07-21",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.65,
     "judge": "정상"
    },
    {
     "id": "r10gv5",
     "date": "2025-07-27",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.64,
     "judge": "정상"
    },
    {
     "id": "r10gv6",
     "date": "2025-07-21",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.13,
     "judge": "주의"
    },
    {
     "id": "r10gv7",
     "date": "2025-07-22",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.76,
     "judge": "정상"
    },
    {
     "id": "r10gv8",
     "date": "2025-08-21",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.32,
     "judge": "주의"
    },
    {
     "id": "r10gv9",
     "date": "2025-08-21",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.48,
     "judge": "정상"
    },
    {
     "id": "r10gva",
     "date": "2025-08-23",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.24,
     "judge": "주의"
    },
    {
     "id": "r10gvb",
     "date": "2025-08-28",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.72,
     "judge": "정상"
    },
    {
     "id": "r10gvc",
     "date": "2025-08-22",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.64,
     "judge": "정상"
    },
    {
     "id": "r10gvd",
     "date": "2025-08-28",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.61,
     "judge": "정상"
    },
    {
     "id": "r10gve",
     "date": "2025-08-25",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.27,
     "judge": "주의"
    },
    {
     "id": "r10gvf",
     "date": "2025-08-26",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.77,
     "judge": "정상"
    },
    {
     "id": "r10gvg",
     "date": "2025-09-22",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.31,
     "judge": "주의"
    },
    {
     "id": "r10gvh",
     "date": "2025-09-28",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.34,
     "judge": "정상"
    },
    {
     "id": "r10gvi",
     "date": "2025-09-23",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.26,
     "judge": "주의"
    },
    {
     "id": "r10gvj",
     "date": "2025-09-27",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.63,
     "judge": "정상"
    },
    {
     "id": "r10gvk",
     "date": "2025-09-27",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.83,
     "judge": "정상"
    },
    {
     "id": "r10gvl",
     "date": "2025-09-28",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.66,
     "judge": "정상"
    },
    {
     "id": "r10gvm",
     "date": "2025-09-24",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.36,
     "judge": "정상"
    },
    {
     "id": "r10gvn",
     "date": "2025-09-28",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.87,
     "judge": "정상"
    },
    {
     "id": "r10gvo",
     "date": "2025-10-24",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.16,
     "judge": "주의"
    },
    {
     "id": "r10gvp",
     "date": "2025-10-24",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.58,
     "judge": "정상"
    },
    {
     "id": "r10gvq",
     "date": "2025-10-22",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.3,
     "judge": "주의"
    },
    {
     "id": "r10gvr",
     "date": "2025-10-28",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.7,
     "judge": "정상"
    },
    {
     "id": "r10gvs",
     "date": "2025-10-21",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.83,
     "judge": "정상"
    },
    {
     "id": "r10gvt",
     "date": "2025-10-28",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.54,
     "judge": "정상"
    },
    {
     "id": "r10gvu",
     "date": "2025-10-24",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.38,
     "judge": "정상"
    },
    {
     "id": "r10gvv",
     "date": "2025-10-24",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.91,
     "judge": "정상"
    },
    {
     "id": "r10gvw",
     "date": "2025-11-21",
     "char": "도장 막두께",
     "line": "도장",
     "part": [
      "콘솔 커버",
      "도어래치 ASSY"
     ],
     "spec": "20~40 µm",
     "cpk": 1.22,
     "judge": "주의"
    },
    {
     "id": "r10gvx",
     "date": "2025-11-20",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.39,
     "judge": "정상"
    },
    {
     "id": "r10gvy",
     "date": "2025-11-27",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.23,
     "judge": "주의"
    },
    {
     "id": "r10gvz",
     "date": "2025-11-26",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.48,
     "judge": "정상"
    },
    {
     "id": "r10gw0",
     "date": "2025-11-20",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.73,
     "judge": "정상"
    },
    {
     "id": "r10gw1",
     "date": "2025-11-27",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.61,
     "judge": "정상"
    },
    {
     "id": "r10gw2",
     "date": "2025-11-20",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.42,
     "judge": "정상"
    },
    {
     "id": "r10gw3",
     "date": "2025-11-24",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.8,
     "judge": "정상"
    },
    {
     "id": "r10gw4",
     "date": "2025-12-25",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.22,
     "judge": "주의"
    },
    {
     "id": "r10gw5",
     "date": "2025-12-22",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.59,
     "judge": "정상"
    },
    {
     "id": "r10gw6",
     "date": "2025-12-25",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.36,
     "judge": "정상"
    },
    {
     "id": "r10gw7",
     "date": "2025-12-28",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.54,
     "judge": "정상"
    },
    {
     "id": "r10gw8",
     "date": "2025-12-25",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.66,
     "judge": "정상"
    },
    {
     "id": "r10gw9",
     "date": "2025-12-23",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.38,
     "judge": "정상"
    },
    {
     "id": "r10gwa",
     "date": "2025-12-26",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.46,
     "judge": "정상"
    },
    {
     "id": "r10gwb",
     "date": "2025-12-24",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.92,
     "judge": "정상"
    },
    {
     "id": "r10gwc",
     "date": "2026-01-27",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 0.85,
     "judge": "심각"
    },
    {
     "id": "r10gwd",
     "date": "2026-01-24",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.5,
     "judge": "정상"
    },
    {
     "id": "r10gwe",
     "date": "2026-01-28",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.29,
     "judge": "주의"
    },
    {
     "id": "r10gwf",
     "date": "2026-01-22",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.77,
     "judge": "정상"
    },
    {
     "id": "r10gwg",
     "date": "2026-01-27",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.7,
     "judge": "정상"
    },
    {
     "id": "r10gwh",
     "date": "2026-01-22",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.46,
     "judge": "정상"
    },
    {
     "id": "r10gwi",
     "date": "2026-01-20",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.42,
     "judge": "정상"
    },
    {
     "id": "r10gwj",
     "date": "2026-01-20",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.86,
     "judge": "정상"
    },
    {
     "id": "r10gwk",
     "date": "2026-02-26",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.4,
     "judge": "정상"
    },
    {
     "id": "r10gwl",
     "date": "2026-02-24",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.51,
     "judge": "정상"
    },
    {
     "id": "r10gwm",
     "date": "2026-02-24",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.26,
     "judge": "주의"
    },
    {
     "id": "r10gwn",
     "date": "2026-02-28",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.63,
     "judge": "정상"
    },
    {
     "id": "r10gwo",
     "date": "2026-02-25",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.86,
     "judge": "정상"
    },
    {
     "id": "r10gwp",
     "date": "2026-02-20",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.51,
     "judge": "정상"
    },
    {
     "id": "r10gwq",
     "date": "2026-02-24",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.23,
     "judge": "주의"
    },
    {
     "id": "r10gwr",
     "date": "2026-02-24",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.85,
     "judge": "정상"
    },
    {
     "id": "r10gws",
     "date": "2026-03-25",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.32,
     "judge": "주의"
    },
    {
     "id": "r10gwt",
     "date": "2026-03-23",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.54,
     "judge": "정상"
    },
    {
     "id": "r10gwu",
     "date": "2026-03-20",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.38,
     "judge": "정상"
    },
    {
     "id": "r10gwv",
     "date": "2026-03-21",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.48,
     "judge": "정상"
    },
    {
     "id": "r10gww",
     "date": "2026-03-25",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.87,
     "judge": "정상"
    },
    {
     "id": "r10gwx",
     "date": "2026-03-28",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.37,
     "judge": "정상"
    },
    {
     "id": "r10gwy",
     "date": "2026-03-28",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.32,
     "judge": "주의"
    },
    {
     "id": "r10gwz",
     "date": "2026-03-21",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.82,
     "judge": "정상"
    },
    {
     "id": "r10gx0",
     "date": "2026-04-23",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.16,
     "judge": "주의"
    },
    {
     "id": "r10gx1",
     "date": "2026-04-23",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.23,
     "judge": "주의"
    },
    {
     "id": "r10gx2",
     "date": "2026-04-27",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.4,
     "judge": "정상"
    },
    {
     "id": "r10gx3",
     "date": "2026-04-21",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.69,
     "judge": "정상"
    },
    {
     "id": "r10gx4",
     "date": "2026-04-24",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.56,
     "judge": "정상"
    },
    {
     "id": "r10gx5",
     "date": "2026-04-25",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.48,
     "judge": "정상"
    },
    {
     "id": "r10gx6",
     "date": "2026-04-25",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.52,
     "judge": "정상"
    },
    {
     "id": "r10gx7",
     "date": "2026-04-25",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.78,
     "judge": "정상"
    },
    {
     "id": "r10gx8",
     "date": "2026-05-22",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.39,
     "judge": "정상"
    },
    {
     "id": "r10gx9",
     "date": "2026-05-25",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.5,
     "judge": "정상"
    },
    {
     "id": "r10gxa",
     "date": "2026-05-20",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.43,
     "judge": "정상"
    },
    {
     "id": "r10gxb",
     "date": "2026-05-25",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.58,
     "judge": "정상"
    },
    {
     "id": "r10gxc",
     "date": "2026-05-26",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.57,
     "judge": "정상"
    },
    {
     "id": "r10gxd",
     "date": "2026-05-22",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.4,
     "judge": "정상"
    },
    {
     "id": "r10gxe",
     "date": "2026-05-24",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.3,
     "judge": "주의"
    },
    {
     "id": "r10gxf",
     "date": "2026-05-26",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.95,
     "judge": "정상"
    },
    {
     "id": "r10gxg",
     "date": "2026-06-25",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.21,
     "judge": "주의"
    },
    {
     "id": "r10gxh",
     "date": "2026-06-23",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.02,
     "judge": "주의"
    },
    {
     "id": "r10gxi",
     "date": "2026-06-21",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.25,
     "judge": "주의"
    },
    {
     "id": "r10gxj",
     "date": "2026-06-25",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.24,
     "judge": "주의"
    },
    {
     "id": "r10gxk",
     "date": "2026-06-27",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.84,
     "judge": "정상"
    },
    {
     "id": "r10gxl",
     "date": "2026-06-21",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.48,
     "judge": "정상"
    },
    {
     "id": "r10gxm",
     "date": "2026-06-21",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.41,
     "judge": "정상"
    },
    {
     "id": "r10gxn",
     "date": "2026-06-23",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 2,
     "judge": "정상"
    },
    {
     "id": "r10gxo",
     "date": "2026-07-22",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.36,
     "judge": "정상"
    },
    {
     "id": "r10gxp",
     "date": "2026-07-27",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.38,
     "judge": "정상"
    },
    {
     "id": "r10gxq",
     "date": "2026-07-27",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.19,
     "judge": "주의"
    },
    {
     "id": "r10gxr",
     "date": "2026-07-26",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.64,
     "judge": "정상"
    },
    {
     "id": "r10gxs",
     "date": "2026-07-20",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.61,
     "judge": "정상"
    },
    {
     "id": "r10gxt",
     "date": "2026-07-21",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.53,
     "judge": "정상"
    },
    {
     "id": "r10gxu",
     "date": "2026-07-22",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.52,
     "judge": "정상"
    },
    {
     "id": "r10gxv",
     "date": "2026-07-28",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.89,
     "judge": "정상"
    },
    {
     "id": "r10gxw",
     "date": "2026-08-21",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.37,
     "judge": "정상"
    },
    {
     "id": "r10gxx",
     "date": "2026-08-27",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.58,
     "judge": "정상"
    },
    {
     "id": "r10gxy",
     "date": "2026-08-23",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.13,
     "judge": "주의"
    },
    {
     "id": "r10gxz",
     "date": "2026-08-21",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.49,
     "judge": "정상"
    },
    {
     "id": "r10gy0",
     "date": "2026-08-26",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.84,
     "judge": "정상"
    },
    {
     "id": "r10gy1",
     "date": "2026-08-21",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.48,
     "judge": "정상"
    },
    {
     "id": "r10gy2",
     "date": "2026-08-23",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.44,
     "judge": "정상"
    },
    {
     "id": "r10gy3",
     "date": "2026-08-25",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.91,
     "judge": "정상"
    },
    {
     "id": "r10gy4",
     "date": "2026-09-22",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.44,
     "judge": "정상"
    },
    {
     "id": "r10gy5",
     "date": "2026-09-23",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.57,
     "judge": "정상"
    },
    {
     "id": "r10gy6",
     "date": "2026-09-27",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.44,
     "judge": "정상"
    },
    {
     "id": "r10gy7",
     "date": "2026-09-25",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.51,
     "judge": "정상"
    },
    {
     "id": "r10gy8",
     "date": "2026-09-27",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.85,
     "judge": "정상"
    },
    {
     "id": "r10gy9",
     "date": "2026-09-28",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.26,
     "judge": "주의"
    },
    {
     "id": "r10gya",
     "date": "2026-09-27",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.3,
     "judge": "주의"
    },
    {
     "id": "r10gyb",
     "date": "2026-09-22",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 2.03,
     "judge": "정상"
    },
    {
     "id": "r10gyc",
     "date": "2026-10-06",
     "char": "도장 막두께",
     "line": "도장",
     "part": "콘솔 커버",
     "spec": "20~40 µm",
     "cpk": 1.24,
     "judge": "주의"
    },
    {
     "id": "r10gyd",
     "date": "2026-10-06",
     "char": "용접 너겟 직경",
     "line": "용접 1",
     "part": "시트프레임",
     "spec": "≥ 5.0 mm",
     "cpk": 1.37,
     "judge": "정상"
    },
    {
     "id": "r10gye",
     "date": "2026-10-06",
     "char": "홀 위치도",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "spec": "Ø0.3",
     "cpk": 1.22,
     "judge": "주의"
    },
    {
     "id": "r10gyf",
     "date": "2026-10-06",
     "char": "누설 압력",
     "line": "조립 1",
     "part": "도어래치 ASSY",
     "spec": "≤ 0.5 kPa",
     "cpk": 1.47,
     "judge": "정상"
    },
    {
     "id": "r10gyg",
     "date": "2026-10-04",
     "char": "피어싱 홀 경",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "spec": "Ø8.0 ±0.1",
     "cpk": 1.69,
     "judge": "정상"
    },
    {
     "id": "r10gyh",
     "date": "2026-10-03",
     "char": "갭 균일도",
     "line": "조립 2",
     "part": "힌지 ASSY",
     "spec": "3.0 ±0.5",
     "cpk": 1.51,
     "judge": "정상"
    },
    {
     "id": "r10gyi",
     "date": "2026-10-02",
     "char": "사출 중량",
     "line": "사출 1",
     "part": "글로브박스",
     "spec": "312 ±3 g",
     "cpk": 1.28,
     "judge": "주의"
    },
    {
     "id": "r10gyj",
     "date": "2026-10-03",
     "char": "체결 토크",
     "line": "조립 1",
     "part": "배터리 트레이",
     "spec": "25 ±2 N·m",
     "cpk": 1.9,
     "judge": "정상"
    }
   ]
  },
  {
   "id": "measure",
   "name": "치수 측정",
   "desc": "관리 특성별 측정값 (히스토그램 · 공정능력 분석용)",
   "dateField": "date",
   "titleField": "lot",
   "fields": [
    {
     "key": "date",
     "label": "측정일",
     "type": "date",
     "req": true
    },
    {
     "key": "lot",
     "label": "로트",
     "type": "text",
     "req": true
    },
    {
     "key": "char",
     "label": "관리 특성",
     "type": "select",
     "options": [
      "브라켓 홀 위치 (mm)",
      "용접 너깃 지름 (mm)",
      "도장 막두께 (µm)"
     ],
     "colors": {
      "브라켓 홀 위치 (mm)": "blue",
      "용접 너깃 지름 (mm)": "orange",
      "도장 막두께 (µm)": "purple"
     }
    },
    {
     "key": "line",
     "label": "라인",
     "type": "ref",
     "ref": "lines",
     "single": true
    },
    {
     "key": "part",
     "label": "부품",
     "type": "ref",
     "ref": "parts",
     "single": true
    },
    {
     "key": "value",
     "label": "측정값",
     "type": "number"
    },
    {
     "key": "inspector",
     "label": "측정자",
     "type": "ref",
     "ref": "people",
     "single": true
    }
   ],
   "views": [],
   "records": [
    {
     "id": "ms0001",
     "date": "2026-05-11",
     "lot": "260511-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.98,
     "inspector": "한도윤"
    },
    {
     "id": "ms0002",
     "date": "2026-05-11",
     "lot": "260511-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.84,
     "inspector": "한도윤"
    },
    {
     "id": "ms0003",
     "date": "2026-05-12",
     "lot": "260512-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.049,
     "inspector": "한도윤"
    },
    {
     "id": "ms0004",
     "date": "2026-05-12",
     "lot": "260512-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.35,
     "inspector": "윤재호"
    },
    {
     "id": "ms0005",
     "date": "2026-05-12",
     "lot": "260512-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.15,
     "inspector": "한도윤"
    },
    {
     "id": "ms0006",
     "date": "2026-05-12",
     "lot": "260512-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 26.8,
     "inspector": "윤재호"
    },
    {
     "id": "ms0007",
     "date": "2026-05-12",
     "lot": "260512-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 32.2,
     "inspector": "윤재호"
    },
    {
     "id": "ms0008",
     "date": "2026-05-13",
     "lot": "260513-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.075,
     "inspector": "윤재호"
    },
    {
     "id": "ms0009",
     "date": "2026-05-13",
     "lot": "260513-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.22,
     "inspector": "윤재호"
    },
    {
     "id": "ms000a",
     "date": "2026-05-13",
     "lot": "260513-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 28.3,
     "inspector": "윤재호"
    },
    {
     "id": "ms000b",
     "date": "2026-05-13",
     "lot": "260513-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 29.6,
     "inspector": "윤재호"
    },
    {
     "id": "ms000c",
     "date": "2026-05-14",
     "lot": "260514-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.008,
     "inspector": "윤재호"
    },
    {
     "id": "ms000d",
     "date": "2026-05-14",
     "lot": "260514-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.19,
     "inspector": "오세린"
    },
    {
     "id": "ms000e",
     "date": "2026-05-14",
     "lot": "260514-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.27,
     "inspector": "오세린"
    },
    {
     "id": "ms000f",
     "date": "2026-05-14",
     "lot": "260514-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 27.8,
     "inspector": "한도윤"
    },
    {
     "id": "ms000g",
     "date": "2026-05-14",
     "lot": "260514-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 31.6,
     "inspector": "오세린"
    },
    {
     "id": "ms000h",
     "date": "2026-05-18",
     "lot": "260518-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.82,
     "inspector": "한도윤"
    },
    {
     "id": "ms000i",
     "date": "2026-05-18",
     "lot": "260518-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.7,
     "inspector": "윤재호"
    },
    {
     "id": "ms000j",
     "date": "2026-05-19",
     "lot": "260519-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.035,
     "inspector": "한도윤"
    },
    {
     "id": "ms000k",
     "date": "2026-05-19",
     "lot": "260519-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.13,
     "inspector": "오세린"
    },
    {
     "id": "ms000l",
     "date": "2026-05-19",
     "lot": "260519-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 28.4,
     "inspector": "한도윤"
    },
    {
     "id": "ms000m",
     "date": "2026-05-20",
     "lot": "260520-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.6,
     "inspector": "한도윤"
    },
    {
     "id": "ms000n",
     "date": "2026-05-20",
     "lot": "260520-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30,
     "inspector": "오세린"
    },
    {
     "id": "ms000o",
     "date": "2026-05-21",
     "lot": "260521-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 9.998,
     "inspector": "윤재호"
    },
    {
     "id": "ms000p",
     "date": "2026-05-21",
     "lot": "260521-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.85,
     "inspector": "윤재호"
    },
    {
     "id": "ms000q",
     "date": "2026-05-21",
     "lot": "260521-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 27.7,
     "inspector": "윤재호"
    },
    {
     "id": "ms000r",
     "date": "2026-05-22",
     "lot": "260522-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.038,
     "inspector": "윤재호"
    },
    {
     "id": "ms000s",
     "date": "2026-05-22",
     "lot": "260522-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.06,
     "inspector": "오세린"
    },
    {
     "id": "ms000t",
     "date": "2026-05-22",
     "lot": "260522-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 29.8,
     "inspector": "윤재호"
    },
    {
     "id": "ms000u",
     "date": "2026-05-25",
     "lot": "260525-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.033,
     "inspector": "한도윤"
    },
    {
     "id": "ms000v",
     "date": "2026-05-25",
     "lot": "260525-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.031,
     "inspector": "한도윤"
    },
    {
     "id": "ms000w",
     "date": "2026-05-25",
     "lot": "260525-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.55,
     "inspector": "오세린"
    },
    {
     "id": "ms000x",
     "date": "2026-05-25",
     "lot": "260525-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.32,
     "inspector": "오세린"
    },
    {
     "id": "ms000y",
     "date": "2026-05-25",
     "lot": "260525-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 34.1,
     "inspector": "한도윤"
    },
    {
     "id": "ms000z",
     "date": "2026-05-25",
     "lot": "260525-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 27.5,
     "inspector": "한도윤"
    },
    {
     "id": "ms0010",
     "date": "2026-05-26",
     "lot": "260526-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.007,
     "inspector": "윤재호"
    },
    {
     "id": "ms0011",
     "date": "2026-05-26",
     "lot": "260526-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.081,
     "inspector": "윤재호"
    },
    {
     "id": "ms0012",
     "date": "2026-05-26",
     "lot": "260526-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.48,
     "inspector": "오세린"
    },
    {
     "id": "ms0013",
     "date": "2026-05-26",
     "lot": "260526-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 34.8,
     "inspector": "윤재호"
    },
    {
     "id": "ms0014",
     "date": "2026-05-26",
     "lot": "260526-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 32.2,
     "inspector": "윤재호"
    },
    {
     "id": "ms0015",
     "date": "2026-05-27",
     "lot": "260527-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 9.979,
     "inspector": "윤재호"
    },
    {
     "id": "ms0016",
     "date": "2026-05-27",
     "lot": "260527-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 6.12,
     "inspector": "윤재호"
    },
    {
     "id": "ms0017",
     "date": "2026-05-27",
     "lot": "260527-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 34.1,
     "inspector": "한도윤"
    },
    {
     "id": "ms0018",
     "date": "2026-05-28",
     "lot": "260528-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.028,
     "inspector": "오세린"
    },
    {
     "id": "ms0019",
     "date": "2026-05-28",
     "lot": "260528-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.97,
     "inspector": "한도윤"
    },
    {
     "id": "ms001a",
     "date": "2026-05-28",
     "lot": "260528-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 29,
     "inspector": "오세린"
    },
    {
     "id": "ms001b",
     "date": "2026-05-29",
     "lot": "260529-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.029,
     "inspector": "한도윤"
    },
    {
     "id": "ms001c",
     "date": "2026-05-29",
     "lot": "260529-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 9.995,
     "inspector": "오세린"
    },
    {
     "id": "ms001d",
     "date": "2026-05-29",
     "lot": "260529-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.24,
     "inspector": "한도윤"
    },
    {
     "id": "ms001e",
     "date": "2026-05-29",
     "lot": "260529-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.15,
     "inspector": "오세린"
    },
    {
     "id": "ms001f",
     "date": "2026-05-29",
     "lot": "260529-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 32.1,
     "inspector": "한도윤"
    },
    {
     "id": "ms001g",
     "date": "2026-06-01",
     "lot": "260601-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.014,
     "inspector": "오세린"
    },
    {
     "id": "ms001h",
     "date": "2026-06-01",
     "lot": "260601-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 30.7,
     "inspector": "윤재호"
    },
    {
     "id": "ms001i",
     "date": "2026-06-01",
     "lot": "260601-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30.8,
     "inspector": "한도윤"
    },
    {
     "id": "ms001j",
     "date": "2026-06-02",
     "lot": "260602-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.033,
     "inspector": "윤재호"
    },
    {
     "id": "ms001k",
     "date": "2026-06-02",
     "lot": "260602-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.08,
     "inspector": "한도윤"
    },
    {
     "id": "ms001l",
     "date": "2026-06-03",
     "lot": "260603-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.091,
     "inspector": "오세린"
    },
    {
     "id": "ms001m",
     "date": "2026-06-03",
     "lot": "260603-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.077,
     "inspector": "오세린"
    },
    {
     "id": "ms001n",
     "date": "2026-06-04",
     "lot": "260604-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 9.99,
     "inspector": "오세린"
    },
    {
     "id": "ms001o",
     "date": "2026-06-05",
     "lot": "260605-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.019,
     "inspector": "윤재호"
    },
    {
     "id": "ms001p",
     "date": "2026-06-05",
     "lot": "260605-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.24,
     "inspector": "한도윤"
    },
    {
     "id": "ms001q",
     "date": "2026-06-08",
     "lot": "260608-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.67,
     "inspector": "오세린"
    },
    {
     "id": "ms001r",
     "date": "2026-06-09",
     "lot": "260609-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.7,
     "inspector": "오세린"
    },
    {
     "id": "ms001s",
     "date": "2026-06-09",
     "lot": "260609-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.15,
     "inspector": "오세린"
    },
    {
     "id": "ms001t",
     "date": "2026-06-09",
     "lot": "260609-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 32.6,
     "inspector": "윤재호"
    },
    {
     "id": "ms001u",
     "date": "2026-06-10",
     "lot": "260610-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.025,
     "inspector": "한도윤"
    },
    {
     "id": "ms001v",
     "date": "2026-06-10",
     "lot": "260610-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.013,
     "inspector": "오세린"
    },
    {
     "id": "ms001w",
     "date": "2026-06-10",
     "lot": "260610-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.78,
     "inspector": "한도윤"
    },
    {
     "id": "ms001x",
     "date": "2026-06-10",
     "lot": "260610-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30.3,
     "inspector": "한도윤"
    },
    {
     "id": "ms001y",
     "date": "2026-06-11",
     "lot": "260611-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.85,
     "inspector": "오세린"
    },
    {
     "id": "ms001z",
     "date": "2026-06-12",
     "lot": "260612-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 32.4,
     "inspector": "오세린"
    },
    {
     "id": "ms0020",
     "date": "2026-06-15",
     "lot": "260615-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 9.975,
     "inspector": "윤재호"
    },
    {
     "id": "ms0021",
     "date": "2026-06-15",
     "lot": "260615-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.06,
     "inspector": "윤재호"
    },
    {
     "id": "ms0022",
     "date": "2026-06-15",
     "lot": "260615-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 6.32,
     "inspector": "윤재호"
    },
    {
     "id": "ms0023",
     "date": "2026-06-15",
     "lot": "260615-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 32.3,
     "inspector": "윤재호"
    },
    {
     "id": "ms0024",
     "date": "2026-06-16",
     "lot": "260616-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 9.997,
     "inspector": "오세린"
    },
    {
     "id": "ms0025",
     "date": "2026-06-17",
     "lot": "260617-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 9.971,
     "inspector": "오세린"
    },
    {
     "id": "ms0026",
     "date": "2026-06-17",
     "lot": "260617-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.02,
     "inspector": "오세린"
    },
    {
     "id": "ms0027",
     "date": "2026-06-17",
     "lot": "260617-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.77,
     "inspector": "윤재호"
    },
    {
     "id": "ms0028",
     "date": "2026-06-17",
     "lot": "260617-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 5.97,
     "inspector": "한도윤"
    },
    {
     "id": "ms0029",
     "date": "2026-06-17",
     "lot": "260617-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30.6,
     "inspector": "오세린"
    },
    {
     "id": "ms002a",
     "date": "2026-06-18",
     "lot": "260618-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.02,
     "inspector": "윤재호"
    },
    {
     "id": "ms002b",
     "date": "2026-06-18",
     "lot": "260618-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.95,
     "inspector": "오세린"
    },
    {
     "id": "ms002c",
     "date": "2026-06-18",
     "lot": "260618-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.96,
     "inspector": "한도윤"
    },
    {
     "id": "ms002d",
     "date": "2026-06-18",
     "lot": "260618-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 33.1,
     "inspector": "윤재호"
    },
    {
     "id": "ms002e",
     "date": "2026-06-18",
     "lot": "260618-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 27.6,
     "inspector": "오세린"
    },
    {
     "id": "ms002f",
     "date": "2026-06-19",
     "lot": "260619-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.02,
     "inspector": "윤재호"
    },
    {
     "id": "ms002g",
     "date": "2026-06-19",
     "lot": "260619-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.57,
     "inspector": "윤재호"
    },
    {
     "id": "ms002h",
     "date": "2026-06-19",
     "lot": "260619-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.14,
     "inspector": "윤재호"
    },
    {
     "id": "ms002i",
     "date": "2026-06-19",
     "lot": "260619-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 34.6,
     "inspector": "윤재호"
    },
    {
     "id": "ms002j",
     "date": "2026-06-19",
     "lot": "260619-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 27.8,
     "inspector": "한도윤"
    },
    {
     "id": "ms002k",
     "date": "2026-06-22",
     "lot": "260622-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.045,
     "inspector": "윤재호"
    },
    {
     "id": "ms002l",
     "date": "2026-06-22",
     "lot": "260622-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 32.1,
     "inspector": "오세린"
    },
    {
     "id": "ms002m",
     "date": "2026-06-22",
     "lot": "260622-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 33.6,
     "inspector": "윤재호"
    },
    {
     "id": "ms002n",
     "date": "2026-06-23",
     "lot": "260623-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.042,
     "inspector": "오세린"
    },
    {
     "id": "ms002o",
     "date": "2026-06-23",
     "lot": "260623-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.088,
     "inspector": "오세린"
    },
    {
     "id": "ms002p",
     "date": "2026-06-23",
     "lot": "260623-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.09,
     "inspector": "윤재호"
    },
    {
     "id": "ms002q",
     "date": "2026-06-23",
     "lot": "260623-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 27.3,
     "inspector": "윤재호"
    },
    {
     "id": "ms002r",
     "date": "2026-06-23",
     "lot": "260623-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 35.6,
     "inspector": "한도윤"
    },
    {
     "id": "ms002s",
     "date": "2026-06-24",
     "lot": "260624-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.89,
     "inspector": "한도윤"
    },
    {
     "id": "ms002t",
     "date": "2026-06-24",
     "lot": "260624-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.68,
     "inspector": "오세린"
    },
    {
     "id": "ms002u",
     "date": "2026-06-25",
     "lot": "260625-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.02,
     "inspector": "윤재호"
    },
    {
     "id": "ms002v",
     "date": "2026-06-25",
     "lot": "260625-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 9.921,
     "inspector": "오세린"
    },
    {
     "id": "ms002w",
     "date": "2026-06-25",
     "lot": "260625-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 33.6,
     "inspector": "한도윤"
    },
    {
     "id": "ms002x",
     "date": "2026-06-26",
     "lot": "260626-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.041,
     "inspector": "윤재호"
    },
    {
     "id": "ms002y",
     "date": "2026-06-29",
     "lot": "260629-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 27.9,
     "inspector": "오세린"
    },
    {
     "id": "ms002z",
     "date": "2026-06-29",
     "lot": "260629-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 30.9,
     "inspector": "오세린"
    },
    {
     "id": "ms0030",
     "date": "2026-06-30",
     "lot": "260630-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 9.983,
     "inspector": "한도윤"
    },
    {
     "id": "ms0031",
     "date": "2026-06-30",
     "lot": "260630-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.43,
     "inspector": "오세린"
    },
    {
     "id": "ms0032",
     "date": "2026-06-30",
     "lot": "260630-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 28.9,
     "inspector": "오세린"
    },
    {
     "id": "ms0033",
     "date": "2026-07-01",
     "lot": "260701-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.024,
     "inspector": "오세린"
    },
    {
     "id": "ms0034",
     "date": "2026-07-01",
     "lot": "260701-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.33,
     "inspector": "오세린"
    },
    {
     "id": "ms0035",
     "date": "2026-07-01",
     "lot": "260701-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 32.8,
     "inspector": "오세린"
    },
    {
     "id": "ms0036",
     "date": "2026-07-02",
     "lot": "260702-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.05,
     "inspector": "오세린"
    },
    {
     "id": "ms0037",
     "date": "2026-07-02",
     "lot": "260702-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.004,
     "inspector": "윤재호"
    },
    {
     "id": "ms0038",
     "date": "2026-07-02",
     "lot": "260702-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.19,
     "inspector": "윤재호"
    },
    {
     "id": "ms0039",
     "date": "2026-07-03",
     "lot": "260703-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 5.78,
     "inspector": "한도윤"
    },
    {
     "id": "ms003a",
     "date": "2026-07-03",
     "lot": "260703-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.19,
     "inspector": "오세린"
    },
    {
     "id": "ms003b",
     "date": "2026-07-03",
     "lot": "260703-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 32.2,
     "inspector": "윤재호"
    },
    {
     "id": "ms003c",
     "date": "2026-07-03",
     "lot": "260703-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 33.4,
     "inspector": "오세린"
    },
    {
     "id": "ms003d",
     "date": "2026-07-06",
     "lot": "260706-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 9.997,
     "inspector": "오세린"
    },
    {
     "id": "ms003e",
     "date": "2026-07-06",
     "lot": "260706-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 35.7,
     "inspector": "한도윤"
    },
    {
     "id": "ms003f",
     "date": "2026-07-06",
     "lot": "260706-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 25.7,
     "inspector": "한도윤"
    },
    {
     "id": "ms003g",
     "date": "2026-07-07",
     "lot": "260707-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.02,
     "inspector": "윤재호"
    },
    {
     "id": "ms003h",
     "date": "2026-07-07",
     "lot": "260707-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.12,
     "inspector": "한도윤"
    },
    {
     "id": "ms003i",
     "date": "2026-07-07",
     "lot": "260707-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.86,
     "inspector": "한도윤"
    },
    {
     "id": "ms003j",
     "date": "2026-07-07",
     "lot": "260707-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 29.6,
     "inspector": "윤재호"
    },
    {
     "id": "ms003k",
     "date": "2026-07-08",
     "lot": "260708-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.69,
     "inspector": "윤재호"
    },
    {
     "id": "ms003l",
     "date": "2026-07-08",
     "lot": "260708-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.5,
     "inspector": "한도윤"
    },
    {
     "id": "ms003m",
     "date": "2026-07-08",
     "lot": "260708-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 30.2,
     "inspector": "윤재호"
    },
    {
     "id": "ms003n",
     "date": "2026-07-09",
     "lot": "260709-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.074,
     "inspector": "오세린"
    },
    {
     "id": "ms003o",
     "date": "2026-07-09",
     "lot": "260709-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.008,
     "inspector": "오세린"
    },
    {
     "id": "ms003p",
     "date": "2026-07-09",
     "lot": "260709-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.08,
     "inspector": "윤재호"
    },
    {
     "id": "ms003q",
     "date": "2026-07-09",
     "lot": "260709-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 27.1,
     "inspector": "윤재호"
    },
    {
     "id": "ms003r",
     "date": "2026-07-09",
     "lot": "260709-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 28.4,
     "inspector": "한도윤"
    },
    {
     "id": "ms003s",
     "date": "2026-07-10",
     "lot": "260710-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 35.8,
     "inspector": "윤재호"
    },
    {
     "id": "ms003t",
     "date": "2026-07-13",
     "lot": "260713-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.053,
     "inspector": "한도윤"
    },
    {
     "id": "ms003u",
     "date": "2026-07-13",
     "lot": "260713-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.68,
     "inspector": "윤재호"
    },
    {
     "id": "ms003v",
     "date": "2026-07-13",
     "lot": "260713-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.42,
     "inspector": "한도윤"
    },
    {
     "id": "ms003w",
     "date": "2026-07-14",
     "lot": "260714-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.013,
     "inspector": "윤재호"
    },
    {
     "id": "ms003x",
     "date": "2026-07-14",
     "lot": "260714-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 9.989,
     "inspector": "한도윤"
    },
    {
     "id": "ms003y",
     "date": "2026-07-14",
     "lot": "260714-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.55,
     "inspector": "윤재호"
    },
    {
     "id": "ms003z",
     "date": "2026-07-14",
     "lot": "260714-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.63,
     "inspector": "윤재호"
    },
    {
     "id": "ms0040",
     "date": "2026-07-16",
     "lot": "260716-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.042,
     "inspector": "한도윤"
    },
    {
     "id": "ms0041",
     "date": "2026-07-16",
     "lot": "260716-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30,
     "inspector": "오세린"
    },
    {
     "id": "ms0042",
     "date": "2026-07-16",
     "lot": "260716-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 31.8,
     "inspector": "윤재호"
    },
    {
     "id": "ms0043",
     "date": "2026-07-17",
     "lot": "260717-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.022,
     "inspector": "윤재호"
    },
    {
     "id": "ms0044",
     "date": "2026-07-17",
     "lot": "260717-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.17,
     "inspector": "오세린"
    },
    {
     "id": "ms0045",
     "date": "2026-07-17",
     "lot": "260717-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 28.8,
     "inspector": "윤재호"
    },
    {
     "id": "ms0046",
     "date": "2026-07-20",
     "lot": "260720-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 5.65,
     "inspector": "오세린"
    },
    {
     "id": "ms0047",
     "date": "2026-07-20",
     "lot": "260720-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 30.9,
     "inspector": "한도윤"
    },
    {
     "id": "ms0048",
     "date": "2026-07-21",
     "lot": "260721-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.54,
     "inspector": "한도윤"
    },
    {
     "id": "ms0049",
     "date": "2026-07-21",
     "lot": "260721-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 24.9,
     "inspector": "오세린"
    },
    {
     "id": "ms004a",
     "date": "2026-07-22",
     "lot": "260722-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.06,
     "inspector": "윤재호"
    },
    {
     "id": "ms004b",
     "date": "2026-07-22",
     "lot": "260722-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.01,
     "inspector": "윤재호"
    },
    {
     "id": "ms004c",
     "date": "2026-07-22",
     "lot": "260722-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30.4,
     "inspector": "한도윤"
    },
    {
     "id": "ms004d",
     "date": "2026-07-23",
     "lot": "260723-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.065,
     "inspector": "한도윤"
    },
    {
     "id": "ms004e",
     "date": "2026-07-23",
     "lot": "260723-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.069,
     "inspector": "한도윤"
    },
    {
     "id": "ms004f",
     "date": "2026-07-23",
     "lot": "260723-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.88,
     "inspector": "한도윤"
    },
    {
     "id": "ms004g",
     "date": "2026-07-23",
     "lot": "260723-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 31.9,
     "inspector": "오세린"
    },
    {
     "id": "ms004h",
     "date": "2026-07-24",
     "lot": "260724-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.033,
     "inspector": "윤재호"
    },
    {
     "id": "ms004i",
     "date": "2026-07-24",
     "lot": "260724-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.25,
     "inspector": "오세린"
    },
    {
     "id": "ms004j",
     "date": "2026-07-24",
     "lot": "260724-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.52,
     "inspector": "오세린"
    },
    {
     "id": "ms004k",
     "date": "2026-07-27",
     "lot": "260727-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.035,
     "inspector": "한도윤"
    },
    {
     "id": "ms004l",
     "date": "2026-07-27",
     "lot": "260727-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.034,
     "inspector": "한도윤"
    },
    {
     "id": "ms004m",
     "date": "2026-07-27",
     "lot": "260727-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.57,
     "inspector": "오세린"
    },
    {
     "id": "ms004n",
     "date": "2026-07-28",
     "lot": "260728-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.013,
     "inspector": "윤재호"
    },
    {
     "id": "ms004o",
     "date": "2026-07-28",
     "lot": "260728-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.65,
     "inspector": "오세린"
    },
    {
     "id": "ms004p",
     "date": "2026-07-28",
     "lot": "260728-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 32.2,
     "inspector": "오세린"
    },
    {
     "id": "ms004q",
     "date": "2026-07-28",
     "lot": "260728-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 32.5,
     "inspector": "윤재호"
    },
    {
     "id": "ms004r",
     "date": "2026-07-29",
     "lot": "260729-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.065,
     "inspector": "한도윤"
    },
    {
     "id": "ms004s",
     "date": "2026-07-29",
     "lot": "260729-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 30.1,
     "inspector": "윤재호"
    },
    {
     "id": "ms004t",
     "date": "2026-07-29",
     "lot": "260729-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 34,
     "inspector": "윤재호"
    },
    {
     "id": "ms004u",
     "date": "2026-07-30",
     "lot": "260730-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 9.94,
     "inspector": "윤재호"
    },
    {
     "id": "ms004v",
     "date": "2026-07-30",
     "lot": "260730-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.44,
     "inspector": "한도윤"
    },
    {
     "id": "ms004w",
     "date": "2026-07-30",
     "lot": "260730-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.98,
     "inspector": "한도윤"
    },
    {
     "id": "ms004x",
     "date": "2026-07-30",
     "lot": "260730-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 31,
     "inspector": "한도윤"
    },
    {
     "id": "ms004y",
     "date": "2026-07-31",
     "lot": "260731-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.004,
     "inspector": "한도윤"
    },
    {
     "id": "ms004z",
     "date": "2026-07-31",
     "lot": "260731-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.001,
     "inspector": "한도윤"
    },
    {
     "id": "ms0050",
     "date": "2026-07-31",
     "lot": "260731-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.09,
     "inspector": "윤재호"
    },
    {
     "id": "ms0051",
     "date": "2026-07-31",
     "lot": "260731-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 31.3,
     "inspector": "오세린"
    },
    {
     "id": "ms0052",
     "date": "2026-08-03",
     "lot": "260803-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.059,
     "inspector": "윤재호"
    },
    {
     "id": "ms0053",
     "date": "2026-08-04",
     "lot": "260804-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 9.969,
     "inspector": "윤재호"
    },
    {
     "id": "ms0054",
     "date": "2026-08-04",
     "lot": "260804-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.64,
     "inspector": "오세린"
    },
    {
     "id": "ms0055",
     "date": "2026-08-04",
     "lot": "260804-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 5.88,
     "inspector": "윤재호"
    },
    {
     "id": "ms0056",
     "date": "2026-08-04",
     "lot": "260804-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 31.7,
     "inspector": "오세린"
    },
    {
     "id": "ms0057",
     "date": "2026-08-04",
     "lot": "260804-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 28.3,
     "inspector": "한도윤"
    },
    {
     "id": "ms0058",
     "date": "2026-08-05",
     "lot": "260805-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.018,
     "inspector": "오세린"
    },
    {
     "id": "ms0059",
     "date": "2026-08-05",
     "lot": "260805-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 5.96,
     "inspector": "윤재호"
    },
    {
     "id": "ms005a",
     "date": "2026-08-05",
     "lot": "260805-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 28.9,
     "inspector": "한도윤"
    },
    {
     "id": "ms005b",
     "date": "2026-08-06",
     "lot": "260806-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.07,
     "inspector": "윤재호"
    },
    {
     "id": "ms005c",
     "date": "2026-08-06",
     "lot": "260806-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 35.8,
     "inspector": "오세린"
    },
    {
     "id": "ms005d",
     "date": "2026-08-07",
     "lot": "260807-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 9.927,
     "inspector": "윤재호"
    },
    {
     "id": "ms005e",
     "date": "2026-08-07",
     "lot": "260807-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.92,
     "inspector": "한도윤"
    },
    {
     "id": "ms005f",
     "date": "2026-08-07",
     "lot": "260807-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.13,
     "inspector": "한도윤"
    },
    {
     "id": "ms005g",
     "date": "2026-08-07",
     "lot": "260807-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 26.5,
     "inspector": "오세린"
    },
    {
     "id": "ms005h",
     "date": "2026-08-10",
     "lot": "260810-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.074,
     "inspector": "오세린"
    },
    {
     "id": "ms005i",
     "date": "2026-08-10",
     "lot": "260810-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.14,
     "inspector": "한도윤"
    },
    {
     "id": "ms005j",
     "date": "2026-08-11",
     "lot": "260811-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.064,
     "inspector": "오세린"
    },
    {
     "id": "ms005k",
     "date": "2026-08-11",
     "lot": "260811-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 35.6,
     "inspector": "윤재호"
    },
    {
     "id": "ms005l",
     "date": "2026-08-12",
     "lot": "260812-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 9.995,
     "inspector": "오세린"
    },
    {
     "id": "ms005m",
     "date": "2026-08-12",
     "lot": "260812-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.05,
     "inspector": "윤재호"
    },
    {
     "id": "ms005n",
     "date": "2026-08-12",
     "lot": "260812-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 31.3,
     "inspector": "한도윤"
    },
    {
     "id": "ms005o",
     "date": "2026-08-12",
     "lot": "260812-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30.2,
     "inspector": "오세린"
    },
    {
     "id": "ms005p",
     "date": "2026-08-13",
     "lot": "260813-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.044,
     "inspector": "윤재호"
    },
    {
     "id": "ms005q",
     "date": "2026-08-13",
     "lot": "260813-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 39.3,
     "inspector": "한도윤"
    },
    {
     "id": "ms005r",
     "date": "2026-08-13",
     "lot": "260813-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 28.8,
     "inspector": "오세린"
    },
    {
     "id": "ms005s",
     "date": "2026-08-14",
     "lot": "260814-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 6.07,
     "inspector": "윤재호"
    },
    {
     "id": "ms005t",
     "date": "2026-08-14",
     "lot": "260814-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 31.3,
     "inspector": "윤재호"
    },
    {
     "id": "ms005u",
     "date": "2026-08-14",
     "lot": "260814-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 30.3,
     "inspector": "오세린"
    },
    {
     "id": "ms005v",
     "date": "2026-08-17",
     "lot": "260817-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.055,
     "inspector": "오세린"
    },
    {
     "id": "ms005w",
     "date": "2026-08-17",
     "lot": "260817-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.029,
     "inspector": "한도윤"
    },
    {
     "id": "ms005x",
     "date": "2026-08-17",
     "lot": "260817-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 6.01,
     "inspector": "오세린"
    },
    {
     "id": "ms005y",
     "date": "2026-08-17",
     "lot": "260817-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.31,
     "inspector": "윤재호"
    },
    {
     "id": "ms005z",
     "date": "2026-08-17",
     "lot": "260817-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 34.3,
     "inspector": "한도윤"
    },
    {
     "id": "ms0060",
     "date": "2026-08-17",
     "lot": "260817-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30.8,
     "inspector": "오세린"
    },
    {
     "id": "ms0061",
     "date": "2026-08-18",
     "lot": "260818-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.56,
     "inspector": "오세린"
    },
    {
     "id": "ms0062",
     "date": "2026-08-18",
     "lot": "260818-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 29.2,
     "inspector": "윤재호"
    },
    {
     "id": "ms0063",
     "date": "2026-08-18",
     "lot": "260818-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 31.4,
     "inspector": "오세린"
    },
    {
     "id": "ms0064",
     "date": "2026-08-19",
     "lot": "260819-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.41,
     "inspector": "한도윤"
    },
    {
     "id": "ms0065",
     "date": "2026-08-19",
     "lot": "260819-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 32.4,
     "inspector": "오세린"
    },
    {
     "id": "ms0066",
     "date": "2026-08-20",
     "lot": "260820-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 9.976,
     "inspector": "오세린"
    },
    {
     "id": "ms0067",
     "date": "2026-08-20",
     "lot": "260820-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.021,
     "inspector": "한도윤"
    },
    {
     "id": "ms0068",
     "date": "2026-08-21",
     "lot": "260821-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.025,
     "inspector": "오세린"
    },
    {
     "id": "ms0069",
     "date": "2026-08-21",
     "lot": "260821-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.07,
     "inspector": "윤재호"
    },
    {
     "id": "ms006a",
     "date": "2026-08-21",
     "lot": "260821-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 32.1,
     "inspector": "오세린"
    },
    {
     "id": "ms006b",
     "date": "2026-08-24",
     "lot": "260824-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.81,
     "inspector": "한도윤"
    },
    {
     "id": "ms006c",
     "date": "2026-08-24",
     "lot": "260824-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 29.1,
     "inspector": "한도윤"
    },
    {
     "id": "ms006d",
     "date": "2026-08-24",
     "lot": "260824-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 29.3,
     "inspector": "오세린"
    },
    {
     "id": "ms006e",
     "date": "2026-08-25",
     "lot": "260825-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.023,
     "inspector": "오세린"
    },
    {
     "id": "ms006f",
     "date": "2026-08-25",
     "lot": "260825-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.87,
     "inspector": "한도윤"
    },
    {
     "id": "ms006g",
     "date": "2026-08-25",
     "lot": "260825-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 31.3,
     "inspector": "오세린"
    },
    {
     "id": "ms006h",
     "date": "2026-08-25",
     "lot": "260825-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 28.2,
     "inspector": "윤재호"
    },
    {
     "id": "ms006i",
     "date": "2026-08-26",
     "lot": "260826-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.011,
     "inspector": "윤재호"
    },
    {
     "id": "ms006j",
     "date": "2026-08-27",
     "lot": "260827-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.014,
     "inspector": "오세린"
    },
    {
     "id": "ms006k",
     "date": "2026-08-27",
     "lot": "260827-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.69,
     "inspector": "오세린"
    },
    {
     "id": "ms006l",
     "date": "2026-08-27",
     "lot": "260827-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 29.9,
     "inspector": "윤재호"
    },
    {
     "id": "ms006m",
     "date": "2026-08-28",
     "lot": "260828-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.012,
     "inspector": "윤재호"
    },
    {
     "id": "ms006n",
     "date": "2026-08-28",
     "lot": "260828-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.033,
     "inspector": "윤재호"
    },
    {
     "id": "ms006o",
     "date": "2026-08-28",
     "lot": "260828-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.89,
     "inspector": "윤재호"
    },
    {
     "id": "ms006p",
     "date": "2026-08-28",
     "lot": "260828-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 29.1,
     "inspector": "윤재호"
    },
    {
     "id": "ms006q",
     "date": "2026-08-28",
     "lot": "260828-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 31.7,
     "inspector": "오세린"
    },
    {
     "id": "ms006r",
     "date": "2026-08-31",
     "lot": "260831-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.87,
     "inspector": "한도윤"
    },
    {
     "id": "ms006s",
     "date": "2026-08-31",
     "lot": "260831-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30.5,
     "inspector": "오세린"
    },
    {
     "id": "ms006t",
     "date": "2026-08-31",
     "lot": "260831-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30.1,
     "inspector": "윤재호"
    },
    {
     "id": "ms006u",
     "date": "2026-09-01",
     "lot": "260901-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 29.6,
     "inspector": "윤재호"
    },
    {
     "id": "ms006v",
     "date": "2026-09-02",
     "lot": "260902-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.016,
     "inspector": "오세린"
    },
    {
     "id": "ms006w",
     "date": "2026-09-02",
     "lot": "260902-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.48,
     "inspector": "한도윤"
    },
    {
     "id": "ms006x",
     "date": "2026-09-03",
     "lot": "260903-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.018,
     "inspector": "한도윤"
    },
    {
     "id": "ms006y",
     "date": "2026-09-03",
     "lot": "260903-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 5.89,
     "inspector": "윤재호"
    },
    {
     "id": "ms006z",
     "date": "2026-09-03",
     "lot": "260903-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.33,
     "inspector": "윤재호"
    },
    {
     "id": "ms0070",
     "date": "2026-09-04",
     "lot": "260904-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.103,
     "inspector": "윤재호"
    },
    {
     "id": "ms0071",
     "date": "2026-09-04",
     "lot": "260904-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 5.69,
     "inspector": "윤재호"
    },
    {
     "id": "ms0072",
     "date": "2026-09-04",
     "lot": "260904-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.08,
     "inspector": "오세린"
    },
    {
     "id": "ms0073",
     "date": "2026-09-04",
     "lot": "260904-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 33.3,
     "inspector": "윤재호"
    },
    {
     "id": "ms0074",
     "date": "2026-09-07",
     "lot": "260907-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.112,
     "inspector": "한도윤"
    },
    {
     "id": "ms0075",
     "date": "2026-09-07",
     "lot": "260907-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.13,
     "inspector": "오세린"
    },
    {
     "id": "ms0076",
     "date": "2026-09-07",
     "lot": "260907-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 32.9,
     "inspector": "한도윤"
    },
    {
     "id": "ms0077",
     "date": "2026-09-08",
     "lot": "260908-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.07,
     "inspector": "오세린"
    },
    {
     "id": "ms0078",
     "date": "2026-09-08",
     "lot": "260908-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10,
     "inspector": "오세린"
    },
    {
     "id": "ms0079",
     "date": "2026-09-08",
     "lot": "260908-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.54,
     "inspector": "오세린"
    },
    {
     "id": "ms007a",
     "date": "2026-09-08",
     "lot": "260908-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 30.6,
     "inspector": "한도윤"
    },
    {
     "id": "ms007b",
     "date": "2026-09-09",
     "lot": "260909-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.29,
     "inspector": "윤재호"
    },
    {
     "id": "ms007c",
     "date": "2026-09-09",
     "lot": "260909-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.14,
     "inspector": "한도윤"
    },
    {
     "id": "ms007d",
     "date": "2026-09-10",
     "lot": "260910-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.057,
     "inspector": "오세린"
    },
    {
     "id": "ms007e",
     "date": "2026-09-10",
     "lot": "260910-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 35.1,
     "inspector": "윤재호"
    },
    {
     "id": "ms007f",
     "date": "2026-09-10",
     "lot": "260910-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 33.7,
     "inspector": "오세린"
    },
    {
     "id": "ms007g",
     "date": "2026-09-11",
     "lot": "260911-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.019,
     "inspector": "윤재호"
    },
    {
     "id": "ms007h",
     "date": "2026-09-11",
     "lot": "260911-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.04,
     "inspector": "오세린"
    },
    {
     "id": "ms007i",
     "date": "2026-09-11",
     "lot": "260911-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 31.5,
     "inspector": "한도윤"
    },
    {
     "id": "ms007j",
     "date": "2026-09-11",
     "lot": "260911-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 29.6,
     "inspector": "오세린"
    },
    {
     "id": "ms007k",
     "date": "2026-09-14",
     "lot": "260914-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.009,
     "inspector": "한도윤"
    },
    {
     "id": "ms007l",
     "date": "2026-09-14",
     "lot": "260914-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 6.14,
     "inspector": "윤재호"
    },
    {
     "id": "ms007m",
     "date": "2026-09-14",
     "lot": "260914-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 6.17,
     "inspector": "오세린"
    },
    {
     "id": "ms007n",
     "date": "2026-09-14",
     "lot": "260914-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 30.5,
     "inspector": "윤재호"
    },
    {
     "id": "ms007o",
     "date": "2026-09-15",
     "lot": "260915-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.001,
     "inspector": "한도윤"
    },
    {
     "id": "ms007p",
     "date": "2026-09-15",
     "lot": "260915-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 9.984,
     "inspector": "오세린"
    },
    {
     "id": "ms007q",
     "date": "2026-09-15",
     "lot": "260915-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 5.42,
     "inspector": "한도윤"
    },
    {
     "id": "ms007r",
     "date": "2026-09-15",
     "lot": "260915-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 29.4,
     "inspector": "한도윤"
    },
    {
     "id": "ms007s",
     "date": "2026-09-16",
     "lot": "260916-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.025,
     "inspector": "오세린"
    },
    {
     "id": "ms007t",
     "date": "2026-09-16",
     "lot": "260916-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.083,
     "inspector": "한도윤"
    },
    {
     "id": "ms007u",
     "date": "2026-09-16",
     "lot": "260916-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.43,
     "inspector": "한도윤"
    },
    {
     "id": "ms007v",
     "date": "2026-09-16",
     "lot": "260916-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 5.73,
     "inspector": "한도윤"
    },
    {
     "id": "ms007w",
     "date": "2026-09-17",
     "lot": "260917-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.009,
     "inspector": "윤재호"
    },
    {
     "id": "ms007x",
     "date": "2026-09-17",
     "lot": "260917-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 9.957,
     "inspector": "오세린"
    },
    {
     "id": "ms007y",
     "date": "2026-09-17",
     "lot": "260917-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 6.38,
     "inspector": "한도윤"
    },
    {
     "id": "ms007z",
     "date": "2026-09-17",
     "lot": "260917-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30.4,
     "inspector": "오세린"
    },
    {
     "id": "ms0080",
     "date": "2026-09-18",
     "lot": "260918-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.087,
     "inspector": "윤재호"
    },
    {
     "id": "ms0081",
     "date": "2026-09-18",
     "lot": "260918-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.06,
     "inspector": "윤재호"
    },
    {
     "id": "ms0082",
     "date": "2026-09-18",
     "lot": "260918-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.6,
     "inspector": "오세린"
    },
    {
     "id": "ms0083",
     "date": "2026-09-18",
     "lot": "260918-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 28,
     "inspector": "한도윤"
    },
    {
     "id": "ms0084",
     "date": "2026-09-21",
     "lot": "260921-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.078,
     "inspector": "한도윤"
    },
    {
     "id": "ms0085",
     "date": "2026-09-21",
     "lot": "260921-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.2,
     "inspector": "윤재호"
    },
    {
     "id": "ms0086",
     "date": "2026-09-21",
     "lot": "260921-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 33,
     "inspector": "오세린"
    },
    {
     "id": "ms0087",
     "date": "2026-09-22",
     "lot": "260922-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.064,
     "inspector": "오세린"
    },
    {
     "id": "ms0088",
     "date": "2026-09-22",
     "lot": "260922-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 5.5,
     "inspector": "윤재호"
    },
    {
     "id": "ms0089",
     "date": "2026-09-22",
     "lot": "260922-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.17,
     "inspector": "오세린"
    },
    {
     "id": "ms008a",
     "date": "2026-09-22",
     "lot": "260922-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 33.3,
     "inspector": "윤재호"
    },
    {
     "id": "ms008b",
     "date": "2026-09-22",
     "lot": "260922-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 30,
     "inspector": "윤재호"
    },
    {
     "id": "ms008c",
     "date": "2026-09-23",
     "lot": "260923-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.036,
     "inspector": "윤재호"
    },
    {
     "id": "ms008d",
     "date": "2026-09-23",
     "lot": "260923-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 9.969,
     "inspector": "한도윤"
    },
    {
     "id": "ms008e",
     "date": "2026-09-23",
     "lot": "260923-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.36,
     "inspector": "오세린"
    },
    {
     "id": "ms008f",
     "date": "2026-09-23",
     "lot": "260923-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.71,
     "inspector": "오세린"
    },
    {
     "id": "ms008g",
     "date": "2026-09-23",
     "lot": "260923-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 29.7,
     "inspector": "한도윤"
    },
    {
     "id": "ms008h",
     "date": "2026-09-23",
     "lot": "260923-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 37.1,
     "inspector": "윤재호"
    },
    {
     "id": "ms008i",
     "date": "2026-09-24",
     "lot": "260924-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 33.3,
     "inspector": "한도윤"
    },
    {
     "id": "ms008j",
     "date": "2026-09-24",
     "lot": "260924-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 34.1,
     "inspector": "윤재호"
    },
    {
     "id": "ms008k",
     "date": "2026-09-25",
     "lot": "260925-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.61,
     "inspector": "오세린"
    },
    {
     "id": "ms008l",
     "date": "2026-09-25",
     "lot": "260925-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 5.28,
     "inspector": "윤재호"
    },
    {
     "id": "ms008m",
     "date": "2026-09-25",
     "lot": "260925-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 30,
     "inspector": "한도윤"
    },
    {
     "id": "ms008n",
     "date": "2026-09-25",
     "lot": "260925-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 31,
     "inspector": "한도윤"
    },
    {
     "id": "ms008o",
     "date": "2026-09-28",
     "lot": "260928-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 6.26,
     "inspector": "한도윤"
    },
    {
     "id": "ms008p",
     "date": "2026-09-28",
     "lot": "260928-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 29.4,
     "inspector": "오세린"
    },
    {
     "id": "ms008q",
     "date": "2026-09-29",
     "lot": "260929-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.02,
     "inspector": "오세린"
    },
    {
     "id": "ms008r",
     "date": "2026-09-29",
     "lot": "260929-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.17,
     "inspector": "한도윤"
    },
    {
     "id": "ms008s",
     "date": "2026-09-29",
     "lot": "260929-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6.17,
     "inspector": "한도윤"
    },
    {
     "id": "ms008t",
     "date": "2026-09-29",
     "lot": "260929-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 30.8,
     "inspector": "오세린"
    },
    {
     "id": "ms008u",
     "date": "2026-09-30",
     "lot": "260930-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "브라켓 BRK-1830",
     "value": 10.007,
     "inspector": "오세린"
    },
    {
     "id": "ms008v",
     "date": "2026-09-30",
     "lot": "260930-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.26,
     "inspector": "오세린"
    },
    {
     "id": "ms008w",
     "date": "2026-09-30",
     "lot": "260930-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "범퍼 빔",
     "value": 6,
     "inspector": "오세린"
    },
    {
     "id": "ms008x",
     "date": "2026-10-01",
     "lot": "261001-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.045,
     "inspector": "한도윤"
    },
    {
     "id": "ms008y",
     "date": "2026-10-01",
     "lot": "261001-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 32.9,
     "inspector": "오세린"
    },
    {
     "id": "ms008z",
     "date": "2026-10-01",
     "lot": "261001-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 31.1,
     "inspector": "윤재호"
    },
    {
     "id": "ms0090",
     "date": "2026-10-02",
     "lot": "261002-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.02,
     "inspector": "오세린"
    },
    {
     "id": "ms0091",
     "date": "2026-10-02",
     "lot": "261002-A2",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.094,
     "inspector": "윤재호"
    },
    {
     "id": "ms0092",
     "date": "2026-10-02",
     "lot": "261002-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 2",
     "part": "배터리 트레이",
     "value": 5.74,
     "inspector": "윤재호"
    },
    {
     "id": "ms0093",
     "date": "2026-10-02",
     "lot": "261002-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.3,
     "inspector": "한도윤"
    },
    {
     "id": "ms0094",
     "date": "2026-10-02",
     "lot": "261002-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "도어 트림",
     "value": 28.5,
     "inspector": "오세린"
    },
    {
     "id": "ms0095",
     "date": "2026-10-05",
     "lot": "261005-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.055,
     "inspector": "오세린"
    },
    {
     "id": "ms0096",
     "date": "2026-10-05",
     "lot": "261005-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.02,
     "inspector": "윤재호"
    },
    {
     "id": "ms0097",
     "date": "2026-10-05",
     "lot": "261005-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.59,
     "inspector": "윤재호"
    },
    {
     "id": "ms0098",
     "date": "2026-10-05",
     "lot": "261005-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 32.5,
     "inspector": "윤재호"
    },
    {
     "id": "ms0099",
     "date": "2026-10-06",
     "lot": "261006-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "브라켓 BRK-1830",
     "value": 10.042,
     "inspector": "한도윤"
    },
    {
     "id": "ms009a",
     "date": "2026-10-06",
     "lot": "261006-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "범퍼 빔",
     "value": 5.89,
     "inspector": "한도윤"
    },
    {
     "id": "ms009b",
     "date": "2026-10-06",
     "lot": "261006-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.3,
     "inspector": "오세린"
    },
    {
     "id": "ms009c",
     "date": "2026-10-07",
     "lot": "261007-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 2",
     "part": "리어 브라켓",
     "value": 10.001,
     "inspector": "오세린"
    },
    {
     "id": "ms009d",
     "date": "2026-10-07",
     "lot": "261007-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 33.3,
     "inspector": "윤재호"
    },
    {
     "id": "ms009e",
     "date": "2026-10-08",
     "lot": "261008-A1",
     "char": "브라켓 홀 위치 (mm)",
     "line": "프레스 1",
     "part": "리어 브라켓",
     "value": 10.028,
     "inspector": "한도윤"
    },
    {
     "id": "ms009f",
     "date": "2026-10-08",
     "lot": "261008-B1",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.4,
     "inspector": "윤재호"
    },
    {
     "id": "ms009g",
     "date": "2026-10-08",
     "lot": "261008-B2",
     "char": "용접 너깃 지름 (mm)",
     "line": "용접 1",
     "part": "배터리 트레이",
     "value": 6.15,
     "inspector": "오세린"
    },
    {
     "id": "ms009h",
     "date": "2026-10-08",
     "lot": "261008-C1",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 30.9,
     "inspector": "윤재호"
    },
    {
     "id": "ms009i",
     "date": "2026-10-08",
     "lot": "261008-C2",
     "char": "도장 막두께 (µm)",
     "line": "도장",
     "part": "콘솔 커버",
     "value": 31.7,
     "inspector": "오세린"
    }
   ]
  },
  {
   "id": "suppliers",
   "name": "협력사 평가",
   "desc": "협력사 분기별 품질·납기 평가 점수와 등급입니다.",
   "dateField": "date",
   "titleField": "name",
   "fields": [
    {
     "key": "name",
     "label": "협력사",
     "type": "ref",
     "ref": "vendors",
     "req": true
    },
    {
     "key": "date",
     "label": "평가일",
     "type": "date",
     "req": true
    },
    {
     "key": "process",
     "label": "공정",
     "type": "select",
     "options": [
      "프레스",
      "사출",
      "용접",
      "도금",
      "도장",
      "고무",
      "전장",
      "가공",
      "조립"
     ]
    },
    {
     "key": "quality",
     "label": "품질 점수",
     "type": "number"
    },
    {
     "key": "delivery",
     "label": "납기 점수",
     "type": "number"
    },
    {
     "key": "score",
     "label": "종합 점수",
     "type": "number",
     "req": true
    },
    {
     "key": "grade",
     "label": "등급",
     "type": "select",
     "options": [
      "A",
      "B",
      "C",
      "D"
     ],
     "colors": {
      "A": "green",
      "B": "blue",
      "C": "orange",
      "D": "red"
     }
    },
    {
     "key": "action",
     "label": "후속 조치",
     "type": "text"
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "평가완료",
      "개선요구",
      "완료"
     ],
     "badge": true
    }
   ],
   "records": [
    {
     "id": "r10gyk",
     "name": "대성정밀",
     "date": "2025-03-31",
     "process": "프레스",
     "quality": 71,
     "delivery": 95,
     "score": 80.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gyl",
     "name": "대성정밀",
     "date": "2025-06-30",
     "process": "프레스",
     "quality": 70,
     "delivery": 92,
     "score": 78.8,
     "grade": "C",
     "action": "4M 변경 이력 점검",
     "status": "완료"
    },
    {
     "id": "r10gym",
     "name": "대성정밀",
     "date": "2025-09-30",
     "process": "프레스",
     "quality": 79,
     "delivery": 89,
     "score": 83,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gyn",
     "name": "대성정밀",
     "date": "2025-12-31",
     "process": "프레스",
     "quality": 76,
     "delivery": 90,
     "score": 81.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gyo",
     "name": "대성정밀",
     "date": "2026-03-31",
     "process": "프레스",
     "quality": 74,
     "delivery": 92,
     "score": 81.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gyp",
     "name": "대성정밀",
     "date": "2026-06-30",
     "process": "프레스",
     "quality": 77,
     "delivery": 87,
     "score": 81,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gyr",
     "name": "삼진프레스",
     "date": "2025-03-31",
     "process": "프레스",
     "quality": 88,
     "delivery": 75,
     "score": 82.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gys",
     "name": "삼진프레스",
     "date": "2025-06-30",
     "process": "프레스",
     "quality": 91,
     "delivery": 71,
     "score": 83,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gyt",
     "name": "삼진프레스",
     "date": "2025-09-30",
     "process": "프레스",
     "quality": 88,
     "delivery": 66,
     "score": 79.2,
     "grade": "C",
     "action": "품질 현장 점검 예정",
     "status": "완료"
    },
    {
     "id": "r10gyu",
     "name": "삼진프레스",
     "date": "2025-12-31",
     "process": "프레스",
     "quality": 94,
     "delivery": 71,
     "score": 84.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gyv",
     "name": "삼진프레스",
     "date": "2026-03-31",
     "process": "프레스",
     "quality": 89,
     "delivery": 71,
     "score": 81.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gyw",
     "name": "삼진프레스",
     "date": "2026-06-30",
     "process": "프레스",
     "quality": 89,
     "delivery": 74,
     "score": 83,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gyx",
     "name": "삼진프레스",
     "date": "2026-09-30",
     "process": "프레스",
     "quality": 87,
     "delivery": 78,
     "score": 83.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gyy",
     "name": "세화테크",
     "date": "2025-03-31",
     "process": "사출",
     "quality": 65,
     "delivery": 94,
     "score": 76.6,
     "grade": "C",
     "action": "출하 검사 강화 요청",
     "status": "완료"
    },
    {
     "id": "r10gyz",
     "name": "세화테크",
     "date": "2025-06-30",
     "process": "사출",
     "quality": 63,
     "delivery": 91,
     "score": 74.2,
     "grade": "C",
     "action": "품질 현장 점검 예정",
     "status": "완료"
    },
    {
     "id": "r10gz0",
     "name": "세화테크",
     "date": "2025-09-30",
     "process": "사출",
     "quality": 70,
     "delivery": 93,
     "score": 79.2,
     "grade": "C",
     "action": "출하 검사 강화 요청",
     "status": "완료"
    },
    {
     "id": "r10gz1",
     "name": "세화테크",
     "date": "2025-12-31",
     "process": "사출",
     "quality": 67,
     "delivery": 94,
     "score": 77.8,
     "grade": "C",
     "action": "품질 현장 점검 예정",
     "status": "완료"
    },
    {
     "id": "r10gz2",
     "name": "세화테크",
     "date": "2026-03-31",
     "process": "사출",
     "quality": 68,
     "delivery": 92,
     "score": 77.6,
     "grade": "C",
     "action": "4M 변경 이력 점검",
     "status": "완료"
    },
    {
     "id": "r10gz3",
     "name": "세화테크",
     "date": "2026-06-30",
     "process": "사출",
     "quality": 67,
     "delivery": 89,
     "score": 75.8,
     "grade": "C",
     "action": "품질 현장 점검 예정",
     "status": "완료"
    },
    {
     "id": "r10gz4",
     "name": "세화테크",
     "date": "2026-09-30",
     "process": "사출",
     "quality": 70,
     "delivery": 93,
     "score": 79.2,
     "grade": "C",
     "action": "출하 검사 강화 요청",
     "status": "개선요구"
    },
    {
     "id": "r10gz5",
     "name": "성원전자",
     "date": "2025-03-31",
     "process": "전장",
     "quality": 92,
     "delivery": 82,
     "score": 88,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gz6",
     "name": "성원전자",
     "date": "2025-06-30",
     "process": "전장",
     "quality": 87,
     "delivery": 80,
     "score": 84.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gz7",
     "name": "성원전자",
     "date": "2025-09-30",
     "process": "전장",
     "quality": 89,
     "delivery": 77,
     "score": 84.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gz8",
     "name": "성원전자",
     "date": "2025-12-31",
     "process": "전장",
     "quality": 92,
     "delivery": 76,
     "score": 85.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gz9",
     "name": "성원전자",
     "date": "2026-03-31",
     "process": "전장",
     "quality": 98,
     "delivery": 80,
     "score": 90.8,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gza",
     "name": "성원전자",
     "date": "2026-06-30",
     "process": "전장",
     "quality": 99,
     "delivery": 78,
     "score": 90.6,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzb",
     "name": "성원전자",
     "date": "2026-09-30",
     "process": "전장",
     "quality": 97,
     "delivery": 81,
     "score": 90.6,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzc",
     "name": "동양도금",
     "date": "2025-03-31",
     "process": "도금",
     "quality": 96,
     "delivery": 89,
     "score": 93.2,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzd",
     "name": "동양도금",
     "date": "2025-06-30",
     "process": "도금",
     "quality": 95,
     "delivery": 85,
     "score": 91,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gze",
     "name": "동양도금",
     "date": "2025-09-30",
     "process": "도금",
     "quality": 99,
     "delivery": 89,
     "score": 95,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzf",
     "name": "동양도금",
     "date": "2025-12-31",
     "process": "도금",
     "quality": 99,
     "delivery": 84,
     "score": 93,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzg",
     "name": "동양도금",
     "date": "2026-03-31",
     "process": "도금",
     "quality": 96,
     "delivery": 79,
     "score": 89.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzh",
     "name": "동양도금",
     "date": "2026-06-30",
     "process": "도금",
     "quality": 93,
     "delivery": 82,
     "score": 88.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzi",
     "name": "동양도금",
     "date": "2026-09-30",
     "process": "도금",
     "quality": 90,
     "delivery": 82,
     "score": 86.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzj",
     "name": "한빛고무",
     "date": "2025-03-31",
     "process": "고무",
     "quality": 84,
     "delivery": 89,
     "score": 86,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzk",
     "name": "한빛고무",
     "date": "2025-06-30",
     "process": "고무",
     "quality": 88,
     "delivery": 90,
     "score": 88.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzl",
     "name": "한빛고무",
     "date": "2025-09-30",
     "process": "고무",
     "quality": 96,
     "delivery": 94,
     "score": 95.2,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzm",
     "name": "한빛고무",
     "date": "2025-12-31",
     "process": "고무",
     "quality": 99,
     "delivery": 89,
     "score": 95,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzn",
     "name": "한빛고무",
     "date": "2026-03-31",
     "process": "고무",
     "quality": 99,
     "delivery": 88,
     "score": 94.6,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzo",
     "name": "한빛고무",
     "date": "2026-06-30",
     "process": "고무",
     "quality": 99,
     "delivery": 91,
     "score": 95.8,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzp",
     "name": "한빛고무",
     "date": "2026-09-30",
     "process": "고무",
     "quality": 97,
     "delivery": 89,
     "score": 93.8,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzq",
     "name": "미래사출",
     "date": "2025-03-31",
     "process": "사출",
     "quality": 77,
     "delivery": 73,
     "score": 75.4,
     "grade": "C",
     "action": "개선 계획서 제출 요구",
     "status": "완료"
    },
    {
     "id": "r10gzr",
     "name": "미래사출",
     "date": "2025-06-30",
     "process": "사출",
     "quality": 82,
     "delivery": 77,
     "score": 80,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzs",
     "name": "미래사출",
     "date": "2025-09-30",
     "process": "사출",
     "quality": 85,
     "delivery": 74,
     "score": 80.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzt",
     "name": "미래사출",
     "date": "2025-12-31",
     "process": "사출",
     "quality": 90,
     "delivery": 78,
     "score": 85.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzu",
     "name": "미래사출",
     "date": "2026-03-31",
     "process": "사출",
     "quality": 93,
     "delivery": 73,
     "score": 85,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzv",
     "name": "미래사출",
     "date": "2026-06-30",
     "process": "사출",
     "quality": 92,
     "delivery": 77,
     "score": 86,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzw",
     "name": "미래사출",
     "date": "2026-09-30",
     "process": "사출",
     "quality": 90,
     "delivery": 72,
     "score": 82.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzx",
     "name": "우진금속",
     "date": "2025-03-31",
     "process": "프레스",
     "quality": 80,
     "delivery": 88,
     "score": 83.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzy",
     "name": "우진금속",
     "date": "2025-06-30",
     "process": "프레스",
     "quality": 86,
     "delivery": 88,
     "score": 86.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10gzz",
     "name": "우진금속",
     "date": "2025-09-30",
     "process": "프레스",
     "quality": 86,
     "delivery": 93,
     "score": 88.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h00",
     "name": "우진금속",
     "date": "2025-12-31",
     "process": "프레스",
     "quality": 90,
     "delivery": 96,
     "score": 92.4,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h01",
     "name": "우진금속",
     "date": "2026-03-31",
     "process": "프레스",
     "quality": 86,
     "delivery": 98,
     "score": 90.8,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h02",
     "name": "우진금속",
     "date": "2026-06-30",
     "process": "프레스",
     "quality": 86,
     "delivery": 96,
     "score": 90,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h03",
     "name": "우진금속",
     "date": "2026-09-30",
     "process": "프레스",
     "quality": 85,
     "delivery": 100,
     "score": 91,
     "grade": "A",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h04",
     "name": "태광산업",
     "date": "2025-03-31",
     "process": "용접",
     "quality": 74,
     "delivery": 88,
     "score": 79.6,
     "grade": "C",
     "action": "4M 변경 이력 점검",
     "status": "완료"
    },
    {
     "id": "r10h05",
     "name": "태광산업",
     "date": "2025-06-30",
     "process": "용접",
     "quality": 78,
     "delivery": 83,
     "score": 80,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h06",
     "name": "태광산업",
     "date": "2025-09-30",
     "process": "용접",
     "quality": 84,
     "delivery": 85,
     "score": 84.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h07",
     "name": "태광산업",
     "date": "2025-12-31",
     "process": "용접",
     "quality": 83,
     "delivery": 84,
     "score": 83.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h08",
     "name": "태광산업",
     "date": "2026-03-31",
     "process": "용접",
     "quality": 77,
     "delivery": 89,
     "score": 81.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h09",
     "name": "태광산업",
     "date": "2026-06-30",
     "process": "용접",
     "quality": 77,
     "delivery": 88,
     "score": 81.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0a",
     "name": "태광산업",
     "date": "2026-09-30",
     "process": "용접",
     "quality": 82,
     "delivery": 86,
     "score": 83.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0b",
     "name": "신흥정공",
     "date": "2025-03-31",
     "process": "가공",
     "quality": 79,
     "delivery": 83,
     "score": 80.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0c",
     "name": "신흥정공",
     "date": "2025-06-30",
     "process": "가공",
     "quality": 77,
     "delivery": 86,
     "score": 80.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0d",
     "name": "신흥정공",
     "date": "2025-09-30",
     "process": "가공",
     "quality": 79,
     "delivery": 91,
     "score": 83.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0e",
     "name": "신흥정공",
     "date": "2025-12-31",
     "process": "가공",
     "quality": 86,
     "delivery": 92,
     "score": 88.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0f",
     "name": "신흥정공",
     "date": "2026-03-31",
     "process": "가공",
     "quality": 80,
     "delivery": 96,
     "score": 86.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0g",
     "name": "신흥정공",
     "date": "2026-06-30",
     "process": "가공",
     "quality": 77,
     "delivery": 91,
     "score": 82.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0h",
     "name": "신흥정공",
     "date": "2026-09-30",
     "process": "가공",
     "quality": 72,
     "delivery": 86,
     "score": 77.6,
     "grade": "C",
     "action": "개선 계획서 제출 요구",
     "status": "개선요구"
    },
    {
     "id": "r10h0i",
     "name": "해성화학",
     "date": "2025-03-31",
     "process": "사출",
     "quality": 84,
     "delivery": 91,
     "score": 86.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0j",
     "name": "해성화학",
     "date": "2025-06-30",
     "process": "사출",
     "quality": 81,
     "delivery": 87,
     "score": 83.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0k",
     "name": "해성화학",
     "date": "2025-09-30",
     "process": "사출",
     "quality": 89,
     "delivery": 84,
     "score": 87,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0l",
     "name": "해성화학",
     "date": "2025-12-31",
     "process": "사출",
     "quality": 89,
     "delivery": 87,
     "score": 88.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0m",
     "name": "해성화학",
     "date": "2026-03-31",
     "process": "사출",
     "quality": 95,
     "delivery": 82,
     "score": 89.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0n",
     "name": "해성화학",
     "date": "2026-06-30",
     "process": "사출",
     "quality": 95,
     "delivery": 79,
     "score": 88.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0o",
     "name": "해성화학",
     "date": "2026-09-30",
     "process": "사출",
     "quality": 95,
     "delivery": 74,
     "score": 86.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0p",
     "name": "진영테크",
     "date": "2025-03-31",
     "process": "조립",
     "quality": 82,
     "delivery": 80,
     "score": 81.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0q",
     "name": "진영테크",
     "date": "2025-06-30",
     "process": "조립",
     "quality": 84,
     "delivery": 79,
     "score": 82,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0r",
     "name": "진영테크",
     "date": "2025-09-30",
     "process": "조립",
     "quality": 85,
     "delivery": 77,
     "score": 81.8,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h0s",
     "name": "진영테크",
     "date": "2025-12-31",
     "process": "조립",
     "quality": 83,
     "delivery": 74,
     "score": 79.4,
     "grade": "C",
     "action": "4M 변경 이력 점검",
     "status": "완료"
    },
    {
     "id": "r10h0t",
     "name": "진영테크",
     "date": "2026-03-31",
     "process": "조립",
     "quality": 77,
     "delivery": 79,
     "score": 77.8,
     "grade": "C",
     "action": "출하 검사 강화 요청",
     "status": "완료"
    },
    {
     "id": "r10h0u",
     "name": "진영테크",
     "date": "2026-06-30",
     "process": "조립",
     "quality": 74,
     "delivery": 79,
     "score": 76,
     "grade": "C",
     "action": "개선 계획서 제출 요구",
     "status": "완료"
    },
    {
     "id": "r10h0v",
     "name": "진영테크",
     "date": "2026-09-30",
     "process": "조립",
     "quality": 75,
     "delivery": 80,
     "score": 77,
     "grade": "C",
     "action": "개선 계획서 제출 요구",
     "status": "개선요구"
    },
    {
     "id": "r10h0w",
     "name": "대명오토",
     "date": "2025-03-31",
     "process": "조립",
     "quality": 81,
     "delivery": 75,
     "score": 78.6,
     "grade": "C",
     "action": "4M 변경 이력 점검",
     "status": "완료"
    },
    {
     "id": "r10h0x",
     "name": "대명오토",
     "date": "2025-06-30",
     "process": "조립",
     "quality": 82,
     "delivery": 70,
     "score": 77.2,
     "grade": "C",
     "action": "4M 변경 이력 점검",
     "status": "완료"
    },
    {
     "id": "r10h0y",
     "name": "대명오토",
     "date": "2025-09-30",
     "process": "조립",
     "quality": 78,
     "delivery": 68,
     "score": 74,
     "grade": "C",
     "action": "개선 계획서 제출 요구",
     "status": "완료"
    },
    {
     "id": "r10h0z",
     "name": "대명오토",
     "date": "2025-12-31",
     "process": "조립",
     "quality": 81,
     "delivery": 73,
     "score": 77.8,
     "grade": "C",
     "action": "품질 현장 점검 예정",
     "status": "완료"
    },
    {
     "id": "r10h10",
     "name": "대명오토",
     "date": "2026-03-31",
     "process": "조립",
     "quality": 87,
     "delivery": 78,
     "score": 83.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h11",
     "name": "대명오토",
     "date": "2026-06-30",
     "process": "조립",
     "quality": 86,
     "delivery": 76,
     "score": 82,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h12",
     "name": "대명오토",
     "date": "2026-09-30",
     "process": "조립",
     "quality": 86,
     "delivery": 72,
     "score": 80.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h13",
     "name": "경일산업",
     "date": "2025-03-31",
     "process": "도장",
     "quality": 77,
     "delivery": 100,
     "score": 86.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h14",
     "name": "경일산업",
     "date": "2025-06-30",
     "process": "도장",
     "quality": 76,
     "delivery": 100,
     "score": 85.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h15",
     "name": "경일산업",
     "date": "2025-09-30",
     "process": "도장",
     "quality": 70,
     "delivery": 100,
     "score": 82,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h16",
     "name": "경일산업",
     "date": "2025-12-31",
     "process": "도장",
     "quality": 72,
     "delivery": 100,
     "score": 83.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h17",
     "name": "경일산업",
     "date": "2026-03-31",
     "process": "도장",
     "quality": 66,
     "delivery": 100,
     "score": 79.6,
     "grade": "C",
     "action": "개선 계획서 제출 요구",
     "status": "완료"
    },
    {
     "id": "r10h18",
     "name": "경일산업",
     "date": "2026-06-30",
     "process": "도장",
     "quality": 73,
     "delivery": 96,
     "score": 82.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h19",
     "name": "경일산업",
     "date": "2026-09-30",
     "process": "도장",
     "quality": 67,
     "delivery": 97,
     "score": 79,
     "grade": "C",
     "action": "품질 현장 점검 예정",
     "status": "개선요구"
    },
    {
     "id": "r10h1a",
     "name": "유성정밀",
     "date": "2025-03-31",
     "process": "가공",
     "quality": 76,
     "delivery": 92,
     "score": 82.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h1b",
     "name": "유성정밀",
     "date": "2025-06-30",
     "process": "가공",
     "quality": 83,
     "delivery": 89,
     "score": 85.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h1c",
     "name": "유성정밀",
     "date": "2025-09-30",
     "process": "가공",
     "quality": 80,
     "delivery": 89,
     "score": 83.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h1d",
     "name": "유성정밀",
     "date": "2025-12-31",
     "process": "가공",
     "quality": 84,
     "delivery": 85,
     "score": 84.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h1e",
     "name": "유성정밀",
     "date": "2026-03-31",
     "process": "가공",
     "quality": 81,
     "delivery": 89,
     "score": 84.2,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h1f",
     "name": "유성정밀",
     "date": "2026-06-30",
     "process": "가공",
     "quality": 78,
     "delivery": 89,
     "score": 82.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h1g",
     "name": "유성정밀",
     "date": "2026-09-30",
     "process": "가공",
     "quality": 82,
     "delivery": 91,
     "score": 85.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h1h",
     "name": "한라부품",
     "date": "2025-03-31",
     "process": "용접",
     "quality": 86,
     "delivery": 75,
     "score": 81.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h1i",
     "name": "한라부품",
     "date": "2025-06-30",
     "process": "용접",
     "quality": 83,
     "delivery": 70,
     "score": 77.8,
     "grade": "C",
     "action": "출하 검사 강화 요청",
     "status": "완료"
    },
    {
     "id": "r10h1j",
     "name": "한라부품",
     "date": "2025-09-30",
     "process": "용접",
     "quality": 87,
     "delivery": 65,
     "score": 78.2,
     "grade": "C",
     "action": "출하 검사 강화 요청",
     "status": "완료"
    },
    {
     "id": "r10h1k",
     "name": "한라부품",
     "date": "2025-12-31",
     "process": "용접",
     "quality": 92,
     "delivery": 68,
     "score": 82.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h1l",
     "name": "한라부품",
     "date": "2026-03-31",
     "process": "용접",
     "quality": 96,
     "delivery": 70,
     "score": 85.6,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h1m",
     "name": "한라부품",
     "date": "2026-06-30",
     "process": "용접",
     "quality": 99,
     "delivery": 70,
     "score": 87.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    },
    {
     "id": "r10h1n",
     "name": "한라부품",
     "date": "2026-09-30",
     "process": "용접",
     "quality": 99,
     "delivery": 70,
     "score": 87.4,
     "grade": "B",
     "action": "",
     "status": "평가완료"
    }
   ]
  },
  {
   "id": "nc",
   "name": "부적합 (심사 지적)",
   "desc": "내부·인증·고객 심사에서 나온 부적합 사항과 시정 조치입니다.",
   "dateField": "issued",
   "titleField": "clause",
   "fields": [
    {
     "key": "no",
     "label": "부적합 번호",
     "type": "text",
     "auto": "NC-{YY}-"
    },
    {
     "key": "issued",
     "label": "발행일",
     "type": "date",
     "req": true
    },
    {
     "key": "audit",
     "label": "심사 구분",
     "type": "select",
     "options": [
      "내부심사",
      "IATF 사후심사",
      "고객 심사"
     ]
    },
    {
     "key": "clause",
     "label": "요구사항 조항",
     "type": "text",
     "req": true
    },
    {
     "key": "level",
     "label": "등급",
     "type": "select",
     "options": [
      "중결함",
      "경결함",
      "관찰"
     ],
     "colors": {
      "중결함": "red",
      "경결함": "orange",
      "관찰": "gray"
     }
    },
    {
     "key": "dept",
     "label": "부서",
     "type": "select",
     "options": [
      "품질보증",
      "생산",
      "구매",
      "개발",
      "설비"
     ]
    },
    {
     "key": "due",
     "label": "조치 기한",
     "type": "date"
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "접수",
      "조치중",
      "완료"
     ],
     "badge": true
    },
    {
     "key": "closed",
     "label": "완료일",
     "type": "date",
     "closes": true
    },
    {
     "key": "lead",
     "label": "처리 기간(일)",
     "type": "days",
     "from": "issued",
     "to": "closed"
    }
   ],
   "records": [
    {
     "id": "r10h23",
     "no": "NC-25-001",
     "issued": "2025-01-26",
     "audit": "고객 심사",
     "clause": "8.5.6.1 변경 관리",
     "level": "경결함",
     "dept": "생산",
     "due": "2025-02-25",
     "status": "완료",
     "closed": "2025-03-08"
    },
    {
     "id": "r10h2d",
     "no": "NC-25-002",
     "issued": "2025-02-09",
     "audit": "내부심사",
     "clause": "7.2.3 내부심사원 역량",
     "level": "경결함",
     "dept": "설비",
     "due": "2025-03-11",
     "status": "완료",
     "closed": "2025-03-20"
    },
    {
     "id": "r10h1t",
     "no": "NC-25-003",
     "issued": "2025-03-02",
     "audit": "IATF 사후심사",
     "clause": "8.3.4.4 제품 승인 프로세스",
     "level": "경결함",
     "dept": "설비",
     "due": "2025-04-01",
     "status": "완료",
     "closed": "2025-04-01"
    },
    {
     "id": "r10h26",
     "no": "NC-25-004",
     "issued": "2025-03-04",
     "audit": "IATF 사후심사",
     "clause": "8.7.1.4 재작업 관리",
     "level": "중결함",
     "dept": "구매",
     "due": "2025-04-03",
     "status": "완료",
     "closed": "2025-03-26"
    },
    {
     "id": "r10h27",
     "no": "NC-25-005",
     "issued": "2025-03-09",
     "audit": "내부심사",
     "clause": "8.3.4.4 제품 승인 프로세스",
     "level": "중결함",
     "dept": "구매",
     "due": "2025-04-08",
     "status": "완료",
     "closed": "2025-04-17"
    },
    {
     "id": "r10h1p",
     "no": "NC-25-006",
     "issued": "2025-03-16",
     "audit": "내부심사",
     "clause": "9.1.1.1 공정 모니터링",
     "level": "관찰",
     "dept": "설비",
     "due": "2025-04-15",
     "status": "완료",
     "closed": "2025-04-24"
    },
    {
     "id": "r10h20",
     "no": "NC-25-007",
     "issued": "2025-04-21",
     "audit": "내부심사",
     "clause": "7.1.5 측정 자원 관리",
     "level": "경결함",
     "dept": "품질보증",
     "due": "2025-05-21",
     "status": "완료",
     "closed": "2025-05-05"
    },
    {
     "id": "r10h2n",
     "no": "NC-25-008",
     "issued": "2025-04-23",
     "audit": "고객 심사",
     "clause": "7.2.3 내부심사원 역량",
     "level": "경결함",
     "dept": "설비",
     "due": "2025-05-23",
     "status": "완료",
     "closed": "2025-05-19"
    },
    {
     "id": "r10h1u",
     "no": "NC-25-009",
     "issued": "2025-06-05",
     "audit": "내부심사",
     "clause": "8.5.1.1 관리계획서",
     "level": "경결함",
     "dept": "설비",
     "due": "2025-07-05",
     "status": "완료",
     "closed": "2025-07-04"
    },
    {
     "id": "r10h2h",
     "no": "NC-25-010",
     "issued": "2025-06-07",
     "audit": "고객 심사",
     "clause": "8.7.1.4 재작업 관리",
     "level": "관찰",
     "dept": "생산",
     "due": "2025-07-07",
     "status": "완료",
     "closed": "2025-06-28"
    },
    {
     "id": "r10h25",
     "no": "NC-25-011",
     "issued": "2025-06-27",
     "audit": "고객 심사",
     "clause": "10.2.3 문제 해결",
     "level": "관찰",
     "dept": "생산",
     "due": "2025-07-27",
     "status": "완료",
     "closed": "2025-08-09"
    },
    {
     "id": "r10h2a",
     "no": "NC-25-012",
     "issued": "2025-08-02",
     "audit": "내부심사",
     "clause": "8.3.4.4 제품 승인 프로세스",
     "level": "관찰",
     "dept": "생산",
     "due": "2025-09-01",
     "status": "완료",
     "closed": "2025-08-20"
    },
    {
     "id": "r10h1r",
     "no": "NC-25-013",
     "issued": "2025-08-11",
     "audit": "내부심사",
     "clause": "7.5.3.2 기록 보관",
     "level": "관찰",
     "dept": "구매",
     "due": "2025-09-10",
     "status": "완료",
     "closed": "2025-09-02"
    },
    {
     "id": "r10h22",
     "no": "NC-25-014",
     "issued": "2025-08-20",
     "audit": "IATF 사후심사",
     "clause": "8.4.2.4 공급자 모니터링",
     "level": "관찰",
     "dept": "설비",
     "due": "2025-09-19",
     "status": "완료",
     "closed": "2025-09-20"
    },
    {
     "id": "r10h21",
     "no": "NC-25-015",
     "issued": "2025-08-21",
     "audit": "IATF 사후심사",
     "clause": "9.1.1.1 공정 모니터링",
     "level": "경결함",
     "dept": "설비",
     "due": "2025-09-20",
     "status": "완료",
     "closed": "2025-09-04"
    },
    {
     "id": "r10h1y",
     "no": "NC-25-016",
     "issued": "2025-09-28",
     "audit": "고객 심사",
     "clause": "7.1.5 측정 자원 관리",
     "level": "관찰",
     "dept": "생산",
     "due": "2025-10-28",
     "status": "완료",
     "closed": "2025-10-22"
    },
    {
     "id": "r10h29",
     "no": "NC-25-017",
     "issued": "2025-10-05",
     "audit": "고객 심사",
     "clause": "8.5.6.1 변경 관리",
     "level": "관찰",
     "dept": "품질보증",
     "due": "2025-11-04",
     "status": "완료",
     "closed": "2025-10-30"
    },
    {
     "id": "r10h2b",
     "no": "NC-25-018",
     "issued": "2025-12-05",
     "audit": "고객 심사",
     "clause": "8.5.6.1 변경 관리",
     "level": "경결함",
     "dept": "구매",
     "due": "2026-01-04",
     "status": "완료",
     "closed": "2025-12-28"
    },
    {
     "id": "r10h2f",
     "no": "NC-25-019",
     "issued": "2025-12-27",
     "audit": "IATF 사후심사",
     "clause": "8.3.4.4 제품 승인 프로세스",
     "level": "경결함",
     "dept": "구매",
     "due": "2026-01-26",
     "status": "완료",
     "closed": "2026-01-29"
    },
    {
     "id": "r10h2e",
     "no": "NC-26-001",
     "issued": "2026-01-11",
     "audit": "내부심사",
     "clause": "8.5.6.1 변경 관리",
     "level": "경결함",
     "dept": "개발",
     "due": "2026-02-10",
     "status": "완료",
     "closed": "2026-01-30"
    },
    {
     "id": "r10h2g",
     "no": "NC-26-002",
     "issued": "2026-01-21",
     "audit": "내부심사",
     "clause": "10.2.3 문제 해결",
     "level": "경결함",
     "dept": "개발",
     "due": "2026-02-20",
     "status": "완료",
     "closed": "2026-01-31"
    },
    {
     "id": "r10h1q",
     "no": "NC-26-003",
     "issued": "2026-02-15",
     "audit": "내부심사",
     "clause": "7.5.3.2 기록 보관",
     "level": "관찰",
     "dept": "설비",
     "due": "2026-03-17",
     "status": "완료",
     "closed": "2026-03-02"
    },
    {
     "id": "r10h2k",
     "no": "NC-26-004",
     "issued": "2026-02-19",
     "audit": "내부심사",
     "clause": "10.2.3 문제 해결",
     "level": "관찰",
     "dept": "생산",
     "due": "2026-03-21",
     "status": "완료",
     "closed": "2026-03-17"
    },
    {
     "id": "r10h2c",
     "no": "NC-26-005",
     "issued": "2026-02-25",
     "audit": "내부심사",
     "clause": "7.1.5 측정 자원 관리",
     "level": "관찰",
     "dept": "설비",
     "due": "2026-03-27",
     "status": "완료",
     "closed": "2026-03-31"
    },
    {
     "id": "r10h2j",
     "no": "NC-26-006",
     "issued": "2026-02-27",
     "audit": "IATF 사후심사",
     "clause": "8.5.1.1 관리계획서",
     "level": "경결함",
     "dept": "품질보증",
     "due": "2026-03-29",
     "status": "완료",
     "closed": "2026-03-29"
    },
    {
     "id": "r10h1w",
     "no": "NC-26-007",
     "issued": "2026-03-06",
     "audit": "내부심사",
     "clause": "7.5.3.2 기록 보관",
     "level": "경결함",
     "dept": "생산",
     "due": "2026-04-05",
     "status": "완료",
     "closed": "2026-03-28"
    },
    {
     "id": "r10h1x",
     "no": "NC-26-008",
     "issued": "2026-03-23",
     "audit": "내부심사",
     "clause": "8.4.2.4 공급자 모니터링",
     "level": "경결함",
     "dept": "구매",
     "due": "2026-04-22",
     "status": "완료",
     "closed": "2026-04-06"
    },
    {
     "id": "r10h1s",
     "no": "NC-26-009",
     "issued": "2026-04-14",
     "audit": "고객 심사",
     "clause": "7.2.3 내부심사원 역량",
     "level": "관찰",
     "dept": "구매",
     "due": "2026-05-14",
     "status": "완료",
     "closed": "2026-04-27"
    },
    {
     "id": "r10h2l",
     "no": "NC-26-010",
     "issued": "2026-04-29",
     "audit": "내부심사",
     "clause": "8.5.1.1 관리계획서",
     "level": "관찰",
     "dept": "품질보증",
     "due": "2026-05-29",
     "status": "완료",
     "closed": "2026-06-11"
    },
    {
     "id": "r10h1o",
     "no": "NC-26-011",
     "issued": "2026-05-24",
     "audit": "내부심사",
     "clause": "10.2.3 문제 해결",
     "level": "경결함",
     "dept": "개발",
     "due": "2026-06-23",
     "status": "완료",
     "closed": "2026-06-23"
    },
    {
     "id": "r10h2m",
     "no": "NC-26-012",
     "issued": "2026-06-02",
     "audit": "고객 심사",
     "clause": "7.1.5 측정 자원 관리",
     "level": "관찰",
     "dept": "품질보증",
     "due": "2026-07-02",
     "status": "완료",
     "closed": "2026-06-21"
    },
    {
     "id": "r10h28",
     "no": "NC-26-013",
     "issued": "2026-08-04",
     "audit": "내부심사",
     "clause": "7.2.3 내부심사원 역량",
     "level": "관찰",
     "dept": "품질보증",
     "due": "2026-09-03",
     "status": "완료",
     "closed": "2026-09-06"
    },
    {
     "id": "r10h1v",
     "no": "NC-26-014",
     "issued": "2026-09-06",
     "audit": "내부심사",
     "clause": "10.2.3 문제 해결",
     "level": "경결함",
     "dept": "품질보증",
     "due": "2026-10-06",
     "status": "완료",
     "closed": "2026-09-28"
    },
    {
     "id": "r10h1z",
     "no": "NC-26-015",
     "issued": "2026-09-14",
     "audit": "고객 심사",
     "clause": "7.1.5 측정 자원 관리",
     "level": "관찰",
     "dept": "설비",
     "due": "2026-10-14",
     "status": "조치중",
     "closed": ""
    },
    {
     "id": "r10h2i",
     "no": "NC-26-016",
     "issued": "2026-09-17",
     "audit": "내부심사",
     "clause": "8.4.2.4 공급자 모니터링",
     "level": "경결함",
     "dept": "설비",
     "due": "2026-10-17",
     "status": "조치중",
     "closed": ""
    },
    {
     "id": "r10h24",
     "no": "NC-26-017",
     "issued": "2026-09-23",
     "audit": "내부심사",
     "clause": "8.4.2.4 공급자 모니터링",
     "level": "경결함",
     "dept": "품질보증",
     "due": "2026-10-23",
     "status": "조치중",
     "closed": ""
    }
   ]
  },
  {
   "id": "auditplan",
   "name": "내부심사 계획",
   "desc": "2026년 부서별 내부심사 일정과 진행률입니다.",
   "dateField": "date",
   "titleField": "dept",
   "asOfField": "",
   "fields": [
    {
     "key": "dept",
     "label": "피심사 부서",
     "type": "text",
     "req": true
    },
    {
     "key": "date",
     "label": "심사일",
     "type": "date",
     "req": true
    },
    {
     "key": "auditor",
     "label": "심사원",
     "type": "ref",
     "ref": "people"
    },
    {
     "key": "scope",
     "label": "심사 범위",
     "type": "text"
    },
    {
     "key": "progress",
     "label": "진행률",
     "type": "number"
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "예정",
      "진행중",
      "완료"
     ],
     "badge": true
    }
   ],
   "records": [
    {
     "id": "r10h2o",
     "dept": "품질보증",
     "date": "2026-01-20",
     "auditor": "최유진",
     "scope": "프로세스 심사 (IATF 16949)",
     "progress": 100,
     "status": "완료"
    },
    {
     "id": "r10h2p",
     "dept": "생산 1팀",
     "date": "2026-02-17",
     "auditor": "정하늘",
     "scope": "공정 심사 (VDA 6.3)",
     "progress": 100,
     "status": "완료"
    },
    {
     "id": "r10h2q",
     "dept": "생산 2팀",
     "date": "2026-03-12",
     "auditor": "윤재호",
     "scope": "프로세스 심사 (IATF 16949)",
     "progress": 100,
     "status": "완료"
    },
    {
     "id": "r10h2r",
     "dept": "구매",
     "date": "2026-04-20",
     "auditor": "정하늘",
     "scope": "프로세스 심사 (IATF 16949)",
     "progress": 100,
     "status": "완료"
    },
    {
     "id": "r10h2s",
     "dept": "개발",
     "date": "2026-05-15",
     "auditor": "정하늘",
     "scope": "프로세스 심사 (IATF 16949)",
     "progress": 100,
     "status": "완료"
    },
    {
     "id": "r10h2t",
     "dept": "설비",
     "date": "2026-06-23",
     "auditor": "정하늘",
     "scope": "제품 심사",
     "progress": 100,
     "status": "완료"
    },
    {
     "id": "r10h2u",
     "dept": "물류",
     "date": "2026-07-15",
     "auditor": "정하늘",
     "scope": "공정 심사 (VDA 6.3)",
     "progress": 100,
     "status": "완료"
    },
    {
     "id": "r10h2v",
     "dept": "영업",
     "date": "2026-08-23",
     "auditor": "정하늘",
     "scope": "프로세스 심사 (IATF 16949)",
     "progress": 100,
     "status": "완료"
    },
    {
     "id": "r10h2w",
     "dept": "인사·교육",
     "date": "2026-09-20",
     "auditor": "최유진",
     "scope": "공정 심사 (VDA 6.3)",
     "progress": 100,
     "status": "완료"
    },
    {
     "id": "r10h2x",
     "dept": "경영기획",
     "date": "2026-10-09",
     "auditor": "최유진",
     "scope": "프로세스 심사 (IATF 16949)",
     "progress": 40,
     "status": "진행중"
    },
    {
     "id": "r10h2y",
     "dept": "금형",
     "date": "2026-11-10",
     "auditor": "최유진",
     "scope": "공정 심사 (VDA 6.3)",
     "progress": 0,
     "status": "예정"
    },
    {
     "id": "r10h2z",
     "dept": "IT",
     "date": "2026-12-22",
     "auditor": "정하늘",
     "scope": "프로세스 심사 (IATF 16949)",
     "progress": 0,
     "status": "예정"
    }
   ]
  },
  {
   "id": "launch",
   "name": "초기유동관리",
   "desc": "신규 양산 부품의 SOP 이후 90일 초기유동 관리입니다.",
   "dateField": "sop",
   "titleField": "part",
   "asOfField": "",
   "fields": [
    {
     "key": "part",
     "label": "부품",
     "type": "ref",
     "ref": "parts",
     "req": true
    },
    {
     "key": "customer",
     "label": "고객사",
     "type": "ref",
     "ref": "customers"
    },
    {
     "key": "sop",
     "label": "SOP",
     "type": "date",
     "req": true
    },
    {
     "key": "end",
     "label": "관리 종료 예정",
     "type": "date"
    },
    {
     "key": "defects",
     "label": "누적 불량",
     "type": "number"
    },
    {
     "key": "elapsed",
     "label": "경과일",
     "type": "days",
     "from": "sop",
     "to": "@today"
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "관리중",
      "종료"
     ],
     "badge": true
    }
   ],
   "records": [
    {
     "id": "r10h30",
     "part": "배터리 트레이",
     "customer": "S모빌리티",
     "sop": "2026-03-16",
     "end": "2026-06-14",
     "defects": 16,
     "status": "종료"
    },
    {
     "id": "r10h31",
     "part": "커넥터 하우징",
     "customer": "S모빌리티",
     "sop": "2026-05-11",
     "end": "2026-08-09",
     "defects": 36,
     "status": "종료"
    },
    {
     "id": "r10h32",
     "part": "범퍼 빔",
     "customer": "H사",
     "sop": "2026-06-22",
     "end": "2026-09-20",
     "defects": 22,
     "status": "종료"
    },
    {
     "id": "r10h33",
     "part": "도어 트림",
     "customer": "K사",
     "sop": "2026-08-03",
     "end": "2026-11-01",
     "defects": 6,
     "status": "관리중"
    },
    {
     "id": "r10h34",
     "part": "스티어링 브라켓",
     "customer": "G사",
     "sop": "2026-09-07",
     "end": "2026-12-06",
     "defects": 11,
     "status": "관리중"
    },
    {
     "id": "r10h35",
     "part": "테일게이트 힌지",
     "customer": "R사",
     "sop": "2026-10-26",
     "end": "2027-01-24",
     "defects": 0,
     "status": "관리중"
    },
    {
     "id": "r10h36",
     "part": "콘솔 커버",
     "customer": "H사",
     "sop": "2026-11-16",
     "end": "2027-02-14",
     "defects": 0,
     "status": "관리중"
    },
    {
     "id": "r10h37",
     "part": "암레스트",
     "customer": "K사",
     "sop": "2025-11-10",
     "end": "2026-02-08",
     "defects": 21,
     "status": "종료"
    }
   ]
  },
  {
   "id": "ppap",
   "name": "PPAP",
   "desc": "고객 양산 부품 승인(PPAP) 제출과 승인 진행입니다.",
   "dateField": "due",
   "titleField": "name",
   "asOfField": "",
   "fields": [
    {
     "key": "partno",
     "label": "품번",
     "type": "text"
    },
    {
     "key": "name",
     "label": "품명",
     "type": "text",
     "req": true
    },
    {
     "key": "customer",
     "label": "고객사",
     "type": "ref",
     "ref": "customers"
    },
    {
     "key": "level",
     "label": "제출 레벨",
     "type": "select",
     "options": [
      "Level 1",
      "Level 2",
      "Level 3",
      "Level 4",
      "Level 5"
     ]
    },
    {
     "key": "stage",
     "label": "단계",
     "type": "select",
     "options": [
      "서류준비",
      "제출",
      "고객검토",
      "승인"
     ]
    },
    {
     "key": "due",
     "label": "제출 기한",
     "type": "date",
     "req": true
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "진행중",
      "지연",
      "승인"
     ],
     "badge": true
    },
    {
     "key": "approved",
     "label": "승인일",
     "type": "date",
     "closes": true
    }
   ],
   "records": [
    {
     "id": "r10h38",
     "partno": "BRK-1830-C",
     "name": "브라켓 BRK-1830 (설변)",
     "customer": "G사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2025-05-29",
     "status": "승인",
     "approved": "2025-05-20"
    },
    {
     "id": "r10h39",
     "partno": "CH-0451-A",
     "name": "커넥터 하우징 (2차 협력사 변경)",
     "customer": "S모빌리티",
     "level": "Level 4",
     "stage": "승인",
     "due": "2026-05-22",
     "status": "승인",
     "approved": "2026-05-16"
    },
    {
     "id": "r10h3a",
     "partno": "CH-0451-E",
     "name": "커넥터 하우징 (금형 이관)",
     "customer": "S모빌리티",
     "level": "Level 2",
     "stage": "승인",
     "due": "2026-01-15",
     "status": "승인",
     "approved": "2026-01-15"
    },
    {
     "id": "r10h3b",
     "partno": "HG-0920-D",
     "name": "힌지 ASSY (금형 이관)",
     "customer": "R사",
     "level": "Level 4",
     "stage": "제출",
     "due": "2026-12-13",
     "status": "진행중",
     "approved": ""
    },
    {
     "id": "r10h3c",
     "partno": "DT-7710-D",
     "name": "도어 트림 (설변)",
     "customer": "K사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2025-06-06",
     "status": "승인",
     "approved": "2025-06-02"
    },
    {
     "id": "r10h3d",
     "partno": "BT-5100-D",
     "name": "배터리 트레이",
     "customer": "S모빌리티",
     "level": "Level 3",
     "stage": "승인",
     "due": "2026-07-14",
     "status": "승인",
     "approved": "2026-07-04"
    },
    {
     "id": "r10h3e",
     "partno": "BB-3300-C",
     "name": "범퍼 빔 (2차 협력사 변경)",
     "customer": "H사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2025-11-27",
     "status": "승인",
     "approved": "2025-11-24"
    },
    {
     "id": "r10h3f",
     "partno": "TH-0880-D",
     "name": "테일게이트 힌지 (신규)",
     "customer": "R사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2025-11-08",
     "status": "승인",
     "approved": "2025-10-30"
    },
    {
     "id": "r10h3g",
     "partno": "BB-3300-B",
     "name": "범퍼 빔 (신규)",
     "customer": "H사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2026-11-03",
     "status": "승인",
     "approved": "2026-09-28"
    },
    {
     "id": "r10h3h",
     "partno": "BB-3300-D",
     "name": "범퍼 빔 (설변)",
     "customer": "H사",
     "level": "Level 4",
     "stage": "승인",
     "due": "2026-09-05",
     "status": "승인",
     "approved": "2026-09-04"
    },
    {
     "id": "r10h3i",
     "partno": "BRK-2041-A",
     "name": "리어 브라켓 (설변)",
     "customer": "H사",
     "level": "Level 2",
     "stage": "제출",
     "due": "2026-10-18",
     "status": "진행중",
     "approved": ""
    },
    {
     "id": "r10h3j",
     "partno": "HG-0920-C",
     "name": "힌지 ASSY (설변)",
     "customer": "R사",
     "level": "Level 2",
     "stage": "승인",
     "due": "2025-05-02",
     "status": "승인",
     "approved": "2025-04-25"
    },
    {
     "id": "r10h3k",
     "partno": "GB-2200-D",
     "name": "글로브박스 (금형 이관)",
     "customer": "G사",
     "level": "Level 2",
     "stage": "승인",
     "due": "2026-07-27",
     "status": "승인",
     "approved": "2026-07-26"
    },
    {
     "id": "r10h3l",
     "partno": "SB-6620-C",
     "name": "스티어링 브라켓 (신규)",
     "customer": "G사",
     "level": "Level 2",
     "stage": "승인",
     "due": "2025-09-22",
     "status": "승인",
     "approved": "2025-09-12"
    },
    {
     "id": "r10h3m",
     "partno": "SB-6620-C",
     "name": "스티어링 브라켓 (2차 협력사 변경)",
     "customer": "G사",
     "level": "Level 4",
     "stage": "승인",
     "due": "2026-06-26",
     "status": "승인",
     "approved": "2026-06-21"
    },
    {
     "id": "r10h3n",
     "partno": "TH-0880-C",
     "name": "테일게이트 힌지",
     "customer": "R사",
     "level": "Level 2",
     "stage": "승인",
     "due": "2026-03-03",
     "status": "승인",
     "approved": "2026-02-23"
    },
    {
     "id": "r10h3o",
     "partno": "LAT-3290-E",
     "name": "도어래치 ASSY",
     "customer": "H사",
     "level": "Level 2",
     "stage": "승인",
     "due": "2026-08-07",
     "status": "승인",
     "approved": "2026-08-04"
    },
    {
     "id": "r10h3p",
     "partno": "GB-2200-A",
     "name": "글로브박스 (설변)",
     "customer": "G사",
     "level": "Level 4",
     "stage": "승인",
     "due": "2026-08-15",
     "status": "승인",
     "approved": "2026-08-13"
    },
    {
     "id": "r10h3q",
     "partno": "CV-4400-C",
     "name": "콘솔 커버 (설변)",
     "customer": "H사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2025-09-08",
     "status": "승인",
     "approved": "2025-09-01"
    },
    {
     "id": "r10h3r",
     "partno": "BT-5100-E",
     "name": "배터리 트레이",
     "customer": "S모빌리티",
     "level": "Level 3",
     "stage": "승인",
     "due": "2026-05-25",
     "status": "승인",
     "approved": "2026-05-25"
    },
    {
     "id": "r10h3s",
     "partno": "BT-5100-B",
     "name": "배터리 트레이 (2차 협력사 변경)",
     "customer": "S모빌리티",
     "level": "Level 2",
     "stage": "승인",
     "due": "2025-12-07",
     "status": "승인",
     "approved": "2025-12-03"
    },
    {
     "id": "r10h3t",
     "partno": "DT-7710-C",
     "name": "도어 트림 (설변)",
     "customer": "K사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2026-03-07",
     "status": "승인",
     "approved": "2026-02-27"
    },
    {
     "id": "r10h3u",
     "partno": "HG-0920-C",
     "name": "힌지 ASSY (설변)",
     "customer": "R사",
     "level": "Level 2",
     "stage": "승인",
     "due": "2026-09-10",
     "status": "승인",
     "approved": "2026-09-01"
    },
    {
     "id": "r10h3v",
     "partno": "BT-5100-C",
     "name": "배터리 트레이",
     "customer": "S모빌리티",
     "level": "Level 3",
     "stage": "승인",
     "due": "2025-09-02",
     "status": "승인",
     "approved": "2025-08-28"
    },
    {
     "id": "r10h3w",
     "partno": "BT-5100-B",
     "name": "배터리 트레이",
     "customer": "S모빌리티",
     "level": "Level 3",
     "stage": "승인",
     "due": "2025-10-10",
     "status": "승인",
     "approved": "2025-09-30"
    },
    {
     "id": "r10h3x",
     "partno": "CV-4400-B",
     "name": "콘솔 커버 (2차 협력사 변경)",
     "customer": "H사",
     "level": "Level 2",
     "stage": "승인",
     "due": "2026-10-03",
     "status": "승인",
     "approved": "2026-09-25"
    },
    {
     "id": "r10h3y",
     "partno": "BRK-2041-A",
     "name": "리어 브라켓 (2차 협력사 변경)",
     "customer": "H사",
     "level": "Level 4",
     "stage": "승인",
     "due": "2025-05-06",
     "status": "승인",
     "approved": "2025-05-04"
    },
    {
     "id": "r10h3z",
     "partno": "SB-6620-A",
     "name": "스티어링 브라켓 (설변)",
     "customer": "G사",
     "level": "Level 4",
     "stage": "승인",
     "due": "2025-11-04",
     "status": "승인",
     "approved": "2025-10-26"
    },
    {
     "id": "r10h40",
     "partno": "SB-6620-C",
     "name": "스티어링 브라켓",
     "customer": "G사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2026-10-01",
     "status": "승인",
     "approved": "2026-09-30"
    },
    {
     "id": "r10h41",
     "partno": "CV-4400-C",
     "name": "콘솔 커버 (설변)",
     "customer": "H사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2026-04-14",
     "status": "승인",
     "approved": "2026-04-07"
    },
    {
     "id": "r10h42",
     "partno": "AR-1100-B",
     "name": "암레스트 (2차 협력사 변경)",
     "customer": "K사",
     "level": "Level 2",
     "stage": "승인",
     "due": "2025-08-10",
     "status": "승인",
     "approved": "2025-08-04"
    },
    {
     "id": "r10h43",
     "partno": "BRK-2041-B",
     "name": "리어 브라켓 (금형 이관)",
     "customer": "H사",
     "level": "Level 3",
     "stage": "고객검토",
     "due": "2026-12-18",
     "status": "진행중",
     "approved": ""
    },
    {
     "id": "r10h44",
     "partno": "AR-1100-C",
     "name": "암레스트 (설변)",
     "customer": "K사",
     "level": "Level 2",
     "stage": "승인",
     "due": "2025-05-18",
     "status": "승인",
     "approved": "2025-05-10"
    },
    {
     "id": "r10h45",
     "partno": "GB-2200-E",
     "name": "글로브박스 (금형 이관)",
     "customer": "G사",
     "level": "Level 2",
     "stage": "승인",
     "due": "2026-01-28",
     "status": "승인",
     "approved": "2026-01-20"
    },
    {
     "id": "r10h46",
     "partno": "CH-0451-D",
     "name": "커넥터 하우징",
     "customer": "S모빌리티",
     "level": "Level 3",
     "stage": "승인",
     "due": "2026-05-16",
     "status": "승인",
     "approved": "2026-05-14"
    },
    {
     "id": "r10h47",
     "partno": "GB-2200-E",
     "name": "글로브박스 (신규)",
     "customer": "G사",
     "level": "Level 3",
     "stage": "제출",
     "due": "2026-10-23",
     "status": "진행중",
     "approved": ""
    },
    {
     "id": "r10h48",
     "partno": "BRK-2041-A",
     "name": "리어 브라켓 (신규)",
     "customer": "H사",
     "level": "Level 4",
     "stage": "승인",
     "due": "2026-05-05",
     "status": "승인",
     "approved": "2026-04-26"
    },
    {
     "id": "r10h49",
     "partno": "TH-0880-B",
     "name": "테일게이트 힌지",
     "customer": "R사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2026-01-25",
     "status": "승인",
     "approved": "2026-01-23"
    },
    {
     "id": "r10h4a",
     "partno": "SB-6620-B",
     "name": "스티어링 브라켓 (설변)",
     "customer": "G사",
     "level": "Level 4",
     "stage": "승인",
     "due": "2026-01-13",
     "status": "승인",
     "approved": "2026-01-13"
    },
    {
     "id": "r10h4b",
     "partno": "HG-0920-C",
     "name": "힌지 ASSY (2차 협력사 변경)",
     "customer": "R사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2025-10-09",
     "status": "승인",
     "approved": "2025-10-02"
    },
    {
     "id": "r10h4c",
     "partno": "DT-7710-E",
     "name": "도어 트림 (설변)",
     "customer": "K사",
     "level": "Level 3",
     "stage": "승인",
     "due": "2025-12-13",
     "status": "승인",
     "approved": "2025-12-13"
    },
    {
     "id": "r10h4d",
     "partno": "BRK-2041-C",
     "name": "리어 브라켓 (2차 협력사 변경)",
     "customer": "H사",
     "level": "Level 3",
     "stage": "제출",
     "due": "2026-11-10",
     "status": "진행중",
     "approved": ""
    }
   ]
  },
  {
   "id": "tasks",
   "name": "업무 일정",
   "desc": "심사, PPAP, 회의 등 기한이 있는 업무를 기록합니다.",
   "dateField": "due",
   "titleField": "title",
   "asOfField": "",
   "fields": [
    {
     "key": "title",
     "label": "업무",
     "type": "text",
     "req": true
    },
    {
     "key": "category",
     "label": "분류",
     "type": "select",
     "options": [
      "고객 대응",
      "내부 개선",
      "심사",
      "보고",
      "교육"
     ]
    },
    {
     "key": "repeat",
     "label": "반복",
     "type": "select",
     "options": [
      "매주",
      "매월",
      "분기",
      "반기",
      "매년"
     ],
     "colors": {
      "매주": "blue",
      "매월": "green",
      "분기": "orange",
      "반기": "purple",
      "매년": "pink"
     }
    },
    {
     "key": "owner",
     "label": "담당",
     "type": "ref",
     "ref": "people"
    },
    {
     "key": "start",
     "label": "시작일",
     "type": "date"
    },
    {
     "key": "due",
     "label": "기한",
     "type": "date",
     "req": true
    },
    {
     "key": "left",
     "label": "남은 일수",
     "type": "days",
     "from": "@today",
     "to": "due"
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "예정",
      "진행중",
      "완료"
     ],
     "badge": true
    },
    {
     "key": "progress",
     "label": "진행률",
     "type": "number"
    },
    {
     "key": "memo",
     "label": "메모",
     "type": "longtext"
    }
   ],
   "records": [
    {
     "id": "r10h4e",
     "title": "H사 분기 품질 회의 자료 준비",
     "category": "보고",
     "owner": "김민수",
     "start": "2026-07-26",
     "due": "2026-08-25",
     "status": "완료",
     "progress": 100,
     "memo": "",
     "_rep": 1
    },
    {
     "id": "r10h4f",
     "title": "K사 클레임 8D 회신",
     "category": "고객 대응",
     "owner": "최유진",
     "start": "2026-10-16",
     "due": "2026-11-04",
     "status": "예정",
     "progress": 0,
     "memo": ""
    },
    {
     "id": "r10h4g",
     "title": "IATF 사후심사 대응 준비",
     "category": "심사",
     "owner": "정하늘",
     "start": "2026-09-19",
     "due": "2026-10-04",
     "status": "완료",
     "progress": 100,
     "memo": "",
     "_rep": 1
    },
    {
     "id": "r10h4h",
     "title": "신입 품질 교육 (SPC 기초)",
     "category": "교육",
     "owner": "최유진",
     "start": "2026-10-03",
     "due": "2026-11-07",
     "status": "진행중",
     "progress": 37,
     "memo": ""
    },
    {
     "id": "r10h4i",
     "title": "도장 막두께 Cpk 개선 과제",
     "category": "내부 개선",
     "owner": "최유진",
     "start": "2026-08-28",
     "due": "2026-09-08",
     "status": "진행중",
     "progress": 21,
     "memo": ""
    },
    {
     "id": "r10h4j",
     "title": "협력사 3분기 평가 결과 통보",
     "category": "고객 대응",
     "owner": "이서연",
     "start": "2026-10-23",
     "due": "2026-11-07",
     "status": "예정",
     "progress": 0,
     "memo": ""
    },
    {
     "id": "r10h4k",
     "title": "G사 PPAP Level 3 제출",
     "category": "고객 대응",
     "owner": "윤재호",
     "start": "2026-11-24",
     "due": "2026-12-07",
     "status": "예정",
     "progress": 0,
     "memo": ""
    },
    {
     "id": "r10h4l",
     "title": "관리계획서 개정 (도어래치)",
     "category": "내부 개선",
     "owner": "윤재호",
     "start": "2026-09-13",
     "due": "2026-10-06",
     "status": "완료",
     "progress": 100,
     "memo": "",
     "_rep": 1
    },
    {
     "id": "r10h4m",
     "title": "측정기 연간 교정 계획 수립",
     "category": "내부 개선",
     "owner": "오세린",
     "start": "2026-10-15",
     "due": "2026-10-26",
     "status": "예정",
     "progress": 0,
     "memo": ""
    },
    {
     "id": "r10h4n",
     "title": "품질 비용 월간 보고",
     "category": "보고",
     "owner": "이서연",
     "start": "2026-09-17",
     "due": "2026-10-02",
     "status": "완료",
     "progress": 100,
     "memo": "",
     "_rep": 1
    },
    {
     "id": "r10h4o",
     "title": "S모빌리티 신규 부품 초기유동 점검",
     "category": "고객 대응",
     "owner": "윤재호",
     "start": "2026-09-06",
     "due": "2026-10-09",
     "status": "진행중",
     "progress": 57,
     "memo": ""
    },
    {
     "id": "r10h4p",
     "title": "내부심사원 보수 교육",
     "category": "교육",
     "owner": "김민수",
     "start": "2026-08-17",
     "due": "2026-09-14",
     "status": "완료",
     "progress": 100,
     "memo": "",
     "_rep": 1
    },
    {
     "id": "r10h4q",
     "title": "출하검사 기준서 개정",
     "category": "내부 개선",
     "owner": "박지훈",
     "start": "2026-08-09",
     "due": "2026-09-10",
     "status": "완료",
     "progress": 100,
     "memo": "",
     "_rep": 1
    },
    {
     "id": "r10h4r",
     "title": "R사 공정 감사 대응",
     "category": "심사",
     "owner": "윤재호",
     "start": "2026-10-19",
     "due": "2026-11-14",
     "status": "예정",
     "progress": 0,
     "memo": ""
    },
    {
     "id": "r10h4s",
     "title": "고객 반품 분석 보고",
     "category": "보고",
     "owner": "최유진",
     "start": "2026-10-15",
     "due": "2026-11-06",
     "status": "예정",
     "progress": 0,
     "memo": ""
    },
    {
     "id": "r10h4t",
     "title": "용접 강도 시험 설비 점검",
     "category": "내부 개선",
     "owner": "한도윤",
     "start": "2026-11-01",
     "due": "2026-11-13",
     "status": "예정",
     "progress": 0,
     "memo": ""
    },
    {
     "id": "r10h4u",
     "title": "협력사 4M 변경 승인 검토",
     "category": "고객 대응",
     "owner": "윤재호",
     "start": "2026-08-08",
     "due": "2026-08-29",
     "status": "완료",
     "progress": 100,
     "memo": "",
     "_rep": 1
    },
    {
     "id": "r10h4v",
     "title": "연간 품질 목표 실적 정리",
     "category": "보고",
     "owner": "김민수",
     "start": "2026-08-31",
     "due": "2026-09-29",
     "status": "완료",
     "progress": 100,
     "memo": "",
     "_rep": 1
    },
    {
     "id": "r10h4w",
     "title": "불량 유형 판정 기준 정비",
     "category": "내부 개선",
     "owner": "이서연",
     "start": "2026-10-06",
     "due": "2026-10-16",
     "status": "진행중",
     "progress": 23,
     "memo": ""
    },
    {
     "id": "r10h4x",
     "title": "H사 공정 심사 시정조치 완료 보고",
     "category": "심사",
     "owner": "최유진",
     "start": "2026-10-13",
     "due": "2026-11-06",
     "status": "예정",
     "progress": 0,
     "memo": ""
    },
    {
     "id": "rtl03s",
     "title": "주간 품질 회의 자료 준비",
     "category": "보고",
     "repeat": "매주",
     "owner": "김민수",
     "start": "2026-10-12",
     "due": "2026-10-13",
     "status": "진행중",
     "progress": 30,
     "memo": ""
    },
    {
     "id": "rtmf9y",
     "title": "월간 품질 실적 보고 (10월)",
     "category": "보고",
     "repeat": "매월",
     "owner": "최유진",
     "start": "2026-10-25",
     "due": "2026-11-03",
     "status": "예정",
     "progress": 0,
     "memo": ""
    },
    {
     "id": "rtnh3f",
     "title": "측정기 정기 점검 (일상 점검표 확인)",
     "category": "내부 개선",
     "repeat": "매월",
     "owner": "오세린",
     "start": "2026-10-01",
     "due": "2026-10-31",
     "status": "진행중",
     "progress": 40,
     "memo": ""
    },
    {
     "id": "rtovcj",
     "title": "분기 협력사 품질 평가 (4분기)",
     "category": "심사",
     "repeat": "분기",
     "owner": "박지훈",
     "start": "2026-12-01",
     "due": "2026-12-20",
     "status": "예정",
     "progress": 0,
     "memo": ""
    },
    {
     "id": "rtpvyf",
     "title": "반기 내부 품질 심사 계획 수립",
     "category": "심사",
     "repeat": "반기",
     "owner": "정하늘",
     "start": "2026-11-15",
     "due": "2026-12-15",
     "status": "예정",
     "progress": 0,
     "memo": ""
    },
    {
     "id": "rtqu7k",
     "title": "연간 IATF 16949 교육 계획 수립",
     "category": "교육",
     "repeat": "매년",
     "owner": "한도윤",
     "start": "2026-11-20",
     "due": "2026-12-31",
     "status": "예정",
     "progress": 0,
     "memo": ""
    }
   ],
   "repeat": {
    "field": "repeat"
   }
  },
  {
   "id": "memos",
   "name": "메모 · 회의록",
   "desc": "회의 결과, 공지, 이슈 등 짧은 메모를 기록합니다.",
   "dateField": "date",
   "titleField": "content",
   "fields": [
    {
     "key": "date",
     "label": "작성일",
     "type": "date",
     "req": true
    },
    {
     "key": "category",
     "label": "구분",
     "type": "select",
     "options": [
      "회의",
      "공지",
      "이슈",
      "기타"
     ],
     "colors": {
      "회의": "blue",
      "공지": "green",
      "이슈": "red",
      "기타": "gray"
     }
    },
    {
     "key": "content",
     "label": "내용",
     "type": "text",
     "req": true
    },
    {
     "key": "owner",
     "label": "작성자",
     "type": "ref",
     "ref": "people"
    },
    {
     "key": "detail",
     "label": "상세 내용",
     "type": "longtext"
    }
   ],
   "colW": {
    "date": 174,
    "category": 111,
    "content": 529,
    "owner": 131,
    "detail": 146
   },
   "records": [
    {
     "id": "r10h4y",
     "date": "2026-10-08",
     "category": "회의",
     "content": "주간 품질 회의: H사 클레임 감소 대책 공유",
     "owner": "한도윤",
     "detail": ""
    },
    {
     "id": "r10h4z",
     "date": "2026-09-23",
     "category": "공지",
     "content": "IATF 사후심사 일정 확정 (11월 둘째 주)",
     "owner": "박지훈",
     "detail": ""
    },
    {
     "id": "r10h50",
     "date": "2026-09-08",
     "category": "이슈",
     "content": "도장 라인 막두께 산포 증가 — 건 교체 검토",
     "owner": "김민수",
     "detail": ""
    },
    {
     "id": "r10h51",
     "date": "2026-08-23",
     "category": "회의",
     "content": "협력사 품질 협의회: 수입검사 불량률 공유",
     "owner": "오세린",
     "detail": ""
    },
    {
     "id": "r10h52",
     "date": "2026-08-10",
     "category": "공지",
     "content": "측정기 교정 기한 도래 목록 배포",
     "owner": "최유진",
     "detail": ""
    },
    {
     "id": "r10h53",
     "date": "2026-07-27",
     "category": "이슈",
     "content": "S모빌리티 배터리 트레이 용접 스패터 재발",
     "owner": "박지훈",
     "detail": ""
    },
    {
     "id": "r10h54",
     "date": "2026-07-12",
     "category": "회의",
     "content": "8D 진행 점검: 지연 건 담당자별 일정 재수립",
     "owner": "김민수",
     "detail": ""
    },
    {
     "id": "r10h55",
     "date": "2026-06-25",
     "category": "기타",
     "content": "품질 교육 자료 공유 폴더 정리",
     "owner": "이서연",
     "detail": ""
    },
    {
     "id": "r10h56",
     "date": "2026-06-11",
     "category": "이슈",
     "content": "K사 소음 클레임 — 체결 토크 재검증 필요",
     "owner": "한도윤",
     "detail": ""
    },
    {
     "id": "r10h57",
     "date": "2026-05-30",
     "category": "회의",
     "content": "월간 품질 비용 리뷰: 외부 실패 비용 전월 대비 감소",
     "owner": "한도윤",
     "detail": ""
    },
    {
     "id": "r10h58",
     "date": "2026-05-13",
     "category": "공지",
     "content": "관리계획서 개정본 배포 (도어래치 ASSY)",
     "owner": "한도윤",
     "detail": ""
    },
    {
     "id": "r10h59",
     "date": "2026-04-29",
     "category": "이슈",
     "content": "수입검사 도금 박리 3건 — 동양도금 현장 점검",
     "owner": "윤재호",
     "detail": ""
    },
    {
     "id": "r10h5a",
     "date": "2026-04-17",
     "category": "회의",
     "content": " 품질 회의: H사 클레임 감소 대책 공유",
     "owner": "한도윤",
     "detail": ""
    },
    {
     "id": "r10h5b",
     "date": "2026-03-31",
     "category": "공지",
     "content": "IATF 사후심사 일정 확정 (11월 둘째 주)",
     "owner": "이서연",
     "detail": ""
    },
    {
     "id": "r10h5c",
     "date": "2026-03-16",
     "category": "이슈",
     "content": "도장 라인 막두께 산포 증가 — 건 교체 검토",
     "owner": "박지훈",
     "detail": ""
    },
    {
     "id": "r10h5d",
     "date": "2026-03-04",
     "category": "회의",
     "content": "협력사 품질 협의회: 수입검사 불량률 공유",
     "owner": "정하늘",
     "detail": ""
    },
    {
     "id": "r10h5e",
     "date": "2026-02-15",
     "category": "공지",
     "content": "측정기 교정 기한 도래 목록 배포",
     "owner": "한도윤",
     "detail": ""
    },
    {
     "id": "r10h5f",
     "date": "2026-02-01",
     "category": "이슈",
     "content": "S모빌리티 배터리 트레이 용접 스패터 재발",
     "owner": "최유진",
     "detail": ""
    },
    {
     "id": "r10h5g",
     "date": "2026-01-20",
     "category": "회의",
     "content": "8D 진행 점검: 지연 건 담당자별 일정 재수립",
     "owner": "이서연",
     "detail": ""
    },
    {
     "id": "r10h5h",
     "date": "2026-01-02",
     "category": "기타",
     "content": "품질 교육 자료 공유 폴더 정리",
     "owner": "최유진",
     "detail": ""
    },
    {
     "id": "r10h5i",
     "date": "2025-12-20",
     "category": "이슈",
     "content": "K사 소음 클레임 — 체결 토크 재검증 필요",
     "owner": "이서연",
     "detail": ""
    },
    {
     "id": "r10h5j",
     "date": "2025-12-07",
     "category": "회의",
     "content": " 품질 비용 리뷰: 외부 실패 비용 전월 대비 감소",
     "owner": "오세린",
     "detail": ""
    },
    {
     "id": "r10h5k",
     "date": "2025-11-23",
     "category": "공지",
     "content": "관리계획서 개정본 배포 (도어래치 ASSY)",
     "owner": "이서연",
     "detail": ""
    },
    {
     "id": "r10h5l",
     "date": "2025-11-08",
     "category": "이슈",
     "content": "수입검사 도금 박리 3건 — 동양도금 현장 점검",
     "owner": "김민수",
     "detail": ""
    },
    {
     "id": "r10h5m",
     "date": "2025-10-23",
     "category": "회의",
     "content": " 품질 회의: H사 클레임 감소 대책 공유",
     "owner": "오세린",
     "detail": ""
    },
    {
     "id": "r10h5n",
     "date": "2025-10-09",
     "category": "공지",
     "content": "IATF 사후심사 일정 확정 (11월 둘째 주)",
     "owner": "박지훈",
     "detail": ""
    },
    {
     "id": "r10h5o",
     "date": "2025-09-23",
     "category": "이슈",
     "content": "도장 라인 막두께 산포 증가 — 건 교체 검토",
     "owner": "이서연",
     "detail": ""
    },
    {
     "id": "r10h5p",
     "date": "2025-09-10",
     "category": "회의",
     "content": "협력사 품질 협의회: 수입검사 불량률 공유",
     "owner": "이서연",
     "detail": ""
    },
    {
     "id": "r10h5q",
     "date": "2025-08-26",
     "category": "공지",
     "content": "측정기 교정 기한 도래 목록 배포",
     "owner": "김민수",
     "detail": ""
    },
    {
     "id": "r10h5r",
     "date": "2025-08-12",
     "category": "이슈",
     "content": "S모빌리티 배터리 트레이 용접 스패터 재발",
     "owner": "김민수",
     "detail": ""
    },
    {
     "id": "r10h5s",
     "date": "2025-07-30",
     "category": "회의",
     "content": "8D 진행 점검: 지연 건 담당자별 일정 재수립",
     "owner": "한도윤",
     "detail": ""
    },
    {
     "id": "r10h5t",
     "date": "2025-07-15",
     "category": "기타",
     "content": "품질 교육 자료 공유 폴더 정리",
     "owner": "윤재호",
     "detail": ""
    },
    {
     "id": "r10h5u",
     "date": "2025-06-30",
     "category": "이슈",
     "content": "K사 소음 클레임 — 체결 토크 재검증 필요",
     "owner": "윤재호",
     "detail": ""
    },
    {
     "id": "r10h5v",
     "date": "2025-06-16",
     "category": "회의",
     "content": " 품질 비용 리뷰: 외부 실패 비용 전월 대비 감소",
     "owner": "오세린",
     "detail": ""
    },
    {
     "id": "r10h5w",
     "date": "2025-06-01",
     "category": "공지",
     "content": "관리계획서 개정본 배포 (도어래치 ASSY)",
     "owner": "정하늘",
     "detail": ""
    },
    {
     "id": "r10h5x",
     "date": "2025-05-17",
     "category": "이슈",
     "content": "수입검사 도금 박리 3건 — 동양도금 현장 점검",
     "owner": "김민수",
     "detail": ""
    },
    {
     "id": "r10h5y",
     "date": "2025-05-02",
     "category": "회의",
     "content": " 품질 회의: H사 클레임 감소 대책 공유",
     "owner": "김민수",
     "detail": ""
    },
    {
     "id": "r10h5z",
     "date": "2025-04-16",
     "category": "공지",
     "content": "IATF 사후심사 일정 확정 (11월 둘째 주)",
     "owner": "이서연",
     "detail": ""
    },
    {
     "id": "r10h60",
     "date": "2025-04-03",
     "category": "이슈",
     "content": "도장 라인 막두께 산포 증가 — 건 교체 검토",
     "owner": "김민수",
     "detail": ""
    },
    {
     "id": "r10h61",
     "date": "2025-03-20",
     "category": "회의",
     "content": "협력사 품질 협의회: 수입검사 불량률 공유",
     "owner": "박지훈",
     "detail": ""
    }
   ]
  },
  {
   "id": "calib",
   "name": "측정기 교정 관리",
   "desc": "측정기마다 최근·차기 교정일을 관리합니다.",
   "dateField": "next",
   "titleField": "name",
   "asOfField": "",
   "fields": [
    {
     "key": "no",
     "label": "관리번호",
     "type": "text",
     "auto": "GA-"
    },
    {
     "key": "name",
     "label": "측정기명",
     "type": "text",
     "req": true
    },
    {
     "key": "kind",
     "label": "구분",
     "type": "select",
     "options": [
      "버니어 캘리퍼스",
      "마이크로미터",
      "하이트 게이지",
      "다이얼 게이지",
      "토크 렌치",
      "기타"
     ]
    },
    {
     "key": "line",
     "label": "사용 라인",
     "type": "ref",
     "ref": "lines"
    },
    {
     "key": "owner",
     "label": "담당",
     "type": "ref",
     "ref": "people"
    },
    {
     "key": "last",
     "label": "최근 교정일",
     "type": "date"
    },
    {
     "key": "next",
     "label": "차기 교정일",
     "type": "date",
     "req": true
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "사용중",
      "교정중",
      "폐기"
     ],
     "badge": true
    },
    {
     "key": "note",
     "label": "비고",
     "type": "longtext"
    }
   ],
   "records": [
    {
     "id": "r10h62",
     "no": "GA-001",
     "name": "버니어 캘리퍼스 A",
     "kind": "버니어 캘리퍼스",
     "line": "프레스 1",
     "owner": "오세린",
     "last": "2025-11-13",
     "next": "2026-11-13",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h63",
     "no": "GA-002",
     "name": "버니어 캘리퍼스 B",
     "kind": "버니어 캘리퍼스",
     "line": "조립 1",
     "owner": "오세린",
     "last": "2026-02-25",
     "next": "2027-02-25",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h64",
     "no": "GA-003",
     "name": "버니어 캘리퍼스 C",
     "kind": "버니어 캘리퍼스",
     "line": "도장",
     "owner": "오세린",
     "last": "2025-11-08",
     "next": "2026-11-08",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h65",
     "no": "GA-004",
     "name": "버니어 캘리퍼스 D",
     "kind": "버니어 캘리퍼스",
     "line": "조립 1",
     "owner": "오세린",
     "last": "2026-05-19",
     "next": "2027-05-19",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h66",
     "no": "GA-005",
     "name": "버니어 캘리퍼스 E",
     "kind": "버니어 캘리퍼스",
     "line": "조립 2",
     "owner": "오세린",
     "last": "2025-09-30",
     "next": "2026-09-30",
     "status": "교정중",
     "note": ""
    },
    {
     "id": "r10h67",
     "no": "GA-006",
     "name": "버니어 캘리퍼스 F",
     "kind": "버니어 캘리퍼스",
     "line": "프레스 1",
     "owner": "오세린",
     "last": "2026-09-07",
     "next": "2027-09-07",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h68",
     "no": "GA-007",
     "name": "버니어 캘리퍼스 G",
     "kind": "버니어 캘리퍼스",
     "line": "프레스 2",
     "owner": "오세린",
     "last": "2026-08-20",
     "next": "2027-08-20",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h69",
     "no": "GA-008",
     "name": "버니어 캘리퍼스 H",
     "kind": "버니어 캘리퍼스",
     "line": "도장",
     "owner": "오세린",
     "last": "2026-04-06",
     "next": "2027-04-06",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6a",
     "no": "GA-009",
     "name": "마이크로미터 A",
     "kind": "마이크로미터",
     "line": "조립 2",
     "owner": "오세린",
     "last": "2026-07-19",
     "next": "2027-07-19",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6b",
     "no": "GA-010",
     "name": "마이크로미터 B",
     "kind": "마이크로미터",
     "line": "도장",
     "owner": "오세린",
     "last": "2026-09-25",
     "next": "2027-09-25",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6c",
     "no": "GA-011",
     "name": "마이크로미터 C",
     "kind": "마이크로미터",
     "line": "도장",
     "owner": "오세린",
     "last": "2026-04-24",
     "next": "2027-04-24",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6d",
     "no": "GA-012",
     "name": "마이크로미터 D",
     "kind": "마이크로미터",
     "line": "용접 2",
     "owner": "오세린",
     "last": "2026-09-11",
     "next": "2027-09-11",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6e",
     "no": "GA-013",
     "name": "마이크로미터 E",
     "kind": "마이크로미터",
     "line": "도장",
     "owner": "오세린",
     "last": "2025-12-25",
     "next": "2026-12-25",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6f",
     "no": "GA-014",
     "name": "마이크로미터 F",
     "kind": "마이크로미터",
     "line": "프레스 2",
     "owner": "오세린",
     "last": "2026-02-02",
     "next": "2027-02-02",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6g",
     "no": "GA-015",
     "name": "하이트 게이지 A",
     "kind": "하이트 게이지",
     "line": "사출 1",
     "owner": "오세린",
     "last": "2025-12-06",
     "next": "2026-12-06",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6h",
     "no": "GA-016",
     "name": "하이트 게이지 B",
     "kind": "하이트 게이지",
     "line": "용접 2",
     "owner": "오세린",
     "last": "2026-01-17",
     "next": "2027-01-17",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6i",
     "no": "GA-017",
     "name": "하이트 게이지 C",
     "kind": "하이트 게이지",
     "line": "프레스 2",
     "owner": "오세린",
     "last": "2025-10-01",
     "next": "2026-10-01",
     "status": "교정중",
     "note": ""
    },
    {
     "id": "r10h6j",
     "no": "GA-018",
     "name": "하이트 게이지 D",
     "kind": "하이트 게이지",
     "line": "용접 1",
     "owner": "오세린",
     "last": "2026-07-01",
     "next": "2027-07-01",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6k",
     "no": "GA-019",
     "name": "다이얼 게이지 A",
     "kind": "다이얼 게이지",
     "line": "조립 1",
     "owner": "오세린",
     "last": "2026-03-27",
     "next": "2027-03-27",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6l",
     "no": "GA-020",
     "name": "다이얼 게이지 B",
     "kind": "다이얼 게이지",
     "line": "사출 1",
     "owner": "오세린",
     "last": "2025-11-28",
     "next": "2026-11-28",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6m",
     "no": "GA-021",
     "name": "다이얼 게이지 C",
     "kind": "다이얼 게이지",
     "line": "용접 1",
     "owner": "오세린",
     "last": "2026-05-09",
     "next": "2027-05-09",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6n",
     "no": "GA-022",
     "name": "다이얼 게이지 D",
     "kind": "다이얼 게이지",
     "line": "도장",
     "owner": "오세린",
     "last": "2025-11-20",
     "next": "2026-11-20",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6o",
     "no": "GA-023",
     "name": "다이얼 게이지 E",
     "kind": "다이얼 게이지",
     "line": "용접 1",
     "owner": "오세린",
     "last": "2026-07-22",
     "next": "2027-07-22",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6p",
     "no": "GA-024",
     "name": "토크 렌치 A",
     "kind": "토크 렌치",
     "line": "프레스 1",
     "owner": "오세린",
     "last": "2026-06-22",
     "next": "2026-12-19",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6q",
     "no": "GA-025",
     "name": "토크 렌치 B",
     "kind": "토크 렌치",
     "line": "용접 1",
     "owner": "오세린",
     "last": "2026-08-15",
     "next": "2027-02-11",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6r",
     "no": "GA-026",
     "name": "토크 렌치 C",
     "kind": "토크 렌치",
     "line": "사출 1",
     "owner": "오세린",
     "last": "2026-09-28",
     "next": "2027-03-27",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6s",
     "no": "GA-027",
     "name": "토크 렌치 D",
     "kind": "토크 렌치",
     "line": "용접 1",
     "owner": "오세린",
     "last": "2026-08-21",
     "next": "2027-02-17",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6t",
     "no": "GA-028",
     "name": "토크 렌치 E",
     "kind": "토크 렌치",
     "line": "조립 2",
     "owner": "오세린",
     "last": "2026-07-24",
     "next": "2027-01-20",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6u",
     "no": "GA-029",
     "name": "기타 A",
     "kind": "기타",
     "line": "용접 1",
     "owner": "오세린",
     "last": "2026-05-22",
     "next": "2027-05-22",
     "status": "사용중",
     "note": ""
    },
    {
     "id": "r10h6v",
     "no": "GA-030",
     "name": "기타 B",
     "kind": "기타",
     "line": "조립 2",
     "owner": "오세린",
     "last": "2025-11-18",
     "next": "2026-11-18",
     "status": "사용중",
     "note": ""
    }
   ]
  },
  {
   "id": "auditfind",
   "name": "고객 심사 지적사항",
   "desc": "고객·인증 심사에서 받은 지적을 등급·기한·조치 상태로 관리합니다.",
   "dateField": "date",
   "titleField": "content",
   "fields": [
    {
     "key": "no",
     "label": "지적번호",
     "type": "text",
     "auto": "AU-{YY}-"
    },
    {
     "key": "date",
     "label": "심사일",
     "type": "date",
     "req": true
    },
    {
     "key": "customer",
     "label": "고객사",
     "type": "ref",
     "ref": "customers"
    },
    {
     "key": "content",
     "label": "지적 내용",
     "type": "text",
     "req": true
    },
    {
     "key": "level",
     "label": "등급",
     "type": "select",
     "options": [
      "중결함",
      "경결함",
      "관찰"
     ],
     "colors": {
      "중결함": "red",
      "경결함": "orange",
      "관찰": "gray"
     }
    },
    {
     "key": "owner",
     "label": "담당",
     "type": "ref",
     "ref": "people"
    },
    {
     "key": "due",
     "label": "조치 기한",
     "type": "date"
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "접수",
      "조치중",
      "완료"
     ],
     "badge": true
    },
    {
     "key": "closed",
     "label": "완료일",
     "type": "date",
     "closes": true
    },
    {
     "key": "lead",
     "label": "처리 기간(일)",
     "type": "days",
     "from": "date",
     "to": "closed"
    }
   ],
   "records": [
    {
     "id": "r10h7k",
     "no": "AU-25-001",
     "date": "2025-09-05",
     "customer": "K사",
     "content": "출하 검사 성적서 서명 누락",
     "level": "중결함",
     "owner": "정하늘",
     "due": "2025-09-25",
     "status": "완료",
     "closed": "2025-10-03"
    },
    {
     "id": "r10h7h",
     "no": "AU-25-002",
     "date": "2025-10-08",
     "customer": "G사",
     "content": "변경점 고객 통보 지연",
     "level": "관찰",
     "owner": "최유진",
     "due": "2025-11-20",
     "status": "완료",
     "closed": "2025-10-28"
    },
    {
     "id": "r10h77",
     "no": "AU-25-003",
     "date": "2025-10-18",
     "customer": "G사",
     "content": "변경점 고객 통보 지연",
     "level": "관찰",
     "owner": "김민수",
     "due": "2025-11-20",
     "status": "완료",
     "closed": "2025-11-09"
    },
    {
     "id": "r10h75",
     "no": "AU-25-004",
     "date": "2025-11-22",
     "customer": "S모빌리티",
     "content": "관리계획서와 현장 검사 주기 불일치",
     "level": "경결함",
     "owner": "최유진",
     "due": "2025-12-13",
     "status": "완료",
     "closed": "2025-12-02"
    },
    {
     "id": "r10h7i",
     "no": "AU-25-005",
     "date": "2025-12-06",
     "customer": "H사",
     "content": "출하 검사 성적서 서명 누락",
     "level": "경결함",
     "owner": "김민수",
     "due": "2026-01-20",
     "status": "완료",
     "closed": "2025-12-21"
    },
    {
     "id": "r10h76",
     "no": "AU-26-001",
     "date": "2026-02-05",
     "customer": "H사",
     "content": "에러 프루프 점검 기록 누락",
     "level": "중결함",
     "owner": "김민수",
     "due": "2026-03-10",
     "status": "완료",
     "closed": "2026-02-12"
    },
    {
     "id": "r10h79",
     "no": "AU-26-002",
     "date": "2026-02-14",
     "customer": "H사",
     "content": "출하 검사 성적서 서명 누락",
     "level": "관찰",
     "owner": "김민수",
     "due": "2026-03-09",
     "status": "완료",
     "closed": "2026-03-05"
    },
    {
     "id": "r10h73",
     "no": "AU-26-003",
     "date": "2026-03-12",
     "customer": "H사",
     "content": "변경점 고객 통보 지연",
     "level": "중결함",
     "owner": "김민수",
     "due": "2026-04-09",
     "status": "완료",
     "closed": "2026-04-19"
    },
    {
     "id": "r10h7l",
     "no": "AU-26-004",
     "date": "2026-03-19",
     "customer": "S모빌리티",
     "content": "출하 검사 성적서 서명 누락",
     "level": "중결함",
     "owner": "최유진",
     "due": "2026-04-09",
     "status": "완료",
     "closed": "2026-04-18"
    },
    {
     "id": "r10h7g",
     "no": "AU-26-005",
     "date": "2026-05-19",
     "customer": "K사",
     "content": "출하 검사 성적서 서명 누락",
     "level": "경결함",
     "owner": "김민수",
     "due": "2026-06-16",
     "status": "완료",
     "closed": "2026-06-14"
    },
    {
     "id": "r10h7b",
     "no": "AU-26-006",
     "date": "2026-05-27",
     "customer": "H사",
     "content": "작업표준서 최신본 미게시",
     "level": "중결함",
     "owner": "정하늘",
     "due": "2026-07-07",
     "status": "완료",
     "closed": "2026-06-21"
    },
    {
     "id": "r10h7a",
     "no": "AU-26-007",
     "date": "2026-05-31",
     "customer": "H사",
     "content": "출하 검사 성적서 서명 누락",
     "level": "관찰",
     "owner": "최유진",
     "due": "2026-06-20",
     "status": "완료",
     "closed": "2026-07-06"
    },
    {
     "id": "r10h7e",
     "no": "AU-26-008",
     "date": "2026-06-04",
     "customer": "R사",
     "content": "출하 검사 성적서 서명 누락",
     "level": "경결함",
     "owner": "최유진",
     "due": "2026-06-27",
     "status": "완료",
     "closed": "2026-07-05"
    },
    {
     "id": "r10h7c",
     "no": "AU-26-009",
     "date": "2026-06-09",
     "customer": "K사",
     "content": "초품 검사 기록 누락",
     "level": "경결함",
     "owner": "김민수",
     "due": "2026-07-03",
     "status": "완료",
     "closed": "2026-07-03"
    },
    {
     "id": "r10h7f",
     "no": "AU-26-010",
     "date": "2026-07-30",
     "customer": "G사",
     "content": "에러 프루프 점검 기록 누락",
     "level": "경결함",
     "owner": "김민수",
     "due": "2026-09-01",
     "status": "완료",
     "closed": "2026-08-21"
    },
    {
     "id": "r10h7d",
     "no": "AU-26-011",
     "date": "2026-08-04",
     "customer": "R사",
     "content": "측정기 교정 라벨 훼손",
     "level": "관찰",
     "owner": "최유진",
     "due": "2026-09-08",
     "status": "완료",
     "closed": "2026-09-03"
    },
    {
     "id": "r10h78",
     "no": "AU-26-012",
     "date": "2026-08-10",
     "customer": "G사",
     "content": "변경점 고객 통보 지연",
     "level": "중결함",
     "owner": "정하늘",
     "due": "2026-09-08",
     "status": "완료",
     "closed": "2026-08-31"
    },
    {
     "id": "r10h7j",
     "no": "AU-26-013",
     "date": "2026-08-18",
     "customer": "H사",
     "content": "관리계획서와 현장 검사 주기 불일치",
     "level": "경결함",
     "owner": "최유진",
     "due": "2026-09-25",
     "status": "완료",
     "closed": "2026-09-18"
    },
    {
     "id": "r10h72",
     "no": "AU-26-014",
     "date": "2026-08-31",
     "customer": "H사",
     "content": "변경점 고객 통보 지연",
     "level": "경결함",
     "owner": "최유진",
     "due": "2026-10-12",
     "status": "완료",
     "closed": "2026-09-15"
    },
    {
     "id": "r10h71",
     "no": "AU-26-015",
     "date": "2026-09-07",
     "customer": "K사",
     "content": "출하 검사 성적서 서명 누락",
     "level": "경결함",
     "owner": "정하늘",
     "due": "2026-09-23",
     "status": "조치중",
     "closed": ""
    },
    {
     "id": "r10h6y",
     "no": "AU-26-016",
     "date": "2026-09-10",
     "customer": "K사",
     "content": "초품 검사 기록 누락",
     "level": "관찰",
     "owner": "정하늘",
     "due": "2026-10-24",
     "status": "완료",
     "closed": "2026-10-02"
    },
    {
     "id": "r10h6w",
     "no": "AU-26-017",
     "date": "2026-09-18",
     "customer": "S모빌리티",
     "content": "측정기 교정 라벨 훼손",
     "level": "경결함",
     "owner": "김민수",
     "due": "2026-11-01",
     "status": "조치중",
     "closed": ""
    },
    {
     "id": "r10h6z",
     "no": "AU-26-018",
     "date": "2026-09-21",
     "customer": "K사",
     "content": "작업표준서 최신본 미게시",
     "level": "경결함",
     "owner": "정하늘",
     "due": "2026-10-25",
     "status": "조치중",
     "closed": ""
    },
    {
     "id": "r10h6x",
     "no": "AU-26-019",
     "date": "2026-09-29",
     "customer": "G사",
     "content": "작업표준서 최신본 미게시",
     "level": "경결함",
     "owner": "정하늘",
     "due": "2026-10-17",
     "status": "조치중",
     "closed": ""
    },
    {
     "id": "r10h74",
     "no": "AU-26-020",
     "date": "2026-09-29",
     "customer": "H사",
     "content": "작업자 자격 인증 기록 미비",
     "level": "경결함",
     "owner": "김민수",
     "due": "2026-10-31",
     "status": "조치중",
     "closed": ""
    },
    {
     "id": "r10h70",
     "no": "AU-26-021",
     "date": "2026-10-05",
     "customer": "G사",
     "content": "에러 프루프 점검 기록 누락",
     "level": "경결함",
     "owner": "정하늘",
     "due": "2026-11-12",
     "status": "조치중",
     "closed": ""
    }
   ]
  },
  {
   "id": "change4m",
   "name": "변경점 (4M) 관리",
   "desc": "사람·설비·재료·방법(4M) 변경을 부품별로 기록하고 고객 승인과 적용을 관리합니다.",
   "dateField": "date",
   "titleField": "content",
   "fields": [
    {
     "key": "no",
     "label": "변경번호",
     "type": "text",
     "auto": "CH-{YY}-"
    },
    {
     "key": "date",
     "label": "접수일",
     "type": "date",
     "req": true
    },
    {
     "key": "kind",
     "label": "구분 (4M)",
     "type": "select",
     "options": [
      "Man (사람)",
      "Machine (설비)",
      "Material (재료)",
      "Method (방법)"
     ],
     "colors": {
      "Man (사람)": "blue",
      "Machine (설비)": "purple",
      "Material (재료)": "orange",
      "Method (방법)": "green"
     }
    },
    {
     "key": "part",
     "label": "부품",
     "type": "ref",
     "ref": "parts"
    },
    {
     "key": "content",
     "label": "변경 내용",
     "type": "text",
     "req": true
    },
    {
     "key": "approval",
     "label": "고객 승인",
     "type": "select",
     "options": [
      "불필요",
      "신청",
      "승인",
      "반려"
     ]
    },
    {
     "key": "apply",
     "label": "적용일",
     "type": "date"
    },
    {
     "key": "status",
     "label": "상태",
     "type": "select",
     "options": [
      "검토",
      "진행중",
      "완료"
     ],
     "badge": true
    }
   ],
   "records": [
    {
     "id": "r10h81",
     "no": "CH-25-001",
     "date": "2025-11-23",
     "kind": "Material (재료)",
     "part": "배터리 트레이",
     "content": "배터리 트레이 수지 그레이드 변경",
     "approval": "승인",
     "apply": "2025-12-06",
     "status": "완료"
    },
    {
     "id": "r10h7w",
     "no": "CH-25-002",
     "date": "2025-12-28",
     "kind": "Material (재료)",
     "part": "범퍼 빔",
     "content": "범퍼 빔 원소재 공급사 변경",
     "approval": "승인",
     "apply": "2026-01-22",
     "status": "완료"
    },
    {
     "id": "r10h8a",
     "no": "CH-26-001",
     "date": "2026-01-21",
     "kind": "Man (사람)",
     "part": "글로브박스",
     "content": "글로브박스 교대조 변경",
     "approval": "불필요",
     "apply": "2026-02-27",
     "status": "완료"
    },
    {
     "id": "r10h8f",
     "no": "CH-26-002",
     "date": "2026-02-01",
     "kind": "Method (방법)",
     "part": "테일게이트 힌지",
     "content": "테일게이트 힌지 검사 방법 변경",
     "approval": "승인",
     "apply": "2026-02-09",
     "status": "완료"
    },
    {
     "id": "r10h88",
     "no": "CH-26-003",
     "date": "2026-02-04",
     "kind": "Man (사람)",
     "part": "도어 트림",
     "content": "도어 트림 교대조 변경",
     "approval": "불필요",
     "apply": "2026-02-16",
     "status": "완료"
    },
    {
     "id": "r10h8d",
     "no": "CH-26-004",
     "date": "2026-02-04",
     "kind": "Method (방법)",
     "part": "시트프레임",
     "content": "시트프레임 검사 방법 변경",
     "approval": "승인",
     "apply": "2026-02-23",
     "status": "완료"
    },
    {
     "id": "r10h7r",
     "no": "CH-26-005",
     "date": "2026-03-05",
     "kind": "Machine (설비)",
     "part": "리어 브라켓",
     "content": "리어 브라켓 용접 로봇 교체",
     "approval": "신청",
     "apply": "2026-04-05",
     "status": "완료"
    },
    {
     "id": "r10h7n",
     "no": "CH-26-006",
     "date": "2026-03-06",
     "kind": "Method (방법)",
     "part": "글로브박스",
     "content": "글로브박스 작업 순서 변경",
     "approval": "승인",
     "apply": "2026-04-07",
     "status": "완료"
    },
    {
     "id": "r10h7t",
     "no": "CH-26-007",
     "date": "2026-03-06",
     "kind": "Machine (설비)",
     "part": "리어 브라켓",
     "content": "리어 브라켓 용접 로봇 교체",
     "approval": "승인",
     "apply": "2026-03-28",
     "status": "완료"
    },
    {
     "id": "r10h7x",
     "no": "CH-26-008",
     "date": "2026-04-07",
     "kind": "Method (방법)",
     "part": "브라켓 BRK-1830",
     "content": "브라켓 BRK-1830 검사 방법 변경",
     "approval": "신청",
     "apply": "2026-04-16",
     "status": "완료"
    },
    {
     "id": "r10h86",
     "no": "CH-26-009",
     "date": "2026-04-21",
     "kind": "Machine (설비)",
     "part": "암레스트",
     "content": "암레스트 용접 로봇 교체",
     "approval": "승인",
     "apply": "2026-04-29",
     "status": "완료"
    },
    {
     "id": "r10h7q",
     "no": "CH-26-010",
     "date": "2026-04-23",
     "kind": "Method (방법)",
     "part": "글로브박스",
     "content": "글로브박스 검사 방법 변경",
     "approval": "승인",
     "apply": "2026-06-01",
     "status": "완료"
    },
    {
     "id": "r10h82",
     "no": "CH-26-011",
     "date": "2026-04-23",
     "kind": "Material (재료)",
     "part": "스티어링 브라켓",
     "content": "스티어링 브라켓 수지 그레이드 변경",
     "approval": "승인",
     "apply": "2026-05-19",
     "status": "완료"
    },
    {
     "id": "r10h87",
     "no": "CH-26-012",
     "date": "2026-05-27",
     "kind": "Material (재료)",
     "part": "콘솔 커버",
     "content": "콘솔 커버 원소재 공급사 변경",
     "approval": "신청",
     "apply": "2026-06-19",
     "status": "완료"
    },
    {
     "id": "r10h7z",
     "no": "CH-26-013",
     "date": "2026-06-12",
     "kind": "Method (방법)",
     "part": "콘솔 커버",
     "content": "콘솔 커버 포장 사양 변경",
     "approval": "승인",
     "apply": "2026-06-30",
     "status": "완료"
    },
    {
     "id": "r10h83",
     "no": "CH-26-014",
     "date": "2026-06-19",
     "kind": "Man (사람)",
     "part": "스티어링 브라켓",
     "content": "스티어링 브라켓 신규 작업자 투입",
     "approval": "불필요",
     "apply": "2026-07-09",
     "status": "완료"
    },
    {
     "id": "r10h89",
     "no": "CH-26-015",
     "date": "2026-06-30",
     "kind": "Man (사람)",
     "part": "글로브박스",
     "content": "글로브박스 검사원 교체",
     "approval": "불필요",
     "apply": "2026-07-13",
     "status": "완료"
    },
    {
     "id": "r10h7u",
     "no": "CH-26-016",
     "date": "2026-07-21",
     "kind": "Method (방법)",
     "part": "글로브박스",
     "content": "글로브박스 작업 순서 변경",
     "approval": "승인",
     "apply": "2026-08-11",
     "status": "완료"
    },
    {
     "id": "r10h80",
     "no": "CH-26-017",
     "date": "2026-07-23",
     "kind": "Method (방법)",
     "part": "시트프레임",
     "content": "시트프레임 포장 사양 변경",
     "approval": "신청",
     "apply": "2026-08-01",
     "status": "완료"
    },
    {
     "id": "r10h7s",
     "no": "CH-26-018",
     "date": "2026-07-26",
     "kind": "Machine (설비)",
     "part": "테일게이트 힌지",
     "content": "테일게이트 힌지 용접 로봇 교체",
     "approval": "승인",
     "apply": "2026-08-29",
     "status": "완료"
    },
    {
     "id": "r10h7y",
     "no": "CH-26-019",
     "date": "2026-07-30",
     "kind": "Machine (설비)",
     "part": "도어 트림",
     "content": "도어 트림 금형 수리 후 재가동",
     "approval": "승인",
     "apply": "2026-09-06",
     "status": "완료"
    },
    {
     "id": "r10h8e",
     "no": "CH-26-020",
     "date": "2026-08-11",
     "kind": "Machine (설비)",
     "part": "도어래치 ASSY",
     "content": "도어래치 ASSY 용접 로봇 교체",
     "approval": "승인",
     "apply": "2026-09-01",
     "status": "완료"
    },
    {
     "id": "r10h84",
     "no": "CH-26-021",
     "date": "2026-08-15",
     "kind": "Material (재료)",
     "part": "브라켓 BRK-1830",
     "content": "브라켓 BRK-1830 원소재 공급사 변경",
     "approval": "승인",
     "apply": "2026-09-07",
     "status": "완료"
    },
    {
     "id": "r10h85",
     "no": "CH-26-022",
     "date": "2026-09-20",
     "kind": "Man (사람)",
     "part": "범퍼 빔",
     "content": "범퍼 빔 검사원 교체",
     "approval": "불필요",
     "apply": "2026-10-09",
     "status": "진행중"
    },
    {
     "id": "r10h8b",
     "no": "CH-26-023",
     "date": "2026-09-20",
     "kind": "Method (방법)",
     "part": "글로브박스",
     "content": "글로브박스 검사 방법 변경",
     "approval": "승인",
     "apply": "2026-10-01",
     "status": "검토"
    },
    {
     "id": "r10h7p",
     "no": "CH-26-024",
     "date": "2026-09-24",
     "kind": "Material (재료)",
     "part": "글로브박스",
     "content": "글로브박스 도료 사양 변경",
     "approval": "승인",
     "apply": "2026-10-07",
     "status": "진행중"
    },
    {
     "id": "r10h7o",
     "no": "CH-26-025",
     "date": "2026-09-25",
     "kind": "Method (방법)",
     "part": "스티어링 브라켓",
     "content": "스티어링 브라켓 포장 사양 변경",
     "approval": "신청",
     "apply": "2026-10-24",
     "status": "진행중"
    },
    {
     "id": "r10h7m",
     "no": "CH-26-026",
     "date": "2026-10-06",
     "kind": "Man (사람)",
     "part": "글로브박스",
     "content": "글로브박스 교대조 변경",
     "approval": "불필요",
     "apply": "2026-10-29",
     "status": "검토"
    },
    {
     "id": "r10h8c",
     "no": "CH-26-027",
     "date": "2026-10-06",
     "kind": "Method (방법)",
     "part": "암레스트",
     "content": "암레스트 검사 방법 변경",
     "approval": "승인",
     "apply": "2026-10-16",
     "status": "진행중"
    },
    {
     "id": "r10h7v",
     "no": "CH-26-028",
     "date": "2026-10-07",
     "kind": "Machine (설비)",
     "part": "리어 브라켓",
     "content": "리어 브라켓 사출기 이설",
     "approval": "승인",
     "apply": "2026-10-27",
     "status": "진행중"
    }
   ]
  },
  {
   "id": "training",
   "name": "교육 · 자격 이력",
   "desc": "담당자별 교육·자격 이력과 만료일입니다.",
   "dateField": "date",
   "titleField": "course",
   "fields": [
    {
     "key": "date",
     "label": "교육일",
     "type": "date",
     "req": true
    },
    {
     "key": "person",
     "label": "이름",
     "type": "ref",
     "ref": "people"
    },
    {
     "key": "course",
     "label": "교육·자격명",
     "type": "text",
     "req": true
    },
    {
     "key": "kind",
     "label": "구분",
     "type": "select",
     "options": [
      "사내 교육",
      "사외 교육",
      "자격"
     ]
    },
    {
     "key": "hours",
     "label": "시간",
     "type": "number"
    },
    {
     "key": "expire",
     "label": "만료일",
     "type": "date"
    },
    {
     "key": "note",
     "label": "비고",
     "type": "text"
    }
   ],
   "records": [
    {
     "id": "r10h8g",
     "date": "2026-05-28",
     "person": "김민수",
     "course": "CQE (품질기술사 준비)",
     "kind": "사외 교육",
     "hours": 20,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8h",
     "date": "2025-12-17",
     "person": "김민수",
     "course": "CQE (품질기술사 준비)",
     "kind": "사외 교육",
     "hours": 20,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8i",
     "date": "2025-07-18",
     "person": "김민수",
     "course": "품질 비용 관리",
     "kind": "사외 교육",
     "hours": 7,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8j",
     "date": "2025-05-12",
     "person": "김민수",
     "course": "VDA 6.3 공정심사원",
     "kind": "자격",
     "hours": 24,
     "expire": "2026-06-11",
     "note": ""
    },
    {
     "id": "r10h8k",
     "date": "2025-10-05",
     "person": "김민수",
     "course": "용접 검사원",
     "kind": "자격",
     "hours": 12,
     "expire": "2027-10-05",
     "note": ""
    },
    {
     "id": "r10h8l",
     "date": "2026-06-22",
     "person": "김민수",
     "course": "SPC 기초",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8m",
     "date": "2026-05-13",
     "person": "김민수",
     "course": "MSA 실무",
     "kind": "사내 교육",
     "hours": 6,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8n",
     "date": "2025-06-05",
     "person": "김민수",
     "course": "FMEA (AIAG-VDA)",
     "kind": "사외 교육",
     "hours": 14,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8o",
     "date": "2025-10-20",
     "person": "김민수",
     "course": "품질 비용 관리",
     "kind": "사외 교육",
     "hours": 7,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8p",
     "date": "2025-09-11",
     "person": "이서연",
     "course": "FMEA (AIAG-VDA)",
     "kind": "사외 교육",
     "hours": 14,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8q",
     "date": "2026-01-19",
     "person": "이서연",
     "course": "MSA 실무",
     "kind": "사내 교육",
     "hours": 6,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8r",
     "date": "2026-10-05",
     "person": "이서연",
     "course": "IATF 16949 내부심사원",
     "kind": "자격",
     "hours": 16,
     "expire": "2027-11-04",
     "note": ""
    },
    {
     "id": "r10h8s",
     "date": "2026-05-26",
     "person": "이서연",
     "course": "IATF 16949 내부심사원",
     "kind": "자격",
     "hours": 16,
     "expire": "2029-05-25",
     "note": ""
    },
    {
     "id": "r10h8t",
     "date": "2026-03-22",
     "person": "이서연",
     "course": "8D 문제해결",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8u",
     "date": "2025-08-06",
     "person": "박지훈",
     "course": "SPC 기초",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8v",
     "date": "2025-10-31",
     "person": "박지훈",
     "course": "IATF 16949 내부심사원",
     "kind": "자격",
     "hours": 16,
     "expire": "2028-10-30",
     "note": ""
    },
    {
     "id": "r10h8w",
     "date": "2025-05-18",
     "person": "박지훈",
     "course": "8D 문제해결",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8x",
     "date": "2025-07-06",
     "person": "박지훈",
     "course": "CQE (품질기술사 준비)",
     "kind": "사외 교육",
     "hours": 20,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8y",
     "date": "2026-01-29",
     "person": "박지훈",
     "course": "8D 문제해결",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h8z",
     "date": "2026-04-16",
     "person": "박지훈",
     "course": "품질 비용 관리",
     "kind": "사외 교육",
     "hours": 7,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h90",
     "date": "2026-08-04",
     "person": "박지훈",
     "course": "용접 검사원",
     "kind": "자격",
     "hours": 12,
     "expire": "2028-08-03",
     "note": ""
    },
    {
     "id": "r10h91",
     "date": "2026-02-25",
     "person": "박지훈",
     "course": "품질 비용 관리",
     "kind": "사외 교육",
     "hours": 7,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h92",
     "date": "2026-08-22",
     "person": "박지훈",
     "course": "8D 문제해결",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h93",
     "date": "2026-02-10",
     "person": "최유진",
     "course": "용접 검사원",
     "kind": "자격",
     "hours": 12,
     "expire": "2028-02-10",
     "note": ""
    },
    {
     "id": "r10h94",
     "date": "2026-01-31",
     "person": "최유진",
     "course": "품질 비용 관리",
     "kind": "사외 교육",
     "hours": 7,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h95",
     "date": "2026-07-12",
     "person": "최유진",
     "course": "MSA 실무",
     "kind": "사내 교육",
     "hours": 6,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h96",
     "date": "2026-08-19",
     "person": "최유진",
     "course": "FMEA (AIAG-VDA)",
     "kind": "사외 교육",
     "hours": 14,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h97",
     "date": "2025-02-10",
     "person": "최유진",
     "course": "용접 검사원",
     "kind": "자격",
     "hours": 12,
     "expire": "2027-02-10",
     "note": ""
    },
    {
     "id": "r10h98",
     "date": "2025-06-30",
     "person": "최유진",
     "course": "품질 비용 관리",
     "kind": "사외 교육",
     "hours": 7,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h99",
     "date": "2025-03-10",
     "person": "최유진",
     "course": "품질 비용 관리",
     "kind": "사외 교육",
     "hours": 7,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9a",
     "date": "2026-04-30",
     "person": "정하늘",
     "course": "MSA 실무",
     "kind": "사내 교육",
     "hours": 6,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9b",
     "date": "2025-12-18",
     "person": "정하늘",
     "course": "측정기 교정 담당자",
     "kind": "자격",
     "hours": 8,
     "expire": "2026-01-17",
     "note": ""
    },
    {
     "id": "r10h9c",
     "date": "2026-09-24",
     "person": "정하늘",
     "course": "CQE (품질기술사 준비)",
     "kind": "사외 교육",
     "hours": 20,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9d",
     "date": "2026-03-06",
     "person": "정하늘",
     "course": "용접 검사원",
     "kind": "자격",
     "hours": 12,
     "expire": "2028-03-05",
     "note": ""
    },
    {
     "id": "r10h9e",
     "date": "2026-07-19",
     "person": "정하늘",
     "course": "측정기 교정 담당자",
     "kind": "자격",
     "hours": 8,
     "expire": "2028-07-18",
     "note": ""
    },
    {
     "id": "r10h9f",
     "date": "2025-02-09",
     "person": "한도윤",
     "course": "품질 비용 관리",
     "kind": "사외 교육",
     "hours": 7,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9g",
     "date": "2025-04-10",
     "person": "한도윤",
     "course": "용접 검사원",
     "kind": "자격",
     "hours": 12,
     "expire": "2027-04-10",
     "note": ""
    },
    {
     "id": "r10h9h",
     "date": "2025-01-06",
     "person": "한도윤",
     "course": "SPC 기초",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9i",
     "date": "2025-06-15",
     "person": "한도윤",
     "course": "CQE (품질기술사 준비)",
     "kind": "사외 교육",
     "hours": 20,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9j",
     "date": "2025-12-02",
     "person": "한도윤",
     "course": "8D 문제해결",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9k",
     "date": "2025-09-04",
     "person": "한도윤",
     "course": "VDA 6.3 공정심사원",
     "kind": "자격",
     "hours": 24,
     "expire": "2028-09-03",
     "note": ""
    },
    {
     "id": "r10h9l",
     "date": "2026-09-17",
     "person": "한도윤",
     "course": "SPC 기초",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9m",
     "date": "2026-06-24",
     "person": "오세린",
     "course": "FMEA (AIAG-VDA)",
     "kind": "사외 교육",
     "hours": 14,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9n",
     "date": "2025-11-04",
     "person": "오세린",
     "course": "용접 검사원",
     "kind": "자격",
     "hours": 12,
     "expire": "2027-11-04",
     "note": ""
    },
    {
     "id": "r10h9o",
     "date": "2025-01-16",
     "person": "오세린",
     "course": "CQE (품질기술사 준비)",
     "kind": "사외 교육",
     "hours": 20,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9p",
     "date": "2026-10-07",
     "person": "오세린",
     "course": "측정기 교정 담당자",
     "kind": "자격",
     "hours": 8,
     "expire": "2028-10-06",
     "note": ""
    },
    {
     "id": "r10h9q",
     "date": "2025-06-25",
     "person": "오세린",
     "course": "FMEA (AIAG-VDA)",
     "kind": "사외 교육",
     "hours": 14,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9r",
     "date": "2026-01-31",
     "person": "오세린",
     "course": "SPC 기초",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9s",
     "date": "2026-06-02",
     "person": "오세린",
     "course": "용접 검사원",
     "kind": "자격",
     "hours": 12,
     "expire": "2028-06-01",
     "note": ""
    },
    {
     "id": "r10h9t",
     "date": "2026-08-13",
     "person": "윤재호",
     "course": "CQE (품질기술사 준비)",
     "kind": "사외 교육",
     "hours": 20,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9u",
     "date": "2026-10-05",
     "person": "윤재호",
     "course": "8D 문제해결",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9v",
     "date": "2025-10-26",
     "person": "윤재호",
     "course": "IATF 16949 내부심사원",
     "kind": "자격",
     "hours": 16,
     "expire": "2026-11-25",
     "note": ""
    },
    {
     "id": "r10h9w",
     "date": "2026-10-07",
     "person": "윤재호",
     "course": "SPC 기초",
     "kind": "사내 교육",
     "hours": 4,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9x",
     "date": "2025-09-26",
     "person": "윤재호",
     "course": "측정기 교정 담당자",
     "kind": "자격",
     "hours": 8,
     "expire": "2027-09-26",
     "note": ""
    },
    {
     "id": "r10h9y",
     "date": "2026-09-05",
     "person": "윤재호",
     "course": "MSA 실무",
     "kind": "사내 교육",
     "hours": 6,
     "expire": "",
     "note": ""
    },
    {
     "id": "r10h9z",
     "date": "2026-03-24",
     "person": "윤재호",
     "course": "IATF 16949 내부심사원",
     "kind": "자격",
     "hours": 16,
     "expire": "2027-04-23",
     "note": ""
    },
    {
     "id": "r10ha0",
     "date": "2026-01-01",
     "person": "윤재호",
     "course": "IATF 16949 내부심사원",
     "kind": "자격",
     "hours": 16,
     "expire": "2028-12-31",
     "note": ""
    },
    {
     "id": "r10ha1",
     "date": "2025-10-30",
     "person": "윤재호",
     "course": "VDA 6.3 공정심사원",
     "kind": "자격",
     "hours": 24,
     "expire": "2026-11-29",
     "note": ""
    }
   ]
  },
  {
   "id": "copq",
   "name": "품질 비용 (COPQ)",
   "desc": "외부·내부 실패, 평가, 예방 품질 비용을 월별로 기록합니다. 단위: 만원",
   "dateField": "date",
   "titleField": "kind",
   "fields": [
    {
     "key": "date",
     "label": "발생일",
     "type": "date",
     "req": true
    },
    {
     "key": "kind",
     "label": "비용 구분",
     "type": "select",
     "options": [
      "외부 실패 (클레임·반품)",
      "내부 실패 (폐기·재작업)",
      "평가 (검사·시험)",
      "예방 (교육·개선)"
     ],
     "colors": {
      "외부 실패 (클레임·반품)": "red",
      "내부 실패 (폐기·재작업)": "orange",
      "평가 (검사·시험)": "blue",
      "예방 (교육·개선)": "green"
     },
     "req": true
    },
    {
     "key": "part",
     "label": "부품",
     "type": "ref",
     "ref": "parts"
    },
    {
     "key": "amount",
     "label": "금액(만원)",
     "type": "number",
     "req": true
    },
    {
     "key": "note",
     "label": "내용",
     "type": "text"
    }
   ],
   "records": [
    {
     "id": "r10ha2",
     "date": "2025-01-26",
     "kind": "외부 실패 (클레임·반품)",
     "part": "암레스트",
     "amount": 1029,
     "note": ""
    },
    {
     "id": "r10ha3",
     "date": "2025-01-17",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "힌지 ASSY",
     "amount": 439,
     "note": ""
    },
    {
     "id": "r10ha4",
     "date": "2025-01-06",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "테일게이트 힌지",
     "amount": 542,
     "note": ""
    },
    {
     "id": "r10ha5",
     "date": "2025-01-10",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 416,
     "note": ""
    },
    {
     "id": "r10ha6",
     "date": "2025-01-04",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 153,
     "note": ""
    },
    {
     "id": "r10ha7",
     "date": "2025-02-19",
     "kind": "외부 실패 (클레임·반품)",
     "part": "힌지 ASSY",
     "amount": 466,
     "note": ""
    },
    {
     "id": "r10ha8",
     "date": "2025-02-03",
     "kind": "외부 실패 (클레임·반품)",
     "part": "테일게이트 힌지",
     "amount": 376,
     "note": ""
    },
    {
     "id": "r10ha9",
     "date": "2025-02-06",
     "kind": "외부 실패 (클레임·반품)",
     "part": "암레스트",
     "amount": 610,
     "note": ""
    },
    {
     "id": "r10haa",
     "date": "2025-02-16",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "리어 브라켓",
     "amount": 945,
     "note": ""
    },
    {
     "id": "r10hab",
     "date": "2025-02-13",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 456,
     "note": ""
    },
    {
     "id": "r10hac",
     "date": "2025-02-22",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 180,
     "note": ""
    },
    {
     "id": "r10had",
     "date": "2025-02-01",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 94,
     "note": ""
    },
    {
     "id": "r10hae",
     "date": "2025-03-01",
     "kind": "외부 실패 (클레임·반품)",
     "part": "리어 브라켓",
     "amount": 1574,
     "note": ""
    },
    {
     "id": "r10haf",
     "date": "2025-03-28",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "힌지 ASSY",
     "amount": 880,
     "note": ""
    },
    {
     "id": "r10hag",
     "date": "2025-03-27",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 182,
     "note": ""
    },
    {
     "id": "r10hah",
     "date": "2025-03-10",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 156,
     "note": ""
    },
    {
     "id": "r10hai",
     "date": "2025-03-22",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 176,
     "note": ""
    },
    {
     "id": "r10haj",
     "date": "2025-03-03",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 77,
     "note": ""
    },
    {
     "id": "r10hak",
     "date": "2025-03-02",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 180,
     "note": ""
    },
    {
     "id": "r10hal",
     "date": "2025-04-30",
     "kind": "외부 실패 (클레임·반품)",
     "part": "도어 트림",
     "amount": 568,
     "note": ""
    },
    {
     "id": "r10ham",
     "date": "2025-04-06",
     "kind": "외부 실패 (클레임·반품)",
     "part": "커넥터 하우징",
     "amount": 1012,
     "note": ""
    },
    {
     "id": "r10han",
     "date": "2025-04-28",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "힌지 ASSY",
     "amount": 710,
     "note": ""
    },
    {
     "id": "r10hao",
     "date": "2025-04-10",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "힌지 ASSY",
     "amount": 704,
     "note": ""
    },
    {
     "id": "r10hap",
     "date": "2025-04-18",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 609,
     "note": ""
    },
    {
     "id": "r10haq",
     "date": "2025-04-14",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 83,
     "note": ""
    },
    {
     "id": "r10har",
     "date": "2025-04-23",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 86,
     "note": ""
    },
    {
     "id": "r10has",
     "date": "2025-04-05",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 69,
     "note": ""
    },
    {
     "id": "r10hat",
     "date": "2025-05-17",
     "kind": "외부 실패 (클레임·반품)",
     "part": "테일게이트 힌지",
     "amount": 1005,
     "note": ""
    },
    {
     "id": "r10hau",
     "date": "2025-05-24",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "시트프레임",
     "amount": 579,
     "note": ""
    },
    {
     "id": "r10hav",
     "date": "2025-05-25",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "리어 브라켓",
     "amount": 667,
     "note": ""
    },
    {
     "id": "r10haw",
     "date": "2025-05-23",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 457,
     "note": ""
    },
    {
     "id": "r10hax",
     "date": "2025-05-18",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 115,
     "note": ""
    },
    {
     "id": "r10hay",
     "date": "2025-05-18",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 137,
     "note": ""
    },
    {
     "id": "r10haz",
     "date": "2025-05-22",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 65,
     "note": ""
    },
    {
     "id": "r10hb0",
     "date": "2025-06-02",
     "kind": "외부 실패 (클레임·반품)",
     "part": "테일게이트 힌지",
     "amount": 1393,
     "note": ""
    },
    {
     "id": "r10hb1",
     "date": "2025-06-09",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "리어 브라켓",
     "amount": 890,
     "note": ""
    },
    {
     "id": "r10hb2",
     "date": "2025-06-03",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 167,
     "note": ""
    },
    {
     "id": "r10hb3",
     "date": "2025-06-03",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 138,
     "note": ""
    },
    {
     "id": "r10hb4",
     "date": "2025-06-15",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 165,
     "note": ""
    },
    {
     "id": "r10hb5",
     "date": "2025-06-19",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 84,
     "note": ""
    },
    {
     "id": "r10hb6",
     "date": "2025-06-25",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 135,
     "note": ""
    },
    {
     "id": "r10hb7",
     "date": "2025-06-13",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 59,
     "note": ""
    },
    {
     "id": "r10hb8",
     "date": "2025-07-31",
     "kind": "외부 실패 (클레임·반품)",
     "part": "시트프레임",
     "amount": 556,
     "note": ""
    },
    {
     "id": "r10hb9",
     "date": "2025-07-30",
     "kind": "외부 실패 (클레임·반품)",
     "part": "콘솔 커버",
     "amount": 689,
     "note": ""
    },
    {
     "id": "r10hba",
     "date": "2025-07-15",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "콘솔 커버",
     "amount": 675,
     "note": ""
    },
    {
     "id": "r10hbb",
     "date": "2025-07-11",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "리어 브라켓",
     "amount": 384,
     "note": ""
    },
    {
     "id": "r10hbc",
     "date": "2025-07-21",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 234,
     "note": ""
    },
    {
     "id": "r10hbd",
     "date": "2025-07-19",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 320,
     "note": ""
    },
    {
     "id": "r10hbe",
     "date": "2025-07-28",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 358,
     "note": ""
    },
    {
     "id": "r10hbf",
     "date": "2025-08-27",
     "kind": "외부 실패 (클레임·반품)",
     "part": "범퍼 빔",
     "amount": 1548,
     "note": ""
    },
    {
     "id": "r10hbg",
     "date": "2025-08-08",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "커넥터 하우징",
     "amount": 409,
     "note": ""
    },
    {
     "id": "r10hbh",
     "date": "2025-08-04",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "글로브박스",
     "amount": 336,
     "note": ""
    },
    {
     "id": "r10hbi",
     "date": "2025-08-14",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "스티어링 브라켓",
     "amount": 428,
     "note": ""
    },
    {
     "id": "r10hbj",
     "date": "2025-08-11",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 149,
     "note": ""
    },
    {
     "id": "r10hbk",
     "date": "2025-08-01",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 151,
     "note": ""
    },
    {
     "id": "r10hbl",
     "date": "2025-08-04",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 127,
     "note": ""
    },
    {
     "id": "r10hbm",
     "date": "2025-08-19",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 93,
     "note": ""
    },
    {
     "id": "r10hbn",
     "date": "2025-08-28",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 66,
     "note": ""
    },
    {
     "id": "r10hbo",
     "date": "2025-08-19",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 87,
     "note": ""
    },
    {
     "id": "r10hbp",
     "date": "2025-09-25",
     "kind": "외부 실패 (클레임·반품)",
     "part": "시트프레임",
     "amount": 649,
     "note": ""
    },
    {
     "id": "r10hbq",
     "date": "2025-09-23",
     "kind": "외부 실패 (클레임·반품)",
     "part": "커넥터 하우징",
     "amount": 405,
     "note": ""
    },
    {
     "id": "r10hbr",
     "date": "2025-09-24",
     "kind": "외부 실패 (클레임·반품)",
     "part": "범퍼 빔",
     "amount": 558,
     "note": ""
    },
    {
     "id": "r10hbs",
     "date": "2025-09-17",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "커넥터 하우징",
     "amount": 377,
     "note": ""
    },
    {
     "id": "r10hbt",
     "date": "2025-09-26",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "암레스트",
     "amount": 675,
     "note": ""
    },
    {
     "id": "r10hbu",
     "date": "2025-09-03",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 187,
     "note": ""
    },
    {
     "id": "r10hbv",
     "date": "2025-09-18",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 210,
     "note": ""
    },
    {
     "id": "r10hbw",
     "date": "2025-09-26",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 149,
     "note": ""
    },
    {
     "id": "r10hbx",
     "date": "2025-09-04",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 110,
     "note": ""
    },
    {
     "id": "r10hby",
     "date": "2025-09-12",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 111,
     "note": ""
    },
    {
     "id": "r10hbz",
     "date": "2025-09-14",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 81,
     "note": ""
    },
    {
     "id": "r10hc0",
     "date": "2025-10-25",
     "kind": "외부 실패 (클레임·반품)",
     "part": "범퍼 빔",
     "amount": 273,
     "note": ""
    },
    {
     "id": "r10hc1",
     "date": "2025-10-25",
     "kind": "외부 실패 (클레임·반품)",
     "part": "도어래치 ASSY",
     "amount": 424,
     "note": ""
    },
    {
     "id": "r10hc2",
     "date": "2025-10-31",
     "kind": "외부 실패 (클레임·반품)",
     "part": "암레스트",
     "amount": 642,
     "note": ""
    },
    {
     "id": "r10hc3",
     "date": "2025-10-14",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "커넥터 하우징",
     "amount": 826,
     "note": ""
    },
    {
     "id": "r10hc4",
     "date": "2025-10-16",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 189,
     "note": ""
    },
    {
     "id": "r10hc5",
     "date": "2025-10-26",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 124,
     "note": ""
    },
    {
     "id": "r10hc6",
     "date": "2025-10-30",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 144,
     "note": ""
    },
    {
     "id": "r10hc7",
     "date": "2025-10-04",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 235,
     "note": ""
    },
    {
     "id": "r10hc8",
     "date": "2025-11-18",
     "kind": "외부 실패 (클레임·반품)",
     "part": "스티어링 브라켓",
     "amount": 887,
     "note": ""
    },
    {
     "id": "r10hc9",
     "date": "2025-11-11",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "배터리 트레이",
     "amount": 712,
     "note": ""
    },
    {
     "id": "r10hca",
     "date": "2025-11-03",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "도어 트림",
     "amount": 585,
     "note": ""
    },
    {
     "id": "r10hcb",
     "date": "2025-11-05",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 173,
     "note": ""
    },
    {
     "id": "r10hcc",
     "date": "2025-11-29",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 158,
     "note": ""
    },
    {
     "id": "r10hcd",
     "date": "2025-11-03",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 207,
     "note": ""
    },
    {
     "id": "r10hce",
     "date": "2025-11-25",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 123,
     "note": ""
    },
    {
     "id": "r10hcf",
     "date": "2025-11-10",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 122,
     "note": ""
    },
    {
     "id": "r10hcg",
     "date": "2025-12-30",
     "kind": "외부 실패 (클레임·반품)",
     "part": "테일게이트 힌지",
     "amount": 842,
     "note": ""
    },
    {
     "id": "r10hch",
     "date": "2025-12-20",
     "kind": "외부 실패 (클레임·반품)",
     "part": "콘솔 커버",
     "amount": 758,
     "note": ""
    },
    {
     "id": "r10hci",
     "date": "2025-12-26",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "커넥터 하우징",
     "amount": 1250,
     "note": ""
    },
    {
     "id": "r10hcj",
     "date": "2025-12-16",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 195,
     "note": ""
    },
    {
     "id": "r10hck",
     "date": "2025-12-04",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 139,
     "note": ""
    },
    {
     "id": "r10hcl",
     "date": "2025-12-31",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 175,
     "note": ""
    },
    {
     "id": "r10hcm",
     "date": "2025-12-08",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 91,
     "note": ""
    },
    {
     "id": "r10hcn",
     "date": "2025-12-09",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 72,
     "note": ""
    },
    {
     "id": "r10hco",
     "date": "2025-12-02",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 62,
     "note": ""
    },
    {
     "id": "r10hcp",
     "date": "2026-01-28",
     "kind": "외부 실패 (클레임·반품)",
     "part": "암레스트",
     "amount": 485,
     "note": ""
    },
    {
     "id": "r10hcq",
     "date": "2026-01-12",
     "kind": "외부 실패 (클레임·반품)",
     "part": "콘솔 커버",
     "amount": 500,
     "note": ""
    },
    {
     "id": "r10hcr",
     "date": "2026-01-17",
     "kind": "외부 실패 (클레임·반품)",
     "part": "글로브박스",
     "amount": 389,
     "note": ""
    },
    {
     "id": "r10hcs",
     "date": "2026-01-09",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "리어 브라켓",
     "amount": 794,
     "note": ""
    },
    {
     "id": "r10hct",
     "date": "2026-01-13",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 444,
     "note": ""
    },
    {
     "id": "r10hcu",
     "date": "2026-01-26",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 173,
     "note": ""
    },
    {
     "id": "r10hcv",
     "date": "2026-02-07",
     "kind": "외부 실패 (클레임·반품)",
     "part": "범퍼 빔",
     "amount": 448,
     "note": ""
    },
    {
     "id": "r10hcw",
     "date": "2026-02-08",
     "kind": "외부 실패 (클레임·반품)",
     "part": "테일게이트 힌지",
     "amount": 421,
     "note": ""
    },
    {
     "id": "r10hcx",
     "date": "2026-02-15",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "커넥터 하우징",
     "amount": 310,
     "note": ""
    },
    {
     "id": "r10hcy",
     "date": "2026-02-13",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "도어 트림",
     "amount": 457,
     "note": ""
    },
    {
     "id": "r10hcz",
     "date": "2026-02-20",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 259,
     "note": ""
    },
    {
     "id": "r10hd0",
     "date": "2026-02-27",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 300,
     "note": ""
    },
    {
     "id": "r10hd1",
     "date": "2026-02-13",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 206,
     "note": ""
    },
    {
     "id": "r10hd2",
     "date": "2026-03-19",
     "kind": "외부 실패 (클레임·반품)",
     "part": "시트프레임",
     "amount": 628,
     "note": ""
    },
    {
     "id": "r10hd3",
     "date": "2026-03-03",
     "kind": "외부 실패 (클레임·반품)",
     "part": "범퍼 빔",
     "amount": 617,
     "note": ""
    },
    {
     "id": "r10hd4",
     "date": "2026-03-10",
     "kind": "외부 실패 (클레임·반품)",
     "part": "범퍼 빔",
     "amount": 453,
     "note": ""
    },
    {
     "id": "r10hd5",
     "date": "2026-03-13",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "암레스트",
     "amount": 422,
     "note": ""
    },
    {
     "id": "r10hd6",
     "date": "2026-03-31",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "커넥터 하우징",
     "amount": 433,
     "note": ""
    },
    {
     "id": "r10hd7",
     "date": "2026-03-07",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "테일게이트 힌지",
     "amount": 311,
     "note": ""
    },
    {
     "id": "r10hd8",
     "date": "2026-03-30",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 256,
     "note": ""
    },
    {
     "id": "r10hd9",
     "date": "2026-03-22",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 289,
     "note": ""
    },
    {
     "id": "r10hda",
     "date": "2026-03-24",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 50,
     "note": ""
    },
    {
     "id": "r10hdb",
     "date": "2026-03-29",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 110,
     "note": ""
    },
    {
     "id": "r10hdc",
     "date": "2026-03-08",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 113,
     "note": ""
    },
    {
     "id": "r10hdd",
     "date": "2026-04-11",
     "kind": "외부 실패 (클레임·반품)",
     "part": "배터리 트레이",
     "amount": 435,
     "note": ""
    },
    {
     "id": "r10hde",
     "date": "2026-04-25",
     "kind": "외부 실패 (클레임·반품)",
     "part": "힌지 ASSY",
     "amount": 876,
     "note": ""
    },
    {
     "id": "r10hdf",
     "date": "2026-04-02",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "리어 브라켓",
     "amount": 446,
     "note": ""
    },
    {
     "id": "r10hdg",
     "date": "2026-04-04",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "암레스트",
     "amount": 284,
     "note": ""
    },
    {
     "id": "r10hdh",
     "date": "2026-04-01",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "콘솔 커버",
     "amount": 387,
     "note": ""
    },
    {
     "id": "r10hdi",
     "date": "2026-04-20",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 263,
     "note": ""
    },
    {
     "id": "r10hdj",
     "date": "2026-04-13",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 199,
     "note": ""
    },
    {
     "id": "r10hdk",
     "date": "2026-04-11",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 155,
     "note": ""
    },
    {
     "id": "r10hdl",
     "date": "2026-04-23",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 131,
     "note": ""
    },
    {
     "id": "r10hdm",
     "date": "2026-05-30",
     "kind": "외부 실패 (클레임·반품)",
     "part": "리어 브라켓",
     "amount": 1649,
     "note": ""
    },
    {
     "id": "r10hdn",
     "date": "2026-05-02",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "범퍼 빔",
     "amount": 533,
     "note": ""
    },
    {
     "id": "r10hdo",
     "date": "2026-05-10",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "암레스트",
     "amount": 369,
     "note": ""
    },
    {
     "id": "r10hdp",
     "date": "2026-05-09",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 587,
     "note": ""
    },
    {
     "id": "r10hdq",
     "date": "2026-05-06",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 60,
     "note": ""
    },
    {
     "id": "r10hdr",
     "date": "2026-05-13",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 45,
     "note": ""
    },
    {
     "id": "r10hds",
     "date": "2026-05-23",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 92,
     "note": ""
    },
    {
     "id": "r10hdt",
     "date": "2026-06-04",
     "kind": "외부 실패 (클레임·반품)",
     "part": "리어 브라켓",
     "amount": 1539,
     "note": ""
    },
    {
     "id": "r10hdu",
     "date": "2026-06-22",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "커넥터 하우징",
     "amount": 336,
     "note": ""
    },
    {
     "id": "r10hdv",
     "date": "2026-06-25",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "커넥터 하우징",
     "amount": 306,
     "note": ""
    },
    {
     "id": "r10hdw",
     "date": "2026-06-26",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "힌지 ASSY",
     "amount": 344,
     "note": ""
    },
    {
     "id": "r10hdx",
     "date": "2026-06-21",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 152,
     "note": ""
    },
    {
     "id": "r10hdy",
     "date": "2026-06-10",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 150,
     "note": ""
    },
    {
     "id": "r10hdz",
     "date": "2026-06-02",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 143,
     "note": ""
    },
    {
     "id": "r10he0",
     "date": "2026-06-29",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 157,
     "note": ""
    },
    {
     "id": "r10he1",
     "date": "2026-06-13",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 147,
     "note": ""
    },
    {
     "id": "r10he2",
     "date": "2026-07-19",
     "kind": "외부 실패 (클레임·반품)",
     "part": "스티어링 브라켓",
     "amount": 497,
     "note": ""
    },
    {
     "id": "r10he3",
     "date": "2026-07-09",
     "kind": "외부 실패 (클레임·반품)",
     "part": "암레스트",
     "amount": 359,
     "note": ""
    },
    {
     "id": "r10he4",
     "date": "2026-07-04",
     "kind": "외부 실패 (클레임·반품)",
     "part": "범퍼 빔",
     "amount": 262,
     "note": ""
    },
    {
     "id": "r10he5",
     "date": "2026-07-12",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "글로브박스",
     "amount": 263,
     "note": ""
    },
    {
     "id": "r10he6",
     "date": "2026-07-10",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "리어 브라켓",
     "amount": 419,
     "note": ""
    },
    {
     "id": "r10he7",
     "date": "2026-07-01",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "글로브박스",
     "amount": 287,
     "note": ""
    },
    {
     "id": "r10he8",
     "date": "2026-07-19",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 224,
     "note": ""
    },
    {
     "id": "r10he9",
     "date": "2026-07-20",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 239,
     "note": ""
    },
    {
     "id": "r10hea",
     "date": "2026-07-12",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 141,
     "note": ""
    },
    {
     "id": "r10heb",
     "date": "2026-08-22",
     "kind": "외부 실패 (클레임·반품)",
     "part": "브라켓 BRK-1830",
     "amount": 509,
     "note": ""
    },
    {
     "id": "r10hec",
     "date": "2026-08-17",
     "kind": "외부 실패 (클레임·반품)",
     "part": "콘솔 커버",
     "amount": 488,
     "note": ""
    },
    {
     "id": "r10hed",
     "date": "2026-08-08",
     "kind": "외부 실패 (클레임·반품)",
     "part": "범퍼 빔",
     "amount": 386,
     "note": ""
    },
    {
     "id": "r10hee",
     "date": "2026-08-23",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "리어 브라켓",
     "amount": 311,
     "note": ""
    },
    {
     "id": "r10hef",
     "date": "2026-08-18",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "글로브박스",
     "amount": 284,
     "note": ""
    },
    {
     "id": "r10heg",
     "date": "2026-08-08",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "범퍼 빔",
     "amount": 249,
     "note": ""
    },
    {
     "id": "r10heh",
     "date": "2026-08-10",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 195,
     "note": ""
    },
    {
     "id": "r10hei",
     "date": "2026-08-12",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 244,
     "note": ""
    },
    {
     "id": "r10hej",
     "date": "2026-08-09",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 114,
     "note": ""
    },
    {
     "id": "r10hek",
     "date": "2026-08-29",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 94,
     "note": ""
    },
    {
     "id": "r10hel",
     "date": "2026-09-25",
     "kind": "외부 실패 (클레임·반품)",
     "part": "도어래치 ASSY",
     "amount": 699,
     "note": ""
    },
    {
     "id": "r10hem",
     "date": "2026-09-15",
     "kind": "외부 실패 (클레임·반품)",
     "part": "글로브박스",
     "amount": 564,
     "note": ""
    },
    {
     "id": "r10hen",
     "date": "2026-09-30",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "테일게이트 힌지",
     "amount": 341,
     "note": ""
    },
    {
     "id": "r10heo",
     "date": "2026-09-30",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "스티어링 브라켓",
     "amount": 270,
     "note": ""
    },
    {
     "id": "r10hep",
     "date": "2026-09-09",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "도어래치 ASSY",
     "amount": 337,
     "note": ""
    },
    {
     "id": "r10heq",
     "date": "2026-09-14",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 115,
     "note": ""
    },
    {
     "id": "r10her",
     "date": "2026-09-18",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 156,
     "note": ""
    },
    {
     "id": "r10hes",
     "date": "2026-09-04",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 180,
     "note": ""
    },
    {
     "id": "r10het",
     "date": "2026-09-27",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 121,
     "note": ""
    },
    {
     "id": "r10heu",
     "date": "2026-09-23",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 145,
     "note": ""
    },
    {
     "id": "r10hev",
     "date": "2026-10-02",
     "kind": "외부 실패 (클레임·반품)",
     "part": "콘솔 커버",
     "amount": 130,
     "note": ""
    },
    {
     "id": "r10hew",
     "date": "2026-10-03",
     "kind": "외부 실패 (클레임·반품)",
     "part": "도어 트림",
     "amount": 111,
     "note": ""
    },
    {
     "id": "r10hex",
     "date": "2026-10-04",
     "kind": "외부 실패 (클레임·반품)",
     "part": "범퍼 빔",
     "amount": 73,
     "note": ""
    },
    {
     "id": "r10hey",
     "date": "2026-10-03",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "커넥터 하우징",
     "amount": 119,
     "note": ""
    },
    {
     "id": "r10hez",
     "date": "2026-10-03",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "힌지 ASSY",
     "amount": 112,
     "note": ""
    },
    {
     "id": "r10hf0",
     "date": "2026-10-04",
     "kind": "내부 실패 (폐기·재작업)",
     "part": "글로브박스",
     "amount": 75,
     "note": ""
    },
    {
     "id": "r10hf1",
     "date": "2026-10-04",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 45,
     "note": ""
    },
    {
     "id": "r10hf2",
     "date": "2026-10-03",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 40,
     "note": ""
    },
    {
     "id": "r10hf3",
     "date": "2026-10-07",
     "kind": "평가 (검사·시험)",
     "part": "",
     "amount": 40,
     "note": ""
    },
    {
     "id": "r10hf4",
     "date": "2026-10-05",
     "kind": "예방 (교육·개선)",
     "part": "",
     "amount": 105,
     "note": ""
    }
   ]
  }
 ]
};
