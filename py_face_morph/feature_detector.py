import dlib
# from skimage import io
import sys
import cv2

detector = dlib.get_frontal_face_detector()


def crop_image(img_path, face_cascade_algo='haarcascade_frontalface_default.xml'):
    faceCascade = cv2.CascadeClassifier(face_cascade_algo)
    # Read the image
    image = cv2.imread(img_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
        flags = cv2.CASCADE_SCALE_IMAGE
    )

    if len(faces) == 0:
        print('No faces found.')
        return []

    height, width = image.shape[:2]

    max_h = 0 
    max_y = 0
    max_x = 0
    max_w = 0
    for (x, y, w, h) in faces:
        if max_w * max_h < w * h:
            max_y = y
            max_x = x
            max_w = w
            max_h = h
    (x, y, w, h) = (max_x, max_y, max_w, max_h)
    # print(x, y, w, h)

    left_padding = int(w / 2)
    right_padding = int(h / 2)

    while x < left_padding or y < left_padding:
        left_padding -= 1

    x -= left_padding
    y -= left_padding
    
    while w > width - x - right_padding or h > height - y - right_padding:
        right_padding -= 1
    
    w += right_padding
    h += right_padding
    
    # print(x, y, w, h)

    # cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)

    # # # print(x, y, w, h)

    # cv2.imshow("Faces found", image)
    # cv2.waitKey(0)

    # img = io.imread(img_path)
    img = image[y:y+h, x:x+w]
    return cv2.resize(img, (600, 600)) 


def extract_features(img_path, trained_model_file):

    img = crop_image(img_path)
    predictor = dlib.shape_predictor(trained_model_file)

    # Ask the detector to find the bounding boxes of each face. The 1 in the
    # second argument indicates that we should upsample the image 1 time. This
    # will make everything bigger and allow us to detect more faces.
    dets = detector(img, 1)
    for k, d in enumerate(dets):
        shape = predictor(img, d)

    vec = [(0, 0), (0, img.shape[0]-1)]

    for j in range(0, 68):
        vec.append((shape.part(j).x, shape.part(j).y))
    vec.append((img.shape[1]-1, 0))
    vec.append((img.shape[1]-1, img.shape[0]-1))

    return vec, img

if __name__=='__main__':
    trained_model = sys.argv[1] # shape_predictor_68_face_landmarks.dat'
    test_file = sys.argv[2] # 'donald_trump.jpg'
    print(len(extract_features(test_file, trained_model)[0]))

