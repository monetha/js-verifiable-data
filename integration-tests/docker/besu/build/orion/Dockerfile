FROM openjdk:11-jre
ARG ORION_VERSION
RUN apt-get -qq update && \
    apt-get -qq -y install libsodium-dev

RUN ORIONTMP=$(mktemp -d) && cd $ORIONTMP && \
    curl -sLO "https://consensys.bintray.com/binaries/orion-$ORION_VERSION.tar.gz" && \
    tar xf  orion-$ORION_VERSION.tar.gz && \
    cp -r orion-$ORION_VERSION/ /orion/ && \
    cd /orion/ && rm -rf $ORIONTMP
    
WORKDIR /orion/data/

ENTRYPOINT ["/orion/bin/orion"]
