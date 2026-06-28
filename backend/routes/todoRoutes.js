/**
 * To Do API 라우팅 정의 모듈 (Routes)
 * 각 HTTP 메서드 및 자원 경로(URI)에 알맞은 컨트롤러 메서드를 매핑합니다.
 */

const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// 전체 조회 및 등록 라우트 구성
router.route('/')
    .get(todoController.getTodos)      // GET /api/todos
    .post(todoController.createTodo);  // POST /api/todos

// 특정 항목에 대한 수정 및 삭제 라우트 구성 (경로 변수 :id 활용)
router.route('/:id')
    .put(todoController.updateTodo)     // PUT /api/todos/:id
    .delete(todoController.deleteTodo); // DELETE /api/todos/:id

module.exports = router;