from foundation.stdlib.str import snake_case_to_pascal_case


def test_snake_case_to_pascal_case() -> None:
    assert snake_case_to_pascal_case("get_page_load_info") == "GetPageLoadInfo"
