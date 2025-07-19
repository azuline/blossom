import re

MARKDOWN_LINK_REGEX = re.compile(r"\[([^\]]+)\]\((https://[^\)]+)\)")


def markdown_to_slack_markup(text: str) -> str:
    replacements: list[tuple[str, str]] = []
    for m in MARKDOWN_LINK_REGEX.finditer(text):
        replacements.append((m[0], f"<{m[2]}|{m[1]}>"))
    for src, dst in replacements:
        text = text.replace(src, dst)
    return text
