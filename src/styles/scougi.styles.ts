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
  bookWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  book: {
    width: "60vw",
  },
  mobileBook: {
    width: "90vw",
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(120,120,120,0.5)",
    height: "20vh",
    padding: ".5vh",
    cursor: "pointer",
    "&.right": {
      borderRadius: "0 1vh 1vh 0",
    },
    "&.left": {
      borderRadius: "1vh 0 0 1vh",
    },
  },
}));
