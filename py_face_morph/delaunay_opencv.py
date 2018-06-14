#!/usr/bin/python
import cv2
from datetime import datetime

# Check if a point is inside a rectangle
def rect_contains(rect, point):
    if point[0] < rect[0]:
        return False
    elif point[1] < rect[1]:
        return False
    elif point[0] > rect[2]:
        return False
    elif point[1] > rect[3]:
        return False
    return True


# Draw a point
def draw_point(img, p, color):
    cv2.circle(img, p, 2, color, cv2.FILLED, cv2.LINE_AA, 0)


# Draw delaunay triangles
def draw_delaunay(img, subdiv, delaunay_color):

    triangleList = subdiv.getTriangleList()
    size = img.shape
    r = (0, 0, size[1], size[0])

    for t in triangleList:

        pt1 = (t[0], t[1])
        pt2 = (t[2], t[3])
        pt3 = (t[4], t[5])

        if rect_contains(r, pt1) and rect_contains(r, pt2) and rect_contains(r, pt3):

            cv2.line(img, pt1, pt2, delaunay_color, 1, cv2.LINE_AA, 0)
            cv2.line(img, pt2, pt3, delaunay_color, 1, cv2.LINE_AA, 0)
            cv2.line(img, pt3, pt1, delaunay_color, 1, cv2.LINE_AA, 0)


def get_delaunay(points, img_shape, src_img=None, analyse=False):

    # Rectangle to be used with Subdiv2D
    rect = (0, 0, img_shape[1], img_shape[0])

    # Create an instance of Subdiv2D
    subdiv = cv2.Subdiv2D(rect)

    start_time = datetime.now()
    # Insert points into subdiv
    for p in points:
        subdiv.insert(p)
    # running_time = (datetime.now() - start_time).total_seconds()
    # print "OpenCV Algo took", running_time, "seconds"
    # start_time = datetime.now()
    triangles = subdiv.getTriangleList()
    running_time = (datetime.now() - start_time).total_seconds()
    # print "OpenCV Reading triangles took", running_time, "seconds"

    triangle_indices = set()
    for t in triangles:
        pt1 = (int(t[0]), int(t[1]))
        pt2 = (int(t[2]), int(t[3]))
        pt3 = (int(t[4]), int(t[5]))
        if rect_contains(rect, pt1) and rect_contains(rect, pt2) and rect_contains(rect, pt3):
            l = [points.index(pt1), points.index(pt2),
                 points.index(pt3)]
            l.sort()
            triangle_indices.add((l[0], l[1], l[2]))

    if src_img is not None:
        img = src_img
        # Draw delaunay triangles
        draw_delaunay(img, subdiv, (255, 255, 255))

        # Draw points
        for p in points:
            draw_point(img, p, (0, 0, 255))
        return triangle_indices, img, running_time
    if analyse:
        return triangle_indices, running_time
    return triangle_indices

