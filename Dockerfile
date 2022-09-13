FROM arm64v8/amazonlinux:latest

ARG OUT=/root/layers
ARG NODE_VERSION=18

# set up container
RUN yum -y update \
  && yum -y groupinstall "Development Tools" \
  && curl --silent --location https://rpm.nodesource.com/setup_${NODE_VERSION}.x | bash - \
  && yum install -y \
  nodejs \
  python37 \
  which \
  binutils \
  sed \
  gcc-c++ \
  cairo-devel \
  libjpeg-turbo-devel \
  pango-devel \
  giflib-devel

# will be created and become working dir
WORKDIR $OUT/nodejs

RUN npm install --build-from-source \
  canvas

# will be created and become working dir
WORKDIR $OUT/lib

# gather missing libraries
RUN curl https://raw.githubusercontent.com/ncopa/lddtree/v1.26/lddtree.sh -o $OUT/lddtree.sh \
  && chmod +x $OUT/lddtree.sh \
  && cp $($OUT/lddtree.sh -l $OUT/nodejs/node_modules/canvas/build/Release/canvas.node | grep '^\/lib' | sed -r -e '/canvas.node$/d') .

WORKDIR $OUT

RUN zip -r -9 node${NODE_VERSION}_canvas_layer.zip nodejs \
  && zip -r -9 node${NODE_VERSION}_canvas_lib64_layer.zip lib