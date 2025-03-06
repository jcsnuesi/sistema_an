export function validateExtensions(params) {
  if (params.files) {
    var file_path = params.files.foto.path;
    var file_split = file_path.split("\\");
    var file_name = file_split[2];
    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];

    if (
      file_ext == "png" ||
      file_ext == "jpg" ||
      file_ext == "jpeg" ||
      file_ext == "gif"
    ) {
      return file_name;
    } else {
      return params.body.foto;
    }
  }
}
