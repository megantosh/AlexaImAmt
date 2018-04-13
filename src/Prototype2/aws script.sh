#!/bin/bash
aws lambda create-function \ #all params mandatory
--function-name "fromCLI" \ #replace with new name
--runtime "nodejs6.10" \ #python or java ok too
--handler "index.handler" \ #index.js handler method
--role "arn:aws:iam::465576902433:role/lambda_basic_execution" \ # find in IAM/Roles 
--zip-file "fileb:///Users/mghd/Cloud/Dropbox/Uni/TU/WiInf, BSc/Modulen/1-SoSe 17/1-Thesis/Tutorials/alexa-app-server/examples/apps/faa-info.zip" # accepts ./{path from home folder}
# --timeout, otherwise your AWS credit can be eaten up

# in order for the above to run, you need to have AWS CLI set up and configured on your machine
# also set up IAM roles and generate key pair in aws config

# i created 1 group (AdminWBass) and 2 users (mega, andreas)

# https://developer.amazon.com/post/Tx1UE9W1NQ0GYII/Publishing-Your-Skill-Code-to-Lambda-via-the-Command-Line-Interface  
# and https://www.youtube.com/watch?v=abv_1PiM40w and https://youtu.be/3BlXU2zEzvY

# amazon docmentation for Lambda in CLI: 
# https://docs.aws.amazon.com/cli/latest/reference/lambda/create-function.html



  update-function-code
--function-name <value>
[--zip-file <value>]

https://docs.aws.amazon.com/cli/latest/reference/lambda/update-function-code.html



bind it to alexa skills kit

aws --region us-east-1 lambda add-permission \	# lambda is only on US East (Virginia Server)

--function-name FUNCTIONAME \		# already existing (as above)
--statement-id "1234" \				# unique statement identifier
--action "lambda:InvokeFunction" \	# Lambda  action  you  want to allow in this statement. 
									# Each action is a string with 'lambda:'' followed by API name.
									# Use wildcard to grant permission for all actions.
--principal "alexa-appkit.amazon.com"

# https://stackoverflow.com/questions/39492222/how-to-set-a-aws-lambda-trigger-to-alexa-skills-programatically/39514119#39514119
# https://forums.developer.amazon.com/questions/34262/is-it-possible-to-connect-alexa-skill-to-lambda-fu.html

# to set one function to call one alexa skill read here:
# https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-an-aws-lambda-function.html#configuring-the-alexa-skills-kit-trigger



aws lambda get-function-configuration --function-name fromCLI # returns a JSON Obj including ARN Name
# e.g.: "FunctionArn": "arn:aws:lambda:us-east-1:465576902433:function:fromCLI"





# AWS complete for shell / fish. Is a bit slow, but works like a charm instead of having to 
# https://github.com/aws/aws-cli/issues/1079
complete --command aws --no-files --arguments '(begin; set --local --export COMP_SHELL fish; set --local --export COMP_LINE (commandline); aws_completer | sed \'s/ $//\'; end)'


zip [-options] [-b path] [-t mmddyyyy] [-n suffixes] [zipfile list] [-xi list]
zip certain files



install ask-cli: node install -g ask-cli
give permissions with ask-init

Sign in was successful. Close this browser and return to the command line interface.
http://127.0.0.1:9090/cb?code=ANKpCxmqrkoeALFafSBw&scope=alexa%3A%3Aask%3Askills%3Areadwrite+alexa%3A%3Aask%3Amodels%3Areadwrite+alexa%3A%3Aask%3Askills%3Atest&state=Ask-SkillModel-ReadWrite





json for the interaction model
https://developer.amazon.com/docs/smapi/interaction-model-schema.html



#install the ask-cli package on ur computer (globally)
npm install -g ask-cli
nmp install --update