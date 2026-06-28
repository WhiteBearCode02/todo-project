import { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import './App.css';

/**
 * 프론트엔드 애플리케이션 메인 컴포넌트 (App)
 * 데이터 비동기 호출 및 모든 상태 관리 이벤트 파이프라인을 총괄합니다.
 */
function App() {
    // 백엔드 데이터베이스로부터 조회해 온 실제 할 일 목록 상태
    const [todos, setTodos] = useState([]);
    // 네트워크 로딩 상태를 관리하여 사용자 경험(UX)을 향상시킵니다.
    const [isLoading, setIsLoading] = useState(false);
    // 백엔드 API의 베이스 URL 정의 (테스트 환경 포트 5000번)
    const API_URL = 'http://localhost:5000/api/todos';

    /**
     * [정정] 1. 전체 목록 로드 비동기 함수
     * 호이스팅 및 TDZ(일시적 사각지대) 제한을 방어하기 위해 호출부(useEffect)보다 상단에 정의합니다.
     */
    const fetchTodos = async () => {
        setIsLoading(true); // 로딩 시작
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('서버로부터 데이터를 가져올 수 없습니다.');
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            // 얼럿을 통해 사용자에게 명확한 에러 상황을 알립니다.
            alert(`시스템 알림: ${error.message}\n서버 포트(5000) 및 DB 구동 상태를 확인해 주세요.`);
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    /**
     * 2. 컴포넌트 마운트 효과 정의
     * 상단에서 선언이 완료된 fetchTodos 함수를 안전하게 호출하여 가동합니다.
     */
    useEffect(() => {
        fetchTodos();
    }, []);

    /**
     * 3. 할 일 추가 핸들러 (Create)
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
            // 불변성을 지키기 위해 스프레드 연산자로 새로운 참조 배열 생성
            setTodos([newTodo, ...todos]);
        } catch (error) {
            alert(error.message);
        }
    };

    /**
     * 4. 할 일 완료 상태 토글 핸들러 (Update)
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
     * 5. 할 일 삭제 핸들러 (Delete)
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
                
                {/* 데이터 조건부 렌더링을 통한 로딩 상태 UI 처리 */}
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