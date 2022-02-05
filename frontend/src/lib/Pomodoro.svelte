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
		<button class="state" class:active={state === STATES.WORK} on:click={stateUpdater(STATES.WORK)}
			>Pomodoro</button
		>
		<button
			class="state"
			class:active={state === STATES.BREAK}
			on:click={stateUpdater(STATES.BREAK)}>Short Break</button
		>
		<button
			class="state"
			class:active={state === STATES.LONG_BREAK}
			on:click={stateUpdater(STATES.LONG_BREAK)}>Long Break</button
		>
	</div>
	<div class="timer">
		{Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0')}:{(seconds % 60).toString().padStart(2, '0')}
	</div>
	<div>
		<button class="action" on:click={toggle}>{active ? 'Pause' : 'Start'}</button>
		<button class="action next" on:click={next}>|></button>
	</div>
</section>

<style>
	section {
		display: grid;
		place-items: center;
		grid-gap: 16px;
	}

	.state {
		opacity: 1;
	}

	.active {
		border-color: white;
	}

	.timer {
		font-size: 4rem;
	}

	button {
		padding: 8px 12px;
		border: 2px solid var(--primary-color);
		background: rgba(0, 0, 0, 0.15) none repeat scroll 0% 0%;
		color: white;
		border-radius: 6px;
		text-transform: uppercase;
		cursor: pointer;
	}

	.action {
		background: white;
		font-weight: bold;
		color: var(--primary-color);
		font-size: 1.5rem;
	}

	.next {
		font-family: monospace;
		font-weight: bolder;
		letter-spacing: 0.1em;
	}
</style>
