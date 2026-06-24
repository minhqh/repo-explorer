import { useRepoAnalyzer } from './hooks/useRepoAnalyzer';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const { data, isLoading, error, analyze } = useRepoAnalyzer();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '10vh 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: '#24292e' }}>
          Repo Explorer
        </h2>
        <p style={{ color: '#57606a', fontSize: '1.1rem', margin: 0 }}>
          Bóc tách kiến trúc và công nghệ của bất kỳ dự án GitHub nào
        </p>
      </div>

      <SearchBar onSearch={analyze} isLoading={isLoading} />

      <div style={{ marginTop: '40px', width: '100%', maxWidth: '1000px' }}>
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div style={{ padding: '16px', backgroundColor: '#ffebe9', color: '#cf222e', borderRadius: '6px', border: '1px solid #ff818266' }}>
            <strong>Lỗi:</strong> {error}
          </div>
        )}

        {/* Khu vực In ra dữ liệu thô để Test */}
        {data && !isLoading && (
          <div style={{ padding: '20px', backgroundColor: '#f6f8fa', borderRadius: '8px', border: '1px solid #d0d7de' }}>
            <h3 style={{ marginTop: 0 }}>Dữ liệu đã nhận thành công:</h3>
            <pre style={{ 
              overflowX: 'auto', 
              fontSize: '14px', 
              maxHeight: '400px', 
              overflowY: 'auto' 
            }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;