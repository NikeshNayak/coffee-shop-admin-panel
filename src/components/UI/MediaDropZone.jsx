import React from "react";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";

const MediaDropzone = ({
  mediaList,
  hintText,
  handleFilesUpload,
  acceptedFileTypes,
  maxFiles,
}) => {
  const theme = useSelector((state) => state.Layout.theme);

  const handleDrop = (acceptedFiles) => {
    const newMedia = [];

    // Validate each accepted file
    acceptedFiles.forEach((file) => {
      let isValidType;
      let isValidSize =
        acceptedFileTypes === "image"
          ? file.size <= 250 * 1024
          : file.size <= 6 * 1024 * 1024;

      // Determine accepted file types and validate
      if (acceptedFileTypes === "video") {
        isValidType = /\.(mp4|mov|avi|mkv)$/i.test(file.name);
      } else if (acceptedFileTypes === "image") {
        isValidType = /\.(png|jpe?g)$/i.test(file.name);
      }

      if (isValidType && isValidSize) {
        newMedia.push({
          file,
          preview: URL.createObjectURL(file),
        });
      } else {
        if (acceptedFileTypes === "video") {
          alert(
            `${file.name} is invalid. Please upload valid video files (.mp4 or .mov) with a maximum size of 6 MB.`
          );
        } else if (acceptedFileTypes === "image") {
          alert(
            `${file.name} is invalid. Please upload images in .png, .jpeg, or .jpg format with a maximum size of 250 KB.`
          );
        }
      }
    });

    // Check if the total file count exceeds the max limit
    if (mediaList.length + newMedia.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }

    // Only pass valid files back to the parent
    if (newMedia.length > 0) {
      handleFilesUpload([...mediaList, ...newMedia]);
    }
  };

  const dropzoneStyles = {
    height: "50px",
    border: theme === "dark" ? "1px dashed #888" : "1px dashed #ccc",
    backgroundColor: theme === "dark" ? "#2d3448" : "#f8f8f8",
    color: theme === "dark" ? "#ffffff" : "#000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const iconStyles = {
    color: theme === "dark" ? "#999999" : "#6c757d",
  };

  return (
    <div className="media-dropzone">
      <Dropzone
        onDrop={handleDrop}
        accept={
          acceptedFileTypes === "video"
            ? { "video/*": [] }
            : acceptedFileTypes === "image"
            ? { "image/*": [] }
            : {}
        }
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone" style={dropzoneStyles}>
            <input {...getInputProps()} />
            <div className="dz-message needsclick">
              <div className="mb-3">
                <i
                  className="display-4 ri-upload-cloud-2-line"
                  style={iconStyles}
                ></i>
              </div>
              <h5>{hintText}</h5>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default MediaDropzone;
