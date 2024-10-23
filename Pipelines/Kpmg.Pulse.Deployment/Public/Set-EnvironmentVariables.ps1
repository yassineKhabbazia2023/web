<#
.SYNOPSIS
Creates the envVars.js file from a keyvault secrets.

.DESCRIPTION
This commands read all secrets from a keyvault, formats them so that
they can be used as env vars by the portal and push the result to a
storage account.

.PARAMETER Environment
Target KPMG Pulse Front V2 environment.

.PARAMETER WorkingFolder
Path to an existing folder. A subfolder will be created and used as a working folder
for the duration of the execution. Defaults to $Env:BUILD_SOURCESDIRECTORY

.PARAMETER Path
Root path of the front in the target storage account. Defaults to empty path.

.NOTES
This command assumes az cli is installed and already logged in.
Typically, this is done during a pipeline by using the AzureCLI@2 task.
#>
function Set-EnvironmentVariables{
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
    [String] $WorkingFolder = $Env:BUILD_SOURCESDIRECTORY,
    [Parameter()]
    [String] $Path = ' '
  )

  Test-AzureLoggedIn

  $env = Get-AdoEnvironment -Environment $Environment -Path $Path
  $workPath = [String]::IsNullOrWhiteSpace($Path) ? "$WorkingFolder/EnvVars/main" : "$WorkingFolder/EnvVars/$Path"

  if ( -not (Test-Path $workPath ))
  {
    New-Item -Path $workPath -ItemType Directory | Out-Null
  }

  Write-Host "Writing workPath: $($workPath)"

  try
  {
    # Fetch secrets from Key Vault and format them into a JavaScript object
    $key = 'Domain_Front_'
    $secretList = ConvertFrom-Json ((az appconfig kv list --auth-mode login --name $env.AppConfiguration --key "$key*" --fields key value label --all) -join ' ')
    $portailEnvVarsContent = @(
      "const envVars = {"
    )

    $noLabelSecretList = $secretList | Where-Object -FilterScript { $null -eq $_.label }
    $currentEnvSecretList = $secretList | Where-Object -FilterScript { $Environment -eq $_.label }

    foreach ($secret in $noLabelSecretList)
    {
      $name = $secret.key.Substring($key.Length)
      $override = $currentEnvSecretList | Where-Object -FilterScript { $secret.key -eq $_.key}
      $portailEnvVarsContent += "  $($name) : ``$($override.value ?? $secret.value)``,"
    }

    $portailEnvVarsContent +=  @(
      "}"
      
      "window.EnvVars = envVars"
    )

    Write-Host "Writing env-vars.js: $($portailEnvVarsContent)"
    Set-Content -Path $workPath/env-vars.js -Value $portailEnvVarsContent

    $targetFile = [String]::IsNullOrWhiteSpace($Path) ? 'env-vars.js' : "$Path/env-vars.js"
    Deploy-ToStorageAccount -StorageAccount $env.StorageAccount -Path "$workPath/env-vars.js" -Target $targetFile

    $styleCssContent = "@import url(`"https://assets-$($Environment).$($env['env']).kpmg-pulse.fr/fonts/index.css`");"

    Write-Host "Writing styles.css: $($styleCssContent)"
    Set-Content -Path $workPath/styles.css -Value $styleCssContent

    $targetFile = [String]::IsNullOrWhiteSpace($Path) ? 'styles.css' : "$Path/styles.css"
    Deploy-ToStorageAccount -StorageAccount $env.StorageAccount -Path "$workPath/styles.css" -Target $targetFile

  }
  finally
  {
    Remove-Item -Path $workPath -Recurse -Force
  }
}