import dlib
from skimage import io
import sys

detector = dlib.get_frontal_face_detector()


def extract_features(img_path, trained_model_file):
    predictor = dlib.shape_predictor(trained_model_file)
    img = io.imread(img_path)

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

    return vec

if __name__=='__main__':
    trained_model = sys.argv[1] # shape_predictor_68_face_landmarks.dat'
    test_file = sys.argv[2] # 'donald_trump.jpg'
    print(len(extract_features(test_file, trained_model)))

