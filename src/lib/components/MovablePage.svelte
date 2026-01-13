<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import ScougiPage from './ScougiPage.svelte';
	import createPanZoom, { type PanZoom } from 'panzoom';
	import { TextSelect, ZoomIn, ZoomOut } from '@lucide/svelte';

	let { data }: { data: string } = $props();

	let zoomContainer: HTMLDivElement | null = $state(null);
	let panZoomInstance: PanZoom | null = $state(null);
	let selecting = $state(false);
	let hasBeenRendered = $state(false);

	onMount(() => {
		if (zoomContainer) {
			panZoomInstance = createPanZoom(zoomContainer, {
				bounds: true,
				smoothScroll: true,
				boundsPadding: 0.25,
				minZoom: 0.25
			});
		}
	});
	onDestroy(() => {
		panZoomInstance?.dispose();
	});

	const zoomIn = (e: MouseEvent) => {
		if (!panZoomInstance) return;
		e.preventDefault();
		e.stopPropagation();
		const transform = panZoomInstance.getTransform();
		panZoomInstance.smoothZoomAbs(transform.x, transform.y, transform.scale + 0.25);
	};

	const zoomOut = (e: MouseEvent) => {
		if (!panZoomInstance) return;
		e.preventDefault();
		e.stopPropagation();
		const transform = panZoomInstance.getTransform();
		panZoomInstance.smoothZoomAbs(transform.x, transform.y, transform.scale - 0.25);
	};

	const scalePage = () => {
		if (hasBeenRendered) return;
		hasBeenRendered = true;
		setTimeout(() => {
			if (!zoomContainer) return;
			panZoomInstance?.zoomTo(
				zoomContainer.clientWidth * 0.5,
				zoomContainer.clientHeight * 0.5,
				0.45
			);
		}, 10);
	};
</script>

<div class="relative flex justify-center overflow-hidden items-center">
	<div class="join absolute top-0 z-10 mt-2">
		<button
			class="btn btn-sm btn-square join-item"
			onclick={zoomOut}
			ondblclick={(e) => e.stopPropagation()}
		>
			<ZoomOut size="20px" />
		</button>
		<button
			class="btn btn-sm btn-square join-item"
			onclick={zoomIn}
			ondblclick={(e) => e.stopPropagation()}
		>
			<ZoomIn size="20px" />
		</button>
		<button
			class={'btn btn-sm btn-square join-item ' + (selecting ? 'btn-active' : '')}
			ondblclick={(e) => e.stopPropagation()}
			onclick={() => {
				if (!panZoomInstance) return;
				selecting = !selecting;
				if (selecting) {
					panZoomInstance.pause();
				} else {
					panZoomInstance.resume();
				}
			}}
		>
			<TextSelect size="20px" />
		</button>
	</div>
	<div bind:this={zoomContainer}>
		<ScougiPage {data} on:render={() => scalePage()} />
	</div>
</div>
