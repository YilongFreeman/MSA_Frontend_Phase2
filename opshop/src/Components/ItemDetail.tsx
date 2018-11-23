import * as React from 'react';
import Button from '@material-ui/core/Button';
import Modal from 'react-responsive-modal';

interface IProps {
    currentShopItem: any
}
interface IState {
    open: boolean
}



export default class ShopItemTable extends React.Component<IProps, IState>{

    constructor(props: any) {
        super(props)
        this.state = {
            open: false
        }
        this.downshopitem = this.downshopitem.bind(this)
        this.deleteShopitem = this.deleteShopitem.bind(this)
        this.updateShopitem = this.updateShopitem.bind(this)

    }

    public render() {

        const currentShopItem = this.props.currentShopItem
        const { open } = this.state;

        return (
            <div>
                <div>
                    <img height="auto" src={currentShopItem.url} />
                    <div> {currentShopItem.price} {currentShopItem.description} {currentShopItem.title}
                    </div>

                </div>
                <div>
                    <Button variant="outlined" onClick={this.downshopitem.bind(this, currentShopItem.url)}>Download</Button>
                    <Button variant="outlined" onClick={this.onOpenModal}>Edit </Button>
                    <Button variant="outlined" onClick={this.deleteShopitem.bind(this, currentShopItem.id)}>Delete</Button>
                    <Button variant="outlined" href="https://www.facebook.com/sharer/sharer.php?u=example.org" target={currentShopItem.url} >
                        Share on Facebook
              </Button>
                </div>



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
                        <Button onClick={this.updateShopitem}>Update</Button>
                    </form>
                </Modal>


            </div>

        )

    };

    private downshopitem(url: any) {
        window.open(url);
    }
    private deleteShopitem(id: any) {
        const url = "https://opshopbank.azurewebsites.net/api/ShopItem/" + id

        fetch(url, {
            method: 'DELETE'
        })
            .then((response: any) => {
                if (!response.ok) {
                    // Error Response
                    alert(response.statusText)
                }
                else {

                    alert("This picture has been deleted")
                }
            })
    }

    private onOpenModal = () => {
        this.setState({ open: true });
    };

    // Modal Close
    private onCloseModal = () => {
        this.setState({ open: false });
    };

    private updateShopitem() {
        const titleInput = document.getElementById("shopitem-title-input") as HTMLInputElement
        const tagInput = document.getElementById("shopitem-tag-input") as HTMLInputElement
        const descriptionInput = document.getElementById("shopitem-description-input") as HTMLInputElement
        const priceInput = document.getElementById("shopitem-price-input") as HTMLInputElement

        if (titleInput === null || tagInput === null || descriptionInput === null || priceInput === null) {
            return;
        }

        const currentShopItem = this.props.currentShopItem
        const url = "https://opshopbank.azurewebsites.net/api/ShopItem/" + currentShopItem.id
        const updatedTitle = titleInput.value
        const updatedTag = tagInput.value
        const updatedPrice = priceInput.value
        const updateddescription = descriptionInput.value
        fetch(url, {
            body: JSON.stringify({
                "height": currentShopItem.height,
                "id": currentShopItem.id,
                "price": updatedPrice,
                "description": updateddescription,
                "accesscode": currentShopItem.accesscode,
                "tags": updatedTag,
                "title": updatedTitle,
                "uploaded": currentShopItem.uploaded,
                "url": currentShopItem.url,
                "width": currentShopItem.width
            }),
            headers: { 'cache-control': 'no-cache', 'Content-Type': 'application/json' },
            method: 'PUT'
        })
            .then((response: any) => {
                if (!response.ok) {
                    // Error State
                    alert(response.statusText + " " + url)
                } else {
                    location.reload()
                }
            })
    }





}

