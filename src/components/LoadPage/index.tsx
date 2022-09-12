import { Loader, Stack } from "@mantine/core";
import { useVhToPixel } from "../../hooks/useVhToPixel";

export const LoadPage = () => {
  const pageWidth = useVhToPixel(60);
  return (
    <Stack align={"center"} justify={"center"} style={{ width: pageWidth, height: pageWidth * 1.414 }}>
      <Loader size={"xl"} />
    </Stack>
  );
};
