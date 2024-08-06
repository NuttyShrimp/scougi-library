<script lang="ts">
	import PdfViewer from './PdfViewer.svelte';

	export let data: string;
	export let height: number | undefined = undefined;

	$: pageHeight = height ?? (80 * window.innerHeight) / 100;
	$: pdfProps = {
		data: atob(data),
		scale: 1,
		withAnnotations: true,
		withTextContent: true,
		height: pageHeight,
		additionalParams: {
			cMapUrl: `https://unpkg.com/pdfjs-dist@2.13.216/cmaps/`,
			standardFontDataUrl: `https://unpkg.com/pdfjs-dist@2.13.216/standard_fonts`
		}
	};
</script>

<PdfViewer props={pdfProps}>
	<div slot="loading" class="skeleton w-full" style:height={pageHeight} />
</PdfViewer>
