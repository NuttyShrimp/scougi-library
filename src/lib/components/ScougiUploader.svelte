<script lang="ts">
	import { TrimOptions } from '$lib/enums/trimesterNames';
	import Svelecte from 'svelecte';
	import DropboxChooser from './DropboxChooser.svelte';
	import type { DropboxFile } from '$lib/types';
	import { toast } from 'svelte-sonner';
	import type { PDFDocument } from 'pdf-lib';
	import { downloadFromDropbox, splitDocToPages, uploadPage } from '$lib/pdf';
	import { writable } from 'svelte/store';
	import PageUploadProgress from './PageUploadProgress.svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { createScougi, createScougiPage } from '$lib/api';
	import { FileUp, Send } from '@lucide/svelte';

	type Props = {
		years: Record<string, number[]>;
	};
	let { years }: Props = $props();

	const yearCreateFilter = (input: string) => {
		return input.match('d{4}-d{4}')?.length === 1;
	};

	let year: string = $state(Object.keys(years)[0]);
	let trim: string = $state('');
	let file: DropboxFile | null = $state(null);
	let processing = false;
	let uploadProgress = writable(0);
	let pageCount = $state(0);

	let trimOptions = $derived(
		TrimOptions.filter((_, i) => years?.[year ?? '2022-2023']?.includes(i) ?? true)
	);

	const newScougiMutation = createMutation(() => ({
		mutationFn: createScougi,
		onError: () => {},
		onSuccess: () => {}
	}));

	const newScougiPageMutation = createMutation(() => ({
		mutationFn: createScougiPage,
		onError: () => {},
		onSuccess: () => {}
	}));

	const uploadScougi = async () => {
		if (processing) return;
		processing = true;

		if (!file) {
			toast.error('No file selected');
			return;
		}
		if (year === '') {
			toast.error('No year selected');
			return;
		}
		if (trim === '') {
			toast.error('No trimester selected');
			return;
		}

		let toastResolver: () => void = () => {};
		toast.promise(
			new Promise<void>((res) => {
				toastResolver = res;
			}),
			{
				component: PageUploadProgress,
				componentProps: {
					counter: uploadProgress,
					max: pageCount
				},
				success: () => {
					return 'The scougi has been uploaded successfully!';
				},
				error: 'Error... :( Try again! Delete the scougi entry if visible in the table'
			}
		);

		try {
			let doc: PDFDocument;
			try {
				doc = await downloadFromDropbox(file.link);
			} catch (e) {
				console.error(e);
				toast.error('Failed to download scougi from dropbox');
				return;
			}
			const pages = await splitDocToPages(doc);
			pageCount = pages.length;

			const newScougi = await newScougiMutation.mutateAsync({
				year,
				trim: Number(trim),
				pages: pages.length
			});
			if (newScougiMutation.isError) {
				console.error(newScougiMutation.error.message);
				toast.error('Failed to create scougi', {
					description: newScougiMutation.error.message
				});
				return;
			}

			const failedPages: number[] = [];
			for (let i = 0; i < pages.length; i++) {
				const pdfStr = uploadPage(pages[i]);
				if (pdfStr == '') {
					throw new Error('Failed to extract page from pdf');
				}
				try {
					newScougiPageMutation.mutate({
						scougiId: newScougi.id,
						data: pdfStr,
						page: i
					});
				} catch (e) {
					console.error(e);
					failedPages.push(i);
				}
				uploadProgress.set(i + 1);
			}
			toastResolver();
			console.log(failedPages);
		} catch (e) {
			console.error(e);
			toast.error('Failed to upload scougi');
		} finally {
			processing = false;
		}
	};
</script>

<form class="flex flex-wrap gap-4 items-end">
	<label class="form-control max-w-xs w-full">
		<div class="label">
			<span class="label-text">Jaar</span>
		</div>
		<Svelecte
			placeholder=""
			name="year"
			options={Object.keys(years)}
			bind:value={year}
			creatable
			createFilter={yearCreateFilter}
		/>
	</label>
	<label class="form-control w-full max-w-xs">
		<div class="label">
			<span class="label-text">Trimester</span>
		</div>
		<select bind:value={trim} class="select select-bordered">
			<option value="" disabled>Pick one</option>
			{#each trimOptions as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</label>
	<div>
		{#if file}
			<div class="label"><span class="label-text">{file.name}</span></div>
		{/if}
		<DropboxChooser bind:file>
			<div class="btn btn-primary">
				<FileUp size="14px" />
				<span class="ml-2">Select scougi</span>
			</div>
		</DropboxChooser>
	</div>
	<button class="btn btn-success" onclick={uploadScougi}>
		<Send size="14px" />
		Upload
	</button>
</form>
