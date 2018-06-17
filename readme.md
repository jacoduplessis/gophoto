
## Next


Exiftool to read and write EXIF. No native golang solution.

UI to edit EXIF.


Is there a need for app db? What needs to be persisted? If any, can localstorage to the job?
 - save non-descrutive edits (cropping points), focal points, contrast, sharpening
 - save credentials for exporting to other platforms
 
Disk caching for `imaginary` thumbnails.
 
 
 ## Hacks
 
Removed the root `/` check in `imaginary.go` line 252.