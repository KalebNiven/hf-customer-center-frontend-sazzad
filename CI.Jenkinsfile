
//The following logic below is to generate a unique id for the pipeline
def tnxID = UUID.randomUUID().toString()
/**
* HEALTHFIRST Jenkins Pipeline
*  NAME OF APPLICATION: React CI Pipeline
*  AUTHOR: Emma Howard

*  DATE:06-09-2020
*  APPLICATION OVERIVEW: CI pipeline for React
*  APPLICATION USAGE:
*  APPLICATION CONCERNS: 
*  VERSION: 1.0

*  SOURCE CONTROL LOCATION: https://github.healthfirst.org/Platform/pipeline-react

* PARAMETERS REQUIRED in Consul:
    CONSUL_cimodulesfolder = ""
    CONSUL_jenkinsModuleVersion = ""
    CONSUL_unitTestEnabled = ""
    CONSUL_jenkinsModuleRepo = ""
    CONSUL_artifactoryServer = ""
    CONSUL_notifyEmailAddr = ""
    CONSUL_isMajor = ""
    CONSUL_msteams_webhook_url = ""
    CONSUL_artifactoryDownloadUrl = "https://artifactory.healthfirst.org/artifactory/api/archive/download"
    CONSUL_snapshotRepo = "Null"
    CONSUL_gitCredsID = ""
    CONSUL_repocheckoutDir = "./app"
    CONSUL_lintingEnabled
    CONSUL_lintingRepoCheckoutDir
    CONSUL_appSpecificLintingEnabled - If the application has specific linting rules
    CONSUL_lintingGitRepoName = cde/react-lint
    CONSUL_standardLintingGitRepoBranch = master
    CONSUL_gitURL
    CONSUL_IACCommonReactFolderName
    CONSUL_IACCommonJinja2FolderName
    CONSUL_IACCommonName
    CONSUL_IACCommonReactVersion
    CONSUL_IACCommonJinjaVersion
    CONSUL_applicationType
    CONSUL_dapCredsID
    CONSUL_configConsulEnv
    CONSUL_configDAPSafeEnv
    CONSUL_configConsulServer
**/
import groovy.json.JsonSlurperClassic

def AppPlatform = "React"
def AppKvVersion = "v1.0.0"
def CommonAppKvVersion = "v1.0.0"
def EnvironmentVar = "CI"
def pipelineTimeout = "60"
def consulModuleVersion = "v2.3.0"
def jenkinsAgent = "React-NVM"
def consulEnvironment = "${JENKINS_INSTANCE}".toUpperCase()
def manifestGenModuleVersion = "v1.1.0"

