window.DASHBOARD_CONFIG = {
  "format": "qa-dashboard/1",
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
      ],
      "sub": "오일펌프 · 워터펌프 · 6속 변속기 — 7대 고객사 클레임 · 공정 불량 · Cpk · 8D · 심사 종합"
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
      ],
      "sub": "정기 점검 (Red Rabbit 마스터 시편 · 청정도 Blank · CQI-9/27) · 다가오는 마감 · 최근 회의록"
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
          "title": "연간 클레임 건수 목표 대비 실적",
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
      ],
      "sub": "0-km(고객 라인) · 필드 보증 클레임 접수 · 비파괴 NTF 재현 검증 · 2D 로트 추적"
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
      ],
      "sub": "D3 24시간 5대 영역 재고 봉쇄 · D4 불량 재현 및 3-Legged 5-Why · D5 공학적 Poka-Yoke(교육/육안 단독 금지) · D7 표준화"
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
      ],
      "sub": "초기유동관리 (Safe Launch / 보그워너 90일 EPC 방화벽 / 스텔란티스 SLP) · ISIR / PPAP / Phased PPAP / VDA 2 PPA"
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
          "title": "연간 불량 수량 목표 대비 실적",
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
      ],
      "sub": "공정 · 입고 · 출하 부적합 격리(Lock-Box) · 의심 로트 소급 선별 · Poka-Yoke 대책"
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
      ],
      "sub": "오일펌프(간극·유압) · 워터펌프(씰 압입·리크) · 6속 변속기(스풀 간극·청정도 Lmax·침탄 CHD) X-R 관리도"
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
      ],
      "sub": "설비 Cmk ≥ 2.00 · 초기 Ppk ≥ 1.67 · 양산 Cpk ≥ 1.33 (보안 Ⓢ / CC ▽ / DS·DZ / <S> / KPC 특별특성 ≥ 1.67)"
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
      ],
      "sub": "측정기 · AFT/VBT/EOL/리크 마스터 오리피스 교정 · AIAG MSA 4th (%GRR < 10%, ndc ≥ 5) · Red Rabbit 마스터 시편"
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
          "title": "등급 분포 (연간 3분기)",
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
          "title": "연간 협력사 종합 점수 (평균)",
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
      ],
      "sub": "다이캐스팅·열처리(CQI-9/27)·가공·소결·씰·베어링·솔레노이드 협력사 평가 등급 · 입고 불량"
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
      ],
      "sub": "4M / 5M+1E 변경점 관리 — 고객 사전 승인(4M+ISIR / e-SREA / MBST 14 / Forever Req.) 없이 양산 선적용 절대 금지"
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
      ],
      "sub": "IATF 16949 · VDA 6.3 · 현대·기아/트랜시스 5스타·SQ · 포드 Q1 · AIAG CQI-9(열처리)/CQI-27(주조) 심사"
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
      ],
      "sub": "7대 고객사 심사 지적사항 (현대·기아/트랜시스 5스타·SQ, 다임러 VDA 6.3 *-질문, 포드 Q1, 스텔란티스 PCPA, 보그워너)"
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
          "title": "연간 교육 시간 목표 대비 실적",
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
      ],
      "sub": "품질·검사원·심사원 자격 (ISO 16232 청정도 · 나이탈 에칭 ISO 14104 · VDA 6.3 · CQI-9/27 · AIAG-VDA PFMEA)"
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
          "title": "연간 품질 비용 목표 대비 실적",
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
      ],
      "sub": "외부 실패(0-km/필드) · 내부 실패(폐기/재작업) · 평가(AFT/청정도/교정) · 예방(Poka-Yoke) 품질 비용"
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
    "upg1": true,
    "attachReset1": true,
    "fileStore1": true,
    "prodClean1": true
  },
  "fileRefs": {},
  "changelog": [],
  "title": "품질보증 대시보드",
  "subtitle": "오일펌프 · 워터펌프 · 6속 변속기 | IATF 16949 · AIAG-VDA · 7대 고객사 CSR",
  "trash": [],
  "datasets": [
    {
      "id": "people",
      "name": "담당자",
      "master": true,
      "desc": "품질보증 · 공정품질 · 고객품질(SQE) · 메트롤로지/청정도 담당자 기준 목록",
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
            "협력사품질 (SQE)",
            "공정품질",
            "메트롤로지·청정도",
            "품질시스템",
            "신규양산 (APQP)",
            "검사"
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
      "records": []
    },
    {
      "id": "customers",
      "name": "고객사",
      "master": true,
      "desc": "7대 타겟 고객사 (현대·기아, 현대트랜시스, 스텔란티스, 다임러, 포드, 보그워너, 미쓰비시) 및 CSR 특별특성·공정능력·4M 승인 기준",
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
            "국내 완성차 (OEM)",
            "국내 1차사 (Tier-1)",
            "글로벌 완성차 (OEM)",
            "글로벌 1차사 (Tier-1)",
            "기타"
          ]
        },
        {
          "key": "safety_sym",
          "label": "안전·법규 특별특성",
          "type": "text"
        },
        {
          "key": "func_sym",
          "label": "기능·공정 특별특성",
          "type": "text"
        },
        {
          "key": "cap_req",
          "label": "공정능력 기준 (Cmk/Ppk/Cpk)",
          "type": "text"
        },
        {
          "key": "appr_sys",
          "label": "초도승인 · 핵심 심사 체계",
          "type": "text"
        },
        {
          "key": "change_sys",
          "label": "4M 변경 신고 양식",
          "type": "text"
        },
        {
          "key": "contact",
          "label": "고객 품질 담당 (SQE)",
          "type": "text"
        },
        {
          "key": "note",
          "label": "CSR 핵심 요구사항 · 비고",
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
      "tpls": [
        {
          "id": "tpl-hmc",
          "name": "현대·기아 (HMC/KIA)",
          "vals": {
            "name": "현대·기아 (HMC/KIA)",
            "kind": "국내 완성차 (OEM)",
            "safety_sym": "보안 (Ⓢ)",
            "func_sym": "중요",
            "cap_req": "초기 Ppk ≥ 1.67 / 양산 Cpk ≥ 1.33 (보안 1.67)",
            "appr_sys": "ISIR / 품질 5스타 · SQ 마크",
            "change_sys": "4M 변경 사전신고서 + ISIR",
            "note": "SQ 마크(열처리/주조/표면처리) 필수, 초도 3로트 식별 라벨 부착"
          }
        },
        {
          "id": "tpl-transys",
          "name": "현대트랜시스 (HYUNDAI TRANSYS)",
          "vals": {
            "name": "현대트랜시스",
            "kind": "국내 1차사 (Tier-1)",
            "safety_sym": "보안 (Ⓢ)",
            "func_sym": "중요 / CTQ",
            "cap_req": "초기 Ppk ≥ 1.67 / 양산 Cpk ≥ 1.33 (보안·CTQ 1.67)",
            "appr_sys": "ISIR · PPAP / 5스타 · SQ",
            "change_sys": "4M 변경 사전승인 + ISIR",
            "note": "체결 토크+각도 인터락, 2D 바코드 양방향 추적성, 청정도(Lmax≤200µm), AFT 유온 보정"
          }
        },
        {
          "id": "tpl-stellantis",
          "name": "스텔란티스 (Stellantis)",
          "vals": {
            "name": "스텔란티스 (Stellantis)",
            "kind": "글로벌 완성차 (OEM)",
            "safety_sym": "Shield <S> / CSR",
            "func_sym": "Diamond <D> / CSE / CTF",
            "cap_req": "설비 Cmk ≥ 1.67 / 초기·양산 Ppk·Cpk ≥ 1.67",
            "appr_sys": "PPAP 4th + SLP (Safe Launch Plan) / PCPA 심사",
            "change_sys": "Forever Requirements 사전신고 + PPAP",
            "note": "과거 리콜/유사 불량 Read-Across PFMEA 반영 필수"
          }
        },
        {
          "id": "tpl-daimler",
          "name": "다임러 / 메르세데스-벤츠 (Mercedes-Benz)",
          "vals": {
            "name": "다임러 (Mercedes-Benz)",
            "kind": "글로벌 완성차 (OEM)",
            "safety_sym": "DS (안전) / DZ (법규) [D-Merkmale]",
            "func_sym": "기능 중요특성",
            "cap_req": "설비 Cmk ≥ 2.00 / 양산 Cpk ≥ 1.67",
            "appr_sys": "VDA 2 (PPA) + RGA (ML0~ML7) / VDA 6.3 공정심사",
            "change_sys": "MBST 14 변경 사전 통보 + VDA 2 PPA",
            "note": "DS/DZ 기록 15년 보관(MBST 27), VDA 6.3 *-질문 강등 규칙 및 VDA 19.1 청정도 준수"
          }
        },
        {
          "id": "tpl-ford",
          "name": "포드 (Ford)",
          "vals": {
            "name": "포드 (Ford)",
            "kind": "글로벌 완성차 (OEM)",
            "safety_sym": "CC (▽, S=9~10)",
            "func_sym": "SC (S=5~8, O≥4) / HI / OS",
            "cap_req": "초기 Ppk ≥ 1.67 / 양산 Cpk ≥ 1.33 (CC/SC 지속감시)",
            "appr_sys": "Phased PPAP (Phase 0~3) + SCCAF / Ford Q1",
            "change_sys": "e-SREA 승인 + Phased PPAP",
            "note": "CC(▽) 공정은 물리적 예방 Poka-Yoke 필수 (육안검사 불인정), CQI-9/27 연 1회 심사"
          }
        },
        {
          "id": "tpl-borgwarner",
          "name": "보그워너 (BorgWarner)",
          "vals": {
            "name": "보그워너 (BorgWarner)",
            "kind": "글로벌 1차사 (Tier-1)",
            "safety_sym": "Critical KPC",
            "func_sym": "KPC (제품) / KCC (공정)",
            "cap_req": "설비 Cmk ≥ 1.67 / 초기 Ppk ≥ 1.67 / 양산 Cpk ≥ 1.33 (Critical 1.67)",
            "appr_sys": "PPAP Level 3 + Run@Rate + EPC (90일 방화벽)",
            "change_sys": "Supplier Change Request (사전 서면승인) + PPAP Lv.3",
            "note": "SOP 후 90일간 100% EPC 방화벽 (불량 1건 발생 시 90일 리셋), QMN 8D (24h D3 / 7d D4 / 14d D6)"
          }
        },
        {
          "id": "tpl-mitsubishi",
          "name": "미쓰비시 (Mitsubishi)",
          "vals": {
            "name": "미쓰비시 (Mitsubishi)",
            "kind": "글로벌 완성차 (OEM)",
            "safety_sym": "중요보안 (△ / Ⓢ)",
            "func_sym": "주요 기능특성",
            "cap_req": "초기 Ppk ≥ 1.67 / 양산 Cpk ≥ 1.33",
            "appr_sys": "ISIR / PPAP + 초기유동관리 (3개월)",
            "change_sys": "5M+1E 변화점 사전승인 신청서",
            "note": "3현주의(현장·현물·현실) 양품 vs 불량품 정량 비교, 변경 전·후 초·종품 5개 정밀측정"
          }
        }
      ],
      "records": []
    },
    {
      "id": "parts",
      "name": "부품",
      "master": true,
      "desc": "3대 핵심 제품군 (오일펌프 · 워터펌프 · 6속 변속기) 품번 · 고객사 · 특별특성 · 핵심 CTQ 기준 목록",
      "dateField": "",
      "titleField": "name",
      "asOfField": "",
      "fields": [
        {
          "key": "category",
          "label": "제품군",
          "type": "select",
          "options": [
            "오일펌프 (Oil Pump)",
            "워터펌프 (Water Pump)",
            "6속 변속기 (6-Speed Transmission)"
          ],
          "colors": {
            "오일펌프 (Oil Pump)": "blue",
            "워터펌프 (Water Pump)": "cyan",
            "6속 변속기 (6-Speed Transmission)": "purple"
          }
        },
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
          "key": "special",
          "label": "특별특성 기호",
          "type": "select",
          "options": [
            "Ⓢ (보안특성 - 현대·기아/트랜시스)",
            "CC ▽ / SC (포드)",
            "DS / DZ (다임러 15년보관)",
            "<S> / <D> / CSE (스텔란티스)",
            "Critical KPC / KCC (보그워너)",
            "△ / Ⓢ (미쓰비시)",
            "중요특성 / CTQ",
            "일반"
          ]
        },
        {
          "key": "ctq",
          "label": "핵심 CTQ · 관리 공차",
          "type": "text"
        },
        {
          "key": "process",
          "label": "주 공정",
          "type": "select",
          "options": [
            "다이캐스팅 · 함침 (CQI-27)",
            "정밀 가공 (CNC·연삭·호닝)",
            "침탄 열처리 (CQI-9)",
            "디버링 · 초음파 세척 (청정도)",
            "오일펌프 조립 · AFT",
            "워터펌프 조립 · 리크",
            "밸브바디 클린룸 · VBT",
            "6속 변속기 조립 · EOL"
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
      "records": [],
      "tpls": [
        {
          "id": "tpl-op-assy",
          "name": "오일펌프 ASSY (Gerotor/Vane)",
          "vals": {
            "category": "오일펌프 (Oil Pump)",
            "name": "오일펌프 ASSY",
            "partno": "OP-21310-2G000",
            "special": "Ⓢ (보안특성 - 현대·기아/트랜시스)",
            "ctq": "로터 측면간극 0.020~0.050mm / 팁간극 0.04~0.12mm / 릴리프 개변압 / AFT 유량·토크",
            "process": "오일펌프 조립 · AFT"
          }
        },
        {
          "id": "tpl-wp-assy",
          "name": "워터펌프 ASSY (MWP/EWP)",
          "vals": {
            "category": "워터펌프 (Water Pump)",
            "name": "워터펌프 ASSY",
            "partno": "WP-25100-2G000",
            "special": "중요특성 / CTQ",
            "ctq": "메커니컬 씰 압입 깊이 ±0.05mm (서보선도) / 베어링 압입간섭량 0.025~0.055mm / 임펠러 간극 0.5~0.9mm",
            "process": "워터펌프 조립 · 리크"
          }
        },
        {
          "id": "tpl-6at-vb",
          "name": "6속 변속기 밸브바디 & VFS ASSY",
          "vals": {
            "category": "6속 변속기 (6-Speed Transmission)",
            "name": "6속 변속기 밸브바디 ASSY",
            "partno": "VB-46210-3B000",
            "special": "Ⓢ (보안특성 - 현대·기아/트랜시스)",
            "ctq": "스풀 간극 15~35µm / 접합면 평면도 ≤0.03mm / 청정도 금속 Lmax ≤200µm / 잔류자성 ≤3G",
            "process": "밸브바디 클린룸 · VBT"
          }
        },
        {
          "id": "tpl-6at-gear",
          "name": "6속 변속기 헬리컬/유성기어 & 클러치 팩",
          "vals": {
            "category": "6속 변속기 (6-Speed Transmission)",
            "name": "6속 변속기 유성기어·클러치 ASSY",
            "partno": "GT-45700-3B000",
            "special": "Critical KPC / KCC (보그워너)",
            "ctq": "침탄 표면경도 58~62 HRC / CHD 0.6~1.1mm / 연삭소결 무결함 / 클러치 팩 간극·심 선정",
            "process": "침탄 열처리 (CQI-9)"
          }
        },
        {
          "id": "tpl-6at-assy",
          "name": "6속 자동변속기 ASSY",
          "vals": {
            "category": "6속 변속기 (6-Speed Transmission)",
            "name": "6속 자동변속기 ASSY",
            "partno": "TM-45000-3B000",
            "special": "Ⓢ (보안특성 - 현대·기아/트랜시스)",
            "ctq": "하우징 리크 ≤3cc/min / 체결 토크+각도 인터락 / EOL 변속 응답·NVH 차수 분석",
            "process": "6속 변속기 조립 · EOL"
          }
        }
      ]
    },
    {
      "id": "defecttypes",
      "name": "불량 유형",
      "master": true,
      "desc": "오일펌프 · 워터펌프 · 6속 변속기 고장물리(PoF) 기반 불량 유형 및 판정 기준",
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
            "오일펌프 (간극·릴리프밸브·캐비테이션·AFT)",
            "워터펌프 (메커니컬씰·베어링·임펠러·삼출NTF)",
            "6속 변속기 (밸브바디청정도·기어NVH/열처리·클러치)",
            "기초공정 (다이캐스팅기공·가공평면도/버·체결토크/각도)",
            "기타"
          ]
        },
        {
          "key": "note",
          "label": "고장물리 메커니즘 · 판정 기준",
          "type": "text"
        }
      ],
      "records": [],
      "tpls": [
        {
          "id": "tpl-dt-op1",
          "name": "오일펌프 저속 유압 부족 (측면 간극 과대)",
          "vals": {
            "name": "저속 유압 부족 (로터 측면 간극 과대)",
            "group": "오일펌프 (간극·릴리프밸브·캐비테이션·AFT)",
            "note": "Poiseuille 내부 누설(Q_leak ∝ h³/μ): 측면 간극 0.020~0.050mm 초과 여부 점검"
          }
        },
        {
          "id": "tpl-dt-op2",
          "name": "오일펌프 릴리프 밸브 고착 (Sticking)",
          "vals": {
            "name": "릴리프 밸브 고착 (개변압 이상)",
            "group": "오일펌프 (간극·릴리프밸브·캐비테이션·AFT)",
            "note": "보어 교차홀 미세 버(Burr) 또는 이물 유입으로 플런저 승강 구속"
          }
        },
        {
          "id": "tpl-dt-wp1",
          "name": "워터펌프 메커니컬 씰 진성 누수",
          "vals": {
            "name": "메커니컬 씰 냉각수 진성 누수",
            "group": "워터펌프 (메커니컬씰·베어링·임펠러·삼출NTF)",
            "note": "씰 압입 깊이 불량, SiC/카본 습동면 열충격 크랙 또는 실리콘 실란트 과도포 침투"
          }
        },
        {
          "id": "tpl-dt-wp2",
          "name": "워터펌프 초기 일시적 삼출 (Weeping / NTF)",
          "vals": {
            "name": "드레인홀 초기 일시적 삼출 흔적 (NTF)",
            "group": "워터펌프 (메커니컬씰·베어링·임펠러·삼출NTF)",
            "note": "분해 전 에어리크 및 90~110℃ 실부동액 내구시험 시 누수 재현 안 됨 (습동면 안정화 정상 삼출)"
          }
        },
        {
          "id": "tpl-dt-tm1",
          "name": "6속 변속기 밸브바디 스풀 고착 (청정도 이물)",
          "vals": {
            "name": "밸브바디 스풀/VFS 고착 (금속 이물)",
            "group": "6속 변속기 (밸브바디청정도·기어NVH/열처리·클러치)",
            "note": "스풀 반경 간극(7.5~17.5µm) 내 200µm 이상 금속 칩 유입 (ISO 16232 Lmax 위반)"
          }
        },
        {
          "id": "tpl-dt-tm2",
          "name": "6속 변속기 기어 와인 소음 (Whine Noise)",
          "vals": {
            "name": "기어 와인 소음 (전달오차/열처리 변형)",
            "group": "6속 변속기 (밸브바디청정도·기어NVH/열처리·클러치)",
            "note": "기어 맞물림 차수(GMF) 대역 NVH 초과 — 치형(Fα)·치줄(Fβ)·침탄 열변형 또는 찍힘(Nick)"
          }
        }
      ]
    },
    {
      "id": "vendors",
      "name": "협력사",
      "master": true,
      "desc": "다이캐스팅·열처리(CQI-9/27)·정밀가공·소결·씰·베어링·솔레노이드 외주 협력사 및 SQ/VDA 등급 관리",
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
            "알루미늄 다이캐스팅·주조 (SQ/CQI-27)",
            "침탄·열처리 (SQ/CQI-9)",
            "정밀 가공·연삭·호닝",
            "소결·단조 (로터/기어)",
            "메커니컬 씰·오링·개스킷",
            "베어링·부시·스냅링",
            "솔레노이드·전장 (EOP/EWP/VFS)",
            "표면처리·함침 (SQ/CQI-11·12)",
            "세척·디버링·조립"
          ]
        },
        {
          "key": "sq_cert",
          "label": "SQ / CQI / VDA 6.3 인증·등급",
          "type": "text"
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
      "records": []
    },
    {
      "id": "lines",
      "name": "생산 라인",
      "master": true,
      "desc": "파워트레인 · 열관리 부품 8대 핵심 제조·조립·시험 라인 (공장 배치도 연동)",
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
            "다이캐스팅 · 함침 (CQI-27)",
            "정밀 가공 (CNC·연삭·호닝)",
            "침탄 열처리 (CQI-9)",
            "디버링 · 초음파 세척 (청정도)",
            "오일펌프 조립 · AFT",
            "워터펌프 조립 · 리크",
            "밸브바디 클린룸 · VBT",
            "6속 변속기 조립 · EOL"
          ]
        },
        {
          "key": "note",
          "label": "핵심 Poka-Yoke · 설비 · 비고",
          "type": "text"
        }
      ],
      "records": [],
      "tpls": [
        {
          "id": "tpl-ln1",
          "name": "다이캐스팅 · 함침",
          "vals": {
            "name": "다이캐스팅 · 함침",
            "process": "다이캐스팅 · 함침 (CQI-27)",
            "note": "알루미늄 HPDC · 진공 함침 · X-Ray 기공 검사 (CQI-27)"
          }
        },
        {
          "id": "tpl-ln2",
          "name": "정밀 가공 (CNC·연삭)",
          "vals": {
            "name": "정밀 가공 (CNC·연삭)",
            "process": "정밀 가공 (CNC·연삭·호닝)",
            "note": "하우징 평면도 · 밸브바디 보어 호닝 · 기어 치면 연삭 (나이탈 에칭)"
          }
        },
        {
          "id": "tpl-ln3",
          "name": "침탄 열처리 (CQI-9)",
          "vals": {
            "name": "침탄 열처리 (CQI-9)",
            "process": "침탄 열처리 (CQI-9)",
            "note": "표면경도 58~62 HRC · 유효경화깊이(CHD) 0.6~1.1mm · SAT/TUS"
          }
        },
        {
          "id": "tpl-ln4",
          "name": "디버링 · 초음파 세척",
          "vals": {
            "name": "디버링 · 초음파 세척",
            "process": "디버링 · 초음파 세척 (청정도)",
            "note": "고압 디버링 · 진공건조 · 탈자(≤3G) · ISO 16232 청정도(Lmax≤200µm)"
          }
        },
        {
          "id": "tpl-ln5",
          "name": "오일펌프 조립 · AFT",
          "vals": {
            "name": "오일펌프 조립 · AFT",
            "process": "오일펌프 조립 · AFT",
            "note": "로터 3대 간극 인라인 측정 · 릴리프 밸브 · 유온보정 AFT 전수검사"
          }
        },
        {
          "id": "tpl-ln6",
          "name": "워터펌프 조립 · 리크",
          "vals": {
            "name": "워터펌프 조립 · 리크",
            "process": "워터펌프 조립 · 리크",
            "note": "메커니컬 씰·베어링 서보 프레스 하중-변위 선도 감시 · 차압 에어리크"
          }
        },
        {
          "id": "tpl-ln7",
          "name": "밸브바디 클린룸 · VBT",
          "vals": {
            "name": "밸브바디 클린룸 · VBT",
            "process": "밸브바디 클린룸 · VBT",
            "note": "양압 클린룸 · 스풀 선택조립(15~35µm) · VBT 유압 히스테리시스 전수"
          }
        },
        {
          "id": "tpl-ln8",
          "name": "6속 변속기 조립 · EOL",
          "vals": {
            "name": "6속 변속기 조립 · EOL",
            "process": "6속 변속기 조립 · EOL",
            "note": "클러치 팩 심 자동 선정 · 너트러너 토크+각도 인터락 · EOL 다이나모 NVH"
          }
        }
      ]
    },
    {
      "id": "claims",
      "name": "고객 클레임",
      "desc": "0-km(고객 라인) 및 필드 보증 클레임 접수 · 비파괴 NTF 재현 검증 · 2D 로트 추적 · 비용 및 리드타임 관리",
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
          "key": "stage_kind",
          "label": "발생 구분",
          "type": "select",
          "options": [
            "0-km (고객 입고·조립라인)",
            "필드 보증 (Warranty Return)",
            "초기유동 (Safe Launch / EPC)"
          ],
          "colors": {
            "0-km (고객 입고·조립라인)": "red",
            "필드 보증 (Warranty Return)": "orange",
            "초기유동 (Safe Launch / EPC)": "purple"
          }
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
          "key": "ntf_check",
          "label": "회수품 NTF · 재현 검증",
          "type": "select",
          "options": [
            "분해 전 비파괴·AFT/EOL·리크 재현 완료 (진성 불량)",
            "내구·리크 재현 시험 결과 누수 없음 (NTF / 초기 일시적 삼출)",
            "회수품 입수 대기",
            "해당 없음"
          ]
        },
        {
          "key": "lot_trace",
          "label": "불량 로트 · 2D 바코드 시리얼",
          "type": "text"
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
          "id": "v-stage",
          "name": "0-km / 필드 구분별",
          "f": [],
          "q": "",
          "sortK": "date",
          "asc": false,
          "group": "stage_kind",
          "hide": [
            "files"
          ]
        }
      ],
      "tpls": [
        {
          "id": "tpl-cl-0km",
          "name": "0-km (고객 라인) 긴급 클레임",
          "vals": {
            "stage_kind": "0-km (고객 입고·조립라인)",
            "qty": 1,
            "ntf_check": "회수품 입수 대기",
            "status": "접수"
          }
        },
        {
          "id": "tpl-cl-wp-ntf",
          "name": "워터펌프 드레인홀 흔적 (비파괴 NTF 검증)",
          "vals": {
            "stage_kind": "필드 보증 (Warranty Return)",
            "qty": 1,
            "ntf_check": "내구·리크 재현 시험 결과 누수 없음 (NTF / 초기 일시적 삼출)",
            "status": "조사중"
          }
        },
        {
          "id": "tpl-cl-field",
          "name": "필드 보증 (Warranty) 진성 클레임",
          "vals": {
            "stage_kind": "필드 보증 (Warranty Return)",
            "qty": 1,
            "ntf_check": "분해 전 비파괴·AFT/EOL·리크 재현 완료 (진성 불량)",
            "status": "조사중"
          }
        }
      ],
      "records": []
    },
    {
      "id": "capa",
      "name": "8D / 시정조치",
      "desc": "8D 시정조치 보고서 — D3 24시간 5대 영역 재고 봉쇄 · D4 불량 재현 및 3-Legged 5-Why · D5 공학적 Poka-Yoke(교육/육안 단독 금지) · D7 Golden Thread 표준화",
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
          "key": "customer",
          "label": "고객사",
          "type": "ref",
          "ref": "customers"
        },
        {
          "key": "part",
          "label": "부품",
          "type": "ref",
          "ref": "parts"
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
          "key": "d3_scope",
          "label": "D3 5대 재고 봉쇄 · 식별 마킹",
          "type": "select",
          "options": [
            "5대 영역 전수선별 + 인증마킹 완료",
            "사내(WIP·창고)·운송중 차단중",
            "고객사 창고·조립분 선별중",
            "미완료"
          ],
          "colors": {
            "5대 영역 전수선별 + 인증마킹 완료": "green",
            "사내(WIP·창고)·운송중 차단중": "orange",
            "고객사 창고·조립분 선별중": "orange",
            "미완료": "red"
          }
        },
        {
          "key": "repro",
          "label": "D4 불량 재현 시험 (On/Off)",
          "type": "select",
          "options": [
            "재현 확인 (On/Off 100% 일치)",
            "비파괴·기능 시험(NTF) 진행중",
            "미실시"
          ]
        },
        {
          "key": "cause_occ",
          "label": "① 발생 원인 (Occurrence 5-Why)",
          "type": "longtext"
        },
        {
          "key": "cause_esc",
          "label": "② 유출 원인 (Escape/Detection 5-Why)",
          "type": "longtext"
        },
        {
          "key": "cause_sys",
          "label": "③ 시스템 원인 (Systemic 5-Why)",
          "type": "longtext"
        },
        {
          "key": "pca_type",
          "label": "D5 영구 대책 유형 (Poka-Yoke 원칙)",
          "type": "select",
          "options": [
            "예방 Poka-Yoke (역조립/혼입 원천차단)",
            "검출 Poka-Yoke (서보선도/토크+각도/센서 인터락)",
            "AFT/EOL/리크 판정 로직 · 지그 개선",
            "설계/공차/재질 변경 (EO)",
            "작업자 교육/육안검사 (단독 불가 - 보완 필요)"
          ],
          "colors": {
            "예방 Poka-Yoke (역조립/혼입 원천차단)": "green",
            "검출 Poka-Yoke (서보선도/토크+각도/센서 인터락)": "blue",
            "AFT/EOL/리크 판정 로직 · 지그 개선": "cyan",
            "설계/공차/재질 변경 (EO)": "purple",
            "작업자 교육/육안검사 (단독 불가 - 보완 필요)": "red"
          }
        },
        {
          "key": "d7_docs",
          "label": "D7 표준화 (PFMEA·CP·SOP·Red Rabbit)",
          "type": "select",
          "options": [
            "PFMEA+CP+SOP+마스터시편 개정 완료",
            "개정 진행중",
            "미개정"
          ]
        },
        {
          "key": "yokoten",
          "label": "D8 수평 전개 (Yokoten)",
          "type": "text"
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
          "id": "tpl-8d-op",
          "name": "오일펌프 릴리프 밸브 고착 / 유압 부족 8D",
          "vals": {
            "source": "고객 클레임",
            "step": "D3",
            "d3_scope": "사내(WIP·창고)·운송중 차단중",
            "repro": "비파괴·기능 시험(NTF) 진행중",
            "pca_type": "검출 Poka-Yoke (서보선도/토크+각도/센서 인터락)",
            "d7_docs": "미개정",
            "status": "진행중"
          }
        },
        {
          "id": "tpl-8d-wp",
          "name": "워터펌프 메커니컬 씰 누수 / 삼출(NTF) 8D",
          "vals": {
            "source": "고객 클레임",
            "step": "D4",
            "d3_scope": "5대 영역 전수선별 + 인증마킹 완료",
            "repro": "재현 확인 (On/Off 100% 일치)",
            "pca_type": "검출 Poka-Yoke (서보선도/토크+각도/센서 인터락)",
            "d7_docs": "개정 진행중",
            "status": "진행중"
          }
        },
        {
          "id": "tpl-8d-6at",
          "name": "6속 변속기 밸브바디 청정도 / 기어 NVH 8D",
          "vals": {
            "source": "공정 불량",
            "step": "D4",
            "d3_scope": "5대 영역 전수선별 + 인증마킹 완료",
            "repro": "재현 확인 (On/Off 100% 일치)",
            "pca_type": "AFT/EOL/리크 판정 로직 · 지그 개선",
            "d7_docs": "개정 진행중",
            "status": "진행중"
          }
        }
      ],
      "records": []
    },
    {
      "id": "defects",
      "name": "불량 발생",
      "desc": "공정 · 입고 · 출하 부적합품 격리(Lock-Box) 및 의심 로트(Suspect Lot) 소급 선별 · Poka-Yoke 재발방지 이력",
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
          "key": "lot",
          "label": "의심 로트(Suspect Lot) 소급 범위",
          "type": "text"
        },
        {
          "key": "pokayoke",
          "label": "재발방지 대책 구분",
          "type": "select",
          "options": [
            "예방 Poka-Yoke (물리적 차단)",
            "검출 Poka-Yoke (서보/토크·각도/비전 인터락)",
            "AFT/EOL/리크 판정 강화",
            "공구수명 인터락 · 조건 보정",
            "선별 · 격리 (임시조치)",
            "작업자 교육/육안검사 (단독 대책 금지)"
          ]
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
      ],
      "records": []
    },
    {
      "id": "inspections",
      "name": "검사 실적",
      "desc": "수입 · 공정 · 출하 · AFT/VBT/EOL 전수검사 · Safe Launch/EPC 방화벽 · 기술적 청정도(ISO 16232) 검사 실적",
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
            "출하검사",
            "AFT / VBT / EOL 전수검사",
            "Safe Launch / EPC 방화벽 검사",
            "기술적 청정도 (ISO 16232)"
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
      "records": []
    },
    {
      "id": "cpk",
      "name": "공정능력 (Cpk)",
      "desc": "핵심 CTQ 및 고객 특별특성(Ⓢ/CC/DS·DZ/<S>/KPC) 공정능력지수 (설비 Cmk ≥ 2.00 / 초기 Ppk ≥ 1.67 / 양산 Cpk ≥ 1.33~1.67)",
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
          "key": "special",
          "label": "특성 구분 (CSR)",
          "type": "select",
          "options": [
            "특별특성 (보안 Ⓢ / CC ▽ / DS·DZ / <S> / KPC)",
            "중요·기능특성 (SC / CSE / <D> / CTQ)",
            "일반특성",
            "기하공차·청정도 (비정규 단측 ISO 22514-2)"
          ],
          "colors": {
            "특별특성 (보안 Ⓢ / CC ▽ / DS·DZ / <S> / KPC)": "red",
            "중요·기능특성 (SC / CSE / <D> / CTQ)": "orange",
            "일반특성": "blue",
            "기하공차·청정도 (비정규 단측 ISO 22514-2)": "purple"
          }
        },
        {
          "key": "stage",
          "label": "지수 구분",
          "type": "select",
          "options": [
            "장기 공정능력 (Cpk)",
            "초기 공정능력 (Ppk - 25군/100개)",
            "설비능력지수 (Cmk - 연속 50개)"
          ]
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
          "key": "target_cpk",
          "label": "요구 기준",
          "type": "formula",
          "expr": "if({지수 구분} == \"설비능력지수 (Cmk - 연속 50개)\", 2.00, if({지수 구분} == \"초기 공정능력 (Ppk - 25군/100개)\", 1.67, if({특성 구분 (CSR)} == \"특별특성 (보안 Ⓢ / CC ▽ / DS·DZ / <S> / KPC)\", 1.67, 1.33)))"
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
      "records": [],
      "tpls": [
        {
          "id": "tpl-cpk-op",
          "name": "오일펌프 로터 측면 간극 (특별특성 Cpk ≥ 1.67)",
          "vals": {
            "char": "오일펌프 로터 측면 간극",
            "special": "특별특성 (보안 Ⓢ / CC ▽ / DS·DZ / <S> / KPC)",
            "stage": "장기 공정능력 (Cpk)",
            "spec": "0.020 ~ 0.050 mm",
            "cpk": 1.72,
            "judge": "정상"
          }
        },
        {
          "id": "tpl-cpk-wp",
          "name": "워터펌프 메커니컬 씰 압입 깊이 (특별특성 Cpk ≥ 1.67)",
          "vals": {
            "char": "워터펌프 메커니컬 씰 압입 깊이",
            "special": "특별특성 (보안 Ⓢ / CC ▽ / DS·DZ / <S> / KPC)",
            "stage": "장기 공정능력 (Cpk)",
            "spec": "12.50 ± 0.05 mm",
            "cpk": 1.69,
            "judge": "정상"
          }
        },
        {
          "id": "tpl-cpk-6at",
          "name": "6속 변속기 밸브바디 스풀 직경 간극 (특별특성 Cpk ≥ 1.67)",
          "vals": {
            "char": "6속 변속기 밸브바디 스풀 직경 간극",
            "special": "특별특성 (보안 Ⓢ / CC ▽ / DS·DZ / <S> / KPC)",
            "stage": "장기 공정능력 (Cpk)",
            "spec": "15 ~ 35 µm",
            "cpk": 1.75,
            "judge": "정상"
          }
        }
      ]
    },
    {
      "id": "measure",
      "name": "치수 측정",
      "desc": "오일펌프 · 워터펌프 · 6속 변속기 15대 핵심 CTQ 치수 · 기능 · 청정도 · 열처리 SPC 실측 데이터",
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
            "오일펌프 로터 측면 간극 (0.020~0.050 mm)",
            "오일펌프 로터 팁 간극 (0.04~0.12 mm)",
            "오일펌프 로터 바디 간극 (0.08~0.16 mm)",
            "오일펌프 릴리프 밸브 개변압 (bar)",
            "오일펌프 AFT 저속 토출 유압 (bar)",
            "워터펌프 메커니컬 씰 압입 깊이 (mm)",
            "워터펌프 베어링 외륜 압입 하중 (kN)",
            "워터펌프 임펠러 선단 간극 (0.5~0.9 mm)",
            "워터펌프 차압 에어 리크량 (cc/min)",
            "6속 변속기 밸브바디 스풀 직경 간극 (15~35 µm)",
            "6속 변속기 밸브바디 접합면 평면도 (≤0.03 mm)",
            "6속 변속기 밸브바디 청정도 최대금속입자 Lmax (≤200 µm)",
            "6속 변속기 기어 침탄 유효경화깊이 CHD (0.6~1.1 mm)",
            "6속 변속기 클러치 팩 간극 (mm)",
            "6속 변속기 하우징 에어 리크량 (≤3 cc/min)"
          ]
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
          "key": "spec",
          "label": "규격 · 공차",
          "type": "text"
        },
        {
          "key": "judge",
          "label": "판정",
          "type": "select",
          "options": [
            "합격",
            "불합격"
          ],
          "colors": {
            "합격": "green",
            "불합격": "red"
          }
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
      "records": []
    },
    {
      "id": "suppliers",
      "name": "협력사 평가",
      "desc": "외주 협력사 정기 품질·납기·특수공정(SQ/CQI-9/CQI-27/VDA 6.3) 종합 평가",
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
            "알루미늄 다이캐스팅·주조 (SQ/CQI-27)",
            "침탄·열처리 (SQ/CQI-9)",
            "정밀 가공·연삭·호닝",
            "소결·단조 (로터/기어)",
            "메커니컬 씰·오링·개스킷",
            "베어링·부시·스냅링",
            "솔레노이드·전장 (EOP/EWP/VFS)",
            "표면처리·함침 (SQ/CQI-11·12)",
            "세척·디버링·조립"
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
      "records": []
    },
    {
      "id": "nc",
      "name": "부적합 (심사 지적)",
      "desc": "IATF 16949 · VDA 6.3 · 현대기아 5스타/SQ · 포드 Q1 · AIAG CQI-9/27 심사 부적합 및 시정조치",
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
            "IATF 16949 사후·갱신심사",
            "현대·기아/트랜시스 5스타 · SQ 심사",
            "다임러/유럽 VDA 6.3 공정심사",
            "포드 Q1 · 스텔란티스 PCPA · 보그워너 심사",
            "AIAG CQI-9(열처리) · CQI-27(주조) 자가진단"
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
      "records": []
    },
    {
      "id": "auditplan",
      "name": "내부심사 계획",
      "desc": "연간 시스템(IATF 16949) · 공정(VDA 6.3 / 5스타 / SQ) · 특수공정(CQI-9 열처리 / CQI-27 주조) 심사 일정",
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
      "records": [],
      "tpls": [
        {
          "id": "tpl-ap-vda",
          "name": "VDA 6.3 공정심사 (P2~P7)",
          "vals": {
            "dept": "오일펌프·워터펌프·변속기 제조팀",
            "scope": "VDA 6.3 P2~P7 (*-질문 강등 위험 및 Poka-Yoke 집중 점검)",
            "progress": 0,
            "status": "예정"
          }
        },
        {
          "id": "tpl-ap-cqi9",
          "name": "AIAG CQI-9 열처리 시스템 심사 (연 1회)",
          "vals": {
            "dept": "침탄 열처리 라인 · 열처리 협력사",
            "scope": "CQI-9 4th Ed. 피로메트리(TUS/SAT) · 유효경화깊이(CHD) · IGO 관리",
            "progress": 0,
            "status": "예정"
          }
        },
        {
          "id": "tpl-ap-cqi27",
          "name": "AIAG CQI-27 주조 시스템 심사 (연 1회)",
          "vals": {
            "dept": "다이캐스팅 · 함침 라인",
            "scope": "CQI-27 알루미늄 HPDC 용탕·금형온도·진공함침·기공 리크 관리",
            "progress": 0,
            "status": "예정"
          }
        }
      ]
    },
    {
      "id": "launch",
      "name": "초기유동관리",
      "desc": "신차·4M 변경 SOP 초기유동관리 — Safe Launch / 보그워너 EPC(90일 방화벽·불량 시 리셋) / 스텔란티스 SLP",
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
          "key": "regime",
          "label": "관리 체계",
          "type": "select",
          "options": [
            "Safe Launch (APQP 3rd)",
            "EPC (보그워너 90일 방화벽 · 불량 시 리셋)",
            "SLP (스텔란티스 Safe Launch Plan)",
            "초기유동관리 (현대·기아/트랜시스/미쓰비시 3개월)",
            "4M 변경 초도품 관리 (3로트)"
          ]
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
          "key": "exit_crit",
          "label": "Exit Criteria (해제 조건)",
          "type": "text"
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
      "records": []
    },
    {
      "id": "ppap",
      "name": "PPAP",
      "desc": "고객별 초도품 승인 — ISIR / PPAP Level 1~5 / 포드 Phased PPAP+SCCAF / 다임러 VDA 2 PPA+RGA",
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
          "label": "제출 레벨 · 체계",
          "type": "select",
          "options": [
            "ISIR (현대·기아/트랜시스/미쓰비시)",
            "PPAP Level 3 (스텔란티스/보그워너 표준)",
            "Phased PPAP Phase 0~3 + SCCAF (포드)",
            "VDA 2 PPA + RGA ML0~ML7 (다임러)",
            "PPAP Level 1",
            "PPAP Level 2",
            "PPAP Level 4",
            "PPAP Level 5"
          ]
        },
        {
          "key": "stage",
          "label": "단계",
          "type": "select",
          "options": [
            "서류준비",
            "Run@Rate / RGA 검증",
            "제출",
            "고객검토",
            "승인"
          ]
        },
        {
          "key": "golden_thread",
          "label": "Golden Thread (도면↔PFMEA↔CP↔SOP)",
          "type": "select",
          "options": [
            "1:1 일치 검증 완료",
            "검토중",
            "보완 필요"
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
      "records": []
    },
    {
      "id": "tasks",
      "name": "업무 일정",
      "desc": "품질보증 정기 업무 (Red Rabbit 마스터 시편 점검 · 청정도 Blank 테스트 · CQI-9/27 심사 · SPC/Cpk 리뷰)",
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
      "repeat": {
        "field": "repeat"
      },
      "records": []
    },
    {
      "id": "memos",
      "name": "메모 · 회의록",
      "desc": "품질 회의록 · 고객 SQE 협의록 · 4M/8D 기술 검토 메모",
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
      "records": []
    },
    {
      "id": "calib",
      "name": "측정기 교정 관리",
      "desc": "측정기 · 시험설비(AFT/VBT/EOL/리크 마스터 오리피스) 교정 이력 및 AIAG MSA 4th (%GRR < 10%, ndc ≥ 5) · Red Rabbit 마스터 시편 관리",
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
            "인라인 에어 마이크로미터 / LVDT",
            "3차원 측정기 (CMM) / 기어 측정기",
            "전동 너트러너 (토크+각도 센서)",
            "서보 프레스 (하중-변위 로드셀)",
            "차압식 에어 리크 테스터 / 마스터 오리피스",
            "AFT / VBT / EOL 다이나모 시험기",
            "청정도 분석기 (ISO 16232) / 가우스메터",
            "경도계 / 나이탈 에칭·바크하우젠 검사기",
            "Poka-Yoke 마스터 불량 시편 (Red Rabbit)",
            "일반 계측기 (마이크로미터·캘리퍼스·게이지)"
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
          "key": "grr",
          "label": "Gage R&R (%GRR)",
          "type": "number"
        },
        {
          "key": "ndc",
          "label": "식별 범주 수 (ndc)",
          "type": "number"
        },
        {
          "key": "msa_judge",
          "label": "MSA 판정 (AIAG 4th)",
          "type": "select",
          "options": [
            "우수 (%GRR < 10%, ndc ≥ 5)",
            "조건부 수용 (10~30%, SQE 승인)",
            "부적합 (%GRR > 30% 또는 ndc < 5)",
            "마스터 시편 (일일 검증)"
          ],
          "colors": {
            "우수 (%GRR < 10%, ndc ≥ 5)": "green",
            "조건부 수용 (10~30%, SQE 승인)": "orange",
            "부적합 (%GRR > 30% 또는 ndc < 5)": "red",
            "마스터 시편 (일일 검증)": "blue"
          }
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
      "records": []
    },
    {
      "id": "auditfind",
      "name": "고객 심사 지적사항",
      "desc": "7대 고객사 공정·품질 심사 지적사항 (현대·기아/트랜시스 5스타·SQ, 다임러 VDA 6.3 *-질문, 포드 Q1, 스텔란티스 PCPA, 보그워너)",
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
          "key": "audit_type",
          "label": "심사 종류",
          "type": "select",
          "options": [
            "현대·기아/트랜시스 5스타 · SQ",
            "다임러/유럽 VDA 6.3 공정심사",
            "포드 Q1 · 스텔란티스 PCPA · 보그워너",
            "AIAG CQI-9(열처리) · CQI-27(주조)",
            "IATF 16949 인증심사"
          ]
        },
        {
          "key": "star_q",
          "label": "VDA 6.3 별표(*-질문) / 강등 위험",
          "type": "select",
          "options": [
            "일반 항목",
            "별표(*-질문) 4점 이하 (B등급 강등 위험)",
            "별표(*-질문) 0점 (C등급 강등 위험)"
          ],
          "colors": {
            "일반 항목": "gray",
            "별표(*-질문) 4점 이하 (B등급 강등 위험)": "orange",
            "별표(*-질문) 0점 (C등급 강등 위험)": "red"
          }
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
      "records": []
    },
    {
      "id": "change4m",
      "name": "변경점 (4M) 관리",
      "desc": "4M / 5M+1E 변경점 관리 — 고객 사전 신고·서면 승인(4M+ISIR / e-SREA / MBST 14 / Forever Req.) 없이 양산 선적용 절대 금지 · 7대 사전 유효성 검증 · 초도 3로트 식별",
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
          "key": "customer",
          "label": "대상 고객사",
          "type": "ref",
          "ref": "customers"
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
          "key": "form_type",
          "label": "고객 신고 양식",
          "type": "select",
          "options": [
            "4M 변경 신고서 + ISIR (현대·기아/트랜시스)",
            "e-SREA + Phased PPAP (포드)",
            "MBST 14 변경통보 + VDA 2 PPA (다임러/벤츠)",
            "Supplier Change Request + PPAP Lv.3 (스텔란티스/보그워너)",
            "5M+1E 변경 사전신고 (미쓰비시)"
          ]
        },
        {
          "key": "val_check",
          "label": "7대 사전 유효성 검증",
          "type": "select",
          "options": [
            "전수치수+Ppk(≥1.67)/Cmk(≥2.0)+MSA+재질/비파괴+청정도(Lmax)+AFT/내구+R@R 완료",
            "검증 시험 진행중",
            "검증 전"
          ]
        },
        {
          "key": "approval",
          "label": "고객 승인",
          "type": "select",
          "options": [
            "사전 검토중 (양산 선적용 금지)",
            "신청",
            "승인",
            "반려"
          ],
          "colors": {
            "사전 검토중 (양산 선적용 금지)": "orange",
            "신청": "blue",
            "승인": "green",
            "반려": "red"
          }
        },
        {
          "key": "lot_mark",
          "label": "초도 3로트 식별표 · Safe Launch",
          "type": "select",
          "options": [
            "초도 3로트 식별라벨 부착 + Safe Launch 완료",
            "초도 출하 대기",
            "해당 없음"
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
      "records": []
    },
    {
      "id": "training",
      "name": "교육 · 자격 이력",
      "desc": "품질·검사원·심사원 자격 및 교육 이력 (ISO 16232 청정도 · 나이탈 에칭 ISO 14104 · VDA 6.3 · CQI-9/27 · AIAG-VDA PFMEA)",
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
      "records": [],
      "tpls": [
        {
          "id": "tpl-tr-pfmea",
          "name": "AIAG-VDA PFMEA & Control Plan 1st Ed. 실무",
          "vals": {
            "course": "AIAG-VDA PFMEA 1st Ed. (AP 매트릭스) & Control Plan 1st Ed.",
            "kind": "사외 교육",
            "hours": 16,
            "note": "7단계 접근법, AP(H/M/L) 산출 및 Poka-Yoke 유효성 검증"
          }
        },
        {
          "id": "tpl-tr-clean",
          "name": "ISO 16232 / VDA 19.1 기술적 청정도 검사원 자격",
          "vals": {
            "course": "ISO 16232 / VDA 19.1 기술적 청정도 추출·현미경 분석 자격",
            "kind": "자격",
            "hours": 8,
            "note": "Blank Value ≤ 10%, Lmax ≤ 200µm 판정 자격"
          }
        },
        {
          "id": "tpl-tr-cqi",
          "name": "VDA 6.3 공정심사원 / AIAG CQI-9·CQI-27 내부심사원",
          "vals": {
            "course": "VDA 6.3 공정심사 및 CQI-9(열처리)·CQI-27(주조) 심사원 자격",
            "kind": "자격",
            "hours": 24,
            "note": "특수공정 연 1회 자가진단 수행 자격"
          }
        }
      ]
    },
    {
      "id": "copq",
      "name": "품질 비용 (COPQ)",
      "desc": "품질 실패·평가·예방 비용 (COPQ — 외부 0-km/필드 클레임 · 내부 스크랩/재작업 · AFT/청정도/교정 평가 · Poka-Yoke 예방 투자)",
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
      "records": []
    }
  ]
};
