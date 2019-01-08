import PasswordChanger from './PasswordChanger.vue';

import VeeValidate from 'vee-validate';
import { createLocalVue, mount } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(VeeValidate);

declare const expect: jest.Expect;

describe('Password Changer', () => {

    it('is a Vue instance', () => {
        const wrapper = mount(PasswordChanger, { localVue });
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('snapshot has not changed', () => {
        const wrapper = mount(PasswordChanger, { localVue });
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('disabled prop disables all inputs', () => {
        const wrapper = mount(PasswordChanger, { localVue, propsData: { disabled: true } });
        expect(wrapper.find('#PasswordChanger #OldPassword').attributes().disabled).toEqual('disabled');
        expect(wrapper.find('#PasswordChanger #NewPassword').attributes().disabled).toEqual('disabled');
        expect(wrapper.find('#PasswordChanger #ConfirmedNewPassword').attributes().disabled).toEqual('disabled');
    });

    it('entering into old password input updates old password data', () => {
        const wrapper = mount(PasswordChanger, { localVue });
        const oldPassword = wrapper.find('#PasswordChanger #OldPassword');
        (oldPassword.element as HTMLInputElement).value = 'test123';
        oldPassword.trigger('input');
        expect(wrapper.vm.$data.oldPassword).toEqual('test123');
    });

    it('entering into new password input updates new password data', () => {
        const wrapper = mount(PasswordChanger, { localVue });
        const newPassword = wrapper.find('#PasswordChanger #NewPassword');
        (newPassword.element as HTMLInputElement).value = 'test123';
        newPassword.trigger('input');
        expect(wrapper.vm.$data.newPassword).toEqual('test123');
    });

    it('entering into confirm new password input updates confirm new password data', () => {
        const wrapper = mount(PasswordChanger, { localVue });
        const confirmedNewPassword = wrapper.find('#PasswordChanger #ConfirmedNewPassword');
        (confirmedNewPassword.element as HTMLInputElement).value = 'test123';
        confirmedNewPassword.trigger('input');
        expect(wrapper.vm.$data.confirmedNewPassword).toEqual('test123');
    });

    it('form submit with invalid inputs does not emit the password-change event', async() => {
        const wrapper = mount(PasswordChanger, { localVue });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted('password-change')).toBeFalsy();
    });

    it('form submit with valid inputs emits the password-change event', async() => {
        const wrapper = mount(PasswordChanger, { localVue });
        wrapper.setData({ oldPassword: 'test123', newPassword: 'test321', confirmedNewPassword: 'test321' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted('password-change')).toEqual([['test123', 'test321']]);
    });

    it('form submit with valid inputs and disabled prop does not emit the password-change event', async() => {
        const wrapper = mount(PasswordChanger, { localVue, propsData: { disabled: true } });
        wrapper.setData({ oldPassword: 'test123', newPassword: 'test321', confirmedNewPassword: 'test321' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted('password-change')).toBeFalsy();
    });

    it('reset button click resets all inputs', () => {
        const wrapper = mount(PasswordChanger, { localVue, propsData: { disabled: true } });
        wrapper.setData({ oldPassword: 'test123', newPassword: 'test321', confirmedNewPassword: 'test321' });
        wrapper.find('#PasswordChanger #PasswordChangerResetButton').trigger('click');
        expect(wrapper.vm.$data.oldPassword).toEqual('');
        expect(wrapper.vm.$data.newPassword).toEqual('');
        expect(wrapper.vm.$data.confirmedNewPassword).toEqual('');
    });

    it('old password is invalid with nothing entered', async() => {
        const wrapper = mount(PasswordChanger, { localVue });
        wrapper.setData({ oldPassword: '' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$validator.errors.first('old-password')).toEqual('The Old Password field is required.');
    });

    it('new password is invalid with nothing entered', async() => {
        const wrapper = mount(PasswordChanger, { localVue });
        wrapper.setData({ newPassword: '' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$validator.errors.first('new-password')).toEqual('The New Password field is required.');
    });

    it('confirmed new password is invalid with nothing entered', async() => {
        const wrapper = mount(PasswordChanger, { localVue });
        wrapper.setData({ confirmedNewPassword: '' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$validator.errors.first('confirmed-new-password')).toEqual('The Confirmed New Password field is required.');
    });

    it('new password is invalid with mismatching confirmed new password', async() => {
        const wrapper = mount(PasswordChanger, { localVue });
        wrapper.setData({ newPassword: 'test321', confirmedNewPassword: 'test123' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$validator.errors.first('new-password')).toEqual('The New Password confirmation does not match.');
    });

    it('confirmed new password is invalid with mismatching new password', async() => {
        const wrapper = mount(PasswordChanger, { localVue });
        wrapper.setData({ newPassword: 'test321', confirmedNewPassword: 'test123' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$validator.errors.first('confirmed-new-password')).toEqual('The Confirmed New Password confirmation does not match.');
    });

    it('adds a custom old-password-match validator to the old-password input', () => {
        const wrapper = mount(PasswordChanger, { localVue });
        const oldPassword = wrapper.vm.$validator.fields.find({ name: 'old-password' });
        expect(Object.keys(oldPassword.rules).some(key => key === 'old-password-match')).toBeTruthy();
    });

    it('old password is invalid with failing validation fn', async() => {
        const oldPasswordCheck = (value: string) => value === 'test123';
        const wrapper = mount(PasswordChanger, { localVue, propsData: { oldPasswordCheck } });
        wrapper.setData({ oldPassword: 'test321' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$validator.errors.first('old-password')).toEqual('The Old Password does not match current password.');
    });

    it('old password is valid with correct validation fn', async() => {
        const oldPasswordCheck = (value: string) => value === 'test123';
        const wrapper = mount(PasswordChanger, { localVue, propsData: { oldPasswordCheck } });
        wrapper.setData({ oldPassword: 'test123' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$validator.errors.first('old-password')).toBeNull();
    });

    it('old password is invalid with failing resolved async validation fn', async() => {
        const oldPasswordCheck = (value: string) => new Promise(resolve => {
            resolve(value === 'test123');
        });
        const wrapper = mount(PasswordChanger, { localVue, propsData: { oldPasswordCheck } });
        wrapper.setData({ oldPassword: 'test321' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$validator.errors.first('old-password')).toEqual('The Old Password does not match current password.');
    });

    it('old password is invalid with failing rejected async validation fn', async() => {
        const oldPasswordCheck = (value: string) => new Promise((resolve, reject) => {
            return value === 'test123' ? resolve(true) : reject();
        });
        const wrapper = mount(PasswordChanger, { localVue, propsData: { oldPasswordCheck } });
        wrapper.setData({ oldPassword: 'test321' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$validator.errors.first('old-password')).toEqual('The Old Password does not match current password.');
    });

    it('old password is valid with passing async validation fn', async() => {
        const oldPasswordCheck = (value: string) => new Promise((resolve, reject) => {
            return value === 'test123' ? resolve(true) : reject();
        });
        const wrapper = mount(PasswordChanger, { localVue, propsData: { oldPasswordCheck } });
        wrapper.setData({ oldPassword: 'test123' });
        wrapper.find('#PasswordChanger').trigger('submit');
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$validator.errors.first('old-password')).toBeNull();
    });

});
