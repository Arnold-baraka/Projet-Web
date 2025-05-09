#!/bin/bash

# Author: Arnold MUKE BARAKA
# Description: Create a zip archive of the project excluding certain files and folders

ZIP_NAME="final_submission_Arnold_MUKE_BARAKA.zip"

# Detect OS type
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo "🪟 Detected Windows Git Bash"
    
    if [ ! -d zip ]; then mkdir zip; fi
    curl -sL "https://sourceforge.net/projects/gnuwin32/files/zip/3.0/zip-3.0-bin.zip" > zip/zip.zip
    unzip -o zip/zip.zip -d zip > /dev/null

    if [ ! -d bzip2 ]; then mkdir bzip2; fi
    curl -sL "https://sourceforge.net/projects/gnuwin32/files/bzip2/1.0.5/bzip2-1.0.5-bin.zip" > bzip2/bzip2.zip
    unzip -o bzip2/bzip2.zip -d bzip2 > /dev/null
    cp bzip2/bin/bzip2.dll zip/bin/

    zip/bin/zip -r "$ZIP_NAME" . -x "*.zip" -x "node_modules/*" -x "db/cozy_corner.db" -x "exec/*" -x "sqlite/*" -x "zip/*" -x "bzip2/*" -x ".git/*" > /dev/null

else
    echo "🐧 Detected Unix-like system (macOS/Linux)"

    zip -r "$ZIP_NAME" . -x "*.zip" -x "node_modules/*" -x "db/cozy_corner.db" -x "exec/*" -x "sqlite/*" -x "zip/*" -x "bzip2/*" -x ".git/*" > /dev/null
fi

echo "✅ Archive created successfully: $ZIP_NAME"

rm -rf zip
rm -rf bzip2

exit 0