<script lang="ts">
	import { trpc } from '$lib/trpc';
	import { toast } from 'svelte-sonner';

	$: userQuery = trpc.user.allNonApproved.query();
	let approveMutation = trpc.user.approve.mutation({
		onSuccess: () => {
			toast.success('User approved');
			trpc.user.allNonApproved.utils.invalidate();
		},
		onError: (e) => {
			toast.error('Failed to approve user', { description: e.message });
		}
	});
</script>

<h2 class="my-2">Pending Approvals</h2>
<p>Deze gebruikers wachten op een approval voor toegang tot het platform</p>
{#if $userQuery.data}
	<table class="table">
		<thead>
			<tr>
				<th>Name</th>
				<th>Email</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each $userQuery.data as user (user.id)}
				<tr>
					<td>{user.name}</td>
					<td>{user.email}</td>
					<td>
						<button class="btn" on:click={() => $approveMutation.mutate({ id: user.id })}
							>Approve</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else if $userQuery.isError}
	<p>Er ging iets mis tijdens het ophalen van de gebruikers lijst!</p>
	<p>{$userQuery.error.message}</p>
{:else}
	<div class="skeleton w-full h-32"></div>
{/if}
