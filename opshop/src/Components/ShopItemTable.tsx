import MediaStreamRecorder from 'msr';
import * as React from 'react';

interface IProps{
    

}

export default class ShopItemTable extends React.Component<IProps,{}>{
    constructor(props:any){
        super(props)
        this.searchTagByVoice=this.searchTagByVoice.bind(this)
        this.getAccessToken=this.getAccessToken.bind(this)
        this.postAudio= this.postAudio.bind(this)
       
    }
    
    public render(){
        return (
            <div> Yilong
                
                <button className="btn" onClick={this.getAccessToken}><i className="fa fa-microphone" /></button>
            </div> 
        )
    }


    private searchTagByVoice(accessToken:string){
        const mediaConstraints = {
        audio: true
    }
    const onMediaSuccess = (stream: any) => {
        const mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
        mediaRecorder.ondataavailable = (blob: any) => {
            this.postAudio(blob,accessToken);
            mediaRecorder.stop()
        }
        mediaRecorder.start(3000);
    }

    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)

    function onMediaError(e: any) {
        console.error('media error', e);
    }
}

    private getAccessToken() {
        const cognitiveServicesApi= "https://westus.api.cognitive.microsoft.com/sts/v1.0"
        const cognitiveServicesKey="4eb83ee96b484b67955f983644e40301"
        fetch(cognitiveServicesApi + '/issueToken', {
            headers: {
                'Content-Length': '0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': cognitiveServicesKey
            },
            method: 'POST'
        }).then((response) => {
            // console.log(response.text())
            return response.text()
        }).then((accessToken) => {
            this.searchTagByVoice(accessToken);
        }).catch((error) => {
            console.log("Error", error)
        });
    }
    
    private postAudio(blob: Blob, accessToken: string) {
        
        const cognitiveServicesKey="4eb83ee96b484b67955f983644e40301"
        // posting audio
        fetch("https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-AU", {
            body: blob, // this is a .wav audio file    
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer' + accessToken,
                'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
                'Ocp-Apim-Subscription-Key': cognitiveServicesKey
            },
            method: 'POST'
        }).then((res) => {
            return res.json()
        }).then((res: any) => {
            console.log(res)
            if (res.RecognitionStatus === "Success") {
                const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement;
                textBox.value = (res.DisplayText as string).slice(0, -1)
            }
        }).catch((error) => {
            console.log("Error", error)
        });
    }



}


