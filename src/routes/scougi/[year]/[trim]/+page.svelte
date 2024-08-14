<script lang="ts">
	import { faArrowLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import { TrimesterNames } from '$lib/enums/trimesterNames';
	import { trpc } from '$lib/trpc';
	import MovablePage from '$lib/components/MovablePage.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let page = data.page ?? 1;

	$: pageQuery = trpc.scougi.page.query({ page: page - 1, scougi_id: data.scougi.id });

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
			<a href="/"><Fa icon={faArrowLeft} /></a>
			<p class="m-0">Scougi - {data.scougi.year} - {TrimesterNames[data.scougi.trim]}</p>
		</div>
		<!-- <button class="btn btn-sm">Download</button> -->
	</header>
	<div class="h-[80vh] mb-4 flex justify-center">
		{#if $pageQuery.data}
			<MovablePage data={$pageQuery.data.data} />
		{:else if $pageQuery.isError}
			<p>Error: {$pageQuery.error.message}</p>
		{:else}
			<div class="mx-4 skeleton h-full w-[50vw]"></div>
		{/if}
	</div>
	<div class="flex gap-2 not-prose justify-center">
		<button
			class={`btn btn-ghost btn-circle btn-sm ${page === 1 ? 'btn-disabled' : ''}`}
			on:click={() => {
				updatePage(page - 1);
			}}
		>
			<Fa icon={faChevronLeft} />
		</button>
		<p class="min-w-16 text-center">
			<input
				class="w-8 px-0 text-center input input-sm input-bordered"
				value={page}
				on:change={(e) => (page = Number(e.currentTarget.value))}
				on:keyup={(e) => {
					if (e.key === 'Enter') {
						updatePageFromInput();
					}
				}}
				on:blur={updatePageFromInput}
			/>
			/ {data.scougi.pages}
		</p>
		<button
			class={`btn btn-ghost btn-circle btn-sm ${page === data.scougi.pages ? 'btn-disabled' : ''}`}
			on:click={() => {
				updatePage(page + 1);
			}}
		>
			<Fa icon={faChevronRight} />
		</button>
	</div>
</div>
