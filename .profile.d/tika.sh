#!/bin/bash

echo "-----> Install Apache Tika"

# Set tika vars
TIKA_VERSION=${TIKA_VERSION:-"1.4"}
TIKA_DIR=${TIKA_DIR:-"$HOME/vendor/bin"}
TIKA_URL=${TIKA_URL:-"http://repo1.maven.org/maven2/org/apache/tika/tika-app/$TIKA_VERSION/tika-app-$TIKA_VERSION.jar"}
export TIKA_PATH=${TIKA_PATH:-"$TIKA_DIR/tika-app-$TIKA_VERSION.jar"}
export TIKA_CONCURRENCY=${TIKA_CONCURRENCY:-2}

# Download tika
echo "... to TIKA_PATH=$TIKA_PATH"
mkdir -p $TIKA_DIR
curl $TIKA_URL > $TIKA_PATH &2> /dev/null
