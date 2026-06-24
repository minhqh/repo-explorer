import type { DependenciesData } from '../types';

interface Props {
  dependencies: DependenciesData;
}

export default function DependenciesTab({ dependencies }: Props) {
  // Hàm phụ trợ (Helper function) để render từng cột tránh lặp code
  const renderList = (title: string, items: string[], icon: string) => (
    <div style={{ 
      flex: 1, 
      minWidth: '250px',
      backgroundColor: '#f6f8fa', 
      borderRadius: '8px', 
      padding: '20px', 
      border: '1px solid #d0d7de' 
    }}>
      <h3 style={{ 
        marginTop: 0, 
        marginBottom: '16px', 
        fontSize: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        color: '#24292e'
      }}>
        <span>{icon}</span> {title} <span style={{ color: '#57606a', fontWeight: 'normal', fontSize: '14px' }}>({items.length})</span>
      </h3>
      
      {items.length === 0 ? (
        <p style={{ color: '#57606a', fontSize: '14px', margin: 0, fontStyle: 'italic' }}>
          Không tìm thấy khai báo thư viện.
        </p>
      ) : (
        <ul style={{ 
          listStyleType: 'none', 
          padding: 0, 
          margin: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px' 
        }}>
          {items.map(item => (
            <li key={item} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              fontSize: '14px', 
              color: '#24292e' 
            }}>
              <span style={{ color: '#2da44e', fontWeight: 'bold' }}>✓</span>
              <span style={{ 
                fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', 
                backgroundColor: '#fff', 
                padding: '4px 8px', 
                borderRadius: '6px', 
                border: '1px solid #d0d7de',
                flex: 1
              }}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      border: '1px solid #d0d7de', 
      borderRadius: '8px', 
      padding: '32px' 
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '20px' }}>
        Gói thư viện cài đặt
      </h2>
      <p style={{ color: '#57606a', marginBottom: '24px', fontSize: '14px' }}>
        Trích xuất từ package.json, requirements.txt và pyproject.toml
      </p>
      
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {renderList('Frontend', dependencies.frontend, '🎨')}
        {renderList('Backend', dependencies.backend, '⚙️')}
      </div>
    </div>
  );
}