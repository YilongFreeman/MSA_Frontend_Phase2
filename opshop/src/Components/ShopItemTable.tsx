import MediaStreamRecorder from 'msr';
import * as React from 'react';
import Mic from '@material-ui/icons/Mic';
import { Button } from '../../node_modules/@material-ui/core';

interface IProps {


}

export default class ShopItemTable extends React.Component<IProps, {}>{
    constructor(props: any) {
        super(props)
        this.searchTagByVoice = this.searchTagByVoice.bind(this)
        this.postAudio = this.postAudio.bind(this)

    }

    public render() {
        return (

            <Button variant="text" className="btn" onClick={this.searchTagByVoice}><Mic/></Button>

        )
    }


    private searchTagByVoice() {
        const mediaConstraints = {
            audio: true
        }
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then((stream: any) => {
                const mediaRecorder = new MediaStreamRecorder(stream);
                mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
                mediaRecorder.ondataavailable = (blob: any) => {
                    this.postAudio(blob);
                    mediaRecorder.stop()
                }
                mediaRecorder.start(3000);
            })
            .catch((e: any) => {
                console.error('media error', e);
            });
    }

    private postAudio(blob: any) {
        let accessToken: any

        fetch("https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken", {
            headers: {
                'Content-Length': '0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': "4eb83ee96b484b67955f983644e40301"
            },
            method: 'POST'
        }).then((response) => {
            // console.log(response.text())
            return response.text()
        }).then((response) => {
            accessToken = response
        }).catch((error) => {
            console.log("Error", error)
        });

        // posting audio
        fetch("https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US", {
            body: blob, // this is a .wav audio file    
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer' + accessToken,
                'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
                'Ocp-Apim-Subscription-Key': "4eb83ee96b484b67955f983644e40301"
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


