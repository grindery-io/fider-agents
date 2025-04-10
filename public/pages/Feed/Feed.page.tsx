import "react-activity-feed/dist/index.css"
import "./Feed.page.scss"

import React, { useEffect } from "react"
import { Header } from "@fider/components"
import { Activity, ActivityFooter, ActivityHeader, ActivityProps, FlatFeed, StreamApp, useStreamContext } from "react-activity-feed"
import { StreamUser } from "getstream"

export interface FeedPageProps {
  feedToken: string
  feedApiKey: string
  feedAppId: string
  userId: string
}

export interface FeedPageState {
  title: string
}

const FeedPage = (props: FeedPageProps) => {
  return (
    <StreamApp apiKey={props.feedApiKey} appId={props.feedAppId} token={props.feedToken}>
      <Header />
      <div id="p-feed" className="page container">
        <div className="p-feed__content p-4">
          <p>
            <strong>Activity Feed</strong>
          </p>
          <FlatFeed
            userId="global"
            feedGroup="user"
            options={{
              withOwnReactions: true,
              withReactionCounts: true,
              withRecentReactions: true,
            }}
            Activity={(props) => <Activity {...props} Footer={<ActivityFooter {...props} />} Header={<CustomActivityHeader {...props} />} />}
            notify
          />
        </div>
      </div>
    </StreamApp>
  )
}

const CustomActivityHeader = (props: ActivityProps) => {
  console.log("props", props)

  const [user, setUser] = React.useState<StreamUser | null>(null)
  const streamContext = useStreamContext()

  const activity = {
    ...props.activity,
    actor: user || props.activity.actor,
  }

  useEffect(() => {
    if (!user && typeof props.activity?.actor === "string") {
      const actorId = props.activity?.actor.split(":")[1]
      streamContext.client
        ?.user?.(actorId)
        ?.get()
        .then((response) => {
          // @ts-ignore
          setUser({ ...response, data: { ...response.data, name: response.data.username || response.data.name || "Grindery User" } })
        })
        .catch((error) => {
          console.error("Error fetching user:", error)
          setUser(null)
        })
    }
  }, [user])

  // @ts-ignore
  return <ActivityHeader {...props} activity={activity} />
}

export default FeedPage
