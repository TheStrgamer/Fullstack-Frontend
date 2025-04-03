import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import LoginComponent from '@/components/LoginComponent.vue';

describe('LoginComponent', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(LoginComponent);
  });

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
    const link = wrapper.find('router-link[to="/register"]');
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe('Register');
    expect(link.attributes('to')).toBe('/register');
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
