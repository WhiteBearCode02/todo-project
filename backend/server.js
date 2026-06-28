/**
 * 백엔드 애플리케이션 진입점 (Entry Point)
 * 서버 구동, 미들웨어 확장, 데이터베이스 연결 및 라우팅 결합을 담당합니다.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes'); // [추가] 라우터 모듈 가져오기

// .env 파일에 정의된 환경 변수를 프로세스 내부로 로드합니다.
dotenv.config();

// Express 인스턴스를 생성합니다.
const app = express();

// 데이터베이스 연결을 실행합니다.
connectDB();

/**
 * 전역 미들웨어 설정
 */
app.use(cors());
app.use(express.json());

/**
 * 라우팅 미들웨어 설정
 */
// [추가] 모든 To Do 관련 API는 기본적으로 '/api/todos' 접두사를 가지도록 설정합니다.
app.use('/api/todos', todoRoutes);

// 서버 헬스 체크용 기본 라우트
app.get('/', (req, res) => {
    res.send('To-Do App Server가 정상적으로 작동 중입니다.');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});