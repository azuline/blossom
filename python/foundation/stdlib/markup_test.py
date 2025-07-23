from foundation.stdlib.markup import markdown_to_slack_markup


def test_markdown_to_slack_markup():
    text = "Check this link out [here](https://sunsetglow.net)."
    expected = "Check this link out <https://sunsetglow.net|here>."
    assert markdown_to_slack_markup(text) == expected
