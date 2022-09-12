import { Loader, Stack } from "@mantine/core";
import { FC } from "react";

export const LoadPage: FC<{ width: number }> = ({ width }) => {
  return (
    <Stack align={"center"} justify={"center"} style={{ width: width, height: width * 1.414, background: "white" }}>
      <Loader size={"xl"} color={"scoutsBlue"} />
    </Stack>
  );
};
