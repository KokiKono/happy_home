<?php
    /* コンソールログにphpのlogを出力する */
    include './chromePhp.php';

    session_start();

    if(!isset($_SESSION['count'])){
        $_SESSION['count'] = 0;
    }

    /* 画像のアップロード */
    if($_SESSION['count'] < 10){
        if (is_uploaded_file($_FILES["img"]["tmp_name"])) {
            if (move_uploaded_file($_FILES["img"]["tmp_name"], './img/'.date( "Ymd-His").'.png')) {
                $_SESSION['count']++;
            }
        }
    }else{
        $_SESSION = array();
        session_destroy();
    }

    echo $_SESSION['count'];
?>