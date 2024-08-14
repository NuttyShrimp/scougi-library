<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let max: number;
	export let counter: Writable<number>;
</script>

<div>
	<p>{$counter}/{max} pages uploaded</p>
</div>
