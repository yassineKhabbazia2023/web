function Copy-Libraries {
  [CmdletBinding()]
  param (
    [Parameter()]
    [String] $SourceFile,
    [Parameter()]
    [ValidatePattern('(dev|itg|rec|ppr|prd)\d{2}')]
    [String]$Environment,
    [Parameter()]
    [String]$Path = ' '
  )

  Test-AzureLoggedIn

  $env = Get-AdoEnvironment -Environment $Environment -Path $Path
  $ProgressPreference = 'SilentlyContinue'
  $workPath = [String]::IsNullOrWhiteSpace($Path) ? "$WorkingFolder/Libraries/main" : "$WorkingFolder/Libraries/$Path"

  if ( -not (Test-Path $workPath ))
  {
    New-Item -Path $workPath -ItemType Directory | Out-Null
  }

  try
  {
    $index = Get-Content -Path $SourceFile
    $sourceList = $index -match '<%= source %>.*js' | `
      ForEach-Object -Process { $_.Split('"') | `
      Where-Object -FilterScript { $_.Trim().StartsWith('<%=') }}
    $localPath = [String]::IsNullOrWhiteSpace($Path) ? "libs" : "$Path/libs"

    foreach ($source in $sourceList)
    {
      $target = $source.Replace('<%= source %>', $localPath).Replace('<%= prod %>', '.prod');
      $libraryUrl = $source.Replace('<%= source %>', 'https://cdn.jsdelivr.net/npm').Replace('<%= prod %>', '.prod');

      Invoke-WebRequest -Uri $libraryUrl -OutFile "$workPath/target.js"
      Deploy-ToStorageAccount -StorageAccount $env.StorageAccount -Path "$workPath/target.js" -Target $target -CacheControl 'null'
    }

    $mazeUrl = 'https://snippet.maze.co/maze-universal-loader.js'
    $target = "$localPath/maze-universal-loader.js"
    Invoke-WebRequest -Uri $mazeUrl -OutFile "$workPath/target.js"
    Deploy-ToStorageAccount -StorageAccount $env.StorageAccount -Path "$workPath/target.js" -Target $target -CacheControl 'null'
}
  finally
  {
    Remove-Item -Path $workPath -Recurse -Force
  }
}
