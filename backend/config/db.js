/**
 * 데이터베이스 연결 관리 모듈
 * 환경변수(process.env)를 통해 민감한 인증 정보를 격리하여 관리합니다.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // [보안 무결성 확보] 소스코드에 주소를 직접 노출하지 않고, .env 파일의 변수를 호출합니다.
        const dbUri = process.env.MONGODB_URI;
        
        if (!dbUri) {
            throw new Error("환경변수 파이프라인에 MONGODB_URI가 명세되지 않았습니다.");
        }

        const conn = await mongoose.connect(dbUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;