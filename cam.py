from flask import Flask, Response
import cv2

app = Flask(__name__)

# Initialize the video capture object with the DroidCam source
# Replace the 'http://your_phone_ip:4747/video' with your actual DroidCam URL
cap = cv2.VideoCapture(1)

def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
