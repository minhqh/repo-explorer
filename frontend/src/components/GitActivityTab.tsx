import { useState } from 'react';
import type { GitStats, CommitDetail } from '../types';
import { githubApi } from '../services/api';
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
  owner: string;
  repo: string;
}

export default function GitActivityTab({ stats, owner, repo }: GitActivityTabProps) {
  const [commits, setCommits] = useState<CommitDetail[]>(stats?.recent_commits || []);
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState((stats?.recent_commits?.length || 0) === 100);

  if (!stats || stats.total_commits === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#57606a' }}>
        Không có dữ liệu commit.
      </div>
    );
  }

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const res = await githubApi.fetchMoreCommits(owner, repo, page);
      if (res.success && res.data) {
        setCommits((prev) => [...prev, ...(res.data || [])]);
        setPage((p) => p + 1);
        if (res.data.length < 100) setHasMore(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Thẻ Thống kê & Biểu đồ (Giữ nguyên như cũ nhưng tái cấu trúc gọn hơn) */}
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
            TỔNG COMMITS ĐÃ TẢI
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#0969da' }}>
            {commits.length}
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

      <div
        style={{
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #d0d7de',
          height: '300px',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Tần suất Commit</h3>
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
              dot={false}
              activeDot={{ r: 6 }}
            />
            <CartesianGrid stroke="#eaecef" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Lịch sử Commit dạng Timeline chuẩn GitHub */}
      <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid #d0d7de' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #d0d7de', paddingBottom: '12px' }}>
          Lịch sử Commit
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          {commits.map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                paddingBottom: '16px',
                borderBottom: i !== commits.length - 1 ? '1px solid #eaecef' : 'none',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#0969da',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                {c.author.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#24292e', fontSize: '15px' }}>
                  {c.message}
                </div>
                <div style={{ color: '#57606a', fontSize: '13px', marginTop: '4px' }}>
                  <strong>{c.author}</strong> committed on {c.date}
                </div>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#0969da',
                  backgroundColor: '#ddf4ff',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                {c.sha.substring(0, 7)}
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={loadMore}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '16px',
              borderRadius: '6px',
              backgroundColor: '#f6f8fa',
              border: '1px solid #d0d7de',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {isLoading ? '⏳ Đang tải...' : '⬇️ Tải thêm 100 commits'}
          </button>
        )}
      </div>
    </div>
  );
}
