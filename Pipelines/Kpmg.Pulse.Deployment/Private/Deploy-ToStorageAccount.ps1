<#
.SYNOPSIS
Upload a manifest in a storage account.

.DESCRIPTION
This command uploads a file under the name 'manifest.json' in a storage account.

.PARAMETER StorageAccount
The name of the storage account.

.PARAMETER Path
The path to the manifest to upload.

.PARAMETER Container
Name of the container where the manifest lies. Defaults to $web

.PARAMETER Target
Target file in the storage account. Defaults to 'manifest.json'

.NOTES
This command assumes az cli is installed and already logged in.
Typically, this is done during a pipeline by using the AzureCLI@2 task.
#>
function Deploy-ToStorageAccount{
  [CmdletBinding(SupportsShouldProcess)]
  param (
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
    [String]$Target = 'manifest.json',
    [Parameter()]
    [ValidateSet('null', 'no-cache', 'max-age=3600')]
    [String]$CacheControl = 'no-cache'
  )

  if ($PSCmdLet.ShouldProcess($Path, "Upload to $StorageAccount"))
  {
    if ('null' -eq $CacheControl)
    {
      az storage blob upload `
        --account-name $StorageAccount `
        --container-name $Container `
        --file $Path `
        --name $Target `
        --overwrite `
        --only-show-errors | Out-Null
    }
    else
    {
      az storage blob upload `
        --account-name $StorageAccount `
        --container-name $Container `
        --file $Path `
        --name $Target `
        --overwrite `
        --content-cache $CacheControl `
        --only-show-errors | Out-Null
    }
  }
}