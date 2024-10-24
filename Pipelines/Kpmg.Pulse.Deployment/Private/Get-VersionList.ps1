<#
.SYNOPSIS
Gets the list of MFE versions from a storage account.

.DESCRIPTION
This command scans a particular path inside a storage account and retrieve the list of
MFE versions located here.

.PARAMETER StorageAccount
The name of the storage account.

.PARAMETER Container
Name of the container where the manifest lies. Defaults to $web

.PARAMETER Path
The path where the MFE are located. Defaults to mfes

.NOTES
This command assumes az cli is installed and already logged in.
Typically, this is done during a pipeline by using the AzureCLI@2 task.
#>
function Get-VersionList {
  [CmdletBinding()]
  [OutputType([System.Collections.Generic.SortedDictionary`2[[System.Version],[System.String]]])]
  param (
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String]$StorageAccount,
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String]$Container = '$web',
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String]$Path = 'mfes'
  )

  $directoryList = ConvertFrom-Json ((az storage blob directory list `
    --account-name $StorageAccount `
    --container-name $Container `
    --directory-path $Path `
    --delimiter '/' `
    --only-show-errors) -join ' ')

  [System.Collections.Generic.SortedDictionary[System.Version, String]]$result = [System.Collections.Generic.SortedDictionary[System.Version, String]]::new()

  $directoryList `
    | Foreach-Object { 
      if (-not $_.name.EndsWith('/active/'))
        { 
          $result.Add([System.Version]$_.name.Split('/')[-2].substring(1).Split('-')[0], $_.name.Split('/')[-2].substring(1))
        }
      }

  return $result
}