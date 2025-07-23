from __future__ import annotations

import dataclasses
from functools import cached_property

from foundation.external.openai import COpenAI
from foundation.external.sheets import CSheets
from foundation.external.slack import CSlack


@dataclasses.dataclass(slots=True)
class ExternalServicesClass:
    test_google_sheets: CSheets | None = None
    test_openai: COpenAI | None = None
    test_slack: CSlack | None = None

    @property
    def openai(self) -> COpenAI:
        return self.test_openai or self._real_openai

    @cached_property
    def _real_openai(self) -> COpenAI:
        return COpenAI()

    @property
    def slack(self) -> CSlack:
        return self.test_slack or self._real_slack

    @cached_property
    def _real_slack(self) -> CSlack:
        return CSlack()

    @property
    def sheets(self) -> CSheets:
        return self.test_google_sheets or self._real_sheets

    @cached_property
    def _real_sheets(self) -> CSheets:
        return CSheets()


EXT = ExternalServicesClass()
