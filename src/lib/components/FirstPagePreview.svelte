<script lang="ts">
	import { trpc } from '$lib/trpc';
	import ScougiPage from './ScougiPage.svelte';

	export let id: number;
	export let year: string;
	export let trim: number;

	$: pageQuery = trpc.scougi.page.query({ scougi_id: id, page: 0 });
</script>

<a href={`/scougi/${year}/${trim}`}>
	{#if $pageQuery.data}
		<ScougiPage data={$pageQuery.data.data} height={110} />
	{:else if $pageQuery.isError}
		<p>Error: {$pageQuery.error.message}</p>
	{:else}
		<div class="skeleton h-[110px] w-24"></div>
	{/if}
</a>
