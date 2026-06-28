import React from 'react';

/**
 * 개별 할 일 아이템 컴포넌트 (TodoItem)
 * 단일 할 일 데이터의 내용, 완료 상태를 렌더링하고 토글/삭제 이벤트를 바인딩합니다.
 */
const TodoItem = ({ todo, onToggle, onDelete }) => {
    return (
        <li className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
            {/* 완료 여부를 제어하는 체크박스 영역 */}
            <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onToggle(todo._id)} // 해당 아이템의 고유 ID를 인자로 토글 함수 호출
                className="todo-checkbox"
            />
            
            {/* 할 일 본문 텍스트 영역 */}
            <span className="todo-title">{todo.title}</span>
            
            {/* 삭제 버튼 영역 */}
            <button 
                onClick={() => onDelete(todo._id)} // 해당 아이템의 고유 ID를 인자로 삭제 함수 호출
                className="todo-delete-button"
            >
                삭제
            </button>
        </li>
    );
};

export default TodoItem;