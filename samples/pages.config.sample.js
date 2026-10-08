/* =====================================================================
   품질보증 업무 대시보드 - 설정 + 데이터 파일
   ---------------------------------------------------------------------
   [추천] 화면에서 편집하세요.
   - 데이터 입력: 왼쪽 메뉴 '데이터 입력'에서 클레임·불량·8D·업무를 기록하면
                 연결된 대시보드 위젯이 자동으로 다시 계산됩니다.
   - 화면 구성: 각 페이지의 '이 페이지 편집'으로 위젯을 추가·수정합니다.
   - 영구 저장: 화면에서 입력한 내용은 이 브라우저에 저장됩니다.
                '설정 내보내기 > 파일 다운로드'로 받은 파일로 이 파일을 교체하면
                다른 PC에서도 같은 내용을 볼 수 있습니다.

   구조
   - datasets : 데이터 대장(항목 구성 fields + 기록 records)
   - pages    : 화면 페이지와 위젯. 위젯의 src 가 있으면 데이터 대장에서 자동 집계,
                없으면 위젯에 직접 적은 값을 그대로 표시합니다.
   - 기준 정보 : 고객사·부품·불량 유형·협력사·라인·담당자 목록. 여기서 고치면 각 대장의
                드롭다운이 바뀝니다. (필드 형식 "ref" = 목록 참조)
   ※ 기록은 프로토타입용 예시 데이터입니다. (2026-01-01 ~ 2026-10-07)
   ===================================================================== */

