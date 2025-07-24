from foundation.stdlib.convert import int_to_bytes, markdown_to_slack_markup, snake_case_to_pascal_case


def test_markdown_to_slack_markup():
    text = "Check this link out [here](https://sunsetglow.net)."
    expected = "Check this link out <https://sunsetglow.net|here>."
    assert markdown_to_slack_markup(text) == expected


def test_snake_case_to_pascal_case() -> None:
    assert snake_case_to_pascal_case("get_page_load_info") == "GetPageLoadInfo"


def test_int_to_bytes_positive():
    assert int_to_bytes(1024) == b"\x04\x00"


def test_int_to_bytes_zero():
    assert int_to_bytes(0) == b""
