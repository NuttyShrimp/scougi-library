<script lang="ts">
	import PdfViewer from './PdfViewer.svelte';

	type Props = {
		data: string;
		height: number | undefined;
		onrender: (p1: boolean) => void;
	};
	let { data, height = undefined, onrender }: Props = $props();

	let pageHeight = $derived(height ?? window.innerHeight * 0.8);
	let pdfProps = $derived({
		data: atob(data),
		scale: 2.2,
		height: pageHeight,
		withAnnotations: true,
		withTextContent: true,
		additionalParams: {
			cMapUrl: `https://unpkg.com/pdfjs-dist@2.13.216/cmaps/`,
			standardFontDataUrl: `https://unpkg.com/pdfjs-dist@2.13.216/standard_fonts`
		}
	});
</script>

<PdfViewer props={pdfProps} {onrender}>
	{#snippet loading()}
		<div class="skeleton w-full" style:height={pageHeight}></div>
	{/snippet}
</PdfViewer>
