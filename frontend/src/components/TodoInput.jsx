import React, { useState } from 'react';

/**
 * 할 일 입력 창 컴포넌트 (TodoInput)
 * 사용자로부터 텍스트 입력을 받아 상위 컴포넌트로 전달합니다.
 */
const TodoInput = ({ onAdd }) => {
    // 사용자가 입력 필드에 작성 중인 문자열 상태를 관리합니다.
    const [text, setText] = useState('');

    // 폼 제출(Submit) 이벤트 핸들러입니다.
    const handleSubmit = (e) => {
        e.preventDefault(); // 페이지가 새로고침되는 브라우저 기본 동작을 차단합니다.
        
        // 공백만 입력되었는지 검증합니다.
        if (!text.trim()) return;

        // 상위 컴포넌트로부터 전달받은 추가 함수(onAdd)를 호출하여 데이터를 넘겨줍니다.
        onAdd(text);
        
        // 입력이 완료되면 텍스트 창을 깨끗하게 비워줍니다.
        setText('');
    };

    return (
        <form className="todo-input-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="새로운 할 일을 입력하세요..."
                value={text}
                onChange={(e) => setText(e.target.value)} // 타이핑할 때마다 상태를 동기화합니다.
                className="todo-input"
            />
            <button type="submit" className="todo-add-button">추가</button>
        </form>
    );
};

export default TodoInput;