<script lang="ts">
	import { approvedUser, GetNonApprovedUsers } from '$lib/api';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';

	const client = useQueryClient();

	const userQuery = createQuery(() => ({
		queryKey: ['users'],
		queryFn: GetNonApprovedUsers
	}));
	const approveMutation = createMutation(() => ({
		mutationFn: approvedUser,
		onSuccess: () => {
			toast.success('User approved');
			client.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (e) => {
			toast.error('Failed to approve user', { description: e.message });
		}
	}));
</script>

<h2 class="my-2">Pending Approvals</h2>
<p>Deze gebruikers wachten op een approval voor toegang tot het platform</p>
{#if userQuery.data}
	<table class="table">
		<thead>
			<tr>
				<th>Name</th>
				<th>Email</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each userQuery.data as user (user.id)}
				<tr>
					<td>{user.name}</td>
					<td>{user.email}</td>
					<td>
						<button class="btn" onclick={() => approveMutation.mutate(user.id)}>Approve</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else if userQuery.isError}
	<p>Er ging iets mis tijdens het ophalen van de gebruikers lijst!</p>
	<p>{userQuery.error.message}</p>
{:else}
	<div class="skeleton w-full h-32"></div>
{/if}
