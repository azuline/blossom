import {
  themeMoonlightDarkClass,
  themeMoonlightLightClass,
} from "../themes/color.css";
import { sx } from "../styles/sprinkles.css";
import clsx from "clsx";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { FC, ReactNode } from "react";
import { sThemeProvider } from "./index.css";

type Theme = "light" | "dark";

const themeAtom = atomWithStorage<Theme>("theme", "light");

type Props = {
  force?: "dark" | "light";
  children: ReactNode;
};

export const ThemeProvider: FC<Props> = props => {
  const [_theme] = useAtom(themeAtom);
  const theme: Theme = props.force ?? _theme;

  const colorClass = theme === "dark" ? themeMoonlightDarkClass : themeMoonlightLightClass;

  return (
    <div className={clsx(colorClass, sThemeProvider, sx({ h: "full", w: "full" }))}>
      {props.children}
    </div>
  );
};
