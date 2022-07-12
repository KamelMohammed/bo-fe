def remote = [:]
remote.allowAnyHosts = true

node {
  def app
  def tag
  def registry
  def appName = "fidcare"
  def args

  stage('Clone repository') {
    checkout scm
  }

  stage('Build') {
    if (env.BRANCH_NAME == 'master') {
      sh "echo Building for dev"
      tag = "dev"
      remote.name = 'dev'
      remote.host = 'kirasrvfidcaresvil.kiranet.local'
      args = '--build-arg BUILD_ENVIRONMENT=dev'
      registry = 'http://kirasrvnexus.kiranet.local:8284'
    } else if (env.BRANCH_NAME == 'test') {
      sh "echo Building for test"
      tag = "itt"
      remote.name = 'test'
      remote.host = 'kirasrvfidcaretest.kiranet.local'
      args = '--build-arg BUILD_ENVIRONMENT=test'
      registry = 'http://kirasrvnexus.kiranet.local:8284'
    } else if (env.BRANCH_NAME == 'release') {
      sh "echo Building for Production"
      tag = "latest"
      remote.name = 'prod'
      remote.host = 'kirasrvfidcareprod.kiranet.local'
      args = '--build-arg BUILD_ENVIRONMENT=production'
      registry = 'http://kirasrvnexus.kiranet.local:8283'
    } else if (env.BRANCH_NAME == 'staging') {
      sh "echo Building for Staging"
      tag = "uat"
      remote.name = 'staging'
      remote.host = 'kirasrvfidcarestage.kiranet.local'
      args = '--build-arg BUILD_ENVIRONMENT=staging'
      registry = 'http://kirasrvnexus.kiranet.local:8284'
    }

    app = docker.build(appName, "${args} .")

    docker.withRegistry(registry, 'Nexus') {
      app.push("${env.BUILD_NUMBER}")
      app.push(tag)
    }
  }

  stage('Deploy dev') {
    if (env.BRANCH_NAME == 'master') {
      withCredentials([usernamePassword(credentialsId: 'deploy-dev-credentials', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
        remote.password = PASS
        remote.user = USER
        stage('Remote SSH') {
          sshCommand remote: remote, command: "./deployModule.sh " + appName
        }
      }
    }
  }

  stage('Deploy test') {
    if (env.BRANCH_NAME == 'test') {
      withCredentials([usernamePassword(credentialsId: 'deploy-test-credentials', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
        remote.password = PASS
        remote.user = USER
        stage('Remote SSH') {
          sshCommand remote: remote, command: "./deployModule.sh " + appName
        }
      }
    }
  }
  stage('Deploy staging') {
    if (env.BRANCH_NAME == 'staging') {
      withCredentials([usernamePassword(credentialsId: 'deploy-staging-credentials', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
        remote.password = PASS
        remote.user = USER
        stage('Remote SSH') {
          sshCommand remote: remote, command: "./deployModule.sh " + appName
        }
      }
    }
  }

}
