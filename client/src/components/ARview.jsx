import React, { useEffect } from 'react'
import { bootstrapCameraKit } from '@snap/camera-kit'

const ARview = ({lens_id}) => {
    useEffect(() => {
        startCamera();
      }, []);

     
    
      async function startCamera() {
        try {
          const cameraKit = await bootstrapCameraKit({
            apiToken: import.meta.env.VITE_LENS_API,
          });
    
          const liveRenderTarget = document.getElementById('canvas');
          const session = await cameraKit.createSession({
            liveRenderTarget: liveRenderTarget,
          });
    
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user'
            }
          });
    
          await session.setSource(mediaStream);
          await session.play();
    
          const lens = await cameraKit.lensRepository.loadLens(lens_id,import.meta.env.VITE_LENS_GROUP_ID);
          await session.applyLens(lens);
        } catch (error) {
          console.error('Error starting camera:', error);
        }
      }
    
      return (
        <>
        {lens_id ?
                <canvas id="canvas" height={"100%"} width={"100%"}></canvas>
            : <h3 className="text-center text-gray-500">No AR view available</h3>
        }
          
        </>
      )
}

export default ARview