pipeline{

    agent {
        kubernetes {
            yamlFile 'CI.pod.yaml'
            defaultContainer 'node-v20'
        }
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: "5"))
        timeout(time: "${pipelineTimeout}", unit: 'MINUTES')
    }
    environment{
        PIPELINE_tnxID = "${tnxID}"
        PIPELINE_Env = "${EnvironmentVar}"
        PIPELINE_AppPlatform = "${AppPlatform}"
        PIPELINE_AppKvVersion = "${AppKvVersion}"
        PIPELINE_CommonAppKvVersion = "${CommonAppKvVersion}"
        PIPELINE_ConsulEnvironment = "${consulEnvironment}"
        PIPELINE_ManifestGenModuleVersion = "${manifestGenModuleVersion}"
    }
    stages{
        stage('Get Dependencies'){
            steps{
                script{
                    /////////////////////Clean Workspace/////////////////////////////////
                    echo "Started workspace cleanup"
                    deleteDir()
                    echo "Ended workspace cleanup"
                    /////////////////////End Clean Workspace/////////////////////////////

                    // Get app name
                    env.PIPELINE_App = scm.getUserRemoteConfigs()[0].getUrl().tokenize('/')[3].split("\\.")[0]

                    echo env.PIPELINE_App

                    /////////////////////BEGIN Getting All Pipeline configuration from key/value store///////////////////////////
                    //Pull Consul Program
                    sh "wget https://artifactory.healthfirst.org/artifactory/IAC-PLATFORM-COMMON/Consul/${consulModuleVersion}/consulkv-to-groovy.py"
                    //Execute Python Program
                    sh "python consulkv-to-groovy.py --platform=${PIPELINE_AppPlatform} --app=Platform --env=${PIPELINE_Env} --output=./PlatformParams.groovy --ver=${PIPELINE_CommonAppKvVersion} --consulenv=${PIPELINE_ConsulEnvironment}"
                    sh "python consulkv-to-groovy.py --platform=SNOW --app=Platform --env=CONFIG --output=./SNOWParams.groovy --ver=v1.0 --consulenv ${PIPELINE_ConsulEnvironment}"

                    //Load PlatformParams.groovy
                    def platformParams = load 'PlatformParams.groovy'
                    def platformSpecificCodeCoverage = "${platformParams.CONSUL_codeCoverageThresholds}"
                    sh "python consulkv-to-groovy.py --platform=${PIPELINE_AppPlatform} --app=${env.PIPELINE_App} --env=${PIPELINE_Env} --output=./AppParams.groovy --ver=${PIPELINE_AppKvVersion} --consulenv=${PIPELINE_ConsulEnvironment}"
                    //Load AppParam.groovy
                    def appParams = load 'AppParams.groovy'
                    def appSpecificCodeCoverage = "${appParams.CONSUL_codeCoverageThresholds}"
                    def snowParam = load 'SNOWParams.groovy'

                    ////////////////////END Getting All Pipeline configuration from key/value store//////////////////////////////
                    //Setting Code Coverage
                    if(!appSpecificCodeCoverage.equals(platformSpecificCodeCoverage)){
                        overrideCodeCoverage(appSpecificCodeCoverage,platformSpecificCodeCoverage)
                        def codeCoverageThresholds = load 'codeCoverageThresholds.groovy'
                    }
                    println "Code Coverage Thresholds${CONSUL_codeCoverageThresholds}"
                    //////////////////// BEGIN Getting Jenkins modules////////////////////////////////////////////////////////////
                    echo "Get Dependencies"
                    sh "mkdir ${CONSUL_cimodulesfolder}"
                    getArtifactoryFolder("${CONSUL_jenkinsModuleRepo}/${CONSUL_jenkinsModuleVersion}/jenkins", "./${CONSUL_cimodulesfolder}/")
                    //////////////////// END Getting Jenkins Modules//////////////////////////////////////////////////////////////

                    // Get templating dependencies
                    // Make it be jinja2 folder in the path and react-config generator common folder in path -- 2 separate
                    getArtifactoryFolder("${CONSUL_IACCommonName}/${CONSUL_IACCommonJinja2FolderName}/${CONSUL_IACCommonJinjaVersion}", "./${CONSUL_cimodulesfolder}/")
                    getArtifactoryFolder("${CONSUL_IACCommonName}/${CONSUL_IACCommonReactFolderName}/${CONSUL_IACCommonReactVersion}", "./${CONSUL_cimodulesfolder}/")

                    // Get manifest generator
                    sh "wget https://artifactory.healthfirst.org/artifactory/IAC-PLATFORM-COMMON/Manifest/${PIPELINE_ManifestGenModuleVersion}/ManifestGenerator.py -O ./${CONSUL_cimodulesfolder}/ManifestGenerator.py"
                    sh "wget https://artifactory.healthfirst.org/artifactory/IAC-PLATFORM-COMMON/Manifest/${PIPELINE_ManifestGenModuleVersion}/Manifest.json -O ./${CONSUL_cimodulesfolder}/Manifest.json"

                    // Download Delete Sandbox
                    sh "wget  https://artifactory.healthfirst.org/artifactory/IAC-PLATFORM-COMMON/Veracode/${CONSUL_IACCommonVeracodeVersion}/deleteOldSandbox.py"
                    //Download SNOW Module 
                    getArtifactoryFolder("IAC-PLATFORM-COMMON/Snow/${SNOW_MODULE_VERSION}", "${CONSUL_cimodulesfolder}/")
                }
            }
            post{
                failure{
                    script{
                        echo "Pipeline Failed on Getting Dependencies"
                    }
                }
                aborted{
                    script{
                        echo "Pipeline Aborted on Getting Dependencies"
                    }
                }
            }
        }
        stage('Validate CI Package'){
            when {
                expression {CONSUL_nonJSONEnabled == "true"} 
            }
            steps{
                script{
                    def groovyLib = load "${CONSUL_cimodulesfolder}/snowModule.groovy"
                    sh "cp ${CONSUL_cimodulesfolder}/logging.groovy ."
 					groovyLib.verifyCI(SNOW_PACKAGE_NAME)
                }
            }
            post{
                always{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/snowModule.groovy"
                        groovyLib.always()
                    }
                }
                success{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/snowModule.groovy"
                        groovyLib.success()
                    }
                }
                failure{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/snowModule.groovy"
                        groovyLib.failure()
                    }
                }
                aborted{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/snowModule.groovy"
                        groovyLib.aborted()
                    }
                }

            }
        }
        stage('Checkout Application Repo'){
            steps{
                script{
                    echo "Checkout Application Repo" 
                    def groovyLib = load "${CONSUL_cimodulesfolder}/Checkout.groovy"
                    groovyLib.main()
                }
            }
            post{
                always{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Checkout.groovy"
                        groovyLib.always()
                    }
                }
                success{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Checkout.groovy"
                        groovyLib.success()
                    }
                }
                failure{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Checkout.groovy"
                        groovyLib.failure()
                    }
                }
                aborted{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Checkout.groovy"
                        groovyLib.aborted()
                    }
                }

            }
        }
        stage('Configure python Virtual Environment'){
            steps{
                script{
                    echo "Configure Python Virtual ENV" 
                    def groovyLib = load "${CONSUL_cimodulesfolder}/ConfigVenv.groovy"
                    groovyLib.main()
                }
            }
            post{
                always{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/ConfigVenv.groovy"
                        groovyLib.always()
                    }
                }
                success{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/ConfigVenv.groovy"
                        groovyLib.success()
                    }
                }
                failure{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/ConfigVenv.groovy"
                        groovyLib.failure()
                    }
                }
                aborted{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/ConfigVenv.groovy"
                        groovyLib.aborted()
                    }
                }

            }
        }
        stage('Prep DEV Env Files'){
            steps{
                script{
                    echo "Prep env file" 
                    def groovyLib = load "${CONSUL_cimodulesfolder}/PrepEnvFile.groovy"
                    groovyLib.main()
                }
            }
            post{
                always{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/PrepEnvFile.groovy"
                        groovyLib.always()
                    }
                }
                success{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/PrepEnvFile.groovy"
                        groovyLib.success()
                    }
                }
                failure{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/PrepEnvFile.groovy"
                        groovyLib.failure()
                    }
                }
                aborted{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/PrepEnvFile.groovy"
                        groovyLib.aborted()
                    }
                }

            }
        }
        stage('Linting'){
            
            when {
                expression {CONSUL_lintingEnabled == "true"} 
                anyOf{
                    branch "PR-*"
                    branch "develop"
                    branch "hotfix/*"
                    branch "rt"
                    branch "feature/*"
                }
            }

            steps{
                script{
                    echo "Linting"
                    def groovyLib = load "${CONSUL_cimodulesfolder}/Linting.groovy"
                    groovyLib.main()
                }
            }
            post{
                always{
                    script{
                        echo "Linting"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Linting.groovy"
                        groovyLib.always()
                    }
                }
                success{
                    script{
                        echo "Linting"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Linting.groovy"
                        groovyLib.success()
                    }
                }
                failure{
                    script{
                        echo "Linting"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Linting.groovy"
                        groovyLib.failure()
                    }
                }
                aborted{
                    script{
                        echo "Linting"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Linting.groovy"
                        groovyLib.aborted()
                    }
                }

            }
        }
        stage('Unit Test'){
            
            when {
                expression {CONSUL_unitTestEnabled == "true"} 
                anyOf{
                    branch "PR-*"
                    branch "develop"
                    branch "hotfix/*"
                    branch "rt"
                    branch "feature/*"
                }
            }

            steps{
                script{
                    echo "Unit Test"
                    def groovyLib = load "${CONSUL_cimodulesfolder}/UnitTest.groovy"
                    groovyLib.main()
                }
            }
            post{
                always{
                    script{
                        echo "Unit Test"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/UnitTest.groovy"
                        groovyLib.always()
                    }
                }
                success{
                    script{
                        echo "Unit Test"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/UnitTest.groovy"
                        groovyLib.success()
                    }
                }
                failure{
                    script{
                        echo "Unit Test"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/UnitTest.groovy"
                        groovyLib.failure()
                    }
                }
                aborted{
                    script{
                        echo "Unit Test"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/UnitTest.groovy"
                        groovyLib.aborted()
                    }
                }

            }
        }
        stage('Compile Application'){
            when {
                anyOf{
                    branch "develop"
                    branch "hotfix/*"
                    branch "rt"
                }
            }
            failFast true //Fail all stages if one fails
            parallel {
                stage('Build: DEV'){
                    when {
                        expression { CONSUL_multipleBuilds == "true" } 
                    }
                    steps{
                        script{
                            def groovyLib = load "${CONSUL_cimodulesfolder}/CompileApplication.groovy"
                            groovyLib.BuildAppPackage("DEV")
                        }
                    }
                }
                stage('Build: ST'){
                    when {
                        expression { CONSUL_multipleBuilds == "true" } 
                    }
                    steps{
                        script{
                            def groovyLib = load "${CONSUL_cimodulesfolder}/CompileApplication.groovy"
                            groovyLib.BuildAppPackage("ST")
                        }
                    }
                }
                stage('Build: RT'){
                    when {
                        expression { CONSUL_multipleBuilds == "true" } 
                    }
                    steps{
                        script{
                            def groovyLib = load "${CONSUL_cimodulesfolder}/CompileApplication.groovy"
                            groovyLib.BuildAppPackage("RT")
                        }
                    }
                }
                stage('Build: PROD'){
                    when {
                        expression { CONSUL_multipleBuilds == "true" } 
                    }
                    steps{
                        script{
                            def groovyLib = load "${CONSUL_cimodulesfolder}/CompileApplication.groovy"
                            groovyLib.BuildAppPackage("PROD")
                        }
                    }
                }
                stage('Build: HX'){
                    when {
                        allOf {
                            branch "hotfix/*"
                            expression { CONSUL_multipleBuilds == "true" }
                        }
                    }
                    steps{
                        script{
                            def groovyLib = load "${CONSUL_cimodulesfolder}/CompileApplication.groovy"
                            groovyLib.BuildAppPackage("HX")
                        }
                    }
                }
                stage('Build: SINGLE'){
                    when {
                        expression { CONSUL_multipleBuilds == "false" } 
                    }
                    steps{
                        script{
                            def groovyLib = load "${CONSUL_cimodulesfolder}/CompileApplication.groovy"
                            groovyLib.BuildAppPackage("SINGLE")
                        }
                    }
                }
            }
            post{
                always{
                    script{
                        echo "Compile Application"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/CompileApplication.groovy"
                        groovyLib.always()
                    }
                }
                success{
                    script{
                        echo "Compile Application"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/CompileApplication.groovy"
                        groovyLib.success()
                    }
                }
                failure{
                    script{
                        echo "Compile Application"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/CompileApplication.groovy"
                        groovyLib.failure()
                    }
                }
                aborted{
                    script{
                        echo "Compile Application"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/CompileApplication.groovy"
                        groovyLib.failure()
                    }
                }

            }
        }

        stage('Publish Application'){
            when {
                anyOf{
                    branch "develop"
                    branch "hotfix/*"
                    branch "rt"
                }
            }
            steps{
                script{
                    echo "Publish Application"
                    script{
                    echo "Publish Application Repo" 
                    def groovyLib = load "${CONSUL_cimodulesfolder}/PublishApp.groovy"
                    groovyLib.main()
                }
                }
            }
            post{
                always{
                    script{
                        echo "Publish Application"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/PublishApp.groovy"
                        groovyLib.always()
                    }
                }
                success{
                    script{
                        echo "Publish Application"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/PublishApp.groovy"
                        groovyLib.success()
                    }
                }
                failure{
                    script{
                        echo "Publish Application"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/PublishApp.groovy"
                        groovyLib.failure()
                    }
                }
                aborted{
                    script{
                        echo "Publish Application"
                        def groovyLib = load "${CONSUL_cimodulesfolder}/PublishApp.groovy"
                        groovyLib.aborted()
                    }
                }

            }
        }
        stage('Publish Manifest'){
            when {
                anyOf{
                    branch "develop"
                    branch "hotfix/*"
                    branch "rt"
                }
            }
            steps{
                script{
                    echo "Publish Manifest"
                }
            }
            post{
                always{
                    script{
                        echo "Publish Manifest"
                    }
                }
                success{
                    script{
                        echo "Publish Manifest"
                    }
                }
                failure{
                    script{
                        echo "Publish Manifest"
                    }
                }
                aborted{
                    script{
                        echo "Publish Manifest"
                    }
                }

            }
        }

        stage('Veracode Static Scan'){
            when{
                expression {env.CONSUL_VeracodeStaticEnabled == "true"}
                anyOf{
                    branch "develop"
                    branch "hotfix/*"
                    branch "rt"
                }
            }
            steps{
                script{
                    def groovyLib = load "${CONSUL_cimodulesfolder}/Veracode.groovy"
                    groovyLib.veracodeStaticScan()
                }
            }
            post{
                always{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Veracode.groovy"
                        groovyLib.always()
                    }
                }
                success{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Veracode.groovy"
                        groovyLib.success()
                    }
                }
                failure{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Veracode.groovy"
                        groovyLib.failure()
                    }
                }
                aborted{
                    script{
                        def groovyLib = load "${CONSUL_cimodulesfolder}/Veracode.groovy"
                        groovyLib.aborted()
                    }
                }

            }
        }
        stage("Deploy to Development"){ 
            when {
                    anyOf{
                    	branch "develop"
                    	}
                    expression { CONSUL_DeployToDev == "true" } 
                }
            steps{
                script{
                        //Deploy the application via the CD Pipeline
                        build job: 'Serverless/CD/CD', 
                        parameters: [string(name: 'ApplicationName', value: "${PIPELINE_App}"), 
                                    string(name: 'VersionNumber', value: "${PIPELINE_incrementtag}"), 
                                    string(name: 'AppEnv', value: 'DEV')], 
                        wait: false
                }
            }
            post {
                changed{
                    echo "changed"
                 }
                aborted{
                    echo "Deploying ${PIPELINE_App} application to Development aborted"
                }
                failure{
                    echo "Deploying ${PIPELINE_App} application to Development failed"
                }
                success{
                    echo "success"
                 }
                unstable{
                    echo "unstable"
                }
                notBuilt{
                    echo "notBuilt"
                }
            }

        }

    }
    post{
        always{
            script{
                def log = load "${CONSUL_cimodulesfolder}/logging.groovy"
                log.info("Removing the generated configs from the server")

                if(CONSUL_multipleBuilds == "true"){
                    removeConfigs("DEV")
                    removeConfigs("ST")
                    removeConfigs("RT")
                    removeConfigs("PROD")
                    removeConfigs("HX")
                    clearDependencies("DEV")
                    clearDependencies("ST") 
                    clearDependencies("RT") 
                    clearDependencies("PROD") 
                    clearDependencies("HX") 
                } else {
                    removeConfigs("SINGLE")
                    clearDependencies("SINGLE")
                }                
            }
        }
        success{
            script{
                echo "Post Success stage"
                //Send Notification via email
                def groovyLib = load "${CONSUL_cimodulesfolder}/email.groovy"
                def snowLib = load "${CONSUL_cimodulesfolder}/snowModule.groovy"
                echo SNOW_PACKAGE_NAME
                //echo PIPELINE_incrementtag
              
              	if ("${CONSUL_nonJSONEnabled}" == "true" ){
                      if ("${env.BRANCH_NAME}".toLowerCase() == "rt"){
                          snowLib.environmentSorter(SNOW_PACKAGE_NAME, PIPELINE_incrementtag, "ST", "false")
                      } else if(env.branch_name.contains("PR-")) {
                        println "Skipping servicenow check as this build is for PR branch"
                      } else{
                        snowLib.environmentSorter(SNOW_PACKAGE_NAME, PIPELINE_incrementtag, "DEV", "false")
                      }
                } else {
                    println "Skipping servicenow check as package is not onboarded to servicenow"
                }

                if (env.branch_name.contains("PR-")){
                    groovyLib.sendMail("${env.branch_name} SUCCESS for ${PIPELINE_App}", "${env.branch_name} success for ${env.PIPELINE_App}")
                }
                else{
                    groovyLib.sendMail("Pipeline ${currentBuild.currentResult} for ${PIPELINE_App}. here is the Transaction ID: ${PIPELINE_tnxID}", "CI Process was Sucessful for application: ${PIPELINE_App}. \n Your CI Build version is ${PIPELINE_incrementtag}. \n Here is the location for the deployable CI build: ${CONSUL_artifactoryServerUrl}${CONSUL_snapshotRepo}/${PIPELINE_App}/${PIPELINE_incrementtag}/${PIPELINE_App}.zip")
                }
                //send notification via msteams.
                def groovyLibMsteam = load "${CONSUL_cimodulesfolder}/msteams.groovy"
                groovyLibMsteam.success("Pipeline completed successfully for ${PIPELINE_App}")
            }
        }
        failure{
            script{
                //Send Notification via email
                def groovyLib = load "${CONSUL_cimodulesfolder}/email.groovy"
                if(!env.failureMessage){
                    env.failureMessage = "See log attached"
                } else if(env.failureMessage.contains("code coverage")) {
                    // If the pipeline failed on the Unit Test stage due to code coverage, send an email with the coverage reports attached
                    groovyLib.sendMailWithAttachments("Pipeline  " + currentBuild.currentResult + " for ${env.PIPELINE_App} on the Unit Test stage. here is the Transaction ID: ${env.PIPELINE_tnxID}",env.failureMessage,"**/${env.CONSUL_repocheckoutDir}/coverageReports.tar")
                } else if (env.branch_name.contains("PR-")){
                    groovyLib.sendMail("${env.branch_name} FAILED for ${PIPELINE_App}", "${env.branch_name} failure for ${env.PIPELINE_App}")
                } else {
                    // Otherwise, just send the normal email
                    groovyLib.sendMail("Pipeline ${currentBuild.currentResult} ${PIPELINE_App}. here is the Transaction ID: ${PIPELINE_tnxID}",failureMessage)
                }

                //send notification via msteams.
                def groovyLibMsteam = load "${CONSUL_cimodulesfolder}/msteams.groovy"
                groovyLibMsteam.failed("Pipeline completed Failed for ${PIPELINE_App}")
            }
        }

    }
}

