import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ProgressButton from 'react-progress-button';

const ImageForm = () => {
  const [srcFile, setSrcFile] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [buttonState, setButtonState] = useState('disabled');

  const onSrcImageDrop = useCallback(acceptedFiles => {
    setSrcFile(acceptedFiles[0]);
    setButtonState(targetFile ? '' : 'disabled');
  }, [targetFile]);


  const onTargetImageDrop = useCallback(acceptedFiles => {
    setTargetFile(acceptedFiles[0]);
    setButtonState(srcFile ? '' : 'disabled');
  }, [srcFile]);

  const { getRootProps: getSrcRootProps, getInputProps: getSrcInputProps, isDragActive: isSrcDragActive } = useDropzone({
    onDrop: onSrcImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    }
  });
  const { getRootProps: getTargetRootProps, getInputProps: getTargetInputProps, isDragActive: isTargetDragActive } = useDropzone({
    onDrop: onTargetImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    }
  });

  const downloadFile = (fileName) => {
    let link = document.createElement('a');
    link.href = `download/${fileName}`;
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
          let fileName = resp.data;
          downloadFile(fileName);
        }, 1000);
      })
      .catch(err => {
        console.error(err);
        setButtonState('error');
      });
  };

  const srcStyle = useMemo(() => {
    return { backgroundImage: `url(${srcFile ? URL.createObjectURL(srcFile) : ''})` };
  }, [srcFile]);

  const targeStyle = useMemo(() => {
    return { backgroundImage: `url(${targetFile ? URL.createObjectURL(targetFile) : ''})` };
  }, [targetFile]);

  return (
    <div>
      <div className="dropzone-container">
        <div {...getSrcRootProps({className:'dropzone', style:srcStyle})}>
          <input {...getSrcInputProps()} />
          {
            isSrcDragActive ?
              <p>Drop the source face here ...</p> :
              <p>Drag and drop source face here, or click to select a file</p>
          }
        </div>
      </div>
      <div className="dropzone-container">
        <div {...getTargetRootProps({className:'dropzone', style:targeStyle})}>
          <input {...getTargetInputProps()} />
          {
            isTargetDragActive ?
              <p>Drop the target face here ...</p> :
              <p>Drag and drop target face here, or click to select a file</p>
          }
        </div>
      </div>
      <div style={{ margin: '20px' }}>
        <ProgressButton onClick={handleImageUpload} state={buttonState}>
          Generate morph video
        </ProgressButton>
      </div>
    </div>
  );
};

export default ImageForm;