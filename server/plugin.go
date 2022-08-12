package main

import (
	"fmt"
	"net/http"
	"path/filepath"
	"sync"

	"github.com/gorilla/mux"
	"github.com/mattermost/mattermost-server/v5/plugin"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin
	router *mux.Router

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration
}

func (p *Plugin) OnActivate() error {
	p.router = p.InitAPI()
	return nil
}

func (p *Plugin) InitAPI() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/", p.handleVersion).Methods(http.MethodGet)
	r.HandleFunc("/public", p.handlePublic).Methods(http.MethodGet)
	return r
}

// ServeHTTP demonstrates a plugin that handles HTTP requests by greeting the world.
func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	p.router.ServeHTTP(w, r)
}

func (p *Plugin) handleVersion(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "This is %s (%s) v%s", manifest.Name, manifest.Id, manifest.Version)
}

func (p *Plugin) handlePublic(w http.ResponseWriter, r *http.Request) {
	p.API.LogInfo("handlePublic", "request", fmt.Sprintf("%#v", r))
	bundlePath, err := p.API.GetBundlePath()
	if err != nil {
		p.API.LogWarn("failed to get bundle path", "error", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Cache-Control", "public, max-age=604800")
	http.ServeFile(w, r, filepath.Join(bundlePath, "app-bar-icon.png"))
}

// See https://developers.mattermost.com/extend/plugins/server/reference/
