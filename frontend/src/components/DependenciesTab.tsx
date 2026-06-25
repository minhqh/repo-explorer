import type { DependenciesData } from '../types';
import DependencyCard from './DependencyCard';

interface Props {
  dependencies: DependenciesData;
}

export default function DependenciesTab({ dependencies }: Props) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #d0d7de',
        borderRadius: '8px',
        padding: '32px',
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '20px' }}>Gói thư viện cài đặt</h2>
      <p style={{ color: '#57606a', marginBottom: '24px', fontSize: '14px' }}>
        Trích xuất từ package.json, requirements.txt và pyproject.toml
      </p>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <DependencyCard title="Frontend" items={dependencies.frontend} icon="🎨" />
        <DependencyCard title="Backend" items={dependencies.backend} icon="⚙️" />
      </div>
    </div>
  );
}
