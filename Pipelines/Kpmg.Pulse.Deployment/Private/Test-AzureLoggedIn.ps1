function Test-AzureLoggedIn {
  [CmdletBinding()]
  param (
  )

  if ( $null -eq (az account show | ConvertFrom-Json) )
  {
    throw 'Login into azure by using az login prior tu using this module commands !'
  }
}