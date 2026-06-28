/**
 * To Do 아이템 데이터 구조 정의 (Schema Model)
 * NoSQL인 MongoDB에 저장될 문서(Document)의 명세를 정의합니다.
 */

const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    // 할 일 내용: 반드시 존재해야 하며, 문자열 형태여야 하고, 좌우 공백을 제거합니다.
    title: {
        type: String,
        required: [true, '할 일 내용은 필수 항목입니다.'],
        trim: true
    },
    // 완료 여부: 기본값은 미완료(false) 상태로 시작합니다.
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {
    // timestamps 옵션을 true로 설정하면 자동으로 createdAt과 updatedAt 필드를 생성해 줍니다.
    timestamps: true
});

// 정의한 스키마를 바탕으로 'Todo' 모델을 생성하여 모듈화합니다.
module.exports = mongoose.model('Todo', TodoSchema);