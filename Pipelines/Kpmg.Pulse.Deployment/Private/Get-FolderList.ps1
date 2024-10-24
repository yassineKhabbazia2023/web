<#
.SYNOPSIS
Gets the list of MFE from a storage account.

.DESCRIPTION
This command scans a particular path inside a storage account and retrieve the list of
MFE located here.

.PARAMETER StorageAccount
The name of the storage account.

.PARAMETER Container
Name of the container where the manifest lies. Defaults to $web

.PARAMETER Path
The path where the MFE are located. Defaults to mfe

.NOTES
This command assumes az cli is installed and already logged in.
Typically, this is done during a pipeline by using the AzureCLI@2 task.
#>
function Get-FolderList {
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
    [String]$Path = 'mfe'
  )

  return ConvertFrom-Json ((az storage blob directory list `
    --account-name $StorageAccount `
    --container-name $Container `
    --directory-path $Path `
    --delimiter '/' `
    --only-show-errors) -join ' ')
}