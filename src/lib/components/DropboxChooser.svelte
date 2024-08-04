<script lang="ts">
	import type { DropboxChooserOptions, DropboxFile } from '$lib/types';
	import { toast } from 'svelte-sonner';

	export let file: DropboxFile | null = null;

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

<button on:click={openDropboxChooser}>
	<slot />
</button>
