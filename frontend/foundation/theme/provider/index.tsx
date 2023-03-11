import {
  themeMoonlightDarkClass,
  themeMoonlightLightClass,
} from "@foundation/theme/themes/color.css";
import { View } from "@foundation/ui/View";
import clsx from "clsx";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { FC, ReactNode } from "react";
import { sThemeProvider } from "./index.css";

type Theme = "moonlight-light" | "moonlight-dark";

const themeAtom = atomWithStorage<Theme>("theme", "moonlight-light");

type Props = {
  force?: "dark" | "light";
  children: ReactNode;
};

export const ThemeProvider: FC<Props> = props => {
  let colorClass: string;

  [colorClass] = useAtom(themeAtom);
  if (props.force === "dark") {
    colorClass = themeMoonlightDarkClass;
  } else if (props.force === "light") {
    colorClass = themeMoonlightLightClass;
  }

  return (
    <View className={clsx(colorClass, sThemeProvider)} sx={{ h: "full", w: "full" }}>
      {props.children}
    </View>
  );
};
