export function make_sure_all_env_vars_are_set() {
  const env_vars: string[] = [
    "PEPPER"
  ]
  let error_occured = false
  for (const env_var of env_vars) {
    if (process.env[env_var] === undefined) {
      process.stderr.write(`Environment variable ${env_var} is not set\n`)
      error_occured = true
    }
  }
  if (error_occured) process.exit(1)
}
