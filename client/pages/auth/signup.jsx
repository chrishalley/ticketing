import { useState } from 'react'
import Router from 'next/router'

import useRequest from '../../hooks/useRequest'

export default () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { doRequest, errors } = useRequest({ method: 'post', url: '/api/users/signup', body: { email, password }, onSuccess: () => Router.push('/') })

  const onSubmit = async e => {
    e.preventDefault()
    doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>signup</h1>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
}