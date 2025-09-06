# Usage: .\set-vercel-env.ps1 <VERCEL_TOKEN> <PROJECT_ID>
param (
  [string]$token,
  [string]$projectId
)
$vars = @{
  # ========= Backend =========
  "MONGODB_URI"               = "mongodb://localhost:27017/ai-dashboard"
  "JWT_SECRET"                = "your-super-secret-jwt-key-change-this-in-production"
  "JWT_EXPIRES_IN"            = "7d"
  "OPENAI_API_KEY"            = "your-openai-api-key-here"
  "PORT"                      = "5005"
  "NODE_ENV"                  = "production"
  "ALLOWED_ORIGINS"           = "https://ai-powered-dashboard.vercel.app"
  "RATE_LIMIT_WINDOW_MS"      = "900000"
  "RATE_LIMIT_MAX_REQUESTS"   = "100"
  "MAX_FILE_SIZE"             = "10485760"
  "MAX_FILES_PER_REQUEST"     = "10"
  "LOG_LEVEL"                 = "info"
  "LOG_FILE"                  = "logs/app.log"
  "BCRYPT_ROUNDS"             = "12"
  "SESSION_SECRET"            = "your-session-secret-change-this"
  "SMTP_HOST"                 = "smtp.gmail.com"
  "SMTP_PORT"                 = "587"
  "SMTP_USER"                 = "your-email@gmail.com"
  "SMTP_PASS"                 = "your-app-password"
  "REDIS_URL"                 = "redis://localhost:6379"
  "SENTRY_DSN"                = "your-sentry-dsn-for-error-tracking"
  # ========= Frontend =========
  "VITE_API_BASE_URL"         = "https://ai-powered-dashboard.vercel.app"
  "VITE_API_TIMEOUT"          = "30000"
  "VITE_APP_NAME"             = "AI-Powered Dashboard"
  "VITE_APP_VERSION"          = "1.0.0"
  "VITE_APP_DESCRIPTION"      = "AI-Powered Analytics Dashboard"
  "VITE_ENABLE_PWA"           = "true"
  "VITE_ENABLE_ANALYTICS"     = "true"
  "VITE_ENABLE_AI_CHAT"       = "true"
  "VITE_DEV_MODE"             = "false"
  "VITE_DEBUG_MODE"           = "false"
  "VITE_SENTRY_DSN"           = "your-sentry-dsn-for-error-tracking"
  "VITE_GOOGLE_ANALYTICS_ID"  = "your-google-analytics-id"
  "VITE_DEFAULT_THEME"        = "light"
  "VITE_ENABLE_THEME_TOGGLE"  = "true"
  "VITE_ENABLE_LAZY_LOADING"  = "true"
  "VITE_CHUNK_SIZE_LIMIT"     = "1000000"
}

foreach ($key in $vars.Keys) {
    $value = $vars[$key]
    Write-Host "Adding $key…"
    $value | vercel env add $key production --token $token --yes
}