<script lang="ts">
	import scougiImg from '$lib/assets/scougi.png';
	import logoImg from '$lib/assets/logo.png';
	import { trpc } from '$lib/trpc';
	import YearShelf from '$lib/components/YearShelf.svelte';

	let groupedScougis: Record<string, number[]> = {};

	$: scougiQuery = trpc.scougi.all.query();
	$: {
		if ($scougiQuery.data) {
			$scougiQuery.data.forEach((s) => {
				if (!groupedScougis[s.year]) {
					groupedScougis[s.year] = [];
				}
				groupedScougis[s.year][s.trim] = s.id;
			});
		}
	}
	$: scougiKeys = Object.keys(groupedScougis).sort().reverse();
</script>

<div
	class="flex flex-col items-center sm:items-start container bg-zinc-400 mx-auto px-20 py-2 not-prose mb-4"
>
	<img src={scougiImg} alt="Scougi" width={128} height={32} class="w-32" />
	<div class="flex flex-row items-center">
		<p class="text-gray-100">by</p>
		<img src={logoImg} alt="Scouts & Gidsen Asse" width={48} height={48} class="h-12" />
	</div>
</div>

{#if $scougiQuery.data}
	<div class="container mx-auto">
		{#each scougiKeys as year}
			<YearShelf {year} trims={groupedScougis[year]} />
		{/each}
	</div>
{:else if $scougiQuery.isError}
	<p>Error: {$scougiQuery.error.message}</p>
{:else}
	<div class="flex flex-col items-center gap-4">
		<div class="skeleton w-32 h-12"></div>
		<div class="skeleton w-3/4 h-36"></div>
	</div>
{/if}
