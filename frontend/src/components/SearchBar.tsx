import { useState } from "react";

interface SearchBarProps {
    onSearch: (url: string) => void;
    isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onSearch(url.trim());
        }
    };

    return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'center', 
        width: '100%',
        maxWidth: '600px'
      }}
    >
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
        disabled={isLoading || !url.trim()}
        style={{ 
          padding: '0 24px', 
          borderRadius: '24px', 
          border: 'none', 
          backgroundColor: isLoading ? '#ccc' : '#24292e', 
          color: '#fff', 
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.2s'
        }}
      >
        {isLoading ? '⏳ Đang quét...' : 'Phân tích'}
      </button>
    </form>
  );
}