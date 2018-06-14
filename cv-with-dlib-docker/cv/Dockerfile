FROM ubuntu:bionic-20180526

MAINTAINER Ujjawal Garg <ujjawal.1224@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get -y update && apt-get -y upgrade

#Dev tools
RUN apt-get -y install build-essential cmake unzip pkg-config

# Imaging stuff
RUN apt-get -y install libjpeg-dev libpng-dev libtiff-dev

# Video stuff
RUN apt-get -y install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev \
	&& apt-get -y install libxvidcore-dev libx264-dev

# GUI operations (Skip since no term on VM)
# RUN apt-get -y install libgtk-3-dev

# Performance libraries
RUN apt-get -y install libatlas-base-dev gfortran

# Switch shell to /bin/bash, needed for source command
SHELL ["/bin/bash", "-c"]
ENV VIRTUALENVWRAPPER_PYTHON /usr/bin/python3
ENV WORKON_HOME ~/.virtualenvs

# Setup Python3 & virtualenv
RUN apt-get -y install python3-dev wget \
	&& wget https://bootstrap.pypa.io/get-pip.py \
	&& python3 get-pip.py \
	&& pip install virtualenv virtualenvwrapper \
	&& rm -rf ~/get-pip.py ~/.cache/pip \
	&& echo "" >> ~/.bashrc \
	&& echo "# virtualenv and virtualenvwrapper" >> ~/.bashrc \
	&& echo "export WORKON_HOME=$HOME/.virtualenvs " >> ~/.bashrc \
	&& echo "export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3 " >> ~/.bashrc \
	&& echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc \
	&& echo "" >> ~/.bashrc \
	&& source /usr/local/bin/virtualenvwrapper.sh \
	&& mkvirtualenv cv -p python3 \
	&& workon cv \
	&& pip install numpy

# Download OpenCV 3.4.1
RUN cd ~ \
	&& wget -O opencv.zip https://github.com/opencv/opencv/archive/3.4.1.zip \
	&& wget -O opencv_contrib.zip https://github.com/opencv/opencv_contrib/archive/3.4.1.zip \
	&& unzip opencv.zip \
	&& unzip opencv_contrib.zip \
	&& rm opencv.zip opencv_contrib.zip


# Compile OpenCV - part 1 (cmake)
RUN source /usr/local/bin/virtualenvwrapper.sh \
	&& workon cv \
	&& cd ~/opencv-3.4.1/ \
	&& mkdir build \
	&& cd build \
	&& cmake -D CMAKE_BUILD_TYPE=RELEASE \
		-D CMAKE_INSTALL_PREFIX=/usr/local \
		-D INSTALL_PYTHON_EXAMPLES=ON \
		-D INSTALL_C_EXAMPLES=OFF \
		-D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib-3.4.1/modules \
		-D PYTHON_EXECUTABLE=~/.virtualenvs/cv/bin/python \
		-D BUILD_EXAMPLES=ON ..



WORKDIR /root/opencv-3.4.1/build

# Compile OpenCV - part 2 (make)
RUN source /usr/local/bin/virtualenvwrapper.sh \
	&& workon cv \
	&& make -j4

# Install OpenCV
RUN  source /usr/local/bin/virtualenvwrapper.sh \
	&& workon cv \
	&& make install \
	&& ldconfig

# Final linking and cleanup
RUN cd /usr/local/lib/python3.6/site-packages/ \
	&& mv cv2.cpython-36m-x86_64-linux-gnu.so cv2.so \
	&& cd ~/.virtualenvs/cv/lib/python3.6/site-packages/ \
	&& ln -s /usr/local/lib/python3.6/site-packages/cv2.so cv2.so \
	&& cd ~ \
	&& rm -rf opencv-3.4.1 opencv_contrib-3.4.1







