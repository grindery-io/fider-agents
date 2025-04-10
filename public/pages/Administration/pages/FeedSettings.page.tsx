import React from "react"

import { Form, Button, Input, Field, Toggle } from "@fider/components"
import { Failure, actions, Fider } from "@fider/services"
import { AdminBasePage } from "../components/AdminBasePage"

interface FeedSettingsPageProps {
  isFeedEnabled: boolean
  feedAppId: string
  feedApiKey: string
  feedApiSecret: string
}

interface FeedSettingsPageState {
  isFeedEnabled: boolean
  feedAppId: string
  feedApiKey: string
  feedApiSecret: string
  error?: Failure
}

export default class FeedSettingsPage extends AdminBasePage<FeedSettingsPageProps, FeedSettingsPageState> {
  public id = "p-admin-feed"
  public name = "feed"
  public title = "Feed"
  public subtitle = "Manage your activity feed settings"

  constructor(props: FeedSettingsPageProps) {
    super(props)

    this.state = {
      isFeedEnabled: props.isFeedEnabled,
      feedAppId: props.feedAppId || "",
      feedApiKey: props.feedApiKey || "",
      feedApiSecret: props.feedApiSecret || "",
    }
  }

  private handleSave = async (): Promise<void> => {
    const result = await actions.updateTenantFeedSettings({
      isFeedEnabled: this.state.isFeedEnabled,
      feedAppId: this.state.feedAppId,
      feedApiKey: this.state.feedApiKey,
      feedApiSecret: this.state.feedApiSecret,
    })
    if (result.ok) {
      location.reload()
    } else {
      this.setState({ error: result.error })
    }
  }

  public content() {
    return (
      <Form error={this.state.error}>
        <Field label="Enable feed" className="mt-2">
          <Toggle
            field="isFeedEnabled"
            label={this.state.isFeedEnabled ? "Yes" : "No"}
            disabled={!Fider.session.user.isAdministrator}
            active={this.state.isFeedEnabled}
            onToggle={(active) => {
              this.setState({ isFeedEnabled: active })
            }}
          />
          <p className="text-muted my-1">
            When enabled a "Feed" link will be added to the main navigation bar. This will allow users to view and interact with the activity feed.
          </p>
        </Field>
        {this.state.isFeedEnabled && (
          <>
            <p>App Credentials</p>
            <p className="text-muted">
              Go to{" "}
              <a href="https://dashboard.getstream.io" target="_blank" rel="noreferrer">
                GetStream Dashboard
              </a>{" "}
              to get your app credentials.
            </p>
            <Input
              field="feedAppId"
              label="App ID"
              value={this.state.feedAppId}
              onChange={(val) => {
                this.setState({ feedAppId: val })
              }}
            ></Input>
            <Input
              field="feedApiKey"
              label="API Key"
              value={this.state.feedApiKey}
              onChange={(val) => {
                this.setState({ feedApiKey: val })
              }}
            ></Input>
            <Input
              field="feedApiSecret"
              label="API Secret"
              value={this.state.feedApiSecret}
              onChange={(val) => {
                this.setState({ feedApiSecret: val })
              }}
            ></Input>
          </>
        )}

        {Fider.session.user.isAdministrator && (
          <div className="field">
            <Button variant="primary" onClick={this.handleSave}>
              Save
            </Button>
          </div>
        )}
      </Form>
    )
  }
}
