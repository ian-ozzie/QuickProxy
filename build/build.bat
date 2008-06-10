@ECHO Off
SET b=%cd%
echo ---
echo Clearing temporary directory:
del /F /Q /S tmp\*.*
echo ---
echo Archiving quickproxy.jar:
cd %b%\..\trunk\chrome\quickproxy\
%b%\7za.exe a -tzip -mx=0 %b%\tmp\chrome\quickproxy.jar *
cd %b%
echo ---
echo Copying required files:
copy ..\trunk\*.* tmp\
echo ---
echo Removing previous build:
del /F /Q /S ..\release\xpi\*.*
echo ---
FOR /F "TOKENS=1* DELIMS= " %%A IN ('DATE/T') DO SET CDATE=%%B
FOR /F "TOKENS=1,2 eol=/ DELIMS=/ " %%A IN ('DATE/T') DO SET mm=%%B
FOR /F "TOKENS=1,2 DELIMS=/ eol=/" %%A IN ('echo %CDATE%') DO SET dd=%%B
FOR /F "TOKENS=2,3 DELIMS=/ " %%A IN ('echo %CDATE%') DO SET yyyy=%%B
SET release=quickproxy-%yyyy%.%mm%.%dd%-fx.xpi
echo Created release name: %release%
echo ---
echo Archiving %release%
cd %b%\tmp\
%b%\7za.exe a -tzip %b%\..\release\xpi\%release% *
cd %b%
echo ---
echo Build complete!
echo ---
pause
echo ---
echo Clearing temporary directory:
del /F /Q /S tmp\*.*