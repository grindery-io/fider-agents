ALTER TABLE tenants ADD isFeedEnabled BOOLEAN default false;
ALTER TABLE tenants ADD feedAppId varchar(200) NOT NULL DEFAULT '';
ALTER TABLE tenants ADD feedApiKey varchar(200) NOT NULL DEFAULT '';
ALTER TABLE tenants ADD feedApiSecret varchar(200) NOT NULL DEFAULT '';