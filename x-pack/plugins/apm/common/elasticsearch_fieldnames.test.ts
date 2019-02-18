/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { get } from 'lodash';
import { APMError } from '../typings/es_schemas/Error';
import { Span } from '../typings/es_schemas/Span';
import { Transaction } from '../typings/es_schemas/Transaction';
import * as fieldnames from './elasticsearch_fieldnames';

describe('Transaction', () => {
  const transaction: Transaction = {
    '@timestamp': new Date().toString(),
    agent: {
      name: 'agent name',
      version: 'agent version'
    },
    http: {
      request: { method: 'GET' },
      response: { status_code: 200 }
    },
    url: { full: 'http://www.elastic.co' },
    service: {
      name: 'service name',
      language: { name: 'nodejs', version: 'v1337' }
    },
    host: { hostname: 'my hostname' },
    processor: { name: 'transaction', event: 'transaction' },
    timestamp: { us: 1337 },
    trace: { id: 'trace id' },
    user: { id: '1337' },
    parent: {
      id: 'parentId'
    },
    transaction: {
      duration: { us: 1337 },
      id: 'transaction id',
      name: 'transaction name',
      result: 'transaction result',
      sampled: true,
      type: 'transaction type'
    },
    kubernetes: {
      pod: {
        uid: 'pod1234567890abcdef'
      }
    },
    container: {
      id: 'container1234567890abcdef'
    }
  };

  matchSnapshot(transaction);
});

describe('Span', () => {
  const span: Span = {
    '@timestamp': new Date().toString(),
    agent: {
      name: 'agent name',
      version: 'agent version'
    },
    processor: {
      name: 'transaction',
      event: 'span'
    },
    timestamp: {
      us: 1337
    },
    trace: {
      id: 'trace id'
    },
    service: {
      name: 'service name'
    },
    context: {
      db: {
        statement: 'db statement'
      }
    },
    parent: {
      id: 'parentId'
    },
    span: {
      action: 'my action',
      duration: { us: 1337 },
      id: 'span id',
      name: 'span name',
      subtype: 'my subtype',
      sync: false,
      type: 'span type'
    },
    transaction: {
      id: 'transaction id'
    }
  };

  matchSnapshot(span);
});

describe('Error', () => {
  const errorDoc: APMError = {
    agent: {
      name: 'agent name',
      version: 'agent version'
    },
    error: {
      exception: [
        {
          module: 'errors',
          handled: false,
          message: 'sonic boom',
          type: 'errorString'
        }
      ],
      culprit: 'handleOopsie',
      id: 'error id',
      grouping_key: 'grouping key'
    },
    '@timestamp': new Date().toString(),
    host: {
      hostname: 'my hostname'
    },
    processor: {
      name: 'error',
      event: 'error'
    },
    timestamp: {
      us: 1337
    },
    trace: {
      id: 'trace id'
    },
    service: {
      name: 'service name',
      language: {
        name: 'nodejs',
        version: 'v1337'
      }
    },
    context: {},
    parent: {
      id: 'parentId'
    },
    transaction: {
      id: 'transaction id'
    }
  };

  matchSnapshot(errorDoc);
});

function matchSnapshot(obj: Span | Transaction | APMError) {
  Object.entries(fieldnames).forEach(([key, longKey]) => {
    const value = get(obj, longKey);
    it(key, () => {
      expect(value).toMatchSnapshot();
    });
  });
}