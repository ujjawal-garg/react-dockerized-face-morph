import React, {Component} from 'react';
import ImageForm from './ImageForm';

//State and LifeCycle method manipulation possible here
class App extends Component {
    state = {
      pageHeader: 'Hello components!',
    };
 
    componentDidMount(){

    }

    render(){
      return (
        <div className="App">
          <ImageForm />
        </div>
      );
    }
}


export default App;
