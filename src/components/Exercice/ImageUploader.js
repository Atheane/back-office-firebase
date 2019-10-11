import React, { Component } from "react";
import FileUploader from "react-firebase-file-uploader";
import { compose } from 'recompose';
import { withFirebase } from '../../data/context';


class ImageUploader extends Component {
  state = {
    name: "",
    isUploading: false,
    progress: 0,
    imgUrl: ""
  };
  componentDidMount() {
    const { img } = this.props;
    console.log(this.props);
    if (!!img) {
      this.setState({ name: img.name, imgUrl: img.url });
    }
  }

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    this.setState({ name: filename, progress: 100, isUploading: false });
    this.props.firebase
      .storage
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.props.setImg({ name: filename, url: url });
        this.setState({ name: filename, imgUrl: url })
      });
  };

  render() {
    return (
      <div>
        {/* <form> */}
          <label>Image</label>
          <br />
          <br />
          {this.state.isUploading && <p> Progress: {this.state.progress} </p>}
          {this.state.imgUrl && <a href={this.state.imgUrl} target="_blank"><img src={this.state.imgUrl} /></a>}
          <br />
          <br />
          <label style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, pointer: 'cursor'}}>
            Select your image
            <FileUploader
              accept="image/*"
              name="imgWording"
              hidden
              filename={file => file.name}
              storageRef={this.props.firebase.storage.ref("images")}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
            />
          </label>
          <br />
          <br />
        {/* </form> */}
      </div>
    );
  }
}
 
export default compose(
  withFirebase,
)(ImageUploader);
