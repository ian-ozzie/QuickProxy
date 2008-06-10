@ECHO Off
SET b=%cd%
echo ---
echo Clearing temporary directory
del /Q tmp\*.*
echo Clearing temporary chrome directory
del /Q tmp\chrome\*.*
echo Temporary directories should be clear
echo ---
echo Archiving quickproxy.jar:
cd %b%\..\trunk\chrome\quickproxy\
%b%\7za.exe a -tzip -mx=0 -xr!.svn %b%\tmp\chrome\quickproxy.jar *
cd %b%
echo ---
echo Copying required files:
copy ..\trunk\*.* tmp\
echo ---
SET release=quickproxy-beta-fx.xpi
echo Created release name: %release%
echo ---
echo Removing previous build (%release%)
del /Q quickproxy-beta-fx.xpi
echo ---
echo Archiving %release%
cd %b%\tmp\
%b%\7za.exe a -tzip -xr!.svn %b%\%release% *
cd %b%
echo ---
echo Build complete!
echo ---
pause
echo ---
echo Clearing temporary directories
del /Q tmp\*.*
del /Q tmp\chrome\*.*