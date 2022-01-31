#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/backend-stack';
import { APIStack } from '../lib/api-stack';

const app = new cdk.App();
new BackendStack(app, 'BackendStack', {
  env: { account: '863502068293', region: 'ap-northeast-1' },
});
new APIStack(app, 'APIStack', {
  env: { account: '863502068293', region: 'ap-northeast-1' },
});
