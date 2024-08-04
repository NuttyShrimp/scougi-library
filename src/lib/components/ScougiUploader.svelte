<script lang="ts">
	import { TrimOptions } from '$lib/enums/trimesterNames';
	import Svelecte from 'svelecte';
	import DropboxChooser from './DropboxChooser.svelte';
	import Fa from 'svelte-fa';
	import { faFileUpload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
	import type { DropboxFile } from '$lib/types';

	export let years: Record<string, number[]>;

	const yearCreateFilter = (input: string) => {
		return input.match('d{4}-d{4}')?.length === 1;
	};

	let year: string;
	let trim: string;
	let file: DropboxFile;

	const uploadScougi = async () => {};

	$: trimOptions = TrimOptions.filter((_, i) => years?.[year ?? '2022-2023']?.includes(i) ?? true);
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
			{#each trimOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</label>
	<div>
		{#if file}
			<div class="label"><span class="label-text">{file.name}</span></div>
		{/if}
		<DropboxChooser {file}>
			<div class="btn btn-primary">
				<Fa icon={faFileUpload} size={'lg'} />
				<span class="ml-2">Select scougi</span>
			</div>
		</DropboxChooser>
	</div>
	<button class="btn btn-success" on:click={uploadScougi}>
		<Fa icon={faPaperPlane} size={'lg'} />
		Upload
	</button>
</form>
