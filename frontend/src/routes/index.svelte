<script context="module">
	export const prerender = true
</script>

<script>
	import Pomodoro from '$lib/Pomodoro.svelte'
</script>

<svelte:head>
	<title>Potrello</title>
</svelte:head>

<section>
	<Pomodoro on:task-completed={() => alert('done!')} />
</section>

<style>
	section {
		display: grid;
		place-items: center;
		height: 100vh;
	}
</style>
