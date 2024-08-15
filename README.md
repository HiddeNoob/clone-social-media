
**How To Run**

    > npm install
    > nodemon

## Deployment
i deploy the app with aws ec2 on ubuntu.
project will be a live on network for a while.
you can reach the live project [here](100.25.199.108)

## About App

user logins to app with jwt (Json Web Token, makes login safe with token), and gets all data from dynamoDB to show tweets.

## About Database

I use AWS API Gateway to save user resources, api sends data to lambda function, and lambda makes CRUD operations to dynomo DB and returns data.
## Preview
![preview photo](https://raw.githubusercontent.com/HiddeNoob/clone-social-media/master/preview.png?token=GHSAT0AAAAAACUEJTZXK2GTORSA2M2GWN6IZV5YCMQ)
