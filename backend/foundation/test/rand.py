import random
from string import ascii_letters


class TestRandGen:
    def string(self, length: int = 12) -> str:
        return "".join(random.choice(ascii_letters) for _ in range(length))

    def email(self) -> str:
        return "user@sunsetglow+" + self.string(4) + ".net"
