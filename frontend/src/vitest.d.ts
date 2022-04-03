import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'vitest' {
	interface Matchers<R = void, T = {}>
		extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}
