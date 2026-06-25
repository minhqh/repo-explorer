// Trạng thái khi chưa có dữ liệu và không load
export function EmptyState() {
  return (
    <div
      style={{
        padding: '60px 20px',
        textAlign: 'center',
        color: '#57606a',
        backgroundColor: '#f6f8fa',
        borderRadius: '8px',
        border: '1px dashed #d0d7de',
        marginTop: '40px',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
      <h3 style={{ margin: '0 0 8px 0', color: '#24292e' }}>Chưa có dữ liệu phân tích</h3>
      <p style={{ margin: 0 }}>
        Hãy dán một đường dẫn GitHub Repository vào thanh tìm kiếm phía trên để bắt đầu.
      </p>
    </div>
  );
}

// Trạng thái khi có lỗi trả về từ API
export function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: '#ffebe9',
        color: '#cf222e',
        borderRadius: '8px',
        border: '1px solid #ff818266',
        marginTop: '40px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '20px' }}>⚠️</span>
      <div>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Phân tích thất bại</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>{message}</p>
      </div>
    </div>
  );
}
