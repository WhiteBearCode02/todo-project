# 🚀 Full-Stack MERN To-Do Application

React, Express, MongoDB를 활용하여 설계된 유기적 아키텍처 기반의 실시간 할 일 관리(To-Do) 웹 애플리케이션입니다. 
웹 개발의 핵심인 **CRUD(Create, Read, Update, Delete)** 흐름을 명확히 구현하고, 관심사 분리(SoC) 원칙에 입각하여 레이어별 모듈화를 진행한 프로젝트입니다.

---

## 🛠 Tech Stack (기술 스택)

| 레이어 | 기술 스택 | 상세 역할 |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, HTML5/CSS3 | 컴포넌트 중심 UI 설계, 상태 관리 및 비동기 Fetch 통신 |
| **Backend** | Node.js, Express | RESTful API 라우팅 처리 및 비즈니스 로직 제어 |
| **Database** | MongoDB, Mongoose | NoSQL 문서 지향 데이터 모델링 및 데이터 영구 저장 |

---

## 📂 Project Architecture (디렉토리 구조)

유지보수성과 확장성을 극대화하기 위해 클라이언트와 서버를 분리하고, 백엔드는 역할에 따라 가독성 높게 레이어를 구분했습니다.

```text
todo-project/
├── backend/                  # 백엔드 (Express + MongoDB)
│   ├── config/               # 환경 설정 및 DB 커넥션 관리 (db.js)
│   ├── controllers/          # 비즈니스 CRUD 로직 처리 (todoController.js)
│   ├── models/               # 데이터베이스 스키마 명세 (Todo.js)
│   ├── routes/               # API 엔드포인트 라우팅 분리 (todoRoutes.js)
│   ├── .env                  # 환경변수 관리 파이프라인
│   └── server.js             # 백엔드 Entry Point (서버 진입점)
└── frontend/                 # 프론트엔드 (React + Vite)
    └── src/
        ├── components/       # 단위 기능별 재사용 컴포넌트 (Input, List, Item)
        ├── App.css           # 모던 UI 스타일시트
        └── App.jsx           # 비동기 데이터 동기화 및 메인 허브 컴포넌트
🔄 System Data Flow (시스템 데이터 흐름도)
Create (POST): 사용자가 UI에 할 일 입력 ➡️ TodoInput에서 부모 상태 핸들러 호출 ➡️ 비동기 fetch(POST) 발송 ➡️ Express JSON 미들웨어 파싱 ➡️ Mongoose 모델을 통해 MongoDB 영구 저장 ➡️ 생성 완료 데이터 반환 ➡️ 프론트엔드 불변성 유지 기반 배열 결합 ➡️ Virtual DOM 리렌더링.

Read (GET): 컴포넌트 마운트 시 useEffect 발생 ➡️ fetch(GET) 요청 ➡️ 컨트롤러에서 MongoDB 데이터를 최신순(createdAt: -1)으로 정렬하여 응답 ➡️ UI 리스트 표출.

Update (PUT): 체크박스 토글 시 고유 식별자(_id)를 파라미터로 전송 ➡️ findByIdAndUpdate 기반 상태 반전 적용.

Delete (DELETE): 이중 컨펌 가드 통과 시 삭제 API 요청 ➡️ 데이터베이스 영구 삭제 및 프론트엔드 filter 연산을 통한 화면 동기화.

⚡ 예외 처리 및 안정성 방어 포인트
유효성 검증 (Validation): 클라이언트 단의 공백 문자 가드 처리 및 MongoDB 내부의 required 명세를 통한 이중 무결성 확보.

사용자 경험 (UX) 제어: 비동기 네트워크 지연 상황에 대응하기 위해 isLoading 상태 기반 조건부 로딩 UI 표출.

안전장치 설계: 파괴적인 데이터 삭제 액션 발생 시 브라우저 내 native 대화상자 컨펌 가드를 추가하여 데이터 유실 방지.

💻 Installation & Running (구동 방법)
프로젝트를 로컬 환경에서 구동하기 위한 절차입니다.

1. Prerequisites (사전 준비)
Node.js 설치 (v18 이상 권장)

MongoDB Local 커뮤니티 서버 구동 혹은 Atlas URI 준비

2. Backend Setup
Bash
cd backend
npm install
# .env 파일을 생성하고 아래와 같이 포트와 DB 주소를 입력합니다.
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/todoDB
npm run dev
3. Frontend Setup
Bash
cd frontend
npm install
npm run dev