## Overview
Function to schedule activation of EC2

## How to use
1. Create IAM Role for Lambda
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:StartInstances"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

2. Create Lambda Function
  - Replace function.json with your IAM Role Arn
    ```
    git clone https://github.com/kazmsk/ec2-start.git
    cd ec2-start
    zip -r index.zip index.js
    aws lambda create-function --cli-input-json fileb://function.json \
    --zip-file fileb://index.zip
    ```

3. Create CloudWatch Events Rule for Lambda
  - Cron sample  
    `0 2 * * ? *` Run every day at 2:00 am (UTC)

4. Add EC2 Tag
  - Key : AutoStart
  - Value : true