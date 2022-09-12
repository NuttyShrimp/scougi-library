import { createStyles } from "@mantine/core";

export const useStyles = createStyles(() => ({
  wrapper: {
    "& .stf__parent": {
      "-ms-overflow-style": "none",
      "scrollbar-width": "none",
      margin: `0 auto`,
      overflow: "auto",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  },
  page: {
    background: "white",
  },
}));
