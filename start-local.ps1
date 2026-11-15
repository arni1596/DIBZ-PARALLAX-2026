param(
    [string]$Python = 'python',
    [int]$Port = 5173
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'dist\index.html'))) { throw 'Prebuilt dist missing. Run npm.cmd ci and npm.cmd run build in this directory.' }
Write-Host "PARALLAX M101 explorer: http://127.0.0.1:$Port/"
Write-Host 'Local only. Press Ctrl+C to stop. Original FITS files are not served.'
& $Python -m http.server $Port --bind 127.0.0.1 --directory (Join-Path $PSScriptRoot 'dist')
exit $LASTEXITCODE
