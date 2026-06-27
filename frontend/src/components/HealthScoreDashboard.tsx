import React from 'react';
import type { HealthScore } from '../types';

interface Props {
  scoreData: HealthScore;
}

export const HealthScoreDashboard: React.FC<Props> = ({ scoreData }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return '#1a7f37'; // Xanh lá GitHub Light
      case 'B':
        return '#0969da'; // Xanh dương
      case 'C':
        return '#9a6700'; // Vàng đậm
      case 'D':
        return '#bc4c00'; // Cam
      case 'F':
        return '#cf222e'; // Đỏ GitHub
      default:
        return '#57606a';
    }
  };

  const gradeColor = getGradeColor(scoreData.grade);

  return (
    <div
      className="health-score-dashboard"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '20px',
        border: '1px solid #d0d7de',
        borderRadius: '6px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        textAlign: 'left',
      }}
    >
      {/* Header dòng điểm số */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #d0d7de',
          paddingBottom: '12px',
        }}
      >
        <h3
          style={{
            margin: 0,
            color: '#24292e',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🩺 Sức khỏe Dự án (Health Score)
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#24292e' }}>
            {scoreData.total_score}{' '}
            <span style={{ color: '#57606a', fontSize: '14px', fontWeight: 'normal' }}>/ 100</span>
          </span>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '2em',
              backgroundColor: `${gradeColor}15`,
              color: gradeColor,
              fontWeight: '600',
              fontSize: '14px',
              border: `1px solid ${gradeColor}30`,
            }}
          >
            Hạng {scoreData.grade}
          </span>
        </div>
      </div>

      {/* Nội dung phạt/thưởng chia 2 bên */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Khối Điểm trừ (Đỏ nhạt) */}
        <div
          style={{
            backgroundColor: '#fff8f8',
            padding: '16px',
            borderRadius: '6px',
            border: '1px solid #ffebe9',
          }}
        >
          <h4 style={{ color: '#cf222e', marginTop: 0, marginBottom: '12px', fontSize: '14px' }}>
            🚨 Cần khắc phục (Penalties)
          </h4>
          {scoreData.penalties.length === 0 ? (
            <p style={{ color: '#57606a', fontStyle: 'italic', margin: 0, fontSize: '13px' }}>
              Không có lỗi nghiêm trọng nào.
            </p>
          ) : (
            <ul
              style={{
                paddingLeft: '18px',
                margin: 0,
                color: '#24292e',
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              {scoreData.penalties.map((p, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>
                  <strong style={{ color: '#1f2328' }}>{p.item}</strong>: {p.description}{' '}
                  <span style={{ color: '#cf222e', fontWeight: '500' }}>({p.value} điểm)</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Khối Điểm cộng (Xám nhạt chuẩn GitHub) */}
        <div
          style={{
            backgroundColor: '#f6f8fa',
            padding: '16px',
            borderRadius: '6px',
            border: '1px solid #d0d7de',
          }}
        >
          <h4 style={{ color: '#1a7f37', marginTop: 0, marginBottom: '12px', fontSize: '14px' }}>
            ✨ Điểm cộng (Bonuses)
          </h4>
          {scoreData.bonuses.length === 0 ? (
            <p style={{ color: '#57606a', fontStyle: 'italic', margin: 0, fontSize: '13px' }}>
              Chưa có tiêu chí thưởng nào đạt yêu cầu.
            </p>
          ) : (
            <ul
              style={{
                paddingLeft: '18px',
                margin: 0,
                color: '#24292e',
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              {scoreData.bonuses.map((b, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>
                  <strong style={{ color: '#1f2328' }}>{b.item}</strong>: {b.description}{' '}
                  <span style={{ color: '#1a7f37', fontWeight: '500' }}>(+{b.value} điểm)</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
