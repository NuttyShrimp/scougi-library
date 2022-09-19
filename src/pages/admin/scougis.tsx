import DropboxChooser from "react-dropbox-chooser";
import {
  faCircleCheck,
  faExclamationTriangle,
  faExternalLink,
  faFileUpload,
  faPaperPlane,
  faTrash,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Container, Divider, Group, Select, Title, Text, Table, Checkbox, Menu } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import prisma from "../../lib/prisma";
import React, { useState } from "react";
import { TrimesterNames } from "../../enums/trimesterNames";
import { showNotification } from "@mantine/notifications";
import { flushSync } from "react-dom";
import { pdfjs } from "react-pdf";
import { useRouter } from "next/router";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

declare interface ScougiAdminProps {
  // Record of years and trimester in set year where no scougi is uploaded
  years: Record<string, number[]>;
  currentYear: string;
  published: Omit<DB.Scougi, "pages" | "updatedAt">[];
}

const Scougis: NextPage<ScougiAdminProps> = props => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(props.currentYear);
  const [selectedTrim, setSelectedTrim] = useState(props.years[props.currentYear][0] ?? undefined);
  const [selectedFile, setSelectedFile] = useState<Dropbox.File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const publishScougi = async () => {
    if (!selectedFile) return;
    try {
      flushSync(() => setIsUploading(true));
      const res = await fetch("/api/scougi/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: selectedYear,
          trim: selectedTrim,
          url: selectedFile?.link,
          origin: location.origin,
        }),
      });
      if (!res.ok) {
        showNotification({
          title: "Failed to publish",
          message: "Something went wrong while trying to publish a new scougi, Try again later",
          color: "red",
          icon: <FontAwesomeIcon icon={faXmarkCircle} />,
        });
        return;
      }
      showNotification({
        title: "Started page processing process",
        message: "Do not leave the page otherwise the pages of the scougi will not be generated properly",
        color: "orange",
        icon: <FontAwesomeIcon icon={faExclamationTriangle} />,
      });

      const resData = await res.json()
      if (resData.pages) {
        for (let i = 0; i < resData.pages; i++) {
          await fetch(`${origin}/api/scougi/page`, {
            method: "POST",
            body: JSON.stringify({
              pageNumber: i,
              scougiId: resData.scougiId
            }),
          })
        }
      }
      showNotification({
        title: `Successfully published a new scougi`,
        message: "Refresh your page to see the changes",
        color: "green",
        icon: <FontAwesomeIcon icon={faCircleCheck} />,
      });
      refreshData();
    } catch (e) {
      console.error(e);
      showNotification({
        title: "Failed to publish",
        message: "Something went wrong while trying to publish a new scougi, Try again later",
        color: "red",
        icon: <FontAwesomeIcon icon={faXmarkCircle} />,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const toggleScougiHide = async (id: number, toggle: boolean) => {
    try {
      const res = await fetch("/api/scougi/hide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          toggle,
        }),
      });
      if (!res.ok) {
        showNotification({
          title: `Failed toggle the hidden state of the edition`,
          message: "",
          color: "red",
          icon: <FontAwesomeIcon icon={faXmarkCircle} />,
        });
        return;
      }
      showNotification({
        title: `Successfully hidden the edition`,
        message: "",
        color: "green",
        icon: <FontAwesomeIcon icon={faCircleCheck} />,
      });
      refreshData();
    } catch (e) {
      console.error(e);
      showNotification({
        title: `Failed toggle the hidden state of the edition`,
        message: "",
        color: "red",
        icon: <FontAwesomeIcon icon={faXmarkCircle} />,
      });
    }
  };

  const deleteScougi = async (id: number) => {
    try {
      const res = await fetch("/api/scougi/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      if (!res.ok) {
        showNotification({
          title: `Failed to delete the edition`,
          message: "",
          color: "red",
          icon: <FontAwesomeIcon icon={faXmarkCircle} />,
        });
        return;
      }
      showNotification({
        title: `Successfully deleted the edition`,
        message: "",
        color: "green",
        icon: <FontAwesomeIcon icon={faCircleCheck} />,
      });
      refreshData();
    } catch (e) {
      console.error(e);
      showNotification({
        title: `Failed to delete the edition`,
        message: "",
        color: "red",
        icon: <FontAwesomeIcon icon={faXmarkCircle} />,
      });
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedTrim(props.years[year]?.at(0) ?? 0);
  };

  return (
    <Container>
      <Title order={3}>Upload new scougi</Title>
      <Group position="apart" align={"end"}>
        <Select
          label="Schooljaar"
          value={selectedYear}
          onChange={v => handleYearChange(v ?? props.currentYear)}
          data={Object.keys(props.years)}
          searchable
          creatable
          getCreateLabel={query => `+ Create ${query}`}
          disabled={isUploading}
          shouldCreate={q => {
            return !props.years[q] && q.match(/^\d{4}-\d{4}$/);
          }}
          onCreate={q => {
            props.years[q] = [0, 1, 2, 3];
            return q;
          }}
        />
        <Select
          label="Trimester"
          value={String(selectedTrim)}
          searchable
          onChange={v => {
            setSelectedTrim(Number(v));
          }}
          disabled={props.years[selectedYear].length === 0 || isUploading}
          data={TrimesterNames.map((t, i) => ({
            value: String(i),
            label: t,
          })).filter((_, i) => props.years[selectedYear].includes(i))}
        />
        <Group>
          <DropboxChooser
            appKey={"24ejhxqih5zow8j"}
            success={(files: Dropbox.File[]) => setSelectedFile(files[0])}
            multiselect={false}
            linkType={"direct"}
            extensions={[".pdf"]}
          >
            <Button leftIcon={<FontAwesomeIcon icon={faFileUpload} />} loading={isUploading}>
              <div className="dropbox-button">Upload</div>
            </Button>
          </DropboxChooser>
          {selectedFile && <Text>{selectedFile.name}</Text>}
        </Group>
        <Button
          disabled={selectedYear.trim() === "" || selectedTrim === undefined || !selectedFile}
          leftIcon={<FontAwesomeIcon icon={faPaperPlane} />}
          color={"green"}
          onClick={publishScougi}
          loading={isUploading}
        >
          Publish
        </Button>
      </Group>
      <Divider mt="md" />
      <Title order={3}>Published scougis</Title>
      <Table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Trimester</th>
            <th>Hidden</th>
            <th style={{ width: "8vw" }} />
          </tr>
        </thead>
        <tbody>
          {props.published.map(s => (
            <tr key={`${s.year}-${s.trim}`}>
              <td>{s.year}</td>
              <td>{TrimesterNames[s.trim]}</td>
              <td>
                <Checkbox checked={s.hidden} onChange={e => toggleScougiHide(s.id, e.currentTarget.checked)} />
              </td>
              <td>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button>Actions</Button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      icon={<FontAwesomeIcon icon={faExternalLink} />}
                      component="a"
                      href={`/scougi/${s.year}/${s.trim}`}
                      target="_blank"
                    >
                      Open
                    </Menu.Item>
                    <Menu.Item color="red" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => deleteScougi(s.id)}>
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<ScougiAdminProps> = async () => {
  const today = new Date();
  const thisYear =
    today.getMonth() < 8
      ? `${today.getFullYear() - 1}-${today.getFullYear()}`
      : `${today.getFullYear()}-${today.getFullYear() + 1}`;
  const published = await prisma.scougi.findMany({
    select: {
      year: true,
      trim: true,
      id: true,
      hidden: true,
    },
    orderBy: [
      {
        year: "desc",
      },
      {
        trim: "desc",
      },
    ],
  });

  const years: Record<string, number[]> = {};
  published.forEach(s => {
    if (!years[s.year]) {
      years[s.year] = [0, 1, 2, 3];
    }
    years[s.year] = years[s.year].filter(t => t !== s.trim);
  });
  if (!years[thisYear]) {
    years[thisYear] = [0, 1, 2, 3];
  }

  return {
    props: {
      years,
      currentYear: thisYear,
      published,
    },
  };
};

export default Scougis;
