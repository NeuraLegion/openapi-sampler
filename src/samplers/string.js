'use strict';

import {ensureLength, toRFCDateTime} from '../utils';
import faker from 'faker';
import randexp from 'randexp';

function emailSample() {
  return faker.internet.email().toLowerCase();
}

function passwordSample(min, max) {
  return ensureLength(faker.internet.password(), min, max);
}

function commonDateTimeSample(min, max, omitTime) {
  const res = toRFCDateTime(new Date(), omitTime, false);

  if (res.length < min) {
    throw new Error(`Using minLength = ${min} is incorrect with format "date-time"`);
  }

  if (max && res.length > max) {
    throw new Error(`Using maxLength = ${max} is incorrect with format "date-time"`);
  }

  return res;
}

function dateTimeSample(min, max) {
  return commonDateTimeSample(min, max);
}

function dateSample(min, max) {
  return commonDateTimeSample(min, max, true);
}

function defaultSample(min, max) {
  return ensureLength(faker.lorem.word(), min, max);
}

function ipv4Sample() {
  return faker.internet.ip();
}

function ipv6Sample() {
  return faker.internet.ipv6();
}

function hostnameSample() {
  return faker.internet.domainName();
}

function uriSample() {
  return faker.internet.url();
}

function byteSample() {
  return Buffer.from(faker.lorem.word()).toString('base64');
}

function binarySample() {
  return Buffer.from(faker.lorem.word());
}

function uuidSample() {
  return faker.random.uuid();
}

function patternSample(min, max, pattern) {
  const res = new randexp(pattern).gen();

  if (res.length < min) {
    throw new Error(`Using minLength = ${min} is incorrect with pattern ${pattern}`);
  }

  if (max && res.length > max) {
    throw new Error(`Using maxLength = ${max} is incorrect with pattern ${pattern}`);
  }

  return res;
}

const stringFormats = {
  'email': emailSample,
  'password': passwordSample,
  'date-time': dateTimeSample,
  'date': dateSample,
  'ipv4': ipv4Sample,
  'ipv6': ipv6Sample,
  'hostname': hostnameSample,
  'uri': uriSample,
  'byte': byteSample,
  'binary': binarySample,
  'uuid': uuidSample,
  'pattern': patternSample,
  'default': defaultSample
};

export function sampleString(schema) {
  const format = schema.pattern ? 'pattern' : schema.format || 'default';
  const sampler = stringFormats[format] || defaultSample;
  return sampler(schema.minLength | 0, schema.maxLength, schema.pattern);
}
