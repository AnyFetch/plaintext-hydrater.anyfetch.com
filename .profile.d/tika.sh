#!/bin/bash

echo "-----> Install Apache Tika"

# Set tika vars
TIKA_VERSION="1.4"
TIKA_PATH="$HOME/vendor/bin/tika-$TIKA_VERSION.jar"
TIKA_URL="http://repo1.maven.org/maven2/org/apache/tika/tika-app/$TIKA_VERSION/tika-app-$TIKA_VERSION.jar"
TIKA_CONCURRENCY=2

# Download tika
echo "... to TIKA_PATH=$TIKA_PATH"
mkdir -p $HOME/vendor/bin
curl $TIKA_URL > $TIKA_PATH &2> /dev/null