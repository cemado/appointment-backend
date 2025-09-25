@echo off
echo ===================================
echo 🧪 TESTING AWS HEALTH ENDPOINTS
echo ===================================

echo.
echo 🔍 1. AWS Health Check:
echo.
curl -s http://localhost:3000/aws-health

echo.
echo.
echo ⚙️ 2. AWS Configuration:
echo.
curl -s http://localhost:3000/aws-config

echo.
echo.
echo 🌐 3. AWS Connectivity Test:
echo.
curl -s http://localhost:3000/aws-connectivity

echo.
echo.
echo ✅ Basic Health Check:
echo.
curl -s http://localhost:3000/hello

echo.
echo.
echo ===================================
echo 🎉 AWS Tests Completed!
echo ===================================
echo.
echo 💡 Tips:
echo - Check if all endpoints return status 200
echo - Verify AWS region and configuration
echo - Review any error messages above
echo.
pause