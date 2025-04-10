alter table tenants drop column isFeedEnabled;
alter table tenants drop column feedAppId;
alter table tenants drop column feedApiKey;
alter table tenants drop column feedApiSecret;

ALTER TABLE tenants ADD is_feed_enabled BOOLEAN default false;
ALTER TABLE tenants ADD feed_app_id varchar(200) NOT NULL DEFAULT '';
ALTER TABLE tenants ADD feed_api_key varchar(200) NOT NULL DEFAULT '';
ALTER TABLE tenants ADD feed_api_secret varchar(200) NOT NULL DEFAULT '';