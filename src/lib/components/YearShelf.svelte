<script lang="ts">
	import FirstPagePreview from './FirstPagePreview.svelte';
	import IntersectionObserver from './IntersectionObserver.svelte';

	type Props = {
		year: string;
		trims: number[];
	};
	let { year, trims }: Props = $props();
</script>

<div>
	<h2 class="text-center my-4">{year}</h2>
	<div
		class="border border-gray-200 rounded p-2 flex flex-wrap min-h-32 gap-4 justify-evenly sm:mx-0 mx-2"
	>
		{#each trims.filter((t) => t) as t, i (t)}
			<IntersectionObserver once={true}>
				{#snippet children(intersecting)}
					<FirstPagePreview trim={i} {year} id={t} disabled={!intersecting} />
				{/snippet}
			</IntersectionObserver>
		{/each}
	</div>
</div>
