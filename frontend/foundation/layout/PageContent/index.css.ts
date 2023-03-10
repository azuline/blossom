import { layoutPadding } from "@foundation/layout/LayoutPaddingVariableSetter/index.css";
import { t } from "@foundation/style";
import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

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
    // When the content has been scrolled, add a border to the top of the container.
    scrolled: {
      true: {
        borderTop: t.fn.border("1", "neutral.weak"),
      },
    },
  },
});

const bottomPaddingVar = createVar();

export const sPageContentPadding = recipe({
  base: {
    height: "100%",
    width: "100%",
    paddingLeft: layoutPadding,
    paddingRight: layoutPadding,
    vars: { [bottomPaddingVar]: "0px" },
  },

  variants: {
    topPadding: {
      true: {
        paddingTop: t.space[16],
      },
    },
    scroll: {
      true: {
        paddingBottom: `calc(${layoutPadding} + ${bottomPaddingVar})`,
        width: "fit-content",
        height: "fit-content",
        minWidth: "100%",
        minHeight: "100%",
      },
      false: {
        paddingBottom: bottomPaddingVar,
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
    headerExists: { true: {} },
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
