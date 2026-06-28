/**
 * To Do 비즈니스 로직 제어 핵심 모듈 (Controller)
 * 각 API 엔드포인트에서 호출되어 데이터베이스 연산을 수행하고 결과를 응답합니다.
 */

const Todo = require('../models/Todo');

/**
 * 1. 할 일 등록 (Create)
 * POST /api/todos
 */
exports.createTodo = async (req, res) => {
    try {
        // 클라이언트가 보낸 body 데이터에서 title을 추출하여 새로운 할 일을 생성합니다.
        const { title } = req.body;
        const newTodo = new Todo({ title });
        
        // 데이터베이스에 저장합니다.
        const savedTodo = await newTodo.save();
        
        // 성공 시 21(Created) 상태 코드와 함께 저장된 데이터를 반환합니다.
        res.status(201).json(savedTodo);
    } catch (error) {
        // 예외 발생 시 400(Bad Request) 에러와 메시지를 전달합니다.
        res.status(400).json({ message: '할 일을 등록하는 데 실패했습니다.', error: error.message });
    }
};

/**
 * 2. 전체 할 일 목록 조회 (Read)
 * GET /api/todos
 */
exports.getTodos = async (req, res) => {
    try {
        // 가장 최근에 생성된 할 일이 먼저 보이도록 정렬(내림차순)하여 조회합니다.
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: '할 일 목록을 불러오는 데 실패했습니다.', error: error.message });
    }
};

/**
 * 3. 할 일 수정 - 내용 변경 또는 완료 여부 토글 (Update)
 * PUT /api/todos/:id
 */
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, isCompleted } = req.body;

        // URL 파라미터로 받은 id를 찾아 body 데이터를 업데이트합니다.
        // new: true 옵션은 수정된 이후의 최신 문서를 반환하도록 설정하는 것입니다.
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, isCompleted },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: '해당 할 일을 찾을 수 없습니다.' });
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: '할 일을 수정하는 데 실패했습니다.', error: error.message });
    }
};

/**
 * 4. 할 일 삭제 (Delete)
 * DELETE /api/todos/:id
 */
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        // 지정된 id의 문서를 데이터베이스에서 영구 삭제합니다.
        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ message: '해당 할 일을 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '할 일이 성공적으로 삭제되었습니다.', id });
    } catch (error) {
        res.status(500).json({ message: '할 일을 삭제하는 데 실패했습니다.', error: error.message });
    }
};