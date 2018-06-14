FROM gobletsky/bionic-opencv-3.4.1

MAINTAINER Ujjawal Garg <ujjawal.1224@gmail.com>

# Install some additional dependencies for dlib
RUN apt-get -y install libx11-dev &&  apt-get -y install libboost-python-dev

# Install dlib
RUN cd ~ \
	&& wget http://dlib.net/files/dlib-19.13.tar.bz2 \
	&& tar xvf dlib-19.13.tar.bz2 \
	&& rm dlib-19.13.tar.bz2 \
	&& cd dlib-19.13/ \
	&& mkdir build \
	&& cd build \
	&& cmake .. \
	&& cmake --build . --config Release \
	&& make install \
	&& ldconfig \
	&& cd .. \
	&& pkg-config --libs --cflags dlib-1



# Switch shell to /bin/bash, needed for source command
SHELL ["/bin/bash", "-c"]
ENV VIRTUALENVWRAPPER_PYTHON /usr/bin/python3
ENV WORKON_HOME ~/.virtualenvs

# Install dlib python bindings
RUN source /usr/local/bin/virtualenvwrapper.sh \
	&& workon cv \
	&& cd ~/dlib-19.13 \
	&& python setup.py install \
	&& pip install dlib

#Final cleanup
RUN rm -rf /var/lib/apt/lists/* \
	&& rm -rf dlib-19.13 opencv-3.4.1


