<script lang="ts">
	import { TrimesterNames } from '$lib/enums/trimesterNames';
	import { faArrowUpRightFromSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
	import { trpc } from '$lib/trpc';
	import Fa from 'svelte-fa';
	import { toast } from 'svelte-sonner';
	import ScougiUploader from '$lib/components/ScougiUploader.svelte';
	import type { Scougi } from '$lib/db/schema';

	let scougiQuery = trpc.scougi.all.query();
	let deleteQuery = trpc.scougi.delete.mutation({
		onSuccess: () => {
			toast.success('Scougi deleted');
		},
		onError: (error) => {
			toast.error('Failed to delete scougi', {
				description: error.message
			});
		}
	});

	let years: Record<string, number[]> = {};
	const today = new Date();
	const thisYear =
		today.getMonth() < 8
			? `${today.getFullYear() - 1}-${today.getFullYear()}`
			: `${today.getFullYear()}-${today.getFullYear() + 1}`;

	const generateYears = (published: Scougi[]) => {
		published.forEach((s) => {
			if (!years[s.year]) {
				years[s.year] = [0, 1, 2, 3];
			}
			years[s.year] = years[s.year].filter((t) => t !== s.trim);
		});

		if (!years[thisYear]) {
			years[thisYear] = [0, 1, 2, 3];
		}
		return years;
	};

	$: years = generateYears($scougiQuery?.data ?? []);

	const deleteScougi = (id: number) => {
		$deleteQuery.mutate({ id });
	};
</script>

<h2 class="my-2">Voeg een nieuwe scougi toe</h2>
<ScougiUploader {years} />
<div class="divider my-2"></div>
<h2 class="my-2">Gepubliceerde scougi's</h2>
{#if $scougiQuery.data}
	<table class="table">
		<thead>
			<tr>
				<th>Jaar</th>
				<th>Trimester</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each $scougiQuery.data as scougi (scougi.id)}
				<tr>
					<td>{scougi.year}</td>
					<td>{TrimesterNames[scougi.trim]}</td>
					<td class="flex items-center justify-end gap-2">
						<a
							class="no-underline btn"
							href={`/scougi/${scougi.year}/${scougi.trim}`}
							target="_blank"
						>
							<Fa icon={faArrowUpRightFromSquare} />
							<span> Open </span>
						</a>
						<button class="btn text-red-500" on:click={() => deleteScougi(scougi.id)}>
							<Fa icon={faTrashCan} />
							Delete
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else if $scougiQuery.isError}
	<p>Er is een fout opgetreden bij het ophalen van de scougi's</p>
	<p>{$scougiQuery.error.message}</p>
{:else}
	<div class="skeleton w-full h-32"></div>
{/if}
