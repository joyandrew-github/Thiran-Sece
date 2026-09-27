import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Radio, ArrowLeft, ShieldAlert } from 'lucide-react';
import thiranLogo from '../../assets/thiranlogo.png';
import sriEshwarLogo from '../../assets/srieshwar.png';
import './Login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const trimmedUser = username.trim();
        const trimmedPass = password.trim();

        if (!trimmedUser || !trimmedPass) {
            setError('Please fill in all fields to proceed.');
            return;
        }

        // Prototype credentials validation
        if (trimmedUser === 'sece' && trimmedPass === 'sece123') {
            localStorage.setItem('thiran_admin_authenticated', 'true');
            localStorage.setItem('thiran_admin_user', 'sece');
            navigate('/dashboard');
        } else {
            setError('Invalid username or password. Use credentials: sece / sece123');
        }
    };

    return (
        <div className="admin-login-wrapper">
            {/* Ambient Background Glows */}
            <div className="admin-login-glow-orb admin-login-glow-orb--top" />
            <div className="admin-login-glow-orb admin-login-glow-orb--bottom" />

            {/* Topbar: Return to Public Website */}
            <div className="admin-login-topbar">
                <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noreferrer"
                    className="admin-return-btn">
                    <ArrowLeft size={14} />
                    Return to Public Website
                </a>
            </div>

            {/* Main Login Card Container */}
            <div className="admin-login-card">
                {/* Left Art Panel with dark midnight background & high-contrast logo badge */}
                <div className="admin-login-left">
                    <div className="admin-left-logo-card">
                        <img
                            src={sriEshwarLogo}
                            alt="Sri Eshwar College of Engineering"
                            className="admin-left-logo"
                        />
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="admin-login-right">
                    <div className="admin-login-header">
                        <img
                            src={thiranLogo}
                            alt="Thiran 2027"
                            className="admin-login-logo"
                        />
                        <h1 className="admin-login-title">ADMIN LOGIN</h1>
                        <p className="admin-login-subtitle">SRI ESHWAR COLLEGE OF ENGINEERING</p>
                    </div>

                    {error && (
                        <div
                            className="admin-alert admin-alert--error"
                            role="alert">
                            <ShieldAlert size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form
                        className="admin-login-form"
                        onSubmit={handleSubmit}>
                        {/* Username Input */}
                        <div className="admin-field-group">
                            <User
                                className="admin-field-icon"
                                size={18}
                            />
                            <input
                                type="text"
                                className="admin-input"
                                placeholder="Username (e.g. sece)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="admin-field-group">
                            <Lock
                                className="admin-field-icon"
                                size={18}
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="admin-input"
                                placeholder="Password (e.g. sece123)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="admin-eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="admin-form-actions">
                            <a
                                href="#forgot"
                                className="admin-forgot-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Demo credentials: Username: sece | Password: sece123');
                                }}>
                                Forgot Password?
                            </a>
                            <button
                                type="submit"
                                className="admin-authorize-btn">
                                <Radio size={16} />
                                AUTHORIZE &gt;
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
