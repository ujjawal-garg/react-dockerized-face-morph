from builtins import range
import cv2
import numpy as np
import skvideo.io


def check_write_video(func):
    def inner(self, *args, **kwargs):
        if self.video:
            return func(self, *args, **kwargs)
        else:
            pass
    return inner


class Video(object):
    def __init__(self, filename, fps, w, h):
        self.filename = filename
        self.counter = 0

        if filename is None:
            self.video = None
        else:
            # fourcc_func = cv2.cv.FOURCC if cv2.__version__.startswith('2.') else cv2.VideoWriter_fourcc
            # fourcc = fourcc_func('m', 'p', '4', 'v')

            # self.video = cv2.VideoWriter(filename, fourcc, fps, (w, h), True)
            # self.video = skvideo.io.LibAVWriter(filename)
            self.video = skvideo.io.FFmpegWriter(filename, outputdict={'-vcodec': 'libx264', '-b': '3000000'})

    @check_write_video
    def write(self, img, num_times=1):
        frame = np.copy(img)
        # if img.shape[2] == 3:
        #     frame[..., 0], frame[..., 2] = img[..., 2], img[..., 0]

        for _ in range(num_times):
            self.video.writeFrame(frame)
            self.counter += 1

    @check_write_video
    def end(self):
        print(self.filename + ' saved')
        self.video.close()

