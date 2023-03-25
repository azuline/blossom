import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import { StoryParagraph } from "@foundation/stories/components/StoryParagraph";
import { StorySection } from "@foundation/stories/components/StorySection";
import { Code } from "@foundation/ui";
import { CodeBlock } from "@foundation/ui";
import { Link } from "@foundation/ui";
import { Type } from "@foundation/ui";
import { FC } from "react";

export default {
  title: "Guides",
};

export const Styling: FC = () => (
  <DocumentationStory>
    <StorySection title="Styling">
      <StoryParagraph>
        <Type>
          We use <Link href="https://vanilla-extract.style" open="new-tab">vanilla-extract</Link>
          {" "}
          as our CSS-in-JS styling library. Please see the vanilla-extract docs to learn more about
          its styling capabilities and API. We make use of its themes, style function, global
          styles, recipes, sprinkles, and variables. The rest of the documentation assumes
          familiarity with vanilla-extract.
        </Type>
      </StoryParagraph>
    </StorySection>
    <StorySection title="Design Tokens">
      <StoryParagraph>
        <Type>
          The <Code>t</Code>{" "}
          object contains all of the design tokens on it. Styling should use these tokens instead of
          raw values for consistency and convenience in future migrations.
        </Type>
        <Type>
          We have tokens for size, space, border radius, border, z-index, transitions, breakpoints,
          colors, and typography. The specifics scales and tokens are documented in the Theme
          stories.
        </Type>
        <Type>
          An example of using the tokens with vanilla-extract&apos;s style function is:
        </Type>
        <CodeBlock
          code={`
import { t } from "@foundation/theme/styles";
import { style } from "@vanilla-extract/css";
style({ background: t.color.background.neutral.raised });
`}
        />
      </StoryParagraph>
    </StorySection>
    <StorySection subtitle="Utility Functions">
      <StoryParagraph>
        <Type>
          Several utility functions for working with design tokens exist at{" "}
          <Code>t.fn</Code>. See the definition of <Code>t</Code>{" "}
          for the latest up-to-date functions.
        </Type>
        <Type>
          The <Code>t.fn.border</Code>{" "}
          function allow for easy creation of solid borders. It takes in a width and a color.
        </Type>
        <CodeBlock
          code={`
import { t } from "@foundation/theme/styles";
import { style } from "@vanilla-extract/css";
style({ border: t.fn.border("1", "neutral.weak") });
`}
        />
        <Type>
          The <Code>t.fn.border</Code>{" "}
          function allow for easy creation of solid borders. It takes in a width and a color and
          returns a border style.
        </Type>
        <CodeBlock
          code={`
import { t } from "@foundation/theme/styles";
import { style } from "@vanilla-extract/css";
style({ border: t.fn.border("1", "neutral.weak") });
`}
        />
        <Type>
          The <Code>t.fn.font</Code>{" "}
          function takes in a typography token and returns the set of CSS properties associated with
          it. The properties returned are: fontFamily, fontWeight, lineHeight, fontSize, fontStyle,
          textDecoration, and textDecorationColor. Manually specifying all of these is error prone
          and verbose; this function fetches the correct values in a single line of code.
        </Type>
        <CodeBlock
          code={`
import { t } from "@foundation/theme/styles";
import { style } from "@vanilla-extract/css";
style({ ...t.fn.font("lg", { paragraph: true, italic: true }) });
`}
        />
        <Type>
          The <Code>t.fn.space</Code>{" "}
          function creates a margin/padding multi-valued string without the need to interpolate
          tokens. For example:
        </Type>
        <CodeBlock
          code={`
import { t } from "@foundation/theme/styles";
import { style } from "@vanilla-extract/css";
style({ padding: t.fn.space("0", "2", "4", "8") });
// -> becomes: style({ padding: "0px 2px 4px 8px" });
`}
        />
      </StoryParagraph>
    </StorySection>
    <StorySection title="Sprinkles">
      <StoryParagraph>
        <Type>
          The <Code>sx</Code> function is our{" "}
          <Link
            href="https://vanilla-extract.style/documentation/packages/sprinkles/"
            open="new-tab"
          >
            sprinkles
          </Link>{" "}
          function. <Code>sx</Code>{" "}
          allows for convenient style creation in the atomic CSS style. Visit the <Code>sx</Code>
          {" "}
          function&apos;s definition for the set of supported properties.
        </Type>
        <Type>
          Example <Code>sx</Code> use:
        </Type>
        <CodeBlock
          code={`
import { sx } from "@foundation/theme/styles/sprinkles.css";
return <div className={sx({ p: "16" })}>hi</div>;
`}
        />
      </StoryParagraph>
    </StorySection>
    <StorySection subtitle="The sx Prop">
      <StoryParagraph>
        <Type>
          For ease of use, the design system components take an <Code>sx=</Code>{" "}
          prop that accepts arguments to the <Code>sx</Code>{" "}
          function. The design system components will call <Code>sx</Code> internally.
        </Type>
        <Type>
          Example <Code>sx=</Code> prop use:
        </Type>
        <CodeBlock
          code={`
import { View } from "@foundation/ui";
return <View sx={{ p: "16" }} />;
`}
        />
      </StoryParagraph>
    </StorySection>
    <StorySection title="Responsiveness">
      <StoryParagraph>
        <Type>
          We design for 6 screen sizes (xs@440px / sm@576px / md@768px / lg@992px / xl@1200px /
          xxl@1440px). Our breakpoints are situated in between each screen size (sm@508px / sm@672px
          / md@880px / lg@1092px / xl@1320px)..
        </Type>
        <Type>
          Our breakpoints are mobile-first; applying a breakpoint targets screens larger than it.
        </Type>
        <Type>
          The breakpoints can be used like so:
        </Type>
        <CodeBlock
          code={`
import { style } from "@vanilla-extract/css";
import { t } from "@foundation/theme/styles";
return style({
  "@media": {
    [t.breakpoints.lg]: { display: "none" },
  },
});
`}
        />
      </StoryParagraph>
    </StorySection>
    <StorySection subtitle="Sprinkles">
      <StoryParagraph>
        <Type>
          We have defined sprinkles&apos; conditions at the responsive breakpoints. The breakpoints
          can be used like so:
        </Type>
        <CodeBlock
          code={`
import { View } from "@foundation/ui";
return <View sx={{ p: { initial: "0", xs: "2", sm: "4", md: "8", lg: "12", xl: "16" }} />;
`}
        />
      </StoryParagraph>
    </StorySection>
    <StorySection title="Theming">
      <StoryParagraph>
        <Type>
          We have support for multiple themes. The theme of a component subtree can be set with the
          {" "}
          <Code>{"<ThemeProvider />"}</Code> component.
        </Type>
        <Type>
          The provider defaults to the active theme. It can be forcefully set to a specific theme
          with the <Code>force</Code> prop.
        </Type>
        <CodeBlock
          code={`
import { ThemeProvider } from "@foundation/theme/provider";
return <ThemeProvider force="dark">...</ThemeProvder>;
`}
        />
      </StoryParagraph>
    </StorySection>
  </DocumentationStory>
);
