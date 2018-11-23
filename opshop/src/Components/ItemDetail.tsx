import * as React from 'react';
import Button from '@material-ui/core/Button';
import Modal from 'react-responsive-modal';
import GetApp from '@material-ui/icons/GetApp';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import { TextField } from '@material-ui/core';

interface IProps {
    currentShopItem: any
}
interface IState {
    openEdit: boolean
}



export default class ItemDetail extends React.Component<IProps, IState>{

    constructor(props: any) {
        super(props)
        this.state = {
            openEdit: false,
        }
        this.downshopitem = this.downshopitem.bind(this)
        this.deleteShopitem = this.deleteShopitem.bind(this)
        this.updateShopitem = this.updateShopitem.bind(this)

    }

    public render() {

        const currentShopItem = this.props.currentShopItem
        const { openEdit } = this.state;

        return (
            <div>
                <div>
                    <img height="auto" src={currentShopItem.url} />
                    <div>
                        {currentShopItem.price} {currentShopItem.description} {currentShopItem.title}
                    </div>

                </div>
                <div>
                    <Button variant="text" onClick={this.downshopitem.bind(this, currentShopItem.url)}><GetApp /></Button>
                    <Button variant="text" onClick={this.openEditMemu}><Edit /> </Button>
                    <Button variant="text" onClick={this.deleteShopitem.bind(this, currentShopItem.id)}><Delete /></Button>
                    <Button variant="text" href="https://www.facebook.com/sharer/sharer.php?u=example.org" target={currentShopItem.url} >
                        Share on Facebook
                    </Button>
                </div>



                <Modal open={openEdit} onClose={this.closeEditMemu}>
                    <form>
                        <div className="form-group">
                            <TextField type="text" label={"Title"} id="shopitem-title-input" margin="normal" defaultValue={currentShopItem.title} placeholder="Enter Title" />
                        </div>
                        <div className="form-group">
                            <TextField type="text" label={"Description"} id="shopitem-description-input" margin="normal" defaultValue={currentShopItem.description} placeholder="Enter Description" />
                        </div>
                        <div className="form-group">
                            <TextField type="text" label={"Tags"} id="shopitem-tag-input" margin="normal" defaultValue={currentShopItem.tags} placeholder="Enter Tag" />
                        </div>
                        <div className="form-group">
                            <TextField type="text" label={"Price"} id="shopitem-price-input" margin="normal" defaultValue={currentShopItem.price} placeholder="Enter Price" />
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

                    alert("This picture has been deleted");
                    this.setState({ openEdit: false });
                }
            })
    }

    private openEditMemu = () => {
        this.setState({ openEdit: true });
    };

    // Modal Close
    private closeEditMemu = () => {
        this.setState({ openEdit: false });
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
                    this.closeEditMemu();
                }
            })
    }





}

