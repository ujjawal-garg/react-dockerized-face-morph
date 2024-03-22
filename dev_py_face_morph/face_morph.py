import sys
import os
import skvideo.io
import skvideo.datasets
import numpy
numpy.float = numpy.float64
numpy.int = numpy.int_

SRC_IMG = sys.argv[1]
TARGET_IMG = sys.argv[2]
TRAINED_MODEL_FILE = sys.argv[3]
VID_FILE = sys.argv[4]

if os.path.isfile(VID_FILE):
    os.remove(VID_FILE)

video = skvideo.io.FFmpegWriter(VID_FILE, outputdict={'-vcodec': 'libx264', '-b': '3000000'})

videogen = skvideo.io.vreader(skvideo.datasets.bigbuckbunny())
for frame in videogen:
    video.writeFrame(frame)
video.close()
print('Empty Video Write Complete!')