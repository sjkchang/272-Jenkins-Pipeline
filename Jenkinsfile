pipeline {
    agent { 
        node {
            label 'docker-agent-alpine'
            }
      }
    triggers {
        pollSCM '* * * * *'
    }
    stages {
        stage('Setup') {
            steps {
                echo "Setting Up.."
                sh '''
                apk add nodejs npm
                '''
            }
        }
        stage('Build') {
            steps {
                echo "Building.."
                sh '''
                cd Restaurant-Monolith/Server
                npm install

                cd ../frontEnd
                '''*/
            }
        }
        stage('Test') {
            steps {
                echo "Testing.."
                sh '''
                echo "doing testing stuff.."
                cd Restaurant-Monolith/Server
                npm test
                
                ls
                '''
            }
        }
        stage('Deliver') {
            steps {
                echo 'Deliver....'
                sh '''
                echo "doing delivery stuff.."
                '''
            }
        }
    }
}