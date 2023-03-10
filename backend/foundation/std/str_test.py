from foundation.std.str import snake_case_to_pascal_case


def test_snake_case_to_pascal_case():
    assert snake_case_to_pascal_case("get_page_load_info") == "GetPageLoadInfo"
