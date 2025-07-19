from __future__ import annotations

import dataclasses
from functools import cached_property

from foundation.external.brex import CBrex
from foundation.external.openai import COpenAI
from foundation.external.ramp import CRamp
from foundation.external.sheets import CSheets
from foundation.external.slack import CSlack


@dataclasses.dataclass
class ExternalServicesClass:
    test_brex: CBrex | None = None
    test_google_sheets: CSheets | None = None
    test_openai: COpenAI | None = None
    test_ramp: CRamp | None = None
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

    @property
    def brex(self) -> CBrex:
        return self.test_brex or self._real_brex

    @cached_property
    def _real_brex(self) -> CBrex:
        return CBrex()

    @property
    def ramp(self) -> CRamp:
        return self.test_ramp or self._real_ramp

    @cached_property
    def _real_ramp(self) -> CRamp:
        return CRamp()


EXT = ExternalServicesClass()
