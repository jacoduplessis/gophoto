package main

import (
	"encoding/json"
	"fmt"
	"github.com/gobuffalo/packr"
	"github.com/gorilla/mux"
	"gopkg.in/h2non/bimg.v1"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"time"
)

var assets = packr.NewBox("./assets")

var IMAGE_SUFFIXES = []string{
	".jpg", ".JPG", ".JPEG", ".jpeg",
}

func isImage(s string) bool {
	for _, a := range IMAGE_SUFFIXES {
		if filepath.Ext(s) == a {
			return true
		}
	}
	return false
}

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

func (f *Filer) ReadExif(dirPath string) error {

	start := time.Now()
	exifCmd := exec.Command("exiftool", "-fast2", "-json", "-dateFormat", "%Y-%m-%d %H:%M:%S", "-fileOrder", "DateTimeOriginal", dirPath)
	exifJSON, err := exifCmd.Output()
	fmt.Println("Exiftool processing of", dirPath, "took", time.Now().Sub(start))
	if err != nil {
		return err
	}
	return json.Unmarshal(exifJSON, &f.Images)
}

func (f *Filer) ReadImages(dirPath string) error {

	var images []*Image
	start := time.Now()
	entries, err := ioutil.ReadDir(dirPath)
	if err != nil {
		return err
	}
	var files []string

	for _, e := range entries {
		name := e.Name()
		files = append(files, name)
		if isImage(name) {
			images = append(images, &Image{SourceFile: filepath.Join(dirPath, name)})
		}
	}
	fmt.Println("ReadDir processing of", dirPath, "took", time.Now().Sub(start))
	f.Images = images
	return nil
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
	err := filer.ReadImages(dirPath)
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
		target := path.Join(d.Dist, filepath.Base(p))
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
		c := exec.Command("imaginary", "-p", port, "-mount", "/", "-http-cache-ttl", "604800")
		c.Stdout = os.Stdout
		c.Stderr = os.Stderr
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
