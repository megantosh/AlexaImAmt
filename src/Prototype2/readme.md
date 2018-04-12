About Alexa, AWS, IAM ..



The skill is associated with two servers:
- eu-west-1: Ireland (migrated)
- us-east-1: N. Virgina (default)

ask-cli hat viel rumgemeckert bevor es von US auf EU umzieht
dann musste ich eine Lambda Instanz erstellen (create function in EU)
und die mit dem Skill ID verlinken

- dementsprechend gibt es logs auf cloudwatch bei Ireland und N.Virginia.
- oben rechts wechseln