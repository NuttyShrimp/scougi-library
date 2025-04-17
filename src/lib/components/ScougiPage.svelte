<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import PdfViewer from './PdfViewer.svelte';

	export let data: string;
	export let height: number | undefined = undefined;
	let dispatch = createEventDispatcher<{
		render: boolean;
	}>();

	$: pageHeight = height ?? window.innerHeight * 0.8;
	$: pdfProps = {
		data: atob(data),
		scale: 2.2,
		height: pageHeight,
		withAnnotations: true,
		withTextContent: true,
		additionalParams: {
			cMapUrl: `https://unpkg.com/pdfjs-dist@2.13.216/cmaps/`,
			standardFontDataUrl: `https://unpkg.com/pdfjs-dist@2.13.216/standard_fonts`
		}
	};
</script>

<PdfViewer props={pdfProps} on:render={() => dispatch('render', true)}>
	<div slot="loading" class="skeleton w-full" style:height={pageHeight} />
</PdfViewer>
