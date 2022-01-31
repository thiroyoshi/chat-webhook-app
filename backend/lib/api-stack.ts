import { Construct } from 'constructs';
import {
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { 
  AssetCode, 
  Function, 
  Runtime 
} from "aws-cdk-lib/aws-lambda";
import {
  RestApi,
  LambdaIntegration,
  IResource,
  MockIntegration,
  PassthroughBehavior,
} from "aws-cdk-lib/aws-apigateway";
// import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Api Gateway 
    const api = new RestApi(this, "ChatMessagingApi", {
      restApiName: "Chat Messaging API",
    });

    // API Path: messages/
    const messages = api.root.addResource("messages");
    addCorsOptions(messages);

    // Lambda Integration for API Gateway
    const assetCodePath = "../lambda"
    const env = {
      PYTHONPATH: "/var/runtime:/var/task/pylibs",
    }

    // Lambda(Get Message)
    const getMessageLambda = new Function(this, "getMessage", {
      functionName: "ChatMessagingAPI-getMessage",
      description: "Get Message for Chat Messaging API",
      code: new AssetCode(assetCodePath),
      handler: "get_message.handler",
      runtime: Runtime.PYTHON_3_9,
      environment: env
    });
    const getMessageIntegration = new LambdaIntegration(getMessageLambda);
    messages.addMethod("GET", getMessageIntegration);

    // Lamdbda(Post Message)
    const postMessageLambda = new Function(this, "postMessage", {
      functionName: "ChatMessagingAPI-postMessage",
      description: "Post Message for Chat Messaging API",
      code: new AssetCode(assetCodePath),
      handler: "post_message.handler",
      runtime: Runtime.PYTHON_3_9,
      environment: env
    });
    const postMessageIntegration = new LambdaIntegration(postMessageLambda);
    messages.addMethod("POST", postMessageIntegration);

  }
}

// Options Method
export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod(
    "OPTIONS",
    new MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials":
              "'false'",
            "method.response.header.Access-Control-Allow-Methods":
              "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
}