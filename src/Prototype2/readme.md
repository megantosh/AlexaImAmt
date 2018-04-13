

## Lambda 
The skill is associated with two servers:
- eu-west-1: Ireland (migrated)
- us-east-1: N. Virgina (default)

ask-cli hat viel rumgemeckert bevor es von US auf EU umzieht
dann musste ich eine Lambda Instanz erstellen (create function in EU)
und die mit dem Skill ID verlinken

- dementsprechend gibt es logs auf cloudwatch bei Ireland und N.Virginia.
- oben rechts wechseln

## AWS
rootkeys give access to everywhere and are stored on my ASK-CLI profile.
will not be uploaded on git for security reasons.
Instead, using IAM is preferred. I just used this as a "Master password"
in order not to bother with the Account management etc.


## IAM

New role created: verynewEURoleIreland
with template: none, since amazon changed them AGAIN!



## IDE
In IntelliJ IDEA, to get the right syntax interpreter, 
make sure to activate ES6 features. You do so by going to **Preferences > Languages and Frameworks > JavaScript** 
and select ECMAScript6 from the drop-down menu. I would go for the ckeck
at prefer 'strict' mode (it's probably like 'use-strict').

It might be necessary to create a Node module /project
on the root folder. goto **File > Project Structure > Modules > + > create it**
then 
goto **File > Project Structure > Modules > Add Content Root**


##URLs

https://service.berlin.de/standorte/

https://service.berlin.de/dienstleistungen/

https://service.berlin.de/behoerden/

## License
TODO: Agree on a license code from:
https://spdx.org/licenses/

#Manifest
TODO: put samples etc

## Git
git clean -n is only a preview