import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import axios from 'axios';
import ProgressButton from 'react-progress-button';

const ImageForm = () => {
  const [srcFile, setSrcFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [buttonState, setButtonState] = useState('disabled');

  const onSrcImageDrop = useCallback(acceptedFiles => {
    console.log('src dropped', acceptedFiles);
    setSrcFile(acceptedFiles[0]);
    setButtonState(targetFile ? '' : 'disabled');
  }, []);


  const onTargetImageDrop = useCallback(acceptedFiles => {
    console.log('target dropped', acceptedFiles);
    setTargetFile(acceptedFiles[0]);
    setButtonState(srcFile ? '' : 'disabled');
  }, []);

  const { getRootProps: getSrcRootProps, getInputProps: getSrcInputProps, isDragActive: isSrcDragActive } = useDropzone({
    onDrop: onSrcImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    }
  })
  const { getRootProps: getTargetRootProps, getInputProps: getTargetInputProps, isDragActive: isTargetDragActive } = useDropzone({
    onDrop: onTargetImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    }
  })

  const downloadFile = (absoluteUrl) => {
    let link = document.createElement('a');
    link.href = absoluteUrl;
    link.download = 'morph';
    document.body.appendChild(link);
    console.info('downloading...');
    link.click();
    document.body.removeChild(link);
  };

  const handleImageUpload = () => {
    setButtonState('loading');

    let data = new FormData();
    data.append('src_file', srcFile);
    data.append('target_file', targetFile);

    axios
      .post('images/upload', data)
      .then(resp => {
        setButtonState('success');
        setTimeout(() => {
          let url = resp.data;
          downloadFile(url);
        }, 1000);
      })
      .catch(err => {
        console.error(err);
        setButtonState('error');
      });
  };

  const srcStyle = {
    backgroundImage: `url(${srcFile ? URL.createObjectURL(srcFile) : ''})`
  };

  const targeStyle = {
    backgroundImage: `url(${targetFile ? URL.createObjectURL(srcFile) : ''})`
  };

  return (
    <div>
      <div className="dropzone-container">
        <div {...getSrcRootProps({className:'dropzone', style:srcStyle})}>
          <input {...getSrcInputProps()} />
          {
            isSrcDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
      </div>
      <div className="dropzone-container">
        <div {...getTargetRootProps({className:'dropzone', style:targeStyle})}>
          <input {...getTargetInputProps()} />
          {
            isTargetDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
      </div>
      <div style={{ margin: '20px' }}>
        <ProgressButton onClick={handleImageUpload} state={buttonState}>
          Morph image
        </ProgressButton>
      </div>
    </div>
  );
};

export default ImageForm;