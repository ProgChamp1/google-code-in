import socket
#from threading import Thread
scan_ip = socket.gethostbyname('localhost')  # 127.0.0.1

MAX_PORT = 65535


def check(port: int) -> int:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    args = (scan_ip, port)
    result = sock.connect_ex(
        args)  #connect_ex doesn't throw saving us a try-catch branch
    sock.close()
    return result


def scan():
    scan_range = range(MAX_PORT + 1)
    for port in scan_range:
        #print(f"checking port {port}")
        if check(port) == 0:
            yield port


'''
def wait_for_threads(th_set):
    while th_set:
        thread = th_set.pop()
        thread.join()


def threaded_scan():
    def _check(port):
        print("checking:", port)
        if check(port) == 0:
            print(f"{port} is open")

    MAX_THREAD_COUNT = 20
    curr_count = 0
    threads = set()
    for port in range(MAX_PORT + 1):
        if curr_count >= MAX_THREAD_COUNT:
            #wait_for_threads(threads)
            curr_count = 0
        th = Thread(target=_check, args=(port, ))
        threads.add(th)
        curr_count += 1
        th.start()


#threaded_scan()
'''
if __name__ == "__main__":
    try:
        for open_port in scan():
            print(f"port {open_port} is open.")
    except KeyboardInterrupt:
        print("Quitting")
        exit()
