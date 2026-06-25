import { useState, useEffect } from "react";

interface SearchBarProps {
    onSearch: (url: string) => void;
    isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [url, setUrl] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
      const savedToken = localStorage.getItem('github_pat');
      if (savedToken) {
        setToken(token);
        setIsPrivate(true);
      }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isPrivate && token.trim()) {
          localStorage.setItem('github_pat', token.trim());
        } else {
          localStorage.removeItem('github_pat');
        }
        if (url.trim()) {
            onSearch(url.trim());
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Toggle Public / Private */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', color: '#57606a' }}>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: !isPrivate ? 'bold' : 'normal', color: !isPrivate ? '#24292e' : 'inherit' }}>
                    <input type="radio" checked={!isPrivate} onChange={() => setIsPrivate(false)} disabled={isLoading} /> 
                    🌍 Public Repo
                </label>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: isPrivate ? 'bold' : 'normal', color: isPrivate ? '#24292e' : 'inherit' }}>
                    <input type="radio" checked={isPrivate} onChange={() => setIsPrivate(true)} disabled={isLoading} /> 
                    🔒 Private Repo
                </label>
            </div>

            {/* Ô nhập Token (Chỉ hiện khi chọn Private) */}
            {isPrivate && (
                <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="🔑 Nhập GitHub Personal Access Token (PAT)..."
                    disabled={isLoading}
                    style={{
                        padding: '12px 20px',
                        borderRadius: '8px',
                        border: '1px solid #d0d7de',
                        outline: 'none',
                        fontSize: '14px',
                        backgroundColor: '#f6f8fa'
                    }}
                />
            )}

            {/* Form tìm kiếm */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', justifyContent: 'center', width: '100%' }}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Nhập URL GitHub (vd: https://github.com/minhqh/repo-explorer)"
                    style={{ 
                        flex: 1, 
                        padding: '14px 24px', 
                        borderRadius: '24px', 
                        border: '1px solid #dfe1e5', 
                        outline: 'none', 
                        fontSize: '16px',
                        boxShadow: '0 1px 6px rgba(32, 33, 36, 0.28)'
                    }}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !url.trim() || (isPrivate && !token.trim())}
                    style={{ 
                        padding: '0 24px', 
                        borderRadius: '24px', 
                        border: 'none', 
                        backgroundColor: (isLoading || !url.trim() || (isPrivate && !token.trim())) ? '#ccc' : '#24292e', 
                        color: '#fff', 
                        cursor: (isLoading || !url.trim() || (isPrivate && !token.trim())) ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s'
                    }}
                >
                    {isLoading ? '⏳ Đang quét...' : 'Phân tích'}
                </button>
            </form>
        </div>
    );
}