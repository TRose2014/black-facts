# Black Facts

## Description: Creating an app that users can sign up via email or phone number and receive facts based on African American history that was not taught in the classroom. Users will have the ability to select the frequency of receiving facts

## Technologies/Frameworks used:
 - AWS
  - Dynamo DB
  - API Gateway
  - SES/SQS (coming soon)
  - CloudWatch (coming soon)
  - AWS Amplify (coming soon)
- Serverless
- Node.js
- React.js (or Vue.js)

## User Stories

As a user I want to have a UI/main website where I can sign up via my email or phone number
As a user I want to receive a confirmation after I have signed up
As a user I want to select the frequency of when I receive facts
As a user I do want to receive the same fact back-to-back
As a user I want to view what the current day fact is on main website


As a admin I want to have a UI where I can do full CRUD operations on facts
As a admin I want to have protected routes so only authorized personel can access admin functionality on UI/main website
As a admin I want to protect API Gateway endpoints so not just anyone can create/delete facts
As a admin I want add AWS CloudWatch logs to API Gateway
As a admin I want deploy front end using AWS Amplify