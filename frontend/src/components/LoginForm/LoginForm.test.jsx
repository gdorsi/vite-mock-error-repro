// @ts-check
import { render, screen, expect, describe, it, vi, userEvent, waitFor } from '../../test-utils'
import LoginForm from './LoginForm'
import axios from 'redaxios'

vi.mock('redaxios')

describe('LoginForm', () => {
	const props = {
		onLogin: vi.fn()
	}

	function setup() {
		return {
			user: userEvent.setup(),
			rtl: render(<LoginForm {...props} />)
		}
	}

	it('submits the form', async () => {
		vi.mocked(axios).mockImplementationOnce(() => {
			/** @type {*} */
			const response = Promise.resolve({ data: { token: 'success' } })

			return response
		})

		const { user } = setup()

		user.type(
			screen.getByRole('textbox', {
				name: 'Email'
			}),
			'test@test.test'
		)

		user.type(screen.getByLabelText('Password'), 'test{enter}')

		await waitFor(() => expect(props.onLogin).toHaveBeenCalledWith('success'))
	})
})
