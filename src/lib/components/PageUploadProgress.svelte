<script lang="ts">
	import type { Writable } from 'svelte/store';

	type Props = {
		max: number;
		counter: Writable<number>;
	};
	let { max, counter }: Props = $props();
</script>

<div>
	<p>{$counter}/{max} pages uploaded</p>
</div>
