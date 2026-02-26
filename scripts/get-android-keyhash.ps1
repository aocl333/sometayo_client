# Android 디버그 키 해시 (카카오 개발자 콘솔 등록용)
# PowerShell에서: .\scripts\get-android-keyhash.ps1

$keystore = "$env:USERPROFILE\.android\debug.keystore"
if (-not (Test-Path $keystore)) {
    Write-Host "debug.keystore not found at $keystore"
    exit 1
}

$certFile = [System.IO.Path]::GetTempFileName()
try {
    & keytool -exportcert -alias androiddebugkey -keystore $keystore -storepass android -file $certFile 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "keytool failed. Is Java installed?"
        exit 1
    }
    $bytes = [System.IO.File]::ReadAllBytes($certFile)
    $sha1 = [System.Security.Cryptography.SHA1]::Create().ComputeHash($bytes)
    $base64 = [Convert]::ToBase64String($sha1)
    Write-Host ""
    Write-Host "=== Android Debug Key Hash (카카오 콘솔에 등록) ===" -ForegroundColor Green
    Write-Host $base64
    Write-Host ""
} finally {
    Remove-Item $certFile -ErrorAction SilentlyContinue
}
