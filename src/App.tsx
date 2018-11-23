import * as React from 'react';
import './App.css';
import { Add, Search, Info, InvertColors } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import ShopItemTable from './Components/ShopItemTable';
// import ItemDetail from './Components/ItemDetail';
import * as Webcam from "react-webcam";
import Modal from 'react-responsive-modal';

import GetApp from '@material-ui/icons/GetApp';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import {
	AppBar, createStyles, Theme,
	Toolbar, Typography, withStyles,
	MuiThemeProvider, createMuiTheme, GridList,
	GridListTile, ListSubheader, GridListTileBar, IconButton,
	TextField
} from '../node_modules/@material-ui/core';

const faceRegEnable = false;
const accesscodeLength = 6;

// import logo from './logo.svg';
interface IState {
	appear: boolean,
	// currentShopItem: any,
	shopItems: any[],
	searchByTag: any,
	authenticated: boolean,
	refCamera: any,
	openAddItem: boolean,
	openEdit: boolean,
	uploadShopitem: any,
	classes: any,
	theme: "primary" | "secondary"
}

const theme = createMuiTheme({
	typography: {
		useNextVariants: true,
	},
	palette: {
		primary: {
			// light: will be calculated from palette.primary.main,
			main: "#F00",
			// dark: will be calculated from palette.primary.main,
			// contrastText: will be calculated to contrast with palette.primary.main
		},
		secondary: {
			main: "#FFF",
		}
	}
});

const styles = (theme: Theme) => createStyles({
	root: {
		flexGrow: 1,
	},
	gallery: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
	},
	textField: {
		color: '#FFF'
	},
	icon: {
		color: 'rgba(255, 255, 255, 0.54)',
	},
	gridList: {
		height: 200,
	},
})

