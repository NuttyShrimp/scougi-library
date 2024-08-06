<script lang="ts">
	import { trpc } from '$lib/trpc';
	import ScougiPage from './ScougiPage.svelte';

	export let id: number;
	export let year: string;
	export let trim: number;
	export let disabled: boolean = false;

	$: pageQuery = trpc.scougi.page.query(
		{ scougi_id: id, page: 0 },
		{
			enabled: !disabled
		}
	);
</script>

<a href={`/scougi/${year}/${trim}`}>
	{#if $pageQuery.data}
		<ScougiPage data={$pageQuery.data.data} height={200} />
	{:else if $pageQuery.isError}
		<p>Error: {$pageQuery.error.message}</p>
	{:else}
		<div class="skeleton h-[200px] w-24"></div>
	{/if}
</a>
