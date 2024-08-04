<script lang="ts">
	import '../app.css';
	import { trpc } from '$lib/trpc';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';
	import type { LayoutData } from './$types';
	import Footer from '$lib/components/Footer.svelte';
	import { Toaster } from 'svelte-sonner';

	export let data: LayoutData;

	$: queryClient = trpc.hydrateFromServer(data.trpc);
</script>

<svelte:head>
	<title>Scougi - Scouts en Gidsen Asse</title>
</svelte:head>

<Toaster richColors />
<QueryClientProvider client={queryClient}>
	<ModeWatcher />
	<div class="prose !max-w-full !w-screen min-h-screen flex flex-col justify-between">
		<main class="grow">
			<slot />
		</main>
		<Footer />
	</div>
</QueryClientProvider>
