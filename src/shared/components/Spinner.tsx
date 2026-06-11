export function Spinner() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '300px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e0ddd8',
        borderTop: '3px solid #ff385c',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}