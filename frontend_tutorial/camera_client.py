# PC
import numpy as np
import cv2
import time
import socket
import struct
import io
from PIL import Image

HOST = "172.20.10.3"  # IP address of your Raspberry PI
# HOST = "192.168.0.35"
PORT = 65432          # Port to listen on (non-privileged ports are > 1023)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
    client_socket.connect((HOST, PORT))
    connection = client_socket.makefile('rb')
    start_sign = False
    try:
        print("Streaming...Press 'q' to exit")
        # need bytes here

        stream_bytes = b' '
        while True:
            # Read the length of the image as a 32-bit unsigned int. If the
            # length is zero, quit the loop
            image_len = struct.unpack(
                '<L', connection.read(struct.calcsize('<L')))[0]
            if not image_len:
                break
            # Construct a stream to hold the image data and read the image
            # data from the connection
            image_stream = io.BytesIO()
            image_stream.write(connection.read(image_len))
            # Rewind the stream, open it as an image with PIL and do some
            # processing on it
            image_stream.seek(0)
            image = np.array(Image.open(image_stream))
            cv2.imshow('image', image)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            else:
                if start_sign:
                    start_sign = False
                    print("end")
                    cv2.destroyAllWindows()
                    # time.sleep(0.5)
                    continue

    finally:
        # cv2.destroyAllWindows()
        connection.close()
        client_socket.close()
