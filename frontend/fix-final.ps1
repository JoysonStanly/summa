# Final Import Fixes
Write-Host "Applying final import fixes..." -ForegroundColor Green

$srcPath = ".\src"
$filesFixed = 0

# Fix 1: Auth.css imports  
$authPages = Get-ChildItem -Path "$srcPath\features\auth\pages\*.tsx" -Recurse
foreach ($file in $authPages) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'from [''"]\.\.\/styles\/Auth\.css[''"]') {
        $content = $content -replace 'import [''"]\.\.\/styles\/Auth\.css[''"];', 'import "@/styles/Auth.css";'
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $filesFixed++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Yellow
    }
}

# Fix 2: AuthContext path (it's in shared/hooks)
$contextFiles = Get-ChildItem -Path $srcPath -Recurse -Filter "*.tsx" -File
foreach ($file in $contextFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix AuthContext import to use correct @ path
    $content = $content -replace 'from [''"]@/shared/hooks/AuthContext[''"]', 'from "@/shared/hooks/AuthContext"'
    # AuthContext is actually ThemeContext/useAuth - files importing AuthContext should use these
    # But let's keep the path correct for now
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $filesFixed++
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Yellow
    }
}

# Fix 3: sessions data imports
$sessionComponents = Get-ChildItem -Path "$srcPath\features\sessions\components\*.tsx" -File
foreach ($file in $sessionComponents) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    $content = $content -replace 'from [''"]\.\.\/\.\.\/data\/sessions[''"]', 'from "../data/sessions"'
    $content = $content -replace 'from [''"]\.\.\/ui[''"]', 'from "@/shared/components/ui"'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $filesFixed++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Yellow
    }
}

# Fix 4: TopBar imports
$topBarFile = Get-Item "$srcPath\shared\components\layout\TopBar.tsx" -ErrorAction SilentlyContinue
if ($topBarFile) {
    $content = Get-Content $topBarFile.FullName -Raw
    $content = $content -replace 'from [''"]\.\.\/ui\/common[''"]', 'from "@/shared/components/ui"'
    $content = $content -replace 'from [''"]\.\.\/auth\/AuthButtons[''"]', 'from "@/features/auth/components/AuthButtons"'
    Set-Content -Path $topBarFile.FullName -Value $content -NoNewline
    $filesFixed++
    Write-Host "Fixed: TopBar.tsx" -ForegroundColor Yellow
}

# Fix 5: dsaTopics in EditProblemPage
$editProblemPage = Get-Item "$srcPath\features\admin\pages\EditProblemPage.tsx" -ErrorAction SilentlyContinue
if ($editProblemPage) {
    $content = Get-Content $editProblemPage.FullName -Raw
    $content = $content -replace 'from [''"]\.\.\/data\/dsaTopics[''"]', 'from "@/features/problems/data/dsaTopics"'
    Set-Content -Path $editProblemPage.FullName -Value $content -NoNewline
    $filesFixed++
    Write-Host "Fixed: EditProblemPage.tsx" -ForegroundColor Yellow
}

Write-Host "`nFinal fixes completed!" -ForegroundColor Green
Write-Host "Total files fixed: $filesFixed" -ForegroundColor Cyan
