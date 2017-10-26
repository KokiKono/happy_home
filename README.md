# happy_home

# set up
<pre>
make install
</pre>

# server run
<pre>
npm start
</pre>

# server debug
<pre>
make run-debug
</pre>

# no secure server run
comming soon!

# swagger api doc
- run swagger and mock api
<pre>
make mock-swagger　今調整中。
</pre>
- run swagger and real api  
  実際のAPIをswagger ui上で叩けるようになります。  
  npm start必須
<pre>
make real-swagger
</pre>
- open swagger
<pre>
make open-swagger
</pre>
- レスポンス情報を見るとりあえず。
<pre>
npm i -g swagger
make edit swagger
</pre>

# branch
<pre>
your_name/any
</pre>

# commit 必ず読んでね。
- eslint（コードスタイル）
    コミットする前にeslintに通してください。
    eslintはairbnbガイドラインに沿っておりes6記法でjsを書いてください。
    eslintチェックコマンド
<pre>
make lint
</pre>
*npm eslintコマンドをグローバルにインストールしていない場合は以下を実行してください。
<pre>
npm i -g eslint
</pre>

- branch名
    your_name/any <- anyは各コードっぽく。

- database
    テストする際はddlを読み込んでください

    
    
