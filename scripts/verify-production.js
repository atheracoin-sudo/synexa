#!/usr/bin/env node

/**
 * Production Readiness Verification Script
 * Checks for common deployment issues before pushing to production
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying production readiness...\n')

const checks = []
let hasErrors = false

// Check 1: Verify no hardcoded API keys
function checkForHardcodedKeys() {
  const files = [
    'app/api/chat/route.ts',
    'app/api/code/route.ts',
    'app/api/design/route.ts'
  ]
  
  let foundKeys = false
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8')
      if (content.includes('sk-') && !content.includes('process.env')) {
        console.error(`❌ Hardcoded API key found in ${file}`)
        foundKeys = true
        hasErrors = true
      }
    }
  })
  
  if (!foundKeys) {
    console.log('✅ No hardcoded API keys found')
  }
  
  checks.push({ name: 'API Key Security', passed: !foundKeys })
}

// Check 2: Verify .gitignore
function checkGitignore() {
  const gitignorePath = '.gitignore'
  if (!fs.existsSync(gitignorePath)) {
    console.error('❌ .gitignore file not found')
    hasErrors = true
    checks.push({ name: 'Gitignore', passed: false })
    return
  }
  
  const content = fs.readFileSync(gitignorePath, 'utf8')
  const requiredEntries = ['.env', '.env*.local', 'node_modules']
  const missing = requiredEntries.filter(entry => !content.includes(entry))
  
  if (missing.length > 0) {
    console.error(`❌ .gitignore missing entries: ${missing.join(', ')}`)
    hasErrors = true
    checks.push({ name: 'Gitignore', passed: false })
  } else {
    console.log('✅ .gitignore properly configured')
    checks.push({ name: 'Gitignore', passed: true })
  }
}

// Check 3: Verify package.json
function checkPackageJson() {
  const packagePath = 'package.json'
  if (!fs.existsSync(packagePath)) {
    console.error('❌ package.json not found')
    hasErrors = true
    checks.push({ name: 'Package.json', passed: false })
    return
  }
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  if (!pkg.scripts || !pkg.scripts.build) {
    console.error('❌ Build script not found in package.json')
    hasErrors = true
    checks.push({ name: 'Package.json', passed: false })
    return
  }
  
  if (!pkg.engines || !pkg.engines.node) {
    console.warn('⚠️  Node.js engine version not specified')
  }
  
  console.log('✅ package.json configuration valid')
  checks.push({ name: 'Package.json', passed: true })
}

// Check 4: Verify Vercel configuration
function checkVercelConfig() {
  const vercelPath = 'vercel.json'
  if (!fs.existsSync(vercelPath)) {
    console.warn('⚠️  vercel.json not found (optional)')
    checks.push({ name: 'Vercel Config', passed: true })
    return
  }
  
  const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'))
  
  if (config.functions && config.functions['app/api/**/*.ts']) {
    console.log('✅ API function timeout configured')
  }
  
  if (config.headers && config.headers.length > 0) {
    console.log('✅ Security headers configured')
  }
  
  checks.push({ name: 'Vercel Config', passed: true })
}

// Check 5: Verify environment variables usage
function checkEnvironmentVariables() {
  const envFiles = ['lib/config/environment.ts']
  let properlyConfigured = true
  
  envFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8')
      
      // Check for proper environment variable usage
      if (content.includes('process.env.OPENAI_API_KEY')) {
        console.log('✅ OPENAI_API_KEY properly referenced')
      }
      
      // Check for production-safe defaults
      if (content.includes('IS_PRODUCTION') && content.includes('localhost')) {
        console.log('✅ Environment-aware URLs configured')
      }
    }
  })
  
  checks.push({ name: 'Environment Variables', passed: properlyConfigured })
}

// Check 6: Verify no .env files in repo
function checkEnvFiles() {
  const envFiles = ['.env', '.env.local', '.env.production']
  const foundEnvFiles = envFiles.filter(file => fs.existsSync(file))
  
  if (foundEnvFiles.length > 0) {
    console.error(`❌ Environment files found in repo: ${foundEnvFiles.join(', ')}`)
    console.error('   These should be in .gitignore and not committed')
    hasErrors = true
    checks.push({ name: 'Environment Files', passed: false })
  } else {
    console.log('✅ No environment files in repository')
    checks.push({ name: 'Environment Files', passed: true })
  }
}

// Run all checks
checkForHardcodedKeys()
checkGitignore()
checkPackageJson()
checkVercelConfig()
checkEnvironmentVariables()
checkEnvFiles()

// Summary
console.log('\n📊 Production Readiness Summary:')
console.log('================================')

checks.forEach(check => {
  const status = check.passed ? '✅' : '❌'
  console.log(`${status} ${check.name}`)
})

const passedChecks = checks.filter(c => c.passed).length
const totalChecks = checks.length

console.log(`\n${passedChecks}/${totalChecks} checks passed`)

if (hasErrors) {
  console.log('\n❌ Production deployment not recommended')
  console.log('Please fix the issues above before deploying')
  process.exit(1)
} else {
  console.log('\n🚀 Ready for production deployment!')
  console.log('\nNext steps:')
  console.log('1. git add .')
  console.log('2. git commit -m "Deploy: Production ready"')
  console.log('3. git push origin main')
  console.log('4. Set OPENAI_API_KEY in Vercel dashboard')
  console.log('5. Trigger Vercel deployment')
}