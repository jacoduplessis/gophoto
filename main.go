package main

import (
	"encoding/json"
	"fmt"
	"github.com/gobuffalo/packr"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

var IMAGE_SUFFIXES = []string{
	".JPEG", ".jpeg", ".jpg", ".JPG",
}

func isImage(s string) bool {
	for _, a := range IMAGE_SUFFIXES {
		if filepath.Ext(s) == a {
			return true
		}
	}
	return false
}

type Filer struct {
	Files  []string `json:"files"`
	Images []string `json:"images"`
	Server string   `json:"server"`
}

func (f *Filer) Read(path string) error {
	entries, err := ioutil.ReadDir(path)
	if err != nil {
		return err
	}
	var files []string
	var images []string
	for _, e := range entries {
		name := e.Name()
		files = append(files, name)
		if isImage(name) {
			images = append(images, filepath.Join(path, name))
		}
	}
	f.Files = files
	f.Images = images
	return nil
}

func (f *Filer) ParseDir(dir string) ([]string, error) {
	images := []string{}
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Printf("prevent panic by handling failure accessing a path %q: %v\n", dir, err)
			return err
		}
		if isImage(path) {
			images = append(images, path)
		}
		return nil
	})

	if err != nil {
		fmt.Printf("error walking the path %q: %v\n", dir, err)
	}
	return images, err
}

func renderJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func api(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"hallo": "world"}`))
}

func read(w http.ResponseWriter, r *http.Request) {

	var filer = new(Filer)
	dirPath := r.URL.Query().Get("dir")
	if dirPath == "" {
		return // TODO: create app pattern for responses and errors
	}
	filer.Read(dirPath)
	renderJSON(w, filer)
}

func main() {

	assetServer := http.FileServer(packr.NewBox("./assets"))
	fileServer := http.FileServer(http.Dir("/"))

	r := mux.NewRouter()
	r.PathPrefix("/assets/").Handler(http.StripPrefix("/assets", assetServer))
	r.PathPrefix("/files/").Handler(http.StripPrefix("/files", fileServer))

	a := r.PathPrefix("/api/").Subrouter()

	a.HandleFunc("/", api)
	a.HandleFunc("/read", read)

	// Set up your http server here
	log.Fatal(http.ListenAndServe(":8025", r))

}
