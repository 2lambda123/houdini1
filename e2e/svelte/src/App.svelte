<script lang="ts">
	import { graphql } from '$houdini'

	import houdiniLogo from './assets/logo_l.svg'
	import svelteLogo from './assets/svelte.svg'
	import Counter from './lib/Counter.svelte'

	const store = graphql(`
		query Hello @load {
			hello
		}
	`)
</script>

<main>
	<div>
		<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
			<img src="/vite.svg" class="logo" alt="Vite Logo" />
		</a>
		<a href="https://svelte.dev" target="_blank" rel="noreferrer">
			<img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
		</a>
		<a href="https://www.houdinigraphql.com/" target="_blank" rel="noreferrer">
			<img src={houdiniLogo} class="logo houdini" alt="Houdini Logo" />
		</a>
	</div>
	<h2>{$store.data?.hello}</h2>

	<div class="card">
		<Counter />
	</div>

	<p class="read-the-docs">Click on logos to learn more!</p>
</main>

<style>
	.logo {
		height: 6em;
		padding: 1.5em;
		will-change: filter;
		transition: filter 300ms;
	}
	.logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}
	.logo.svelte:hover {
		filter: drop-shadow(0 0 2em #ff3e00aa);
	}
	.logo.houdini:hover {
		filter: drop-shadow(0 0 2em #855aff);
	}
	.read-the-docs {
		color: #888;
	}
</style>
