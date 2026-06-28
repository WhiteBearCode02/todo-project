/**
 * 데이터베이스 연결 관리 모듈
 * Mongoose 라이브러리를 사용하여 MongoDB와의 커넥션을 설정합니다.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // 환경변수 시스템으로부터 MongoDB URI를 주입받아 연결을 시도합니다.
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        // 연결 성공 시, 디버깅을 위해 호스트 정보를 로그로 출력합니다.
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // 연결 실패 시 오류 메시지를 출력하고 프로세스를 명시적으로 종료합니다.
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// 애플리케이션 진입점(server.js)에서 사용할 수 있도록 함수를 내보냅니다.
module.exports = connectDB;