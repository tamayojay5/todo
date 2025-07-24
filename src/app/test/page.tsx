export default function TestPage() {
  return (
    <div>
      <h1>Test Page Works</h1>
      <p>Environment variables:</p>
      <ul>
        <li>GOLANG_BACKEND_URL: {process.env.NEXT_PUBLIC_GOLANG_BACKEND_URL || 'NOT SET'}</li>
        <li>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}</li>
        <li>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}</li>
      </ul>
    </div>
  )
}