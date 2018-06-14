import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
// import download from 'downloadjs';


export default class ImageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      srcFile: null,
      targetFile: null
    };
  }

  onSrcImageDrop(files) {
    this.setState({
      srcFile: files[0],
      targetFile: this.state.targetFile
    });

    // this.handleImageUpload(files[0]);
  }

  onTargetImageDrop(files) {
    this.setState({
      srcFile: this.state.srcFile,
      targetFile: files[0]
    });

    // this.handleImageUpload(files[0]);
  }

  downloadFile = (absoluteUrl) => {
    let link = document.createElement('a');
    link.href = absoluteUrl;
    link.download = 'true';
    document.body.appendChild(link);
    console.info('downloading...')
    link.click();
    document.body.removeChild(link);
  };

  handleImageUpload() {
    // console.info(file);

    let data = new FormData();
    data.append('src_file', this.state.srcFile);
    data.append('target_file', this.state.targetFile);
    // const multi_config = { headers: { 'Content-Type': 'multipart/form-data; boundary=${data._boundary}' } };

    axios
      .post('images/upload', data)
      .then(resp => {
        console.info(resp.data);
        setTimeout(() => {
          let url = window.location.host + '/' + resp.data;
          console.info(url);
          this.downloadFile(url);
        }, 1000);
      }) 
      .catch(console.error);
  }

  render() {
    return (
      <div>
        <div className="dropzone-container">
          <Dropzone
            className="dropzone"
            style={{
              backgroundImage: `url(${this.state.srcFile?this.state.srcFile.preview:''})`
            }}
            multiple={false}
            accept="image/*"
            onDrop={this.onSrcImageDrop.bind(this)}
          >
            <p>Drop an image or click to select a file to upload.</p>
          </Dropzone>
          {/* {this.state.srcFile ? (
            <div>
              <div>
                <img
                  width="100"
                  height="100"
                  src={this.state.srcFile.preview}
                />
              </div>
            </div>
          ) : null} */}
        </div>
        <div className="dropzone-container">
          <Dropzone
            className="dropzone"
            style={{
              backgroundImage: `url(${this.state.targetFile?this.state.targetFile.preview:''})`
            }}
            multiple={false}
            accept="image/*"
            onDrop={this.onTargetImageDrop.bind(this)}
          >
            <p>Drop an image or click to select a file to upload.</p>
          </Dropzone>

          {/* {this.state.targetFile ? (
            <div>
              <div>
                <img
                  width="100"
                  height="100"
                  src={this.state.targetFile.preview}
                />
              </div>
            </div>
          ) : null} */}
        </div>
        <button className="button" onClick={this.handleImageUpload.bind(this)}>
          Morph images
        </button>
      </div>
    );
  }
}
