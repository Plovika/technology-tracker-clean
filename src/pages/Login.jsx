import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');

    const from = location.state?.from?.pathname || '/settings';

    const handleSubmit = (e) => {
        e.preventDefault();

        if (accessCode.trim().toLowerCase() !== 'admin') {
            setError('Неверный код доступа. Попробуйте "admin".');
            return;
        }

        login('Администратор');
        navigate(from, { replace: true });
    };

    return (
        <div className="page login-page">
            <nav className="breadcrumbs">
                <Link to="/">Главная</Link>
                <span> / </span>
                <span>Вход</span>
            </nav>

            <div className="login-card">
                <h1> Доступ к настройкам</h1>
                <p>Введите код доступа, чтобы открыть защищённые разделы.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="accessCode">Код доступа</label>
                    <input
                        id="accessCode"
                        type="password"
                        value={accessCode}
                        onChange={(e) => {
                            setAccessCode(e.target.value);
                            setError('');
                        }}
                        placeholder="Введите admin"
                    />
                    {error && <span className="error-message">{error}</span>}

                    <button type="submit" className="btn btn-primary">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;

