// @ts-check
import { render, screen, expect, describe, it, vi } from '../../test-utils'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
	const props = {
		onLogin: vi.fn()
	}

	function setup() {
		return render(<LoginForm {...props} />)
	}

	it('renders the form', () => {
		setup()

		expect(
			screen.getByRole('textbox', {
				name: 'Email'
			})
		).toBeInTheDocument()

		expect(screen.getByLabelText('Password')).toBeInTheDocument()
	})
})
