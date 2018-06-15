import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import ProgressButton from 'react-progress-button';


export default class ImageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      srcFile: null,
      targetFile: null,
      buttonState: 'disabled'
    };
  }

  onSrcImageDrop(files) {
    this.setState({
      srcFile: files[0],
      buttonState: '',
      targetFile: this.state.targetFile
    });
    if(this.state.targetFile && this.state.buttonState === 'disabled') {
      this.setState({ 
        buttonState: '',
        srcFile: this.state.srcFile,
        targetFile: this.state.targetFile 
      });
    }
  }

  onTargetImageDrop(files) {
    this.setState({
      targetFile: files[0],
      buttonState: '',
      srcFile: this.state.srcFile
    }); 
    if(this.state.srcFile && this.state.buttonState === 'disabled') {
      this.setState({ 
        buttonState: '',
        srcFile: this.state.srcFile,
        targetFile: this.state.targetFile
      });
    }
  }

  downloadFile = (absoluteUrl) => {
    let link = document.createElement('a');
    link.href = absoluteUrl;
    link.download = 'morph';
    document.body.appendChild(link);
    console.info('downloading...');
    link.click();
    document.body.removeChild(link);
  };

  handleImageUpload() {

    this.setState({ 
      buttonState: 'loading',
      srcFile: this.state.srcFile,
      targetFile: this.state.targetFile
    });

    let data = new FormData();
    data.append('src_file', this.state.srcFile);
    data.append('target_file', this.state.targetFile);
    // const multi_config = { headers: { 'Content-Type': 'multipart/form-data; boundary=${data._boundary}' } };

    axios
      .post('images/upload', data)
      .then(resp => {

        this.setState({
          buttonState: 'success',
          srcFile: this.state.srcFile,
          targetFile: this.state.targetFile
        });
        setTimeout(() => {
          let url = resp.data;
          this.downloadFile(url);
        }, 1000);
      }) 
      .catch(err => {
        console.error(err);
        this.setState({
          buttonState: 'error',
          srcFile: this.state.srcFile,
          targetFile: this.state.targetFile
        });
      });
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
        <div style={{margin: '20px'}}>
          <ProgressButton onClick={this.handleImageUpload.bind(this)}  state={this.state.buttonState}>
            Morph image
          </ProgressButton>
        </div>
      </div>
    );
  }
}
