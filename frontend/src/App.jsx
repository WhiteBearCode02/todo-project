import React, { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import './App.css';

function App() {
    const [todos, setTodos] = useState([]);
    // [보강] 네트워크 로딩 상태를 관리하여 사용자 경험(UX)을 향상시킵니다.
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = 'http://localhost:5000/api/todos';

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        setIsLoading(true); // 로딩 시작
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('서버로부터 데이터를 가져올 수 없습니다.');
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            // [보강] 얼럿이나 UI 텍스트를 통해 사용자에게 명확한 에러 상황을 알립니다.
            alert(`시스템 알림: ${error.message}\n서버 포트(5000) 및 DB 구동 상태를 확인해 주세요.`);
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    const handleAddTodo = async (title) => {
        // [보강] 무분별한 공백 문자 등록 방어
        if (!title || !title.trim()) {
            alert('올바른 할 일 내용을 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title.trim() })
            });
            if (!response.ok) throw new Error('할 일을 추가하는 중 서버 오류가 발생했습니다.');
            
            const newTodo = await response.json();
            setTodos([newTodo, ...todos]);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleToggleTodo = async (id) => {
        const targetTodo = todos.find(todo => todo._id === id);
        if (!targetTodo) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isCompleted: !targetTodo.isCompleted })
            });
            if (!response.ok) throw new Error('상태 변경에 실패했습니다.');

            const updatedTodo = await response.json();
            setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
        } catch (error) {
            alert(error.message);
        }
    };

    const handleValueDelete = async (id) => {
        // [보강] 의도치 않은 클릭으로 인한 데이터 유실 방지를 위해 사용자 컨펌창 추가
        if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('삭제 처리 중 오류가 발생했습니다.');

            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>My To-Do List</h1>
                <p>안정성 보강 단계 완료 기반 실시간 일정 관리 시스템</p>
            </header>
            
            <main className="app-content">
                <TodoInput onAdd={handleAddTodo} />
                
                {/* [보강] 데이터 조건부 렌더링을 통한 로딩 상태 UI 표출 */}
                {isLoading ? (
                    <p className="loading-text">데이터를 안전하게 불러오는 중입니다...</p>
                ) : (
                    <TodoList 
                        todos={todos} 
                        onToggle={handleToggleTodo} 
                        // 변수 네이밍 컨벤션을 통일성 있게 매핑
                        onDelete={handleValueDelete} 
                    />
                )}
            </main>
        </div>
    );
}

export default App;