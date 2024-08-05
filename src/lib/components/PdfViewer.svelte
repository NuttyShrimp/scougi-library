<script lang="ts">
	import * as pdfjs from 'pdfjs-dist';
	import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
	import type {
		DocumentInitParameters,
		TypedArray,
		TextContent
	} from 'pdfjs-dist/types/src/display/api';
	import 'pdfjs-dist/web/pdf_viewer.css';
	import { createEventDispatcher } from 'svelte';
	import type { PdfLoadSuccess, PdfPageContent } from 'svelte-pdf-simple';

	let dispatch = createEventDispatcher<{
		load_success: PdfLoadSuccess;
	}>();

	type AdditionalParameters = Omit<
		DocumentInitParameters,
		'url' | 'data' | 'password' | 'httpHeaders'
	>;

	type Properties = {
		url?: string | URL;
		path?: string;
		data?: string | number[] | TypedArray;
		scale?: number;
		offsetX?: number;
		offsetY?: number;
		withAnnotations?: boolean;
		withTextContent?: boolean;
		additionalParams?: AdditionalParameters;
		page?: number;
		height?: number;
	};

	export let props: Properties;

	export async function goToPage(pageNumber: number): Promise<void> {
		if (pageNumber > pdfDoc.numPages || pageNumber < 1) return;
		await renderPage(pdfDoc, pageNumber);
	}

	let canvas: HTMLCanvasElement;
	let textLayer: HTMLDivElement;
	let pdfDoc: PDFDocumentProxy;
	let pdfPage: PDFPageProxy;
	$: _props = {
		page: 1,
		scale: 1.0,
		offsetX: 0,
		offsetY: 0,
		withAnnotations: false,
		withTextContent: false,
		...props
	};
	let pageScale = 1;
	$: isPdfLoading = true;
	$: isPdfLoadSuccess = false;
	$: isPdfLoadFailure = false;
	$: isPdfPageRenderSuccess = false;

	pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

	$: {
		if (_props.url === undefined && _props.data === undefined && _props.path === undefined) {
			isPdfLoadFailure = true;
			console.warn('[svelte-pdf-simple] Missing pdf data source.');
		}
		loadPdf();
	}

	async function renderPage(doc: PDFDocumentProxy, pageNumber: number): Promise<PdfPageContent> {
		pdfPage = await doc.getPage(pageNumber);

		let annotations: Record<string, unknown>[] | null = null;
		let textContent: TextContent | null = null;
		if (_props.withAnnotations) {
			annotations = await pdfPage.getAnnotations();
		}
		if (_props.withTextContent) {
			textContent = await pdfPage.getTextContent();
		}

		let scale = _props.scale ?? 1;
		if (_props.height) {
			const viewport = pdfPage.getViewport({ scale });
			const pageScale = _props.height / viewport.height;
			scale = pageScale * scale;
		}
		pageScale = scale;

		await fillCanvas(pdfPage, scale ?? 1, _props.offsetX ?? 0, _props.offsetY ?? 0);

		return {
			...(annotations != null && { annotations }),
			...(textContent != null && { textContent }),
			pageNumber
		};
	}

	async function loadPdf(pwd?: string): Promise<void> {
		try {
			pdfDoc = await pdfjs.getDocument({
				...(_props.url && { url: _props.url }),
				...(_props.path && { url: _props.path }),
				...(_props.data && { data: _props.data }),
				...(pwd && { password: pwd }),
				...(_props.additionalParams && { ..._props.additionalParams }),
				standardFontDataUrl:
					_props.additionalParams?.standardFontDataUrl ??
					'https://mozilla.github.io/pdf.js/web/standard_fonts/'
			}).promise;

			isPdfLoadSuccess = true;
			const pageContent = await renderPage(pdfDoc, _props.page);
			isPdfPageRenderSuccess = true;

			dispatch('load_success', { totalPages: pdfDoc.numPages, ...pageContent });
		} catch (error: unknown) {
			console.log(error);
			isPdfLoadFailure = true;
			isPdfLoadSuccess = false;
		} finally {
			isPdfLoading = false;
		}
	}

	const fillCanvas = async (
		page: PDFPageProxy,
		scale: number,
		offsetX: number,
		offsetY: number
	): Promise<void> => {
		const canvasContext = canvas.getContext('2d')!;
		const viewport = page.getViewport({ scale, offsetX, offsetY });
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		await pdfPage.render({ canvasContext, viewport }).promise;
		const textContent = await page.getTextContent();

		textLayer.style.left = canvas.offsetLeft + 'px';
		textLayer.style.top = canvas.offsetTop + 'px';

		const pdfjsTextLayer = new pdfjs.TextLayer({
			textContentSource: textContent,
			container: textLayer,
			viewport
		});
		await pdfjsTextLayer.render();
	};
</script>

{#if isPdfLoadSuccess}
	<div style={`--scale-factor: ${pageScale}`} class="relative">
		<canvas
			id="pdf-canvas"
			class:show={isPdfPageRenderSuccess}
			{...isPdfPageRenderSuccess && { ...$$restProps }}
			bind:this={canvas}
		/>
		<div bind:this={textLayer} class="textLayer"></div>
	</div>
{/if}
{#if !isPdfPageRenderSuccess}
	{#if isPdfLoading}
		<slot name="loading" />
	{:else if isPdfLoadFailure}
		<slot name="loading_failed" />
	{/if}
{/if}

<style>
	canvas {
		display: none;
	}

	.show {
		display: block;
	}
</style>
