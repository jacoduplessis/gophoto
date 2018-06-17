package main

import (
	"encoding/json"
	"fmt"
	"github.com/gobuffalo/packr"
	"github.com/gorilla/mux"
	"gopkg.in/h2non/bimg.v1"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path"
)

var assets = packr.NewBox("./assets")

type Image struct {
	// fields below are modelled after exiftool output

	// Common
	SourceFile       string
	FileName         string
	FileSize         string
	Model            string // camera
	DateTimeOriginal string
	ImageSize        string
	Quality          string
	FocalLength      string
	ShutterSpeed     string
	Aperture         float64
	ISO              float64
	WhiteBalance     string
	Flash            string

	// XMP tags
	Categories  string
	Notes       string
	Description string
	Subject     []string
	Title       string
	Rating      float64
	Caption     string
	//

	// other Exif
	LensModel string
	Artist    string
	Copyright string

	// file
	ImageWidth  int
	ImageHeight int
}

type Filer struct {
	Files  []string `json:"files"`
	Images []*Image `json:"images"`
	Server string   `json:"server"`
}

func (f *Filer) Read(path string) error {

	exifCmd := exec.Command("exiftool", "-json", "-dateFormat", "%Y-%m-%dT%H:%M:%S", path)
	exifJSON, err := exifCmd.Output()
	if err != nil {
		return err
	}
	return json.Unmarshal(exifJSON, &f.Images)
}

func (f *Filer) ParseDir(dir string) ([]string, error) {

	// use exiftool -r to walk tree recursively
	return nil, nil
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
	err := filer.Read(dirPath)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		w.Write([]byte(err.Error()))
	}
	renderJSON(w, filer)
}

func export(w http.ResponseWriter, r *http.Request) {

	var d struct {
		Width  int
		Height int
		Dist   string
		Files  []string
	}
	if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
		log.Fatal(err)
	}
	if err := os.MkdirAll(d.Dist, 0755); err != nil {
		log.Fatal(err)
		w.WriteHeader(500)
	}
	for _, p := range d.Files {
		buf, err := bimg.Read(p)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(500)
		}
		resized, err := bimg.NewImage(buf).Resize(d.Width, d.Height)
		if err != nil {
			log.Fatal(err)
		}
		target := path.Join(d.Dist, path.Base(p))
		if err := bimg.Write(target, resized); err != nil {
			log.Fatal(err)
		}

	}
	w.WriteHeader(200)
}

func main() {

	go func() {
		port := "8045"
		fmt.Println("Running imaginary on ", port)
		c := exec.Command("imaginary", "-p", port, "-mount", "/")
		c.Run()
	}()

	assetServer := http.FileServer(assets)
	fileServer := http.FileServer(http.Dir("/"))

	r := mux.NewRouter()

	r.PathPrefix("/files/").Handler(http.StripPrefix("/files", fileServer))

	a := r.PathPrefix("/api/").Subrouter()

	a.HandleFunc("/", api)
	a.HandleFunc("/read", read)
	a.HandleFunc("/export", export).Methods("POST")
	r.PathPrefix("/").Handler(assetServer)
	log.Fatal(http.ListenAndServe(":8025", r))

}
