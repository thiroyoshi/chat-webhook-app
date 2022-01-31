import { Construct } from 'constructs';
import {
  Stack,
  StackProps,
  RemovalPolicy,
  Duration
} from 'aws-cdk-lib';
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cf from "aws-cdk-lib/aws-cloudfront";


export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const projcet_tag = "chat-webhook-app";

    // S3 Bucket
    const s3_webapp = new s3.Bucket(this, "webapp", {
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const oai = new cf.OriginAccessIdentity(this, "webapp-oai", {
      comment: projcet_tag
    });

    const bucket_policy_webapp = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "s3:GetObject"
      ],
      principals: [
        new iam.CanonicalUserPrincipal(
          oai.cloudFrontOriginAccessIdentityS3CanonicalUserId
        ),
      ],
      resources: [
        s3_webapp.bucketArn + "/*"
      ]
    });

    // CloudFront
    new cf.CloudFrontWebDistribution(this, "webapp-distribution", {
      viewerCertificate: {
        aliases: [],
        props: {
          cloudFrontDefaultCertificate: true,
        },
      },
      priceClass: cf.PriceClass.PRICE_CLASS_ALL,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: s3_webapp,
            originAccessIdentity: oai
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              minTtl: Duration.seconds(0),
              maxTtl: Duration.seconds(0),
              defaultTtl: Duration.seconds(0),
              pathPattern: "/*",
            }
          ]
        }
      ],
      errorConfigurations: [
        {
          errorCode: 403,
          responsePagePath: "/index.html",
          responseCode: 200,
          errorCachingMinTtl: 0
        },
        {
          errorCode: 404,
          responsePagePath: "/index.html",
          responseCode: 200,
          errorCachingMinTtl: 0
        }
      ]
    });

    // S3 Deployment(Must build WebApp before deployment)
    new s3Deploy.BucketDeployment(
      this,
      'deploy-webapp',
      {
        sources: [s3Deploy.Source.asset('../front/build')],
        destinationBucket: s3_webapp,
      }
    )

  }
}