export const App = withStyles(styles)(

	class extends React.Component<{}, IState>  {

		constructor(props: any) {
			super(props);
			this.state = {
				appear: true,
				// currentShopItem: [],
				shopItems: [],
				searchByTag: "",
				authenticated: false,
				refCamera: React.createRef(),
				openAddItem: false,
				openEdit: false,
				uploadShopitem: "",
				classes: props,
				theme: "primary"
			}

			this.toggleTheme = this.toggleTheme.bind(this);
			this.fetchMemes = this.fetchMemes.bind(this)
			this.searchByTag = this.searchByTag.bind(this)
			this.authenticate = this.authenticate.bind(this)
			this.handleFileUpload = this.handleFileUpload.bind(this)
			this.uploadShopitem = this.uploadShopitem.bind(this)

			this.downshopitem = this.downshopitem.bind(this)
			this.deleteShopitem = this.deleteShopitem.bind(this)
			this.updateShopitem = this.updateShopitem.bind(this)
			// window.sessionStorage.setItem("authenticated", "false");
		}

		public render() {
			const { openAddItem, openEdit, shopItems, authenticated, classes } = this.state;
			return (
				<MuiThemeProvider theme={theme} >
					<div className={classes.root}>
						<AppBar position="static" color={this.state.theme}>
							<Toolbar color="inherit">
								<Typography variant="h6" color="inherit">
									<span>
										<img src={require("./Logo.png")} style={{ verticalAlign: "middle" }} />
									</span> Op Shop
                  					<TextField type="text" style={{ marginLeft: "15px" }} id="search-tag-textbox" placeholder="Search By Tags" />
									<Button onClick={this.searchByTag} variant="text" color="inherit" ><Search color="inherit" /></Button>
									<ShopItemTable />
									<Button variant="text" className="addBtn" onClick={this.openAddItemMemu} color="inherit"><Add color="inherit" /></Button>
									<Button variant="text" onClick={this.toggleTheme} color="inherit"><InvertColors color="inherit" /></Button>
								</Typography>
							</Toolbar>
						</AppBar>
						<div>
							{(!(authenticated) && faceRegEnable) ?
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
							<div className={classes.root}>
								<GridList cellHeight={"auto"} className={classes.gridList}>
									<GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
										<ListSubheader component="div">Your item list</ListSubheader>
									</GridListTile>
									{shopItems.length > 0 &&
										shopItems.map(tile => (
											<div key={tile.id}>
												<GridListTile>
													<img src={tile.url} alt={tile.title} />
													<div>
														<Modal open={openEdit} onClose={this.closeEditMemu}>
															<form>
																<div className="form-group">
																	<TextField type="text" label={"Title"} id="shopitem-title-input" margin="normal" defaultValue={tile.title} placeholder="Enter Title" />
																</div>
																<div className="form-group">
																	<TextField type="text" label={"Description"} id="shopitem-description-input" margin="normal" defaultValue={tile.description} placeholder="Enter Description" />
																</div>
																<div className="form-group">
																	<TextField type="text" label={"Tags"} id="shopitem-tag-input" margin="normal" defaultValue={tile.tags} placeholder="Enter Tag" />
																</div>
																<div className="form-group">
																	<TextField type="text" label={"Price"} id="shopitem-price-input" margin="normal" defaultValue={tile.price} placeholder="Enter Price" />
																</div>
																<div className="form-group">
																	<TextField type="text" label={"Access Code"} id="shopitem-accesscode-input" margin="normal" placeholder="Enter Accesscode" color="inherit" />
																</div>
																<Button onClick={this.updateShopitem.bind(this, tile)}>Update</Button>
															</form>
														</Modal>
													</div>
													<GridListTileBar
														title={tile.title}
														subtitle={<span>Price: {tile.price}</span>}

														actionIcon={
															<IconButton className={classes.icon} onClick={() => { alert("ShopItem description: " + tile.description) }}>
																<Info />
															</IconButton>
														}
													/>
												</GridListTile>
												<div>
													<Button variant="text" onClick={this.downshopitem.bind(this, tile.url)}><GetApp /></Button>
													<Button variant="text" onClick={this.openEditMemu}><Edit /> </Button>
													<Button variant="text" onClick={this.deleteShopitem.bind(this, tile)}><Delete /></Button>
													<Button variant="text" href={"https://www.facebook.com/sharer/sharer.php?u="+tile.url} target={"_blank"} >
														Share on Facebook
													</Button>
												</div>
											</div>
										))}



									}
								</GridList>
							</div>
							: ""}
						<Modal open={openAddItem} onClose={this.closeAddItemMemu}>
							<form>
								<div className="form-group">
									<TextField type="text" label={"Title"} id="shopitem-title-input" margin="normal" placeholder="ShopItem Title" color="inherit" />
								</div>
								<div className="form-group">
									<TextField type="text" label={"Description"} id="shopitem-description-input" margin="normal" placeholder="ShopItem Description" color="inherit" />
								</div>
								<div className="form-group">
									<TextField type="text" label={"Tags"} id="shopitem-tag-input" margin="normal" placeholder="Tag" color="inherit" />
								</div>
								<div className="form-group">
									<TextField type="text" label={"Price"} id="shopitem-price-input" margin="normal" placeholder="Price" color="inherit" />
								</div>

								<div className="form-group">
									<TextField type="text" label={"Access Code"} id="shopitem-accesscode-input" margin="normal" placeholder="Setup your Accesscode" color="inherit" />
								</div>
								<div className="form-group">
									<TextField type="file" onChange={this.handleFileUpload} label={"Image"} id="shopitem-image-input" margin="normal" color="inherit" />
								</div>
								<Button type="button" className="btn" onClick={this.uploadShopitem} color="inherit">Upload</Button>
							</form>
						</Modal>
					</div >
				</MuiThemeProvider>
			);
		}

		private downshopitem(url: any) {
			window.open(url);
		}
		private deleteShopitem(currentShopItem: any) {
			const accesscodeInput = prompt("Please enter the access code");
			if (accesscodeInput !== currentShopItem.accessCode) {
				alert("Access Code is incorrect.");
				return;
			}
			const url = "https://opshopbank.azurewebsites.net/api/ShopItem/" + currentShopItem.id

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

		private updateShopitem(currentShopItem: any) {
			console.log("current item");
			console.log(currentShopItem)
			const titleInput = document.getElementById("shopitem-title-input") as HTMLInputElement
			const tagInput = document.getElementById("shopitem-tag-input") as HTMLInputElement
			const descriptionInput = document.getElementById("shopitem-description-input") as HTMLInputElement
			const priceInput = document.getElementById("shopitem-price-input") as HTMLInputElement
			const accesscodeInput = document.getElementById("shopitem-accesscode-input") as HTMLInputElement
			if (titleInput === null || tagInput === null || descriptionInput === null || priceInput === null || accesscodeInput === null) {
				return;
			}
			const url = "https://opshopbank.azurewebsites.net/api/ShopItem/" + currentShopItem.id
			const updatedTitle = titleInput.value
			const updatedTag = tagInput.value
			const updatedPrice = priceInput.value
			const updateddescription = descriptionInput.value
			const accesscode = accesscodeInput.value
			if (accesscode !== currentShopItem.accessCode) {
				alert("Access Code is incorrect.");
				return;
			}
			fetch(url, {
				body: JSON.stringify({
					"height": currentShopItem.height,
					"id": currentShopItem.id,
					"price": updatedPrice,
					"description": updateddescription,
					"accesscode": currentShopItem.accessCode,
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

		public toggleTheme(event: any) {
			this.setState(preState => {
				return ({
					theme: (preState.theme === "primary" ? "secondary" : "primary")
				});
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
					if (json.length === 0) {
						console.log("No result");
						return
					} else {
						console.log(json)
						this.setState({
							shopItems: json
						});
					}
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
		private openAddItemMemu = () => {
			this.setState({ openAddItem: true });
		};

		// Modal close
		private closeAddItemMemu = () => {
			this.setState({ openAddItem: false });
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
			if (accesscode.length < accesscodeLength) {
				alert("The access code must be at least 6 characters.");
				return;
			}

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
						alert("This item has been uploaded to your list.");
						this.closeAddItemMemu();
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
								// window.sessionStorage.setItem("authenticated","true");
								this.setState({ authenticated: true });
							} else {
								// window.sessionStorage.setItem("authenticated","false");
								this.setState({ authenticated: false });

							}
						});
					}
				})
		}
	}
);
