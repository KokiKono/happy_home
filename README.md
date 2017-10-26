# happy_home

# set up
<pre>
make install
</pre>

# server run
<pre>
npm start
</pre>

# server run and swagger doc
## mock
<pre>
make mock-run
</pre>
or
<pre>
npm run mock-run
</pre>
## real
<pre>
make real-run
</pre>
or
<pre>
npm run real-run
</pre>
### レスポンス情報を見るとりあえず。
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

- branch名
    your_name/any <- anyは各コードっぽく。

- database
    テストする際はddlを読み込んでください

    
    
