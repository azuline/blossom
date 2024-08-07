# Code generated by sqlc. DO NOT EDIT.
# versions:
#   sqlc v1.26.0
import dataclasses
import datetime
import enum
from typing import Optional


class TenantsInboundSource(str, enum.Enum):
    OUTREACH = "outreach"
    ORGANIC = "organic"
    WORD_OF_MOUTH = "word_of_mouth"
    REFERRAL = "referral"
    UNKNOWN = "unknown"


class UserSignupStep(str, enum.Enum):
    CREATED = "created"
    COMPLETE = "complete"


@dataclasses.dataclass()
class Invite:
    id: int
    external_id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    user_id: int
    code_hash: str
    expires_at: datetime.datetime
    accepted_at: Optional[datetime.datetime]


@dataclasses.dataclass()
class Session:
    id: int
    external_id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    user_id: int
    tenant_id: Optional[int]
    last_seen_at: datetime.datetime
    expired_at: Optional[datetime.datetime]


@dataclasses.dataclass()
class Tenant:
    id: int
    external_id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    name: str
    inbound_source: TenantsInboundSource


@dataclasses.dataclass()
class TenantsUser:
    id: int
    external_id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    user_id: int
    tenant_id: int
    removed_at: Optional[datetime.datetime]
    removed_by_user: Optional[int]


@dataclasses.dataclass()
class User:
    id: int
    external_id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    name: str
    email: str
    password_hash: Optional[str]
    signup_step: UserSignupStep
    is_enabled: bool
    last_visited_at: Optional[datetime.datetime]


@dataclasses.dataclass()
class VaultedSecret:
    id: int
    external_id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    tenant_id: int
    ciphertext: str
    nonce: str
