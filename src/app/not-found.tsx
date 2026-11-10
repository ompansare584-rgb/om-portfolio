// With two root layouts, the 404 page brings its own <html>. Kept plain and fast on purpose.
export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#14100a', color: '#f3e6c4', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: 24 }}>
        <main>
          <h1 style={{ fontSize: '2rem', margin: '0 0 8px' }}>Off the dial</h1>
          <p style={{ margin: '0 0 20px' }}>This frequency has no station. Let us retune.</p>
          <a href="/" style={{ color: '#f0d58a' }}>Back to the radio</a>
        </main>
      </body>
    </html>
  );
}
