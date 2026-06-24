export interface AIFeature {
  icon: string;
  title: string;
  desc: string;
}

export default function AIFeatureCard({ icon, title, desc }: AIFeature) {
  return (
    <div style={{
      backgroundColor: '#fff', border: '1px solid #d0d7de', borderRadius: '8px',
      padding: '20px', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#24292e' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '13px', color: '#57606a', lineHeight: 1.5 }}>{desc}</p>
    </div>
  );
}