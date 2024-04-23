package main

import (
	"backend/models"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/julienschmidt/httprouter"
)

type jsonResp struct {
	OK      bool   `json:"ok"`
	Message string `json:"message"`
}

func (app *application) getOneFile(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.logger.Print(errors.New("invalid id parameter"))
		app.errorJSON(w, err)
		return
	}

	file, err := app.models.DB.Get(id)

	// movie := models.Movie {
	// 	ID: id,
	// 	Title: "Some movie",
	// 	Description: "Some description",
	// 	Year: 2021,
	// 	ReleaseDate: time.Date(2021, 01, 01, 01, 0, 0, 0, time.Local),
	// 	Runtime: 100,
	// 	Rating: 5,
	// 	MPAARating: "PG-13",
	// 	CreatedAt: time.Now(),
	// 	UpdatedAt: time.Now(),
	// }

	err = app.writeJSON(w, http.StatusOK, file, "file")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) getAllFiles(w http.ResponseWriter, r *http.Request) {
	files, err := app.models.DB.All()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, files, "files")
	if err != nil {
		app.errorJSON(w, err)
		return
	}

}

func (app *application) getAllTypes(w http.ResponseWriter, r *http.Request) {
	types, err := app.models.DB.TypesAll()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, types, "types")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) getAllFilesByType(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	typeID, err := strconv.Atoi(params.ByName("type_id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	files, err := app.models.DB.All(typeID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, files, "files")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

type FilePayload struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	FilePath    string `json:"file_path"`
	FileHash    string `json:"file_hash"`
}

func (app *application) editFile(w http.ResponseWriter, r *http.Request) {
	var payload FilePayload

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		log.Println(err)
		app.errorJSON(w, err)
		return
	}

	var file models.File

	if payload.ID != "0" {
		id, _ := strconv.Atoi(payload.ID)
		m, _ := app.models.DB.Get(id)
		file = *m
		file.UpdatedAt = time.Now()
	}

	file.ID, _ = strconv.Atoi(payload.ID)
	file.Title = payload.Title
	file.Description = payload.Description
	file.FileHash = payload.FileHash
	file.FilePath = payload.FilePath
	file.CreatedAt = time.Now()
	file.UpdatedAt = time.Now()

	if file.ID == 0 {

		err = app.models.DB.InsertFile(file)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	} else {
		err = app.models.DB.UpdateFile(file)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	}

	ok := jsonResp{OK: true}

	err = app.writeJSON(w, http.StatusOK, ok, "response")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}
func (app *application) deleteFile(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.models.DB.DeleteFile(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	ok := jsonResp{
		OK: true,
	}

	err = app.writeJSON(w, http.StatusOK, ok, "response")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}
