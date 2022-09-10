import DropboxChooser from 'react-dropbox-chooser';
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, Button, Container, Divider, Group, Title } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import prisma from '../../lib/prisma';
import React, { useState } from "react";

declare interface ScougiAdminProps {
  // Record of years and trimester in set year where no scougi is uploaded
  years: Record<string, number[]>;
  currentYear: string;
}

const Scougis: NextPage<ScougiAdminProps> = props => {
  const [selectedYear, setSelectedYear] = useState(props.currentYear);
  const [selectedTrim, setSelectedTrim] = useState(props.currentYear);
  return (
    <Container>
      <Title order={3}>Upload new scougi</Title>
      <Group position='right' align={'end'}>
        <Autocomplete
          label="Schooljaar"
          value={selectedYear}
          onChange={setSelectedYear}
          data={Object.keys(props.years)}
        />
        <Autocomplete
          label="Trimester"
          value={selectedTrim}
          onChange={setSelectedTrim}
          disabled={props.years[selectedYear].length === 4}
          data={[]}
        />
        <DropboxChooser
          appKey={'24ejhxqih5zow8j'}
          success={(files: Dropbox.File[]) => console.log(files)}
          multiselect={false}
          linkType={'direct'}
          extensions={['.pdf']}
        >
          <Button leftIcon={<FontAwesomeIcon icon={faFileUpload} />}>
            <div className="dropbox-button">Upload</div>
          </Button>
        </DropboxChooser>
      </Group>
      <Divider mt='md' />
      <Title order={3}>Published scougis</Title>
      <p>Table with published scougis</p>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps<ScougiAdminProps> = async () => {
  const today = new Date();
  let thisYear = today.getMonth() < 8 ? `${today.getFullYear() - 1}-${today.getFullYear()}` : `${today.getFullYear()}-${today.getFullYear() + 1}`
  const published = await prisma.scougi.findMany({
    select: {
      year: true,
      trim: true,
    }
  })

  const years: Record<string, number[]> = {};
  published.forEach(s => {
    if (!years[s.year]) {
      years[s.year] = [];
    }
    years[s.year].push(s.trim)
  })
  if (!years[thisYear]) {
    years[thisYear] = []
  }

  return {
    props: {
      years,
      currentYear: thisYear,
    }
  }
}

export default Scougis;