public getArtifactoryFolder(path, target){
    echo "Downloading ${path} --> ${target}"
    rtDownload (
    serverId: "${CONSUL_artifactoryServer}",
    spec: """{
        "files": [
            {
            "pattern": "${path}/*",
            "target": "${target}",
            "flat": "true",
            "recursive": "true"
            }
        ]
    }"""
    )
}

public removeConfigs(env) {
    // Removes built configs from the server
    def log = load "${CONSUL_cimodulesfolder}/logging.groovy"

    try{
        def folder = ""
        if(env == "SINGLE"){
            folder = CONSUL_repocheckoutDir
        } else {
            folder = "${CONSUL_repocheckoutDir}-${env}"
        }
      
        dir(folder) {
            // If a hybrid app, remove config.json
            if(CONSUL_applicationType.toUpperCase() == "HYBRID") {
                // Check if file exists
                def configFileExists = fileExists "config.jinja2"
                // Remove file
                if(configFileExists) {
                    sh "rm config.json"
                }

            }

            // Always remove the .env.client
            def envFileExists = fileExists ".env.client"

            // Remove file
            if(envFileExists) {
                    sh "rm .env.client"
            }


        }
    } catch(Exception e){
        env.failureMessage = "ERROR removing the generated config files from the server: ${e}"
        log.severe(env.failureMessage)
        error(env.failureMessage)
        
    }

}

