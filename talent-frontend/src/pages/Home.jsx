// src/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const openLogin = () => {
    setError('');
    setUsername('');
    setPassword('');
    setShowModal(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'ADMIN' && password === 'ADMIN') {
      navigate('/candidates');
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="homepage">
      <div className="homepage-left">
        <div className="homepage-content">
          <h1>STEMHUB人才库系统</h1>
          <p>智能、高效的人才信息管理平台</p>
          <button onClick={openLogin}>进入人才库</button>
        </div>
      </div>
      <div className="homepage-right">
        {showModal && (
          <div
            className="modal-backdrop"
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>登录</h2>
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div className="error">{error}</div>}
                <button type="submit">登录</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
