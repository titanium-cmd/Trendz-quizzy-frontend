
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useNavigate } from 'react-router';
import { notify } from 'reapop';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { User } from 'src/models/user';
import { createUserAccount } from 'src/store/auth/authService';
import { clearAuthState } from 'src/store/auth/authSlice';
import CreateAccountForm from './CreateAccountForm';

const CreateAccountPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, message } = useAppSelector((state) => state.auth)
  const [userInfo, setUserInfo] = useState<User>({
    email_address: '',
    password: '',
    confirm_password: '',
    username: ''
  })

  useEffect(() => {
    if (status === 'rejected') {
      dispatch(notify(message, 'error'))
    } else if (status === 'fulfilled') {
      dispatch(notify(message, 'success'))
      dispatch(clearAuthState());
      setTimeout(() => {
        navigate('/auth/login')
      }, 300);
    }
    // eslint-disable-next-line
  }, [status])

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { password, confirm_password, username, email_address } = userInfo;
    if (
      username.trim().length === 0
      && email_address.trim().length === 0
      && password.trim().length === 0
    ) {
      return dispatch(notify('All fields are required', 'error'))
    }
    if (password !== confirm_password) {
      return dispatch(notify('Passwords should match', 'error'))
    }
    dispatch(createUserAccount(userInfo))
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value })
  }

  return (
    <CreateAccountForm
      onSubmit={handleFormSubmit}
      info={userInfo}
      onChange={handleInputChange}
      status={status}
    />
  )
}

export default CreateAccountPage
