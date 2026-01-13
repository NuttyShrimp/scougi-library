<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Footer from '$lib/components/Footer.svelte';
	import { Toaster } from 'svelte-sonner';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<svelte:head>
	<title>Scougi - Scouts en Gidsen Asse</title>
</svelte:head>

<Toaster richColors />
<QueryClientProvider client={queryClient}>
	<ModeWatcher />
	<div class="prose max-w-full! w-screen! min-h-screen flex flex-col justify-between">
		<main class="grow">
			<slot />
		</main>
		<Footer />
	</div>
</QueryClientProvider>
