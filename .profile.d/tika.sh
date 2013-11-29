#!/bin/bash

echo "-----> Install Apache Tika"

# Set tika vars
TIKA_VERSION=${TIKA_VERSION:-"1.4"}
TIKA_DIR=${TIKA_DIR:-"$HOME/vendor/bin"}
TIKA_PATH=${TIKA_PATH:-"$TIKA_DIR/tika-$TIKA_VERSION.jar"}
TIKA_URL=${TIKA_URL:-"http://repo1.maven.org/maven2/org/apache/tika/tika-app/$TIKA_VERSION/tika-app-$TIKA_VERSION.jar"}
TIKA_CONCURRENCY=${TIKA_CONCURRENCY:-2}
SUDO=${SUDO:-}

# Download tika
echo "... to TIKA_PATH=$TIKA_PATH"
`$SUDO mkdir -p $TIKA_DIR`
`$SUDO curl $TIKA_URL > $TIKA_PATH &2> /dev/null`