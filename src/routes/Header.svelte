<script lang="ts">
	import { page } from '$app/stores';
</script>

<header>
	<ol>
		<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
			<a href="/">Typing Test</a>
		</li>
		<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
			<a href="/about">About</a>
		</li>
		<li aria-current={$page.url.pathname.startsWith('/random') ? 'page' : undefined}>
			<a href="/random">Random</a>
		</li>
	</ol>
</header>

<style>
	ol {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 3rem;
		background-color: white;
		margin: 0;
	}
	ol li {
		list-style-type: none;
	}
	ol li[aria-current='page'] {
		font-weight: bold;
	}
</style>
