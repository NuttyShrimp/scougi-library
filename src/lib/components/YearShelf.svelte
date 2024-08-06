<script lang="ts">
	import FirstPagePreview from './FirstPagePreview.svelte';
	import IntersectionObserver from './IntersectionObserver.svelte';

	export let year: string;
	export let trims: number[];
</script>

<div>
	<h2 class="text-center my-4">{year}</h2>
	<div
		class="border border-gray-200 rounded p-2 flex flex-wrap min-h-32 gap-4 justify-evenly sm:mx-0 mx-2"
	>
		{#each trims.filter((t) => t) as t, i}
			<IntersectionObserver once={true} let:intersecting>
				<FirstPagePreview trim={i} {year} id={t} disabled={!intersecting} />
			</IntersectionObserver>
		{/each}
	</div>
</div>
