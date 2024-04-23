package main

import (
	"context"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func (app *application) wrap(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		ctx := context.WithValue(r.Context(), "params", ps)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func (app *application) routes() http.Handler {
	router := httprouter.New()
	secure := alice.New(app.checkToken)

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)

	router.HandlerFunc(http.MethodPost, "/v1/signin", app.Signin)

	router.HandlerFunc(http.MethodGet, "/v1/file/:id", app.getOneFile)
	router.HandlerFunc(http.MethodGet, "/v1/files", app.getAllFiles)
	router.HandlerFunc(http.MethodGet, "/v1/files/:type_id", app.getAllFilesByType)

	router.HandlerFunc(http.MethodGet, "/v1/types", app.getAllTypes)

	router.POST("/v1/admin/editfile", app.wrap(secure.ThenFunc(app.editFile)))
	//router.HandlerFunc(http.MethodPost, "/v1/admin/editfile", app.editFile)

	router.GET("/v1/admin/deletemovie/:id", app.wrap(secure.ThenFunc(app.deleteFile)))
	router.HandlerFunc(http.MethodGet, "/v1/admin/deletefile/:id", app.deleteFile)

	return app.enableCORS(router)
}
