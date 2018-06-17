
## Next


Exiftool to read and write EXIF. No native golang solution.

UI to edit EXIF.


Is there a need for app db? What needs to be persisted? If any, can localstorage to the job?
 - save non-descrutive edits (cropping points), focal points, contrast, sharpening
 - save credentials for exporting to other platforms
 - store exif as exiftool processing is very slow
 - issue of list vs keyed access on frontend will require indexeddb in any case
 
Disk caching for `imaginary` thumbnails? For now a browser TTL of 1 week is set. How large is the browser cache?
 
Carousel cannot cope with a large amount of images.

Faster way to get image files from folder? Golang glob does not support multiple extensions such as `*.{jpg|JPEG}`

Floating controls.


 
 ## Hacks
 
Removed the root `/` check in `imaginary.go` line 252.