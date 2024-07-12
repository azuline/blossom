import setuptools  # type: ignore

setuptools.setup(
    name="blossom",
    version="0.0.0",
    python_requires=">=3.10.0",
    author="blissful",
    author_email="blissful@sunsetglow.net",
    license="Apache-2.0",
    entry_points={"console_scripts": ["blossom = cli.__main__:cli"]},
    packages=setuptools.find_namespace_packages(
        where=".",
        exclude=["htmlcov"],
    ),
    install_requires=[
        "click",
        "jinja2",
        "psycopg[pool]",
        "pydantic",
        "python-dotenv",
        "quart",
        "werkzeug",
    ],
)
