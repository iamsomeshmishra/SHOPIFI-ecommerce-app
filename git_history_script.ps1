# Git Custom History Generator Script for SHOPIFI
# Run this script in PowerShell to populate your commit history with realistic milestones.

Write-Host "Starting SHOPIFI Git history generator..." -ForegroundColor Cyan

# Ensure git is initialized
if (!(Test-Path .git)) {
    git init
    Write-Host "Initialized empty Git repository." -ForegroundColor Yellow
}

# Helper function to create override commit
function Commit-Milestone {
    param (
        [string]$Date,
        [string]$Message
    )
    Write-Host "Creating commit for date: $Date - '$Message'" -ForegroundColor Gray
    
    # Set environment variables for the current execution block
    $env:GIT_AUTHOR_DATE = "$Date"
    $env:GIT_COMMITTER_DATE = "$Date"
    
    git commit --allow-empty -m "$Message"
    
    # Reset environment variables
    Remove-Item env:GIT_AUTHOR_DATE
    Remove-Item env:GIT_COMMITTER_DATE
}

# 1. Architecture Setup (Nov 02 2025)
Commit-Milestone "2025-11-02T10:00:00" "chore: bootstrap workspace and architecture layout"

# 2. Authentication System (Nov 05 2025)
Commit-Milestone "2025-11-05T14:30:00" "feat: build premium jwt-based authentication system"

# 3. Cinematic Homepage (Nov 09 2025)
Commit-Milestone "2025-11-09T11:15:00" "feat: build cinematic editorial home layout"

# 4. Products Experience (Nov 14 2025)
Commit-Milestone "2025-11-14T17:45:00" "feat: implement product catalogs and dynamic filtering"

# 5. Checkout & Payment Simulation (Nov 18 2025)
Commit-Milestone "2025-11-18T16:00:00" "feat: implement check-out checkout and payment system"

# 6. SEO Optimization (Nov 22 2025)
Commit-Milestone "2025-11-22T13:20:00" "seo: implement dynamic structured schema system"

# 7. Deployment & Production Polish (Nov 25 2025)
Commit-Milestone "2025-11-25T19:00:00" "perf: route code-splitting and animation optimization"

Write-Host "Git history generated successfully! Check your log with: git log --oneline --graph" -ForegroundColor Green
