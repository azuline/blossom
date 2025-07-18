def snake_case_to_pascal_case(s: str) -> str:
    return "".join([x.title() for x in s.split("_")])
