
<#
.SYNOPSIS
Sets the cache-control header for shell files

.PARAMETER Environment
Target KPMG Pulse Front V2 environment.

.NOTES
This command assumes az cli is installed and already logged in.
Typically, this is done during a pipeline by using the AzureCLI@2 task.
#>
function Set-CacheControl {
  [OutputType([System.Collections.HashTable])]
  Param(
    [Parameter()]
    [ValidatePattern('(dev|itg|rec|ppr|prd)\d{2}')]
    [String]$Environment
  )

  $env = Get-AdoEnvironment -Environment $Environment -Path $Path

  $fileList = @(
    '276.@kpmg-shell.js'
    '67.@kpmg-shell.js'
    '@kpmg-shell.js'
    'index.html'
    'styles.css'
  )

  foreach($file in $fileList)
  {
    az storage blob update `
      --account-name $env.StorageAccount `
      --container-name '$web' `
      --name $file `
      --content-cache 'max-age=3600' 
  }
}
