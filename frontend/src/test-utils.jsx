// @ts-check
import { render } from '@testing-library/react'
import { expect } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'

global.IS_REACT_ACT_ENVIRONMENT = true

/** @type {import('react').FC} */
const AllTheProviders = ({ children }) => {
	return <>{children}</>
}

/**
 *
 * @param {import('react').ReactElement} ui
 * @param {Omit<import('@testing-library/react').RenderOptions, 'wrapper'> | void} options
 */
const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

expect.extend(matchers)

// re-export everything
export * from '@testing-library/react'
/** @type {import('./vitest')} */
export * from 'vitest'

// override render method
export { customRender as render }
