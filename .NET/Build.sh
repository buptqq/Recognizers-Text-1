#!/bin/bash

BUILD_PLATFORM=Unix
BUILD_CONFIGURATION=Debug

echo "// Building .NET platform"

command -v dotnet >/dev/null 2>&1 || { echo >&2 "dotnet not found. Make sure it's installed and included in PATH. Aborting."; exit 1; }
command -v nuget >/dev/null 2>&1 || { echo >&2 "NuGet not found. Make sure it's installed and included in PATH. Aborting."; exit 1; }
command -v msbuild >/dev/null 2>&1 || { echo >&2 "MSBuild not found. Make sure it's installed and included in PATH. Aborting."; exit 1; }

echo "// Restoring NuGet dependencies"
nuget restore

echo "// Build .NET solution ($BUILD_CONFIGURATION)"
rm -rf build
mkdir -p build/package
msbuild Microsoft.Recognizers.Text.sln \
        /p:Configuration="$BUILD_CONFIGURATION" \
        /p:Platform="$BUILD_PLATFORM" \
        /t:Clean,Build
        
echo "// Running .NET Tests"
find . | grep 'bin/Debug.*Tests.dll' | while read line; do
    dotnet vstest --Parallel --Framework:Framework45 --Diag:log.txt $line
done
