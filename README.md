[![kaakaa](https://circleci.com/gh/kaakaa/mattermost-plugin-unreads.svg?style=svg)](https://circleci.com/gh/kaakaa/mattermost-plugin-unreads)

# Unreads Sidebar Plugin

This plugin subscribe and display unread messages in RHS.

## Development

```
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_USERNAME=admin
export MM_ADMIN_PASSWORD=password
make deploy
```

or with a [personal access token](https://docs.mattermost.com/developer/personal-access-tokens.html):

```
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_TOKEN=j44acwd8obn78cdcx7koid4jkr
make deploy
```

## LICENSE

[LICENSE](./LICENSE)
