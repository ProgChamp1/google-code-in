import json

host = "0.0.0.0"
port = 8080
port_attacker = 8000
SUBPROCESS_FUNC = "Popen"  # or call?


def loads(msg: bytes) -> dict:
    dc = json.loads(msg.decode())
    return dc


def dumps(msg: str) -> bytes:
    msg_dict = {"type": SUBPROCESS_FUNC, "args": msg}
    return json.dumps(msg_dict).encode()

