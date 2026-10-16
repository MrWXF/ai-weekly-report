@echo off
cd /d D:\project\test\showProject\ai-weekly-report

echo === Step 0: Set git user ===
git config user.name "MrWXF"
git config user.email "1249383313@qq.com"

echo === Step 1: Init git repo ===
git init

echo === Step 2: Add remote ===
git remote add origin https://github.com/MrWXF/ai-weekly-report.git || git remote set-url origin https://github.com/MrWXF/ai-weekly-report.git

echo === Step 3: Create .gitignore ===
echo node_modules/ > .gitignore
echo .next/ >> .gitignore
echo .env.local >> .gitignore

echo === Step 4: Add all files ===
git add -A

echo === Step 5: Commit ===
git commit -m "Initial commit: ai-weekly-report project"

echo === Step 6: Set branch to main ===
git branch -M main

echo === Step 7: Push to remote ===
git push -u origin main --force

echo === Done ===
pause
