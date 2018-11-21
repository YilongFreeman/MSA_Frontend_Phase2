import * as React from 'react';
import './App.css';

// import logo from './logo.svg';
interface Istate {
  appear: boolean,
}


class App extends React.Component<{}, Istate>  {

  constructor(props: any) {
    super(props);
    this.state = {
      appear: true,
    }
    this.tell = this.tell.bind(this);
    this.toggle = this.toggle.bind(this);


  }

  public render() {
    return (
      <div >
        <header >
          Opshop
        </header>
        <button onClick={this.toggle}>Change</button>
        <p className="App-intro" style={{ visibility: this.state.appear ? 'visible' : 'hidden' }}>
          Welcome to Op Shop Online.
      </p>
        <button onClick={this.tell}>Change</button>

      </div>
    );
  }
  public tell(event: any) {
    return (alert("I am not here"));
  }

  public toggle(event: any) {
    this.setState(preState => {
        return { appear: !preState.appear };
    });
}
  
}

export default App;
