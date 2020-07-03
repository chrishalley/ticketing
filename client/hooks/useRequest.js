
import { useState } from 'react'
import axios from 'axios'

export default ({ method, url, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async (props = {}) => {
    try {
      setErrors(null)
      const response = await axios[method](url, {
        ...body,
        ...props
      });

      if (onSuccess) {
        onSuccess(response.data)
      }
      
      return
    } catch (e) {
      console.log({e})
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops!</h4>
          <ul className="my-0">
            {e.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return { doRequest, errors }
}