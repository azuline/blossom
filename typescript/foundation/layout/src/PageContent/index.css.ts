import { t } from "@foundation/theme";
import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { layoutPadding } from "../LayoutPaddingVariableSetter/index.css";

export const sPageContentScroll = recipe({
  base: {
    height: "100%",
    width: "100%",
  },

  variants: {
    scroll: {
      true: {
        overflow: "auto",
      },
    },
    // If there is a header: when the content has been scrolled, add a border to the top
    // of the container.
    scrolled: { true: {} },
    headerExists: { true: {} },
  },
  compoundVariants: [
    {
      variants: { scrolled: true, headerExists: true },
      style: { borderTop: t.fn.border("1", "neutral.weak") },
    },
  ],
});

const bottomPaddingVar = createVar();
const topPaddingVar = createVar();

export const sPageContentPadding = recipe({
  base: {
    height: "100%",
    width: "100%",
    vars: { [bottomPaddingVar]: "0px" },
  },

  variants: {
    padding: {
      full: {
        paddingTop: topPaddingVar,
        paddingBottom: `calc(${layoutPadding} + ${bottomPaddingVar})`,
        paddingLeft: layoutPadding,
        paddingRight: layoutPadding,
      },
      x: {
        paddingLeft: layoutPadding,
        paddingRight: layoutPadding,
        paddingBottom: bottomPaddingVar,
      },
      none: {
        paddingBottom: bottomPaddingVar,
      },
    },
    scroll: {
      true: {
        width: "fit-content",
        height: "fit-content",
        minWidth: "100%",
        minHeight: "100%",
      },
    },
    center: {
      true: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    headerExists: {
      true: {
        vars: {
          [topPaddingVar]: t.space[16],
        },
      },
      false: {
        vars: {
          [topPaddingVar]: layoutPadding,
        },
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        center: true,
        headerExists: true,
      },
      style: {
        paddingBottom: t.space[44],
        vars: { [bottomPaddingVar]: t.space[44] },
      },
    },
  ],
});
