import React from 'react'
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const page = () => {
    const {roomId} = useParams();
    const mymeeting = async (element: HTMLDivElement) => {
        const appID = 805247561;
        const serverSecret = "3db857b5a90456c39b1b0e868526ad75"; 
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId!, Date.now().toString(), "Enter your name");
        const zc = ZegoUIKitPrebuilt.create(kitToken);
        zc.joinRoom({
            container: element,
            sharedLinks:[{
                name:"copy link",
                url:`http://localhost:5173/videocallroom/${roomId}`
            }  ],
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
            showScreenSharingButton : true,
        });
    };

  return (
    <div>
        <div ref={(element) => element && mymeeting(element)} />
    </div>
  )
}

export default page