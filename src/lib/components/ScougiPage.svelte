<script lang="ts">
	import PdfViewer from './PdfViewer.svelte';
	export let data: string;
	$: pageHeight = (80 * window.innerHeight) / 100;
</script>

<PdfViewer
	props={{
		data: atob(data),
		scale: 1,
		withAnnotations: true,
		withTextContent: true,
		height: pageHeight,
		additionalParams: {
			cMapUrl: `https://unpkg.com/pdfjs-dist@2.13.216/cmaps/`,
			standardFontDataUrl: `https://unpkg.com/pdfjs-dist@2.13.216/standard_fonts`
		}
	}}
/>
