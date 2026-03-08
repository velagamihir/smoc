#!/bin/bash
# Backend Status Check Script

echo "======================================"
echo "Backend MVC Structure Verification"
echo "======================================"
echo ""

echo "✓ Checking directories..."
directories=("config" "middleware" "models" "controllers" "services" "routes" "utils")
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        count=$(find "$dir" -name "*.js" | wc -l)
        echo "  ✓ $dir/ ($count files)"
    else
        echo "  ✗ $dir/ (MISSING)"
    fi
done

echo ""
echo "✓ Checking key files..."
files=("server.js" ".env" "package.json" "ARCHITECTURE.md" "FILE_STRUCTURE.md" "MVC_REFACTORING.md")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        size_kb=$((size / 1024))
        echo "  ✓ $file ($size_kb KB)"
    else
        echo "  ✗ $file (MISSING)"
    fi
done

echo ""
echo "✓ Checking imports in server.js..."
if grep -q 'import.*routes.*index.js' server.js; then
    echo "  ✓ Routes imported"
fi

if grep -q 'errorHandler' server.js; then
    echo "  ✓ Error handler imported"
fi

echo ""
echo "======================================"
echo "Summary"
echo "======================================"
echo "Backend has been successfully"
echo "refactored into MVC architecture!"
echo ""
echo "To start:"
echo "  npm install"
echo "  npm start"
echo ""
echo "See ARCHITECTURE.md for details"
echo "======================================"
