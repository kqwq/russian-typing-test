<script lang="ts">
	import { page } from '$app/stores';
</script>

<header>

	<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
		<a href="/">Home</a>
	</li>
	<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
		<a href="/about">About</a>
	</li>
	<li aria-current={$page.url.pathname.startsWith('/random') ? 'page' : undefined}>
		<a href="/random">Random</a>
	</li>
</header>

<style>
	header {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 3rem;
		background-color: white;
	}
	header li {
		list-style-type: none;
	}
	header li[aria-current='page'] {
		font-weight: bold;
	}




</style>
