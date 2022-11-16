import { Divider, Title, Center, Loader } from "@mantine/core";
import type { NextPage } from "next";
import { YearShelf } from "../components/YearShelf";
import { useQuery } from "react-query";

const Shelfs: NextPage = () => {
  const { isLoading, error, data } = useQuery('repoData', () =>
    fetch("/api/scougi", {
      method: "GET",
    }).then(res => res.json())
  )

  if (error) return (<p>OOP</p>);
  if (isLoading || !data) return (<p>Loading</p>)
  return (
    <div>
      {Object.keys(data).length === 0 ? (
        <Center>
          <Loader size={"xl"} />
        </Center>
      ) : (
        Object.keys(data)
          .reverse()
          .map(year => <YearShelf key={year} year={year} trims={data[year]} />)
      )}
    </div>
  )
}

const Home: NextPage = () => {
  return (
    <div>
      <Center>
        <Title order={2}>Scougi - Scouts en Gidsen Asse</Title>
      </Center>
      <Divider my={"xs"} />
      <Shelfs />
    </div>
  );
};

export default Home;
