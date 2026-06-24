import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  languages: Record<string, number>;
}

// Bảng màu mặc định cho các ngôn ngữ phổ biến
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dockerfile: '#384d54',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
  Java: '#b07219',
};

// Mảng màu dự phòng nếu gặp ngôn ngữ lạ
const FALLBACK_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#a4de6c'];

export default function LanguageChart({ languages }: Props) {
  // Tính toán dữ liệu: Sửa lỗi gỡ bỏ totalBytes thừa không dùng tới
  const chartData = useMemo(() => {
    const entries = Object.entries(languages);
    const total = entries.reduce((sum, [_, bytes]) => sum + bytes, 0);
    
    return entries
      .sort((a, b) => b[1] - a[1]) // Sắp xếp từ lớn đến bé
      .map(([name, bytes], index) => {
        const percent = total > 0 ? ((bytes / total) * 100).toFixed(1) : '0';
        return {
          name,
          value: bytes,
          percent: parseFloat(percent),
          color: LANGUAGE_COLORS[name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
        };
      });
  }, [languages]);

  if (!chartData || chartData.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #d0d7de' }}>Không có dữ liệu ngôn ngữ</div>;
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #d0d7de',
      borderRadius: '6px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: 0, fontSize: '16px' }}>Thống kê ngôn ngữ</h3>
      
      {/* Nửa trên: Biểu đồ tròn Recharts */}
      <div style={{ width: '100%', height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60} // Tạo hình Donut
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {/* ĐÃ SỬA LỖI: Đổi kiểu dữ liệu từ number sang any để khớp với Recharts Tooltip */}
            <Tooltip 
              formatter={(value: any) => [`${(Number(value) / 1024).toFixed(1)} KB`, 'Dung lượng']}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Nửa dưới: Danh sách Progress Bar thanh ngang */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {chartData.map((lang) => (
          <div key={lang.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', fontWeight: 500 }}>
              <span style={{ color: '#24292e' }}>{lang.name}</span>
              <span style={{ color: '#57606a' }}>{lang.percent}%</span>
            </div>
            {/* Thanh Progress Bar Background */}
            <div style={{ width: '100%', height: '8px', backgroundColor: '#eaecef', borderRadius: '4px', overflow: 'hidden' }}>
              {/* Thanh Fill */}
              <div style={{ 
                width: `${lang.percent}%`, 
                height: '100%', 
                backgroundColor: lang.color,
                borderRadius: '4px'
              }} />
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}