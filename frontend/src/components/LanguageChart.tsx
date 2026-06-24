import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { LanguageStat } from '../types';

interface Props {
  languages: LanguageStat[]; // Hứng mảng đã có sẵn mọi thứ từ Backend
}

export default function LanguageChart({ languages }: Props) {
  if (!languages || languages.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Không có dữ liệu ngôn ngữ</div>;
  }

  return (
    <div style={{ /* ... styles ... */ }}>
      <h3 style={{ marginTop: 0, marginBottom: 0, fontSize: '16px' }}>Thống kê ngôn ngữ</h3>
      
      <div style={{ width: '100%', height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={languages} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
              {languages.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => [`${(value / 1024).toFixed(1)} KB`, 'Dung lượng']} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {languages.map((lang) => (
          <div key={lang.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', fontWeight: 500 }}>
              <span>{lang.name}</span>
              <span style={{ color: '#57606a' }}>{lang.percent}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#eaecef', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${lang.percent}%`, height: '100%', backgroundColor: lang.color, borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}