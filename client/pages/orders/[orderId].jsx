import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'

import useRequest from '../../hooks/useRequest'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })
  
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft()
    const interval = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return timeLeft > 0 ? (
    <div>
      {timeLeft} seconds until order expires
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        stripeKey="pk_test_Q2uIPat3JzdBlAYwytp9OcaG"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  ) : (
    <div>Order Expired</div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow