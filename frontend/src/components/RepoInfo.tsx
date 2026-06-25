import type { RepoInfo as RepoInfoType } from '../types';

interface Props {
  info: RepoInfoType;
}

export default function RepoInfo({ info }: Props) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #d0d7de',
        borderRadius: '6px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header: Avatar + Tên Repo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img
          src={`https://github.com/${info.owner}.png`}
          alt={info.owner}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '1px solid #d0d7de',
          }}
        />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0969da' }}>
            <a
              href={`https://github.com/${info.owner}/${info.name}`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {info.owner} / {info.name}
            </a>
          </h2>
          <span style={{ fontSize: '14px', color: '#57606a', fontWeight: 'bold' }}>
            Default branch: {info.default_branch}
          </span>
        </div>
      </div>

      <p style={{ margin: 0, color: '#24292e', fontSize: '15px', lineHeight: 1.5 }}>
        {info.description || 'Không có mô tả cho dự án này.'}
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#57606a' }}>
        <span>
          ⭐ <strong>{info.stars.toLocaleString()}</strong> stars
        </span>
        <span>
          🍴 <strong>{info.forks.toLocaleString()}</strong> forks
        </span>
        {info.language && (
          <span>
            🔵 <strong>{info.language}</strong>
          </span>
        )}
      </div>

      {/* Topics */}
      {info.topics.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {info.topics.map((topic) => (
            <span
              key={topic}
              style={{
                backgroundColor: '#ddf4ff',
                color: '#0969da',
                padding: '4px 10px',
                borderRadius: '2em',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
