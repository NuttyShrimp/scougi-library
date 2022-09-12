import { Divider, Title, Center } from "@mantine/core";
import type { GetServerSideProps, NextPage } from "next";
import prisma from "../lib/prisma";
import { YearShelf } from "../components/YearShelf";

interface HomeProps {
  scougis: Record<string, number[]>;
}

const Home: NextPage<HomeProps> = props => {
  return (
    <div>
      <Center>
        <Title order={2}>Scougi - Scouts en Gidsen Asse</Title>
      </Center>
      <Divider my={"xs"} />
      {Object.keys(props.scougis).map(year => (
        <YearShelf key={year} year={year} trims={props.scougis[year]} />
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const scougis = await prisma.scougi.findMany({
    select: {
      id: true,
      trim: true,
      year: true,
    },
  });
  const filteredScougis: Record<string, number[]> = {};
  scougis.forEach(s => {
    if (!filteredScougis[s.year]) {
      filteredScougis[s.year] = [];
    }
    filteredScougis[s.year][s.trim] = s.id;
  });
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      scougis: filteredScougis,
    },
  };
};

export default Home;
