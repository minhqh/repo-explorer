import type { GitStats } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface GitActivityTabProps {
  stats?: GitStats;
}

export default function GitActivityTab({ stats }: GitActivityTabProps) {
  if (!stats || stats.total_commits === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px',
          color: '#57606a',
          border: '1px solid #d0d7de',
          borderRadius: '8px',
        }}
      >
        Không có dữ liệu lịch sử commit hoặc kho lưu trữ rỗng.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Thẻ Thống kê Tổng quan */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <div
          style={{
            flex: 1,
            padding: '20px',
            backgroundColor: '#f6f8fa',
            borderRadius: '8px',
            border: '1px solid #d0d7de',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#57606a' }}>
            TỔNG COMMITS (100 GẦN NHẤT)
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#0969da' }}>
            {stats.total_commits}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            padding: '20px',
            backgroundColor: '#f6f8fa',
            borderRadius: '8px',
            border: '1px solid #d0d7de',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#57606a' }}>
            SỐ NGƯỜI ĐÓNG GÓP
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#2da44e' }}>
            {stats.unique_contributors}
          </p>
        </div>
      </div>

      {/* Biểu đồ Đường (Line Chart) Tần suất Commit */}
      <div
        style={{
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #d0d7de',
          height: '350px',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Tần suất Commit theo thời gian</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={stats.commit_timeline}
            margin={{ top: 5, right: 20, bottom: 25, left: 0 }}
          >
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0969da"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ fontWeight: 'bold', color: '#24292e', marginBottom: '4px' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng xếp hạng Top Contributors */}
      <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid #d0d7de' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #d0d7de', paddingBottom: '12px' }}>
          Top Contributors
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {stats.top_contributors.map((user, idx) => (
            <li
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom:
                  idx !== stats.top_contributors.length - 1 ? '1px solid #eaecef' : 'none',
              }}
            >
              <span style={{ fontWeight: '600', color: '#24292e' }}>{user.author}</span>
              <span style={{ color: '#57606a' }}>
                <strong style={{ color: '#24292e' }}>{user.commits}</strong> commits (
                {user.percentage}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
