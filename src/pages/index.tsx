import { Divider, Title, Center, Loader } from "@mantine/core";
import type { NextPage } from "next";
import { YearShelf } from "../components/YearShelf";
import { useEffect, useState } from "react";

const Home: NextPage = props => {
  const [scougis, setScougis] = useState<Record<string, number[]>>({});

  const fetchScougis = async () => {
    const newScougis = await fetch("/api/scougi", {
      method: "GET",
    }).then(res => res.json());
    setScougis(newScougis);
  };

  useEffect(() => {
    fetchScougis();
  }, []);

  return (
    <div>
      <Center>
        <Title order={2}>Scougi - Scouts en Gidsen Asse</Title>
      </Center>
      <Divider my={"xs"} />
      {Object.keys(scougis).length === 0 ? (
        <Center>
          <Loader size={"xl"} />
        </Center>
      ) : (
        Object.keys(scougis)
          .reverse()
          .map(year => <YearShelf key={year} year={year} trims={scougis[year]} />)
      )}
    </div>
  );
};

export default Home;
