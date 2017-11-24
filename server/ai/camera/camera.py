# coding: UTF-8
import cv2
import sys
from datetime import datetime

argvs = sys.argv
argc = len(argvs)
imagePage = 10;

cv2.namedWindow("Show FLAME Image", cv2.WINDOW_NORMAL)

image_path = './images/'
isTake = False
drawText = 'Waiting...'

if __name__ == "__main__":
    # 顔の認識
    f_cascade = cv2.CascadeClassifier('/usr/local/Cellar/opencv/3.3.1_1/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml')
    # カメラの起動
    cap = cv2.VideoCapture(0)
    # 写真をとる枚数
    if argc > 0:
        imagePage = int(argvs[1])
        print(argvs[2])
        image_path = argvs[2]
    while(True):

        # 動画ストリームからフレームを取得
        ret, frame = cap.read()
        saveRet, saveFrame = cap.read()
        # 物体認識（顔認識）の実行
        facerect = f_cascade.detectMultiScale(frame, scaleFactor=1.2, minNeighbors=3, minSize=(10, 10))

        height = frame.shape[0]

        # 検出した顔を囲む矩形の作成
        for rect in facerect:
            cv2.rectangle(frame, tuple(rect[0:2]),tuple(rect[0:2] + rect[2:4]), (255, 255, 255), thickness=2)

            text = ''
            font = cv2.FONT_HERSHEY_PLAIN
            cv2.putText(frame,text,(rect[0],rect[1]-10),font, 2, (255, 255, 255), 2, cv2.LINE_AA)

        # 人数によって顔認識start
        if len(facerect) > 0:
            color = (255, 255, 255)  # 白
            for rect in facerect:
                # 検出した顔を囲む矩形の作成
                cv2.rectangle(frame, tuple(rect[0:2]),tuple(rect[0:2] + rect[2:4]),
                              color, thickness=2)
            if (isTake):
                print('顔が認識されました。' + str(len(facerect)) + '人' + 'あと' + str(imagePage) + '枚')
                drawText = 'A face was recognized. ' + str(len(facerect)) + 'people. ' + str(imagePage) + 'more.'
                imagePage -= 1
        cv2.putText(frame, drawText, (0, height), cv2.FONT_HERSHEY_PLAIN, 2, (0, 0, 255), 2, cv2.LINE_AA)
        # 表示
        cv2.imshow("Show FLAME Image", frame)

        # 認識結果の保存
        if (isTake):
            now = datetime.now().strftime('%Y-%m-%d:%H:%M:%S')
            cv2.imwrite(image_path + now + '-' + str(imagePage) +'.jpg', saveFrame)

        if imagePage == 0:
            print ('顔保存を終了します。')
            drawText = '顔保存を終了します。'
            isTake = False
            imagePage = int(argvs[1])

        # 1msecキー入力待ち
        key = cv2.waitKey(1)

        if key == ord('q'):  # qキーで終了、pキーで画像保存
            print ('プログラムを終了します。')
            break
        if key == ord('t'):
            print('撮影を開始します。')
            drawText = 'start take picture'
            isTake = True
    cap.release()
    cv2.destroyAllWindows()
