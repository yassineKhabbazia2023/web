function Get-AdoEnvironment{
  [CmdletBinding()]
  param (
    [Parameter()]
    [ValidatePattern('(dev|itg|rec|ppr|prd)\d{2}')]
    [String]$Environment,
    [Parameter()]
    [String]$Path = ' '
  )

  $result = @{}

  $envType = $Environment.Substring(0,3)

  $storageAccount = "sacegpulsefront$($Environment)01"
  $appconfiguration = "appcscegpulsecmn$($envType)0001"

  if ($Environment.ToLower() -eq 'prd01')
  {
    $hostname = 'app.kpmg-pulse.fr'
  }
  else
  {
    $hostname = "app-$($Environment)$([string]::IsNullOrWhiteSpace($Path) ? '' : "-$Path").$($envType).kpmg-pulse.fr"
  }

  $result['env'] = $envType
  $result['StorageAccount'] = $storageAccount
  $result['AppConfiguration'] = $appconfiguration
  $result['Fqdn'] = $hostname

  return $result
}