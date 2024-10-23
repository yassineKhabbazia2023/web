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

  $hubRg = "fr$($Environment)hub"
  $commonRg = "fr$($envType)common"
  $cdnprofile = "$($hubRg)afd01profile"
  $endpointName = "$($Path -eq 'beta' ? 'beta' : 'app')-$($Environment)"

  $frontRg = "fr$($Environment)front"
  $storageAccount = "$($frontRg)sa01platform"
  $appconfiguration = "$($commonRg)app01config"

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
  $result['cdnGroup'] = $hubRg
  $result['cdnProfile'] = $cdnprofile
  $result['cdnEndpoint'] = $endpointName
  $result['cdnDomain'] = $hostname

  return $result
}