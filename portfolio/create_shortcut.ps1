# PowerShell Script to Create Desktop Shortcut for Vibhath's 3D Portfolio (Portable Version)

$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop")
$ShortcutPath = Join-Path $DesktopPath "Vibhath 3D Portfolio.lnk"

# Check if desktop directory exists, default to user profile if not
if (-not (Test-Path $DesktopPath)) {
    $DesktopPath = $env:USERPROFILE
    $ShortcutPath = Join-Path $DesktopPath "Vibhath 3D Portfolio.lnk"
}

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = Join-Path $PSScriptRoot "Launch_Vibhath_3D_Portfolio.bat"
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Description = "Launch Vibhath's 3D Neomorphic Portfolio"
$Shortcut.IconLocation = "imageres.dll,136" # A high-tech globe/network screen icon

$Shortcut.Save()
Write-Output "Shortcut successfully created at: $ShortcutPath"
