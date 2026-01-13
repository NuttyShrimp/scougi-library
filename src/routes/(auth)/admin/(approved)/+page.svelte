<script lang="ts">
	import { TrimesterNames } from '$lib/enums/trimesterNames';
	import { toast } from 'svelte-sonner';
	import ScougiUploader from '$lib/components/ScougiUploader.svelte';
	import type { Scougi } from '$lib/db/schema';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { deleteScougi, GetAllScougis } from '$lib/api';
	import { resolve } from '$app/paths';
	import { SquareArrowOutUpRight, Trash2 } from '@lucide/svelte';

	const client = useQueryClient();

	let scougiQuery = createQuery(() => ({
		queryKey: ['scougis'],
		queryFn: GetAllScougis
	}));

	let deleteQuery = createMutation(() => ({
		mutationFn: deleteScougi,
		onSuccess: () => {
			toast.success('Scougi deleted');
			client.invalidateQueries({ queryKey: ['scougis'] });
		},
		onError: (error) => {
			toast.error('Failed to delete scougi', {
				description: error.message
			});
		}
	}));

	const today = new Date();
	const thisYear =
		today.getMonth() < 8
			? `${today.getFullYear() - 1}-${today.getFullYear()}`
			: `${today.getFullYear()}-${today.getFullYear() + 1}`;

	const generateYears = (published: Scougi[]) => {
		let years: Record<string, number[]> = {};
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

	const years = $derived(generateYears(scougiQuery?.data ?? []));
</script>

<h2 class="my-2">Voeg een nieuwe scougi toe</h2>
<ScougiUploader {years} />
<div class="divider my-2"></div>
<h2 class="my-2">Gepubliceerde scougi's</h2>
{#if scougiQuery.data}
	<table class="table">
		<thead>
			<tr>
				<th>Jaar</th>
				<th>Trimester</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each scougiQuery.data as scougi (scougi.id)}
				<tr>
					<td>{scougi.year}</td>
					<td>{TrimesterNames[scougi.trim]}</td>
					<td class="flex items-center justify-end gap-2">
						<a
							class="no-underline btn space-y-2"
							href={resolve(`/scougi/[year]/[trim]`, {
								year: scougi.year,
								trim: String(scougi.trim)
							})}
							target="_blank"
						>
							<SquareArrowOutUpRight size="14px" />
							Open
						</a>
						<button
							class="btn text-red-500 space-y-2"
							onclick={() => deleteQuery.mutate(scougi.id)}
						>
							<Trash2 size="14px" />
							Delete
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else if scougiQuery.isError}
	<p>Er is een fout opgetreden bij het ophalen van de scougi's</p>
	<p>{scougiQuery.error.message}</p>
{:else}
	<div class="skeleton w-full h-32"></div>
{/if}
