# Deployment Guide

This guide provides instructions for deploying the application using Docker and outlines the necessary steps for running it on AWS.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your local machine.
- An [AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/) with the AWS CLI configured.

## Environment Variables

The application requires the `GEMINI_API_KEY` to be set in the environment where the container is running. This key is used to authenticate with the Google AI services.

When running the Docker container locally or on AWS, you must provide this environment variable.

## Building and Running the Docker Container

1. **Build the Docker Image**

   Open your terminal and run the following command from the project root to build the Docker image:

   ```bash
   docker build -t tangerine-health-app .
   ```

2. **Run the Docker Container**

   To run the container locally, execute the following command, replacing `your_gemini_api_key` with your actual key:

   ```bash
   docker run -p 3000:3000 -e GEMINI_API_KEY=your_gemini_api_key tangerine-health-app
   ```

   The application will be accessible at `http://localhost:3000`.

## Deploying to AWS

You can deploy the containerized application to various AWS services, such as **Amazon Elastic Container Service (ECS)** or **AWS Elastic Beanstalk**.

### Example: Deploying to ECS

1. **Push the Docker Image to Amazon ECR**

   First, create an ECR repository and push your Docker image to it.

   ```bash
   # Authenticate Docker to your ECR registry
   aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-aws-account-id.dkr.ecr.your-region.amazonaws.com

   # Tag your image
   docker tag tangerine-health-app:latest your-aws-account-id.dkr.ecr.your-region.amazonaws.com/tangerine-health-app:latest

   # Push the image
   docker push your-aws-account-id.dkr.ecr.your-region.amazonaws.com/tangerine-health-app:latest
   ```

2. **Create an ECS Task Definition**

   In the task definition, specify the Docker image from ECR and define the `GEMINI_API_KEY` as a secret or environment variable. It is highly recommended to use **AWS Secrets Manager** to handle sensitive data like API keys.

3. **Create an ECS Service**

   Launch a new service in your ECS cluster using the task definition you created. Configure the service to run your desired number of tasks and set up a load balancer to route traffic to your containers.

By following these steps, you can successfully deploy and run the application on AWS.