#!/bin/bash
#

# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")
echo $SCRIPTPATH
PROJECTROOTPATH="$(dirname "$SCRIPTPATH")"
echo $PROJECTROOTPATH

source ${SCRIPTPATH}/ENV/bin/activate
"${SCRIPTPATH}"/ENV/bin/pip3 install --upgrade setuptools pip

cd "${SCRIPTPATH}"/src
rasa run -m nlu-20220713-211038-brownian-crow.tar.gz --enable-api --port 7002

