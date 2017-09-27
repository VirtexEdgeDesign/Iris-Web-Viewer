var ioImgs = {};

function io_import_img(filename, base64)
{
	var key = filename;
  ioImgs[key.toString().trim().valueOf()] = base64;
}