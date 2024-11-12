#!/bin/sh

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

java -jar /Users/josesteva/Applications/structurizr-lite.war `echo $SCRIPT_DIR` &> /dev/null &

STRUCTURIZR_PID=$!

sleep 1

echo "Structurizr iniciado en la carpeta: $SCRIPT_DIR"
echo "Para terminar el proceso ejecute: kill $STRUCTURIZR_PID"

case "$1" in
  "--mac") open -a "Google Chrome" http://localhost:8080;;
  "--linux") google-chrome http://localhost:8080;;
  *) echo "Debe especificar el sistema operativo:"
     echo "--mac: MacOS"
     echo "--linux: Linux"
     kill $STRUCTURIZR_PID;;
esac
