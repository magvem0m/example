const { execSync } = require('child_process');

module.exports = {
  rules: {
    'task-number-prefix': [2, 'always']
  },

  plugins: [
    {
      rules: {
        'task-number-prefix': ({header}) => {
          const headHash = execSync('git rev-parse --abbrev-ref HEAD').toString()
          const prefix = /^[\w-]+\/(?<taskNumber>[a-z]+-\d+)/i.exec(headHash)?.groups.taskNumber

          // Check prefix in the header
          if(prefix) {
            return [header.startsWith(prefix), `Task number prefix should be "${prefix}"`]
          }

          // If no prefix found, skip the rule
          return [true, '']
        }
      }
    }
  ]
}