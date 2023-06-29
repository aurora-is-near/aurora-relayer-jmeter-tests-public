# inspired by https://github.com/justb4/docker-jmeter/blob/master/Dockerfile
FROM alpine:3.14

ENV HOME /root

ARG JMETER_VERSION
ENV JMETER_HOME /opt/apache-jmeter-${JMETER_VERSION}
ENV	JMETER_BIN ${JMETER_HOME}/bin
ENV	JMETER_DOWNLOAD_URL https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-${JMETER_VERSION}.tgz

ARG NODE_VERSION
ENV NVM_DIR $HOME/.nvm
ENV NVM_BIN $NVM_DIR/versions/node/v$NODE_VERSION/bin

# Install extra packages
RUN apk update \
	&& apk upgrade \
	&& apk add ca-certificates \
	&& update-ca-certificates \
	&& apk add --update openjdk8-jre tzdata curl unzip bash gcompat \
	&& touch $HOME/.bashrc \
	&& apk add --no-cache nss \
	&& rm -rf /var/cache/apk/* \
	&& mkdir -p /tmp/dependencies  \
	&& curl -L --silent ${JMETER_DOWNLOAD_URL} >  /tmp/dependencies/apache-jmeter-${JMETER_VERSION}.tgz  \
	&& mkdir -p /opt  \
	&& tar -xzf /tmp/dependencies/apache-jmeter-${JMETER_VERSION}.tgz -C /opt  \
	&& rm -rf /tmp/dependencies
SHELL ["/bin/bash", "-c"]
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
	&& source ~/.bashrc \
	&& nvm install -s $NODE_VERSION \
	&& nvm use v$NODE_VERSION

# Set global PATH such that "jmeter" and "node" command is found
ENV PATH $PATH:$JMETER_BIN:$NVM_BIN

# Entrypoint has same signature as "jmeter" command
COPY docker-entrypoint.sh /
COPY ./lib/setenv.sh ${JMETER_HOME}/bin/
COPY ./lib/plugins/jmeter-prometheus-plugin-0.6.0.jar ${JMETER_HOME}/lib/ext/

WORKDIR	${JMETER_HOME}

ENTRYPOINT ["/docker-entrypoint.sh"]
