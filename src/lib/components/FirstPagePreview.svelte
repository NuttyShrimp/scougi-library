<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import ScougiPage from './ScougiPage.svelte';
	import { GetPageData } from '$lib/api';
	import { resolve } from '$app/paths';

	type Props = {
		id: number;
		year: string;
		trim: number;
		disabled: boolean;
	};
	let { disabled = false, id, year, trim }: Props = $props();

	const pageQuery = createQuery(() => ({
		queryKey: ['page', id, 0],
		queryFn: () => GetPageData(id, 0),
		enabled: !disabled
	}));
</script>

<a href={resolve(`/scougi/[year]/[trim]`, { year, trim: String(trim) })}>
	{#if pageQuery.data}
		<ScougiPage data={pageQuery.data.data} height={100} />
	{:else if pageQuery.isError}
		<p>Error: {pageQuery.error.message}</p>
	{:else}
		<div class="skeleton h-[200px] w-24"></div>
	{/if}
</a>
