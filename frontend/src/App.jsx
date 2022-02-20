import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [token, setToken] = useState('')
	const [boardName, setBoardName] = useState('')
	const [boardList, setBoardList] = useState([])
	const [user, setUser] = useState({})
	async function getUser(tok) {
		try {
			let res = await fetch('http://localhost:3001/users/', {
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
			let res = await fetch('http://localhost:3001/boards/', {
				method: 'POST',

				headers: { 'Content-Type': 'application/json', Authorization: bearer },

				body: JSON.stringify({
					name: boardName
				})
			})
			let resJson = await res.json()
			if (res.status === 200) {
				setBoardName('')
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}
	async function handleLogin() {
		try {
			let res = await fetch('http://localhost:3001/login/', {
				method: 'POST',

				headers: { 'Content-Type': 'application/json' },

				body: JSON.stringify({
					email: email,
					password: password
				})
			})
			let resJson = await res.json()
			if (res.status === 200) {
				setEmail('')
				setPassword('')
				setToken(resJson.token)
				getUser(resJson.token)
			} else {
				console.log('Some error occured')
			}
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<div>
			{!token ? (
				<div>
					<form
						className="Loginform"
						onSubmit={(event) => {
							event.preventDefault()
							handleLogin()
						}}
					>
						Email:
						<input
							className="Email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						Password:{' '}
						<input
							className="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button type="submit">Login</button>
					</form>
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
								<div>{board.name}</div>
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
