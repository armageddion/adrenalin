param(
    [Parameter(Mandatory=$true)]
    [string]$DestinationFolder
)

$ProjectPath = Get-Location
$TaskName = "AdrenalinDBBackup"

# Ensure the destination folder exists
if (!(Test-Path $DestinationFolder)) {
    New-Item -ItemType Directory -Path $DestinationFolder | Out-Null
}

$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-Command `"& { Set-Location '$ProjectPath'; node scripts/backup-db.js; `$latest = Get-ChildItem backups/ | Sort-Object LastWriteTime -Descending | Select-Object -First 1; if (`$latest) { Copy-Item `$latest.FullName '$DestinationFolder' } }`""

$Trigger = New-ScheduledTaskTrigger -Daily -At 12:00AM

$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -RunLevel Highest

Write-Host "Scheduled task '$TaskName' created to run daily at midnight, backing up DB and copying to $DestinationFolder."