public clearDependencies(env){
    // Cleans out dependency folder (node_module) to preserve disk space on the machine
    def log = load "${CONSUL_cimodulesfolder}/logging.groovy"

    try {
        def folder = ""
        if(env == "SINGLE"){
            folder = CONSUL_repocheckoutDir
        } else {
            folder = "${CONSUL_repocheckoutDir}-${env}"
        }
        dir(folder) {
            if(fileExists("node_modules/")){
                sh "rm -rf node_modules/"
            }
        }
    } catch(Exception e){
        // This shouldn't be a fatal error. Just continue and end the pipeline.
        log.info("Couldn't clean up dependencies from the build folder.")
    }
    
}

public overrideCodeCoverage(appCodeCoverage,platformCodeCoverage){
    def appThresholdDict = parseJSONString(appCodeCoverage)
    def platformThresholdDict = parseJSONString(platformCodeCoverage)

    def statementThreshold,branchThreshold,functionThreshold,lineThreshold;

    statementThreshold = getLowerThreshold(appThresholdDict["Statements"],platformThresholdDict["Statements"])
    branchThreshold = getLowerThreshold(appThresholdDict["Branches"],platformThresholdDict["Branches"])
    functionThreshold = getLowerThreshold(appThresholdDict["Functions"],platformThresholdDict["Functions"])
    lineThreshold = getLowerThreshold(appThresholdDict["Lines"],platformThresholdDict["Lines"])

    println "Building new Code Coverage JSON Object"
    def json = """\"{\\"Statements\\":${statementThreshold},\\"Lines\\":${lineThreshold},\\"Branches\\":${branchThreshold},\\"Functions\\":${functionThreshold} }\""""
    writeFile file: 'codeCoverageThresholds.groovy', text: "env.CONSUL_codeCoverageThresholds = ${json}"


}

public getLowerThreshold(appThreshold,platformThreshold){
    return appThreshold < platformThreshold ? appThreshold : platformThreshold
}
public addReturnThisGroovy(fileName){
    //file.append('\nreturn this;')
    def readContent = readFile "${fileName}"
    writeFile file: "${fileName}", text: "$readContent \nreturn this;"

}

public parseJSONString(jsonString) {
    // Parses a JSON object into a map
    // PARAMS
    // jsonString - the JSON object
    // RETURNS
    // A map object
    try{
        def jsonSlurper = new JsonSlurperClassic()

        return jsonSlurper.parseText(jsonString)

    } catch(Exception e) {
        env.failureMessage("Error parsing the JSON string of coverage values from Consul into a map within function parseJSONString: ${e}")
        error(env.failureMessage)
    }
}