window.DASHBOARD_CONFIG = {
  "appName": "품질보증 업무 현황",
  "owner": "품질보증팀",
  "datasets": [
    {
      "id": "people",
      "name": "담당자",
      "master": true,
      "desc": "담당자·작성자로 고를 수 있는 사람 목록입니다.",
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
          "type": "text"
        },
        {
          "key": "role",
          "label": "역할",
          "type": "text"
        }
      ],
      "records": [
        {"id": "r0688", "name": "김민수", "team": "품질보증팀", "role": "고객 품질"},
        {"id": "r0689", "name": "이서연", "team": "품질보증팀", "role": "고객 품질"},
        {"id": "r0690", "name": "박지훈", "team": "품질보증팀", "role": "협력사 품질"},
        {"id": "r0691", "name": "최유진", "team": "품질보증팀", "role": "시스템 · 심사"},
        {"id": "r0692", "name": "정하늘", "team": "품질보증팀", "role": "신규 양산"}
      ]
    },
    {
      "id": "customers",
      "name": "고객사",
      "master": true,
      "desc": "완성차 고객사 목록입니다. 클레임·PPAP·초기유동관리에서 골라 씁니다.",
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
        }
      ],
      "records": [
        {"id": "r0693", "name": "H사", "kind": "완성차", "contact": "", "note": ""},
        {"id": "r0694", "name": "K사", "kind": "완성차", "contact": "", "note": ""},
        {"id": "r0695", "name": "G사", "kind": "완성차", "contact": "", "note": ""},
        {"id": "r0696", "name": "R사", "kind": "완성차", "contact": "", "note": ""},
        {"id": "r0697", "name": "기타", "kind": "기타", "contact": "", "note": ""}
      ]
    },
    {
      "id": "parts",
      "name": "부품",
      "master": true,
      "desc": "관리 대상 부품(품번·품명) 목록입니다.",
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
          "key": "note",
          "label": "비고",
          "type": "text"
        },
        {
          "key": "files",
          "label": "사진 · 도면",
          "type": "file"
        }
      ],
      "records": [
        {"id": "r0698", "name": "도어래치 ASSY", "partno": "LAT-3290", "customer": "H사", "note": ""},
        {"id": "r0699", "name": "시트프레임", "partno": "SF-1150", "customer": "K사", "note": ""},
        {"id": "r0700", "name": "콘솔 커버", "partno": "CV-4400", "customer": "H사", "note": ""},
        {"id": "r0701", "name": "브라켓 BRK-1830", "partno": "BRK-1830", "customer": "G사", "note": ""},
        {"id": "r0702", "name": "힌지 ASSY", "partno": "HG-0920", "customer": "R사", "note": ""},
        {"id": "r0703", "name": "글로브박스", "partno": "GB-2200", "customer": "G사", "note": ""},
        {"id": "r0704", "name": "리어 브라켓", "partno": "BRK-2041", "customer": "H사", "note": ""},
        {"id": "r0705", "name": "암레스트", "partno": "AR-1100", "customer": "K사", "note": ""}
      ]
    },
    {
      "id": "defecttypes",
      "name": "불량 유형",
      "master": true,
      "desc": "클레임·불량 발생에서 고르는 불량 유형 목록입니다.",
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
            "외관",
            "기능",
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
        {"id": "r0706", "name": "작동 불량", "group": "기능", "note": ""},
        {"id": "r0707", "name": "외관 (스크래치·찍힘)", "group": "외관", "note": ""},
        {"id": "r0708", "name": "치수 불량", "group": "치수", "note": ""},
        {"id": "r0709", "name": "소음·진동", "group": "기능", "note": ""},
        {"id": "r0710", "name": "오조립·누락", "group": "조립", "note": ""},
        {"id": "r0711", "name": "기타", "group": "기타", "note": ""},
        {"id": "r0712", "name": "도장 핀홀·이물", "group": "외관", "note": ""},
        {"id": "r0713", "name": "용접 스패터", "group": "공정", "note": ""},
        {"id": "r0714", "name": "스크래치", "group": "외관", "note": ""},
        {"id": "r0715", "name": "치수 이탈", "group": "치수", "note": ""},
        {"id": "r0716", "name": "체결 불량", "group": "조립", "note": ""},
        {"id": "r0717", "name": "사출 수축", "group": "재질", "note": ""},
        {"id": "r0718", "name": "도금 박리", "group": "재질", "note": ""}
      ]
    },
    {
      "id": "vendors",
      "name": "협력사",
      "master": true,
      "desc": "부품 협력사 목록입니다. 협력사 평가에서 골라 씁니다.",
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
            "도금",
            "고무",
            "전장"
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
        }
      ],
      "records": [
        {"id": "r0719", "name": "A사", "process": "프레스", "owner": "박지훈", "note": ""},
        {"id": "r0720", "name": "B사", "process": "프레스", "owner": "박지훈", "note": ""},
        {"id": "r0721", "name": "C사", "process": "사출", "owner": "박지훈", "note": ""},
        {"id": "r0722", "name": "D사", "process": "사출", "owner": "박지훈", "note": ""},
        {"id": "r0723", "name": "F사", "process": "도금", "owner": "박지훈", "note": ""},
        {"id": "r0724", "name": "J사", "process": "사출", "owner": "박지훈", "note": ""},
        {"id": "r0725", "name": "E사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0726", "name": "G사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0727", "name": "H사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0728", "name": "K사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0729", "name": "L사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0730", "name": "M사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0731", "name": "N사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0732", "name": "P사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0733", "name": "Q사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0734", "name": "R사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0735", "name": "S사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0736", "name": "T사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0737", "name": "U사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0738", "name": "V사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0739", "name": "W사", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0740", "name": "가람산업", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0741", "name": "대성정밀", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0742", "name": "미래금속", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0743", "name": "세화테크", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0744", "name": "우진화학", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0745", "name": "한빛사출", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0746", "name": "동양도금", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0747", "name": "성원전자", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0748", "name": "태광고무", "process": "", "owner": "박지훈", "note": ""},
        {"id": "r0749", "name": "삼진프레스", "process": "", "owner": "박지훈", "note": ""}
      ]
    },
    {
      "id": "lines",
      "name": "생산 라인",
      "master": true,
      "desc": "공정 품질·Cpk에서 고르는 생산 라인 목록입니다.",
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
        {"id": "r0750", "name": "프레스 1", "process": "프레스", "note": ""},
        {"id": "r0751", "name": "프레스 2", "process": "프레스", "note": ""},
        {"id": "r0752", "name": "용접 1", "process": "용접", "note": ""},
        {"id": "r0753", "name": "용접 2", "process": "용접", "note": ""},
        {"id": "r0754", "name": "도장", "process": "도장", "note": ""},
        {"id": "r0755", "name": "조립 1", "process": "조립", "note": ""},
        {"id": "r0756", "name": "조립 2", "process": "조립", "note": ""}
      ]
    },
    {
      "id": "claims",
      "name": "고객 클레임",
      "desc": "완성차 고객사 클레임 접수부터 종결까지 기록합니다.",
      "dateField": "date",
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
          "req": true,
          "ref": "customers"
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
      "records": [
        {"id": "r0001", "no": "CL-26-001", "date": "2026-01-02", "customer": "G사", "part": "도어래치 ASSY", "type": "치수 불량", "qty": 3, "cost": 940, "owner": "이서연", "status": "완료", "closed": "2026-01-10"},
        {"id": "r0002", "no": "CL-26-002", "date": "2026-01-02", "customer": "기타", "part": "글로브박스", "type": "작동 불량", "qty": 40, "cost": 1490, "owner": "김민수", "status": "완료", "closed": "2026-01-14"},
        {"id": "r0003", "no": "CL-26-003", "date": "2026-01-05", "customer": "G사", "part": "암레스트", "type": "치수 불량", "qty": 20, "cost": 720, "owner": "박지훈", "status": "완료", "closed": "2026-01-21"},
        {"id": "r0004", "no": "CL-26-004", "date": "2026-01-06", "customer": "R사", "part": "브라켓 BRK-1830", "type": "작동 불량", "qty": 4, "cost": 1500, "owner": "이서연", "status": "완료", "closed": "2026-01-18"},
        {"id": "r0005", "no": "CL-26-005", "date": "2026-01-07", "customer": "H사", "part": "도어래치 ASSY", "type": "작동 불량", "qty": 3, "cost": 670, "owner": "박지훈", "status": "완료", "closed": "2026-01-21"},
        {"id": "r0006", "no": "CL-26-006", "date": "2026-01-07", "customer": "K사", "part": "도어래치 ASSY", "type": "기타", "qty": 12, "cost": 1340, "owner": "정하늘", "status": "완료", "closed": "2026-01-16"},
        {"id": "r0007", "no": "CL-26-007", "date": "2026-01-14", "customer": "기타", "part": "리어 브라켓", "type": "외관 (스크래치·찍힘)", "qty": 12, "cost": 910, "owner": "정하늘", "status": "완료", "closed": "2026-01-27"},
        {"id": "r0008", "no": "CL-26-008", "date": "2026-01-16", "customer": "기타", "part": "암레스트", "type": "작동 불량", "qty": 2, "cost": 790, "owner": "정하늘", "status": "완료", "closed": "2026-01-28"},
        {"id": "r0009", "no": "CL-26-009", "date": "2026-01-17", "customer": "H사", "part": "콘솔 커버", "type": "오조립·누락", "qty": 2, "cost": 390, "owner": "정하늘", "status": "완료", "closed": "2026-01-28"},
        {"id": "r0010", "no": "CL-26-010", "date": "2026-01-18", "customer": "R사", "part": "힌지 ASSY", "type": "외관 (스크래치·찍힘)", "qty": 5, "cost": 2300, "owner": "정하늘", "status": "완료", "closed": "2026-01-29"},
        {"id": "r0011", "no": "CL-26-011", "date": "2026-01-20", "customer": "H사", "part": "리어 브라켓", "type": "외관 (스크래치·찍힘)", "qty": 5, "cost": 380, "owner": "김민수", "status": "완료", "closed": "2026-01-30"},
        {"id": "r0012", "no": "CL-26-012", "date": "2026-01-20", "customer": "기타", "part": "도어래치 ASSY", "type": "작동 불량", "qty": 8, "cost": 1430, "owner": "이서연", "status": "완료", "closed": "2026-01-30"},
        {"id": "r0013", "no": "CL-26-013", "date": "2026-01-21", "customer": "H사", "part": "시트프레임", "type": "작동 불량", "qty": 3, "cost": 580, "owner": "이서연", "status": "완료", "closed": "2026-01-30"},
        {"id": "r0014", "no": "CL-26-014", "date": "2026-01-22", "customer": "R사", "part": "도어래치 ASSY", "type": "작동 불량", "qty": 12, "cost": 1120, "owner": "정하늘", "status": "완료", "closed": "2026-02-04"},
        {"id": "r0015", "no": "CL-26-015", "date": "2026-01-22", "customer": "R사", "part": "암레스트", "type": "외관 (스크래치·찍힘)", "qty": 4, "cost": 270, "owner": "박지훈", "status": "완료", "closed": "2026-02-06"},
        {"id": "r0016", "no": "CL-26-016", "date": "2026-01-24", "customer": "R사", "part": "도어래치 ASSY", "type": "오조립·누락", "qty": 8, "cost": 130, "owner": "김민수", "status": "완료", "closed": "2026-02-07"},
        {"id": "r0017", "no": "CL-26-017", "date": "2026-01-24", "customer": "기타", "part": "힌지 ASSY", "type": "외관 (스크래치·찍힘)", "qty": 8, "cost": 350, "owner": "정하늘", "status": "완료", "closed": "2026-02-06"},
        {"id": "r0018", "no": "CL-26-018", "date": "2026-01-25", "customer": "K사", "part": "시트프레임", "type": "오조립·누락", "qty": 20, "cost": 2180, "owner": "김민수", "status": "완료", "closed": "2026-01-28"},
        {"id": "r0019", "no": "CL-26-019", "date": "2026-01-25", "customer": "K사", "part": "시트프레임", "type": "작동 불량", "qty": 2, "cost": 1220, "owner": "박지훈", "status": "완료", "closed": "2026-02-08"},
        {"id": "r0020", "no": "CL-26-020", "date": "2026-01-30", "customer": "G사", "part": "브라켓 BRK-1830", "type": "소음·진동", "qty": 4, "cost": 50, "owner": "정하늘", "status": "완료", "closed": "2026-02-04"},
        {"id": "r0021", "no": "CL-26-021", "date": "2026-01-31", "customer": "K사", "part": "힌지 ASSY", "type": "작동 불량", "qty": 2, "cost": 900, "owner": "박지훈", "status": "완료", "closed": "2026-02-10"},
        {"id": "r0022", "no": "CL-26-022", "date": "2026-02-02", "customer": "K사", "part": "콘솔 커버", "type": "작동 불량", "qty": 2, "cost": 3990, "owner": "정하늘", "status": "완료", "closed": "2026-02-14"},
        {"id": "r0023", "no": "CL-26-023", "date": "2026-02-04", "customer": "H사", "part": "암레스트", "type": "오조립·누락", "qty": 2, "cost": 240, "owner": "박지훈", "status": "완료", "closed": "2026-02-15"},
        {"id": "r0024", "no": "CL-26-024", "date": "2026-02-05", "customer": "G사", "part": "콘솔 커버", "type": "치수 불량", "qty": 4, "cost": 660, "owner": "최유진", "status": "완료", "closed": "2026-02-21"},
        {"id": "r0025", "no": "CL-26-025", "date": "2026-02-08", "customer": "H사", "part": "글로브박스", "type": "치수 불량", "qty": 12, "cost": 650, "owner": "정하늘", "status": "완료", "closed": "2026-02-18"},
        {"id": "r0026", "no": "CL-26-026", "date": "2026-02-10", "customer": "R사", "part": "도어래치 ASSY", "type": "치수 불량", "qty": 8, "cost": 370, "owner": "김민수", "status": "완료", "closed": "2026-02-19"},
        {"id": "r0027", "no": "CL-26-027", "date": "2026-02-12", "customer": "H사", "part": "글로브박스", "type": "외관 (스크래치·찍힘)", "qty": 2, "cost": 430, "owner": "이서연", "status": "완료", "closed": "2026-02-22"},
        {"id": "r0028", "no": "CL-26-028", "date": "2026-02-15", "customer": "H사", "part": "콘솔 커버", "type": "치수 불량", "qty": 2, "cost": 1810, "owner": "최유진", "status": "완료", "closed": "2026-02-25"},
        {"id": "r0029", "no": "CL-26-029", "date": "2026-02-15", "customer": "K사", "part": "브라켓 BRK-1830", "type": "작동 불량", "qty": 4, "cost": 830, "owner": "이서연", "status": "완료", "closed": "2026-02-25"},
        {"id": "r0030", "no": "CL-26-030", "date": "2026-02-16", "customer": "K사", "part": "도어래치 ASSY", "type": "오조립·누락", "qty": 20, "cost": 130, "owner": "최유진", "status": "완료", "closed": "2026-02-27"},
        {"id": "r0031", "no": "CL-26-031", "date": "2026-02-16", "customer": "H사", "part": "리어 브라켓", "type": "외관 (스크래치·찍힘)", "qty": 12, "cost": 950, "owner": "박지훈", "status": "완료", "closed": "2026-02-25"},
        {"id": "r0032", "no": "CL-26-032", "date": "2026-02-18", "customer": "H사", "part": "리어 브라켓", "type": "외관 (스크래치·찍힘)", "qty": 12, "cost": 2070, "owner": "최유진", "status": "완료", "closed": "2026-02-27"},
        {"id": "r0033", "no": "CL-26-033", "date": "2026-02-19", "customer": "기타", "part": "힌지 ASSY", "type": "소음·진동", "qty": 2, "cost": 250, "owner": "이서연", "status": "완료", "closed": "2026-02-28"},
        {"id": "r0034", "no": "CL-26-034", "date": "2026-02-19", "customer": "H사", "part": "글로브박스", "type": "오조립·누락", "qty": 3, "cost": 630, "owner": "최유진", "status": "완료", "closed": "2026-03-04"},
        {"id": "r0035", "no": "CL-26-035", "date": "2026-02-20", "customer": "H사", "part": "힌지 ASSY", "type": "외관 (스크래치·찍힘)", "qty": 2, "cost": 610, "owner": "정하늘", "status": "완료", "closed": "2026-03-02"},
        {"id": "r0036", "no": "CL-26-036", "date": "2026-02-22", "customer": "G사", "part": "글로브박스", "type": "외관 (스크래치·찍힘)", "qty": 5, "cost": 160, "owner": "최유진", "status": "완료", "closed": "2026-03-06"},
        {"id": "r0037", "no": "CL-26-037", "date": "2026-02-24", "customer": "K사", "part": "시트프레임", "type": "외관 (스크래치·찍힘)", "qty": 1, "cost": 280, "owner": "박지훈", "status": "완료", "closed": "2026-03-04"},
        {"id": "r0038", "no": "CL-26-038", "date": "2026-02-25", "customer": "R사", "part": "암레스트", "type": "외관 (스크래치·찍힘)", "qty": 12, "cost": 790, "owner": "박지훈", "status": "완료", "closed": "2026-03-09"},
        {"id": "r0039", "no": "CL-26-039", "date": "2026-02-25", "customer": "R사", "part": "암레스트", "type": "치수 불량", "qty": 40, "cost": 440, "owner": "박지훈", "status": "완료", "closed": "2026-03-11"},
        {"id": "r0040", "no": "CL-26-040", "date": "2026-02-27", "customer": "H사", "part": "도어래치 ASSY", "type": "소음·진동", "qty": 8, "cost": 250, "owner": "이서연", "status": "완료", "closed": "2026-03-09"},
        {"id": "r0041", "no": "CL-26-041", "date": "2026-03-02", "customer": "기타", "part": "콘솔 커버", "type": "치수 불량", "qty": 5, "cost": 810, "owner": "박지훈", "status": "완료", "closed": "2026-03-11"},
        {"id": "r0042", "no": "CL-26-042", "date": "2026-03-03", "customer": "H사", "part": "힌지 ASSY", "type": "치수 불량", "qty": 12, "cost": 400, "owner": "정하늘", "status": "완료", "closed": "2026-03-12"},
        {"id": "r0043", "no": "CL-26-043", "date": "2026-03-04", "customer": "K사", "part": "시트프레임", "type": "치수 불량", "qty": 2, "cost": 470, "owner": "최유진", "status": "완료", "closed": "2026-03-17"},
        {"id": "r0044", "no": "CL-26-044", "date": "2026-03-08", "customer": "R사", "part": "힌지 ASSY", "type": "작동 불량", "qty": 8, "cost": 490, "owner": "정하늘", "status": "완료", "closed": "2026-03-18"},
        {"id": "r0045", "no": "CL-26-045", "date": "2026-03-08", "customer": "H사", "part": "리어 브라켓", "type": "외관 (스크래치·찍힘)", "qty": 2, "cost": 1660, "owner": "이서연", "status": "완료", "closed": "2026-03-18"},
        {"id": "r0046", "no": "CL-26-046", "date": "2026-03-10", "customer": "R사", "part": "글로브박스", "type": "작동 불량", "qty": 1, "cost": 850, "owner": "이서연", "status": "완료", "closed": "2026-03-24"},
        {"id": "r0047", "no": "CL-26-047", "date": "2026-03-10", "customer": "K사", "part": "콘솔 커버", "type": "작동 불량", "qty": 40, "cost": 150, "owner": "이서연", "status": "완료", "closed": "2026-03-24"},
        {"id": "r0048", "no": "CL-26-048", "date": "2026-03-14", "customer": "H사", "part": "시트프레임", "type": "치수 불량", "qty": 5, "cost": 1060, "owner": "정하늘", "status": "완료", "closed": "2026-03-28"},
        {"id": "r0049", "no": "CL-26-049", "date": "2026-03-14", "customer": "H사", "part": "글로브박스", "type": "오조립·누락", "qty": 8, "cost": 490, "owner": "최유진", "status": "완료", "closed": "2026-03-29"},
        {"id": "r0050", "no": "CL-26-050", "date": "2026-03-16", "customer": "R사", "part": "힌지 ASSY", "type": "외관 (스크래치·찍힘)", "qty": 2, "cost": 660, "owner": "김민수", "status": "완료", "closed": "2026-03-21"},
        {"id": "r0051", "no": "CL-26-051", "date": "2026-03-16", "customer": "R사", "part": "도어래치 ASSY", "type": "치수 불량", "qty": 2, "cost": 2340, "owner": "최유진", "status": "완료", "closed": "2026-03-29"},
        {"id": "r0052", "no": "CL-26-052", "date": "2026-03-16", "customer": "K사", "part": "힌지 ASSY", "type": "작동 불량", "qty": 5, "cost": 200, "owner": "김민수", "status": "완료", "closed": "2026-03-27"},
        {"id": "r0053", "no": "CL-26-053", "date": "2026-03-17", "customer": "H사", "part": "암레스트", "type": "외관 (스크래치·찍힘)", "qty": 40, "cost": 360, "owner": "최유진", "status": "완료", "closed": "2026-03-31"},
        {"id": "r0054", "no": "CL-26-054", "date": "2026-03-18", "customer": "H사", "part": "시트프레임", "type": "외관 (스크래치·찍힘)", "qty": 1, "cost": 280, "owner": "정하늘", "status": "완료", "closed": "2026-03-28"},
        {"id": "r0055", "no": "CL-26-055", "date": "2026-03-19", "customer": "G사", "part": "힌지 ASSY", "type": "작동 불량", "qty": 2, "cost": 1060, "owner": "이서연", "status": "완료", "closed": "2026-03-27"},
        {"id": "r0056", "no": "CL-26-056", "date": "2026-03-19", "customer": "기타", "part": "암레스트", "type": "치수 불량", "qty": 20, "cost": 920, "owner": "김민수", "status": "완료", "closed": "2026-03-26"},
        {"id": "r0057", "no": "CL-26-057", "date": "2026-03-22", "customer": "H사", "part": "힌지 ASSY", "type": "외관 (스크래치·찍힘)", "qty": 2, "cost": 430, "owner": "이서연", "status": "완료", "closed": "2026-03-26"},
        {"id": "r0058", "no": "CL-26-058", "date": "2026-03-23", "customer": "H사", "part": "도어래치 ASSY", "type": "작동 불량", "qty": 3, "cost": 1200, "owner": "김민수", "status": "완료", "closed": "2026-04-06"},
        {"id": "r0059", "no": "CL-26-059", "date": "2026-03-25", "customer": "K사", "part": "리어 브라켓", "type": "작동 불량", "qty": 20, "cost": 510, "owner": "정하늘", "status": "완료", "closed": "2026-04-10"},
        {"id": "r0060", "no": "CL-26-060", "date": "2026-03-26", "customer": "K사", "part": "도어래치 ASSY", "type": "치수 불량", "qty": 40, "cost": 530, "owner": "최유진", "status": "완료", "closed": "2026-04-10"},
        {"id": "r0061", "no": "CL-26-061", "date": "2026-03-27", "customer": "K사", "part": "힌지 ASSY", "type": "치수 불량", "qty": 4, "cost": 350, "owner": "김민수", "status": "완료", "closed": "2026-04-08"},
        {"id": "r0062", "no": "CL-26-062", "date": "2026-03-28", "customer": "K사", "part": "브라켓 BRK-1830", "type": "외관 (스크래치·찍힘)", "qty": 40, "cost": 360, "owner": "최유진", "status": "완료", "closed": "2026-04-11"},
        {"id": "r0063", "no": "CL-26-063", "date": "2026-03-30", "customer": "H사", "part": "리어 브라켓", "type": "소음·진동", "qty": 12, "cost": 340, "owner": "최유진", "status": "완료", "closed": "2026-04-12"},
        {"id": "r0064", "no": "CL-26-064", "date": "2026-04-01", "customer": "기타", "part": "힌지 ASSY", "type": "소음·진동", "qty": 4, "cost": 900, "owner": "최유진", "status": "완료", "closed": "2026-04-19"},
        {"id": "r0065", "no": "CL-26-065", "date": "2026-04-03", "customer": "K사", "part": "글로브박스", "type": "작동 불량", "qty": 12, "cost": 170, "owner": "박지훈", "status": "완료", "closed": "2026-04-13"},
        {"id": "r0066", "no": "CL-26-066", "date": "2026-04-04", "customer": "G사", "part": "리어 브라켓", "type": "작동 불량", "qty": 5, "cost": 750, "owner": "정하늘", "status": "완료", "closed": "2026-04-11"},
        {"id": "r0067", "no": "CL-26-067", "date": "2026-04-05", "customer": "K사", "part": "리어 브라켓", "type": "오조립·누락", "qty": 12, "cost": 950, "owner": "박지훈", "status": "완료", "closed": "2026-04-22"},
        {"id": "r0068", "no": "CL-26-068", "date": "2026-04-06", "customer": "H사", "part": "콘솔 커버", "type": "외관 (스크래치·찍힘)", "qty": 12, "cost": 410, "owner": "정하늘", "status": "완료", "closed": "2026-04-15"},
        {"id": "r0069", "no": "CL-26-069", "date": "2026-04-10", "customer": "H사", "part": "콘솔 커버", "type": "작동 불량", "qty": 4, "cost": 860, "owner": "최유진", "status": "완료", "closed": "2026-04-21"},
        {"id": "r0070", "no": "CL-26-070", "date": "2026-04-11", "customer": "H사", "part": "도어래치 ASSY", "type": "치수 불량", "qty": 8, "cost": 560, "owner": "정하늘", "status": "완료", "closed": "2026-04-19"},
        {"id": "r0071", "no": "CL-26-071", "date": "2026-04-12", "customer": "G사", "part": "브라켓 BRK-1830", "type": "오조립·누락", "qty": 8, "cost": 2270, "owner": "김민수", "status": "완료", "closed": "2026-04-26"},
        {"id": "r0072", "no": "CL-26-072", "date": "2026-04-13", "customer": "G사", "part": "글로브박스", "type": "치수 불량", "qty": 3, "cost": 1210, "owner": "박지훈", "status": "완료", "closed": "2026-04-25"},
        {"id": "r0073", "no": "CL-26-073", "date": "2026-04-13", "customer": "K사", "part": "콘솔 커버", "type": "치수 불량", "qty": 1, "cost": 520, "owner": "정하늘", "status": "완료", "closed": "2026-04-25"},
        {"id": "r0074", "no": "CL-26-074", "date": "2026-04-16", "customer": "K사", "part": "도어래치 ASSY", "type": "치수 불량", "qty": 20, "cost": 500, "owner": "김민수", "status": "완료", "closed": "2026-04-27"},
        {"id": "r0075", "no": "CL-26-075", "date": "2026-04-17", "customer": "기타", "part": "브라켓 BRK-1830", "type": "작동 불량", "qty": 3, "cost": 290, "owner": "최유진", "status": "완료", "closed": "2026-05-02"},
        {"id": "r0076", "no": "CL-26-076", "date": "2026-04-19", "customer": "K사", "part": "시트프레임", "type": "오조립·누락", "qty": 1, "cost": 240, "owner": "이서연", "status": "완료", "closed": "2026-04-30"},
        {"id": "r0077", "no": "CL-26-077", "date": "2026-04-20", "customer": "H사", "part": "콘솔 커버", "type": "외관 (스크래치·찍힘)", "qty": 5, "cost": 290, "owner": "최유진", "status": "완료", "closed": "2026-05-01"},
        {"id": "r0078", "no": "CL-26-078", "date": "2026-04-20", "customer": "K사", "part": "글로브박스", "type": "소음·진동", "qty": 4, "cost": 320, "owner": "박지훈", "status": "완료", "closed": "2026-05-03"},
        {"id": "r0079", "no": "CL-26-079", "date": "2026-04-21", "customer": "K사", "part": "브라켓 BRK-1830", "type": "소음·진동", "qty": 4, "cost": 220, "owner": "최유진", "status": "완료", "closed": "2026-04-29"},
        {"id": "r0080", "no": "CL-26-080", "date": "2026-04-25", "customer": "R사", "part": "콘솔 커버", "type": "외관 (스크래치·찍힘)", "qty": 12, "cost": 990, "owner": "이서연", "status": "완료", "closed": "2026-04-28"},
        {"id": "r0081", "no": "CL-26-081", "date": "2026-04-26", "customer": "H사", "part": "리어 브라켓", "type": "치수 불량", "qty": 20, "cost": 210, "owner": "정하늘", "status": "완료", "closed": "2026-05-09"},
        {"id": "r0082", "no": "CL-26-082", "date": "2026-05-01", "customer": "R사", "part": "암레스트", "type": "소음·진동", "qty": 5, "cost": 860, "owner": "정하늘", "status": "완료", "closed": "2026-05-15"},
        {"id": "r0083", "no": "CL-26-083", "date": "2026-05-02", "customer": "H사", "part": "힌지 ASSY", "type": "작동 불량", "qty": 12, "cost": 740, "owner": "김민수", "status": "완료", "closed": "2026-05-12"},
        {"id": "r0084", "no": "CL-26-084", "date": "2026-05-06", "customer": "기타", "part": "암레스트", "type": "외관 (스크래치·찍힘)", "qty": 8, "cost": 510, "owner": "최유진", "status": "완료", "closed": "2026-05-19"},
        {"id": "r0085", "no": "CL-26-085", "date": "2026-05-06", "customer": "R사", "part": "암레스트", "type": "치수 불량", "qty": 20, "cost": 1400, "owner": "정하늘", "status": "완료", "closed": "2026-05-10"},
        {"id": "r0086", "no": "CL-26-086", "date": "2026-05-06", "customer": "K사", "part": "콘솔 커버", "type": "오조립·누락", "qty": 40, "cost": 2650, "owner": "박지훈", "status": "완료", "closed": "2026-05-23"},
        {"id": "r0087", "no": "CL-26-087", "date": "2026-05-07", "customer": "기타", "part": "콘솔 커버", "type": "오조립·누락", "qty": 40, "cost": 700, "owner": "박지훈", "status": "완료", "closed": "2026-05-22"},
        {"id": "r0088", "no": "CL-26-088", "date": "2026-05-16", "customer": "H사", "part": "브라켓 BRK-1830", "type": "치수 불량", "qty": 12, "cost": 1350, "owner": "김민수", "status": "완료", "closed": "2026-05-29"},
        {"id": "r0089", "no": "CL-26-089", "date": "2026-05-17", "customer": "H사", "part": "힌지 ASSY", "type": "외관 (스크래치·찍힘)", "qty": 40, "cost": 720, "owner": "김민수", "status": "완료", "closed": "2026-05-29"},
        {"id": "r0090", "no": "CL-26-090", "date": "2026-05-18", "customer": "R사", "part": "콘솔 커버", "type": "작동 불량", "qty": 20, "cost": 1390, "owner": "이서연", "status": "완료", "closed": "2026-05-31"},
        {"id": "r0091", "no": "CL-26-091", "date": "2026-05-19", "customer": "기타", "part": "힌지 ASSY", "type": "소음·진동", "qty": 3, "cost": 620, "owner": "정하늘", "status": "완료", "closed": "2026-05-26"},
        {"id": "r0092", "no": "CL-26-092", "date": "2026-05-23", "customer": "H사", "part": "도어래치 ASSY", "type": "치수 불량", "qty": 2, "cost": 800, "owner": "최유진", "status": "완료", "closed": "2026-06-02"},
        {"id": "r0093", "no": "CL-26-093", "date": "2026-05-24", "customer": "R사", "part": "글로브박스", "type": "기타", "qty": 5, "cost": 280, "owner": "정하늘", "status": "완료", "closed": "2026-06-05"},
        {"id": "r0094", "no": "CL-26-094", "date": "2026-05-24", "customer": "G사", "part": "브라켓 BRK-1830", "type": "기타", "qty": 40, "cost": 1140, "owner": "이서연", "status": "완료", "closed": "2026-06-08"},
        {"id": "r0095", "no": "CL-26-095", "date": "2026-05-25", "customer": "기타", "part": "리어 브라켓", "type": "오조립·누락", "qty": 12, "cost": 310, "owner": "이서연", "status": "완료", "closed": "2026-06-03"},
        {"id": "r0096", "no": "CL-26-096", "date": "2026-05-26", "customer": "H사", "part": "암레스트", "type": "작동 불량", "qty": 5, "cost": 460, "owner": "김민수", "status": "완료", "closed": "2026-06-04"},
        {"id": "r0097", "no": "CL-26-097", "date": "2026-05-28", "customer": "K사", "part": "힌지 ASSY", "type": "치수 불량", "qty": 8, "cost": 1850, "owner": "최유진", "status": "완료", "closed": "2026-06-07"},
        {"id": "r0098", "no": "CL-26-098", "date": "2026-05-30", "customer": "R사", "part": "브라켓 BRK-1830", "type": "오조립·누락", "qty": 2, "cost": 360, "owner": "정하늘", "status": "완료", "closed": "2026-06-07"},
        {"id": "r0099", "no": "CL-26-099", "date": "2026-06-01", "customer": "K사", "part": "시트프레임", "type": "작동 불량", "qty": 40, "cost": 570, "owner": "김민수", "status": "완료", "closed": "2026-06-11"},
        {"id": "r0100", "no": "CL-26-100", "date": "2026-06-01", "customer": "K사", "part": "도어래치 ASSY", "type": "치수 불량", "qty": 4, "cost": 370, "owner": "최유진", "status": "완료", "closed": "2026-06-15"},
        {"id": "r0101", "no": "CL-26-101", "date": "2026-06-02", "customer": "R사", "part": "브라켓 BRK-1830", "type": "외관 (스크래치·찍힘)", "qty": 3, "cost": 370, "owner": "김민수", "status": "완료", "closed": "2026-06-09"},
        {"id": "r0102", "no": "CL-26-102", "date": "2026-06-03", "customer": "H사", "part": "힌지 ASSY", "type": "작동 불량", "qty": 8, "cost": 1170, "owner": "김민수", "status": "완료", "closed": "2026-06-09"},
        {"id": "r0103", "no": "CL-26-103", "date": "2026-06-05", "customer": "K사", "part": "힌지 ASSY", "type": "오조립·누락", "qty": 12, "cost": 1550, "owner": "이서연", "status": "완료", "closed": "2026-06-20"},
        {"id": "r0104", "no": "CL-26-104", "date": "2026-06-05", "customer": "H사", "part": "브라켓 BRK-1830", "type": "외관 (스크래치·찍힘)", "qty": 4, "cost": 1670, "owner": "정하늘", "status": "완료", "closed": "2026-06-12"},
        {"id": "r0105", "no": "CL-26-105", "date": "2026-06-10", "customer": "R사", "part": "콘솔 커버", "type": "작동 불량", "qty": 8, "cost": 550, "owner": "정하늘", "status": "완료", "closed": "2026-06-22"},
        {"id": "r0106", "no": "CL-26-106", "date": "2026-06-11", "customer": "G사", "part": "브라켓 BRK-1830", "type": "작동 불량", "qty": 20, "cost": 720, "owner": "정하늘", "status": "완료", "closed": "2026-06-21"},
        {"id": "r0107", "no": "CL-26-107", "date": "2026-06-14", "customer": "H사", "part": "힌지 ASSY", "type": "기타", "qty": 5, "cost": 390, "owner": "이서연", "status": "완료", "closed": "2026-06-24"},
        {"id": "r0108", "no": "CL-26-108", "date": "2026-06-15", "customer": "R사", "part": "브라켓 BRK-1830", "type": "소음·진동", "qty": 40, "cost": 440, "owner": "정하늘", "status": "완료", "closed": "2026-06-22"},
        {"id": "r0109", "no": "CL-26-109", "date": "2026-06-18", "customer": "H사", "part": "시트프레임", "type": "치수 불량", "qty": 1, "cost": 930, "owner": "이서연", "status": "완료", "closed": "2026-06-29"},
        {"id": "r0110", "no": "CL-26-110", "date": "2026-06-19", "customer": "H사", "part": "리어 브라켓", "type": "치수 불량", "qty": 8, "cost": 290, "owner": "최유진", "status": "완료", "closed": "2026-06-29"},
        {"id": "r0111", "no": "CL-26-111", "date": "2026-06-20", "customer": "K사", "part": "콘솔 커버", "type": "외관 (스크래치·찍힘)", "qty": 40, "cost": 600, "owner": "이서연", "status": "완료", "closed": "2026-07-02"},
        {"id": "r0112", "no": "CL-26-112", "date": "2026-06-20", "customer": "H사", "part": "도어래치 ASSY", "type": "치수 불량", "qty": 2, "cost": 410, "owner": "정하늘", "status": "완료", "closed": "2026-06-29"},
        {"id": "r0113", "no": "CL-26-113", "date": "2026-06-21", "customer": "H사", "part": "힌지 ASSY", "type": "소음·진동", "qty": 1, "cost": 210, "owner": "이서연", "status": "완료", "closed": "2026-06-30"},
        {"id": "r0114", "no": "CL-26-114", "date": "2026-06-26", "customer": "K사", "part": "리어 브라켓", "type": "소음·진동", "qty": 4, "cost": 770, "owner": "최유진", "status": "완료", "closed": "2026-07-01"},
        {"id": "r0115", "no": "CL-26-115", "date": "2026-06-27", "customer": "H사", "part": "시트프레임", "type": "치수 불량", "qty": 1, "cost": 380, "owner": "이서연", "status": "완료", "closed": "2026-07-10"},
        {"id": "r0116", "no": "CL-26-116", "date": "2026-06-28", "customer": "H사", "part": "시트프레임", "type": "오조립·누락", "qty": 3, "cost": 1320, "owner": "박지훈", "status": "완료", "closed": "2026-07-07"},
        {"id": "r0117", "no": "CL-26-117", "date": "2026-06-29", "customer": "기타", "part": "도어래치 ASSY", "type": "기타", "qty": 4, "cost": 570, "owner": "박지훈", "status": "완료", "closed": "2026-07-14"},
        {"id": "r0118", "no": "CL-26-118", "date": "2026-06-29", "customer": "H사", "part": "리어 브라켓", "type": "기타", "qty": 4, "cost": 160, "owner": "정하늘", "status": "완료", "closed": "2026-07-13"},
        {"id": "r0119", "no": "CL-26-119", "date": "2026-07-02", "customer": "G사", "part": "암레스트", "type": "작동 불량", "qty": 4, "cost": 310, "owner": "정하늘", "status": "완료", "closed": "2026-07-13"},
        {"id": "r0120", "no": "CL-26-120", "date": "2026-07-03", "customer": "K사", "part": "암레스트", "type": "소음·진동", "qty": 20, "cost": 120, "owner": "박지훈", "status": "완료", "closed": "2026-07-12"},
        {"id": "r0121", "no": "CL-26-121", "date": "2026-07-04", "customer": "K사", "part": "암레스트", "type": "작동 불량", "qty": 5, "cost": 240, "owner": "최유진", "status": "완료", "closed": "2026-07-16"},
        {"id": "r0122", "no": "CL-26-122", "date": "2026-07-07", "customer": "H사", "part": "콘솔 커버", "type": "오조립·누락", "qty": 4, "cost": 510, "owner": "최유진", "status": "완료", "closed": "2026-07-22"},
        {"id": "r0123", "no": "CL-26-123", "date": "2026-07-08", "customer": "K사", "part": "리어 브라켓", "type": "작동 불량", "qty": 40, "cost": 670, "owner": "박지훈", "status": "완료", "closed": "2026-07-17"},
        {"id": "r0124", "no": "CL-26-124", "date": "2026-07-11", "customer": "기타", "part": "콘솔 커버", "type": "기타", "qty": 20, "cost": 2550, "owner": "이서연", "status": "완료", "closed": "2026-07-25"},
        {"id": "r0125", "no": "CL-26-125", "date": "2026-07-14", "customer": "H사", "part": "힌지 ASSY", "type": "외관 (스크래치·찍힘)", "qty": 4, "cost": 8070, "owner": "박지훈", "status": "완료", "closed": "2026-07-21"},
        {"id": "r0126", "no": "CL-26-126", "date": "2026-07-18", "customer": "K사", "part": "암레스트", "type": "외관 (스크래치·찍힘)", "qty": 8, "cost": 230, "owner": "박지훈", "status": "완료", "closed": "2026-07-30"},
        {"id": "r0127", "no": "CL-26-127", "date": "2026-07-18", "customer": "K사", "part": "리어 브라켓", "type": "작동 불량", "qty": 12, "cost": 6120, "owner": "이서연", "status": "완료", "closed": "2026-07-26"},
        {"id": "r0128", "no": "CL-26-128", "date": "2026-07-20", "customer": "H사", "part": "시트프레임", "type": "작동 불량", "qty": 2, "cost": 400, "owner": "최유진", "status": "완료", "closed": "2026-08-01"},
        {"id": "r0129", "no": "CL-26-129", "date": "2026-07-20", "customer": "K사", "part": "브라켓 BRK-1830", "type": "외관 (스크래치·찍힘)", "qty": 5, "cost": 950, "owner": "이서연", "status": "완료", "closed": "2026-07-25"},
        {"id": "r0130", "no": "CL-26-130", "date": "2026-07-21", "customer": "H사", "part": "시트프레임", "type": "외관 (스크래치·찍힘)", "qty": 8, "cost": 560, "owner": "박지훈", "status": "완료", "closed": "2026-07-30"},
        {"id": "r0131", "no": "CL-26-131", "date": "2026-07-21", "customer": "H사", "part": "암레스트", "type": "소음·진동", "qty": 4, "cost": 530, "owner": "최유진", "status": "완료", "closed": "2026-08-01"},
        {"id": "r0132", "no": "CL-26-132", "date": "2026-07-22", "customer": "K사", "part": "글로브박스", "type": "치수 불량", "qty": 2, "cost": 400, "owner": "정하늘", "status": "완료", "closed": "2026-07-26"},
        {"id": "r0133", "no": "CL-26-133", "date": "2026-07-27", "customer": "기타", "part": "암레스트", "type": "작동 불량", "qty": 40, "cost": 480, "owner": "박지훈", "status": "완료", "closed": "2026-08-07"},
        {"id": "r0134", "no": "CL-26-134", "date": "2026-07-30", "customer": "R사", "part": "암레스트", "type": "외관 (스크래치·찍힘)", "qty": 20, "cost": 690, "owner": "정하늘", "status": "완료", "closed": "2026-08-12"},
        {"id": "r0135", "no": "CL-26-135", "date": "2026-07-30", "customer": "기타", "part": "브라켓 BRK-1830", "type": "작동 불량", "qty": 2, "cost": 230, "owner": "최유진", "status": "완료", "closed": "2026-08-06"},
        {"id": "r0136", "no": "CL-26-136", "date": "2026-08-03", "customer": "R사", "part": "시트프레임", "type": "작동 불량", "qty": 2, "cost": 820, "owner": "최유진", "status": "완료", "closed": "2026-08-15"},
        {"id": "r0137", "no": "CL-26-137", "date": "2026-08-04", "customer": "H사", "part": "글로브박스", "type": "오조립·누락", "qty": 8, "cost": 470, "owner": "정하늘", "status": "완료", "closed": "2026-08-16"},
        {"id": "r0138", "no": "CL-26-138", "date": "2026-08-07", "customer": "G사", "part": "시트프레임", "type": "외관 (스크래치·찍힘)", "qty": 2, "cost": 780, "owner": "최유진", "status": "완료", "closed": "2026-08-11"},
        {"id": "r0139", "no": "CL-26-139", "date": "2026-08-08", "customer": "H사", "part": "글로브박스", "type": "외관 (스크래치·찍힘)", "qty": 40, "cost": 340, "owner": "김민수", "status": "완료", "closed": "2026-08-12"},
        {"id": "r0140", "no": "CL-26-140", "date": "2026-08-09", "customer": "G사", "part": "리어 브라켓", "type": "치수 불량", "qty": 8, "cost": 380, "owner": "이서연", "status": "완료", "closed": "2026-08-26"},
        {"id": "r0141", "no": "CL-26-141", "date": "2026-08-10", "customer": "H사", "part": "글로브박스", "type": "기타", "qty": 4, "cost": 330, "owner": "박지훈", "status": "완료", "closed": "2026-08-20"},
        {"id": "r0142", "no": "CL-26-142", "date": "2026-08-11", "customer": "R사", "part": "글로브박스", "type": "오조립·누락", "qty": 2, "cost": 1180, "owner": "정하늘", "status": "완료", "closed": "2026-08-20"},
        {"id": "r0143", "no": "CL-26-143", "date": "2026-08-15", "customer": "K사", "part": "브라켓 BRK-1830", "type": "작동 불량", "qty": 20, "cost": 1550, "owner": "김민수", "status": "완료", "closed": "2026-09-02"},
        {"id": "r0144", "no": "CL-26-144", "date": "2026-08-17", "customer": "H사", "part": "콘솔 커버", "type": "치수 불량", "qty": 20, "cost": 640, "owner": "이서연", "status": "완료", "closed": "2026-08-25"},
        {"id": "r0145", "no": "CL-26-145", "date": "2026-08-17", "customer": "H사", "part": "힌지 ASSY", "type": "작동 불량", "qty": 12, "cost": 610, "owner": "이서연", "status": "완료", "closed": "2026-08-24"},
        {"id": "r0146", "no": "CL-26-146", "date": "2026-08-18", "customer": "G사", "part": "도어래치 ASSY", "type": "치수 불량", "qty": 20, "cost": 390, "owner": "김민수", "status": "완료", "closed": "2026-08-30"},
        {"id": "r0147", "no": "CL-26-147", "date": "2026-08-20", "customer": "H사", "part": "브라켓 BRK-1830", "type": "작동 불량", "qty": 20, "cost": 750, "owner": "최유진", "status": "완료", "closed": "2026-08-30"},
        {"id": "r0148", "no": "CL-26-148", "date": "2026-08-22", "customer": "H사", "part": "글로브박스", "type": "작동 불량", "qty": 40, "cost": 240, "owner": "최유진", "status": "완료", "closed": "2026-09-02"},
        {"id": "r0149", "no": "CL-26-149", "date": "2026-08-22", "customer": "K사", "part": "리어 브라켓", "type": "작동 불량", "qty": 12, "cost": 310, "owner": "김민수", "status": "완료", "closed": "2026-08-30"},
        {"id": "r0150", "no": "CL-26-150", "date": "2026-08-24", "customer": "K사", "part": "암레스트", "type": "소음·진동", "qty": 20, "cost": 1000, "owner": "최유진", "status": "완료", "closed": "2026-09-01"},
        {"id": "r0151", "no": "CL-26-151", "date": "2026-08-27", "customer": "H사", "part": "리어 브라켓", "type": "작동 불량", "qty": 8, "cost": 1010, "owner": "정하늘", "status": "완료", "closed": "2026-09-08"},
        {"id": "r0152", "no": "CL-26-152", "date": "2026-09-02", "customer": "H사", "part": "시트프레임", "type": "소음·진동", "qty": 4, "cost": 1220, "owner": "박지훈", "status": "완료", "closed": "2026-09-12"},
        {"id": "r0153", "no": "CL-26-153", "date": "2026-09-02", "customer": "H사", "part": "브라켓 BRK-1830", "type": "작동 불량", "qty": 20, "cost": 500, "owner": "박지훈", "status": "완료", "closed": "2026-09-19"},
        {"id": "r0154", "no": "CL-26-154", "date": "2026-09-06", "customer": "K사", "part": "암레스트", "type": "오조립·누락", "qty": 1, "cost": 310, "owner": "정하늘", "status": "완료", "closed": "2026-09-16"},
        {"id": "r0155", "no": "CL-26-155", "date": "2026-09-08", "customer": "R사", "part": "콘솔 커버", "type": "외관 (스크래치·찍힘)", "qty": 12, "cost": 260, "owner": "이서연", "status": "완료", "closed": "2026-09-24"},
        {"id": "r0156", "no": "CL-26-156", "date": "2026-09-09", "customer": "K사", "part": "글로브박스", "type": "기타", "qty": 3, "cost": 310, "owner": "최유진", "status": "완료", "closed": "2026-09-16"},
        {"id": "r0157", "no": "CL-26-157", "date": "2026-09-09", "customer": "H사", "part": "힌지 ASSY", "type": "치수 불량", "qty": 3, "cost": 3260, "owner": "김민수", "status": "완료", "closed": "2026-09-19"},
        {"id": "r0158", "no": "CL-26-158", "date": "2026-09-11", "customer": "R사", "part": "리어 브라켓", "type": "외관 (스크래치·찍힘)", "qty": 1, "cost": 260, "owner": "정하늘", "status": "완료", "closed": "2026-09-24"},
        {"id": "r0159", "no": "CL-26-159", "date": "2026-09-15", "customer": "H사", "part": "힌지 ASSY", "type": "외관 (스크래치·찍힘)", "qty": 2, "cost": 370, "owner": "이서연", "status": "완료", "closed": "2026-10-03"},
        {"id": "r0160", "no": "CL-26-160", "date": "2026-09-17", "customer": "G사", "part": "시트프레임", "type": "소음·진동", "qty": 1, "cost": 780, "owner": "최유진", "status": "완료", "closed": "2026-09-29"},
        {"id": "r0161", "no": "CL-26-161", "date": "2026-09-18", "customer": "H사", "part": "도어래치 ASSY", "type": "치수 불량", "qty": 20, "cost": 500, "owner": "정하늘", "status": "완료", "closed": "2026-10-01"},
        {"id": "r0162", "no": "CL-26-162", "date": "2026-09-19", "customer": "H사", "part": "시트프레임", "type": "외관 (스크래치·찍힘)", "qty": 8, "cost": 670, "owner": "정하늘", "status": "접수", "closed": ""},
        {"id": "r0163", "no": "CL-26-163", "date": "2026-09-19", "customer": "G사", "part": "도어래치 ASSY", "type": "작동 불량", "qty": 40, "cost": 2430, "owner": "최유진", "status": "완료", "closed": "2026-10-04"},
        {"id": "r0164", "no": "CL-26-164", "date": "2026-09-23", "customer": "H사", "part": "힌지 ASSY", "type": "작동 불량", "qty": 1, "cost": 740, "owner": "정하늘", "status": "접수", "closed": ""},
        {"id": "r0165", "no": "CL-26-165", "date": "2026-09-25", "customer": "H사", "part": "브라켓 BRK-1830", "type": "외관 (스크래치·찍힘)", "qty": 3, "cost": 900, "owner": "정하늘", "status": "완료", "closed": "2026-10-08"},
        {"id": "r0166", "no": "CL-26-166", "date": "2026-09-29", "customer": "기타", "part": "도어래치 ASSY", "type": "작동 불량", "qty": 2, "cost": 170, "owner": "김민수", "status": "조사중", "closed": ""},
        {"id": "r0167", "no": "CL-26-167", "date": "2026-09-29", "customer": "R사", "part": "글로브박스", "type": "작동 불량", "qty": 2, "cost": 1410, "owner": "김민수", "status": "완료", "closed": "2026-10-04"},
        {"id": "r0168", "no": "CL-26-168", "date": "2026-09-29", "customer": "G사", "part": "글로브박스", "type": "치수 불량", "qty": 20, "cost": 3170, "owner": "정하늘", "status": "완료", "closed": "2026-10-07"},
        {"id": "r0169", "no": "CL-26-169", "date": "2026-10-01", "customer": "R사", "part": "힌지 ASSY", "type": "치수 불량", "qty": 40, "cost": 880, "owner": "최유진", "status": "대책수립", "closed": ""},
        {"id": "r0170", "no": "CL-26-170", "date": "2026-10-02", "customer": "K사", "part": "리어 브라켓", "type": "작동 불량", "qty": 5, "cost": 840, "owner": "김민수", "status": "접수", "closed": ""},
        {"id": "r0171", "no": "CL-26-171", "date": "2026-10-03", "customer": "H사", "part": "리어 브라켓", "type": "외관 (스크래치·찍힘)", "qty": 20, "cost": 500, "owner": "정하늘", "status": "접수", "closed": ""},
        {"id": "r0172", "no": "CL-26-172", "date": "2026-10-04", "customer": "H사", "part": "브라켓 BRK-1830", "type": "치수 불량", "qty": 20, "cost": 1060, "owner": "최유진", "status": "조사중", "closed": ""},
        {"id": "r0173", "no": "CL-26-173", "date": "2026-10-05", "customer": "기타", "part": "암레스트", "type": "외관 (스크래치·찍힘)", "qty": 4, "cost": 580, "owner": "박지훈", "status": "접수", "closed": ""}
      ],
      "titleField": "no"
    },
    {
      "id": "capa",
      "name": "8D / 시정조치",
      "desc": "8D 리포트와 시정·예방조치 진행을 기록합니다.",
      "dateField": "issued",
      "fields": [
        {
          "key": "no",
          "label": "8D 번호",
          "type": "text",
          "auto": "8D-{YY}-",
          "req": true
        },
        {
          "key": "issued",
          "label": "발행일",
          "type": "date",
          "req": true
        },
        {
          "key": "subject",
          "label": "건명",
          "type": "text",
          "req": true
        },
        {
          "key": "source",
          "label": "발생 구분",
          "type": "select",
          "options": [
            "고객 클레임",
            "공정 불량",
            "입고 불량"
          ]
        },
        {
          "key": "partner",
          "label": "고객사/협력사/라인",
          "type": "select",
          "options": [
            "H사",
            "K사",
            "G사",
            "R사",
            "프레스 2",
            "용접 1",
            "도장",
            "조립 1",
            "C사",
            "D사",
            "F사",
            "J사"
          ]
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
          "key": "owner",
          "label": "담당",
          "type": "ref",
          "ref": "people"
        },
        {
          "key": "due",
          "label": "기한",
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
        {"id": "r0174", "no": "8D-26-001", "issued": "2026-01-15", "subject": "용접 1 금형 버(Burr) 발생", "source": "공정 불량", "partner": "용접 1", "step": "D8 완료", "owner": "김민수", "due": "2026-02-05", "status": "완료", "closed": "2026-02-15"},
        {"id": "r0175", "no": "8D-26-002", "issued": "2026-01-03", "subject": "H사 사출 수축", "source": "고객 클레임", "partner": "H사", "step": "D8 완료", "owner": "김민수", "due": "2026-01-24", "status": "완료", "closed": "2026-02-04"},
        {"id": "r0176", "no": "8D-26-003", "issued": "2026-01-26", "subject": "프레스 2 시트프레임 용접 불량", "source": "공정 불량", "partner": "프레스 2", "step": "D8 완료", "owner": "김민수", "due": "2026-02-16", "status": "완료", "closed": "2026-02-15"},
        {"id": "r0177", "no": "8D-26-004", "issued": "2026-02-07", "subject": "F사 라벨 오부착", "source": "입고 불량", "partner": "F사", "step": "D8 완료", "owner": "김민수", "due": "2026-02-28", "status": "완료", "closed": "2026-02-19"},
        {"id": "r0178", "no": "8D-26-005", "issued": "2026-02-28", "subject": "H사 볼트 체결 누락", "source": "고객 클레임", "partner": "H사", "step": "D8 완료", "owner": "박지훈", "due": "2026-03-21", "status": "완료", "closed": "2026-03-30"},
        {"id": "r0179", "no": "8D-26-006", "issued": "2026-02-11", "subject": "G사 라벨 오부착", "source": "고객 클레임", "partner": "G사", "step": "D8 완료", "owner": "이서연", "due": "2026-03-04", "status": "완료", "closed": "2026-03-03"},
        {"id": "r0180", "no": "8D-26-007", "issued": "2026-02-20", "subject": "K사 브라켓 치수 이탈", "source": "고객 클레임", "partner": "K사", "step": "D8 완료", "owner": "김민수", "due": "2026-03-13", "status": "완료", "closed": "2026-03-06"},
        {"id": "r0181", "no": "8D-26-008", "issued": "2026-03-26", "subject": "D사 힌지 소음", "source": "입고 불량", "partner": "D사", "step": "D8 완료", "owner": "김민수", "due": "2026-04-16", "status": "완료", "closed": "2026-04-09"},
        {"id": "r0182", "no": "8D-26-009", "issued": "2026-03-19", "subject": "G사 라벨 오부착", "source": "고객 클레임", "partner": "G사", "step": "D8 완료", "owner": "박지훈", "due": "2026-04-09", "status": "완료", "closed": "2026-04-04"},
        {"id": "r0183", "no": "8D-26-010", "issued": "2026-03-15", "subject": "F사 라벨 오부착", "source": "입고 불량", "partner": "F사", "step": "D8 완료", "owner": "김민수", "due": "2026-04-05", "status": "완료", "closed": "2026-04-07"},
        {"id": "r0184", "no": "8D-26-011", "issued": "2026-03-13", "subject": "D사 라벨 오부착", "source": "입고 불량", "partner": "D사", "step": "D8 완료", "owner": "정하늘", "due": "2026-04-03", "status": "완료", "closed": "2026-04-05"},
        {"id": "r0185", "no": "8D-26-012", "issued": "2026-04-04", "subject": "조립 1 용접 스패터 과다", "source": "공정 불량", "partner": "조립 1", "step": "D8 완료", "owner": "이서연", "due": "2026-04-25", "status": "완료", "closed": "2026-05-01"},
        {"id": "r0186", "no": "8D-26-013", "issued": "2026-04-26", "subject": "F사 콘솔 커버 스크래치", "source": "입고 불량", "partner": "F사", "step": "D8 완료", "owner": "김민수", "due": "2026-05-17", "status": "완료", "closed": "2026-05-11"},
        {"id": "r0187", "no": "8D-26-014", "issued": "2026-04-11", "subject": "용접 1 콘솔 커버 스크래치", "source": "공정 불량", "partner": "용접 1", "step": "D8 완료", "owner": "정하늘", "due": "2026-05-02", "status": "완료", "closed": "2026-04-30"},
        {"id": "r0188", "no": "8D-26-015", "issued": "2026-05-01", "subject": "도장 도금 박리", "source": "공정 불량", "partner": "도장", "step": "D8 완료", "owner": "박지훈", "due": "2026-05-22", "status": "완료", "closed": "2026-05-21"},
        {"id": "r0189", "no": "8D-26-016", "issued": "2026-05-06", "subject": "조립 1 볼트 체결 누락", "source": "공정 불량", "partner": "조립 1", "step": "D8 완료", "owner": "김민수", "due": "2026-05-27", "status": "완료", "closed": "2026-06-06"},
        {"id": "r0190", "no": "8D-26-017", "issued": "2026-05-04", "subject": "도장 도장 핀홀", "source": "공정 불량", "partner": "도장", "step": "D8 완료", "owner": "최유진", "due": "2026-05-25", "status": "완료", "closed": "2026-05-28"},
        {"id": "r0191", "no": "8D-26-018", "issued": "2026-06-08", "subject": "K사 콘솔 커버 스크래치", "source": "고객 클레임", "partner": "K사", "step": "D8 완료", "owner": "최유진", "due": "2026-06-29", "status": "완료", "closed": "2026-06-29"},
        {"id": "r0192", "no": "8D-26-019", "issued": "2026-06-05", "subject": "K사 도장 핀홀", "source": "고객 클레임", "partner": "K사", "step": "D8 완료", "owner": "이서연", "due": "2026-06-26", "status": "완료", "closed": "2026-07-06"},
        {"id": "r0193", "no": "8D-26-020", "issued": "2026-06-21", "subject": "D사 도장 핀홀", "source": "입고 불량", "partner": "D사", "step": "D8 완료", "owner": "최유진", "due": "2026-07-12", "status": "완료", "closed": "2026-07-18"},
        {"id": "r0194", "no": "8D-26-021", "issued": "2026-06-21", "subject": "조립 1 용접 스패터 과다", "source": "공정 불량", "partner": "조립 1", "step": "D8 완료", "owner": "박지훈", "due": "2026-07-12", "status": "완료", "closed": "2026-07-14"},
        {"id": "r0195", "no": "8D-26-022", "issued": "2026-07-29", "subject": "R사 도어래치 작동불량", "source": "고객 클레임", "partner": "R사", "step": "D8 완료", "owner": "정하늘", "due": "2026-08-19", "status": "완료", "closed": "2026-08-24"},
        {"id": "r0196", "no": "8D-26-023", "issued": "2026-07-28", "subject": "K사 시트프레임 용접 불량", "source": "고객 클레임", "partner": "K사", "step": "D8 완료", "owner": "박지훈", "due": "2026-08-18", "status": "완료", "closed": "2026-08-17"},
        {"id": "r0197", "no": "8D-26-024", "issued": "2026-07-20", "subject": "K사 도장 핀홀", "source": "고객 클레임", "partner": "K사", "step": "D8 완료", "owner": "정하늘", "due": "2026-08-10", "status": "완료", "closed": "2026-08-09"},
        {"id": "r0198", "no": "8D-26-025", "issued": "2026-07-23", "subject": "D사 시트프레임 용접 불량", "source": "입고 불량", "partner": "D사", "step": "D8 완료", "owner": "김민수", "due": "2026-08-13", "status": "완료", "closed": "2026-08-02"},
        {"id": "r0199", "no": "8D-26-026", "issued": "2026-08-16", "subject": "도장 볼트 체결 누락", "source": "공정 불량", "partner": "도장", "step": "D8 완료", "owner": "정하늘", "due": "2026-09-06", "status": "완료", "closed": "2026-09-09"},
        {"id": "r0200", "no": "8D-26-027", "issued": "2026-08-17", "subject": "C사 금형 버(Burr) 발생", "source": "입고 불량", "partner": "C사", "step": "D8 완료", "owner": "박지훈", "due": "2026-09-07", "status": "완료", "closed": "2026-08-29"},
        {"id": "r0201", "no": "8D-26-028", "issued": "2026-08-13", "subject": "H사 도장 핀홀", "source": "고객 클레임", "partner": "H사", "step": "D8 완료", "owner": "최유진", "due": "2026-09-03", "status": "완료", "closed": "2026-09-03"},
        {"id": "r0202", "no": "8D-26-029", "issued": "2026-08-19", "subject": "C사 콘솔 커버 스크래치", "source": "입고 불량", "partner": "C사", "step": "D8 완료", "owner": "박지훈", "due": "2026-09-09", "status": "완료", "closed": "2026-09-12"},
        {"id": "r0203", "no": "8D-26-030", "issued": "2026-09-15", "subject": "R사 힌지 소음", "source": "고객 클레임", "partner": "R사", "step": "D8 완료", "owner": "이서연", "due": "2026-10-06", "status": "완료", "closed": "2026-09-29"},
        {"id": "r0204", "no": "8D-26-031", "issued": "2026-09-17", "subject": "용접 1 도어래치 작동불량", "source": "공정 불량", "partner": "용접 1", "step": "D5~D6", "owner": "최유진", "due": "2026-10-08", "status": "진행중", "closed": ""},
        {"id": "r0205", "no": "8D-26-032", "issued": "2026-09-19", "subject": "G사 용접 스패터 과다", "source": "고객 클레임", "partner": "G사", "step": "D5~D6", "owner": "최유진", "due": "2026-10-10", "status": "진행중", "closed": ""},
        {"id": "r0206", "no": "8D-26-033", "issued": "2026-10-06", "subject": "용접 1 콘솔 커버 스크래치", "source": "공정 불량", "partner": "용접 1", "step": "D1~D2", "owner": "이서연", "due": "2026-10-27", "status": "진행중", "closed": ""}
      ],
      "titleField": "subject"
    },
    {
      "id": "defects",
      "name": "불량 발생",
      "desc": "공정·입고·출하 단계에서 발견된 불량을 건별로 기록합니다.",
      "dateField": "date",
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
          "key": "site",
          "label": "라인/협력사",
          "type": "select",
          "options": [
            "전 라인",
            "프레스 1",
            "프레스 2",
            "용접 1",
            "용접 2",
            "도장",
            "조립 1",
            "조립 2",
            "A사",
            "B사",
            "C사",
            "D사",
            "F사",
            "J사"
          ]
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
          "label": "조치 내용",
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
        {"id": "r0347", "date": "2026-01-09", "kind": "공정", "site": "용접 1", "part": "리어 브라켓", "type": "도장 핀홀·이물", "qty": 12, "action": "폐기", "status": "완료"},
        {"id": "r0348", "date": "2026-01-30", "kind": "입고", "site": "B사", "part": "힌지 ASSY", "type": "도금 박리", "qty": 2, "action": "폐기", "status": "완료"},
        {"id": "r0349", "date": "2026-01-23", "kind": "공정", "site": "도장", "part": "암레스트", "type": "용접 스패터", "qty": 3, "action": "폐기", "status": "완료"},
        {"id": "r0350", "date": "2026-01-18", "kind": "입고", "site": "J사", "part": "암레스트", "type": "도금 박리", "qty": 3, "action": "협력사 반품", "status": "완료"},
        {"id": "r0351", "date": "2026-01-27", "kind": "공정", "site": "용접 2", "part": "브라켓 BRK-1830", "type": "용접 스패터", "qty": 35, "action": "협력사 반품", "status": "완료"},
        {"id": "r0352", "date": "2026-01-29", "kind": "공정", "site": "용접 1", "part": "글로브박스", "type": "도장 핀홀·이물", "qty": 2, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0353", "date": "2026-01-30", "kind": "공정", "site": "용접 2", "part": "시트프레임", "type": "기타", "qty": 8, "action": "치공구 수리", "status": "완료"},
        {"id": "r0354", "date": "2026-01-24", "kind": "공정", "site": "용접 1", "part": "힌지 ASSY", "type": "스크래치", "qty": 20, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0355", "date": "2026-01-15", "kind": "공정", "site": "용접 1", "part": "리어 브라켓", "type": "용접 스패터", "qty": 2, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0356", "date": "2026-01-26", "kind": "공정", "site": "도장", "part": "글로브박스", "type": "도장 핀홀·이물", "qty": 8, "action": "치공구 수리", "status": "완료"},
        {"id": "r0357", "date": "2026-01-19", "kind": "공정", "site": "용접 1", "part": "브라켓 BRK-1830", "type": "도장 핀홀·이물", "qty": 3, "action": "폐기", "status": "완료"},
        {"id": "r0358", "date": "2026-01-29", "kind": "공정", "site": "조립 2", "part": "글로브박스", "type": "도장 핀홀·이물", "qty": 2, "action": "치공구 수리", "status": "완료"},
        {"id": "r0359", "date": "2026-01-25", "kind": "공정", "site": "조립 2", "part": "콘솔 커버", "type": "용접 스패터", "qty": 35, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0360", "date": "2026-01-01", "kind": "공정", "site": "도장", "part": "암레스트", "type": "체결 불량", "qty": 5, "action": "협력사 반품", "status": "완료"},
        {"id": "r0361", "date": "2026-01-11", "kind": "공정", "site": "조립 2", "part": "도어래치 ASSY", "type": "용접 스패터", "qty": 35, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0362", "date": "2026-01-05", "kind": "입고", "site": "C사", "part": "힌지 ASSY", "type": "도금 박리", "qty": 12, "action": "협력사 반품", "status": "완료"},
        {"id": "r0363", "date": "2026-01-20", "kind": "입고", "site": "A사", "part": "힌지 ASSY", "type": "스크래치", "qty": 8, "action": "협력사 반품", "status": "완료"},
        {"id": "r0364", "date": "2026-01-08", "kind": "공정", "site": "프레스 1", "part": "글로브박스", "type": "용접 스패터", "qty": 8, "action": "폐기", "status": "완료"},
        {"id": "r0365", "date": "2026-01-19", "kind": "공정", "site": "프레스 2", "part": "글로브박스", "type": "도장 핀홀·이물", "qty": 12, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0366", "date": "2026-01-26", "kind": "공정", "site": "조립 1", "part": "암레스트", "type": "치수 이탈", "qty": 35, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0367", "date": "2026-01-03", "kind": "공정", "site": "도장", "part": "콘솔 커버", "type": "도장 핀홀·이물", "qty": 20, "action": "치공구 수리", "status": "완료"},
        {"id": "r0368", "date": "2026-01-28", "kind": "출하", "site": "용접 1", "part": "글로브박스", "type": "도장 핀홀·이물", "qty": 12, "action": "폐기", "status": "완료"},
        {"id": "r0369", "date": "2026-02-21", "kind": "출하", "site": "용접 1", "part": "암레스트", "type": "기타", "qty": 8, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0370", "date": "2026-02-20", "kind": "출하", "site": "용접 2", "part": "글로브박스", "type": "도장 핀홀·이물", "qty": 8, "action": "폐기", "status": "완료"},
        {"id": "r0371", "date": "2026-02-09", "kind": "입고", "site": "B사", "part": "힌지 ASSY", "type": "사출 수축", "qty": 8, "action": "협력사 반품", "status": "완료"},
        {"id": "r0372", "date": "2026-02-04", "kind": "공정", "site": "조립 1", "part": "도어래치 ASSY", "type": "도장 핀홀·이물", "qty": 12, "action": "폐기", "status": "완료"},
        {"id": "r0373", "date": "2026-02-03", "kind": "입고", "site": "J사", "part": "힌지 ASSY", "type": "사출 수축", "qty": 35, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0374", "date": "2026-02-02", "kind": "공정", "site": "용접 1", "part": "시트프레임", "type": "용접 스패터", "qty": 1, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0375", "date": "2026-02-17", "kind": "출하", "site": "프레스 1", "part": "암레스트", "type": "도장 핀홀·이물", "qty": 12, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0376", "date": "2026-02-09", "kind": "공정", "site": "프레스 2", "part": "글로브박스", "type": "도장 핀홀·이물", "qty": 35, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0377", "date": "2026-02-04", "kind": "공정", "site": "조립 2", "part": "리어 브라켓", "type": "스크래치", "qty": 12, "action": "치공구 수리", "status": "완료"},
        {"id": "r0378", "date": "2026-02-13", "kind": "입고", "site": "B사", "part": "도어래치 ASSY", "type": "기타", "qty": 8, "action": "치공구 수리", "status": "완료"},
        {"id": "r0379", "date": "2026-02-13", "kind": "공정", "site": "용접 1", "part": "콘솔 커버", "type": "도장 핀홀·이물", "qty": 12, "action": "폐기", "status": "완료"},
        {"id": "r0380", "date": "2026-02-18", "kind": "입고", "site": "D사", "part": "힌지 ASSY", "type": "사출 수축", "qty": 2, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0381", "date": "2026-02-12", "kind": "입고", "site": "D사", "part": "시트프레임", "type": "사출 수축", "qty": 1, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0382", "date": "2026-02-18", "kind": "공정", "site": "도장", "part": "글로브박스", "type": "도장 핀홀·이물", "qty": 20, "action": "협력사 반품", "status": "완료"},
        {"id": "r0383", "date": "2026-02-03", "kind": "입고", "site": "D사", "part": "글로브박스", "type": "치수 이탈", "qty": 5, "action": "협력사 반품", "status": "완료"},
        {"id": "r0384", "date": "2026-02-05", "kind": "입고", "site": "A사", "part": "힌지 ASSY", "type": "기타", "qty": 1, "action": "폐기", "status": "완료"},
        {"id": "r0385", "date": "2026-02-11", "kind": "출하", "site": "조립 2", "part": "힌지 ASSY", "type": "체결 불량", "qty": 12, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0386", "date": "2026-02-08", "kind": "공정", "site": "프레스 2", "part": "도어래치 ASSY", "type": "용접 스패터", "qty": 8, "action": "협력사 반품", "status": "완료"},
        {"id": "r0387", "date": "2026-02-14", "kind": "공정", "site": "조립 1", "part": "글로브박스", "type": "스크래치", "qty": 35, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0388", "date": "2026-02-04", "kind": "공정", "site": "용접 2", "part": "콘솔 커버", "type": "도장 핀홀·이물", "qty": 1, "action": "치공구 수리", "status": "완료"},
        {"id": "r0389", "date": "2026-02-25", "kind": "공정", "site": "조립 2", "part": "리어 브라켓", "type": "스크래치", "qty": 12, "action": "치공구 수리", "status": "완료"},
        {"id": "r0390", "date": "2026-02-23", "kind": "입고", "site": "J사", "part": "시트프레임", "type": "치수 이탈", "qty": 3, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0391", "date": "2026-03-05", "kind": "공정", "site": "용접 1", "part": "콘솔 커버", "type": "스크래치", "qty": 3, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0392", "date": "2026-03-10", "kind": "공정", "site": "프레스 2", "part": "시트프레임", "type": "치수 이탈", "qty": 35, "action": "협력사 반품", "status": "완료"},
        {"id": "r0393", "date": "2026-03-24", "kind": "입고", "site": "J사", "part": "시트프레임", "type": "스크래치", "qty": 1, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0394", "date": "2026-03-23", "kind": "입고", "site": "A사", "part": "도어래치 ASSY", "type": "도금 박리", "qty": 8, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0395", "date": "2026-03-28", "kind": "공정", "site": "조립 1", "part": "브라켓 BRK-1830", "type": "치수 이탈", "qty": 35, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0396", "date": "2026-03-21", "kind": "입고", "site": "C사", "part": "시트프레임", "type": "사출 수축", "qty": 1, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0397", "date": "2026-03-29", "kind": "공정", "site": "용접 2", "part": "리어 브라켓", "type": "용접 스패터", "qty": 3, "action": "협력사 반품", "status": "완료"},
        {"id": "r0398", "date": "2026-03-18", "kind": "공정", "site": "프레스 2", "part": "힌지 ASSY", "type": "기타", "qty": 12, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0399", "date": "2026-03-27", "kind": "공정", "site": "조립 2", "part": "콘솔 커버", "type": "치수 이탈", "qty": 2, "action": "치공구 수리", "status": "완료"},
        {"id": "r0400", "date": "2026-03-16", "kind": "공정", "site": "용접 1", "part": "콘솔 커버", "type": "도장 핀홀·이물", "qty": 5, "action": "치공구 수리", "status": "완료"},
        {"id": "r0401", "date": "2026-03-25", "kind": "입고", "site": "A사", "part": "콘솔 커버", "type": "스크래치", "qty": 5, "action": "협력사 반품", "status": "완료"},
        {"id": "r0402", "date": "2026-03-06", "kind": "입고", "site": "C사", "part": "힌지 ASSY", "type": "스크래치", "qty": 2, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0403", "date": "2026-03-12", "kind": "공정", "site": "프레스 2", "part": "리어 브라켓", "type": "기타", "qty": 3, "action": "치공구 수리", "status": "완료"},
        {"id": "r0404", "date": "2026-03-31", "kind": "입고", "site": "A사", "part": "도어래치 ASSY", "type": "사출 수축", "qty": 35, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0405", "date": "2026-03-06", "kind": "공정", "site": "용접 2", "part": "글로브박스", "type": "체결 불량", "qty": 2, "action": "협력사 반품", "status": "완료"},
        {"id": "r0406", "date": "2026-03-27", "kind": "공정", "site": "도장", "part": "브라켓 BRK-1830", "type": "체결 불량", "qty": 35, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0407", "date": "2026-03-26", "kind": "공정", "site": "프레스 2", "part": "암레스트", "type": "치수 이탈", "qty": 1, "action": "협력사 반품", "status": "완료"},
        {"id": "r0408", "date": "2026-03-11", "kind": "공정", "site": "조립 1", "part": "힌지 ASSY", "type": "기타", "qty": 8, "action": "협력사 반품", "status": "완료"},
        {"id": "r0409", "date": "2026-03-04", "kind": "출하", "site": "프레스 1", "part": "콘솔 커버", "type": "용접 스패터", "qty": 2, "action": "치공구 수리", "status": "완료"},
        {"id": "r0410", "date": "2026-03-24", "kind": "공정", "site": "프레스 1", "part": "도어래치 ASSY", "type": "스크래치", "qty": 5, "action": "협력사 반품", "status": "완료"},
        {"id": "r0411", "date": "2026-03-18", "kind": "공정", "site": "조립 1", "part": "글로브박스", "type": "용접 스패터", "qty": 35, "action": "치공구 수리", "status": "완료"},
        {"id": "r0412", "date": "2026-03-26", "kind": "공정", "site": "용접 2", "part": "콘솔 커버", "type": "치수 이탈", "qty": 35, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0413", "date": "2026-04-06", "kind": "공정", "site": "도장", "part": "시트프레임", "type": "도장 핀홀·이물", "qty": 12, "action": "협력사 반품", "status": "완료"},
        {"id": "r0414", "date": "2026-04-03", "kind": "공정", "site": "프레스 2", "part": "암레스트", "type": "도장 핀홀·이물", "qty": 12, "action": "폐기", "status": "완료"},
        {"id": "r0415", "date": "2026-04-15", "kind": "공정", "site": "조립 1", "part": "리어 브라켓", "type": "스크래치", "qty": 20, "action": "치공구 수리", "status": "완료"},
        {"id": "r0416", "date": "2026-04-13", "kind": "공정", "site": "용접 2", "part": "글로브박스", "type": "체결 불량", "qty": 1, "action": "협력사 반품", "status": "완료"},
        {"id": "r0417", "date": "2026-04-08", "kind": "공정", "site": "용접 1", "part": "암레스트", "type": "도장 핀홀·이물", "qty": 20, "action": "폐기", "status": "완료"},
        {"id": "r0418", "date": "2026-04-17", "kind": "공정", "site": "조립 2", "part": "암레스트", "type": "용접 스패터", "qty": 5, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0419", "date": "2026-04-10", "kind": "공정", "site": "용접 1", "part": "도어래치 ASSY", "type": "용접 스패터", "qty": 8, "action": "협력사 반품", "status": "완료"},
        {"id": "r0420", "date": "2026-04-25", "kind": "공정", "site": "조립 1", "part": "리어 브라켓", "type": "치수 이탈", "qty": 1, "action": "폐기", "status": "완료"},
        {"id": "r0421", "date": "2026-04-30", "kind": "공정", "site": "프레스 2", "part": "글로브박스", "type": "스크래치", "qty": 1, "action": "폐기", "status": "완료"},
        {"id": "r0422", "date": "2026-04-06", "kind": "공정", "site": "조립 2", "part": "브라켓 BRK-1830", "type": "기타", "qty": 5, "action": "치공구 수리", "status": "완료"},
        {"id": "r0423", "date": "2026-04-20", "kind": "출하", "site": "조립 1", "part": "힌지 ASSY", "type": "체결 불량", "qty": 8, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0424", "date": "2026-04-12", "kind": "공정", "site": "조립 1", "part": "리어 브라켓", "type": "도장 핀홀·이물", "qty": 5, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0425", "date": "2026-04-12", "kind": "공정", "site": "조립 1", "part": "힌지 ASSY", "type": "용접 스패터", "qty": 8, "action": "폐기", "status": "완료"},
        {"id": "r0426", "date": "2026-04-30", "kind": "공정", "site": "프레스 2", "part": "리어 브라켓", "type": "스크래치", "qty": 12, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0427", "date": "2026-04-15", "kind": "입고", "site": "B사", "part": "글로브박스", "type": "치수 이탈", "qty": 2, "action": "치공구 수리", "status": "완료"},
        {"id": "r0428", "date": "2026-04-07", "kind": "공정", "site": "도장", "part": "콘솔 커버", "type": "도장 핀홀·이물", "qty": 35, "action": "치공구 수리", "status": "완료"},
        {"id": "r0429", "date": "2026-04-10", "kind": "공정", "site": "조립 2", "part": "콘솔 커버", "type": "치수 이탈", "qty": 12, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0430", "date": "2026-04-01", "kind": "공정", "site": "프레스 1", "part": "도어래치 ASSY", "type": "체결 불량", "qty": 35, "action": "치공구 수리", "status": "완료"},
        {"id": "r0431", "date": "2026-04-19", "kind": "공정", "site": "조립 1", "part": "도어래치 ASSY", "type": "도장 핀홀·이물", "qty": 12, "action": "폐기", "status": "완료"},
        {"id": "r0432", "date": "2026-04-09", "kind": "입고", "site": "D사", "part": "도어래치 ASSY", "type": "기타", "qty": 5, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0433", "date": "2026-04-15", "kind": "입고", "site": "C사", "part": "힌지 ASSY", "type": "사출 수축", "qty": 5, "action": "폐기", "status": "완료"},
        {"id": "r0434", "date": "2026-04-23", "kind": "입고", "site": "F사", "part": "리어 브라켓", "type": "기타", "qty": 1, "action": "폐기", "status": "완료"},
        {"id": "r0435", "date": "2026-05-27", "kind": "입고", "site": "J사", "part": "글로브박스", "type": "사출 수축", "qty": 8, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0436", "date": "2026-05-14", "kind": "공정", "site": "프레스 2", "part": "도어래치 ASSY", "type": "용접 스패터", "qty": 2, "action": "치공구 수리", "status": "완료"},
        {"id": "r0437", "date": "2026-05-29", "kind": "입고", "site": "D사", "part": "암레스트", "type": "치수 이탈", "qty": 2, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0438", "date": "2026-05-19", "kind": "공정", "site": "도장", "part": "암레스트", "type": "도장 핀홀·이물", "qty": 8, "action": "협력사 반품", "status": "완료"},
        {"id": "r0439", "date": "2026-05-22", "kind": "공정", "site": "용접 1", "part": "브라켓 BRK-1830", "type": "용접 스패터", "qty": 5, "action": "폐기", "status": "완료"},
        {"id": "r0440", "date": "2026-05-29", "kind": "공정", "site": "용접 2", "part": "리어 브라켓", "type": "치수 이탈", "qty": 2, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0441", "date": "2026-05-07", "kind": "입고", "site": "J사", "part": "콘솔 커버", "type": "사출 수축", "qty": 5, "action": "협력사 반품", "status": "완료"},
        {"id": "r0442", "date": "2026-05-17", "kind": "공정", "site": "조립 2", "part": "시트프레임", "type": "스크래치", "qty": 20, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0443", "date": "2026-05-17", "kind": "공정", "site": "프레스 2", "part": "리어 브라켓", "type": "스크래치", "qty": 8, "action": "협력사 반품", "status": "완료"},
        {"id": "r0444", "date": "2026-05-21", "kind": "공정", "site": "조립 1", "part": "리어 브라켓", "type": "도장 핀홀·이물", "qty": 2, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0445", "date": "2026-05-21", "kind": "입고", "site": "A사", "part": "콘솔 커버", "type": "도금 박리", "qty": 2, "action": "폐기", "status": "완료"},
        {"id": "r0446", "date": "2026-05-20", "kind": "공정", "site": "도장", "part": "암레스트", "type": "체결 불량", "qty": 8, "action": "폐기", "status": "완료"},
        {"id": "r0447", "date": "2026-05-27", "kind": "출하", "site": "조립 2", "part": "시트프레임", "type": "치수 이탈", "qty": 8, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0448", "date": "2026-05-12", "kind": "출하", "site": "프레스 2", "part": "암레스트", "type": "도장 핀홀·이물", "qty": 5, "action": "협력사 반품", "status": "완료"},
        {"id": "r0449", "date": "2026-05-31", "kind": "공정", "site": "프레스 2", "part": "콘솔 커버", "type": "용접 스패터", "qty": 5, "action": "치공구 수리", "status": "완료"},
        {"id": "r0450", "date": "2026-05-13", "kind": "공정", "site": "용접 2", "part": "도어래치 ASSY", "type": "스크래치", "qty": 5, "action": "치공구 수리", "status": "완료"},
        {"id": "r0451", "date": "2026-05-25", "kind": "공정", "site": "용접 2", "part": "힌지 ASSY", "type": "치수 이탈", "qty": 2, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0452", "date": "2026-05-24", "kind": "공정", "site": "조립 2", "part": "글로브박스", "type": "용접 스패터", "qty": 20, "action": "협력사 반품", "status": "완료"},
        {"id": "r0453", "date": "2026-05-28", "kind": "공정", "site": "프레스 2", "part": "브라켓 BRK-1830", "type": "용접 스패터", "qty": 3, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0454", "date": "2026-05-05", "kind": "공정", "site": "조립 1", "part": "브라켓 BRK-1830", "type": "도장 핀홀·이물", "qty": 2, "action": "협력사 반품", "status": "완료"},
        {"id": "r0455", "date": "2026-05-18", "kind": "입고", "site": "A사", "part": "도어래치 ASSY", "type": "사출 수축", "qty": 8, "action": "치공구 수리", "status": "완료"},
        {"id": "r0456", "date": "2026-05-13", "kind": "공정", "site": "도장", "part": "도어래치 ASSY", "type": "도장 핀홀·이물", "qty": 5, "action": "치공구 수리", "status": "완료"},
        {"id": "r0457", "date": "2026-06-18", "kind": "공정", "site": "프레스 2", "part": "콘솔 커버", "type": "스크래치", "qty": 2, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0458", "date": "2026-06-19", "kind": "입고", "site": "C사", "part": "도어래치 ASSY", "type": "기타", "qty": 8, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0459", "date": "2026-06-24", "kind": "공정", "site": "용접 1", "part": "브라켓 BRK-1830", "type": "치수 이탈", "qty": 20, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0460", "date": "2026-06-27", "kind": "입고", "site": "C사", "part": "글로브박스", "type": "도금 박리", "qty": 12, "action": "치공구 수리", "status": "완료"},
        {"id": "r0461", "date": "2026-06-25", "kind": "공정", "site": "용접 1", "part": "암레스트", "type": "도장 핀홀·이물", "qty": 12, "action": "치공구 수리", "status": "완료"},
        {"id": "r0462", "date": "2026-06-03", "kind": "입고", "site": "C사", "part": "힌지 ASSY", "type": "치수 이탈", "qty": 5, "action": "폐기", "status": "완료"},
        {"id": "r0463", "date": "2026-06-15", "kind": "공정", "site": "조립 1", "part": "브라켓 BRK-1830", "type": "도장 핀홀·이물", "qty": 3, "action": "협력사 반품", "status": "완료"},
        {"id": "r0464", "date": "2026-06-18", "kind": "공정", "site": "용접 2", "part": "시트프레임", "type": "용접 스패터", "qty": 35, "action": "협력사 반품", "status": "완료"},
        {"id": "r0465", "date": "2026-06-30", "kind": "입고", "site": "D사", "part": "도어래치 ASSY", "type": "스크래치", "qty": 12, "action": "협력사 반품", "status": "완료"},
        {"id": "r0466", "date": "2026-06-18", "kind": "입고", "site": "C사", "part": "도어래치 ASSY", "type": "사출 수축", "qty": 12, "action": "협력사 반품", "status": "완료"},
        {"id": "r0467", "date": "2026-06-08", "kind": "공정", "site": "조립 2", "part": "시트프레임", "type": "스크래치", "qty": 8, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0468", "date": "2026-06-12", "kind": "입고", "site": "D사", "part": "힌지 ASSY", "type": "스크래치", "qty": 35, "action": "폐기", "status": "완료"},
        {"id": "r0469", "date": "2026-06-02", "kind": "입고", "site": "F사", "part": "암레스트", "type": "스크래치", "qty": 12, "action": "협력사 반품", "status": "완료"},
        {"id": "r0470", "date": "2026-06-25", "kind": "공정", "site": "프레스 1", "part": "시트프레임", "type": "용접 스패터", "qty": 2, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0471", "date": "2026-06-25", "kind": "입고", "site": "D사", "part": "콘솔 커버", "type": "치수 이탈", "qty": 35, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0472", "date": "2026-06-24", "kind": "공정", "site": "조립 2", "part": "브라켓 BRK-1830", "type": "도장 핀홀·이물", "qty": 5, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0473", "date": "2026-06-25", "kind": "입고", "site": "J사", "part": "리어 브라켓", "type": "사출 수축", "qty": 12, "action": "폐기", "status": "완료"},
        {"id": "r0474", "date": "2026-06-03", "kind": "공정", "site": "프레스 1", "part": "콘솔 커버", "type": "도장 핀홀·이물", "qty": 1, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0475", "date": "2026-06-28", "kind": "공정", "site": "프레스 2", "part": "시트프레임", "type": "체결 불량", "qty": 1, "action": "폐기", "status": "완료"},
        {"id": "r0476", "date": "2026-06-29", "kind": "공정", "site": "도장", "part": "도어래치 ASSY", "type": "도장 핀홀·이물", "qty": 12, "action": "치공구 수리", "status": "완료"},
        {"id": "r0477", "date": "2026-06-24", "kind": "공정", "site": "도장", "part": "도어래치 ASSY", "type": "도장 핀홀·이물", "qty": 12, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0478", "date": "2026-06-27", "kind": "공정", "site": "도장", "part": "리어 브라켓", "type": "도장 핀홀·이물", "qty": 2, "action": "치공구 수리", "status": "완료"},
        {"id": "r0479", "date": "2026-07-15", "kind": "공정", "site": "조립 2", "part": "시트프레임", "type": "스크래치", "qty": 3, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0480", "date": "2026-07-06", "kind": "공정", "site": "프레스 2", "part": "암레스트", "type": "치수 이탈", "qty": 3, "action": "치공구 수리", "status": "완료"},
        {"id": "r0481", "date": "2026-07-09", "kind": "출하", "site": "도장", "part": "도어래치 ASSY", "type": "도장 핀홀·이물", "qty": 3, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0482", "date": "2026-07-14", "kind": "공정", "site": "조립 2", "part": "힌지 ASSY", "type": "치수 이탈", "qty": 3, "action": "협력사 반품", "status": "완료"},
        {"id": "r0483", "date": "2026-07-17", "kind": "공정", "site": "조립 1", "part": "도어래치 ASSY", "type": "용접 스패터", "qty": 1, "action": "협력사 반품", "status": "완료"},
        {"id": "r0484", "date": "2026-07-26", "kind": "입고", "site": "B사", "part": "콘솔 커버", "type": "스크래치", "qty": 20, "action": "협력사 반품", "status": "완료"},
        {"id": "r0485", "date": "2026-07-24", "kind": "공정", "site": "용접 2", "part": "도어래치 ASSY", "type": "용접 스패터", "qty": 5, "action": "협력사 반품", "status": "완료"},
        {"id": "r0486", "date": "2026-07-08", "kind": "공정", "site": "조립 2", "part": "도어래치 ASSY", "type": "스크래치", "qty": 5, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0487", "date": "2026-07-26", "kind": "공정", "site": "용접 2", "part": "시트프레임", "type": "용접 스패터", "qty": 2, "action": "치공구 수리", "status": "완료"},
        {"id": "r0488", "date": "2026-07-26", "kind": "입고", "site": "F사", "part": "도어래치 ASSY", "type": "도금 박리", "qty": 12, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0489", "date": "2026-07-14", "kind": "출하", "site": "용접 2", "part": "리어 브라켓", "type": "치수 이탈", "qty": 35, "action": "폐기", "status": "완료"},
        {"id": "r0490", "date": "2026-07-23", "kind": "공정", "site": "용접 2", "part": "시트프레임", "type": "치수 이탈", "qty": 12, "action": "폐기", "status": "완료"},
        {"id": "r0491", "date": "2026-07-09", "kind": "공정", "site": "도장", "part": "도어래치 ASSY", "type": "스크래치", "qty": 12, "action": "폐기", "status": "완료"},
        {"id": "r0492", "date": "2026-07-19", "kind": "공정", "site": "프레스 2", "part": "암레스트", "type": "기타", "qty": 5, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0493", "date": "2026-07-16", "kind": "공정", "site": "프레스 2", "part": "시트프레임", "type": "용접 스패터", "qty": 2, "action": "협력사 반품", "status": "완료"},
        {"id": "r0494", "date": "2026-07-13", "kind": "공정", "site": "조립 1", "part": "콘솔 커버", "type": "체결 불량", "qty": 8, "action": "폐기", "status": "완료"},
        {"id": "r0495", "date": "2026-07-10", "kind": "공정", "site": "프레스 1", "part": "암레스트", "type": "용접 스패터", "qty": 1, "action": "치공구 수리", "status": "완료"},
        {"id": "r0496", "date": "2026-07-06", "kind": "공정", "site": "프레스 1", "part": "도어래치 ASSY", "type": "체결 불량", "qty": 35, "action": "협력사 반품", "status": "완료"},
        {"id": "r0497", "date": "2026-07-03", "kind": "공정", "site": "프레스 1", "part": "암레스트", "type": "용접 스패터", "qty": 35, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0498", "date": "2026-07-11", "kind": "공정", "site": "프레스 1", "part": "리어 브라켓", "type": "체결 불량", "qty": 35, "action": "치공구 수리", "status": "완료"},
        {"id": "r0499", "date": "2026-07-20", "kind": "공정", "site": "용접 1", "part": "힌지 ASSY", "type": "도장 핀홀·이물", "qty": 35, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0500", "date": "2026-07-28", "kind": "공정", "site": "용접 2", "part": "시트프레임", "type": "용접 스패터", "qty": 5, "action": "폐기", "status": "완료"},
        {"id": "r0501", "date": "2026-08-03", "kind": "공정", "site": "용접 1", "part": "시트프레임", "type": "도장 핀홀·이물", "qty": 8, "action": "폐기", "status": "완료"},
        {"id": "r0502", "date": "2026-08-11", "kind": "공정", "site": "프레스 1", "part": "콘솔 커버", "type": "용접 스패터", "qty": 1, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0503", "date": "2026-08-31", "kind": "공정", "site": "프레스 2", "part": "도어래치 ASSY", "type": "도장 핀홀·이물", "qty": 5, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0504", "date": "2026-08-28", "kind": "공정", "site": "프레스 1", "part": "리어 브라켓", "type": "용접 스패터", "qty": 3, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0505", "date": "2026-08-03", "kind": "공정", "site": "조립 2", "part": "힌지 ASSY", "type": "용접 스패터", "qty": 5, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0506", "date": "2026-08-24", "kind": "입고", "site": "A사", "part": "암레스트", "type": "치수 이탈", "qty": 5, "action": "치공구 수리", "status": "완료"},
        {"id": "r0507", "date": "2026-08-28", "kind": "공정", "site": "조립 2", "part": "도어래치 ASSY", "type": "도장 핀홀·이물", "qty": 5, "action": "치공구 수리", "status": "완료"},
        {"id": "r0508", "date": "2026-08-04", "kind": "출하", "site": "용접 1", "part": "시트프레임", "type": "도장 핀홀·이물", "qty": 5, "action": "협력사 반품", "status": "완료"},
        {"id": "r0509", "date": "2026-08-27", "kind": "입고", "site": "A사", "part": "힌지 ASSY", "type": "사출 수축", "qty": 20, "action": "협력사 반품", "status": "완료"},
        {"id": "r0510", "date": "2026-08-16", "kind": "공정", "site": "용접 2", "part": "힌지 ASSY", "type": "도장 핀홀·이물", "qty": 8, "action": "협력사 반품", "status": "완료"},
        {"id": "r0511", "date": "2026-08-19", "kind": "입고", "site": "D사", "part": "브라켓 BRK-1830", "type": "스크래치", "qty": 5, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0512", "date": "2026-08-30", "kind": "공정", "site": "용접 1", "part": "글로브박스", "type": "스크래치", "qty": 3, "action": "폐기", "status": "완료"},
        {"id": "r0513", "date": "2026-08-25", "kind": "공정", "site": "용접 2", "part": "리어 브라켓", "type": "도장 핀홀·이물", "qty": 12, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0514", "date": "2026-08-27", "kind": "공정", "site": "프레스 1", "part": "시트프레임", "type": "체결 불량", "qty": 20, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0515", "date": "2026-08-23", "kind": "공정", "site": "용접 2", "part": "브라켓 BRK-1830", "type": "체결 불량", "qty": 20, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0516", "date": "2026-08-29", "kind": "공정", "site": "조립 1", "part": "도어래치 ASSY", "type": "도장 핀홀·이물", "qty": 2, "action": "폐기", "status": "완료"},
        {"id": "r0517", "date": "2026-08-09", "kind": "공정", "site": "조립 1", "part": "콘솔 커버", "type": "치수 이탈", "qty": 2, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0518", "date": "2026-08-12", "kind": "입고", "site": "J사", "part": "도어래치 ASSY", "type": "사출 수축", "qty": 1, "action": "폐기", "status": "완료"},
        {"id": "r0519", "date": "2026-08-10", "kind": "입고", "site": "C사", "part": "도어래치 ASSY", "type": "사출 수축", "qty": 3, "action": "폐기", "status": "완료"},
        {"id": "r0520", "date": "2026-08-13", "kind": "입고", "site": "B사", "part": "콘솔 커버", "type": "스크래치", "qty": 20, "action": "협력사 반품", "status": "완료"},
        {"id": "r0521", "date": "2026-08-11", "kind": "공정", "site": "용접 2", "part": "힌지 ASSY", "type": "치수 이탈", "qty": 5, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0522", "date": "2026-08-10", "kind": "공정", "site": "프레스 2", "part": "힌지 ASSY", "type": "도장 핀홀·이물", "qty": 12, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0523", "date": "2026-09-06", "kind": "공정", "site": "용접 2", "part": "글로브박스", "type": "체결 불량", "qty": 8, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0524", "date": "2026-09-28", "kind": "공정", "site": "용접 1", "part": "시트프레임", "type": "용접 스패터", "qty": 1, "action": "치공구 수리", "status": "완료"},
        {"id": "r0525", "date": "2026-09-05", "kind": "공정", "site": "용접 2", "part": "콘솔 커버", "type": "치수 이탈", "qty": 3, "action": "협력사 반품", "status": "완료"},
        {"id": "r0526", "date": "2026-09-14", "kind": "공정", "site": "프레스 1", "part": "리어 브라켓", "type": "도장 핀홀·이물", "qty": 1, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0527", "date": "2026-09-19", "kind": "공정", "site": "프레스 2", "part": "도어래치 ASSY", "type": "도장 핀홀·이물", "qty": 1, "action": "치공구 수리", "status": "완료"},
        {"id": "r0528", "date": "2026-09-18", "kind": "출하", "site": "프레스 1", "part": "도어래치 ASSY", "type": "스크래치", "qty": 5, "action": "협력사 반품", "status": "완료"},
        {"id": "r0529", "date": "2026-09-22", "kind": "입고", "site": "A사", "part": "리어 브라켓", "type": "치수 이탈", "qty": 1, "action": "치공구 수리", "status": "완료"},
        {"id": "r0530", "date": "2026-09-25", "kind": "공정", "site": "프레스 2", "part": "암레스트", "type": "도장 핀홀·이물", "qty": 3, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0531", "date": "2026-09-05", "kind": "출하", "site": "조립 1", "part": "콘솔 커버", "type": "스크래치", "qty": 5, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0532", "date": "2026-09-26", "kind": "공정", "site": "조립 2", "part": "글로브박스", "type": "치수 이탈", "qty": 5, "action": "협력사 반품", "status": "완료"},
        {"id": "r0533", "date": "2026-09-06", "kind": "공정", "site": "프레스 2", "part": "시트프레임", "type": "체결 불량", "qty": 5, "action": "치공구 수리", "status": "완료"},
        {"id": "r0534", "date": "2026-09-19", "kind": "공정", "site": "프레스 2", "part": "브라켓 BRK-1830", "type": "도장 핀홀·이물", "qty": 2, "action": "협력사 반품", "status": "완료"},
        {"id": "r0535", "date": "2026-09-12", "kind": "입고", "site": "D사", "part": "리어 브라켓", "type": "도금 박리", "qty": 12, "action": "공정 조건 조정", "status": "완료"},
        {"id": "r0536", "date": "2026-09-13", "kind": "공정", "site": "프레스 2", "part": "리어 브라켓", "type": "도장 핀홀·이물", "qty": 8, "action": "치공구 수리", "status": "완료"},
        {"id": "r0537", "date": "2026-09-02", "kind": "입고", "site": "F사", "part": "암레스트", "type": "스크래치", "qty": 8, "action": "치공구 수리", "status": "완료"},
        {"id": "r0538", "date": "2026-09-28", "kind": "입고", "site": "B사", "part": "리어 브라켓", "type": "도금 박리", "qty": 35, "action": "협력사 반품", "status": "완료"},
        {"id": "r0539", "date": "2026-09-08", "kind": "공정", "site": "용접 2", "part": "힌지 ASSY", "type": "도장 핀홀·이물", "qty": 5, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0540", "date": "2026-09-09", "kind": "공정", "site": "도장", "part": "힌지 ASSY", "type": "도장 핀홀·이물", "qty": 8, "action": "치공구 수리", "status": "완료"},
        {"id": "r0541", "date": "2026-09-30", "kind": "입고", "site": "A사", "part": "콘솔 커버", "type": "도금 박리", "qty": 3, "action": "협력사 반품", "status": "완료"},
        {"id": "r0542", "date": "2026-09-08", "kind": "공정", "site": "조립 2", "part": "도어래치 ASSY", "type": "용접 스패터", "qty": 20, "action": "협력사 반품", "status": "완료"},
        {"id": "r0543", "date": "2026-09-02", "kind": "출하", "site": "프레스 2", "part": "콘솔 커버", "type": "용접 스패터", "qty": 12, "action": "폐기", "status": "완료"},
        {"id": "r0544", "date": "2026-09-29", "kind": "입고", "site": "C사", "part": "힌지 ASSY", "type": "도금 박리", "qty": 5, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0545", "date": "2026-10-05", "kind": "입고", "site": "D사", "part": "브라켓 BRK-1830", "type": "도금 박리", "qty": 12, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0546", "date": "2026-10-01", "kind": "입고", "site": "F사", "part": "암레스트", "type": "사출 수축", "qty": 12, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0547", "date": "2026-10-03", "kind": "입고", "site": "F사", "part": "리어 브라켓", "type": "사출 수축", "qty": 35, "action": "공정 조건 조정", "status": "조치중"},
        {"id": "r0548", "date": "2026-10-05", "kind": "입고", "site": "D사", "part": "콘솔 커버", "type": "도금 박리", "qty": 5, "action": "선별 후 재작업", "status": "완료"},
        {"id": "r0549", "date": "2026-10-04", "kind": "공정", "site": "프레스 1", "part": "콘솔 커버", "type": "기타", "qty": 20, "action": "협력사 반품", "status": "조치중"},
        {"id": "r0550", "date": "2026-10-02", "kind": "공정", "site": "조립 2", "part": "암레스트", "type": "치수 이탈", "qty": 8, "action": "선별 후 재작업", "status": "완료"}
      ],
      "titleField": "part"
    },
    {
      "id": "inspections",
      "name": "검사 실적",
      "desc": "구분·라인(협력사)별 검사 수량과 불량 수량을 월 단위로 기록합니다. 불량률·PPM 계산의 기준이 됩니다.",
      "dateField": "date",
      "fields": [
        {
          "key": "date",
          "label": "집계일",
          "type": "date",
          "req": true
        },
        {
          "key": "kind",
          "label": "구분",
          "type": "select",
          "options": [
            "출하",
            "공정",
            "입고"
          ],
          "req": true
        },
        {
          "key": "site",
          "label": "라인/협력사",
          "type": "select",
          "options": [
            "전 라인",
            "프레스 1",
            "프레스 2",
            "용접 1",
            "용접 2",
            "도장",
            "조립 1",
            "조립 2",
            "A사",
            "B사",
            "C사",
            "D사",
            "F사",
            "J사"
          ]
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
          "type": "number",
          "req": true
        }
      ],
      "records": [
        {"id": "r0207", "date": "2026-01-31", "kind": "출하", "site": "전 라인", "inspected": 380942, "defects": 17},
        {"id": "r0208", "date": "2026-01-31", "kind": "공정", "site": "프레스 1", "inspected": 53359, "defects": 291},
        {"id": "r0209", "date": "2026-01-31", "kind": "공정", "site": "프레스 2", "inspected": 50116, "defects": 390},
        {"id": "r0210", "date": "2026-01-31", "kind": "공정", "site": "용접 1", "inspected": 58198, "defects": 658},
        {"id": "r0211", "date": "2026-01-31", "kind": "공정", "site": "용접 2", "inspected": 49442, "defects": 525},
        {"id": "r0212", "date": "2026-01-31", "kind": "공정", "site": "도장", "inspected": 53174, "defects": 908},
        {"id": "r0213", "date": "2026-01-31", "kind": "공정", "site": "조립 1", "inspected": 49923, "defects": 434},
        {"id": "r0214", "date": "2026-01-31", "kind": "공정", "site": "조립 2", "inspected": 54416, "defects": 364},
        {"id": "r0215", "date": "2026-01-31", "kind": "입고", "site": "A사", "inspected": 43046, "defects": 82},
        {"id": "r0216", "date": "2026-01-31", "kind": "입고", "site": "B사", "inspected": 40714, "defects": 107},
        {"id": "r0217", "date": "2026-01-31", "kind": "입고", "site": "C사", "inspected": 35334, "defects": 171},
        {"id": "r0218", "date": "2026-01-31", "kind": "입고", "site": "D사", "inspected": 46127, "defects": 446},
        {"id": "r0219", "date": "2026-01-31", "kind": "입고", "site": "F사", "inspected": 42899, "defects": 323},
        {"id": "r0220", "date": "2026-01-31", "kind": "입고", "site": "J사", "inspected": 43004, "defects": 283},
        {"id": "r0221", "date": "2026-02-28", "kind": "출하", "site": "전 라인", "inspected": 380065, "defects": 16},
        {"id": "r0222", "date": "2026-02-28", "kind": "공정", "site": "프레스 1", "inspected": 56155, "defects": 265},
        {"id": "r0223", "date": "2026-02-28", "kind": "공정", "site": "프레스 2", "inspected": 53097, "defects": 431},
        {"id": "r0224", "date": "2026-02-28", "kind": "공정", "site": "용접 1", "inspected": 58607, "defects": 620},
        {"id": "r0225", "date": "2026-02-28", "kind": "공정", "site": "용접 2", "inspected": 53318, "defects": 423},
        {"id": "r0226", "date": "2026-02-28", "kind": "공정", "site": "도장", "inspected": 51450, "defects": 649},
        {"id": "r0227", "date": "2026-02-28", "kind": "공정", "site": "조립 1", "inspected": 49524, "defects": 364},
        {"id": "r0228", "date": "2026-02-28", "kind": "공정", "site": "조립 2", "inspected": 48635, "defects": 261},
        {"id": "r0229", "date": "2026-02-28", "kind": "입고", "site": "A사", "inspected": 35316, "defects": 74},
        {"id": "r0230", "date": "2026-02-28", "kind": "입고", "site": "B사", "inspected": 38747, "defects": 113},
        {"id": "r0231", "date": "2026-02-28", "kind": "입고", "site": "C사", "inspected": 47139, "defects": 193},
        {"id": "r0232", "date": "2026-02-28", "kind": "입고", "site": "D사", "inspected": 43960, "defects": 429},
        {"id": "r0233", "date": "2026-02-28", "kind": "입고", "site": "F사", "inspected": 36201, "defects": 282},
        {"id": "r0234", "date": "2026-02-28", "kind": "입고", "site": "J사", "inspected": 35413, "defects": 230},
        {"id": "r0235", "date": "2026-03-31", "kind": "출하", "site": "전 라인", "inspected": 363587, "defects": 14},
        {"id": "r0236", "date": "2026-03-31", "kind": "공정", "site": "프레스 1", "inspected": 52218, "defects": 277},
        {"id": "r0237", "date": "2026-03-31", "kind": "공정", "site": "프레스 2", "inspected": 53649, "defects": 374},
        {"id": "r0238", "date": "2026-03-31", "kind": "공정", "site": "용접 1", "inspected": 58684, "defects": 670},
        {"id": "r0239", "date": "2026-03-31", "kind": "공정", "site": "용접 2", "inspected": 51643, "defects": 464},
        {"id": "r0240", "date": "2026-03-31", "kind": "공정", "site": "도장", "inspected": 58985, "defects": 877},
        {"id": "r0241", "date": "2026-03-31", "kind": "공정", "site": "조립 1", "inspected": 57703, "defects": 532},
        {"id": "r0242", "date": "2026-03-31", "kind": "공정", "site": "조립 2", "inspected": 54499, "defects": 308},
        {"id": "r0243", "date": "2026-03-31", "kind": "입고", "site": "A사", "inspected": 42872, "defects": 66},
        {"id": "r0244", "date": "2026-03-31", "kind": "입고", "site": "B사", "inspected": 44856, "defects": 93},
        {"id": "r0245", "date": "2026-03-31", "kind": "입고", "site": "C사", "inspected": 38760, "defects": 160},
        {"id": "r0246", "date": "2026-03-31", "kind": "입고", "site": "D사", "inspected": 37081, "defects": 337},
        {"id": "r0247", "date": "2026-03-31", "kind": "입고", "site": "F사", "inspected": 45913, "defects": 320},
        {"id": "r0248", "date": "2026-03-31", "kind": "입고", "site": "J사", "inspected": 34880, "defects": 192},
        {"id": "r0249", "date": "2026-04-30", "kind": "출하", "site": "전 라인", "inspected": 382920, "defects": 13},
        {"id": "r0250", "date": "2026-04-30", "kind": "공정", "site": "프레스 1", "inspected": 52498, "defects": 245},
        {"id": "r0251", "date": "2026-04-30", "kind": "공정", "site": "프레스 2", "inspected": 53083, "defects": 387},
        {"id": "r0252", "date": "2026-04-30", "kind": "공정", "site": "용접 1", "inspected": 52192, "defects": 514},
        {"id": "r0253", "date": "2026-04-30", "kind": "공정", "site": "용접 2", "inspected": 49563, "defects": 495},
        {"id": "r0254", "date": "2026-04-30", "kind": "공정", "site": "도장", "inspected": 50464, "defects": 683},
        {"id": "r0255", "date": "2026-04-30", "kind": "공정", "site": "조립 1", "inspected": 56308, "defects": 452},
        {"id": "r0256", "date": "2026-04-30", "kind": "공정", "site": "조립 2", "inspected": 56506, "defects": 340},
        {"id": "r0257", "date": "2026-04-30", "kind": "입고", "site": "A사", "inspected": 44680, "defects": 72},
        {"id": "r0258", "date": "2026-04-30", "kind": "입고", "site": "B사", "inspected": 43499, "defects": 117},
        {"id": "r0259", "date": "2026-04-30", "kind": "입고", "site": "C사", "inspected": 40342, "defects": 137},
        {"id": "r0260", "date": "2026-04-30", "kind": "입고", "site": "D사", "inspected": 43450, "defects": 475},
        {"id": "r0261", "date": "2026-04-30", "kind": "입고", "site": "F사", "inspected": 44864, "defects": 348},
        {"id": "r0262", "date": "2026-04-30", "kind": "입고", "site": "J사", "inspected": 36551, "defects": 195},
        {"id": "r0263", "date": "2026-05-31", "kind": "출하", "site": "전 라인", "inspected": 393359, "defects": 13},
        {"id": "r0264", "date": "2026-05-31", "kind": "공정", "site": "프레스 1", "inspected": 56986, "defects": 268},
        {"id": "r0265", "date": "2026-05-31", "kind": "공정", "site": "프레스 2", "inspected": 53584, "defects": 396},
        {"id": "r0266", "date": "2026-05-31", "kind": "공정", "site": "용접 1", "inspected": 50210, "defects": 551},
        {"id": "r0267", "date": "2026-05-31", "kind": "공정", "site": "용접 2", "inspected": 52217, "defects": 432},
        {"id": "r0268", "date": "2026-05-31", "kind": "공정", "site": "도장", "inspected": 51503, "defects": 723},
        {"id": "r0269", "date": "2026-05-31", "kind": "공정", "site": "조립 1", "inspected": 55297, "defects": 421},
        {"id": "r0270", "date": "2026-05-31", "kind": "공정", "site": "조립 2", "inspected": 50900, "defects": 325},
        {"id": "r0271", "date": "2026-05-31", "kind": "입고", "site": "A사", "inspected": 42970, "defects": 78},
        {"id": "r0272", "date": "2026-05-31", "kind": "입고", "site": "B사", "inspected": 38197, "defects": 83},
        {"id": "r0273", "date": "2026-05-31", "kind": "입고", "site": "C사", "inspected": 40426, "defects": 142},
        {"id": "r0274", "date": "2026-05-31", "kind": "입고", "site": "D사", "inspected": 43263, "defects": 487},
        {"id": "r0275", "date": "2026-05-31", "kind": "입고", "site": "F사", "inspected": 42396, "defects": 308},
        {"id": "r0276", "date": "2026-05-31", "kind": "입고", "site": "J사", "inspected": 38050, "defects": 162},
        {"id": "r0277", "date": "2026-06-30", "kind": "출하", "site": "전 라인", "inspected": 387883, "defects": 14},
        {"id": "r0278", "date": "2026-06-30", "kind": "공정", "site": "프레스 1", "inspected": 56781, "defects": 313},
        {"id": "r0279", "date": "2026-06-30", "kind": "공정", "site": "프레스 2", "inspected": 52583, "defects": 291},
        {"id": "r0280", "date": "2026-06-30", "kind": "공정", "site": "용접 1", "inspected": 57614, "defects": 590},
        {"id": "r0281", "date": "2026-06-30", "kind": "공정", "site": "용접 2", "inspected": 56844, "defects": 540},
        {"id": "r0282", "date": "2026-06-30", "kind": "공정", "site": "도장", "inspected": 55345, "defects": 829},
        {"id": "r0283", "date": "2026-06-30", "kind": "공정", "site": "조립 1", "inspected": 53557, "defects": 347},
        {"id": "r0284", "date": "2026-06-30", "kind": "공정", "site": "조립 2", "inspected": 56051, "defects": 309},
        {"id": "r0285", "date": "2026-06-30", "kind": "입고", "site": "A사", "inspected": 34928, "defects": 59},
        {"id": "r0286", "date": "2026-06-30", "kind": "입고", "site": "B사", "inspected": 45654, "defects": 121},
        {"id": "r0287", "date": "2026-06-30", "kind": "입고", "site": "C사", "inspected": 36763, "defects": 118},
        {"id": "r0288", "date": "2026-06-30", "kind": "입고", "site": "D사", "inspected": 36114, "defects": 378},
        {"id": "r0289", "date": "2026-06-30", "kind": "입고", "site": "F사", "inspected": 43769, "defects": 316},
        {"id": "r0290", "date": "2026-06-30", "kind": "입고", "site": "J사", "inspected": 41640, "defects": 188},
        {"id": "r0291", "date": "2026-07-31", "kind": "출하", "site": "전 라인", "inspected": 373537, "defects": 12},
        {"id": "r0292", "date": "2026-07-31", "kind": "공정", "site": "프레스 1", "inspected": 52507, "defects": 232},
        {"id": "r0293", "date": "2026-07-31", "kind": "공정", "site": "프레스 2", "inspected": 57478, "defects": 336},
        {"id": "r0294", "date": "2026-07-31", "kind": "공정", "site": "용접 1", "inspected": 53410, "defects": 563},
        {"id": "r0295", "date": "2026-07-31", "kind": "공정", "site": "용접 2", "inspected": 56194, "defects": 408},
        {"id": "r0296", "date": "2026-07-31", "kind": "공정", "site": "도장", "inspected": 55415, "defects": 824},
        {"id": "r0297", "date": "2026-07-31", "kind": "공정", "site": "조립 1", "inspected": 54565, "defects": 443},
        {"id": "r0298", "date": "2026-07-31", "kind": "공정", "site": "조립 2", "inspected": 52945, "defects": 269},
        {"id": "r0299", "date": "2026-07-31", "kind": "입고", "site": "A사", "inspected": 38175, "defects": 51},
        {"id": "r0300", "date": "2026-07-31", "kind": "입고", "site": "B사", "inspected": 38408, "defects": 77},
        {"id": "r0301", "date": "2026-07-31", "kind": "입고", "site": "C사", "inspected": 37419, "defects": 148},
        {"id": "r0302", "date": "2026-07-31", "kind": "입고", "site": "D사", "inspected": 39605, "defects": 352},
        {"id": "r0303", "date": "2026-07-31", "kind": "입고", "site": "F사", "inspected": 42628, "defects": 215},
        {"id": "r0304", "date": "2026-07-31", "kind": "입고", "site": "J사", "inspected": 34980, "defects": 137},
        {"id": "r0305", "date": "2026-08-31", "kind": "출하", "site": "전 라인", "inspected": 363272, "defects": 11},
        {"id": "r0306", "date": "2026-08-31", "kind": "공정", "site": "프레스 1", "inspected": 54758, "defects": 222},
        {"id": "r0307", "date": "2026-08-31", "kind": "공정", "site": "프레스 2", "inspected": 57960, "defects": 330},
        {"id": "r0308", "date": "2026-08-31", "kind": "공정", "site": "용접 1", "inspected": 54190, "defects": 511},
        {"id": "r0309", "date": "2026-08-31", "kind": "공정", "site": "용접 2", "inspected": 49760, "defects": 368},
        {"id": "r0310", "date": "2026-08-31", "kind": "공정", "site": "도장", "inspected": 51973, "defects": 624},
        {"id": "r0311", "date": "2026-08-31", "kind": "공정", "site": "조립 1", "inspected": 56904, "defects": 386},
        {"id": "r0312", "date": "2026-08-31", "kind": "공정", "site": "조립 2", "inspected": 54453, "defects": 312},
        {"id": "r0313", "date": "2026-08-31", "kind": "입고", "site": "A사", "inspected": 41990, "defects": 54},
        {"id": "r0314", "date": "2026-08-31", "kind": "입고", "site": "B사", "inspected": 42817, "defects": 92},
        {"id": "r0315", "date": "2026-08-31", "kind": "입고", "site": "C사", "inspected": 35893, "defects": 133},
        {"id": "r0316", "date": "2026-08-31", "kind": "입고", "site": "D사", "inspected": 36500, "defects": 369},
        {"id": "r0317", "date": "2026-08-31", "kind": "입고", "site": "F사", "inspected": 46033, "defects": 277},
        {"id": "r0318", "date": "2026-08-31", "kind": "입고", "site": "J사", "inspected": 35487, "defects": 194},
        {"id": "r0319", "date": "2026-09-30", "kind": "출하", "site": "전 라인", "inspected": 361528, "defects": 12},
        {"id": "r0320", "date": "2026-09-30", "kind": "공정", "site": "프레스 1", "inspected": 56522, "defects": 242},
        {"id": "r0321", "date": "2026-09-30", "kind": "공정", "site": "프레스 2", "inspected": 52832, "defects": 290},
        {"id": "r0322", "date": "2026-09-30", "kind": "공정", "site": "용접 1", "inspected": 53066, "defects": 477},
        {"id": "r0323", "date": "2026-09-30", "kind": "공정", "site": "용접 2", "inspected": 51963, "defects": 367},
        {"id": "r0324", "date": "2026-09-30", "kind": "공정", "site": "도장", "inspected": 52609, "defects": 693},
        {"id": "r0325", "date": "2026-09-30", "kind": "공정", "site": "조립 1", "inspected": 49650, "defects": 351},
        {"id": "r0326", "date": "2026-09-30", "kind": "공정", "site": "조립 2", "inspected": 54161, "defects": 250},
        {"id": "r0327", "date": "2026-09-30", "kind": "입고", "site": "A사", "inspected": 46088, "defects": 56},
        {"id": "r0328", "date": "2026-09-30", "kind": "입고", "site": "B사", "inspected": 39682, "defects": 78},
        {"id": "r0329", "date": "2026-09-30", "kind": "입고", "site": "C사", "inspected": 41711, "defects": 165},
        {"id": "r0330", "date": "2026-09-30", "kind": "입고", "site": "D사", "inspected": 41787, "defects": 383},
        {"id": "r0331", "date": "2026-09-30", "kind": "입고", "site": "F사", "inspected": 35564, "defects": 227},
        {"id": "r0332", "date": "2026-09-30", "kind": "입고", "site": "J사", "inspected": 44258, "defects": 225},
        {"id": "r0333", "date": "2026-10-07", "kind": "출하", "site": "전 라인", "inspected": 89466, "defects": 3},
        {"id": "r0334", "date": "2026-10-07", "kind": "공정", "site": "프레스 1", "inspected": 13158, "defects": 58},
        {"id": "r0335", "date": "2026-10-07", "kind": "공정", "site": "프레스 2", "inspected": 12632, "defects": 79},
        {"id": "r0336", "date": "2026-10-07", "kind": "공정", "site": "용접 1", "inspected": 11573, "defects": 103},
        {"id": "r0337", "date": "2026-10-07", "kind": "공정", "site": "용접 2", "inspected": 12087, "defects": 88},
        {"id": "r0338", "date": "2026-10-07", "kind": "공정", "site": "도장", "inspected": 11150, "defects": 138},
        {"id": "r0339", "date": "2026-10-07", "kind": "공정", "site": "조립 1", "inspected": 11874, "defects": 86},
        {"id": "r0340", "date": "2026-10-07", "kind": "공정", "site": "조립 2", "inspected": 12265, "defects": 58},
        {"id": "r0341", "date": "2026-10-07", "kind": "입고", "site": "A사", "inspected": 10372, "defects": 17},
        {"id": "r0342", "date": "2026-10-07", "kind": "입고", "site": "B사", "inspected": 9335, "defects": 19},
        {"id": "r0343", "date": "2026-10-07", "kind": "입고", "site": "C사", "inspected": 8640, "defects": 27},
        {"id": "r0344", "date": "2026-10-07", "kind": "입고", "site": "D사", "inspected": 10225, "defects": 93},
        {"id": "r0345", "date": "2026-10-07", "kind": "입고", "site": "F사", "inspected": 10078, "defects": 47},
        {"id": "r0346", "date": "2026-10-07", "kind": "입고", "site": "J사", "inspected": 9505, "defects": 38}
      ]
    },
    {
      "id": "tasks",
      "name": "업무 일정",
      "desc": "심사, PPAP, 회의 등 기한이 있는 업무를 기록합니다.",
      "dateField": "due",
      "fields": [
        {
          "key": "title",
          "label": "업무명",
          "type": "text",
          "req": true
        },
        {
          "key": "category",
          "label": "구분",
          "type": "select",
          "options": [
            "심사",
            "PPAP",
            "8D",
            "회의",
            "협력사",
            "기타"
          ]
        },
        {
          "key": "owner",
          "label": "담당",
          "type": "ref",
          "ref": "people"
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
            "대기",
            "진행중",
            "지연",
            "완료"
          ],
          "badge": true
        },
        {
          "key": "progress",
          "label": "진행률(%)",
          "type": "number"
        },
        {
          "key": "memo",
          "label": "메모",
          "type": "longtext"
        }
      ],
      "records": [
        {"id": "r0551", "title": "8D-26-041 H사 도어래치 근본원인 분석", "category": "8D", "owner": "김민수", "due": "2026-10-03", "status": "지연", "progress": 40, "memo": ""},
        {"id": "r0552", "title": "K사 시트프레임 영구대책 검증", "category": "8D", "owner": "이서연", "due": "2026-10-10", "status": "진행중", "progress": 70, "memo": ""},
        {"id": "r0553", "title": "협력사 D사 입고 불량 급증 · 현장 감사", "category": "협력사", "owner": "박지훈", "due": "2026-10-14", "status": "진행중", "progress": 25, "memo": ""},
        {"id": "r0554", "title": "IATF 16949 내부심사 · 생산기술 부서", "category": "심사", "owner": "최유진", "due": "2026-10-17", "status": "대기", "progress": 0, "memo": ""},
        {"id": "r0555", "title": "BRK-2041 PPAP 서류 보완 (MSA, 관리계획서)", "category": "PPAP", "owner": "정하늘", "due": "2026-10-21", "status": "진행중", "progress": 55, "memo": ""},
        {"id": "r0556", "title": "LAT-3310 도어래치 설변 PPAP 치수 성적서", "category": "PPAP", "owner": "김민수", "due": "2026-10-28", "status": "진행중", "progress": 30, "memo": ""},
        {"id": "r0557", "title": "SF-1182 시트프레임 Run@Rate", "category": "PPAP", "owner": "이서연", "due": "2026-11-07", "status": "대기", "progress": 10, "memo": ""},
        {"id": "r0558", "title": "H사 품질회의 · 도어래치 8D 중간보고", "category": "회의", "owner": "김민수", "due": "2026-10-09", "status": "진행중", "progress": 80, "memo": ""},
        {"id": "r0559", "title": "협력사 품질 평가 결과 발표 (3분기)", "category": "협력사", "owner": "박지훈", "due": "2026-10-15", "status": "진행중", "progress": 60, "memo": ""},
        {"id": "r0560", "title": "H사 공정 감사 (Process Audit) 대응", "category": "심사", "owner": "김민수", "due": "2026-11-05", "status": "진행중", "progress": 35, "memo": ""},
        {"id": "r0561", "title": "K사 연간 품질 시스템 심사", "category": "심사", "owner": "이서연", "due": "2026-11-19", "status": "대기", "progress": 10, "memo": ""},
        {"id": "r0562", "title": "IATF 16949 외부 사후심사 (인증기관)", "category": "심사", "owner": "최유진", "due": "2026-12-15", "status": "진행중", "progress": 45, "memo": ""},
        {"id": "r0563", "title": "신규 차종 SOP 초기유동관리 체크리스트", "category": "기타", "owner": "정하늘", "due": "2026-11-20", "status": "진행중", "progress": 20, "memo": ""},
        {"id": "r0564", "title": "측정기 정기 교정 (3분기)", "category": "기타", "owner": "최유진", "due": "2026-09-30", "status": "완료", "progress": 100, "memo": ""},
        {"id": "r0565", "title": "생산 1팀 내부심사", "category": "심사", "owner": "최유진", "due": "2026-09-12", "status": "완료", "progress": 100, "memo": ""},
        {"id": "r0566", "title": "HG-0920 힌지 PPAP 제출", "category": "PPAP", "owner": "정하늘", "due": "2026-09-25", "status": "완료", "progress": 100, "memo": ""}
      ],
      "titleField": "title",
      "asOfField": ""
    },
    {
      "id": "memos",
      "name": "메모 · 회의록",
      "desc": "회의 결과, 공지, 공정 이슈 등 짧은 메모를 기록합니다.",
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
            "일정",
            "공정 이슈",
            "협력사",
            "공지",
            "체크 포인트",
            "기타"
          ]
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
      "records": [
        {"id": "r0567", "date": "2026-10-06", "category": "회의", "content": "10/9 H사 품질회의: 도어래치 8D 중간보고", "owner": "김민수"},
        {"id": "r0568", "date": "2026-10-06", "category": "협력사", "content": "10/15 협력사 품질 평가 결과 발표 · 등급 하향 2개사", "owner": "박지훈"},
        {"id": "r0569", "date": "2026-10-05", "category": "일정", "content": "11/30 IATF 16949 내부심사 완료 목표 · 12월 외부 사후심사", "owner": "최유진"},
        {"id": "r0570", "date": "2026-10-02", "category": "일정", "content": "신규 차종 양산 이행(SOP) 11/20 · 초기유동관리 체크리스트 준비", "owner": "정하늘"},
        {"id": "r0571", "date": "2026-10-06", "category": "공정 이슈", "content": "도장 라인 핀홀 증가: 10/6 부스 필터 교체 후 재측정 예정", "owner": "최유진"},
        {"id": "r0572", "date": "2026-10-03", "category": "공정 이슈", "content": "용접 1 라인 너겟 직경 Cpk 1.21: 전극팁 교체 주기 단축 검토", "owner": "이서연"},
        {"id": "r0573", "date": "2026-09-29", "category": "공정 이슈", "content": "프레스 2 홀 위치도: 금형 보수 후 초·중·종물 검사 강화", "owner": "박지훈"},
        {"id": "r0574", "date": "2026-09-22", "category": "회의", "content": "K사 분기 품질회의: 시트프레임 용접 크랙 대책 공유", "owner": "이서연"},
        {"id": "r0575", "date": "2026-09-15", "category": "공지", "content": "측정기 정기 교정 일정 공지 (9/30 마감)", "owner": "최유진"},
        {"id": "r0576", "date": "2026-09-02", "category": "협력사", "content": "D사 입고 불량 증가 · 개선계획 제출 요청", "owner": "박지훈"},
        {"id": "r0577", "date": "2026-08-28", "category": "공정 이슈", "content": "조립 2 라인 체결 토크 산포 증가: 공구 교정", "owner": "정하늘"},
        {"id": "r0578", "date": "2026-08-12", "category": "회의", "content": "H사 공정 감사 사전 점검 회의", "owner": "김민수"},
        {"id": "r0579", "date": "2026-03-02", "category": "체크 포인트", "content": "PPAP 제출 전 18개 요구 문서 체크리스트 확인 (PSW, FMEA, 관리계획서, MSA, 초기공정능력 등)", "owner": "정하늘"},
        {"id": "r0580", "date": "2026-03-02", "category": "체크 포인트", "content": "초기유동관리 기간 중 전수검사 · 일일 품질회의 결과 기록", "owner": "정하늘"},
        {"id": "r0581", "date": "2026-03-02", "category": "체크 포인트", "content": "설계변경(ECN) 발생 시 재승인(PPAP 재제출) 필요 여부 판단", "owner": "정하늘"}
      ]
    },
    {
      "id": "cpk",
      "name": "공정능력 (Cpk)",
      "desc": "관리 특성별 공정능력지수 측정 결과를 기록합니다.",
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
        {"id": "r0582", "date": "2026-09-30", "char": "도장 막두께", "line": "도장", "spec": "20±5㎛", "cpk": 1.08, "judge": "심각"},
        {"id": "r0583", "date": "2026-09-30", "char": "용접 너겟 직경", "line": "용접 1", "spec": "≥5.0mm", "cpk": 1.21, "judge": "주의"},
        {"id": "r0584", "date": "2026-09-30", "char": "홀 위치도", "line": "프레스 2", "spec": "Ø0.3", "cpk": 1.29, "judge": "주의"},
        {"id": "r0585", "date": "2026-09-30", "char": "볼트 체결 토크", "line": "조립 1", "spec": "25±3N·m", "cpk": 1.52, "judge": "정상"},
        {"id": "r0586", "date": "2026-09-30", "char": "플랜지 평면도", "line": "프레스 1", "spec": "0.5", "cpk": 1.67, "judge": "정상"},
        {"id": "r0587", "date": "2026-09-30", "char": "트림 라인 치수", "line": "프레스 2", "spec": "-", "cpk": 1.84, "judge": "정상"},
        {"id": "r0588", "date": "2026-09-30", "char": "피어싱 홀 경", "line": "조립 1", "spec": "-", "cpk": 1.45, "judge": "정상"},
        {"id": "r0589", "date": "2026-09-30", "char": "비드 높이", "line": "용접 2", "spec": "-", "cpk": 1.81, "judge": "정상"},
        {"id": "r0590", "date": "2026-09-30", "char": "용접 위치", "line": "프레스 2", "spec": "-", "cpk": 1.66, "judge": "정상"},
        {"id": "r0591", "date": "2026-09-30", "char": "용접 강도", "line": "조립 2", "spec": "-", "cpk": 1.58, "judge": "정상"},
        {"id": "r0592", "date": "2026-09-30", "char": "도막 광택", "line": "도장", "spec": "-", "cpk": 2.01, "judge": "정상"},
        {"id": "r0593", "date": "2026-09-30", "char": "도장 밀착력", "line": "조립 2", "spec": "-", "cpk": 1.6, "judge": "정상"},
        {"id": "r0594", "date": "2026-09-30", "char": "커넥터 체결력", "line": "용접 1", "spec": "-", "cpk": 2.09, "judge": "정상"},
        {"id": "r0595", "date": "2026-09-30", "char": "클립 이탈력", "line": "용접 2", "spec": "-", "cpk": 2.03, "judge": "정상"},
        {"id": "r0596", "date": "2026-09-30", "char": "외관 단차", "line": "프레스 1", "spec": "-", "cpk": 1.94, "judge": "정상"},
        {"id": "r0597", "date": "2026-09-30", "char": "갭 균일도", "line": "프레스 2", "spec": "-", "cpk": 1.5, "judge": "정상"},
        {"id": "r0598", "date": "2026-09-30", "char": "버 높이", "line": "조립 1", "spec": "-", "cpk": 1.8, "judge": "정상"},
        {"id": "r0599", "date": "2026-09-30", "char": "판 두께", "line": "용접 1", "spec": "-", "cpk": 2.19, "judge": "정상"},
        {"id": "r0600", "date": "2026-09-30", "char": "R 형상", "line": "프레스 1", "spec": "-", "cpk": 1.5, "judge": "정상"},
        {"id": "r0601", "date": "2026-09-30", "char": "레이저 마킹 위치", "line": "조립 2", "spec": "-", "cpk": 1.73, "judge": "정상"},
        {"id": "r0602", "date": "2026-09-30", "char": "실러 도포 폭", "line": "조립 2", "spec": "-", "cpk": 2.12, "judge": "정상"},
        {"id": "r0603", "date": "2026-09-30", "char": "토크 각도", "line": "용접 1", "spec": "-", "cpk": 2.13, "judge": "정상"},
        {"id": "r0604", "date": "2026-09-30", "char": "누설 압력", "line": "프레스 2", "spec": "-", "cpk": 1.43, "judge": "정상"},
        {"id": "r0605", "date": "2026-09-30", "char": "부품 중량", "line": "조립 2", "spec": "-", "cpk": 1.68, "judge": "정상"}
      ]
    },
    {
      "id": "suppliers",
      "name": "협력사 평가",
      "desc": "협력사 정기 품질 평가 점수와 등급을 기록합니다.",
      "dateField": "date",
      "titleField": "name",
      "fields": [
        {
          "key": "name",
          "label": "협력사",
          "type": "ref",
          "req": true,
          "ref": "vendors"
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
            "도금",
            "고무",
            "전장"
          ]
        },
        {
          "key": "score",
          "label": "평가 점수",
          "type": "number"
        },
        {
          "key": "grade",
          "label": "등급",
          "type": "select",
          "options": [
            "A",
            "B",
            "C"
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
            "정상",
            "주의",
            "심각"
          ],
          "badge": true
        }
      ],
      "records": [
        {"id": "r0606", "name": "A사", "date": "2026-09-30", "process": "프레스", "score": 92, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0607", "name": "B사", "date": "2026-09-30", "process": "프레스", "score": 88, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0608", "name": "C사", "date": "2026-09-30", "process": "사출", "score": 81, "grade": "B", "action": "월 1회 품질 미팅", "status": "주의"},
        {"id": "r0609", "name": "D사", "date": "2026-09-30", "process": "사출", "score": 64, "grade": "C", "action": "현장 감사 · 개선계획 요구", "status": "심각"},
        {"id": "r0610", "name": "F사", "date": "2026-09-30", "process": "도금", "score": 68, "grade": "C", "action": "개선계획 제출 (10/20)", "status": "심각"},
        {"id": "r0611", "name": "J사", "date": "2026-09-30", "process": "사출", "score": 71, "grade": "C", "action": "입고 전수검사 전환", "status": "주의"},
        {"id": "r0612", "name": "E사", "date": "2026-09-30", "process": "사출", "score": 97, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0613", "name": "G사", "date": "2026-09-30", "process": "전장", "score": 87, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0614", "name": "H사", "date": "2026-09-30", "process": "전장", "score": 94, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0615", "name": "K사", "date": "2026-09-30", "process": "사출", "score": 91, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0616", "name": "L사", "date": "2026-09-30", "process": "사출", "score": 86, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0617", "name": "M사", "date": "2026-09-30", "process": "고무", "score": 93, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0618", "name": "N사", "date": "2026-09-30", "process": "프레스", "score": 91, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0619", "name": "P사", "date": "2026-09-30", "process": "고무", "score": 87, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0620", "name": "Q사", "date": "2026-09-30", "process": "도금", "score": 94, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0621", "name": "R사", "date": "2026-09-30", "process": "고무", "score": 96, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0622", "name": "S사", "date": "2026-09-30", "process": "프레스", "score": 94, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0623", "name": "T사", "date": "2026-09-30", "process": "프레스", "score": 96, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0624", "name": "U사", "date": "2026-09-30", "process": "고무", "score": 96, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0625", "name": "V사", "date": "2026-09-30", "process": "전장", "score": 91, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0626", "name": "W사", "date": "2026-09-30", "process": "도금", "score": 86, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0627", "name": "가람산업", "date": "2026-09-30", "process": "고무", "score": 96, "grade": "A", "action": "-", "status": "정상"},
        {"id": "r0628", "name": "대성정밀", "date": "2026-09-30", "process": "프레스", "score": 76, "grade": "B", "action": "공정 감사 예정", "status": "주의"},
        {"id": "r0629", "name": "미래금속", "date": "2026-09-30", "process": "사출", "score": 84, "grade": "B", "action": "분기 품질 미팅", "status": "주의"},
        {"id": "r0630", "name": "세화테크", "date": "2026-09-30", "process": "고무", "score": 77, "grade": "B", "action": "공정 감사 예정", "status": "주의"},
        {"id": "r0631", "name": "우진화학", "date": "2026-09-30", "process": "도금", "score": 82, "grade": "B", "action": "분기 품질 미팅", "status": "주의"},
        {"id": "r0632", "name": "한빛사출", "date": "2026-09-30", "process": "고무", "score": 84, "grade": "B", "action": "분기 품질 미팅", "status": "주의"},
        {"id": "r0633", "name": "동양도금", "date": "2026-09-30", "process": "고무", "score": 79, "grade": "B", "action": "공정 감사 예정", "status": "주의"},
        {"id": "r0634", "name": "성원전자", "date": "2026-09-30", "process": "사출", "score": 78, "grade": "B", "action": "공정 감사 예정", "status": "주의"},
        {"id": "r0635", "name": "태광고무", "date": "2026-09-30", "process": "사출", "score": 79, "grade": "B", "action": "분기 품질 미팅", "status": "주의"},
        {"id": "r0636", "name": "삼진프레스", "date": "2026-09-30", "process": "고무", "score": 76, "grade": "B", "action": "공정 감사 예정", "status": "주의"}
      ]
    },
    {
      "id": "nc",
      "name": "부적합 (심사 지적)",
      "desc": "내부·고객·인증 심사에서 나온 부적합 사항과 시정 조치를 기록합니다.",
      "dateField": "issued",
      "titleField": "clause",
      "fields": [
        {
          "key": "no",
          "label": "번호",
          "type": "text",
          "auto": "NC-{YY}-",
          "req": true
        },
        {
          "key": "issued",
          "label": "발행일",
          "type": "date",
          "req": true
        },
        {
          "key": "clause",
          "label": "조항 · 내용",
          "type": "text",
          "req": true
        },
        {
          "key": "level",
          "label": "등급",
          "type": "select",
          "options": [
            "Major",
            "Minor"
          ]
        },
        {
          "key": "dept",
          "label": "부서",
          "type": "select",
          "options": [
            "품질보증",
            "생산 1팀",
            "생산 2팀",
            "구매",
            "개발",
            "생산기술",
            "영업·고객지원"
          ]
        },
        {
          "key": "due",
          "label": "기한",
          "type": "date"
        },
        {
          "key": "status",
          "label": "상태",
          "type": "select",
          "options": [
            "대기",
            "진행중",
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
        {"id": "r0637", "no": "NC-26-01", "issued": "2026-06-10", "clause": "7.5.3 문서 관리", "level": "Minor", "dept": "품질보증", "due": "2026-07-10", "status": "완료", "closed": "2026-07-02"},
        {"id": "r0638", "no": "NC-26-02", "issued": "2026-06-10", "clause": "8.5.1.3 작업 셋업 검증", "level": "Minor", "dept": "생산 1팀", "due": "2026-07-10", "status": "완료", "closed": "2026-07-08"},
        {"id": "r0639", "no": "NC-26-03", "issued": "2026-07-15", "clause": "9.1.1.1 공정 모니터링", "level": "Major", "dept": "생산 1팀", "due": "2026-08-15", "status": "완료", "closed": "2026-08-20"},
        {"id": "r0640", "no": "NC-26-04", "issued": "2026-07-15", "clause": "7.1.5.1 측정 시스템 분석", "level": "Minor", "dept": "품질보증", "due": "2026-08-15", "status": "완료", "closed": "2026-08-11"},
        {"id": "r0641", "no": "NC-26-05", "issued": "2026-08-20", "clause": "8.7.1 부적합 출력물 관리", "level": "Minor", "dept": "생산 2팀", "due": "2026-09-20", "status": "완료", "closed": "2026-09-18"},
        {"id": "r0642", "no": "NC-26-06", "issued": "2026-08-20", "clause": "8.3.3 설계 입력", "level": "Minor", "dept": "개발", "due": "2026-09-20", "status": "완료", "closed": "2026-09-25"},
        {"id": "r0643", "no": "NC-26-07", "issued": "2026-09-22", "clause": "8.5.1.1 관리계획서", "level": "Major", "dept": "생산 2팀", "due": "2026-10-25", "status": "진행중", "closed": ""},
        {"id": "r0644", "no": "NC-26-08", "issued": "2026-09-22", "clause": "7.1.5.2 측정기 교정", "level": "Minor", "dept": "품질보증", "due": "2026-10-15", "status": "완료", "closed": "2026-10-05"},
        {"id": "r0645", "no": "NC-26-09", "issued": "2026-09-29", "clause": "8.4.2.4 협력사 모니터링", "level": "Minor", "dept": "구매", "due": "2026-10-30", "status": "진행중", "closed": ""},
        {"id": "r0646", "no": "NC-26-10", "issued": "2026-09-29", "clause": "7.2.1 역량 · 교육", "level": "Minor", "dept": "생산 1팀", "due": "2026-10-20", "status": "대기", "closed": ""},
        {"id": "r0647", "no": "NC-26-11", "issued": "2026-10-01", "clause": "10.2.3 문제 해결", "level": "Minor", "dept": "품질보증", "due": "2026-10-31", "status": "진행중", "closed": ""}
      ]
    },
    {
      "id": "auditplan",
      "name": "내부심사 계획",
      "desc": "IATF 16949 내부심사 부서별 일정과 진행률을 기록합니다.",
      "dateField": "date",
      "titleField": "dept",
      "asOfField": "",
      "fields": [
        {
          "key": "dept",
          "label": "부서",
          "type": "text",
          "req": true
        },
        {
          "key": "date",
          "label": "심사일",
          "type": "date"
        },
        {
          "key": "auditor",
          "label": "심사원",
          "type": "ref",
          "ref": "people"
        },
        {
          "key": "progress",
          "label": "진행률(%)",
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
        {"id": "r0648", "dept": "품질보증", "date": "2026-08-25", "auditor": "최유진", "progress": 100, "status": "완료"},
        {"id": "r0649", "dept": "생산 1팀", "date": "2026-09-12", "auditor": "최유진", "progress": 100, "status": "완료"},
        {"id": "r0650", "dept": "생산 2팀", "date": "2026-09-26", "auditor": "이서연", "progress": 80, "status": "진행중"},
        {"id": "r0651", "dept": "구매·협력사", "date": "2026-10-02", "auditor": "박지훈", "progress": 70, "status": "진행중"},
        {"id": "r0652", "dept": "생산기술", "date": "2026-10-17", "auditor": "최유진", "progress": 30, "status": "진행중"},
        {"id": "r0653", "dept": "영업·고객지원", "date": "2026-11-12", "auditor": "정하늘", "progress": 0, "status": "예정"}
      ]
    },
    {
      "id": "launch",
      "name": "초기유동관리",
      "desc": "신규 양산(SOP) 품번의 초기유동관리 기간을 관리합니다. 경과 일수는 기준일 기준으로 자동 계산됩니다.",
      "dateField": "sop",
      "titleField": "part",
      "fields": [
        {
          "key": "part",
          "label": "품번 · 품명",
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
          "key": "sop",
          "label": "SOP일",
          "type": "date",
          "req": true
        },
        {
          "key": "elapsed",
          "label": "경과 일수",
          "type": "days",
          "from": "sop",
          "to": "@today"
        },
        {
          "key": "note",
          "label": "비고",
          "type": "text"
        }
      ],
      "records": [
        {"id": "r0654", "part": "LAT-3290 도어래치", "customer": "H사", "sop": "2026-07-18", "note": "일일 품질회의 운영"},
        {"id": "r0655", "part": "BRK-1990 브라켓", "customer": "K사", "sop": "2026-08-09", "note": ""},
        {"id": "r0656", "part": "SF-1150 시트프레임", "customer": "K사", "sop": "2026-09-03", "note": "용접부 전수검사"},
        {"id": "r0657", "part": "GB-2200 글로브박스", "customer": "G사", "sop": "2026-09-26", "note": ""},
        {"id": "r0658", "part": "HG-0810 힌지", "customer": "R사", "sop": "2026-04-02", "note": "종료 보고 완료"},
        {"id": "r0659", "part": "CV-4400 콘솔 커버", "customer": "H사", "sop": "2026-05-20", "note": "종료 보고 완료"}
      ]
    },
    {
      "id": "ppap",
      "name": "PPAP",
      "desc": "신규·변경 부품의 양산 승인(PPAP) 진행을 기록합니다.",
      "dateField": "due",
      "titleField": "name",
      "asOfField": "",
      "fields": [
        {
          "key": "partno",
          "label": "품번",
          "type": "text",
          "req": true
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
          "label": "제출 수준",
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
          "label": "현재 단계",
          "type": "text"
        },
        {
          "key": "due",
          "label": "제출 기한",
          "type": "date"
        },
        {
          "key": "status",
          "label": "상태",
          "type": "select",
          "options": [
            "대기",
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
        {"id": "r0660", "partno": "BRK-2041", "name": "리어 브라켓", "customer": "H사", "level": "Level 3", "stage": "서류 보완 (MSA, 관리계획서)", "due": "2026-10-21", "status": "지연", "approved": ""},
        {"id": "r0661", "partno": "LAT-3310", "name": "도어래치 ASSY (설변)", "customer": "H사", "level": "Level 3", "stage": "치수 검사 성적서 작성", "due": "2026-10-28", "status": "진행중", "approved": ""},
        {"id": "r0662", "partno": "SF-1182", "name": "시트프레임 (신규)", "customer": "K사", "level": "Level 3", "stage": "Run@Rate 실시", "due": "2026-11-07", "status": "진행중", "approved": ""},
        {"id": "r0663", "partno": "HG-0920", "name": "힌지 ASSY", "customer": "R사", "level": "Level 2", "stage": "고객 검토 중", "due": "2026-10-15", "status": "대기", "approved": ""},
        {"id": "r0664", "partno": "CV-4471", "name": "콘솔 커버 (색상 변경)", "customer": "G사", "level": "Level 1", "stage": "외관 승인 샘플 제출", "due": "2026-10-30", "status": "진행중", "approved": ""},
        {"id": "r0665", "partno": "P2000", "name": "힌지", "customer": "R사", "level": "Level 3", "stage": "승인 완료", "due": "2026-01-08", "status": "승인", "approved": "2026-01-12"},
        {"id": "r0666", "partno": "P2007", "name": "글로브박스", "customer": "R사", "level": "Level 3", "stage": "승인 완료", "due": "2026-01-24", "status": "승인", "approved": "2026-02-03"},
        {"id": "r0667", "partno": "P2014", "name": "암레스트", "customer": "G사", "level": "Level 2", "stage": "승인 완료", "due": "2026-01-09", "status": "승인", "approved": "2026-01-18"},
        {"id": "r0668", "partno": "P2021", "name": "커넥터 하우징", "customer": "G사", "level": "Level 3", "stage": "승인 완료", "due": "2026-02-04", "status": "승인", "approved": "2026-02-07"},
        {"id": "r0669", "partno": "P2028", "name": "커넥터 하우징", "customer": "G사", "level": "Level 2", "stage": "승인 완료", "due": "2026-02-08", "status": "승인", "approved": "2026-02-17"},
        {"id": "r0670", "partno": "P2035", "name": "힌지", "customer": "K사", "level": "Level 3", "stage": "승인 완료", "due": "2026-02-24", "status": "승인", "approved": "2026-03-03"},
        {"id": "r0671", "partno": "P2042", "name": "클립", "customer": "G사", "level": "Level 3", "stage": "승인 완료", "due": "2026-03-14", "status": "승인", "approved": "2026-03-26"},
        {"id": "r0672", "partno": "P2049", "name": "콘솔 커버", "customer": "H사", "level": "Level 3", "stage": "승인 완료", "due": "2026-03-14", "status": "승인", "approved": "2026-03-26"},
        {"id": "r0673", "partno": "P2056", "name": "브라켓", "customer": "K사", "level": "Level 3", "stage": "승인 완료", "due": "2026-04-22", "status": "승인", "approved": "2026-05-05"},
        {"id": "r0674", "partno": "P2063", "name": "도어래치", "customer": "R사", "level": "Level 2", "stage": "승인 완료", "due": "2026-04-24", "status": "승인", "approved": "2026-05-02"},
        {"id": "r0675", "partno": "P2070", "name": "도어래치", "customer": "K사", "level": "Level 2", "stage": "승인 완료", "due": "2026-04-12", "status": "승인", "approved": "2026-04-26"},
        {"id": "r0676", "partno": "P2077", "name": "클립", "customer": "K사", "level": "Level 3", "stage": "승인 완료", "due": "2026-05-13", "status": "승인", "approved": "2026-05-25"},
        {"id": "r0677", "partno": "P2084", "name": "글로브박스", "customer": "H사", "level": "Level 3", "stage": "승인 완료", "due": "2026-05-21", "status": "승인", "approved": "2026-06-02"},
        {"id": "r0678", "partno": "P2091", "name": "클립", "customer": "R사", "level": "Level 3", "stage": "승인 완료", "due": "2026-06-12", "status": "승인", "approved": "2026-06-17"},
        {"id": "r0679", "partno": "P2098", "name": "클립", "customer": "G사", "level": "Level 3", "stage": "승인 완료", "due": "2026-06-19", "status": "승인", "approved": "2026-06-22"},
        {"id": "r0680", "partno": "P2105", "name": "시트레일", "customer": "G사", "level": "Level 3", "stage": "승인 완료", "due": "2026-06-04", "status": "승인", "approved": "2026-06-06"},
        {"id": "r0681", "partno": "P2112", "name": "도어래치", "customer": "G사", "level": "Level 2", "stage": "승인 완료", "due": "2026-07-04", "status": "승인", "approved": "2026-07-14"},
        {"id": "r0682", "partno": "P2119", "name": "콘솔 커버", "customer": "G사", "level": "Level 3", "stage": "승인 완료", "due": "2026-07-06", "status": "승인", "approved": "2026-07-11"},
        {"id": "r0683", "partno": "P2126", "name": "글로브박스", "customer": "K사", "level": "Level 3", "stage": "승인 완료", "due": "2026-08-13", "status": "승인", "approved": "2026-08-19"},
        {"id": "r0684", "partno": "P2133", "name": "커넥터 하우징", "customer": "H사", "level": "Level 3", "stage": "승인 완료", "due": "2026-08-07", "status": "승인", "approved": "2026-08-20"},
        {"id": "r0685", "partno": "P2140", "name": "도어래치", "customer": "R사", "level": "Level 3", "stage": "승인 완료", "due": "2026-08-12", "status": "승인", "approved": "2026-08-15"},
        {"id": "r0686", "partno": "P2147", "name": "콘솔 커버", "customer": "K사", "level": "Level 3", "stage": "승인 완료", "due": "2026-09-06", "status": "승인", "approved": "2026-09-08"},
        {"id": "r0687", "partno": "P2154", "name": "시트레일", "customer": "G사", "level": "Level 3", "stage": "승인 완료", "due": "2026-09-06", "status": "승인", "approved": "2026-09-16"}
      ]
    }
  ],
  "pages": [
    {
      "id": "overview",
      "title": "종합 현황",
      "group": "현황판",
      "desc": "이번 달 핵심 품질 지표와 즉시 조치가 필요한 항목",
      "widgets": [
        {
          "type": "kpi",
          "items": [
            {
              "label": "고객 클레임",
              "unit": "건",
              "src": {
                "ds": "claims",
                "agg": "count",
                "filter": [],
                "period": "thisMonth",
                "compare": true,
                "spark": true
              },
              "lowerIsBetter": true
            },
            {
              "label": "출하 불량률",
              "unit": "PPM",
              "src": {
                "ds": "inspections",
                "agg": "ratio",
                "filter": [
                  {
                    "f": "kind",
                    "op": "=",
                    "v": "출하"
                  }
                ],
                "period": "thisMonth",
                "compare": true,
                "spark": true,
                "field": "defects",
                "field2": "inspected",
                "scale": 1000000
              },
              "goal": 30,
              "lowerIsBetter": true,
              "status": "auto"
            },
            {
              "label": "8D 미결",
              "unit": "건",
              "src": {
                "ds": "capa",
                "agg": "count",
                "filter": [
                  {
                    "f": "status",
                    "op": "!=",
                    "v": "완료"
                  }
                ],
                "period": "all"
              },
              "goal": 6,
              "lowerIsBetter": true,
              "status": "auto"
            },
            {
              "label": "입고 불량률",
              "unit": "%",
              "src": {
                "ds": "inspections",
                "agg": "ratio",
                "filter": [
                  {
                    "f": "kind",
                    "op": "=",
                    "v": "입고"
                  }
                ],
                "period": "thisMonth",
                "compare": true,
                "spark": true,
                "field": "defects",
                "field2": "inspected",
                "scale": 100
              },
              "goal": 0.4,
              "lowerIsBetter": true,
              "status": "auto"
            },
            {
              "label": "클레임 비용",
              "unit": "만원",
              "src": {
                "ds": "claims",
                "agg": "sum",
                "filter": [],
                "field": "cost",
                "period": "thisMonth",
                "compare": true,
                "spark": true
              },
              "lowerIsBetter": true
            },
            {
              "label": "평균 처리 기간",
              "unit": "일",
              "src": {
                "ds": "claims",
                "agg": "avg",
                "filter": [
                  {
                    "f": "status",
                    "op": "=",
                    "v": "완료"
                  }
                ],
                "field": "lead",
                "period": "last3m"
              },
              "goal": 10,
              "lowerIsBetter": true,
              "status": "auto",
              "deltaLabel": "최근 3개월 완료 건"
            }
          ]
        },
        {
          "type": "line",
          "span": 7,
          "title": "월별 출하 불량률",
          "subtitle": "검사 실적 기준",
          "unit": "PPM",
          "target": 30,
          "src": {
            "ds": "inspections",
            "agg": "ratio",
            "filter": [
              {
                "f": "kind",
                "op": "=",
                "v": "출하"
              }
            ],
            "x": "month",
            "months": 10,
            "field": "defects",
            "field2": "inspected",
            "scale": 1000000
          }
        },
        {
          "type": "bar",
          "span": 5,
          "title": "고객사별 클레임 (최근 3개월)",
          "unit": "건",
          "src": {
            "ds": "claims",
            "agg": "count",
            "filter": [],
            "x": "customer",
            "period": "last3m"
          }
        },
        {
          "type": "tasks",
          "span": 7,
          "title": "즉시 조치 필요",
          "src": {
            "ds": "tasks",
            "filter": [
              {
                "f": "status",
                "op": "!=",
                "v": "완료"
              }
            ],
            "limit": 6,
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
          "span": 5,
          "title": "최근 메모",
          "src": {
            "ds": "memos",
            "period": "all",
            "filter": [
              {
                "f": "category",
                "op": "!=",
                "v": "공정 이슈"
              },
              {
                "f": "category",
                "op": "!=",
                "v": "체크 포인트"
              }
            ],
            "main": "content",
            "pre": "date",
            "post": "owner",
            "limit": 5
          }
        }
      ]
    },
    {
      "id": "claims",
      "title": "고객 클레임",
      "group": "품질 현황",
      "desc": "완성차 고객사(OEM) 클레임 접수·처리 현황",
      "widgets": [
        {
          "type": "kpi",
          "items": [
            {
              "label": "이번 달 접수",
              "unit": "건",
              "src": {
                "ds": "claims",
                "agg": "count",
                "filter": [],
                "period": "thisMonth",
                "compare": true,
                "spark": true
              },
              "lowerIsBetter": true
            },
            {
              "label": "미결 클레임",
              "unit": "건",
              "src": {
                "ds": "claims",
                "agg": "count",
                "filter": [
                  {
                    "f": "status",
                    "op": "!=",
                    "v": "완료"
                  }
                ],
                "period": "all"
              },
              "goal": 8,
              "lowerIsBetter": true,
              "status": "auto"
            },
            {
              "label": "평균 처리 기간",
              "unit": "일",
              "src": {
                "ds": "claims",
                "agg": "avg",
                "filter": [
                  {
                    "f": "status",
                    "op": "=",
                    "v": "완료"
                  }
                ],
                "field": "lead",
                "period": "last3m"
              },
              "goal": 10,
              "lowerIsBetter": true,
              "status": "auto",
              "deltaLabel": "최근 3개월 완료 건"
            },
            {
              "label": "올해 클레임 비용",
              "unit": "만원",
              "src": {
                "ds": "claims",
                "agg": "sum",
                "filter": [],
                "field": "cost",
                "period": "ytd"
              }
            }
          ]
        },
        {
          "type": "bar",
          "span": 7,
          "title": "월별 클레임 접수 (고객사별)",
          "unit": "건",
          "stacked": true,
          "src": {
            "ds": "claims",
            "agg": "count",
            "filter": [],
            "x": "month",
            "months": 6,
            "series": "customer"
          }
        },
        {
          "type": "hbar",
          "span": 5,
          "title": "불량 유형별 (최근 3개월)",
          "unit": "건",
          "src": {
            "ds": "claims",
            "agg": "count",
            "filter": [],
            "by": "type",
            "period": "last3m",
            "top": 6
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
            "sort": "date",
            "limit": 10
          }
        }
      ]
    },
    {
      "id": "capa",
      "title": "8D / 시정조치",
      "group": "품질 현황",
      "desc": "8D 리포트 및 시정·예방조치(CAPA) 진행 현황",
      "widgets": [
        {
          "type": "kpi",
          "items": [
            {
              "label": "진행 중",
              "unit": "건",
              "src": {
                "ds": "capa",
                "agg": "count",
                "filter": [
                  {
                    "f": "status",
                    "op": "!=",
                    "v": "완료"
                  }
                ],
                "period": "all"
              },
              "goal": 6,
              "lowerIsBetter": true,
              "status": "auto"
            },
            {
              "label": "기한 초과",
              "unit": "건",
              "src": {
                "ds": "capa",
                "agg": "count",
                "filter": [
                  {
                    "f": "status",
                    "op": "!=",
                    "v": "완료"
                  },
                  {
                    "f": "due",
                    "op": "<",
                    "v": "today"
                  }
                ],
                "period": "all"
              },
              "goal": 0,
              "lowerIsBetter": true,
              "status": "auto"
            },
            {
              "label": "이번 달 완료",
              "unit": "건",
              "src": {
                "ds": "capa",
                "agg": "count",
                "filter": [
                  {
                    "f": "status",
                    "op": "=",
                    "v": "완료"
                  }
                ],
                "period": "thisMonth",
                "dateField": "closed",
                "compare": true
              }
            },
            {
              "label": "평균 완료 기간",
              "unit": "일",
              "src": {
                "ds": "capa",
                "agg": "avg",
                "filter": [
                  {
                    "f": "status",
                    "op": "=",
                    "v": "완료"
                  }
                ],
                "field": "lead",
                "period": "ytd"
              },
              "goal": 21,
              "lowerIsBetter": true,
              "status": "auto",
              "deltaLabel": "올해 완료 건"
            }
          ]
        },
        {
          "type": "progress",
          "span": 5,
          "title": "진행 중 8D 단계별 분포",
          "src": {
            "ds": "capa",
            "by": "step",
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
          "type": "table",
          "span": 7,
          "title": "진행 중 8D 목록",
          "src": {
            "ds": "capa",
            "period": "all",
            "filter": [
              {
                "f": "status",
                "op": "!=",
                "v": "완료"
              }
            ],
            "cols": [
              "no",
              "subject",
              "step",
              "owner",
              "due",
              "status"
            ],
            "sort": "due",
            "asc": true
          }
        }
      ]
    },
    {
      "id": "supplier",
      "title": "협력사 품질",
      "group": "품질 현황",
      "desc": "협력사 입고 검사 결과와 품질 등급",
      "widgets": [
        {
          "type": "kpi",
          "items": [
            {
              "label": "입고 불량률",
              "unit": "%",
              "src": {
                "ds": "inspections",
                "agg": "ratio",
                "filter": [
                  {
                    "f": "kind",
                    "op": "=",
                    "v": "입고"
                  }
                ],
                "period": "thisMonth",
                "compare": true,
                "spark": true,
                "field": "defects",
                "field2": "inspected",
                "scale": 100
              },
              "goal": 0.4,
              "lowerIsBetter": true,
              "status": "auto"
            },
            {
              "label": "입고 불량 발생",
              "unit": "건",
              "src": {
                "ds": "defects",
                "agg": "count",
                "filter": [
                  {
                    "f": "kind",
                    "op": "=",
                    "v": "입고"
                  }
                ],
                "period": "thisMonth",
                "compare": true
              },
              "lowerIsBetter": true
            },
            {
              "label": "A등급 협력사",
              "unit": "개사",
              "src": {
                "ds": "suppliers",
                "agg": "count",
                "filter": [
                  {
                    "f": "grade",
                    "op": "=",
                    "v": "A"
                  }
                ],
                "period": "all"
              },
              "deltaLabel": "최근 정기 평가"
            },
            {
              "label": "C등급 (개선 요구)",
              "unit": "개사",
              "src": {
                "ds": "suppliers",
                "agg": "count",
                "filter": [
                  {
                    "f": "grade",
                    "op": "=",
                    "v": "C"
                  }
                ],
                "period": "all"
              },
              "goal": 0,
              "lowerIsBetter": true,
              "status": "auto"
            }
          ]
        },
        {
          "type": "line",
          "span": 7,
          "title": "월별 입고 불량률",
          "unit": "%",
          "target": 0.4,
          "src": {
            "ds": "inspections",
            "agg": "ratio",
            "filter": [
              {
                "f": "kind",
                "op": "=",
                "v": "입고"
              }
            ],
            "x": "month",
            "months": 10,
            "field": "defects",
            "field2": "inspected",
            "scale": 100
          }
        },
        {
          "type": "hbar",
          "span": 5,
          "title": "협력사별 입고 불량률 (최근 3개월)",
          "unit": "%",
          "src": {
            "ds": "inspections",
            "agg": "ratio",
            "filter": [
              {
                "f": "kind",
                "op": "=",
                "v": "입고"
              }
            ],
            "by": "site",
            "period": "last3m",
            "top": 6,
            "field": "defects",
            "field2": "inspected",
            "scale": 100
          }
        },
        {
          "type": "table",
          "span": 12,
          "title": "협력사 품질 평가 (점수 하위)",
          "src": {
            "ds": "suppliers",
            "period": "all",
            "filter": [],
            "cols": [
              "name",
              "process",
              "score",
              "grade",
              "action",
              "status"
            ],
            "sort": "score",
            "asc": true,
            "limit": 8
          }
        }
      ]
    },
    {
      "id": "process",
      "title": "공정 품질",
      "group": "품질 현황",
      "desc": "라인별 공정 불량률과 주요 특성 공정능력(Cpk)",
      "widgets": [
        {
          "type": "kpi",
          "items": [
            {
              "label": "공정 불량률",
              "unit": "%",
              "src": {
                "ds": "inspections",
                "agg": "ratio",
                "filter": [
                  {
                    "f": "kind",
                    "op": "=",
                    "v": "공정"
                  }
                ],
                "period": "thisMonth",
                "compare": true,
                "spark": true,
                "field": "defects",
                "field2": "inspected",
                "scale": 100
              },
              "goal": 0.8,
              "lowerIsBetter": true,
              "status": "auto"
            },
            {
              "label": "공정 불량 발생",
              "unit": "건",
              "src": {
                "ds": "defects",
                "agg": "count",
                "filter": [
                  {
                    "f": "kind",
                    "op": "=",
                    "v": "공정"
                  }
                ],
                "period": "thisMonth",
                "compare": true
              },
              "lowerIsBetter": true
            },
            {
              "label": "Cpk < 1.33 특성",
              "unit": "개",
              "src": {
                "ds": "cpk",
                "agg": "count",
                "filter": [
                  {
                    "f": "cpk",
                    "op": "<",
                    "v": "1.33"
                  }
                ],
                "period": "all"
              },
              "goal": 0,
              "lowerIsBetter": true,
              "status": "auto",
              "deltaLabel": "관리 특성 24개 중"
            },
            {
              "label": "재작업 비용",
              "value": 2.4,
              "unit": "백만원",
              "delta": 0.4,
              "deltaLabel": "전월 대비",
              "lowerIsBetter": true,
              "status": "warning"
            }
          ]
        },
        {
          "type": "bar",
          "span": 7,
          "title": "라인별 공정 불량률 (최근 3개월)",
          "unit": "%",
          "target": 0.8,
          "src": {
            "ds": "inspections",
            "agg": "ratio",
            "filter": [
              {
                "f": "kind",
                "op": "=",
                "v": "공정"
              }
            ],
            "x": "site",
            "period": "last3m",
            "field": "defects",
            "field2": "inspected",
            "scale": 100
          }
        },
        {
          "type": "table",
          "span": 5,
          "title": "공정능력 관리 특성 (Cpk 하위)",
          "src": {
            "ds": "cpk",
            "period": "all",
            "filter": [],
            "cols": [
              "char",
              "line",
              "cpk",
              "judge"
            ],
            "sort": "cpk",
            "asc": true,
            "limit": 5
          }
        },
        {
          "type": "hbar",
          "span": 6,
          "title": "공정 불량 유형 (최근 3개월, 수량)",
          "unit": "개",
          "src": {
            "ds": "defects",
            "agg": "sum",
            "filter": [
              {
                "f": "kind",
                "op": "=",
                "v": "공정"
              }
            ],
            "field": "qty",
            "by": "type",
            "period": "last3m",
            "top": 6
          }
        },
        {
          "type": "note",
          "span": 6,
          "title": "공정 이슈 메모",
          "src": {
            "ds": "memos",
            "period": "all",
            "filter": [
              {
                "f": "category",
                "op": "=",
                "v": "공정 이슈"
              }
            ],
            "main": "content",
            "pre": "date",
            "post": "owner",
            "limit": 5
          }
        }
      ]
    },
    {
      "id": "audit",
      "title": "감사 / 인증",
      "group": "시스템 · 승인",
      "desc": "IATF 16949 내부심사, 고객 심사, 외부 인증 일정",
      "widgets": [
        {
          "type": "kpi",
          "items": [
            {
              "label": "내부심사 진행률",
              "unit": "%",
              "src": {
                "ds": "auditplan",
                "agg": "avg",
                "filter": [],
                "field": "progress",
                "period": "all"
              },
              "goal": 100,
              "status": "auto",
              "deltaLabel": "부서 평균 · 11/30 완료 목표"
            },
            {
              "label": "미결 부적합",
              "unit": "건",
              "src": {
                "ds": "nc",
                "agg": "count",
                "filter": [
                  {
                    "f": "status",
                    "op": "!=",
                    "v": "완료"
                  }
                ],
                "period": "all"
              },
              "goal": 0,
              "lowerIsBetter": true,
              "status": "auto"
            },
            {
              "label": "남은 심사 일정",
              "unit": "건",
              "src": {
                "ds": "tasks",
                "agg": "count",
                "filter": [
                  {
                    "f": "category",
                    "op": "=",
                    "v": "심사"
                  },
                  {
                    "f": "status",
                    "op": "!=",
                    "v": "완료"
                  }
                ],
                "period": "all"
              }
            },
            {
              "label": "외부 사후심사까지",
              "unit": "일",
              "src": {
                "ds": "tasks",
                "agg": "min",
                "filter": [
                  {
                    "f": "title",
                    "op": "~",
                    "v": "외부 사후심사"
                  }
                ],
                "field": "left",
                "period": "all"
              },
              "deltaLabel": "인증기관 심사일 기준"
            }
          ]
        },
        {
          "type": "progress",
          "span": 6,
          "title": "IATF 16949 내부심사 부서별 진행",
          "src": {
            "ds": "auditplan",
            "mode": "rows",
            "label": "dept",
            "value": "progress",
            "max": 100,
            "noteField": "status",
            "sort": "date",
            "asc": true,
            "period": "all",
            "filter": []
          }
        },
        {
          "type": "table",
          "span": 6,
          "title": "부적합 사항 조치 현황",
          "src": {
            "ds": "nc",
            "period": "all",
            "filter": [],
            "cols": [
              "no",
              "clause",
              "level",
              "dept",
              "due",
              "status"
            ],
            "sort": "issued",
            "limit": 6
          }
        },
        {
          "type": "tasks",
          "span": 12,
          "title": "심사 · 인증 일정",
          "src": {
            "ds": "tasks",
            "filter": [
              {
                "f": "category",
                "op": "=",
                "v": "심사"
              },
              {
                "f": "status",
                "op": "!=",
                "v": "완료"
              }
            ],
            "map": {
              "title": "title",
              "owner": "owner",
              "due": "due",
              "status": "status",
              "progress": "progress"
            }
          }
        }
      ]
    },
    {
      "id": "ppap",
      "title": "PPAP / 양산 승인",
      "group": "시스템 · 승인",
      "desc": "신규·변경 부품 양산 승인(PPAP, ISIR) 및 초기유동관리",
      "widgets": [
        {
          "type": "kpi",
          "items": [
            {
              "label": "PPAP 진행 중",
              "unit": "건",
              "src": {
                "ds": "ppap",
                "agg": "count",
                "filter": [
                  {
                    "f": "status",
                    "op": "!=",
                    "v": "승인"
                  }
                ],
                "period": "all"
              }
            },
            {
              "label": "승인 완료 (올해)",
              "unit": "건",
              "src": {
                "ds": "ppap",
                "agg": "count",
                "filter": [
                  {
                    "f": "status",
                    "op": "=",
                    "v": "승인"
                  }
                ],
                "period": "ytd",
                "dateField": "approved"
              }
            },
            {
              "label": "제출 지연",
              "unit": "건",
              "src": {
                "ds": "ppap",
                "agg": "count",
                "filter": [
                  {
                    "f": "status",
                    "op": "=",
                    "v": "지연"
                  }
                ],
                "period": "all"
              },
              "goal": 0,
              "lowerIsBetter": true,
              "status": "auto"
            },
            {
              "label": "초기유동관리 중",
              "unit": "품번",
              "src": {
                "ds": "launch",
                "agg": "count",
                "filter": [
                  {
                    "f": "elapsed",
                    "op": ">=",
                    "v": "0"
                  },
                  {
                    "f": "elapsed",
                    "op": "<=",
                    "v": "90"
                  }
                ],
                "period": "all"
              },
              "deltaLabel": "SOP 후 90일 이내"
            }
          ]
        },
        {
          "type": "table",
          "span": 12,
          "title": "진행 중인 PPAP",
          "src": {
            "ds": "ppap",
            "period": "all",
            "filter": [
              {
                "f": "status",
                "op": "!=",
                "v": "승인"
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
            "asc": true
          }
        },
        {
          "type": "progress",
          "span": 6,
          "title": "초기유동관리 (SOP 후 90일)",
          "src": {
            "ds": "launch",
            "mode": "rows",
            "label": "part",
            "value": "elapsed",
            "max": 90,
            "noteField": "customer",
            "sort": "sop",
            "period": "all",
            "filter": [
              {
                "f": "elapsed",
                "op": ">=",
                "v": "0"
              },
              {
                "f": "elapsed",
                "op": "<=",
                "v": "90"
              }
            ]
          }
        },
        {
          "type": "note",
          "span": 6,
          "title": "체크 포인트",
          "src": {
            "ds": "memos",
            "period": "all",
            "filter": [
              {
                "f": "category",
                "op": "=",
                "v": "체크 포인트"
              }
            ],
            "main": "content",
            "pre": "",
            "post": "",
            "limit": 10,
            "sort": "date",
            "asc": true
          }
        }
      ]
    }
  ]
};
