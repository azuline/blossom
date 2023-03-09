# toolchains

The `toolchains` package combines sets of packages into toolchains, which
contain all the tools necessary to work on a certain part of the stack.

By default, the developer environment loads the entire toolchain. CI only loads
the toolchain for the area of the application that it is building.
