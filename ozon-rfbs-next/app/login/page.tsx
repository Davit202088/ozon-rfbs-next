'use client'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('manager@example.com')
  const [password, setPassword] = useState('manager123')
  const [error, setError] = useState<string|undefined>()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (res.ok) window.location.href = '/map'
    else setError('Неверные данные')
  }

  return (
    <div className="container">
      <h1>Вход</h1>
      <form onSubmit={submit} className="card" style={{maxWidth:400}}>
        <label>E-mail</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <div style={{height:8}}/>
        <label>Пароль</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{height:12}}/>
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit">Войти</button>
        <p style={{fontSize:12, opacity:.7, marginTop:8}}>Тестовые аккаунты будут созданы автоматически.</p>
      </form>
    </div>
  )
}
