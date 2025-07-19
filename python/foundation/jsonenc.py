import dataclasses
import json
from dataclasses import is_dataclass
from datetime import date, datetime
from typing import Any


# Since JSON does not support dates natively, For that reason we store dates in Postgres in a
# special format, similar to how we do it on the wire for the RPCs:
#      { "__sentinel": "timestamp", "value": "2021-07-27T16:02:08.070557" }
class PostgresJSONDecoder(json.JSONDecoder):
    def __init__(self, *args, **kwargs):
        def object_hook(obj: dict[str, Any]):
            if isinstance(obj, dict) and "__sentinel" in obj and obj["__sentinel"] == "timestamp":
                return datetime.fromisoformat(obj["value"])
            if isinstance(obj, dict) and "__sentinel" in obj and obj["__sentinel"] == "date":
                return date.fromisoformat(obj["value"])
            return obj

        kwargs["object_hook"] = object_hook
        super().__init__(*args, **kwargs)

    def decode(self, s, _w=None):
        """Override decode to handle bytes input."""
        if isinstance(s, bytes):
            s = s.decode("utf-8")
        return super().decode(s)


class PostgresJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return {"__sentinel": "timestamp", "value": o.isoformat()}
        if isinstance(o, date):
            return {"__sentinel": "date", "value": o.isoformat()}
        elif is_dataclass(o):
            return asdict(o)  # type: ignore
        return super().default(o)  # pragma: no cover


def serialize_json_pg(x: Any, **kwargs) -> str:
    if dataclasses.is_dataclass(x):
        x = dataclasses.asdict(x)  # type: ignore
    return json.dumps(x, cls=PostgresJSONEncoder, **kwargs)
