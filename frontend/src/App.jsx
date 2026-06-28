import { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import './App.css';

/**
 * 프론트엔드 애플리케이션 메인 컴포넌트 (App)
 * 상태 관리 및 백엔드 API와의 비동기 통신을 제어합니다.
 */
function App() {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = 'http://localhost:5000/api/todos';

    /**
     * [혁신안 적용] 컴포넌트 마운트 효과 정의
     * 외부 함수 호출 방식을 탈피하고, useEffect 내부에 즉시 실행 비동기 함수(IIFE)를 도입합니다.
     * 이를 통해 동기적 세터 호출에 따른 폭포수 렌더링(Cascading Renders) 경고를 원천 차단합니다.
     */
    useEffect(() => {
        // 즉시 실행 비동기 함수 (IIFE) 영역 정의
        (async () => {
            setIsLoading(true); // 비동기 파이프라인 진입 시점에 안전하게 상태 변경
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('서버로부터 데이터를 가져올 수 없습니다.');
                const data = await response.json();
                setTodos(data);
            } catch (error) {
                console.error('초기 데이터 로드 실패:', error);
            } finally {
                setIsLoading(false); // 태스크 큐 흐름 제어 내에서 마감 처리
            }
        })();
    }, []);

    /**
     * 할 일 추가 핸들러 (Create)
     * 무분별한 공백 문자 입력을 사전 차단하고 비동기 추가를 수행합니다.
     */
    const handleAddTodo = async (title) => {
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
            // 불변성 유지를 위해 기존 배열에 신규 노드를 추가한 새로운 가상 돔 스냅샷 생성
            setTodos([newTodo, ...todos]);
        } catch (error) {
            alert(`시스템 알림: ${error.message}\n백엔드 서버 및 DB 연결 상태를 확인해 주세요.`);
        }
    };

    /**
     * 할 일 완료 상태 토글 핸들러 (Update)
     * 특정 식별자의 완료 상태 명세를 반전하여 백엔드 DB와 가상 돔을 동기화합니다.
     */
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

    /**
     * 할 일 삭제 핸들러 (Delete)
     * 데이터 유실 방지를 위해 사용자 의사를 이중으로 컨펌받아 파괴적 조치를 수행합니다.
     */
    const handleValueDelete = async (id) => {
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
                
                {/* 로딩 유무에 따른 조건부 가상 돔 렌더링 분기 공정 */}
                {isLoading ? (
                    <p className="loading-text">데이터를 안전하게 불러오는 중입니다...</p>
                ) : (
                    <TodoList 
                        todos={todos} 
                        onToggle={handleToggleTodo} 
                        onDelete={handleValueDelete} 
                    />
                )}
            </main>
        </div>
    );
}

export default App;