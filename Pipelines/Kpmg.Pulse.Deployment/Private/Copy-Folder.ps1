<#
.SYNOPSIS
Copies one folder to another.

.DESCRIPTION
This command copies all files from a folder to another, recursively.

.PARAMETER StorageAccount
The name of the storage account.

.PARAMETER Container
Name of the container where the manifest lies. Defaults to $web

.PARAMETER Source
The path where the source files are located

.PARAMETER Destination
The path where the files will be copied

.NOTES
This command assumes az cli is installed and already logged in.
Typically, this is done during a pipeline by using the AzureCLI@2 task.
#>
function Copy-Folder {
  [CmdletBinding()]
  param (
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String]$StorageAccount,
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String]$Container = '$web',
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String]$Source,
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String]$Destination
  )

  az storage copy `
    --source https://$StorageAccount.blob.core.windows.net/$Container/$Source/* `
    --destination https://$StorageAccount.blob.core.windows.net/$Container/$Destination `
    --recursive
}