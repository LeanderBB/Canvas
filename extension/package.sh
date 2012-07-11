#!/bin/bash
#
# Create the canvas.xpi extension for firefox
# usage: script [version] [project_dir]
#
# Note: The [project_dir] parameter can be defined as an environment variable
# - CANVAS_PROJECT_DIR 
#
echo "$# $0 $1 $2 $3"
if [ $# -eq 1 ] &&  [ ! -z $CANVAS_PROJECT_DIR ]; then
    VERSION=$1
    PROJECT_DIR=$CANVAS_PROJECT_DIR
elif [ $# -ge 2 ]; then
    VERSION=$1
    PROJECT_DIR=$2
else
    echo "Usage: $0 [version] [project_dir]"
    echo "      version:     Extension Version"
    echo "      project_dir: Project directory. This parameter is optional"
    echo "                   if the CANVAS_PROJECT_DIR evironment varaible"
    echo "                   is set."
    exit 1
fi

# validate project path
if [[ ! $PROJECT_DIR =~ ^\/ ]]; then
    echo "Project path is not absolute!"
    exit 1
fi

if [[ ! $PROJECT_DIR =~ \/$ ]]; then
    PROJECT_DIR="$PROJECT_DIR/"
fi


ZIP_NAME="canvas.zip"
ZIP_ARGS="-r"
ZIP_FILES="chrome.manifest install.rdf defaults"
XPI_NAME="canvas.xpi"
echo "Generating extension with:"
echo "Version       : $VERSION"
echo "Project Path  : $PROJECT_DIR"
sed -e "s,%VERSION%,$VERSION,g" install.rdf.tmpl > install.rdf
sed -e "s,%PROJECT_DIR%,$PROJECT_DIR,g" chrome.manifest.tmpl > chrome.manifest

zip $ZIP_NAME $ZIP_ARGS $ZIP_FILES
mv $ZIP_NAME $XPI_NAME

echo "Create XPI at $(pwd)/$XPI_NAME"
