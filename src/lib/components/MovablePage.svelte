<script lang="ts">
	import { onMount } from 'svelte';
	import ScougiPage from './ScougiPage.svelte';
	import createPanZoom, { type PanZoom } from 'panzoom';
	import Fa from 'svelte-fa';
	import {
		faICursor,
		faMagnifyingGlassMinus,
		faMagnifyingGlassPlus
	} from '@fortawesome/free-solid-svg-icons';

	export let data: string;

	let zoomContainer: HTMLDivElement;
	let panZoomInstance: PanZoom;
	let selecting = false;

	onMount(() => {
		panZoomInstance = createPanZoom(zoomContainer, {
			bounds: true,
			smoothScroll: true,
			boundsPadding: 0.5,
			minZoom: 1
		});
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
</script>

<div class="relative flex justify-center overflow-hidden items-center">
	<div class="join absolute top-0 z-10 mt-2">
		<button
			class="btn btn-sm btn-square join-item"
			on:click={zoomOut}
			on:dblclick={(e) => e.stopPropagation()}
		>
			<Fa icon={faMagnifyingGlassMinus} size="lg" /></button
		>
		<button
			class="btn btn-sm btn-square join-item"
			on:click={zoomIn}
			on:dblclick={(e) => e.stopPropagation()}
		>
			<Fa icon={faMagnifyingGlassPlus} size="lg" />
		</button>
		<button
			class={'btn btn-sm btn-square join-item ' + (selecting ? 'btn-active' : '')}
			on:dblclick={(e) => e.stopPropagation()}
			on:click={() => {
				selecting = !selecting;
				if (selecting) {
					panZoomInstance.pause();
				} else {
					panZoomInstance.resume();
				}
			}}><Fa icon={faICursor} size="lg" /></button
		>
	</div>
	<div bind:this={zoomContainer}>
		<ScougiPage {data} />
	</div>
</div>
