# Brain-storming on new applications around the stream of body, hands, face keypoints extracted from MediaPipe

Existing applications:
- video conference reactions (https://support.apple.com/guide/iphone/use-video-conferencing-features-iphaa0b5671d/ios): 8 gestures recognized
- Avatar animation
- online meeting camera focus for signers ("presenter" focus with signing instead of speech; forget which service has this)

Applications:
- gesture-controlled smart home devices (with camera) / computer user interface in general (think "minority report")
- in-car driver monitor and gesture control
- sign language recognition (and communicating with non-signers)


MediaPipe issues to overcome:
- FPS varies from device to device
- incorrectly recognized keypoints between correctly recognized frames (smoothing? would it work well with fast movements?)
- holistic model is in the process of being updated
