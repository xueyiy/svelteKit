<script>
	import { session } from '$app/stores';
</script>

<svelte:head>
	<title>SvelteKit Test App</title>
</svelte:head>

<div class="home-page">
	<div class="banner">
		<div class="container">
			<h1 class="logo-font">SvelteKit Test App</h1>
			<p>Simple SvelteKit project testing</p>
		</div>
	</div>

	<div class="container page">
		<div class="row">
			<div class="col-md-12" style="text-align: center; padding: 2rem;">
				<h2>Welcome!</h2>
				<p>This is a simplified SvelteKit application .</p>
				
				{#if $session.user}
					<p>You are logged in as: <strong>{$session.user.username}</strong></p>
					<a href="/settings" class="btn btn-primary">Settings</a>
				{:else}
					<p>Please sign in to continue.</p>
					<a href="/login" class="btn btn-primary">Sign In</a>
					<a href="/register" class="btn btn-secondary" style="margin-left: 1rem;">Sign Up</a>
				{/if}
			</div>
		</div>
	</div>
</div>
