import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginComponent from '@/components/LoginComponent.vue';
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios'


vi.mock('axios'); // for mock api responses

describe('LoginComponent', () => {

  it('form renders correct fields', () => {
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input#email').exists()).toBe(true);
    expect(wrapper.find('input#password').exists()).toBe(true);
  });

  it('form renders submit button', () => {
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toBe('Login');
  });

  it('link to register page exists', () => {
    expect(wrapper.find('a').exists()).toBe(true);
    expect(wrapper.find('a').text()).toBe('Register');
    expect(wrapper.find('a').attributes('href')).toBe('/register');
  });  

  it('email field gives valid feedback when input is wrong', async () => {
    await wrapper.setData({email: 'invalid-email'});
    await wrapper.vm.verifyField('email', 'email');
    expect(wrapper.vm.emailErrorMessage).toBe('Please enter a valid email');

    await wrapper.setData({ email: 'test@example.com' });
    await wrapper.vm.verifyField('email', 'email');
    expect(wrapper.vm.emailErrorMessage).toBe('');

    await wrapper.setData({email: 'invalid@email'});
    await wrapper.vm.verifyField('email', 'email');
    expect(wrapper.vm.emailErrorMessage).toBe('Please enter a valid email');

    await wrapper.setData({email: 'invalid.email'});
    await wrapper.vm.verifyField('email', 'email');
    expect(wrapper.vm.emailErrorMessage).toBe('Please enter a valid email');
  });

  it('password field gives valid feedback when input is wrong', async () => {
    await wrapper.setData({ password: '' });
    await wrapper.vm.verifyField('password', 'password');
    expect(wrapper.vm.passwordErrorMessage).toBe('Password must be at least 3 characters long');

    await wrapper.setData({ password: '12' });
    await wrapper.vm.verifyField('password', 'password');
    expect(wrapper.vm.passwordErrorMessage).toBe('Password must be at least 3 characters long');

    await wrapper.setData({ password: '1234' });
    await wrapper.vm.verifyField('password', 'password');
    expect(wrapper.vm.passwordErrorMessage).toBe('');
  });
});

describe('LoginComponent with mock API', () => {
  beforeEach(() => {
  });
  it('shows error message on failed login', async () => {
    //TODO mock api response and test
  });

  it('shows correct error message when no user found with email', async () => {
    //TODO mock api response and test
  });

  it('shows general error message when status 500 received', async () => {
    //TODO mock api response and test
  });

  it('shows network error message when request fails', async () => {
    //TODO mock api response and test
  });
});
