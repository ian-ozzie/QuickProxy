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
cd %b%\..\release\src\chrome\quickproxy\
%b%\7za.exe a -tzip -mx=0 -xr!.svn %b%\tmp\chrome\quickproxy.jar *
cd %b%
echo ---
echo Copying required files:
copy ..\release\src\*.* tmp\
echo ---
FOR /F "TOKENS=1* DELIMS= " %%A IN ('DATE/T') DO SET CDATE=%%B
FOR /F "TOKENS=1,2 eol=/ DELIMS=/ " %%A IN ('DATE/T') DO SET dd=%%B
FOR /F "TOKENS=1,2 DELIMS=/ eol=/" %%A IN ('echo %CDATE%') DO SET mm=%%B
FOR /F "TOKENS=2,3 DELIMS=/ " %%A IN ('echo %CDATE%') DO SET yyyy=%%B
SET release=quickproxy-%yyyy%.%mm%.%dd%-fx.xpi
echo Created release name: %release%
echo ---
echo Archiving %release%
cd %b%\tmp\
%b%\7za.exe a -tzip -xr!.svn %b%\..\release\xpi\%release% *
cd %b%
echo ---
echo Build complete!
echo ---
pause
echo ---
echo Clearing temporary directories
del /Q tmp\*.*
del /Q tmp\chrome\*.*