/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { mount } from 'enzyme';
import * as React from 'react';
import { mountWithIntl } from 'test_utils/enzyme_helpers';

import { encodeIpv6 } from '../../lib/helpers';

import { GoogleLink, HostDetailsLink, IPDetailsLink, TotalVirusLink } from '.';

describe('Custom Links', () => {
  const hostId = '133fd7715f1d47979ce817ba0df10c6e';
  const hostName = 'Host Name';
  const ipv4 = '192.0.2.255';
  const ipv6 = '2001:db8:ffff:ffff:ffff:ffff:ffff:ffff';
  const ipv6Encoded = encodeIpv6(ipv6);

  describe('HostDetailsLink', () => {
    test('should render valid link to Host Details with hostId as the display text', () => {
      const wrapper = mount(<HostDetailsLink hostId={hostId} />);
      expect(wrapper.find('EuiLink').prop('href')).toEqual(
        `#/link-to/hosts/${encodeURIComponent(hostId)}`
      );
      expect(wrapper.text()).toEqual(hostId);
    });

    test('should render valid link to Host Details with child text as the display text', () => {
      const wrapper = mount(<HostDetailsLink hostId={hostId}>{hostName}</HostDetailsLink>);
      expect(wrapper.find('EuiLink').prop('href')).toEqual(
        `#/link-to/hosts/${encodeURIComponent(hostId)}`
      );
      expect(wrapper.text()).toEqual(hostName);
    });
  });

  describe('IPDetailsLink', () => {
    test('should render valid link to IP Details with ipv4 as the display text', () => {
      const wrapper = mount(<IPDetailsLink ip={ipv4} />);
      expect(wrapper.find('EuiLink').prop('href')).toEqual(
        `#/link-to/network/ip/${encodeURIComponent(ipv4)}`
      );
      expect(wrapper.text()).toEqual(ipv4);
    });

    test('should render valid link to IP Details with child text as the display text', () => {
      const wrapper = mount(<IPDetailsLink ip={ipv4}>{hostName}</IPDetailsLink>);
      expect(wrapper.find('EuiLink').prop('href')).toEqual(
        `#/link-to/network/ip/${encodeURIComponent(ipv4)}`
      );
      expect(wrapper.text()).toEqual(hostName);
    });

    test('should render valid link to IP Details with ipv6 as the display text', () => {
      const wrapper = mount(<IPDetailsLink ip={ipv6} />);
      expect(wrapper.find('EuiLink').prop('href')).toEqual(
        `#/link-to/network/ip/${encodeURIComponent(ipv6Encoded)}`
      );
      expect(wrapper.text()).toEqual(ipv6);
    });
  });

  describe('GoogleLink', () => {
    test('it renders text passed in as value', () => {
      const wrapper = mountWithIntl(
        <GoogleLink link={'http:/example.com/'}>{'Example Link'}</GoogleLink>
      );
      expect(wrapper.text()).toEqual('Example Link');
    });

    test('it renders props passed in as link', () => {
      const wrapper = mountWithIntl(
        <GoogleLink link={'http:/example.com/'}>{'Example Link'}</GoogleLink>
      );
      expect(wrapper.find('a').prop('href')).toEqual(
        'https://www.google.com/search?q=http:/example.com/'
      );
    });

    test("it encodes <script>alert('XSS')</script>", () => {
      const wrapper = mountWithIntl(
        <GoogleLink link={"http:/example.com?q=<script>alert('XSS')</script>"}>
          {'Example Link'}
        </GoogleLink>
      );
      expect(wrapper.find('a').prop('href')).toEqual(
        "https://www.google.com/search?q=http:/example.com?q=%3Cscript%3Ealert('XSS')%3C/script%3E"
      );
    });
  });

  describe('TotalVirusLink', () => {
    test('it renders sha passed in as value', () => {
      const wrapper = mountWithIntl(<TotalVirusLink link={'abc'}>{'Example Link'}</TotalVirusLink>);
      expect(wrapper.text()).toEqual('Example Link');
    });

    test('it renders sha passed in as link', () => {
      const wrapper = mountWithIntl(
        <TotalVirusLink link={'abc'}>{'Example Link'} </TotalVirusLink>
      );
      expect(wrapper.find('a').prop('href')).toEqual('https://www.virustotal.com/#/search/abc');
    });

    test("it encodes <script>alert('XSS')</script>", () => {
      const wrapper = mountWithIntl(
        <TotalVirusLink link={"<script>alert('XSS')</script>"}>{'Example Link'}</TotalVirusLink>
      );
      expect(wrapper.find('a').prop('href')).toEqual(
        "https://www.virustotal.com/#/search/%3Cscript%3Ealert('XSS')%3C/script%3E"
      );
    });
  });
});