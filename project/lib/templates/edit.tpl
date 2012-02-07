<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{{title}}</title>
    <link rel="stylesheet" href="/css/markdown.css">
  </head>
  <body>
    <div class="container">
      <form method="POST" action="/wiki/{{id}}/save">
        <label for="title">Title</label>
        <br>
        <input name="title" id="title" value="{{title}}" type="text">
        <br>
        <label for="body">Body</label>
        <br>
        <textarea name="body" id="body" cols="80" rows="10">{{body}}</textarea>
        <br>
        <input type="submit" value="Save">
      </form>
    </div>
  </body>
</html>