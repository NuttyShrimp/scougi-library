<script lang="ts">
	import FirstPagePreview from './FirstPagePreview.svelte';

	export let year: string;
	export let trims: number[];
</script>

<div>
	<h2 class="text-center my-4">{year}</h2>
	<div class="border border-gray-200 rounded p-2 flex h-32 gap-4 justify-evenly sm:mx-0 mx-2">
		{#each trims.filter((t) => t) as t, i}
			<FirstPagePreview trim={i} {year} id={t} />
		{/each}
	</div>
</div>
