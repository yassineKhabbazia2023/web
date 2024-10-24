<#
.SYNOPSIS
Gets the manifest.json file from a storage account.

.DESCRIPTION
This commands download the manifest.json located in the $web container of a
given storage account.
If the file doesn't exists on the storage account, nothing is downloaded.

.PARAMETER StorageAccount
The name of the storage account.

.PARAMETER Path
The path where the manifest will be downloaded on the local disk. The path must exists beforehand.

.PARAMETER Container
Name of the container where the manifest lies. Defaults to $web

.PARAMETER Name
Name of the downloaded file. Must includes the full path from the container root. Defaults to manifest.json

.NOTES
This command assumes az cli is installed and already logged in.
Typically, this is done during a pipeline by using the AzureCLI@2 task.
#>
function Get-FileFromStorageAccount {
  [CmdletBinding()]
  Param (
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String]$StorageAccount,
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String]$Path,
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String]$Container = '$web',
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String]$Name = 'manifest.json'
  )

  $hasImportMap = ConvertFrom-Json ((az storage blob exists `
      --account-name $StorageAccount `
      --container-name $Container `
      --name $Name `
      --only-show-errors ) -join ' ')

  if ($hasImportMap.exists)
  {
    az storage blob download `
      --account-name $StorageAccount `
      --container-name $Container `
      --name $Name `
      --file "$Path/$Name" `
      --only-show-errors | Out-Null
  }
}