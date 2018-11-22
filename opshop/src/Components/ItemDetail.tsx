import * as React from 'react';
import Button from '@material-ui/core/Button';

interface IProps{
    currentShopItem:any
}


export default class ShopItemTable extends React.Component<IProps,{}>{

    constructor(props:any){
        super(props)
        this.downloadMeme=this.downloadMeme.bind(this)
    
    }

    public render(){

        const currentShopItem= this.props.currentShopItem
       
        return(
            <div>
            <div>
                <img  height="auto"  src={currentShopItem.url}/>
                <Button onClick={this.downloadMeme.bind(this, currentShopItem.url)}>Download</Button>
                </div>
                <Button href="https://www.facebook.com/sharer/sharer.php?u=example.org" target={currentShopItem.url} >
                Share on Facebook
              </Button>
              </div>

        )

    };

    private downloadMeme(url: any) {
        window.open(url);
    }



}

