##ASK-CLI
- error parsing the requested content  
Alexa Cookbook git issue


##Node
-document.getElementByClass is not a function  
https://stackoverflow.com/questions/7480496/document-getelementbyclass-is-not-a-function

### interesting modules:
- fetch: for requests
- requireJS: http://requirejs.org/docs/start.html#examples



## Alexa
## Lambda / cloudwatch
- [Error]: Building skill schema failed  - because the server problem eu-west-1 vs us-east-1

- Node.js getaddrinfo ENOTFOUND
  Ask Question - problem with building the url, slashes etc. TODO

- Make versions of your Lambda function
https://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases.html

- application id has to be correct and only one per lambda: amzn1.ask.skill.9c23a9d7-4b4e-4349-a7d6-d2ee05243a31 is for US, not EU.


## Alexa CLI
- Please specify device locale via command line parameter locale or environment variable - ASK_DEFAULT_DEVICE_LOCALE

## searches
- alexa define output based on locale
- splitting skill across two files
- javascript new instance of class  
https://stackoverflow.com/questions/1580863/javascript-how-to-create-a-new-instance-of-a-class-without-using-the-new-keywor



## Git
- Uploading that huge file, moving it around, then having a few commits  
 https://czettner.com/blog/15/07/16/deleting-big-files-git-history  
- ``git clean -n`` HEAD is only a preview  
   https://git-scm.com/docs/git-clean  
   - if uncommitted changes, stash them
   
## publishing the skill

Fixes Required

 The invocation name is not unique, we find same invocation name at skill amzn1.ask.skill.d0419579-2e8c-4030-a729-cfceffaa8ca6 on [en_US]. In the Build tab, go to the Invocation section for [en_US] to adjust the invocation name.
 A Detailed Description of the skill is missing for the de_DE locale. In the Launch tab, go to Skill Preview for de_DE to add a detailed description.
 A Detailed Description of the skill is missing for the fr_FR locale. In the Launch tab, go to Skill Preview for fr_FR to add a detailed description.
 A One Sentence Description of the skill is missing for the de_DE locale. In the Launch tab, go to Skill Preview for de_DE to add the skill description.
 A One Sentence Description of the skill is missing for the fr_FR locale. In the Launch tab, go to Skill Preview for fr_FR to add the skill description.
 An Example Phrase is missing for the fr_FR locale. In the Launch tab, go to Skill Preview for fr_FR to add example phrases.
 An Example Phrase is missing for the de_DE locale. In the Launch tab, go to Skill Preview for de_DE to add example phrases.
 A Large Skill Icon is missing for the fr_FR locale. In the Launch tab, go to Skill Preview for fr_FR to add a large skill icon.
 A Large Skill Icon is missing for the de_DE locale. In the Launch tab, go to Skill Preview for de_DE to add a large skill icon.
 A Small Skill Icon is missing for the fr_FR locale. In the Launch tab, go to Skill Preview for fr_FR to add a small skill icon.
 A Small Skill Icon is missing for the de_DE locale. In the Launch tab, go to Skill Preview for de_DE to add a small skill icon.