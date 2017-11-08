# coding: UTF-8
import cv2
import http.client
import urllib.request
import urllib.parse
import urllib.error
import json
import sys
from datetime import datetime


def emotion(image):
    headers = {
        # Request headers
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': '767397b3036a495ebb4dc6c65cd21338',
    }

    params = urllib.parse.urlencode({
    })

    try:
        conn = http.client.HTTPSConnection('westus.api.cognitive.microsoft.com')
        conn.request("POST", "/emotion/v1.0/recognize?", image, headers)
        response = conn.getresponse()
        data = response.read().decode('utf-8')
        conn.close()
        return data

    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))

argvs = sys.argv
argc = len(argvs)
imagePage = 10;

image_path = '../images/'
if __name__ == "__main__":
    # 顔の認識
    f_cascade = cv2.CascadeClassifier('/usr/local/Cellar/opencv/3.3.1_1/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml')

    # カメラの起動
    cap = cv2.VideoCapture(0)
    # 写真をとる枚数
    if argc > 0:
        imagePage = int(argvs[1])
    
    while(True):

        # 動画ストリームからフレームを取得
        ret, frame = cap.read()

        # 物体認識（顔認識）の実行
        facerect = f_cascade.detectMultiScale(frame, scaleFactor=1.2, minNeighbors=3, minSize=(10, 10))

        # 検出した顔を囲む矩形の作成
        for rect in facerect:
            cv2.rectangle(frame, tuple(rect[0:2]),tuple(rect[0:2] + rect[2:4]), (255, 255, 255), thickness=2)

            text = ''
            font = cv2.FONT_HERSHEY_PLAIN
            cv2.putText(frame,text,(rect[0],rect[1]-10),font, 2, (255, 255, 255), 2, cv2.LINE_AA)

        # 人数によって顔認識start
        if len(facerect) > 0:
            print('顔が認識されました。' + str(len(facerect)) + '人' + str(imagePage))
            color = (255, 255, 255)  # 白
            for rect in facerect:
                # 検出した顔を囲む矩形の作成
                cv2.rectangle(frame, tuple(rect[0:2]),tuple(rect[0:2] + rect[2:4]),
                              color, thickness=2)
            imagePage -= 1
        # 表示
        cv2.imshow("Show FLAME Image", frame)
        now = datetime.now().strftime('%Y-%m-%d:%H:%M:%S')
        # 認識結果の保存
        image_path = '../images/' + now + '-' + str(imagePage) +'.jpg'
        cv2.imwrite(image_path, frame)

        if imagePage == 0:
            break

        # # 10msecキー入力待ち
        # key = cv2.waitKey(10)&0xff
        # if key == ord('q'):  # qキーで終了、pキーで画像保存
        #     break
        # elif key == ord('p'):
        #     if len(facerect) > 0:
        #         # 現在の時間を取得
        #         now = datetime.now().strftime('%Y-%m-%d:%H:%M:%S')
        #         # 認識結果の保存
        #         image_path ='../images/' + now + '.jpg'
        #         cv2.imwrite(image_path, frame)
        #         break

    cap.release()
    cv2.destroyAllWindows()

# if image_path != '':
#     data = open(image_path, 'rb')
#     a = emotion(data)
#     print(a)
#     json_dict = json.loads(a)
#     print(json.dumps(json_dict, sort_keys=True, indent=1))
