'use client'

import { revalidateOrders } from '@/actions/revalidate-orders'
import { PropsWithChildren, startTransition } from 'react'
import useSWRSubscription, { SWRSubscriptionOptions } from 'swr/subscription'

export function SyncOrders(props: PropsWithChildren<{ wallet_id: string }>) {
  const { data, error } = useSWRSubscription(
    `http://host.docker.internal:3000/wallets/${props.wallet_id}/orders/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path)

      eventSource.addEventListener('order-created', async (event) => {
        const orderCreated = JSON.parse(event.data)
        next(null, orderCreated)
        startTransition(() => {
          revalidateOrders(props.wallet_id)
        })
      })
      eventSource.addEventListener('order-updated', async (event) => {
        const orderUpdated = JSON.parse(event.data)
        next(null, orderUpdated)
        startTransition(() => {
          revalidateOrders(props.wallet_id)
        })
      })

      eventSource.onerror = (event) => {
        console.log('error:', event)
        eventSource.close()
        //@ts-ignore
        next(event.data, null)
      }
      return () => {
        console.log('close event source')
        eventSource.close()
      }
    }
  )
  return <>{props.children}</>
}
