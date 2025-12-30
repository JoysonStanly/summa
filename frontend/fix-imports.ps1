# Fix Frontend Imports After Restructuring
Write-Host "🔧 Fixing import paths..." -ForegroundColor Cyan

$replacements = @(
    # Shared components
    @{Old = 'from "../components/navigation"'; New = 'from "@/shared/components/layout"'},
    @{Old = 'from "../../components/navigation"'; New = 'from "@/shared/components/layout"'},
    @{Old = 'from "../../../components/navigation"'; New = 'from "@/shared/components/layout"'},
    @{Old = 'from "../components/navigation/Sidebar"'; New = 'from "@/shared/components/layout/Sidebar"'},
    @{Old = 'from "../../components/navigation/Sidebar"'; New = 'from "@/shared/components/layout/Sidebar"'},
    @{Old = 'from "../../../components/navigation/Sidebar"'; New = 'from "@/shared/components/layout/Sidebar"'},
    @{Old = 'from "../components/navigation/TopBar"'; New = 'from "@/shared/components/layout/TopBar"'},
    @{Old = 'from "../../components/navigation/TopBar"'; New = 'from "@/shared/components/layout/TopBar"'},
    @{Old = 'from "../components/navigation/UnifiedSidebar"'; New = 'from "@/shared/components/layout/UnifiedSidebar"'},
    @{Old = 'from "../../components/navigation/UnifiedSidebar"'; New = 'from "@/shared/components/layout/UnifiedSidebar"'},
    @{Old = 'from "../../../components/navigation/UnifiedSidebar"'; New = 'from "@/shared/components/layout/UnifiedSidebar"'},
    
    # UI components
    @{Old = 'from "../components/ui/ImageUpload"'; New = 'from "@/shared/components/ui/ImageUpload"'},
    @{Old = 'from "../../components/ui/ImageUpload"'; New = 'from "@/shared/components/ui/ImageUpload"'},
    @{Old = 'from "../../../components/ui/ImageUpload"'; New = 'from "@/shared/components/ui/ImageUpload"'},
    @{Old = 'from "../components/ui/Toast"'; New = 'from "@/shared/components/ui/Toast"'},
    @{Old = 'from "../../components/ui/Toast"'; New = 'from "@/shared/components/ui/Toast"'},
    @{Old = 'from "../../../components/ui/Toast"'; New = 'from "@/shared/components/ui/Toast"'},
    @{Old = 'from "../components/ui"'; New = 'from "@/shared/components/ui"'},
    @{Old = 'from "../../components/ui"'; New = 'from "@/shared/components/ui"'},
    @{Old = 'from "../../../components/ui"'; New = 'from "@/shared/components/ui"'},
    
    # Context/Hooks
    @{Old = 'from "../context/ToastContext"'; New = 'from "@/shared/hooks/ToastContext"'},
    @{Old = 'from "../../context/ToastContext"'; New = 'from "@/shared/hooks/ToastContext"'},
    @{Old = 'from "../../../context/ToastContext"'; New = 'from "@/shared/hooks/ToastContext"'},
    @{Old = 'from "../context/useAuth"'; New = 'from "@/shared/hooks/useAuth"'},
    @{Old = 'from "../../context/useAuth"'; New = 'from "@/shared/hooks/useAuth"'},
    @{Old = 'from "../../../context/useAuth"'; New = 'from "@/shared/hooks/useAuth"'},
    @{Old = 'from "../context/useTheme"'; New = 'from "@/shared/hooks/useTheme"'},
    @{Old = 'from "../../context/useTheme"'; New = 'from "@/shared/hooks/useTheme"'},
    @{Old = 'from "../../../context/useTheme"'; New = 'from "@/shared/hooks/useTheme"'},
    
    # Data files
    @{Old = 'from "../data/dsaTopics"'; New = 'from "@/features/problems/data/dsaTopics"'},
    @{Old = 'from "../../data/dsaTopics"'; New = 'from "@/features/problems/data/dsaTopics"'},
    @{Old = 'from "../../../data/dsaTopics"'; New = 'from "@/features/problems/data/dsaTopics"'},
    @{Old = 'from "../data/problems"'; New = 'from "@/features/problems/data/problems"'},
    @{Old = 'from "../../data/problems"'; New = 'from "@/features/problems/data/problems"'},
    @{Old = 'from "../../../data/problems"'; New = 'from "@/features/problems/data/problems"'},
    @{Old = 'from "../data/subjects"'; New = 'from "@/features/core-subjects/data/subjects"'},
    @{Old = 'from "../../data/subjects"'; New = 'from "@/features/core-subjects/data/subjects"'},
    @{Old = 'from "../../../data/subjects"'; New = 'from "@/features/core-subjects/data/subjects"'},
    @{Old = 'from "../data/sessions"'; New = 'from "@/features/sessions/data/sessions"'},
    @{Old = 'from "../../data/sessions"'; New = 'from "@/features/sessions/data/sessions"'},
    
    # Services
    @{Old = 'from "../services/problemService"'; New = 'from "@/features/problems/services/problemService"'},
    @{Old = 'from "../../services/problemService"'; New = 'from "@/features/problems/services/problemService"'},
    @{Old = 'from "../../../services/problemService"'; New = 'from "@/features/problems/services/problemService"'},
    @{Old = 'from "../services/authService"'; New = 'from "@/features/auth/services/authService"'},
    @{Old = 'from "../../services/authService"'; New = 'from "@/features/auth/services/authService"'},
    @{Old = 'from "../../../services/authService"'; New = 'from "@/features/auth/services/authService"'},
    @{Old = 'from "../services/progressService"'; New = 'from "@/store/progressService"'},
    @{Old = 'from "../../services/progressService"'; New = 'from "@/store/progressService"'},
    
    # Stores
    @{Old = 'from "../store/problemStore"'; New = 'from "@/features/problems/stores/problemStore"'},
    @{Old = 'from "../../store/problemStore"'; New = 'from "@/features/problems/stores/problemStore"'},
    @{Old = 'from "../../../store/problemStore"'; New = 'from "@/features/problems/stores/problemStore"'},
    @{Old = 'from "../store/userStore"'; New = 'from "@/store/userStore"'},
    @{Old = 'from "../../store/userStore"'; New = 'from "@/store/userStore"'},
    @{Old = 'from "../../../store/userStore"'; New = 'from "@/store/userStore"'}
)

$files = Get-ChildItem -Path "src" -Include *.tsx,*.ts -Recurse -File

$totalFiles = $files.Count
$processedFiles = 0
$modifiedFiles = 0

foreach ($file in $files) {
    $processedFiles++
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($replacement in $replacements) {
        $content = $content -replace [regex]::Escape($replacement.Old), $replacement.New
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $modifiedFiles++
        Write-Host "✓ Fixed: $($file.Name)" -ForegroundColor Green
    }
    
    if ($processedFiles % 10 -eq 0) {
        Write-Progress -Activity "Fixing imports" -Status "$processedFiles / $totalFiles files" -PercentComplete (($processedFiles / $totalFiles) * 100)
    }
}

Write-Progress -Activity "Fixing imports" -Completed
Write-Host "`n✅ Done! Modified $modifiedFiles out of $totalFiles files" -ForegroundColor Cyan
Write-Host "⚠️  Please review the changes and test the application." -ForegroundColor Yellow
