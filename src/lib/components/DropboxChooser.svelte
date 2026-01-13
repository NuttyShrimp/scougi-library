<script lang="ts">
	import type { DropboxChooserOptions, DropboxFile } from '$lib/types';
	import type { Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';

	type Props = {
		file: DropboxFile | null;
		children: Snippet;
	};
	let { file = $bindable(), children }: Props = $props();

	const options: DropboxChooserOptions = {
		success: (files: DropboxFile[]) => {
			if (files.length < 1) {
				toast.error('Please select a file');
			}
			file = files[0];
			console.log('success', files);
		},
		cancel: () => {
			console.log('cancel');
		},
		linkType: 'direct', // "preview",
		multiselect: false,
		folderselect: false,
		extensions: ['pdf']
	};

	let openDropboxChooser = () => {
		if (window.Dropbox) {
			window.Dropbox.choose(options);
		}
	};
</script>

<button onclick={openDropboxChooser}>
	{@render children()}
</button>
