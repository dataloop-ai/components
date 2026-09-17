const { execSync } = require('child_process')

try {
    const result = execSync(
        'git grep -n -E "^(describe|it)\\.only" -- "*.ts" "*.js" "*.vue"',
        { encoding: 'utf8' }
    )
    if (result.trim()) {
        console.log(result.trim())
        console.error('Found .only in test files')
        process.exit(1)
    }
} catch (e) {
    // git grep exits with code 1 when no matches found - this is the success case
}
