'use strict';

import {ensureMinLength, isBlank, toRFCDateTime} from '../utils';
import faker from 'faker';
import randexp from 'randexp';

const passwordSymbols = 'qwerty!@#$%^123456';

function emailSample() {
  return faker.internet.email().toLowerCase();
}

function passwordSample(min, max) {
  let res = faker.internet.password();
  if (min > res.length) {
    res += '_';
    res += ensureMinLength(passwordSymbols, min - res.length).substring(0, min - res.length);
  }
  return res;
}

function commonDateTimeSample(min, max, omitTime) {
  let res = toRFCDateTime(new Date(), omitTime, false);
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
  let res = ensureMinLength(faker.lorem.word(), min);
  if (max && res.length > max) {
    res = res.substring(0, max);
  }
  return res;
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
  let res = new randexp(pattern).gen();

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
    let format = !isBlank(schema.pattern) ? 'pattern' : schema.format || 'default';
    let sampler = stringFormats[format] || defaultSample;
    return sampler(schema.minLength | 0, schema.maxLength, schema.pattern);
}
