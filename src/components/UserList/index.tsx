import { Center, Container, Loader, Stack, Table, Text } from "@mantine/core"
import { FC } from "react"
import { useQuery } from "react-query"

declare interface UserListProps {
  entry: FC<{ user: DB.User }>
  approved: boolean
}

export const UserList: FC<UserListProps> = ({ entry, approved }) => {
  const { error, isLoading, data: users } = useQuery<DB.User[]>('not-approved-users', () => {
    return fetch(`/api/users/get?approved=${approved}`).then(res => res.json())
  })


  if (error) {
    return (
      <Container>
        <Center>
          <Text>Failed to fetch approved users</Text>
        </Center>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container>
        <Center>
          <Stack>
            <Loader />
            <Text>Loading...</Text>
          </Stack>
        </Center>
      </Container>
    )
  }

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <th>Account Id</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(users ?? []).map(u => entry({ user: u }))}
        </tbody>
      </Table>
    </Container>
  )
}
