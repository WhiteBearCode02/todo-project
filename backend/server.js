/**
 * 백엔드 애플리케이션 진입점 (Entry Point)
 * 서버 구동, 미들웨어 확장, 데이터베이스 연결 및 라우팅 결합을 담당합니다.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// .env 파일에 정의된 환경 변수를 프로세스 내부(process.env)로 로드합니다.
dotenv.config();

// Express 인스턴스를 생성합니다.
const app = express();

// 데이터베이스 연결을 실행합니다.
connectDB();

/**
 * 전역 미들웨어 설정
 */
// CORS 미들웨어: 프론트엔드(React) 앱이 다른 포트에서 백엔드 API에 접근할 수 있도록 허용합니다.
app.use(cors());
// JSON 파싱 미들웨어: 클라이언트가 요청 바디(body)에 보낸 JSON 데이터를 JavaScript 객체로 변환해 줍니다.
app.use(express.json());

// 서버 헬스 체크용 기본 라우트
app.get('/', (req, res) => {
    res.send('To-Do App Server가 정상적으로 작동 중입니다.');
});

// 환경변수에 정의된 포트를 사용하거나 기본값으로 5000번 포트를 사용하도록 설정합니다.
const PORT = process.env.PORT || 5000;

// 지정된 포트에서 클라이언트의 대기 요청을 수신(Listen)하기 시작합니다.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});