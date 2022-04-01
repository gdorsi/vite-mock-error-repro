// @ts-check
import React, { useState } from 'react'

import './LoginForm.css'

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns Promise<{ token: string }>
 */
async function doLogin(email, password) {
	const res = await fetch('/api/login/', {
		method: 'POST',

		headers: { 'Content-Type': 'application/json' },

		body: JSON.stringify({
			email: email,
			password: password
		})
	})

	if (res.status === 200) {
		return res.json()
	}

	// TODO better error handling
	throw res
}

/**
 *
 * @param {{ onLogin: (token: string) => void }} props
 * @returns
 */
const LoginForm = (props) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	/**
	 *
	 * @param {import('react').FormEvent<HTMLFormElement>} event
	 */
	const handleSubmit = async (event) => {
		event.preventDefault()

		const { token } = await doLogin(email, password)

		props.onLogin(token)
	}

	return (
		<>
			<form className="LoginForm" onSubmit={handleSubmit}>
				Email:
				<input
					className="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				Password:{' '}
				<input
					className="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit">Login</button>
			</form>
		</>
	)
}

export default LoginForm
