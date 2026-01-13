<script lang="ts">
	import type { PageProps } from './$types';
	import { TrimesterNames } from '$lib/enums/trimesterNames';
	import MovablePage from '$lib/components/MovablePage.svelte';
	import { goto } from '$app/navigation';
	import { createQuery } from '@tanstack/svelte-query';
	import { GetPageData } from '$lib/api';
	import { resolve } from '$app/paths';
	import { ArrowLeft, ChevronLeft, ChevronRight } from '@lucide/svelte';

	let { data }: PageProps = $props();
	let page = $derived(data.page ?? 1);

	const pageQuery = createQuery(() => ({
		queryKey: ['page', data.scougi.id, page - 1],
		queryFn: () => GetPageData(data.scougi.id, page - 1)
	}));

	const updatePage = (newPage: number) => {
		newPage = Math.max(0, Math.min(data.scougi.pages, newPage));
		page = newPage;
		goto(`?page=${page}`);
	};

	const updatePageFromInput = () => {
		updatePage(page);
	};
</script>

<div class="flex flex-col">
	<header class="flex justify-between items-center px-2 pb-2">
		<div class="flex gap-2 items-center font-semibold">
			<a href={resolve('/')}>
				<ArrowLeft size="14px" />
			</a>
			<p class="m-0! p-0!">Scougi - {data.scougi.year} - {TrimesterNames[data.scougi.trim]}</p>
		</div>
		<!-- <button class="btn btn-sm">Download</button> -->
	</header>
	<div class="h-[80vh] mb-4 flex justify-center">
		{#if pageQuery.data}
			<MovablePage data={pageQuery.data.data} />
		{:else if pageQuery.isError}
			<p>Error: {pageQuery.error.message}</p>
		{:else}
			<div class="mx-4 skeleton h-full w-[50vw]"></div>
		{/if}
	</div>
	<div class="flex gap-2 not-prose justify-center">
		<button
			class={`btn btn-ghost btn-circle btn-sm ${page === 1 ? 'btn-disabled' : ''}`}
			onclick={() => {
				updatePage(page - 1);
			}}
		>
			<ChevronLeft size="20px" />
		</button>
		<p class="min-w-16 text-center">
			<input
				class="w-8 px-0 text-center input input-sm input-bordered"
				value={page}
				onchange={(e) => (page = Number(e.currentTarget.value))}
				onkeyup={(e) => {
					if (e.key === 'Enter') {
						updatePageFromInput();
					}
				}}
				onblur={updatePageFromInput}
			/>
			/ {data.scougi.pages}
		</p>
		<button
			class={`btn btn-ghost btn-circle btn-sm ${page === data.scougi.pages ? 'btn-disabled' : ''}`}
			onclick={() => {
				updatePage(page + 1);
			}}
		>
			<ChevronRight size="20px" />
		</button>
	</div>
</div>
