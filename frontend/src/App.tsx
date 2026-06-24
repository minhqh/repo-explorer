import { useState } from 'react';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  // Hàm này sẽ gọi API ở Task 6
  const handleAnalyze = (url: string) => {
    console.log("Bắt đầu phân tích:", url);
    setIsLoading(true);
    
    // Giả lập delay 1.5s giống như đang gọi Backend
    setTimeout(() => {
      setIsLoading(false);
      console.log("Phân tích xong!");
    }, 1500);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      paddingTop: '15vh', // Đẩy nội dung xuống một chút cho giống Google
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      
      {/* Header Area */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ 
          fontSize: '3rem', 
          margin: '0 0 10px 0', 
          color: '#24292e' 
        }}>
          Repo Explorer
        </h2>
        <p style={{ color: '#57606a', fontSize: '1.1rem', margin: 0 }}>
          Bóc tách kiến trúc và công nghệ của bất kỳ dự án GitHub nào
        </p>
      </div>

      {/* Search Area */}
      <SearchBar onSearch={handleAnalyze} isLoading={isLoading} />

      {/* Khu vực giữ chỗ cho UI dữ liệu:
        Sau này các Tab Info, Tree, Languages, Dependencies sẽ được render ở đây
      */}
      <div style={{ marginTop: '40px', width: '100%', maxWidth: '1000px' }}>
        {/* Tab Components sẽ nằm đây */}
      </div>

    </div>
  );
}

export default App;