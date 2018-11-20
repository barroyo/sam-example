# Serverless Application Model (SAM) Example

This is a basic CRUD example adapted from Pluralsight course by Mark Hatch https://app.pluralsight.com/library/courses/aws-deploying-serverless-applications-application-model/

## Requirements

- aws cli
- npm
- node 8.10

## Installation

1. `npm install`

2. Configure your AWS profile

## Usage

1. First you need to pack the function

```
aws cloudformation package --template-file sam-template.yaml --s3-bucket <s3-bucket-where-to-deploy> --output-template-file sam-template-1.yaml --profile <yourawsfrofile>
```

2. Then you have to deploy it. Node that this command uses the generated sam-template after the package command

```
aws cloudformation deploy --template-file sam-template-1.yaml --stack-name <name-for-your-app> --profile <yourawsfrofile> --capabilities CAPABILITY_IAM
```

### Other commands

- To get the existent apis:

```
aws apigateway get-rest-apis --profile <yourawsfrofile>
```

- To get the resources, this one uses the id returned in the previous command

```
aws apigateway get-resources --rest-api-id <id> --profile <yourawsfrofile>
```

- Copy a file into s3 bucket

```
aws s3 cp <file-path> s3://<bucket-name>
```
