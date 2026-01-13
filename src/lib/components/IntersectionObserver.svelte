<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	let intersecting = $state(false);

	type Props = {
		once?: boolean;
		top?: number;
		bottom?: number;
		left?: number;
		right?: number;
		children: Snippet<[boolean]>;
	};

	let { once = false, top = 0, bottom = 0, left = 0, right = 0, children }: Props = $props();

	let container: HTMLDivElement;
	onMount(() => {
		if (typeof IntersectionObserver !== 'undefined') {
			const rootMargin = `${bottom}px ${left}px ${top}px ${right}px`;
			const observer = new IntersectionObserver(
				(entries) => {
					intersecting = entries[0].isIntersecting;
					if (intersecting && once) {
						observer.unobserve(container);
					}
				},
				{
					rootMargin
				}
			);
			observer.observe(container);
			return () => observer.unobserve(container);
		}
	});
</script>

<div bind:this={container}>
	{@render children(intersecting)}
</div>
