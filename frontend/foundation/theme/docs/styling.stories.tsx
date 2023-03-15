import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import { StoryParagraph } from "@foundation/stories/components/StoryParagraph";
import { StorySection } from "@foundation/stories/components/StorySection";
import { Code } from "@foundation/ui/Code";
import { CodeBlock } from "@foundation/ui/CodeBlock";
import { Link } from "@foundation/ui/Link";
import { Type } from "@foundation/ui/Type";
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
          prop that accepts arguments to the `sx` function. The design system components will call
          {" "}
          <Code>sx</Code> internally.
        </Type>
        <Type>
          Example <Code>sx=</Code> prop use:
        </Type>
        <CodeBlock
          code={`
import { View } from "@foundation/ui/View";
return <View sx={{ p: "16" }} />;
`}
        />
      </StoryParagraph>
    </StorySection>
    <StorySection subtitle="Responsiveness">
      <StoryParagraph>
        <Type>
          We have defined responsive breakpoints as sprinkles&apos; conditions. Visit the
          sprinkles&apos; definition for the exact breakpoints.
        </Type>
        <Type>
          We are mobile-first; each breakpoint applies to screen sizes larger than itself.
        </Type>
        <Type>
          The breakpoints can be used like so:
        </Type>
        <CodeBlock
          code={`
import { View } from "@foundation/ui/View";
return <View sx={{ p: { xs: "2", sm: "4", md: "8", lg: "12", xl: "16" }} />;
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
