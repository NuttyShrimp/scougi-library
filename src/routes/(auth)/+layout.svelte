<script lang="ts">
	import type { LayoutProps } from './$types';
	let { children }: LayoutProps = $props();
</script>

<div class="container mx-auto p-4">
	{@render children()}
</div>
