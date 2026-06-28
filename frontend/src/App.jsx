import React, { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import './App.css';

/**
 * 프론트엔드 어플리케이션 메인 컴포넌트 (App)
 * 실제 백엔드 API와 비동기 HTTP 통신을 수행하여 데이터의 무결성을 동기화합니다.
 */
function App() {
    // 백엔드 데이터베이스로부터 조회해 온 진짜 할 일 목록 상태
    const [todos, setTodos] = useState([]);
    // 백엔드 API의 베이스 URL 정의 (테스트 환경 포트 5000번)
    const API_URL = 'http://localhost:5000/api/todos';

    // [Read] 컴포넌트가 처음 화면에 렌더링될 때(Mount) 서버로부터 목록을 가져옵니다.
    useEffect(() => {
        fetchTodos();
    }, []);

    // 전체 목록 로드 비동기 함수
    const fetchTodos = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('데이터를 가져오는데 실패했습니다.');
            const data = await response.json();
            setTodos(data); // 서버에서 받아온 최신 배열 데이터로 상태 업데이트
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    };

    // [Create] 백엔드 서버에 새로운 할 일을 등록 요청하는 핸들러
    const handleAddTodo = async (title) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }) // JSON 데이터 스트림으로 직렬화하여 송신
            });
            if (!response.ok) throw new Error('할 일 추가 실패');
            
            const newTodo = await response.json();
            // 성능 및 사용자 경험(UX) 최적화: 기존 상태 배열 맨 앞에 새로 생성된 객체를 결합
            setTodos([newTodo, ...todos]);
        } catch (error) {
            console.error('Insert Error:', error);
        }
    };

    // [Update] 백엔드 서버에 특정 항목의 완료 상태 토글을 요청하는 핸들러
    const handleToggleTodo = async (id) => {
        // 토글할 아이템을 현재 상태에서 찾습니다.
        const targetTodo = todos.find(todo => todo._id === id);
        if (!targetTodo) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isCompleted: !targetTodo.isCompleted }) // 반대 상태로 전송
            });
            if (!response.ok) throw new Error('상태 변경 실패');

            const updatedTodo = await response.json();
            // 화면의 상태 배열 중 매핑되는 객체만 서버에서 응답받은 최신 객체로 교체
            setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
        } catch (error) {
            console.error('Update Error:', error);
        }
    };

    // [Delete] 백엔드 서버에 특정 항목의 데이터 영구 삭제를 요청하는 핸들러
    const handleValueDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('할 일 삭제 실패');

            // 성공 시, 내 내부 상태(State)에서도 filter를 사용하여 해당 아이템을 제거하여 화면 동기화
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Delete Error:', error);
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>My To-Do List</h1>
                <p>풀스택 아키텍처 연동 완료 기반 실시간 일정 관리 시스템</p>
            </header>
            
            <main className="app-content">
                <TodoInput onAdd={handleAddTodo} />
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