# Comprehensive Import Fix Script for Feature-Based Architecture
Write-Host "Starting comprehensive import fixes..." -ForegroundColor Green

$srcPath = ".\src"
$files = Get-ChildItem -Path $srcPath -Recurse -Filter "*.tsx" -File
$totalFiles = $files.Count
$current = 0

foreach ($file in $files) {
    $current++
    $percentComplete = ($current / $totalFiles) * 100
    Write-Progress -Activity "Fixing imports" -Status "Processing $($file.Name)" -PercentComplete $percentComplete
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix navigation imports - ALL navigation components are now in @/shared/components/layout
    $content = $content -replace 'from [''"]\.\.\/components\/navigation[''"]', 'from "@/shared/components/layout"'
    $content = $content -replace 'from [''"]\.\.\/components\/navigation\/Sidebar[''"]', 'from "@/shared/components/layout/Sidebar"'
    $content = $content -replace 'from [''"]\.\.\/components\/navigation\/UnifiedSidebar[''"]', 'from "@/shared/components/layout/UnifiedSidebar"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/components\/navigation[''"]', 'from "@/shared/components/layout"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/components\/navigation\/Sidebar[''"]', 'from "@/shared/components/layout/Sidebar"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/components\/navigation\/UnifiedSidebar[''"]', 'from "@/shared/components/layout/UnifiedSidebar"'
    
    # Fix auth context imports - now in @/shared/hooks
    $content = $content -replace 'from [''"]\.\.\/context\/AuthContext[''"]', 'from "@/shared/hooks/AuthContext"'
    $content = $content -replace 'from [''"]\.\.\/context\/useAuth[''"]', 'from "@/shared/hooks/useAuth"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/context\/AuthContext[''"]', 'from "@/shared/hooks/AuthContext"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/context\/useAuth[''"]', 'from "@/shared/hooks/useAuth"'
    $content = $content -replace 'from [''"]\.\/AuthContext[''"]', 'from "@/shared/hooks/AuthContext"'
    $content = $content -replace 'from [''"]\.\/useAuth[''"]', 'from "@/shared/hooks/useAuth"'
    
    # Fix ToastContext imports
    $content = $content -replace 'from [''"]\.\.\/context\/ToastContext[''"]', 'from "@/shared/hooks/ToastContext"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/context\/ToastContext[''"]', 'from "@/shared/hooks/ToastContext"'
    
    # Fix UI component imports
    $content = $content -replace 'from [''"]\.\.\/components\/ui\/([^''"]+)[''"]', 'from "@/shared/components/ui/$1"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/components\/ui\/([^''"]+)[''"]', 'from "@/shared/components/ui/$1"'
    $content = $content -replace 'from [''"]\.\.\/components\/ui[''"]', 'from "@/shared/components/ui"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/components\/ui[''"]', 'from "@/shared/components/ui"'
    
    # Fix session component imports
    $content = $content -replace 'from [''"]\.\.\/components\/session[''"]', 'from "@/features/sessions/components"'
    
    # Fix store imports
    $content = $content -replace 'from [''"]\.\.\/store\/([^''"]+)[''"]', 'from "@/store/$1"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/store\/([^''"]+)[''"]', 'from "@/store/$1"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/\.\.\/store\/([^''"]+)[''"]', 'from "@/store/$1"'
    
    # Fix utils imports
    $content = $content -replace 'from [''"]\.\.\/utils\/([^''"]+)[''"]', 'from "@/shared/utils/$1"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/utils\/([^''"]+)[''"]', 'from "@/shared/utils/$1"'
    
    # Fix types imports
    $content = $content -replace 'from [''"]\.\.\/types\/([^''"]+)[''"]', 'from "@/shared/types/$1"'
    $content = $content -replace 'from [''"]\.\.\/\.\.\/types\/([^''"]+)[''"]', 'from "@/shared/types/$1"'
    
    # Save if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Progress -Activity "Fixing imports" -Completed
Write-Host "Import fixes completed!" -ForegroundColor Green
Write-Host "Total files processed: $totalFiles" -ForegroundColor Cyan
