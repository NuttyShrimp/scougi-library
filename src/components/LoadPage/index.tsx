import { Loader, Stack } from "@mantine/core";
import { FC } from "react";

export const LoadPage: FC<{ height: number }> = ({ height }) => {
  return (
    <Stack align={"center"} justify={"center"} style={{ width: height / 1.414, height: height, background: "white" }}>
      <Loader size={"xl"} color={"scoutsBlue"} />
    </Stack>
  );
};
