#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import logging
from pylibs import requests

LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)

def handler(event, context):
    LOGGER.info(json.dumps(event))

    try:
        url = 'https://slack.com/api/conversations.history'
        LOGGER.info("url: %s" % url)
        headers = {
            "Authorization": "Bearer <YOUR API Token>"
        }
        payload = {
            "channel" : "<YOUR CHANNEL ID>",
        }
        resp = requests.get(url, headers=headers, params=payload)
        LOGGER.info(resp.text)
        LOGGER.info(json.dumps(resp.json()))
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps(resp.json())
        }
    except Exception as ex:
        LOGGER.error(ex)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': 'failed to get message to slack'
        }
