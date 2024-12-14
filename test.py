import cv2

# Open a connection to the webcam (usually index 0 for built-in webcam, 1 for external webcam)
cap = cv2.VideoCapture(2)  # Adjust the index if your phone is not the first camera

if not cap.isOpened():
    print("Error: Could not open video capture.")
    exit()

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    
    if not ret:
        print("Error: Failed to capture image.")
        break
    
    # Display the resulting frame
    cv2.imshow('Phone Camera Input', frame)
    
    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything is done, release the capture and close any open windows
cap.release()
cv2.destroyAllWindows()
