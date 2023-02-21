import { Link } from "@foundation/ui/Link";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";

export default {
  title: "Components/Atoms/Link",
};

export const Gallery: React.FC = () => (
  <View sx={{ maxw: "356" }}>
    <Type sx={{ text: "md", paragraph: "true" }}>
      In the Northern Ocean there is a fish called Kun which is many thousand li in size. It changes
      into a bird named Peng whose back is many thousand li in breadth. When it rises and flies, its
      wings are like clouds filling the sky. When this bird moves across the ocean, it heads for the
      South Sea, the Celestial Lake.
      {" "}
      <Link href="/">
        In Chi Hsieh’s record of wonders it says: “When Peng is heading toward the Southern Ocean it
        splashes along the water for three thousand li. It rises with the wind and wings its way up
        to ninety thousand li; it flies for six months, and then it rests.”
      </Link>
      Heat shimmers in the air like galloping horses, dust floats like the morning mist, and living
      creatures are blown about in the sky. The sky is blue. Is that really so? Or does it only look
      blue because it stretches off into infinity? When Peng looks down from above, it will also
      seem blue. A large boat draws a great deal of water. Pour a cup of water into a hollow in the
      ground, and a mustard seed can float there like a little ship. Place the cup in it, and it
      will not move, because the water is shallow and the boat is large. Only at a certain height is
      there enough air space for a great wingspan. So Peng rises to ninety thousand li, and there is
      enough air below him. Then he mounts the wind, and with the blue sky at his back, and nothing
      in his way, he heads for the south.
    </Type>
  </View>
);
