<#
.SYNOPSIS
Removes all versions of MFEs except the last ones.

.DESCRIPTION
This command scans a storage account for MFE version. For each MFE, only
the last x versions (default 3) are kept and the rest are removed.

.PARAMETER Environment
Target KPMG Pulse Front V2 environment.

.PARAMETER AmountToKeep
Amount of version to keep for each MFE. Defaults to 3.

.PARAMETER Path
Root path of the front in the target storage account. Defaults to empty path.

.NOTES
This command assumes az cli is installed and already logged in.
Typically, this is done during a pipeline by using the AzureCLI@2 task.
#>
function Remove-OldVersions{
  [Diagnostics.CodeAnalysis.SuppressMessageAttribute(
    'PSUseSingularNouns','',
    Justification = 'Plural is justified here'
  )]
  [CmdletBinding(SupportsShouldProcess)]
  param (
    [Parameter()]
    [ValidatePattern('(dev|itg|rec|ppr|prd)\d{2}')]
    [String]$Environment,
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [Int] $AmountToKeep = 3,
    [Parameter()]
    [String] $Path = ' '
  )

  Test-AzureLoggedIn

  $env = Get-AdoEnvironment -Environment $Environment -Path $Path

  $targetPath = [String]::IsNullOrWhiteSpace($Path) ? 'mfe' : "$Path/mfe"

  $mfeList = Get-FolderList -StorageAccount $env.StorageAccount -Path $targetPath

  foreach ($mfe in $mfeList)
  {
    $name = $mfe.name.Split('/')[-2]
    $version = Get-VersionList -StorageAccount $env.StorageAccount -Path "$targetPath/$name"
    $amountToDelete = $version.Count - $AmountToKeep
    if ($amountToDelete -gt 0)
    {
      Write-Information "Removing $amountToDelete versions for MFE $name"
      foreach ($versionToRemove in $version.Keys | Select-Object -First $amountToDelete)
      {
        if ($PSCmdLet.ShouldProcess($version[$versionToRemove], "Remove from $($env.StorageAccount)"))
        {
          az storage blob delete-batch `
            --account-name $env.StorageAccount `
            --source '$web' `
            --pattern "$targetPath/$name/v$($version[$versionToRemove])/*" `
            --only-show-errors | Out-Null
        }
      }
    }
  }

  # $styleGuidePath = [String]::IsNullOrWhiteSpace($Path) ? 'StyleGuide' : "$Path/StyleGuide"
  # $styleGuideVersionList = Get-VersionList -StorageAccount $env.StorageAccount -Path $styleGuidePath
  # $amountToDelete = $styleGuideVersionList.Count - $AmountToKeep
  # if ($amountToDelete -gt 0)
  # {
  #   Write-Information "Removing $amountToDelete versions for Style Guide"
  #   foreach ($versionToRemove in $styleGuideVersionList.Keys | Select-Object -First $amountToDelete)
  #   {
  #     if ($PSCmdLet.ShouldProcess($styleGuideVersionList[$versionToRemove], "Remove from $($env.StorageAccount)"))
  #     {
  #       az storage blob delete-batch `
  #         --account-name $env.StorageAccount `
  #         --source '$web' `
  #         --pattern "$styleGuidePath/v$($styleGuideVersionList[$versionToRemove])/*" `
  #         --only-show-errors | Out-Null
  #     }
  #   }
  # }
}