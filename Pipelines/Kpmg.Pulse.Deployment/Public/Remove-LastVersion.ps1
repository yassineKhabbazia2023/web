<#
.SYNOPSIS
Removes the last version of a given MFE.

.DESCRIPTION
This command looks for the last version of an MFE in the given storage account
and removes it. It also run Update-Manifest right after
in order to fix the environment.

.PARAMETER MfeName
Name of the MFE whose last version will be cleaned.

.PARAMETER Environment
Target KPMG Pulse Front V2 environment.

.PARAMETER Path
Root path of the front in the target storage account. Defaults to empty path.

.NOTES
This command assumes az cli is installed and already logged in.
Typically, this is done during a pipeline by using the AzureCLI@2 task.
#>
function Remove-LastVersion{
  [CmdletBinding(SupportsShouldProcess)]
  param (
    [Parameter()]
    [String] $MfeName,
    [Parameter()]
    [ValidatePattern('(dev|itg|rec|ppr|prd)\d{2}')]
    [String]$Environment,
    [Parameter()]
    [String]$Path = ' '
  )

  Test-AzureLoggedIn

  switch ($Environment) {
    'DEV' { $subscriptionName = 'FR-DEV' }
    'REC' { $subscriptionName = 'FR-RECX' }
    'PREPROD' { $subscriptionName = 'FR-PPRX' }
    'PROD' { $subscriptionName = 'FR-PRDX' }
  }

  az account set --subscription $subscriptionName

  $env = Get-AdoEnvironment -Environment $Environment -Path $Path

  $targetPath = [String]::IsNullOrWhiteSpace($Path) ? "mfe/$MfeName" : "$Path/mfe/$MfeName"
  $versionList = Get-VersionList -StorageAccount $env.StorageAccount -Path $targetPath
  $version = $versionList[$($versionList.Keys | Select-Object -Last 1)]

  if ($PSCmdLet.ShouldProcess($version, "Remove from $($env.StorageAccount)"))
  {
    az storage blob delete-batch `
      --account-name $env.StorageAccount `
      --source '$web' `
      --pattern "$targetPath/v$($version)/*" `
      --only-show-errors | Out-Null
  }

  Update-Manifest -Environment $Environment -Path $Path -WorkingFolder .
}