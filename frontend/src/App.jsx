import React, { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import './App.css';

/**
 * 프론트엔드 어플리케이션 메인 컴포넌트 (App)
 * 하위 컴포넌트들의 상태를 총괄하며 전체적인 레이아웃 구조를 정의합니다.
 */
function App() {
    // 가상의 초기 테스트 데이터 배열 상태를 정의합니다 (Step 5에서 API 연동으로 교체될 예정)
    const [todos, setTodos] = useState([
        { _id: '1', title: 'React 컴포넌트 구조 설계하기', isCompleted: false },
        { _id: '2', title: 'Express API 연동 테스트하기', isCompleted: true }
    ]);

    // 가상 데이터 추가 핸들러
    const handleAddTodo = (title) => {
        const newTodo = { _id: Date.now().toString(), title, isCompleted: false };
        setTodos([newTodo, ...todos]);
    };

    // 가상 데이터 완료 토글 핸들러
    const handleToggleTodo = (id) => {
        setTodos(todos.map(todo => 
            todo._id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        ));
    };

    // 가상 데이터 삭제 핸들러
    const handleValueDelete = (id) => {
        setTodos(todos.filter(todo => todo._id !== id));
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>My To-Do List</h1>
                <p>오늘의 학습 및 작업 목표를 관리해 보세요.</p>
            </header>
            
            <main className="app-content">
                {/* 할 일 입력창 레이어 배치 */}
                <TodoInput onAdd={handleAddTodo} />
                
                {/* 할 일 목록 및 아이템 레이어 배치 */}
                <TodoList 
                    todos={todos} 
                    onToggle={handleToggleTodo} 
                    onDelete={handleValueDelete} 
                />
            </main>
        </div>
    );
}

export default App;