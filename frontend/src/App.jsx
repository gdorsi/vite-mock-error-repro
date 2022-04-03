import { useState } from 'react'

import LoginForm from './components/LoginForm'

function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [token, setToken] = useState('')
	const [boardName, setBoardName] = useState('')
	const [boardList, setBoardList] = useState([])
	const [user, setUser] = useState({})
	const [username, setUsername] = useState('')
	const [login, setLogin] = useState(true)
	async function deleteBoard(id) {
		try {
			let res = await fetch('/api/boards/' + id, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
			})

			let resJson = await res.json()
			if (res.status === 200) {
				getUser(token)
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}
	async function getUser(tok) {
		try {
			let res = await fetch('/api/users/', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok }
			})

			let resJson = await res.json()
			if (res.status === 200) {
				setBoardList(resJson.result.boardList)
				setUser(resJson.result.result)
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}
	async function createBoard() {
		let bearer = 'Bearer ' + token
		console.log(bearer)
		try {
			let res = await fetch('/api/boards/', {
				method: 'POST',

				headers: { 'Content-Type': 'application/json', Authorization: bearer },

				body: JSON.stringify({
					name: boardName
				})
			})
			let resJson = await res.json()
			if (res.status === 200) {
				setBoardName('')
				getUser(token)
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}
	function handleLogin(token) {
		setToken(token)
		getUser(token)
	}
	async function handleSignup() {
		try {
			let res = await fetch('/api/signup/', {
				method: 'POST',

				headers: { 'Content-Type': 'application/json' },

				body: JSON.stringify({
					email: email,
					password: password,
					username: username
				})
			})
			let resJson = await res.json()
			if (res.status === 200) {
				setUsername('')
				setToken(resJson.token)
				getUser(resJson.token)
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}

	if (login) {
		return (
			<>
				<button onClick={() => setLogin(false)}>Signup</button>
				<LoginForm onLogin={handleLogin} />
			</>
		)
	}

	return (
		<div>
			{!token ? (
				<div>
					<form
						className="SignupForm"
						onSubmit={(event) => {
							event.preventDefault()
							handleSignup()
						}}
					>
						Email:
						<input
							className="Email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						Username:
						<input
							className="Username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						Password:{' '}
						<input
							className="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button type="submit">Signup</button>
					</form>
					<button onClick={(e) => setLogin(true)}> login instead</button>
				</div>
			) : (
				<div>
					<h1>Welcome, {user.username}</h1>
					<form
						className="addBoard"
						onSubmit={(event) => {
							event.preventDefault()
							createBoard()
						}}
					>
						<input type="text" value={boardName} onChange={(e) => setBoardName(e.target.value)} />
						<button type="submit">+</button>
					</form>
					{boardList ? (
						<div className="boards">
							{boardList.map((board) => (
								<div>
									<button>{board.name}</button>
									<button
										onClick={(event) => {
											event.preventDefault()
											deleteBoard(board._id)
										}}
									>
										x
									</button>
								</div>
							))}
						</div>
					) : (
						<div></div>
					)}
				</div>
			)}
		</div>
	)
}

export default App
