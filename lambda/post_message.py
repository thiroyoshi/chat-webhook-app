#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import logging
from pylibs import requests

LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)

def handler(event, context):
    LOGGER.info(json.dumps(event))

    # Get the message from the event
    body_json = event.get('body')
    if body_json is not None:
        body = json.loads(body_json)
    else:
        body = None

    if body is not None:
        message = body.get('message')
    else:
        return {
            'statusCode': 500,
            'body': 'failed : body is None or message is not found'
        }        

    try:
        url = '<YOUR INCOMING WEBHOOK URL>'
        LOGGER.info("url: %s" % url)
        headers = {"Content-type": "application/json"}
        payload = {"text": message}
        resp = requests.post(url, headers=headers, data=json.dumps(payload))
        LOGGER.info(resp.text)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': 'success'
        }
    except Exception as ex:
        LOGGER.error(ex)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': 'failed to post message to slack'
        }
