import * as React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import ShopItemTable from './Components/ShopItemTable';
import ItemDetail from './Components/ItemDetail';
import * as Webcam from "react-webcam";
import Modal from 'react-responsive-modal';
import TextField from '@material-ui/core/TextField';

const faceRegEnable = true;

// import logo from './logo.svg';
interface IState {
  appear: boolean,
  currentShopItem: any,
  shopItems: any[],
  searchByTag: any,
  authenticated: boolean,
  refCamera: any,
  open: boolean,
  uploadShopitem: any
}


class App extends React.Component<{}, IState>  {

  constructor(props: any) {
    super(props);
    this.state = {
      appear: true,
      currentShopItem: { "id": 0, "title": " ", "url": "", "tags": "⚆ _ ⚆", "uploaded": "", "width": "0", "height": "0" },
      shopItems: [],
      searchByTag: "",
      authenticated: false,
      refCamera: React.createRef(),
      open: false,
      uploadShopitem: ""
    }

    this.toggle = this.toggle.bind(this);
    this.fetchMemes = this.fetchMemes.bind(this)
    this.searchByTag = this.searchByTag.bind(this)
    this.authenticate = this.authenticate.bind(this)
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.uploadShopitem = this.uploadShopitem.bind(this)
  }

  public render() {
    const { open, authenticated } = this.state
    return (
      <div >
        <div>
          {(!authenticated && faceRegEnable) ?
            <Modal open={!authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                ref={this.state.refCamera}
              />
              <div className="row nav-row">
                <div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
              </div>
            </Modal> : ""}
        </div>
        {(authenticated || !faceRegEnable) ?
          <div>

            <p className="App-intro" style={{ visibility: this.state.appear ? 'visible' : 'hidden' }}>
              Welcome to Op Shop Online.</p>

            <div >

              <TextField type="text" id="search-tag-textbox" placeholder="Search By Tags" />
              <Button onClick={this.searchByTag} variant="outlined" >Search</Button>
              <ShopItemTable />
              <Button variant="outlined" className="addBtn" onClick={this.onOpenModal}>Add Shopitem</Button>
              <Button variant="outlined" onClick={this.toggle}>Theme Change</Button>
            </div>
            <ItemDetail currentShopItem={this.state.currentShopItem} />
          </div>
          : ""}
        <Modal open={open} onClose={this.onCloseModal}>
          <form>
            <div className="form-group">
              <label>ShopItem Title</label>
              <input type="text" className="form-control" id="shopitem-title-input" placeholder="Enter Title" />

            </div>
            <div className="form-group">
              <label>ShopItem Description</label>
              <input type="text" className="form-control" id="shopitem-description-input" placeholder="Enter Description" />

            </div>
            <div className="form-group">
              <label>Tag</label>
              <input type="text" className="form-control" id="shopitem-tag-input" placeholder="Enter Tag" />

            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="text" className="form-control" id="shopitem-price-input" placeholder="Enter Price" />

            </div>
            <div className="form-group">
              <label>AccessCode</label>
              <input type="text" className="form-control" id="shopitem-accesscode-input" placeholder="Setup your Accesscode" />

            </div>
            <div className="form-group">
              <label>Image</label>
              <input type="file" onChange={this.handleFileUpload} className="form-control-file" id="shopitem-image-input" />
            </div>

            <button type="button" className="btn" onClick={this.uploadShopitem}>Upload</button>
          </form>
        </Modal>
      </div>
    );
  }


  public toggle(event: any) {
    this.setState(preState => {
      return { appear: !preState.appear };
    });
  }
  // Search --Get
  private fetchMemes(tag: any) {
    const url = "https://opshopbank.azurewebsites.net/api/ShopItem/tag?tags=" + tag;
    fetch(url, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(json => {
        let currentShopItem = json[0]
        if (currentShopItem === undefined) {
          currentShopItem = { "id": 0, "title": "No shopitem (╯°□°）╯︵ ┻━┻", "url": "", "tags": "try a different tag", "uploaded": "", "width": "0", "height": "0" }
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

  // Modal open
  private onOpenModal = () => {
    this.setState({ open: true });
  };

  // Modal close
  private onCloseModal = () => {
    this.setState({ open: false });
  };

  private handleFileUpload(file: any) {
    this.setState({
      uploadShopitem: file.target.files
    })
  }
  // Upload
  private uploadShopitem = async (e: any) => {
    e.preventDefault();
    const titleInput = document.getElementById("shopitem-title-input") as HTMLInputElement
    const tagInput = document.getElementById("shopitem-tag-input") as HTMLInputElement
    const descriptionInput = document.getElementById("shopitem-description-input") as HTMLInputElement
    const priceInput = document.getElementById("shopitem-price-input") as HTMLInputElement
    const accessCodeInput = document.getElementById("shopitem-accesscode-input") as HTMLInputElement
    const imageFile = this.state.uploadShopitem[0]

    if (titleInput === null || tagInput === null || descriptionInput === null || priceInput === null || accessCodeInput === null || imageFile === null) {
      return;
    }

    const title = titleInput.value
    const tag = tagInput.value
    const description = descriptionInput.value
    const price = priceInput.value
    const accesscode = accessCodeInput.value
    const url = "https://opshopbank.azurewebsites.net/api/ShopItem/upload"

    const formData = new FormData()
    formData.append("Title", title)
    formData.append("Description", description)
    formData.append("Tags", tag)
    formData.append("Price", price)
    formData.append("AccessCode", accesscode)
    formData.append("image", imageFile)

    fetch(url, {
      body: formData,
      headers: { 'cache-control': 'no-cache' },
      method: 'POST'
    })
      .then((response: any) => {
        if (!response.ok) {
          // Error State
          alert(response.statusText)
        } else {
          // location.reload()
          alert("This picture has been added, please click close button")
        }
      })
  }

  private authenticate() {
    const screenshot = this.state.refCamera.current.getScreenshot();
    this.getFaceRecognitionResult(screenshot);
  }
  // Face recognition
  private getFaceRecognitionResult(image: string) {
    if (image === null) {
      return;
    }
    const base64 = require('base64-js');
    const base64content = image.split(";")[1].split(",")[1]
    const byteArray = base64.toByteArray(base64content);
    const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/668f4e84-065d-4ba2-b990-bebabbd15016/image";
    const customVisionPredictionKey = "06e8a7ab485a459cb56d960a9e1ccfde";
    fetch(url, {
      body: byteArray,
      headers: {
        'cache-control': 'no-cache', 'Prediction-Key': customVisionPredictionKey, 'Content-Type': 'application/octet-stream'
      },
      method: 'POST'
    })
      .then((response: any) => {
        if (!response.ok) {
          // Error State
          alert(response.statusText)
        } else {
          response.json().then((json: any) => {
            const predictionResult = json.predictions[0];
            if (predictionResult.probability > 0.7) {
              this.setState({ authenticated: true })
            } else {
              this.setState({ authenticated: false })

            }
          });
        }
      })
  }
}

export default App;
