import React from 'react';
import TodoItem from './TodoItem';

/**
 * 할 일 목록 래퍼 컴포넌트 (TodoList)
 * 상위에서 내려받은 배열 데이터를 순회하여 다수의 TodoItem 컴포넌트를 렌더링합니다.
 */
const TodoList = ({ todos, onToggle, onDelete }) => {
    // 표시할 할 일이 없을 때 예외 화면 처리
    if (todos.length === 0) {
        return <p className="no-todo">등록된 할 일이 없습니다. 오늘 일정을 추가해 보세요!</p>;
    }

    return (
        <ul className="todo-list">
            {/* 고유한 배열 데이터를 순회할 때는 성능 최적화와 DOM 식별을 위해 반드시 고유 'key' 속성이 필요합니다. */}
            {todos.map((todo) => (
                <TodoItem
                    key={todo._id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
};

export default TodoList;