import * as React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import ShopItemTable from './Components/ShopItemTable';
import ItemDetail from './Components/ItemDetail';



// import logo from './logo.svg';
interface IState {
  appear: boolean,
  currentShopItem: any,
  shopItems: any[],
  searchByTag: any,
}


class App extends React.Component<{}, IState>  {

  constructor(props: any) {
    super(props);
    this.state = {
      appear: true,
      currentShopItem: { "id": 0, "title": "Loading ", "url": "", "tags": "⚆ _ ⚆", "uploaded": "", "width": "0", "height": "0" },
      shopItems: [],
      searchByTag: ""
    }
    this.tell = this.tell.bind(this);
    this.toggle = this.toggle.bind(this);
    this.fetchMemes = this.fetchMemes.bind(this)
    this.searchByTag = this.searchByTag.bind(this)


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
        <Button onClick={this.tell} variant="contained" color="secondary">Change</Button>
        <div >
          <input type="text" id="search-tag-textbox" placeholder="Search By Tags" />
          <Button onClick={this.searchByTag} variant="contained" color="secondary">Search</Button>
        </div>
        <ShopItemTable />
        <ItemDetail currentShopItem={this.state.currentShopItem} />



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
  private fetchMemes(tag: any) {
    const url = "https://opshopbank.azurewebsites.net/api/ShopItem/tag?tags=" + tag;
    fetch(url, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(json => {
        let currentShopItem = json[0]
        if (currentShopItem === undefined) {
          currentShopItem = { "id": 0, "title": "No memes (╯°□°）╯︵ ┻━┻", "url": "", "tags": "try a different tag", "uploaded": "", "width": "0", "height": "0" }
        }
        console.log(json)
        this.setState({
          currentShopItem,
          shopItems: json
        })
      });
  }
  private searchByTag() {
    const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
    const tag = textBox.value;
    if (tag === "") {
      return;
    }
    this.fetchMemes(tag);
  }




}

export default App;
