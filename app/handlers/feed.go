package handlers

import (
	"errors"
	"net/http"
	"strings"

	"github.com/GetStream/stream-go2/v8"
	"github.com/getfider/fider/app/pkg/web"
)

// Feed is the activity feed page
func Feed() web.HandlerFunc {
	return func(c *web.Context) error {
		tenant := c.Tenant()
		apiKey := tenant.FeedApiKey
		apiSecret := tenant.FeedApiSecret
		appId := tenant.FeedAppId

		if apiKey == "" || apiSecret == "" {
			return c.Failure(errors.New("missing GETSTREAM_API_KEY or GETSTREAM_API_SECRET environment variables"))
		}

		client, err := stream.New(apiKey, apiSecret)
		if err != nil {
			panic(err)
		}

		userEmail := c.User().Email
		parts := strings.Split(userEmail, "@")
		userId := parts[0]
		if userId == "" || len(parts) <= 0 {
			return c.Failure(errors.New("invalid email address"))
		}

		feedToken, err := client.CreateUserToken(userId)
		if err != nil {
			return c.Failure(err)
		}

		return c.Page(http.StatusOK, web.Props{
			Page:        "Feed/Feed.page",
			Description: "Feed · Fider",
			Data: web.Map{
				"feedApiKey": apiKey,    // API key for the feed
				"feedAppId":  appId,     // App ID for the feed
				"feedToken":  feedToken, // Auth token for the user feed to be used on the client side,
				"userId":     userId,    // User ID for the feed

			},
		})
	}
}
