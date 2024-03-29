/**
 * Created by saggarwal on 20/05/14.
 */
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
var fs = null;

function errorHandler(e) {
    var msg = '';
    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    };
    console.log('Error: ' + msg);
}

function onInitFs(fs) {

    fs.root.getFile('lgkgkog.txt', {create: true}, function(fileEntry) {

        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function(fileWriter) {

            fileWriter.onwriteend = function(e) {
                console.log('Write completed.');
            };

            fileWriter.onerror = function(e) {
                console.log('Write failed: ' + e.toString());
            };

            // Create a new Blob and write it to log.txt.
            var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});

            fileWriter.write(blob);

        }, errorHandler);

    }, errorHandler);

}




//Request 100 MB of filesystem
window.requestFileSystem(window.PERSISTENT, 100*1024*1024, onInitFs, errorHandler);