#!/bin/bash

echo "-----> Install Apache Tika"

# Set tika vars
export TIKA_VERSION="1.4"
export TIKA_PATH="$HOME/vendor/bin/tika-$TIKA_VERSION.jar"
export TIKA_URL="http://repo1.maven.org/maven2/org/apache/tika/tika-app/$TIKA_VERSION/tika-app-$TIKA_VERSION.jar"
export TIKA_CONCURRENCY=2

# Download tika
curl $TIKA_URL > $TIKA_PATH