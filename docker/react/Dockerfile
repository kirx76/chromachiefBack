#FROM node:12.16-alpine

#ARG NODE_ENV
#ENV NODE_ENV "$NODE_ENV"

# System deps:
#RUN npm --version && apk add --no-cache \
#    autoconf \
#    automake \
#    bash \
#    build-base \
#    ca-certificates \
#    curl \
#    file \
#    g++ \
#    gcc \
#    git \
#    lcms2-dev \
#    libjpeg-turbo-dev \
#    libpng-dev \
#    make \
#    nasm \
#    wget \
#    zlib-dev

# Installing dependencies:
#WORKDIR /code
#COPY package.json /code/

# Creating folders, and files for a project:
#COPY . /code
#RUN ls /code
# We do not need to tweak this command, `$NODE_ENV` does it for us.
#RUN npm install
#RUN npm run dev
#
## Project initialization:
#EXPOSE 4000


FROM node:alpine

RUN mkdir -p /usr/src/app
ENV PORT 3000

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

#RUN npm install

#RUN npm uninstall bcrypt

#RUN npm install bcrypt

COPY . /usr/src/app

EXPOSE 3000

#CMD ts-node ./usr/src/app/src/server.ts

CMD [ "npm", "run", "dev" ]
