<#
.SYNOPSIS
Updates the manifest.json file.

.DESCRIPTION
Donwload the existing manifest.json from a blob storage and updates it with the latest version of
each MFE.

.PARAMETER Environment
Target KPMG Pulse Front V2 environment.

.PARAMETER WorkingFolder
Path to an existing folder. A subfolder will be created and used as a working folder
for the duration of the execution. Defaults to $Env:BUILD_SOURCESDIRECTORY

.PARAMETER Path
Root path of the front in the target storage account. Defaults to empty path.

.OUTPUTS
A hashtable containing the MFE names as keys and as value the version that has been activated.

.NOTES
This command assumes az cli is installed and already logged in.
Typically, this is done during a pipeline by using the AzureCLI@2 task.
#>
function Update-Manifest {
  [CmdletBinding(SupportsShouldProcess)]
  [OutputType([System.Collections.HashTable])]
  Param(
    [Parameter()]
    [ValidatePattern('(dev|itg|rec|ppr|prd)\d{2}')]
    [String]$Environment,
    [Parameter()]
    [ValidateNotNullOrEmpty()]
    [String] $WorkingFolder = $Env:BUILD_SOURCESDIRECTORY,
    [Parameter()]
    [String] $Path = ' '
  )

  Test-AzureLoggedIn

  $env = Get-AdoEnvironment -Environment $Environment -Path $Path
  $workPath = [String]::IsNullOrWhiteSpace($Path) ? "$WorkingFolder/ImportMap/main" : "$WorkingFolder/ImportMap/$Path"

  if ( -not (Test-Path "$workPath" ))
  {
    New-Item -Path $workPath -ItemType Directory | Out-Null
  }

  $result = @{}

  try
  {
    $targetFile = [String]::IsNullOrWhiteSpace($Path) ? 'manifest.js' : "$Path/manifest.js"

    New-Item -ItemType Directory -Force -Path (Split-Path -Path "$workPath/$targetFile") -ErrorAction SilentlyContinue | Out-Null
    $importMap = @{imports = @{}}
    $importMap['imports']['@pulse/env-vars'] = "https://$($env.Fqdn)/env-vars.js"

    $mfeList = Get-FolderList -StorageAccount $env.StorageAccount

    foreach ($mfe in $mfeList)
    {
      $name = $mfe.name.Split('/')[-2]
      $versionList = Get-VersionList -StorageAccount $env.StorageAccount -Path $([String]::IsNullOrWhiteSpace($Path) ? "mfe/$name" : "$Path/mfe/$name")
      $lastVersion = $versionList.Keys | Select-Object -Last 1
      $importMap['imports']["@pulse/$name"] = "https://$($env.Fqdn)/mfe/$name/v$($versionList[$lastVersion])/$name.js"

      if ($Environment -eq 'itg01')
      {
        Copy-Folder -StorageAccount $env.StorageAccount `
          -Source $([String]::IsNullOrWhiteSpace($Path) ? "mfe/$name/v$($versionList[$lastVersion])" : "$Path/mfe/$name/v$($versionList[$lastVersion])") `
          -Destination $([String]::IsNullOrWhiteSpace($Path) ? "mfe/$name/active" : "$Path/mfe/$name/active")

        Set-Content -Path $workPath/version.txt -Value "v$($versionList[$lastVersion])"
        Deploy-ToStorageAccount -StorageAccount $env.StorageAccount -Path $workPath/version.txt -Target $([String]::IsNullOrWhiteSpace($Path) ? "mfe/$name/active/version.txt" : "$Path/mfe/$name/active/version.txt")
      }

      $result[$name] = $versionList[$lastVersion]
    }

    $manifest = @"
const im = document.createElement('script')

im.type = 'importmap'

im.textContent = JSON.stringify($(ConvertTo-Json $importMap -Depth 10))

document.currentScript.after(im)
"@

    Set-Content -Path $workPath/manifest.js -Value $manifest

    Deploy-ToStorageAccount -StorageAccount $env.StorageAccount -Path $workPath/manifest.js -Target $targetFile

    return $result
  }
  finally
  {
    Remove-Item -Path $workPath -Recurse -Force
  }
}