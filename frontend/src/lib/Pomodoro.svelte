<script>
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	const STATES = {
		WORK: 25,
		BREAK: 5,
		LONG_BREAK: 15
	}

	let state = STATES.WORK
	let active = false
	let breaks = 0
	let seconds
	let interval

	$: seconds = state * 60

	$: if (active) {
		interval = setInterval(nextTick, 1000)
	} else {
		clearInterval(interval)
	}

	function nextTick() {
		seconds--

		if (seconds === 0) {
			next()
		}
	}

	function toggle() {
		active = !active
	}

	function next() {
		active = false

		if (state === STATES.WORK) {
			if (seconds === 0) {
				dispatch('task-completed')
			}

			if (breaks >= 3) {
				state = STATES.LONG_BREAK
				breaks = 0
			} else {
				state = STATES.BREAK
				breaks++
			}
		} else {
			state = STATES.WORK
		}
	}

	const stateUpdater = (type) => () => {
		state = type
	}
</script>

<section>
	<div>
		<button class:state class:active={state === STATES.WORK} on:click={stateUpdater(STATES.WORK)}
			>Work</button
		>
		<button class:state class:active={state === STATES.BREAK} on:click={stateUpdater(STATES.BREAK)}
			>Short Break</button
		>
		<button
			class:state
			class:active={state === STATES.LONG_BREAK}
			on:click={stateUpdater(STATES.LONG_BREAK)}>Long Break</button
		>
	</div>
	<div>{Math.floor(seconds / 60)}:{seconds % 60}</div>
	<div>
		<button on:click={toggle}>{active ? 'Pause' : 'Play'}</button>
		<button on:click={next}>Next</button>
	</div>
</section>

<style>
	section {
		display: grid;
		place-items: center;
		gap: 16px;
	}
	.state {
		opacity: 1;
	}
	.active {
		opacity: 0.6;
	}
</style>
